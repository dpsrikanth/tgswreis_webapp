import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";

const AdditionalInspections = () => {

  const token = useSelector(state => state.userappdetails.TOKEN);

  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const res = await _fetch(
        "todayadditionalinspections",
        {},
        false,
        token
      );

      if (res.status === "success") {
        setRows(res.data);
      }
    } catch {
      toast.error("Failed to fetch additional inspections");
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
    const ws = wb.addWorksheet("Additional Visits");

    ws.mergeCells("A1:I1");
    ws.getCell("A1").value = "Today – Additional Inspections";
    ws.getCell("A1").font = { bold: true, size: 14 };
    ws.getCell("A1").alignment = { horizontal: "center" };

    ws.addRow([]);

    const headers = [
      "S.No",
      "Officer",
      "Designation",
      "Region",
      "School",
      "School Code",
      "Visit Date",
      "Visit Type"
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
        r.SchoolCode,
        format(new Date(r.DateOfVisit), "dd-MMM-yyyy"),
        "ADDITIONAL VISIT"
      ]);
    });

    ws.columns.forEach(c => c.width = 25);

    const buffer = await wb.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `AdditionalInspections_${format(new Date(), "dd-MM-yyyy")}.xlsx`
    );
  };

  return (
    <div className="white-box shadow-sm">

      <div className="table-header">
        <h5 className="chart-title">
          Today – Additional Inspections
        </h5>

        <button
          className="btn btn-primary"
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
            <th>Visit Type</th>
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
                <span className="badge bg-info">
                  Additional
                </span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="text-center">
                No additional visits today
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default AdditionalInspections;
