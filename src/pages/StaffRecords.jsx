import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { XMLParser } from "fast-xml-parser";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';




const StaffRecords = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const zones = useSelector((state) => state.userappdetails.ZONES_LIST || []);
  const [districts, setDistricts] = useState(useSelector((state) => state.userappdetails.DISTRICT_LIST) || []);
  const [filtereddistricts, setFilteredDistrict] = useState([]);
  const schoolList = useSelector((state) => state.userappdetails.SCHOOL_LIST || []);
  const [schoolsByDistrict, setSchoolsByDistrict] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [zonesdisp, setZonesdisp] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [filledCount,setFilledCount] = useState(0);
  const [vacantCount,setVacantCount] = useState(0);
  const [staffDetails, setStaffDetails] = useState([]);
  const [additionalStaffDetails, setAdditionalStaffDetails] = useState([]);
  const [vacantStaffDetails,setVacantStaffDetails] = useState([]);
  const [selectedSchoolName,setSelectedSchoolName] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (zones.length === 1) {
      //console.log("zone user");
      setSelectedZoneId(zones[0].ZoneCode);
      const districtOptions = districts.map(district => ({
        value: district.DistrictId,
        label: district.DistrictName
      }));
      setFilteredDistrict(districtOptions);
    }
  }, [token]);

  const bindZones = () => {
    let zoneList = [];
    // console.log(zones);
    zones.forEach((zone) => {
      zoneList.push({
        value: zone.ZoneCode,
        label: zone.ZoneName.split(" ")[zone.ZoneName.split(" ").length - 1],
      });
    });
    setZonesdisp(zoneList);
  }
  useEffect(() => {
    bindZones();

  }, []);

  const getXmlDataByKey = async (xmlData, key) => {
    try {
      const parser = new XMLParser();
      const jsonObj = parser.parse(xmlData);
      const jsonData = jsonObj[key];
      return jsonData;
    } catch (error) {
      console.error('Error fetching or parsing XML:', error);
      return null;
    }
  }
  const fetchDistrictsByZone = async (zoneId) => {
    try {
      _fetch(`zonedistricts`, null, false, token, '$zoneId$', zoneId).then(res => {
        if (res.status === "success") {
          //console.log(res.data);
          const districtOptions = res.data.map(district => ({
            value: district.DistrictId,
            label: district.DistrictName
          }));
          setFilteredDistrict(districtOptions);
        }
      });
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  useEffect(() => {
    const filteredSchools = schoolList.filter(school => school.DistrictId === selectedDistrict);
    const schoolOptions = filteredSchools.map(school => ({
      value: school.SchoolCode,
      label: school.PartnerName.replace('TGSWREIS ', '')
    }));
    setSchoolsByDistrict(schoolOptions);
  }, [selectedDistrict])

  const getSchoolFacultyDetails = useCallback(async () => {
    if (!selectedSchool) {
      return;
    }
    _fetch("staffdetails", { schoolcode: selectedSchool }, false, token).then(res => {
      if (res.status === "success") {
        setStaffDetails(res.data);
        setStaffCount(res.count[0].TotalSanctioned);
        setFilledCount(res.count[0].TotalFilled);
        setVacantCount(res.count[0].TotalVacant);
        setAdditionalStaffDetails(res.dataAdd);
        setVacantStaffDetails(res.vacantDet);
        //console.log(res.data);
      }
      else {
        setStaffDetails([]);
        setStaffCount(0);
        setFilledCount(0);
        setVacantCount(0);
        setAdditionalStaffDetails([]);
        setVacantStaffDetails([]);
      }
    })
  }, [selectedSchool]);
  useEffect(() => {
    getSchoolFacultyDetails();
  }, [selectedSchool]);
  useEffect(() => {
    if (selectedZoneId) {
      fetchDistrictsByZone(selectedZoneId);
    }
  }, [selectedZoneId])



const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();

  const borderStyle = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Shared function to create a styled worksheet
  const createSheet = (sheetName, headers, data, topInfo = []) => {
    const sheet = workbook.addWorksheet(sheetName);

    // Add top info rows (like School Code, Counts)
    topInfo.forEach((row, idx) => {
      const rowRef = sheet.addRow([row]);
      rowRef.font = { bold: true };
    });

    sheet.addRow([]); // Empty row

    // Add header row
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    headerRow.eachCell((cell) => {
      cell.border = borderStyle;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' },
      };
    });

    // Add data rows
    data.forEach((item) => {
      const row = sheet.addRow(Object.values(item));
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
  };

  // Prepare Staff Details
  const displayData = staffDetails.map((item, index) => ({
    "S.No": index + 1,
    "Staff Name": item.StaffName || "",
    "Category": item.FacultyType || "",
    "Designation": item.StaffPosition || "",
    "Gender": item.Gender ? "Female" : "Male",
    "Employment Type": item.EmploymentType || "",
    "Mode of Recruitment In Current Working Cadre": parseXMLField(item.ModeofRecruitment, "ModeRecrtCurrent"),
    "Gross Salary": item.GrossSalary || "",
    "Date of Joining in Service": item.DateofJoiningService
      ? new Date(item.DateofJoiningService).toDateString()
      : "-",
    "Date of Joining in Present Cadre": item.DateofJoiningPresent
      ? new Date(item.DateofJoiningPresent).toDateString()
      : "-",
    "Phone Number": item.PhoneNumber || "",
  }));

  const displayDataAdd = additionalStaffDetails.map((item, index) => ({
    "S.No": index + 1,
    "Employee Name": item.StaffName || "",
    "Employment Type": item.EmploymentType || "",
    "Faculty Type": item.FacultyType || "",
    "Current Pay": item.CurrentPay || "",
    "Reason for Requirement of Additional Staff": item.Reason || "",
  }));

  const VacantDataDet = vacantStaffDetails.map((item, index) => ({
    "S.No": index + 1,
    "Designation": item.RoleName || "",
    "Sanctioned Count": item.SanctionedCount,
    "Filled Count": item.FilledCount,
    "Vacant Count": item.VacantCount,
  }));

  // Create sheets with top info and styled data
  if (displayData && displayData.length > 0) {
  createSheet(
    "StaffRecords",
    Object.keys(displayData[0]),
    displayData,
    [
      `School Code: ${selectedSchool}`,
      `Total Sanctioned Count: ${staffCount}`,
      `Total Filled: ${filledCount}`,
      `Total Vacant: ${vacantCount}`,
      `School Name: ${selectedSchoolName}`
    ]
  );
}


 if (displayDataAdd && displayDataAdd.length > 0) {
  createSheet(
    "AdditionalStaffRecords",
    Object.keys(displayDataAdd[0]),
    displayDataAdd,
    [`School Code: ${selectedSchool}`,
      `School Name: ${selectedSchoolName}`
    ]
  );
 }

if (VacantDataDet && VacantDataDet.length > 0) {
  createSheet(
    "VacantStaffDesignations",
    Object.keys(VacantDataDet[0]),
    VacantDataDet,
    [`School Code: ${selectedSchool}`,
      `School Name: ${selectedSchoolName}`
    ]
  );
}

  // Save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `StaffRecords_${selectedSchool}.xlsx`);
};


const parseXMLField = (xmlString, tagName) => {
  if (!xmlString) return "-";
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const element = xmlDoc.getElementsByTagName(tagName)[0];
    return element?.textContent || "-";
  } catch (err) {
    return "-";
  }
};








  return (
    <div>
      <h6 className="fw-bold mb-3"><a href="/samsdashboard"><i className="bi bi-arrow-left pe-2" style={{ fontSize: '24px', verticalAlign: 'middle' }}></i></a>Staff Records</h6>

      <div className="card zonedetails">
        <div className="row">
          <div className="col-sm-6 g-3 mb-3">
            <div className="row">
              <label className="col-sm-4 col-form-label">Select Zone</label>
              <div className="col-sm-8">
                <Select id="zonesdisp"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select Zone"
                  value={zonesdisp.find(opt => opt.value === selectedZoneId) || null}
                  options={zonesdisp} onChange={(e) => {
                    setSelectedZoneId(e.value);
                    setSelectedDistrict('');
                    setSelectedDistrictName('');
                    setSelectedSchool('');
                  }} />
              </div>
            </div>
          </div>
          <div className="col-sm-6 g-3 mb-3">
            <div className="row">
              <label className="col-sm-4 col-form-label">Select District</label>
              <div className="col-sm-8">
                <Select id="filtereddistricts"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select District"
                  value={filtereddistricts.find(opt => opt.value === selectedDistrict) || null}
                  options={filtereddistricts} onChange={(e) => {
                    setSelectedDistrict(e.value);
                    setSelectedDistrictName(e.label);
                    setSelectedSchool('');
                  }} />
              </div>
            </div>
          </div>
          <div className="col-sm-6 g-3 mb-3">
            <div className="row">
              <label className="col-sm-4 col-form-label">Select School</label>
              <div className="col-sm-8">
                <Select id="filteredschools"
                  isClearable={true}
                  isSearchable={true}
                  value={schoolsByDistrict.find(opt => opt.value === selectedSchool) || null}
                  placeholder="Select School"
                  options={schoolsByDistrict}
                  onChange={(e) => {
                    setSelectedSchool(e.value);
                    setSelectedSchoolName(e.label);
                    console.log(e.value);
                  }} />
              </div>
            </div>
          </div>

        </div>
        <div>
          <div className="shadow-sm">
            <div id="categoryTableContainer">

            </div>
          </div>
        </div>
      </div>


      <div className="row pt-3">
        <div className="col-sm-12">
          <div className="white-box mt-2 py-2 px-3 rounded-lg">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="">School: {selectedSchoolName} - {selectedSchool}</h4>
                <h6>Total Sanctioned Positions : <strong>{staffCount}</strong></h6>
              </div>
             
               <div>
                <h6>Filled: <span className="fw-bold text-success">{filledCount}</span> | Vacant: <span className="fw-bold text-danger">{vacantCount}</span></h6>
              </div> 
            </div>
         
              
          </div>
        </div>
        <div className="col-sm-12">
          <div className="white-box shadow-sm">
            <div className="table-header d-flex justify-between">
              <h5><span className="pink fw-bold">Staff Records List</span></h5>
               <div className="text-end">
                <button className="btn btn-success" onClick={exportToExcel}>Download Excel</button>
              </div>
              {/* <div className="table-tools">
                        <input type="text" className="form-control" placeholder="Search..." />
                         <img src="img/print_icon.png">
                    <img src="img/download_icon.png" className="download_img"> 
                      </div>  */}
            </div>
            <div className="table-responsive pt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Staff Name</th>
                    <th>Category</th>
                    <th>Designation</th>
                    <th>Gender</th>
                    <th>Employment Type</th>
                    <th>Mode of Recruitment In Current Working Cadre</th>
                    <th>Gross Salary</th>
                    <th>Date of Joining in Service</th>
                    <th>Date of Joining in Present Cadre</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                   {Array.isArray(staffDetails) && staffDetails.length > 0 ? ( staffDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.StaffName}</td>
                      <td><span className={item.FacultyType === "Teaching" ? "badge text-bg-primary" : "badge text-bg-secondary"}>{item.FacultyType}</span></td>
                      <td>{item.StaffPosition}</td>
                      <td>{item.Gender ? "Male" : "Female"}</td>
                      <td>{item.EmploymentType}</td>
                      <td>{parseXMLField(item.ModeofRecruitment,"ModeRecrtCurrent")}</td>
                      <td>{item.GrossSalary}</td>
                      <td>{item.DateofJoiningService ? new Date(item.DateofJoiningService).toDateString() : "-"}</td>
                      <td>{item.DateofJoiningPresent ? new Date(item.DateofJoiningPresent).toDateString() : "-"}</td>
                      <td>{item.PhoneNumber}</td>
                    </tr>
                  ))) : 
                  (
                  <tr>
                    <td colSpan={11} className="text-center text-muted">No data available</td>
                  </tr>)}
                 
                </tbody>
              </table>
            </div>

              <div className="table-header">
               <h5><span className="pink fw-bold">Vacant Staff Designations</span></h5>
            </div>
            <div className="table-responsive pt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Designation</th>
                    <th>Sanctioned Count</th>
                    <th>Filled Count</th>
                    <th>Vacant Count</th>
                  </tr>
                </thead>
                <tbody>
                   {Array.isArray(vacantStaffDetails) && vacantStaffDetails.length > 0 ? (  vacantStaffDetails.map((item,index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.RoleName}</td>
                      <td>{item.SanctionedCount}</td>
                      <td>{item.FilledCount}</td>
                      <td>{item.VacantCount}</td>
                    </tr>
                  ))) : (<tr>
                    <td colSpan={5} className="text-center text-muted">No data available</td>
                  </tr>) }
                  
                </tbody>
              </table>
            </div>

            <div className="table-header">
               <h5><span className="pink fw-bold">Additional Staff Details</span></h5>
            </div>
            <div className="table-responsive pt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Employee Name</th>
                    <th>Employment Type</th>
                    <th>Faculty Type</th>
                    <th>Current Pay</th>
                    <th>Reason for Requirement of additional staff</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(additionalStaffDetails) && additionalStaffDetails.length > 0 ? (additionalStaffDetails.map((item,index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.StaffName}</td>
                      <td>{item.EmploymentType}</td>
                      <td>{item.FacultyType}</td>
                      <td>{item.CurrentPay}</td>
                      <td>{item.Reason}</td>
                    </tr>
                  ))) : (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default StaffRecords