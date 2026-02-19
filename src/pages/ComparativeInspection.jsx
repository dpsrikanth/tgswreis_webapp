import React, { useEffect, useState } from "react";
import { _fetch } from "../libs/utils";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


const ComparativeInspection = () => {

  const token = useSelector(s => s.userappdetails.TOKEN);
  const schoolsMaster = useSelector(s => s.userappdetails.SCHOOL_LIST);

  const [questions, setQuestions] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const [section, setSection] = useState("");
  const [questionId, setQuestionId] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedSchools,setSelectedSchools] = useState([]);

  const allOption = {value: 'ALL', label: 'All Schools'}

  const schoolOptions = [ allOption,...schoolsMaster.map((s) => ({
    value: s.SchoolID,
    label: s.PartnerName
  })) ]

  const handleSchoolChange = (selected) => {
    if(!selected){
      setSelectedSchools([]);
      return;
    }

    if(selected.some((s) => s.value === "ALL")){
      setSelectedSchools([allOption])
      return;
    }

    setSelectedSchools(selected);
  }

  // ======================
  // LOAD QUESTIONS
  // ======================
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const res = await _fetch(
      "inspectionquestions",
      null,
      false,
      token
    );

    if (res.status === "success") {
      setQuestions(res.data);
    }
  };

  // ======================
  // SEARCH
  // ======================
  const handleSearch = async () => {

    if (!section || !questionId || !fromDate || !toDate) {
      alert("Please select all filters");
      return;
    }

    setLoading(true);

     const schoolIds =
  selectedSchools.length === 0 || selectedSchools[0]?.value === "ALL"
    ? []
    : selectedSchools.map((s) => s.value);

    const payload = {
      section,
      questionId,
      fromDate,
      toDate,
      schoolIds
    };

    const res = await _fetch(
      "comparativeinspection",
      payload,
      false,
      token
    );

    if (res.status === "success") {
      setRows(res.data);
    } else {
      setRows([]);
    }

    setLoading(false);
  };



  const handleExportExcel = async () => {
  if (!rows.length) {
    alert("No data to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Comparative Inspection");

  // Title row
  worksheet.mergeCells("A1:F1");
  worksheet.getCell("A1").value = "Comparative Inspection Analysis Report";
  worksheet.getCell("A1").font = { bold: true, size: 14 };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  // Filter info
  worksheet.mergeCells("A2:F2");
  worksheet.getCell("A2").value =
    `Section: ${section} | Question: ${questionId} | From: ${fromDate} | To: ${toDate}`;
  worksheet.getCell("A2").font = { italic: true, size: 11 };
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  worksheet.addRow([]);

  // Header row
  const headerRow = worksheet.addRow([
    "School",
    "Visit Date",
    "Officer",
    "Designation",
    "Answer",
    "Remarks"
  ]);

  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  // Data rows
  rows.forEach((row) => {
    let answerText = "-";
    let remarksText = "-";

    try {
      const parsed = JSON.parse(row.AnswerValue || "{}");

      if (row.AnswerType === "yesno") {
        answerText = (parsed?.answer || "-").toUpperCase();
      } else {
        answerText = parsed?.value ?? "-";
      }

      remarksText = parsed?.remarks || "-";
    } catch (err) {
      answerText = "-";
      remarksText = "-";
    }

    worksheet.addRow([
      row.SchoolName || "-",
      row.VisitDate ? format(new Date(row.VisitDate), "dd-MMM-yyyy") : "-",
      row.OfficerName || "-",
      row.RoleDisplayName || "-",
      answerText,
      remarksText
    ]);
  });

  // Column widths
  worksheet.columns = [
    { width: 30 },
    { width: 15 },
    { width: 25 },
    { width: 18 },
    { width: 15 },
    { width: 40 }
  ];

  // Borders
  worksheet.eachRow((r) => {
    r.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const fileName = `Comparative_Inspection_${fromDate}_to_${toDate}.xlsx`;

  saveAs(
    new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    fileName
  );
};


  // ======================
  // UI
  // ======================
  
  return (
    <div className="container-fluid">
      <div className="white-box shadow-sm">
        <div className="table-header">
             <h5 className="fw-bold mb-3">
        Comparative Inspection Analysis
           </h5>
       
         
       <button
    className="btn btn-success"
    onClick={handleExportExcel}
    disabled={!rows.length}
      >
    Export Excel
     </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>

        </div>
       

      {/* ================= FILTERS ================= */}
      <div className="row g-2 mb-3 align-items-end pt-3">

        {/* SECTION */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Section</label>
          <select
            className="form-select"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setQuestionId("");
            }}
          >
            <option value="">Select Section</option>
            {Object.keys(questions).map(sec => (
              <option key={sec} value={sec}>
                {questions[sec].title}
              </option>
            ))}
          </select>
        </div>

        {/* QUESTION */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Question</label>
          <select
            className="form-select"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            disabled={!section}
          >
            <option value="">Select Question</option>

            {section &&
              questions[section]?.questions?.map(q => (
                <option key={q.id} value={q.id}>
                  {q.label} — {q.text}
                </option>
              ))}
          </select>
        </div>

        {/* FROM DATE */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">From</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* TO DATE */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">To</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="col-sm-4">
          <label className="form-label">Select School</label>
          <Select 
          isMulti
          options={schoolOptions}
          value={selectedSchools}
          onChange={handleSchoolChange}
          placeholder = "All schools"
          classNamePrefix = "react-select"
          />
        </div>

        {/* SEARCH */}
        <div className="col-md-1">
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* ================= RESULT ================= */}
      <div className="table-responsive">

        {loading ? (
          <div className="text-center py-4">
            Loading...
          </div>
        ) : (
          <table className="table table-bordered table-striped">

            <thead className="table-light">
              <tr>
                <th>School</th>
                <th>Visit Date</th>
                <th>Officer</th>
                <th>Designation</th>
                <th>Answer</th>
                {/* <th>Value</th> */}
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {rows.length ? (
                rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.SchoolName}</td>
                    <td>{format(new Date(row.VisitDate), "dd-MMM-yyyy")}</td>
                    <td>{row.OfficerName}</td>
                    <td>{row.RoleDisplayName}</td>

                    <td>
                      {row.AnswerType === "yesno" ? (
                        <span
                          className={`badge ${
                            JSON.parse(row.AnswerValue)?.answer === "yes"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {JSON.parse(row.AnswerValue)?.answer?.toUpperCase()}
                        </span>
                      ) : (
                        JSON.parse(row.AnswerValue)?.value
                      )}
                    </td>

                    {/* <td>{row.NumericValue ?? "-"}</td> */}
                    <td>{JSON.parse(row.AnswerValue)?.remarks || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        )}
      </div>
      </div>
      

    </div>
  );
};

export default ComparativeInspection;
