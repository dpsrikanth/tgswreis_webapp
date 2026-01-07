import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';
import {format,startOfMonth,endOfMonth} from 'date-fns'


const TourDiarySchedule = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
const UserId = useSelector((state) => state.userappdetails.profileData.Id);
const requiredVisits = useSelector((state) => state.userappdetails.profileData.MonthlyVisitTarget);
const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId);
const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
const navigate = useNavigate();
const [officersList,setOfficersList] = useState([])
const [selectedOfficer,setSelectedOfficer] = useState('');
const [visitDate,setVisitDate] = useState('');
const [selectedSchool,setSelectedSchool] = useState('');
const [selectedSchoolId,setSelectedSchoolId] = useState('');
const [purpose,setPurpose] = useState('');
const [schoolList,setSchoolList] = useState([]);
const [tourSchedule,setTourSchedule] = useState([]);
const [tourRows,setTourRows] = useState([]);

useEffect(() => {

  if(!schoolsList || !Array.isArray(schoolsList)) return;

  let filtered = schoolsList;

  if(UserType === 'DCO'){
    filtered = schoolsList.filter(s => s.DistrictId === DistrictId);
  } else if (UserType === 'Admin') {
    filtered = schoolsList.filter(s => s.ZoneId === ZoneId)
  } else {
    filtered = schoolsList
  }

  setSchoolList(filtered)
    

},[schoolsList,UserType,ZoneId,DistrictId])


const schoolOptions = schoolList.map((school) => ({
    value: school.SchoolID,
    label: school.PartnerName.replace('TGSWREIS',''),
    schoolcode: school.SchoolCode
}))


const getStatus = (status) => {
    switch(status){
        case 1: 
        return {label: "Planned", badge: 'badge bg-primary'};
        
        case 2:
            return {label: 'Visited (Pending Proof)', badge: 'badge bg-warning text-dark'}

        case 3:
            return { label: "Completed (Proof Uploaded)", badge: "badge bg-success" };

        case 4:
            return { label: "Not Visited", badge: "badge bg-danger" };

        case 5:
            return { label: "Cannot Visit", badge: "badge bg-secondary" };

        default:
      return { label: "Unknown", badge: "badge bg-dark" };
    }
    
}


const fetchOfficersList = async () => {
    try {
        const payload = {UserId}
        _fetch('getofficerslist',payload,false,token).then(res => {
          if(res.status === 'success'){
            setOfficersList(res.data[0]);
          } else {
            toast.error('Error fetching Officers List')
          }
        })

    } catch (error){
        console.error('Error fetching Officers List',error)
    }
}

// const CreateTourSchedule = async () => {
//     try {

//         const payload = {UserId,DateOfVisit:visitDate,SchoolId:selectedSchoolId,Purpose:purpose}

//         _fetch('createtourschedule',payload,false,token).then(res => {
//             if(res.status === 'success'){
//                 setSelectedOfficer('');
//                 setSelectedSchoolId('');
//                 setVisitDate('');
//                 setPurpose('');
//                 fetchTourSchedule();
//                 toast.success(res.message);
//             } else {
//                 toast.error(res.message);
//             }
//         })

//     } catch (error) {
//         console.error('Error creating new tour schedule',error)
//     }
// }


// const fetchTourSchedule = async () => {
//     try {

//         _fetch('tourschedule',null,false,token).then(res => {
//             if(res.status === 'success'){
//                 setTourSchedule(res.data)
//             }else{
//                 toast.error(res.message)
//             }
//         })

//     } catch(error){
//         console.error('Error fetching Tour Schedule',error)
//     }
// }







useEffect(() => {
    const initialRows = Array.from({length: requiredVisits}, () => ({
      TourDiaryId: null,
      VisitDate: '',
      SchoolId: '',
      Purpose: ''
    })) ;

    setTourRows(initialRows);
},[requiredVisits]);

const updateRow = (index, field, value) => {
    const updated = [...tourRows];
    updated[index][field] = value;
    setTourRows(updated);
};

const removeRow = (index) => {
    const updated = [...tourRows];
    updated.splice(index, 1);
    setTourRows(updated);
};



const fetchTourScheduleNew = async () => {
    if(!UserId) return;
  try{
     const payload = {UserId}
    _fetch("gettourschedulenew",payload,false,token).then(res => {
      if(res.status === 'success'){
        const savedRows = res.data || [];

        const filledRows = savedRows.map(r => ({
          TourDiaryId: r.TourDiaryId,
          VisitDate: r.DateOfVisit.split('T')[0],
          SchoolId: r.SchoolId,
          Purpose: r.Purpose || '',
          Status: r.Status
        }));

        const emptyRow = {
          TourDiaryId: null,
          VisitDate: '',
          SchoolId: '',
          Purpose: '',
          Status: 1
        };

        while(filledRows.length < requiredVisits){
            filledRows.push({...emptyRow});
        }
        setTourRows(filledRows);
      }
    })

  }  catch(error){
    console.error('Error fetching monthly tour schedule',error)
  }
}

const saveTourScheduleNew = async () => {
    if(!UserId) return;
    try{
    const payload = {UserId,Visits: tourRows}

    _fetch('monthlytourschedulenew',payload,false,token).then(res => {
        if(res.status === 'success'){
            toast.success(res.message);
            fetchTourScheduleNew();
        }else {
            toast.error(res.message);
        }
    })


    }catch(error){
     onsole.error("Error saving tour schedule", error);
      toast.error("Error saving schedule");
    }
}

  useEffect(() => {
    if (UserId) {
      fetchOfficersList();
      fetchTourScheduleNew();
    }
  }, [UserId]);

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const minDate = format(today,'yyyy-MM-dd');
const maxDate = format(endOfMonth(today),'yyyy-MM-dd');

const isRowLocked = (row) => {
  return row.Status === 3 || row.Status === 4
}



  return (
    <>
    
    <ToastContainer/>
     <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Inspection Schedule Management</h6>
     
      <div className="row gy-3">

        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Add New Inspection Schedule</h5>
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Officer Name</label>
                        {/* <select className="form-select" value={selectedOfficer} disabled onChange={(e) => setSelectedOfficer(e.target.value)}>
                            {
                                officersList.map((officer) => (
                                    <option key={officer.Id} value={officer.Id}>{officer.NominatedDCO}</option>
                                ))
                            }
                        </select> */}

                        <input type='text' className='form-control' disabled value={officersList.OfficerName} />
                    </div>
                     <div className='col-sm-3'>
                      <label className='form-label'>Designation</label>
                      <input type='text' className='form-control' disabled value={officersList.RoleDisplayName}></input>
                    </div>
                    {
                      (UserType === 'DCO' || UserType === 'SpecialOfficer') ? (<>
                       <div className='col-sm-3'>
                      <label className='form-label'>District</label>
                      <input type='text' className='form-control' disabled value={officersList.DistrictName}></input>
                    </div>
                      </>) : (<>
                       <div className='col-sm-3'>
                      <label className='form-label'>Zone</label>
                      <input type='text' className='form-control' disabled value={officersList.ZoneName}></input>
                    </div>
                      </>)
                    }
                   
                    <div className='col-sm-2'>
                      <label className='form-label'>Current Month</label>
                      <input type='text' className='form-control' disabled value={new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}></input>
                    </div>
                    {/* <div className="col-sm-4">
                        <label className="form-label">Visit Date</label>
                        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="form-control" />
                    </div> */}
                    {/* <div className="col-sm-4">
                        <label className="form-label">Select School</label>
                        <Select 
                        isClearable={true}
                        isSearchable={true}
                        placeholder='Select School'
                        options={schoolOptions}
                        onChange={(option) => {
                            setSelectedSchoolId(option ? option.value : '')
                        }}

                        />
                    </div> */}
                    {/* <div className="col-sm-4">
                        <label className="form-label">Purpose of Visit</label>
                        <textarea rows={2} className='form-control' value={purpose} onChange={(e) => setPurpose(e.target.value)}></textarea>
                    </div> */}
                    {/* <div className="col-sm-12">
                        <button className="btn btn-primary" onClick={() => {
                            CreateTourSchedule();
                        }}>Add to Schedule</button>
                    </div> */}
                   
                </div>
 <button 
  className='btn btn-secondary mt-3'
  onClick={() =>
    setTourRows([...tourRows, {
      VisitDate: "",
      SchoolId: "",
      Purpose: ""
    }])
  }
>
  + Add Additional Visit
</button>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Visit Date</th>
                            <th>Location/School</th>
                            <th>Purpose</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tourRows.map((row,index) => (
                            <tr key={index}>
                             <td>{index + 1}</td>
                             <td>
                                <input 
                                type='date' 
                                className='form-control' 
                                value={row.VisitDate}
                                min={minDate}
                                max={maxDate}
                                disabled = {isRowLocked(row)}
                                onChange = {(e) => updateRow(index,'VisitDate',e.target.value)}
                                 />
                             </td>
                             <td>
                                <Select 
        isClearable
        isSearchable
        options={schoolOptions}
        isDisabled = {isRowLocked(row)}
        value={schoolOptions.find(s => s.value === row.SchoolId) || null}
        onChange={(opt) => updateRow(index, "SchoolId", opt ? opt.value : "")}
      />
                             </td>
                             <td>
                                <textarea
        rows={2}
        className="form-control"
        value={row.Purpose}
        disabled = {isRowLocked(row)}
        onChange={(e) => updateRow(index, "Purpose", e.target.value)}
      />
                             </td>
                             <td>
                                  {/* REMOVE BUTTON ONLY FOR EXTRA ROWS */}
      {index >= requiredVisits && !isRowLocked(row) && row.Status !== 1 && (
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => removeRow(index)}
        >
          X
        </button>
      )}
                             </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
                <div className='text-center'>
                 <button className='btn btn-primary' onClick={() => saveTourScheduleNew()}>Save</button>
                </div>
                
                </div>
                </div>
                {/* <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Scheduled Tours</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Officer</th>
                                <th>Designation</th>
                                <th>Date</th>
                                <th>School</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(tourSchedule) && tourSchedule.length > 0 ? (
                            tourSchedule.map((item) => (
                                <tr key={item.TourDiaryId}>
                                    <td>{item.UserName}</td>
                                    <td>{item.RoleDisplayName}</td>
                                    <td>{item.DateOfVisit.split('T')[0]}</td>
                                    <td>{item.PartnerName}</td>
                                    <td>{item.Purpose}</td>
                                    <td><span className={getStatus(item.Status).badge}>{getStatus(item.Status).label}</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
               
                </div>
            </div> */}
        
      </div>
    </>
  )
}

export default TourDiarySchedule