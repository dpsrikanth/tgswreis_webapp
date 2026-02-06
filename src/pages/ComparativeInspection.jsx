import React, { useEffect, useState } from "react";
import { _fetch } from "../libs/utils";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ComparativeInspection = () => {

  const token = useSelector(s => s.userappdetails.TOKEN);

  const [questions, setQuestions] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const [section, setSection] = useState("");
  const [questionId, setQuestionId] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);

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

    const payload = {
      section,
      questionId,
      fromDate,
      toDate
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
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>
        </div>
       

      {/* ================= FILTERS ================= */}
      <div className="row g-2 mb-3 align-items-end">

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
