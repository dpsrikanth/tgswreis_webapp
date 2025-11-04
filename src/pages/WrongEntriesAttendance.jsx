import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const WrongEntriesAttendance = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
const navigate = useNavigate();
const [selectedSchool,setSelectedSchool] = useState('');
const [selectedSchoolId,setSelectedSchoolId] = useState('');
const [showModal,setShowModal] = useState(false);
const [schoolList,setSchoolList] = useState([]);
const [attendanceEntries,setAttendanceEntries] = useState([]);
const [mealDay,setMealDay] = useState('');
const [selectedRow,setSelectedRow] = useState(null)
const [cat1Present,setCat1Present] = useState('');
const [cat2Present,setCat2Present] = useState('');
const [cat3Present,setCat3Present] = useState('');
const [cat4Present,setCat4Present] = useState('');
const [cat1Guest,setCat1Guest] = useState('');
const [cat2Guest,setCat2Guest] = useState('');
const [cat3Guest,setCat3Guest] = useState('');
const [cat4Guest,setCat4Guest] = useState('');

useEffect(() => {
if(schoolList && Array.isArray(schoolList)){
    setSchoolList(schoolsList)
}
},[schoolsList])


const schoolOptions = schoolList.map((school) => ({
    value: school.SchoolCode,
    label: school.PartnerName.replace('TGSWREIS',''),
    schoolid: school.SchoolID
}))



const fetchAttendanceEntries = async () => {
  try {
     
    const payload = {MealDay: mealDay,SchoolId: selectedSchoolId}

    _fetch('wrongattendanceentries',payload,false,token).then(res => {
      if(res.status === 'success'){
        setAttendanceEntries(res.data);
        toast.success(res.message)
      } else {
        toast.error('Attendance Entries not fetched successfully')
      }
    })

  } catch (error){
    console.log('Error fetching attendance entries',error)
  }
}


const UpdateAttendanceEntries = async () => {
  try {

    const payload = {MealDay:mealDay,SchoolId:selectedSchoolId,Cat1Present:cat1Present,Cat2Present:cat2Present,Cat3Present:cat3Present,Cat4Present:cat4Present,Cat1Guest:cat1Guest,Cat2Guest:cat2Guest,Cat3Guest:cat3Guest,Cat4Guest:cat4Guest}

    _fetch('updatewrongattendance',payload,false,token).then(res => {
       
        if(res.status === 'success'){
        setShowModal(false);
        toast.success(res.message);
        fetchAttendanceEntries();
        setCat1Present('');
        setCat2Present('');
        setCat3Present('');
        setCat4Present('');
        setCat1Guest('');
        setCat2Guest('');
        setCat3Guest('');
        setCat4Guest('');
        setSelectedRow('');
      } else {
        toast.error('Error updating Attendance')
      }
   
  })} catch (error){
    console.error('Error Updating Wrong Entries Attendance',error);
  }
}


useEffect(() => {
if(selectedRow){
  setCat1Present(selectedRow.Cat1Present);
  setCat2Present(selectedRow.Cat2Present);
  setCat3Present(selectedRow.Cat3Present);
  setCat4Present(selectedRow.Cat4Present);
  setCat1Guest(selectedRow.Cat1Guest);
  setCat2Guest(selectedRow.Cat2Guest);
  setCat3Guest(selectedRow.Cat3Guest);
  setCat4Guest(selectedRow.Cat4Guest);
}  

},[selectedRow])



  return (
     <>
         <ToastContainer />
          <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/samsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle',cursor:'pointer'}}></i></a>Wrong Entries Attendance</h6>
     
      <div className="row gy-3">

        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="row gy-3">
                    <div className="col-sm-5">
                        <div className="row">
                            <div className="col-sm-5">
                                <label className="col-form-label">Select School</label>
                            </div>
                            <div className="col-sm-7">
                               <Select id='schooldisp'
                               isClearable={true}
                               isSearchable={true}
                               placeholder="Select School"
                               options={schoolOptions}
                               onChange={(option) => {setSelectedSchool(option ? option.value : '')
                                 setSelectedSchoolId(option ? option.schoolid : '')
                               }
                                }
                               />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="col-form-label">Select Date</label>
                            </div>
                            <div className="col-sm-8">
                               <input type='date' value={mealDay} onChange={(e) => setMealDay(e.target.value)} className='form-control' />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-3'>
                      <button className='btn btn-primary' onClick={() => fetchAttendanceEntries()}>Fetch</button>
                    </div>
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Attendance Entries for the Selected Date</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>School Code</th>
                                <th>School Name</th>
                                <th>Date</th>
                                <th>Total Strength</th>
                                <th>Cat 1 Present</th>
                                <th>Cat 2 Present</th>
                                <th>Cat 3 Present</th>
                                <th>Cat 4 Present</th>
                                <th>Cat 1 Guest</th>
                                <th>Cat 2 Guest</th>
                                <th>Cat 3 Guest</th>
                                <th>Cat 4 Guest</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                          {attendanceEntries.map((item,index) => (
                            <tr key={index}>
                              <td>{item.SchoolCode}</td>
                              <td>{item.PartnerName}</td>
                              <td>{item.MealDay.split('T')[0]}</td>
                              <td>{item.SchoolStregth}</td>
                              <td>{item.Cat1Present}</td>
                              <td>{item.Cat2Present}</td>
                              <td>{item.Cat3Present}</td>
                              <td>{item.Cat4Present}</td>
                              <td>{item.Cat1Guest}</td>
                              <td>{item.Cat2Guest}</td>
                              <td>{item.Cat3Guest}</td>
                              <td>{item.Cat4Guest}</td>
                              <td><button className='btn btn-primary btn-sm' onClick={
                                () => {
                                  setShowModal(true);
                                  setSelectedRow(item);
                                }}>Edit</button></td>
                            </tr>
                          ))}
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
              <h1 className="modal-title fs-5">Edit Attendance Entry for <span className='fw-bold'>{selectedRow.MealDay ? new Date(selectedRow.MealDay).toDateString() : "-"}</span> </h1>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="row gy-3">
                    <div className="col-sm-2">
                        <label className="form-label">Total Strength</label>
                        <input type="number" value={selectedRow.SchoolStregth} disabled  className="form-control" />
                    </div>
                    <div className="col-sm-2">
                        <label className="form-label">Cat 1 Present</label>
                        <input type="number" value={cat1Present} onChange={(e) => setCat1Present(e.target.value)}  className="form-control" />
                    </div>
                    <div className="col-sm-2">
                        <label className="form-label">Cat 2 Present</label>
                        <input type="number" value={cat2Present} onChange={(e) => setCat2Present(e.target.value)}  className="form-control" />
                    </div>
                    <div className="col-sm-2">
                        <label className="form-label">Cat 3 Present</label>
                        <input type="number" value={cat3Present} onChange={(e) => setCat3Present(e.target.value)}  className="form-control" />
                    </div>
                     <div className="col-sm-2">
                        <label className="form-label">Cat 4 Present</label>
                        <input type="number" value={cat4Present} onChange={(e) => setCat4Present(e.target.value)}  className="form-control" />
                    </div>
                    <div className='col-sm-2'></div>
                    <div className="col-sm-2">
                        <label className="form-label">Cat 1 Guest</label>
                        <input type="number" value={cat1Guest} onChange={(e) => setCat1Guest(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-2">
                         <label className="form-label">Cat 2 Guest</label>
                        <input type="number" value={cat2Guest} onChange={(e) => setCat2Guest(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-2">
                         <label className="form-label">Cat 3 Guest</label>
                        <input type="number" value={cat3Guest} onChange={(e) => setCat3Guest(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-2">
                         <label className="form-label">Cat 4 Guest</label>
                        <input type="number" value={cat4Guest} onChange={(e) => setCat4Guest(e.target.value)}  className="form-control" />
                    </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => UpdateAttendanceEntries()}>Update</button>
            </div>
          </div>
        </div>
      </div>)}
       
    </>
  )
}

export default WrongEntriesAttendance