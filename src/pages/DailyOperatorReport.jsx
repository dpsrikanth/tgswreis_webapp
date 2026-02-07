import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const DailyOperatorReport = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);

  const [regularSummary, setRegularSummary] = useState(null);
  const [additionalSummary, setAdditionalSummary] = useState(null);
  const [regularExceptions, setRegularExceptions] = useState([]);
  const [additionalExceptions, setAdditionalExceptions] = useState([]);

  // ==========================
  // STATUS UI HELPERS
  // ==========================
  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return { label: "Pending", badge: "badge bg-warning text-dark" };
      case 3:
        return { label: "Completed", badge: "badge bg-success" };
      case 4:
        return { label: "Not Visited", badge: "badge bg-danger" };
      case 5:
        return { label: "Cannot Visit", badge: "badge bg-secondary" };
      default:
        return { label: "Unknown", badge: "badge bg-dark" };
    }
  };

  // ==========================
  // FETCH API
  // ==========================
  const fetchDailyReport = async () => {
    try {
      setLoading(true);

      const payload = {Date:selectedDate}

      const res = await _fetch('dailyoperatorreport', payload, false, token);

      if (res.status === "success") {
        setRegularSummary(res.regularSummary || null);
        setAdditionalSummary(res.additionalSummary || null);
        setRegularExceptions(res.regularExceptions || []);
        setAdditionalExceptions(res.additionalExceptions || []);
      } else {
        toast.error(res.message || "Failed to fetch report");
        setRegularSummary(null);
        setAdditionalSummary(null);
        setRegularExceptions([]);
        setAdditionalExceptions([]);
      }
    } catch (error) {
      console.error("Error fetching daily report", error);
      toast.error("Error fetching report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
    
  }, [selectedDate]);

  // ==========================
  // EXPORT EXCEL
  // ==========================
  const exportExcel = async () => {
    if (!regularSummary && !additionalSummary) {
      toast.warning("No data available to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    // ==========================
    // SHEET 1: SUMMARY
    // ==========================
    const sheet1 = workbook.addWorksheet("Summary");

    sheet1.mergeCells("A1:F1");
    sheet1.getCell("A1").value = `Daily Operator Report (${format(
      new Date(selectedDate),
      "dd MMM yyyy"
    )})`;
    sheet1.getCell("A1").font = { size: 14, bold: true };
    sheet1.getCell("A1").alignment = { horizontal: "center" };

    sheet1.addRow([]);

    // Regular Summary
    sheet1.addRow(["REGULAR VISITS"]);
    sheet1.getRow(sheet1.lastRow.number).font = { bold: true };

    sheet1.addRow(["Total", "Completed", "Pending", "Not Visited", "Cannot Visit"]);

    sheet1.addRow([
      regularSummary?.Total || 0,
      regularSummary?.Completed || 0,
      regularSummary?.Pending || 0,
      regularSummary?.NotVisited || 0,
      regularSummary?.CannotVisit || 0,
    ]);

    sheet1.addRow([]);

    // Additional Summary
    sheet1.addRow(["ADDITIONAL VISITS"]);
    sheet1.getRow(sheet1.lastRow.number).font = { bold: true };

    sheet1.addRow(["Total", "Completed", "Pending", "Not Visited", "Cannot Visit"]);

    sheet1.addRow([
      additionalSummary?.Total || 0,
      additionalSummary?.Completed || 0,
      additionalSummary?.Pending || 0,
      additionalSummary?.NotVisited || 0,
      additionalSummary?.CannotVisit || 0,
    ]);

    sheet1.columns = [
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // ==========================
    // SHEET 2: EXCEPTIONS
    // ==========================
    const sheet2 = workbook.addWorksheet("Exceptions");

    sheet2.mergeCells("A1:I1");
    sheet2.getCell("A1").value = `Exceptions Report (${format(
      new Date(selectedDate),
      "dd MMM yyyy"
    )})`;
    sheet2.getCell("A1").font = { size: 14, bold: true };
    sheet2.getCell("A1").alignment = { horizontal: "center" };

    sheet2.addRow([]);

    const exceptionHeaders = [
      "Type",
      "Visit Date",
      "Officer Name",
      "Designation",
      "Region",
      "School Name",
      "School Code",
      "Status",
      "Cannot Visit Reason",
      "Cannot Visit Remarks",
      "Not Visited Remarks"
    ];

    sheet2.addRow(exceptionHeaders);

    sheet2.getRow(3).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    const pushExceptionRow = (row, type) => {
      const statusObj = getStatusBadge(row.Status);

      sheet2.addRow([
        type,
        row.VisitDate,
        row.OfficerName,
        row.RoleDisplayName,
        row.Region,
        (row.PartnerName || "").replace("TGSWREIS", ""),
        row.SchoolCode,
        statusObj.label,
        row.Status === 5 ? (row.CannotVisitReason || "-") : "-",
  row.Status === 5 ? (row.CannotVisitRemarks || "-") : "-",
  row.Status === 4 ? (row.NotVisitedRemarks || "-") : "-"
      ]);
    };

    regularExceptions.forEach((x) => pushExceptionRow(x, "Regular"));
    additionalExceptions.forEach((x) => pushExceptionRow(x, "Additional"));

    sheet2.columns = [
      { width: 12 },
      { width: 14 },
      { width: 22 },
      { width: 25 },
      { width: 18 },
      { width: 30 },
      { width: 14 },
      { width: 14 },
      { width: 40 },
      { width: 40 },
      { width: 40 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `Daily_Operator_Report_${format(new Date(selectedDate), "dd-MM-yyyy")}.xlsx`
    );
  };

  // ==========================
  // CARD COMPONENT
  // ==========================
  const StatCard = ({ title, value, className }) => {
    return (
      <div className="col-sm-6 col-md-4 col-lg-2 mb-2">
        <div className={`white-box shadow-sm border p-2 ${className || ""}`}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
        </div>
      </div>
    );
  };

  // ==========================
  // TABLE COMPONENT
  // ==========================
  const ExceptionsTable = ({ title, rows }) => {
    return (
      <div className="white-box shadow-sm border mt-2">
        <div className="table-header mb-2 d-flex justify-content-between align-items-center">
          <h6 className="chart-title mb-0">{title}</h6>
          <span className="badge bg-dark">{rows.length}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Visit Date</th>
                <th>Officer</th>
                <th>Designation</th>
                <th>Region</th>
                <th>School</th>
                <th>Code</th>
                <th>Status</th>
                <th>Cannot Visit Reason</th>
                <th>Cannot Visit Remarks</th>
                <th>Not Visited Remarks</th>
              </tr>
            </thead>

            <tbody>
              {rows.length > 0 ? (
                rows.map((item, index) => {
                  const statusObj = getStatusBadge(item.Status);
                  const remarksMissing =
                    item.Status === 4 || item.Status === 5
                      ? !item.Remarks || item.Remarks.trim() === ""
                      : false;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.VisitDate}</td>
                      <td>{item.OfficerName}</td>
                      <td>{item.RoleDisplayName}</td>
                      <td>{item.Region}</td>
                      <td>{(item.PartnerName || "").replace("TGSWREIS", "")}</td>
                      <td>{item.SchoolCode}</td>
                      <td>
                        <span className={statusObj.badge}>{statusObj.label}</span>
                      </td>
                      <td>
  {item.Status === 5 ? (item.CannotVisitReason || "-") : "-"}
</td>

{/* Cannot Visit Remarks */}
<td>
  {item.Status === 5 ? (item.CannotVisitRemarks || "-") : "-"}
</td>

{/* Not Visited Remarks */}
<td>
  {item.Status === 4 ? (item.NotVisitedRemarks || "-") : "-"}
</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">
                    No Exceptions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="white-box shadow-sm">
          <div className="table-header mb-2 d-flex justify-content-between align-items-center">
            <h5 className="chart-title mb-0">Daily Operator Report</h5>

            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/tourdiarydashboard")}
              >
                Back
              </button>

              <button
                className="btn btn-success btn-sm"
                onClick={exportExcel}
                disabled={loading}
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* DATE PICKER */}
          <div className="row mb-2">
            <div className="col-sm-3">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

             {loading && (
  <div className="text-center mt-4">
    <span className="spinner-border spinner-border-sm me-2" />
    Fetching report...
  </div>
)}
          </div>

          {/* ==========================
              REGULAR VISITS
          ========================== */}
          <div className="mt-3">
            <h6 className="mb-2">
              Regular Visits{" "}
              <span className="badge bg-primary">
                {regularSummary?.Total || 0}
              </span>
            </h6>

            <div className="row">
              <StatCard title="Total" value={regularSummary?.Total || 0} />
              <StatCard title="Completed" value={regularSummary?.Completed || 0} />
              <StatCard title="Pending" value={regularSummary?.Pending || 0} />
              <StatCard title="Not Visited" value={regularSummary?.NotVisited || 0} />
              <StatCard title="Cannot Visit" value={regularSummary?.CannotVisit || 0} />
            </div>

            <ExceptionsTable
              title="Regular Exceptions (Pending + Not Visited + Cannot Visit)"
              rows={regularExceptions}
            />
          </div>

          {/* ==========================
              ADDITIONAL VISITS
          ========================== */}
          <div className="mt-4">
            <h6 className="mb-2">
              Additional Visits{" "}
              <span className="badge bg-info text-dark">
                {additionalSummary?.Total || 0}
              </span>
            </h6>

            <div className="row">
              <StatCard title="Total" value={additionalSummary?.Total || 0} />
              <StatCard title="Completed" value={additionalSummary?.Completed || 0} />
              <StatCard title="Pending" value={additionalSummary?.Pending || 0} />
              <StatCard title="Not Visited" value={additionalSummary?.NotVisited || 0} />
              <StatCard title="Cannot Visit" value={additionalSummary?.CannotVisit || 0} />
            </div>

            <ExceptionsTable
              title="Additional Exceptions (Pending + Not Visited + Cannot Visit)"
              rows={additionalExceptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyOperatorReport;
