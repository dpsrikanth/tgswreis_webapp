import React, { useEffect, useState } from "react";
import { _fetch } from "../libs/utils";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { notify } from "../services/notify";
import Select from 'react-select'


const SchoolWiseTourReport = () => {

  const token = useSelector(state => state.userappdetails.TOKEN);
  const apiUrl = window.gc.cdn;
  
 const schoolsMaster = useSelector(state => state.userappdetails.SCHOOL_LIST);
 const districtMaster = useSelector(state => state.userappdetails.DISTRICT_LIST);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [schools, setSchools] = useState([]);
  const [selectedDistricts,setSelectedDistricts] = useState([]);
  const [selectedSchools,setSelectedSchools] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const districtMap = React.useMemo(() => {
    const map = {};
    districtMaster.forEach(d => {
      map[d.DistrictId] = d.DistrictName
    });
    return map;
  },[districtMaster])

  const districtOptions = districtMaster.map(d => ({
    value: d.DistrictId,
    label: d.DistrictName
  })) ;

  const schoolOptions = schoolsMaster
  .filter(s =>
    selectedDistricts.length === 0 ||
    selectedDistricts.some(d => d.value === s.DistrictId)
  )
  .map(s => ({
    value: s.SchoolID,
    label: s.PartnerName
  }));



  const fetchSchoolWiseReport = async () => {
    if (!fromDate || !toDate) {
      notify.warning("Please select From & To dates");
      return;
    }

    setLoading(true);
  setHasFetched(false);

    const payload = {
      fromDate,
      toDate
    };

    try {
    const res = await _fetch(
      "schoolwisetourreport",
      payload,
      false,
      token
    );

    setLoading(false);
    setHasFetched(true);

    if (res.status === "success") {
      setSchools(res.data);
    } else {
      setSchools([]);
      notify.error("No data found");
    }
  } catch (err) {
    setLoading(false);
    setHasFetched(true);
    setSchools([]);
    notify.error("Failed to fetch data");
  }
  };

  

  const getBadge = status => {
    switch (status) {
      case "VISITED":
        return "badge bg-success";
      case "NOT_VISITED":
        return "badge bg-danger";
      case "PLANNED":
        return "badge bg-primary";
      case "CANNOT_VISIT":
        return "badge bg-secondary";
      case "EXTRA_VISIT":
        return "badge bg-info";
      default:
        return "badge bg-dark";
    }
  };


const exportInstitutionWiseExcel = async (
  schools,
  fromDate,
  toDate
) => {

  if (!schools || schools.length === 0) {
    notify.warning("No data available");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Institution Wise Inspection Report");

  const border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" }
  };

  /* ====================================
     COLOR RULES
  ==================================== */

  const getRowStyle = visit => {

    // 🔵 EXTRA VISIT
    if (visit.IsAdditionalVisit === 1) {
      return {
        font: { color: { argb: "000000" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DDEBF7" } // light blue
        }
      };
    }

    // ✅ VISITED
    if (
      visit.VisitStatus === "VISITED" ||
      visit.Status === 3
    ) {
      return {
        font: { color: { argb: "008000" } } // green
      };
    }

    // ❌ NOT VISITED
    if (
      visit.VisitStatus === "NOT_VISITED" ||
      visit.Status === 4
    ) {
      return {
        font: { color: { argb: "FF0000" } } // red
      };
    }

    // ⚠ CANNOT VISIT
    if (visit.Status === 5) {
      return {
        font: { color: { argb: "7F7F7F" } } // grey
      };
    }

    return {};
  };

  /* ====================================
     TITLE
  ==================================== */

  sheet.mergeCells("A1:H1");
  sheet.getCell("A1").value = "TGSWREIS INSTITUTIONS";
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A1").alignment = { horizontal: "center" };

  sheet.mergeCells("A2:H2");
  sheet.getCell("A2").value =
    `Institution-Wise Inspection Report from ${fromDate} to ${toDate}`;
  sheet.getCell("A2").font = { bold: true };
  sheet.getCell("A2").alignment = { horizontal: "center" };

  sheet.addRow([]);

  /* ====================================
     TABLE HEADER
  ==================================== */

  const headerRow = sheet.addRow([
    "S.No",
    "Name of TGSWR Institution",
    "Name of the New District",
    "Type of the Institution",
    "Date of the Visit",
    "Name of the Visiting Officer",
    "Designation",
    "Visit Report"
  ]);

  headerRow.eachCell(cell => {
    cell.font = { bold: true };
    cell.border = border;
    cell.alignment = {
      horizontal: "center",
      vertical: "middle"
    };
  });

  /* ====================================
     DATA
  ==================================== */

  let serialNo = 1;

  schools.forEach(school => {

    // School without any visits
    if (!school.visits || school.visits.length === 0) {

      const row = sheet.addRow([
        serialNo++,
        school.InstitutionName?.replace("TGSWREIS", ""),
        school.DistrictName || "",
        school.TypeOfSchool || "",
        "",
        "",
        "",
        ""
      ]);

      row.eachCell(cell => (cell.border = border));
      return;
    }

    // Schools with visits
    school.visits.forEach((visit, index) => {

      const row = sheet.addRow([
        index === 0 ? serialNo : "",
        index === 0
          ? school.InstitutionName?.replace("TGSWREIS", "")
          : "",
        index === 0 ? school.DistrictName : "",
        index === 0 ? school.TypeOfSchool : "",
        visit.VisitDate
          ? format(new Date(visit.VisitDate), "dd-MMM-yyyy")
          : "",
        visit.OfficerName || "",
        visit.Designation || "",
        visit.CapturedInfo ? "Report Uploaded" : "Not Submitted"
      ]);

      row.eachCell(cell => {
        cell.border = border;
        cell.alignment = { vertical: "middle" };
      });

      const style = getRowStyle(visit);

      row.eachCell(cell => {
        if (style.font) cell.font = style.font;
        if (style.fill) cell.fill = style.fill;
      });

      if (index === 0) serialNo++;
    });

  });

  sheet.columns.forEach(col => {
    col.width = 28;
  });

  /* ====================================
     EXPORT
  ==================================== */

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `InstitutionWise_TourDiary_${fromDate}_to_${toDate}.xlsx`
  );
};



const filteredSchools = schools.filter(school => {

  // District filter
  if (
    selectedDistricts.length > 0 &&
    !selectedDistricts.some(d => d.label === school.DistrictName)
  ) {
    return false;
  }

  // School filter
  if (
    selectedSchools.length > 0 &&
    !selectedSchools.some(s => s.value === school.SchoolID)
  ) {
    return false;
  }

  return true;
});


useEffect(() => {
  if(!fromDate && !toDate)
    return;

  fetchSchoolWiseReport();

  setSelectedDistricts([]);
  setSelectedSchools([]);

},[fromDate,toDate])


  return (
    <div className="row">
      <div className="col-sm-12">

        <div className="white-box shadow-sm">

          {/* ================= HEADER ================= */}
          <div className="table-header">
            <h5 className="chart-title">
              School Wise Inspection Report
            </h5>
            <button
  className="btn btn-success"
  onClick={() =>
    exportInstitutionWiseExcel(filteredSchools, fromDate, toDate)
  }
>
  Excel Report
</button>
<button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>
          </div>

          {/* ================= FILTER ================= */}
          <div className="row align-items-end mb-3">

            <div className="col-sm-2">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-sm-2">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                min={fromDate}
                value={toDate}
                onChange={e => setToDate(e.target.value)}
              />
            </div>

            <div className="col-sm-4">
  <label>Filter by District</label>
  <Select
    isMulti
    options={districtOptions}
    value={selectedDistricts}
    onChange={setSelectedDistricts}
    placeholder="Select district(s)"
    classNamePrefix="react-select"
  />
</div>


<div className="col-sm-4">
  <label>Filter by School</label>
  <Select
    isMulti
    options={schoolOptions}
    value={selectedSchools}
    onChange={setSelectedSchools}
    placeholder="Select school(s)"
    classNamePrefix="react-select"
    isDisabled={selectedDistricts.length === 0}
  />
</div>


            {/* <div className="col-sm-3">
              <button
                className="btn btn-primary mt-4"
                onClick={fetchSchoolWiseReport}
              >
                Fetch
              </button>
            </div> */}

          </div>

          {hasFetched && !loading && filteredSchools.length === 0 && (
  <div className="text-center text-muted mt-4">
    No records found for the selected filters
  </div>
)}

          {/* ================= REPORT ================= */}
          {filteredSchools.map((school, index) => (

            <div key={school.SchoolID} className="mb-4">

              {/* ---------- SCHOOL HEADER ---------- */}
              <div className="bg-light p-2 fw-bold border">
                {index + 1}. {school.InstitutionName}
                <span className="ms-3 text-muted">
                  ({school.DistrictName} • {school.TypeOfSchool || "NA"})
                </span>
              </div>

              {/* ---------- VISITS TABLE ---------- */}
              <table className="table table-bordered table-sm mb-0">
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th>Visit Date</th>
                    <th>Officer Name</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Report</th>
                  </tr>
                </thead>

                <tbody>
                  {school.visits.length > 0 ? (
                    school.visits.map((v, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {v.VisitDate
                            ? format(new Date(v.VisitDate), "dd-MM-yyyy")
                            : "-"}
                        </td>
                        <td>{v.OfficerName}</td>
                        <td>{v.Designation}</td>
                        <td>
                          <span className={getBadge(v.VisitStatus)}>
                            {v.VisitStatus}
                          </span>
                        </td>
                        <td>
                          {v.CapturedInfo ? (
                           <span>Report Submitted</span>
                          ) : (
                             <span>Not Submitted</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No visits
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SchoolWiseTourReport;
