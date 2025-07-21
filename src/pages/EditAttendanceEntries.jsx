import React,{ useEffect,useRef,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { _fetch } from '../libs/utils';
const EditAttendanceEntries = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
const navigate = useNavigate();
const dataFetched = useRef(false);
const [selectedSchool,setSelectedSchool] = useState('');
const [selectedMonth,setSelectedMonth] = useState('');
const [selectedYear,setSelectedYear] = useState('');
const [attendanceDetails,setAttendanceDetails] = useState('');
const [schoolList,setSchoolList] = useState([]);
const [showModal,setShowModal] = useState(false);
const [totalAbsent,setTotalAbsent] = useState('');
const [totalPresent,setTotalPresent] = useState('');
const [totalSick,setTotalSick] = useState('');
const [totalGuest,setTotalGuest] = useState('');
const [selectedRow,setSelectedRow] = useState(null);

useEffect(() => {
if(schoolList && Array.isArray(schoolList)){
    setSchoolList(schoolsList)
}
},[schoolsList])


const schoolOptions = schoolList.map((school) => ({
    value: school.SchoolCode,
    label: school.PartnerName.replace('TGSWREIS','')
}))



const generateMonthYearOptions = () => {
    const options = [];
    const now = new Date();

    for(let i = 0;i < 2; i++) {
        const date = new Date(now.getFullYear(),now.getMonth() - i,1);
        const label = date.toLocaleString('default',{month: 'long',year: 'numeric'});
        const value = `${date.getMonth() + 1} - ${date.getFullYear()}` ;
        options.push({label,value});
    }
    return options;
};

const monthYearOptions = generateMonthYearOptions();

const getEditAttendanceEntries = async() => {

    const payload = {
        SchoolCode: selectedSchool,
        month: `${selectedYear}-${selectedMonth.padStart(2, '0')}`.trim()
    }

     try {
 _fetch('editattendanceentries',payload,false,token).then(res => {
        if(res.status === 'success') {
            setAttendanceDetails(res.data);
        } else {
            console.error(res.message);
            setAttendanceDetails([]);
        }
    })
     } catch (error) {
        console.log('Error fetching Edit Attendance Entries:',error)
     }
   
}


useEffect(() => {
if(!token) {
    navigate('/login');
}

},[token])


useEffect(() => {
    getEditAttendanceEntries();

},[selectedMonth,selectedYear])


useEffect(() => {
    if(selectedRow){
     setTotalPresent(selectedRow.TotalPresent);
     setTotalAbsent(selectedRow.TotalAbsent);
     setTotalGuest(selectedRow.TotalGuest);
     setTotalSick(selectedRow.TotalSick);
    }
    
},[selectedRow])

const date = new Date(2000, parseInt(selectedMonth,10) - 1);
const monthName = date.toLocaleString('default', {month: 'long'});

  return (
    <>
          <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/samsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle',cursor:'pointer'}}></i></a>Edit Attendance Entries</h6>
     
      <div className="row gy-3">

        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="row gy-3">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="col-form-label">Select School</label>
                            </div>
                            <div className="col-sm-8">
                               <Select id='schooldisp'
                               isClearable={true}
                               isSearchable={true}
                               placeholder="Select School"
                               options={schoolOptions}
                               onChange={(option) => setSelectedSchool(option ? option.value : '')
                                }
                               />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="col-form-label">Select Month</label>
                            </div>
                            <div className="col-sm-8">
                                <Select id='month'
                                isClearable={true}
                                isSearchable={true}
                                placeholder="Select Month"
                                options={monthYearOptions}
                                onChange={(option) => {if(option) {
                                 const [month,year] = option.value.split('-');
                                 setSelectedMonth(month);
                                 setSelectedYear(year);
                                } else {
                                    setSelectedMonth('');
                                    setSelectedYear('');
                                }
                            }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className='col-sm-12'>
                        <button className='btn btn-primary' onClick={getEditAttendanceEntries}>Submit</button>
                    </div> */}
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Attendance Entries for the Month of {Array.isArray(attendanceDetails) && attendanceDetails.length > 0 ? (<>{monthName} {selectedYear}</>) :(null)} </span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>School Code</th>
                                <th>School Name</th>
                                <th>Date</th>
                                <th>Total Strength</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Sick</th>
                                <th>Guest</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            {Array.isArray(attendanceDetails) && attendanceDetails.length > 0 ? (
                                attendanceDetails.map((item,index) => (
                                    <tr key={index}>
                                        <td>{item.SchoolCode}</td>
                                        <td>{item.PartnerName}</td>
                                        <td>{item.TodayDate ? new Date(item.TodayDate).toDateString() : "-"}</td>
                                        <td>{item.TotalStrength}</td>
                                        <td>{item.TotalPresent}</td>
                                        <td>{item.TotalAbsent}</td>
                                        <td>{item.TotalSick}</td>
                                        <td>{item.TotalGuest}</td>
                                        <td><button className='btn btn-warning' onClick={() => {
                                            setShowModal(true);
                                            setSelectedRow(item);

                                        }}>Edit</button></td>
                                    </tr>
                                ))
                            ) : (<tr>
                                <td colSpan={9} className='text-center'>No Data Available</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        
      </div>

{showModal && selectedRow && ( <div className="modal show fade d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Attendance Entry for <span className='fw-bold'>{selectedRow.TodayDate ? new Date(selectedRow.TodayDate).toDateString() : "-"}</span> </h1>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Total Strength</label>
                        <input type="number" value={selectedRow.TotalStrength} disabled className="form-control" />
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Present</label>
                        <input type="number" value={totalPresent} onChange={(e) => setTotalPresent(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Absent</label>
                        <input type="number" value={totalAbsent} onChange={(e) => setTotalAbsent(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Sick</label>
                        <input type="number" value={totalSick} onChange={(e) => setTotalSick(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-4">
                         <label className="form-label">Guest</label>
                        <input type="number" value={totalGuest} onChange={(e) => setTotalGuest(e.target.value)} className="form-control" />
                    </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary">Update</button>
            </div>
          </div>
        </div>
      </div>)}
       
    </>
  )
}

export default EditAttendanceEntries