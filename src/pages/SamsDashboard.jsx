import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import DataTable from 'react-data-table-component';

const SamsDashboard = () => {
  const dataFetched = useRef(false);
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const zones = useSelector((state) => state.userappdetails.ZONES_LIST || []);
  const [intialData, setInitialData] = useState({
    TotalSeatsAdmitted: undefined,
    TotalSanctionedSeats: undefined,
  });
  const [tsmessSearch, setTsmessSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedZoneCode, setSelectedZoneCode] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [districts, setDistricts] = useState(useSelector((state) => state.userappdetails.DISTRICT_LIST) || []);
  const schoolList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
  const [masterAdmissionData, setMasterAdmissionData] = useState([]);
  const [masterAttendanceData, setMasterAttendanceData] = useState([]);
  const [schoolsByDistrict, setSchoolsByDistrict] = useState([]);
  const classList = useSelector((state) => state.userappdetails.CLASSES_LIST) || [];
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentAttendanceTotal, setStudentAttendanceTotal] = useState('')

  const dataTableCustomStyles = {
    headRow: {
      style: {
        backgroundColor: '#6a5acd',
        color: 'white',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#6a5acd',
        color: 'white',
        fontWeight: 'bold',
      },
    },
  };


  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (!dataFetched.current) {
      fetchStudentAdmissionTotal();
      fetchStudentAttendanceTotal();
      setClasses(classList.map(cls => ({ value: cls.ClassGroup, label: cls.ClassGroup })));
      dataFetched.current = true;
    }
    if (zones.length === 1) {
      //console.log("zone user");
      setSelectedZoneCode(zones[0].ZoneCode);
      setSelectedZoneId(zones[0].ZoneId);
    }
  }, [token]);

  const fetchStudentAdmissionTotal = async () => {


     const payload = {};

     if(UserType === 'Admin'){
      payload.ZoneId = ZoneId;
     }
 


    try {
      _fetch("admissiontotals", payload, false, token).then(res => {
        if (res.status === "success") {
          setInitialData({
            TotalSeatsAdmitted: res.data[0].TotalSeatsAdmitted || 0,
            TotalSanctionedSeats: res.data[0].TotalSanctionedSeats || 0,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching student admission data:", error);
    }
  }

  const fetchStudentAttendanceTotal = async () => {


 const payload = {
      TodayDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    };

    if(UserType === 'Admin') {
      payload.ZoneId = ZoneId;
    }
   

    try {
      _fetch('studentattendancetotal', payload, false, token).then(res => {
        if (res.status === 'success') {
          setStudentAttendanceTotal(res.data.TotalPresentAllSchools)

        } else {
          console.error(res.message);
        }

      })
    } catch (error) {
      console.error("Error fetching student attendance total:", error);
    }
  }

  const fetchDistrictsByZone = async (zoneId) => {
    try {
      _fetch(`zonedistricts`, null, false, token, '$zoneId$', zoneId).then(res => {
        if (res.status === "success") {
          const districtOptions = res.data.map(district => ({
            value: district.DistrictId,
            label: district.DistrictName
          }));
          setDistricts(districtOptions);
        }
      });
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  useEffect(() => {
    if (selectedZoneCode) {
      fetchDistrictsByZone(selectedZoneCode);
    }
  }, [selectedZoneCode]);

  useEffect(() => {
    if (selectedDistrict) {
      const filteredSchools = schoolList.filter(school => school.DistrictId === selectedDistrict);
      const schoolOptions = filteredSchools.map(school => ({
        value: school.SchoolCode,
        label: school.PartnerName
      }));
      setSchoolsByDistrict(schoolOptions);
    } else if (selectedZoneId) {
      const filteredSchools = schoolList.filter(school => school.ZoneId === selectedZoneId);
      const schoolOptions = filteredSchools.map(school => ({
        value: school.SchoolId,
        label: school.PartnerName
      }));
      setSchoolsByDistrict(schoolOptions);
    } else {
      setSchoolsByDistrict([]);
    }
  }, [selectedDistrict, selectedZoneCode]);

  const fetchAdmissions = (params) => {
    const zoneCode = params?.zoneCode ?? selectedZoneCode;
    const category = params?.category ?? selectedCategory;

    if (category !== "Student Admission") return;

    try {
      const payload = {};
      if (zoneCode) payload.ZoneId = parseInt(zoneCode);
      _fetch("admissions", payload, false, token).then(res => {
        if (res.status === "success") {
          setMasterAdmissionData(res.data);
        }
      });
    } catch (error) {
      console.error("Error fetching student admission data:", error);
    }
  };
  const fetchAttendance = () => {
    if (selectedCategory !== "Student Attendance") return;
    if(!selectedSchool) return;    try {
      const payload = { UserType: UserType, SchoolCode: selectedSchool };
      _fetch("studentattendance", payload, false, token).then(res => {
        if (res.status === "success") {
          setMasterAttendanceData(res.data);
        }
      });
    }
    catch (error) {
      console.error("Error fetching student attendance data:", error);
    }
  };


  const addTotalToRows = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(row => ({
      ...row,
      Totalseats: [
        row.SCAdmissionsSeats || 0,
        row.STAdmissionsSeats || 0,
        row.BCAdmissionsSeats || 0,
        row.OCAdmissionsSeats || 0,
        row.SCCAdmissionsSeats || 0,
        row.MINORAdmissionsSeats || 0
      ].reduce((sum, val) => sum + Number(val), 0)
    }));
  };

  const getAdmissionsTotalsRow = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const totalRow = {
      ZoneName: 'Total',
      ClassGroup: '',
      SCSanctionedSeats: 0,
      SCAdmissionsSeats: 0,
      STAdmissionsSeats: 0,
      STSanctionedSeats: 0,
      BCAdmissionsSeats: 0,
      BCSanctionedSeats: 0,
      OCAdmissionsSeats: 0,
      OCSanctionedSeats: 0,
      SCCAdmissionsSeats: 0,
      SCCSanctionedSeats: 0,
      MINORAdmissionsSeats: 0,
      MINORSanctionedSeats: 0,
      Totalseats: 0
    };
    rows.forEach(row => {
      totalRow.SCSanctionedSeats += Number(row.SCSanctionedSeats || 0);
      totalRow.SCAdmissionsSeats += Number(row.SCAdmissionsSeats || 0);
      totalRow.STAdmissionsSeats += Number(row.STAdmissionsSeats || 0);
      totalRow.STSanctionedSeats += Number(row.STSanctionedSeats || 0);
      totalRow.BCAdmissionsSeats += Number(row.BCAdmissionsSeats || 0);
      totalRow.BCSanctionedSeats += Number(row.BCSanctionedSeats || 0);
      totalRow.OCAdmissionsSeats += Number(row.OCAdmissionsSeats || 0);
      totalRow.OCSanctionedSeats += Number(row.OCSanctionedSeats || 0);
      totalRow.SCCAdmissionsSeats += Number(row.SCCAdmissionsSeats || 0);
      totalRow.SCCSanctionedSeats += Number(row.SCCSanctionedSeats || 0);
      totalRow.MINORAdmissionsSeats += Number(row.MINORAdmissionsSeats || 0);
      totalRow.MINORSanctionedSeats += Number(row.MINORSanctionedSeats || 0);
      totalRow.Totalseats += Number(row.Totalseats || 0);
    });
    return totalRow;
  };

  const filteredAdmissionsRows = useMemo(() => {
    if (!Array.isArray(masterAdmissionData)) {
      return [];
    }

    let filteredData = masterAdmissionData;

    if (selectedDistrictName) {
      filteredData = filteredData.filter(row => row.District === selectedDistrictName);
    }
    //console.log(filteredData, selectedSchool);
    if (selectedSchool) {
      filteredData = filteredData.filter(row => row.SchoolId === selectedSchool);
    }

    if (selectedClass) {
      filteredData = filteredData.filter(row => (row.ClassGroup || '').trim().toLowerCase() === (selectedClass || '').trim().toLowerCase());
    }

    if (tsmessSearch) {
      filteredData = filteredData.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(tsmessSearch.toLowerCase())
        )
      );     
    }    
    return addTotalToRows(filteredData);
  }, [masterAdmissionData, selectedDistrict, selectedSchool, selectedClass, tsmessSearch]);  

  const admissionsTotalRow = getAdmissionsTotalsRow(filteredAdmissionsRows); 

  const tsmessColumns = [
    { name: 'Zone', selector: row => row.ZoneName, sortable: true, minWidth: '120px' },
    { name: 'Class', selector: row => row.ClassGroup, sortable: true, minWidth: '120px' },
    { name: 'District', selector: row => row.District, sortable: true, minWidth: '120px' },
    { name: 'Total Strength', selector: row => row["Total Strength"], sortable: true, align: 'center' },
    { name: 'SC(S)', selector: row => row.SCSanctionedSeats, sortable: true, align: 'center' },
    { name: 'SC(A)', selector: row => row.SCAdmissionsSeats, sortable: true },
    { name: 'ST(A)', selector: row => row.STAdmissionsSeats, sortable: true },
    { name: 'ST(S)', selector: row => row.STSanctionedSeats, sortable: true },
    { name: 'BC(A)', selector: row => row.BCAdmissionsSeats, sortable: true },
    { name: 'BC(S)', selector: row => row.BCSanctionedSeats, sortable: true },
    { name: 'OC(A)', selector: row => row.OCAdmissionsSeats, sortable: true },
    { name: 'OC(S)', selector: row => row.OCSanctionedSeats, sortable: true },
    { name: 'SCC(A)', selector: row => row.SCCAdmissionsSeats, sortable: true },
    { name: 'SCC(S)', selector: row => row.SCCSanctionedSeats, sortable: true },
    { name: 'MINOR(A)', selector: row => row.MINORAdmissionsSeats, sortable: true },
    { name: 'MINOR(S)', selector: row => row.MINORSanctionedSeats, sortable: true },
    { name: 'Total', selector: row => row.Totalseats, sortable: true },
  ];

    const tsmessAttendanceColumns = [
    //{ name: 'SchoolId', selector: row => row.SchoolId, sortable: true, minWidth: '120px' },
    { name: 'Date', selector: row => new Date(row.TodayDate).toLocaleDateString('en-GB', {  day: '2-digit',  month: '2-digit',  year: 'numeric'}).replace(/\//g, '-') , sortable: true, minWidth: '120px' },
    { name: 'Day Name', selector: row => row.Day_Name, sortable: true, minWidth: '120px' },
    { name: 'Strength', selector: row=>row.TotalStrength, sortable: true, align: 'center' },
    { name: 'Present', selector: row => row.TotalPresent, sortable: true, align: 'center' },
    { name: 'Absent', selector: row => row.TotalAbsent, sortable: true },
    { name: 'Guest', selector: row => row.TotalGuest, sortable: true },
    { name: 'Sick', selector: row => row.TotalSick, sortable: true },  
  ];

  useEffect(() => {
    if (UserType === 'SuperAdmin' && selectedCategory === "Student Attendance") {
      fetchAttendance();
    }
  }, [UserType, selectedCategory, selectedSchool]);


  

  return (
    <>
      {UserType === 'SuperAdmin' ? (<h5 className="fw-bold mb-3 maroon">
        Admin Dashboard
      </h5>) : (<h5 className="fw-bold mb-3 maroon">
        Dashboard (Zone - {ZoneId})
      </h5>)}
      <div className="row">
        <div className="col-sm-9">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="card-box blue-bg shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Admissions</h6>
                    <h4 className="fw-bold"><large>{intialData.TotalSeatsAdmitted}</large> / <small>{intialData.TotalSanctionedSeats}</small></h4>
                  </div>
                  <img src="img/admission_icon.png" alt="Admission Icon" />
                </div>
                <hr />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-box purple-bg shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total Students Present</h6>
                    <h4 className="fw-bold"><large>{studentAttendanceTotal}</large></h4>
                  </div>
                  <img src="img/attendence_icon.png" alt="Attendance Icon" />
                </div>
                <hr />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-box pink-bg shadow-sm">
                <a href="#">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Total Staff Present</h6>
                      <h4 className="fw-bold"><large>0</large> / <small>0</small></h4>
                    </div>
                    <img src="img/attendence_icon.png" alt="Attendance Icon" />
                  </div>
                  <hr />
                </a>
              </div>
            </div>
          </div>
          <div>
            {UserType === 'SuperAdmin' ? (<h5 class="text-purple fw-bold mb-3 maroon">Zonal Wise Report</h5>) : (<h5 class="text-purple fw-bold mb-3 maroon">District Wise Report</h5>)}
            <div className="zonehead" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start',rowGap: '10px' }}>
              {zones.length === 1 ?
                <div key={"1"} zoncode={zones[0].ZoneCode} className="hzones" ><div className="zonal_report shadow-sm zonal_report_select" zoncode1={zones[0].ZoneCode}>
                  <label>{zones[0].ZoneName.split(" ")[zones[0].ZoneName.split(" ").length - 1]}</label>
                </div>
                </div>
                :
                zones.map((zone, index) =>
                (

                  <div key={index} zoncode={zone.ZoneCode} className="hzones" onClick={() => {
                    const handleZoneSelection = (zoneCode) => {
                      const zonalReports = document.querySelectorAll('.zonal_report_select');
                      zonalReports.forEach((report) => {
                        report.classList.remove('zonal_report_select');
                      });
                      document.querySelector(`div[zoncode1="${zoneCode}"]`).classList.add('zonal_report_select');
                    };
                    handleZoneSelection(zone.ZoneCode);
                    setSelectedZoneCode(zone.ZoneCode);
                    setSelectedZoneId(zone.ZoneId);
                    setSelectedDistrict('');
                    setSelectedDistrictName('');
                    setSelectedSchool('');
                    setSelectedClass('');
                    setTsmessSearch('');
                    setMasterAttendanceData([]);                    
                    if (selectedCategory === "Student Admission") {
                      fetchAdmissions({
                        zoneCode: zone.ZoneCode,
                        category: selectedCategory
                      });
                    }
                  }}>
                    <div className="zonal_report shadow-sm" zoncode1={zone.ZoneCode}>
                      <label>{zone.ZoneName.split(" ")[zone.ZoneName.split(" ").length - 1]}</label>
                    </div>
                  </div>
                ))}
            </div>
            <div className="card zonedetails">
              <div className="row">
                <div className="col-sm-6 g-3 mb-3">
                  <div className="row">
                    <label className="col-sm-4 col-form-label">Select Category</label>
                    <div className="col-sm-8">
                      <select id="categorySelect" className="form-select" onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        if (e.target.value === "Student Admission") {
                          fetchAdmissions({
                            zoneCode: selectedZoneCode,
                            category: e.target.value
                          });
                          setMasterAttendanceData([]);     
                        } else {
                          setMasterAdmissionData([]);
                        }
                      }}>
                        <option selected="">Select Category</option>
                        <option>Student Admission</option>
                        <option>Student Attendance</option>
                        {/* <option>Vacancies</option> 
                         <option>Students Present</option>
                        <option>Staff Absent</option>
                        <option>Staff Present</option>  */}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 g-3 mb-3">
                  <div className="row">
                    <label className="col-sm-4 col-form-label">Select District</label>
                    <div className="col-sm-8">
                      <Select
                        options={Array.isArray(districts) ? [{ value: '', label: 'All' }, ...districts] : [{ value: '', label: 'All' }]}
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select District"
                        value={districts.find(opt => opt.value === selectedDistrict) || null}
                        onChange={option => {
                          const value = option ? option.value : '';
                          setSelectedDistrict(value);
                          const label = option ? option.label : '';
                          setSelectedDistrictName(label);
                          setSelectedSchool('');
                          setSelectedClass('');
                          setTsmessSearch('');
                          setMasterAttendanceData([]);     
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 g-3 mb-3">
                  <div className="row">
                    <label className="col-sm-4 col-form-label">Select School</label>
                    <div className="col-sm-8">
                      <Select
                        options={Array.isArray(schoolsByDistrict) ? [{ value: '', label: 'All' }, ...schoolsByDistrict] : [{ value: '', label: 'All' }]}
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select School"
                        value={schoolsByDistrict.find(opt => opt.value === selectedSchool) || null}
                        onChange={option => {
                          //console.log('Option received:', option); // Debug what's received
                          const value = option ? option.value : '';
                          //console.log('Selected school value:', value, option); // Debug the extracted value
                          setSelectedSchool(value);

                          // Also log the current schoolsByDistrict to verify options
                          //console.log('Available schools:', schoolsByDistrict);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 g-3 mb-3">
                  <div className="row">
                    <label className="col-sm-4 col-form-label">Select Class</label>
                    <div className="col-sm-8">
                      <Select
                        options={Array.isArray(classes) ? [{ value: '', label: 'All' }, ...classes] : [{ value: '', label: 'All' }]}
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select Class"
                        value={classes.find(opt => opt.value === selectedClass) || null}
                        onChange={option => {
                          const value = option ? option.value : '';
                          setSelectedClass(value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="shadow-sm">
                {filteredAdmissionsRows.length === 0 ? <></>:
                  <div id="categoryTableContainer">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={tsmessSearch}
                        onChange={e => setTsmessSearch(e.target.value)}
                        style={{ maxWidth: 300, display: 'inline-block', marginRight: 10 }}
                      />
                    </div>
                    <DataTable
                      columns={tsmessColumns}
                      data={filteredAdmissionsRows}
                      pagination
                      highlightOnHover
                      striped
                      persistTableHead
                      noDataComponent={<span>No data available</span>}
                      defaultSortFieldId={2}
                      id="tsmess-table"
                      customStyles={dataTableCustomStyles}
                    />
                  </div>
                  }
                  {masterAttendanceData.length === 0 ? <></> :
                   <DataTable
                      columns={tsmessAttendanceColumns}
                      data={masterAttendanceData}
                      pagination
                      highlightOnHover
                      striped
                      persistTableHead
                      noDataComponent={<span>No data available</span>}
                      defaultSortFieldId={2}
                      id="tsmess-table"
                      customStyles={dataTableCustomStyles}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row mess_mar">
          </div>
        </div>
        <div className="col-sm-3">
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                  Calendar
                </button>
              </h2>
              <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <div className="">
                    <div className="calendar">
                      <header>
                        <pre className="left">◀</pre>
                        <div className="header-display">
                          <p className="display">May 2025</p>
                        </div>
                        <pre className="right">▶</pre>
                      </header>
                      <div className="week">
                        <div>Su</div>
                        <div>Mo</div>
                        <div>Tu</div>
                        <div>We</div>
                        <div>Th</div>
                        <div>Fr</div>
                        <div>Sa</div>
                      </div>
                      <div className="days"><div></div><div></div><div></div><div></div><div data-date="Thu May 01 2025">1</div><div data-date="Fri May 02 2025">2</div><div data-date="Sat May 03 2025">3</div><div data-date="Sun May 04 2025">4</div><div data-date="Mon May 05 2025">5</div><div data-date="Tue May 06 2025">6</div><div data-date="Wed May 07 2025">7</div><div data-date="Thu May 08 2025">8</div><div data-date="Fri May 09 2025">9</div><div data-date="Sat May 10 2025">10</div><div data-date="Sun May 11 2025">11</div><div data-date="Mon May 12 2025">12</div><div data-date="Tue May 13 2025">13</div><div data-date="Wed May 14 2025">14</div><div data-date="Thu May 15 2025">15</div><div data-date="Fri May 16 2025">16</div><div data-date="Sat May 17 2025">17</div><div data-date="Sun May 18 2025">18</div><div data-date="Mon May 19 2025">19</div><div data-date="Tue May 20 2025">20</div><div data-date="Wed May 21 2025">21</div><div data-date="Thu May 22 2025">22</div><div data-date="Fri May 23 2025">23</div><div data-date="Sat May 24 2025">24</div><div data-date="Sun May 25 2025" className="current-date">25</div><div data-date="Mon May 26 2025">26</div><div data-date="Tue May 27 2025">27</div><div data-date="Wed May 28 2025">28</div><div data-date="Thu May 29 2025">29</div><div data-date="Fri May 30 2025">30</div><div data-date="Sat May 31 2025">31</div></div>
                    </div>
                    <div className="display-selected">
                      <p className="selected"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                  Events
                </button>
              </h2>
              <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <strong>This is the second item's accordion body.</strong>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseThree">
                  Activities
                </button>
              </h2>
              <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-3 col-md-2 timeday text-end">
                      <label className="time">8:00</label><br />
                      <label className="day">Tue</label>
                    </div>
                    <div className="col-9 col-md-10 pl-0">
                      <p className="left_dotted_line"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 col-md-2 timeday text-end">
                      <label className="time">19:10</label><br />
                      <label className="day">Tue</label>
                    </div>
                    <div className="col-9 col-md-10 pl-0">
                      <p className="left_dotted_line"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SamsDashboard;
