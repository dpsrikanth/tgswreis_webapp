import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";
import { notify } from "../services/notify";
import { useNavigate } from "react-router-dom";

const NotVisitedInspections = () => {

  const token = useSelector(state => state.userappdetails.TOKEN);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const formattedDate = yesterday.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

  /* ===========================
      FETCH DATA
  =========================== */

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await _fetch(
        "yesnotvisitedinspections",
        {},
        false,
        token
      );

      if (res.status === "success") {
        setRows(res.data);
      } else {
        setRows([]);
      }

    } catch (err) {
      console.error("Failed to load data");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===========================
      EXCEL EXPORT
  =========================== */

  const exportExcel = async () => {

    if (!rows.length) {
      notify.warning("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Not Visited Inspections");

    const border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    };

    sheet.mergeCells("A1:J1");
    sheet.getCell("A1").value =
      `Yesterday (${formattedDate})  – Not Visited Inspections`;
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([]);

    const headers = [
      "S.No",
      "Officer Name",
      "Designation",
      "Region",
      "School Name",
      "School Code",
      "Remarks"
    ];

    const headerRow = sheet.addRow(headers);

    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.border = border;
      cell.alignment = { horizontal: "center" };
    });

    rows.forEach((row, index) => {

      const excelRow = sheet.addRow([
        index + 1,
        row.OfficerName,
        row.RoleDisplayName,
        row.Region,
        row.PartnerName?.replace("TGSWREIS", ""),
        row.SchoolCode,
        row.NotVisitedRemarks || ""
      ]);

      excelRow.eachCell(cell => {
        cell.border = border;
        cell.font = { color: { argb: "FF0000" } };
      });

    });

    sheet.columns.forEach(col => col.width = 25);

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      `NotVisitedInspections_${format(new Date(), "dd-MM-yyyy")}.xlsx`
    );
  };

  /* ===========================
      UI
  =========================== */





  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5 className="chart-title">
          Yesterday ({formattedDate}) – Not Visited Inspections
        </h5>

        <button
          className="btn btn-success"
          onClick={exportExcel}
        >
          Export Excel
        </button>
         <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>
      </div>

      <div className="table-responsive mt-3">

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Officer</th>
              <th>Designation</th>
              <th>Region</th>
              <th>School</th>
              <th>School Code</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {rows.length ? (
              rows.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.OfficerName}</td>
                  <td>{r.RoleDisplayName}</td>
                  <td>{r.Region}</td>
                  <td>{r.PartnerName?.replace("TGSWREIS", "")}</td>
                  <td>{r.SchoolCode}</td>
                  <td>{r.NotVisitedRemarks || "Awaiting Remarks"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  {loading ? "Loading..." : "No records found"}
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default NotVisitedInspections;
