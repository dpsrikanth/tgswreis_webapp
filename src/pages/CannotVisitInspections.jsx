import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";

const CannotVisitInspections = () => {

  const token = useSelector(state => state.userappdetails.TOKEN);

  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const res = await _fetch(
        "todaycannotvisitinspections",
        {},
        false,
        token
      );

      if (res.status === "success") {
        setRows(res.data);
      } else {
        setRows([]);
      }

    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===========================
      EXCEL EXPORT
  =========================== */

  const exportExcel = async () => {

    if (!rows.length) {
      toast.warning("No data available");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Cannot Visit");

    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" }
    };

    ws.mergeCells("A1:J1");
    ws.getCell("A1").value = "Today – Cannot Visit Inspections";
    ws.getCell("A1").font = { bold: true, size: 14 };
    ws.getCell("A1").alignment = { horizontal: "center" };

    ws.addRow([]);

    const headers = [
      "S.No",
      "Officer Name",
      "Designation",
      "Region",
      "School",
      "School Code",
      "Visit Date",
      "Status",
      "Remarks"
    ];

    const headerRow = ws.addRow(headers);

    headerRow.eachCell(c => {
      c.font = { bold: true };
      c.border = border;
      c.alignment = { horizontal: "center" };
    });

    rows.forEach((r, i) => {

      const row = ws.addRow([
        i + 1,
        r.OfficerName,
        r.RoleDisplayName,
        r.Region,
        r.PartnerName?.replace("TGSWREIS", ""),
        r.SchoolCode,
        format(new Date(r.DateOfVisit), "dd-MMM-yyyy"),
        "CANNOT VISIT",
        r.NotVisitedRemarks || ""
      ]);

      row.eachCell(cell => {
        cell.border = border;
        cell.font = { color: { argb: "FF6B6B" } };
      });
    });

    ws.columns.forEach(c => c.width = 25);

    const buffer = await wb.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `CannotVisitInspections_${format(new Date(), "dd-MM-yyyy")}.xlsx`
    );
  };

  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5 className="chart-title">
          Today – Cannot Visit Inspections
        </h5>

        <button
          className="btn btn-danger"
          onClick={exportExcel}
        >
          Export Excel
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Officer</th>
            <th>Designation</th>
            <th>Region</th>
            <th>School</th>
            <th>School Code</th>
            <th>Date</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {rows.length ? rows.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.OfficerName}</td>
              <td>{r.RoleDisplayName}</td>
              <td>{r.Region}</td>
              <td>{r.PartnerName?.replace("TGSWREIS", "")}</td>
              <td>{r.SchoolCode}</td>
              <td>{format(new Date(r.DateOfVisit), "dd-MMM-yyyy")}</td>
              <td>
                <span className="badge bg-secondary">
                  Cannot Visit
                </span>
              </td>
              <td>{r.NotVisitedRemarks || "-"}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default CannotVisitInspections;
