import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../services/notify";

const SchoolWiseVisitAbstract = () => {

  const token = useSelector(s => s.userappdetails.TOKEN);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [abstract, setAbstract] = useState(null);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  /* =====================================
     FETCH DATA
  ===================================== */

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      notify.warning("Select From & To date");
      return;
    }

    const res = await _fetch(
      "schoolvisitabstract",
      { fromDate, toDate },
      false,
      token
    );

    if (res.status === "success") {
      setAbstract(res.abstract);
      setSchools(res.schools);
    } else {
      notify.error("No data found");
    }
  };

  /* =====================================
     EXCEL EXPORT
  ===================================== */

  const exportExcel = async () => {

    if (!schools.length) {
      notify.warning("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    /* =======================
       SHEET 1 — ABSTRACT
    ======================= */

    const summarySheet = workbook.addWorksheet("Abstract");

    summarySheet.mergeCells("A1:D1");
    summarySheet.getCell("A1").value = "TGSWREIS — School Visit Abstract";
    summarySheet.getCell("A1").font = { bold: true, size: 16 };
    summarySheet.getCell("A1").alignment = { horizontal: "center" };

    summarySheet.mergeCells("A2:D2");
    summarySheet.getCell("A2").value =
      `Period : ${fromDate} to ${toDate}`;
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    summarySheet.addRow([]);

    summarySheet.addRow(["Schools Visited", abstract.SchoolsVisited]);
    summarySheet.addRow(["Schools Not Visited", abstract.SchoolsNotVisited]);
    summarySheet.addRow(["Total Planned Visits", abstract.TotalVisits]);

    summarySheet.columns.forEach(c => (c.width = 30));

    /* =======================
       SHEET 2 — SCHOOL LIST
    ======================= */

    const sheet = workbook.addWorksheet("School Wise Details");

    const header = sheet.addRow([
      "S.No",
      "School Name",
      "District",
      "Zone",
      "Total Planned Visits",
      "Completed Visits",
      "NotVisited",
      "CannotVisit",
      "Visit Status"
    ]);

    header.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E1F2" }
      };
    });

    schools.forEach((row, index) => {

      const excelRow = sheet.addRow([
        index + 1,
        row.SchoolName?.replace("TGSWREIS", ""),
        row.DistrictName,
        row.ZoneName,
        row.TotalVisits,
        row.CompletedVisits,
        row.NotVisited,
        row.CannotVisit,
        row.VisitStatus
      ]);

      excelRow.eachCell(cell => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
      });

      // ✅ COLOR RULES
      if (row.VisitStatus === "VISITED") {
        excelRow.eachCell(c => {
          c.font = { color: { argb: "008000" } };
        });
      } else {
        excelRow.eachCell(c => {
          c.font = { color: { argb: "FF0000" } };
        });
      }
    });

    sheet.columns.forEach(c => (c.width = 28));

    /* =======================
       EXPORT
    ======================= */

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      `SchoolWise_Abstract_${fromDate}_${toDate}.xlsx`
    );
  };

  /* =====================================
     UI
  ===================================== */

  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5>School Wise Visit Abstract</h5>
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
          <button
            className="btn btn-primary mt-3"
            onClick={fetchReport}
          >
            Fetch
          </button>
        </div>

      </div>

      {abstract && (
        <>
          <hr />

          <div className="row text-center fw-bold">
            <div className="col">
              Schools Visited :
              <span className="text-success ms-2">
                {abstract.SchoolsVisited}
              </span>
            </div>

            <div className="col">
              Schools Not Visited :
              <span className="text-danger ms-2">
                {abstract.SchoolsNotVisited}
              </span>
            </div>

            <div className="col">
              Total Planned Visits :
              <span className="text-primary ms-2">
                {abstract.TotalVisits}
              </span>
            </div>
          </div>

          <hr />

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>School</th>
                <th>District</th>
                <th>Zone</th>
                <th>Total Planned</th>
                <th>Completed</th>
                <th>Not Visited</th>
                <th>Cannot Visit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{s.SchoolName}</td>
                  <td>{s.DistrictName}</td>
                  <td>{s.ZoneName}</td>
                  <td>{s.TotalVisits}</td>
                  <td>{s.CompletedVisits}</td>
                  <td>{s.NotVisited}</td>
                  <td>{s.CannotVisit}</td>
                  <td>
                    <span
                      className={
                        s.VisitStatus === "VISITED"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >
                      {s.VisitStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </div>
  );
};

export default SchoolWiseVisitAbstract;
