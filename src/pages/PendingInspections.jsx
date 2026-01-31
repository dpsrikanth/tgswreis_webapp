import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const PendingInspections = () => {

  const token = useSelector(state => state.userappdetails.TOKEN);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const today = new Date();

  const formattedToday = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const fetchData = async () => {
    try {
      const res = await _fetch(
        "todaypendinginspections",
        {},
        false,
        token
      );

      if (res.status === "success") {
        setRows(res.data);
      }
    } catch {
      toast.error("Failed to fetch pending inspections");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportExcel = async () => {

    if (!rows.length) {
      toast.warning("No data available");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Pending Inspections");

    ws.mergeCells("A1:I1");
    ws.getCell("A1").value =
      `Today (${formattedToday}) – Pending Inspections`;

    ws.getCell("A1").font = { bold: true, size: 14 };
    ws.getCell("A1").alignment = { horizontal: "center" };

    ws.addRow([]);

    const headers = [
      "S.No",
      "Officer",
      "Designation",
      "Region",
      "School",
      "School Code"
    ];

    ws.addRow(headers).eachCell(c => {
      c.font = { bold: true };
      c.alignment = { horizontal: "center" };
    });

    rows.forEach((r, i) => {
      ws.addRow([
        i + 1,
        r.OfficerName,
        r.RoleDisplayName,
        r.Region,
        r.PartnerName?.replace("TGSWREIS", ""),
        r.SchoolCode
      ]);
    });

    ws.columns.forEach(c => (c.width = 25));

    const buffer = await wb.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `PendingInspections_${format(new Date(), "dd-MM-yyyy")}.xlsx`
    );
  };

  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5 className="chart-title">
          Today ({formattedToday}) – Pending Inspections
        </h5>

        <button className="btn btn-warning" onClick={exportExcel}>
          Export Excel
        </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
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
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center">
                No pending inspections today
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default PendingInspections;
