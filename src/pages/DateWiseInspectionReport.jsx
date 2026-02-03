import React, { useEffect, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [hasFetched, setHasFetched] = useState(false);
const [loading, setLoading] = useState(false);


  /* ======================================
     FETCH REPORT
  ====================================== */

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Select from & to dates");
      return;
    }

    setLoading(true);
    setHasFetched(false);

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

    setLoading(false);
    setHasFetched(true);

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

      getFilteredVisits(day.visits).forEach(visit => {

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


  const getFilteredVisits = visits => {
  if (statusFilter === "ALL") return visits;

  return visits.filter(v => v.VisitStatus === statusFilter);
};

 

  const filteredDays = dates
  .map(day => {
    const filteredVisits = getFilteredVisits(day.visits);
    return { ...day, filteredVisits };
  })
  .filter(day => day.filteredVisits.length > 0);


  useEffect(() => {

    if(!fromDate && !toDate) return;

    fetchReport();
    setStatusFilter('ALL')

  },[fromDate,toDate])


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

      <div className="row g-3 pt-3">

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

        <div className="col-sm-3">
  <label>Filter by Status</label>
  <select
    className="form-select"
    value={statusFilter}
    onChange={e => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All</option>
    <option value="VISITED">Visited</option>
    <option value="NOT_VISITED">Not Visited</option>
    <option value="CANNOT_VISIT">Cannot Visit</option>
    <option value="EXTRA_VISIT">Extra / Additional Visit</option>
    <option value="PLANNED">Planned</option>
  </select>
</div>


        {/* <div className="col-sm-12 text-center">
          <button className="btn btn-primary mt-3" onClick={fetchReport}>
            Fetch
          </button>
        </div> */}

      </div>

      <hr />

      {loading && (
  <div className="text-center mt-4">
    <span className="spinner-border spinner-border-sm me-2" />
    Fetching report...
  </div>
)}


      {hasFetched && !loading && filteredDays.length === 0 && (
  <div className="text-center text-muted mt-4">
    No visits found for the selected date range & status
  </div>
)}


{filteredDays.map((day, i) => (
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
        {day.filteredVisits.map((v, idx) => (
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
