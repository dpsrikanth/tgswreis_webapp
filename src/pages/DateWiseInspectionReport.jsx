import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { _fetch } from "../libs/utils";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DateWiseInspectionReport = () => {

  const token = useSelector(s => s.userappdetails.TOKEN);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  /* ======================================
     FETCH REPORT
  ====================================== */

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Select from & to dates");
      return;
    }

    const payload = {
      fromDate,
      toDate
    };

    const res = await _fetch(
      "datewisetourreport",
      payload,
      false,
      token
    );

    if (res.status === "success") {
      setDates(res.data);
    } else {
      toast.error("No data found");
    }
  };

  /* ======================================
     STATUS BADGE
  ====================================== */

  const getBadge = status => {
    switch (status) {
      case 3:
        return "badge bg-success";
      case 4:
        return "badge bg-danger";
      case 5:
        return "badge bg-secondary";
      default:
        return "badge bg-warning text-dark";
    }
  };

  /* ======================================
     EXCEL EXPORT
  ====================================== */

  const exportExcel = async () => {

    if (!dates.length) {
      toast.warning("No data to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Date Wise Inspection Report");

    const border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };

    /* ================= HEADER ================= */

    sheet.mergeCells("A1:H1");
    sheet.getCell("A1").value = "TGSWREIS INSTITUTIONS";
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.mergeCells("A2:H2");
    sheet.getCell("A2").value =
      `Date Wise Inspection Report from ${fromDate} to ${toDate}`;
    sheet.getCell("A2").font = { bold: true };
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.addRow([]);

    const header = sheet.addRow([
      "S.No",
      "Date",
      "Officer Name",
      "Designation",
      "District",
      "Institution",
      "Type",
      "Visit Report"
    ]);

    header.eachCell(c => {
      c.font = { bold: true };
      c.border = border;
      c.alignment = { horizontal: "center" };
    });

    /* ================= DATA ================= */

    let sno = 1;

    dates.forEach(day => {

      day.visits.forEach(visit => {

        const row = sheet.addRow([
          sno++,
          format(new Date(day.VisitDate), "dd-MMM-yyyy"),
          visit.OfficerName,
          visit.Designation,
          visit.DistrictName,
          visit.InstitutionName?.replace("TGSWREIS", ""),
          visit.TypeOfSchool,
          visit.ReportPDF || ""
        ]);

        row.eachCell(c => {
          c.border = border;
          c.alignment = { vertical: "middle" };
        });

        // COLORS
        if (visit.IsAdditionalVisit === 1) {
          row.eachCell(c => {
            c.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "DDEBF7" }
            };
          });
        }

        if (visit.Status === 3) {
          row.eachCell(c => {
            c.font = { color: { argb: "008000" } };
          });
        }

        if (visit.Status === 4) {
          row.eachCell(c => {
            c.font = { color: { argb: "FF0000" } };
          });
        }

      });

    });

    sheet.columns.forEach(c => (c.width = 25));

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      `DateWise_InspectionReport_${fromDate}_${toDate}.xlsx`
    );
  };

  /* ======================================
     UI
  ====================================== */

  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5>Date Wise Inspection Report</h5>
        <button className="btn btn-success" onClick={exportExcel}>
          Excel Report
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>
      </div>

      <div className="row g-3">

        <div className="col-sm-3">
          <label>From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-sm-3">
          <label>To Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            min={fromDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>

        <div className="col-sm-12 text-center">
          <button className="btn btn-primary mt-3" onClick={fetchReport}>
            Fetch
          </button>
        </div>

      </div>

      <hr />

      {dates.map((day, i) => (
        <div key={i} className="mb-4">

          <h6 className="fw-bold text-primary">
            {format(new Date(day.VisitDate), "dd MMM yyyy")}
          </h6>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Officer</th>
                <th>Designation</th>
                <th>School</th>
                <th>District</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {day.visits.map((v, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{v.OfficerName}</td>
                  <td>{v.Designation}</td>
                  <td>{v.InstitutionName}</td>
                  <td>{v.DistrictName}</td>
                  <td>{v.TypeOfSchool}</td>
                  <td>
                    <span className={getBadge(v.VisitStatus)}>
                      {v.VisitStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

    </div>
  );
};

export default DateWiseInspectionReport;
