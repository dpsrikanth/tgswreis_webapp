import { useLocation } from 'react-router'
import { useEffect, useState, useRef, use } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { _fetch } from '../libs/utils';
import Select from 'react-select';
import { Tuple } from '@reduxjs/toolkit';
import DataTable, { Alignment } from 'react-data-table-component';

const AdminDashboard = () => {
    // read from location state
    const location = useLocation();
    const navigate = useNavigate();
    const zones = useSelector((state) => state.userappdetails.ZONES_LIST || []);
    const [districts, setDistricts] = useState(useSelector((state) => state.userappdetails.DISTRICT_LIST) || []);
    const schools = useSelector((state) => state.userappdetails.SCHOOL_LIST);
    const dpcList = useSelector((state) => state.userappdetails.DPC_LIST);
    const loginStatus = useRef(false);
    const [admissionsData, setAdmissionsData] = useState([]);
    const [intialData, setInitialData] = useState({
        TotalSeatsAdmitted: undefined,
        TotalSanctionedSeats: undefined,
    });
    const [tsmessData, setTsMessData] = useState(0);
    const [samsData, setSamsData] = useState({
        HostelAttendance: undefined,
        HostelStudentsTotal: undefined,
    });
    const dataFetched = useRef(false);
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const [selectedZoneId, setSelectedZoneId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedCaste, setSelectedCaste] = useState('');
    const [tsmessSearch, setTsmessSearch] = useState("");

    useEffect(() => {
        if (!loginStatus.current) {
            if (location.state) {
                if (location.state.type === "success") {
                    toast.success(location.state.message);
                } else if (location.state.type === "error") {
                    toast.error(location.state.message);
                }
            }
            loginStatus.current = true;
        }
    }, [location.state]);


    //below function calling twice is not good practice, it should be called once
    const fetchStudentAdmissionTotal = async () => {
        try {
            _fetch("admissiontotals", null, false, token).then(res => {
                if (res.status === "success") {
                    setInitialData({
                        TotalSeatsAdmitted: res.data[0].TotalSeatsAdmitted || 0,
                        TotalSanctionedSeats: res.data[0].TotalSanctionedSeats || 0,
                    });
                } else {
                    //toast.error("Failed to fetch student admission data.");
                }
            });
        } catch (error) {
            console.error("Error fetching student admission data:", error);
            toast.error("Failed to fetch student admission data.");
        }
    }
    //call this function when zone is changed
    useEffect(() => {
        //console.log("Selected Zone ID changed:", selectedZoneId);
        if (selectedZoneId) {
            fetchDistrictsByZone(selectedZoneId);
        }
    }, [selectedZoneId]);

    const fetchDistrictsByZone = async (zoneId) => {
        try {
            _fetch(`zonedistricts`, null, false, token, '$zoneId$', zoneId).then(res => {
                if (res.status === "success") {
                    //load districts from response
                    //console.log("Districts fetched successfully:", res.data);
                    const districtOptions = res.data.map(district => ({
                        value: district.DistrictId,
                        label: district.DistrictName
                    }));
                    setDistricts(districtOptions);
                } else {
                    //toast.error("Failed to fetch districts.");
                }
            });
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Failed to fetch districts.");
        }
    };

    const fetchSamsData = async () => {
        try {
            _fetch("hostelattendance", null, false, token).then(res => {
                if (res.status === "success") {
                    setSamsData({
                        HostelStudentsTotal: res.data[0].HostelStudentsTotal || 0,
                        HostelAttendance: res.data[0].HostelAttendance || 0,
                    });
                } else {
                    setSamsData({
                        HostelStudentsTotal: 0,
                        HostelAttendance: 0,
                    });
                    //toast.error("Failed to fetch hostel attendance data.");
                }
            });
        } catch (error) {
            console.error("Error fetching hostel attendance data:", error);
            toast.error("Failed to fetch hostel attendance data.");
        }

    };
    const fetchTsMessData = async () => {
        try {
            _fetch("tsmess", null, false, token).then(res => {
                if (res.status === "success") {
                    setTsMessData(res.data[0].TotalMessAttendance || 0);
                } else {
                    setTsMessData(0);
                }
            });
        } catch (error) {
            console.error("Error fetching TS Mess data:", error);
            toast.error("Failed to fetch TS Mess data.");
        }
    };

    const fetchAdmissions = async () => {
        //console.log("Fetching admissions data with selectedCategory:", selectedCategory);
        //console.log("Selected Zone ID:", selectedZoneId);
        //console.log("Selected District:", selectedDistrict);
        //console.log("Selected School:", selectedSchool);
        if (selectedCategory !== "Student Admission") return;
        try {
            // Prepare params as needed for your API            
            const payload = {
                ZoneId: parseInt(selectedZoneId),
                ClassGroup: selectedSchool,
                DistrictId: parseInt(selectedDistrict),
            };
            // You may need to adjust _fetch usage to pass params
            _fetch("admissions", payload, false, token).then(res => {
                if (res.status === "success") {
                    setAdmissionsData(res.data);
                    //console.log("Admissions data fetched successfully:", res.data);
                }
            });
        } catch (error) {
            console.error("Error fetching student admission data:", error);
            toast.error("Failed to fetch student admission data.");
        }
    };

    useEffect(() => {
        // Fetch admissions data when any of the filters change
        if (selectedZoneId && selectedCategory ) {
            fetchAdmissions();
        }
    }, [selectedZoneId, selectedCategory, selectedDistrict, selectedSchool]);
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        // ...existing code...
        if (!dataFetched.current) {
            fetchStudentAdmissionTotal();
            fetchSamsData();                        
            dataFetched.current = true;
        }
    }, [token]);
    const casteOptions = [
        { value: '', label: 'Select All' },
        { value: 'ST', label: 'ST' },
        { value: 'SC', label: 'SC' },
        { value: 'BC', label: 'BC' },
        { value: 'OC', label: 'OC' },
        { value: 'SCC', label: 'SCC' },
        { value: 'MINOR', label: 'MINOR' },
    ];
    // Add schoolOptions for the school dropdown
    const schoolOptions = [
        { value: '', label: 'All' },
        { value: 'Class 5', label: 'Class 1' },
        { value: 'Class 6', label: 'Class 2' },
        { value: 'Class 7', label: 'Class 3' },
        { value: 'Class 8', label: 'Class 4' },
        { value: 'Class 9', label: 'Class 5' },
        { value: 'Class 10', label: 'Class 5 - 10' },
        { value: 'BI.P.C-I YEAR', label: 'BI.P.C-I YEAR' },
        { value: 'BI.P.C-II YEAR', label: 'BI.P.C-II YEAR' },
        { value: 'M.P.C-I YEAR', label: 'M.P.C-I YEAR' },
        { value: 'M.P.C-II YEAR', label: 'M.P.C-II YEAR' },
        { value: 'A.C.P -I YEAR', label: 'A.C.P -I YEAR' },
        { value: 'A.C.P -II YEAR', label: 'A.C.P -II YEAR' },
        { value: 'M.L.T-I YEAR', label: 'M.L.T-I YEAR' },
        { value: 'M.L.T-II YEAR', label: 'M.L.T-II YEAR' },
    ]    
    const tsmessColumns = [        
        { name: 'Zone', selector: row => row.ZoneName, sortable: true, minWidth: '120px' },
        { name: 'Class', selector: row => row.ClassGroup, sortable: true, minWidth: '120px' },
        { name: 'District', selector: row => row.DistrictName, sortable: true, minWidth: '120px' },
        { name: 'Total Strength', selector: row => row["Total Strength"], sortable: true, align: 'center' },
        { name: 'SC(S)', selector: row => row.SCSanctionedSeats, sortable: true ,align: 'center'},

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

    const filteredTsmessData = Array.isArray(tsmessData)
        ? tsmessData.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(tsmessSearch.toLowerCase())
            )
        )
        : [];    
    const filteredAdmissionsRows = Array.isArray(admissionsData)
        ? addTotalToRows(admissionsData).filter(row => {
            const classCategoryMatch = !selectedSchool || selectedSchool === '' || row.ClassGroup === selectedSchool;
            const districtMatch = !selectedDistrict || selectedDistrict === '' || row.DistrictId === selectedDistrict || row.DistrictName === selectedDistrict;
            const searchMatch = Object.values(row).some(val => String(val).toLowerCase().includes(tsmessSearch.toLowerCase()));
            return classCategoryMatch && districtMatch && searchMatch;
        })
        : [];
    const admissionsTotalRow = getAdmissionsTotalsRow(filteredAdmissionsRows);

    // Custom styles for DataTable header
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

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-sm-9">
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <div className="card-box blue-bg shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6>Student Admissions</h6>
                                        <h4 className="fw-bold">
                                            <large>{intialData.TotalSeatsAdmitted}</large> / <small>{intialData.TotalSanctionedSeats}</small>
                                        </h4>
                                    </div>
                                    <img src="img/admission_icon.png" alt="Admission Icon" />
                                </div>
                                <hr />
                                {/* <div className="row">
                                    <div className="col-md-12">
                                        <p className="iconRight"><span>Seats Vacant</span> <i className="bi bi-arrow-right"></i></p>
                                        <div className="row">
                                            <div className="col-4 brd-rgt">
                                                <label className="labeltext">School</label>
                                                <p className="labeltxtcolor">250</p>
                                            </div>
                                            <div className="col-4 brd-rgt">
                                                <label className="labeltext">Intermediate</label>
                                                <p className="labeltxtcolor">74</p>
                                            </div>
                                            <div className="col-4">
                                                <label className="labeltext">Degree</label>
                                                <p className="labeltxtcolor">176</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card-box purple-bg shadow-sm">
                                <a onClick={() => navigate("/samsdashboard")}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6>SAMS</h6>
                                            <h4 className="fw-bold">
                                                <large>{samsData.HostelAttendance}</large> / <small>{samsData.HostelStudentsTotal}</small>
                                            </h4>
                                        </div>
                                        <img src="img/attendence_icon.png" alt="Attendance Icon" />
                                    </div>
                                    <hr />
                                    {/* <div className="row">
                                        <div className="col-md-12">
                                            <p className="iconRight"><span>Absent</span> <i className="bi bi-arrow-right"></i></p>
                                            <div className="row">
                                                <div className="col-4 brd-rgt">
                                                    <label className="labeltext">School</label>
                                                    <p className="labeltxtcolor">250</p>
                                                </div>
                                                <div className="col-4 brd-rgt">
                                                    <label className="labeltext">Intermediate</label>
                                                    <p className="labeltxtcolor">74</p>
                                                </div>
                                                <div className="col-4">
                                                    <label className="labeltext">Degree</label>
                                                    <p className="labeltxtcolor">176</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card-box pink-bg shadow-sm">
                                <a onClick={() => navigate("/tsmess")}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6>TS Mess</h6>
                                            <h4 className="fw-bold">
                                                <large>{tsmessData}</large><small>%</small>
                                            </h4>
                                        </div>
                                        <img src="img/mess_icon.png" alt="Mess Icon" />
                                    </div>
                                    <hr />
                                    {/* <div className="row">
                                        <div className="col-md-12">
                                            <p className="iconRight"><span>Absent</span> <i className="bi bi-arrow-right"></i></p>
                                            <div className="row">
                                                <div className="col-4 brd-rgt">
                                                    <label className="labeltext">Breakfast</label>
                                                    <p className="labeltxtcolor">98</p>
                                                </div>
                                                <div className="col-4 brd-rgt">
                                                    <label className="labeltext">Lunch</label>
                                                    <p className="labeltxtcolor">200</p>
                                                </div>
                                                <div className="col-4">
                                                    <label className="labeltext">Supper</label>
                                                    <p className="labeltxtcolor">31</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </a>
                            </div>
                        </div>

                    </div>
                    <div>
                        <h5 className="text-purple fw-bold mb-3 maroon">Zonal Wise Report</h5>
                        <div className="row gy-3">

                        </div>
                        <div className="card zonedetails">
                            <div className="row">
                                <div className="col-sm-6 g-3 mb-3">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Select Zone</label>
                                        <div className="col-sm-8">
                                            <Select
                                                options={Array.isArray(zones) ? zones.map(zone => ({
                                                    value: String(zone.ZoneCode),
                                                    label: zone.ZoneName
                                                })) : []}
                                                isClearable={true}
                                                isRtl={false}
                                                isSearchable={true}
                                                isLoading={false}
                                                value={Array.isArray(zones)
                                                    ? zones.map(zone => ({ value: String(zone.ZoneCode), label: zone.ZoneName }))
                                                        .find(opt => opt.value === String(selectedZoneId)) || null
                                                    : null}
                                                onChange={option => setSelectedZoneId(option ? String(option.value) : '')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 g-3 mb-3">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Select Category</label>
                                        <div className="col-sm-8">
                                            <Select
                                                options={[
                                                    { value: '', label: 'Select Category' },
                                                    { value: 'Student Admission', label: 'Student Admission' },
                                                    { value: 'Vacancies', label: 'Vacancies' },
                                                    { value: 'Student Attendance', label: 'Student Attendance' },
                                                    { value: 'TS Mess', label: 'TS Mess' }
                                                ]}
                                                isClearable={true}
                                                isSearchable={true}
                                                placeholder="Select Category"
                                                value={{ value: selectedCategory, label: selectedCategory || 'Select Category' }}
                                                onChange={option => {
                                                    const value = option ? option.value : '';                                                    
                                                    setSelectedCategory(value);                                                   
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 g-3 mb-3">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Select District</label>
                                        <div className="col-sm-8">
                                            {/* Districts Select */}
                                            <Select
                                                options={Array.isArray(districts) ? [{ value: '', label: 'All' }, ...districts] : [{ value: '', label: 'All' }]}
                                                isClearable={true}
                                                isSearchable={true}
                                                placeholder="Select District"
                                                value={districts.find(opt => opt.value === selectedDistrict) || { value: '', label: 'All' }}
                                                onChange={option => {
                                                    const value = option ? option.value : '';
                                                    setSelectedDistrict(value);                                                   
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 g-3 mb-3">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Class Category</label>
                                        <div className="col-sm-8">
                                            <Select
                                                options={schoolOptions}
                                                isClearable={true}
                                                isSearchable={true}
                                                placeholder="Select School"
                                                value={schoolOptions.find(opt => opt.value === selectedSchool) || schoolOptions[0]}
                                                onChange={option => {
                                                    const value = option ? option.value : '';
                                                    setSelectedSchool(value);                                                        
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div className="shadow-sm">
                                    {selectedCategory === 'Student Admission' && (
                                        <div id="categoryTableContainer">
                                            <div className="table-header">
                                                <h5><span className="pink fw-bold">Students Admission</span></h5>
                                                <div className="table-tools">
                                                    {/* <select className="form-select">
                                                        <option>Day Wise</option>
                                                        <option>Weekly</option>
                                                        <option>Monthly</option>
                                                        <option>Yearly</option>
                                                    </select> */}
                                                    <img src="img/download_icon.png" className="download_img" />
                                                </div>
                                            </div>
                                            <div className="table-responsive">
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
                                                {admissionsTotalRow && (
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered table-striped" style={{ marginTop: '-10px' }}>
                                                            <thead>
                                                                <tr style={{ background: '#6a5acd', color: 'white', fontWeight: 'bold' }}>
                                                                    <th colSpan={2} style={{width:"100px"}}></th>
                                                                    <th>SC(S)</th>
                                                                    <th>SC(A)</th>
                                                                    <th>ST(A)</th>
                                                                    <th>ST(S)</th>
                                                                    <th>BC(A)</th>
                                                                    <th>BC(S)</th>
                                                                    <th>OC(A)</th>
                                                                    <th>OC(S)</th>
                                                                    <th>SCC(A)</th>
                                                                    <th>SCC(S)</th>
                                                                    <th>MINOR(A)</th>
                                                                    <th>MINOR(S)</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style={{ fontWeight: 'bold', background: '#f2f2f2' }}>
                                                                    <td>{admissionsTotalRow.ZoneName}</td>
                                                                    <td>{admissionsTotalRow.ClassGroup}</td>
                                                                    <td>{admissionsTotalRow.SCSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.SCAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.STAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.STSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.BCAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.BCSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.OCAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.OCSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.SCCAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.SCCSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.MINORAdmissionsSeats}</td>
                                                                    <td>{admissionsTotalRow.MINORSanctionedSeats}</td>
                                                                    <td>{admissionsTotalRow.Totalseats}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mess_mar">

                        <div className="col-md-4">
                            <div className="card mess_attendance">
                                <div className="heading">Mess Attendance</div>
                                <div className="mess-bar">
                                    <div className="label"><span>Breakfast</span><span>81%</span></div>
                                    <div className="bar">
                                        <div className="fill breakfast"></div>
                                    </div>
                                </div>
                                <div className="mess-bar">
                                    <div className="label"><span>Lunch</span><span>59%</span></div>
                                    <div className="bar">
                                        <div className="fill lunch"></div>
                                    </div>
                                </div>
                                <div className="mess-bar">
                                    <div className="label"><span>Dinner</span><span>67%</span></div>
                                    <div className="bar">
                                        <div className="fill dinner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-3">
                    <div className="accordion" id="accordionPanelsStayOpenExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
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
                                                    <p className="display">""</p>
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
                                            <div className="days"></div>
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
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                                    aria-controls="panelsStayOpen-collapseTwo">
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
                                <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseThree">
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
                                            <p className="left_dotted_line"> It is a long established fact that a reader will be distracted by the
                                                readable content of a page when looking at its layout</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-2 timeday text-end">
                                            <label className="time">19:10</label><br />
                                            <label className="day">Tue</label>
                                        </div>
                                        <div className="col-9 col-md-10 pl-0">
                                            <p className="left_dotted_line"> It is a long established fact that a reader will be distracted by the
                                                readable content of a page when looking at its layout</p>
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

export default AdminDashboard;