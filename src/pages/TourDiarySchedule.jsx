import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const TourDiarySchedule = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
const navigate = useNavigate();
const [officersList,setOfficersList] = useState([])
const [selectedOfficer,setSelectedOfficer] = useState('');
const [visitDate,setVisitDate] = useState('');
const [selectedSchool,setSelectedSchool] = useState('');
const [selectedSchoolId,setSelectedSchoolId] = useState('');
const [purpose,setPurpose] = useState('');
const [schoolList,setSchoolList] = useState([]);
const [tourSchedule,setTourSchedule] = useState([]);

useEffect(() => {

    if(schoolList && Array.isArray(schoolList)){
        setSchoolList(schoolsList)
    }

},[schoolsList])


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

        _fetch('getofficerslist',null,false,token).then(res => {
          if(res.status === 'success'){
            setOfficersList(res.data);
          } else {
            toast.error('Error fetching Officers List')
          }
        })

    } catch (error){
        console.error('Error fetching Officers List',error)
    }
}

const CreateTourSchedule = async () => {
    try {

        const payload = {UserId:selectedOfficer,DateOfVisit:visitDate,SchoolId:selectedSchoolId,Purpose:purpose}

        _fetch('createtourschedule',payload,false,token).then(res => {
            if(res.status === 'success'){
                setSelectedOfficer('');
                setSelectedSchoolId('');
                setVisitDate('');
                setPurpose('');
                fetchTourSchedule();
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        })

    } catch (error) {
        console.error('Error creating new tour schedule',error)
    }
}


const fetchTourSchedule = async () => {
    try {

        _fetch('tourschedule',null,false,token).then(res => {
            if(res.status === 'success'){
                setTourSchedule(res.data)
            }else{
                toast.error(res.message)
            }
        })

    } catch(error){
        console.error('Error fetching Tour Schedule',error)
    }
}


useEffect(() => {
fetchOfficersList();
fetchTourSchedule();
},[])



  return (
    <>
    
     <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Tour Diary Management</h6>
     
      <div className="row gy-3">

        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Add New Tour Schedule</h5>
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Officer Name</label>
                        <select className="form-select" value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}>
                            <option>--Select--</option>
                            {
                                officersList.map((officer) => (
                                    <option key={officer.Id} value={officer.Id}>{officer.UserName}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Visit Date</label>
                        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="form-control" />
                    </div>
                    <div className="col-sm-4">
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
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Purpose of Visit</label>
                        <textarea rows={2} className='form-control' value={purpose} onChange={(e) => setPurpose(e.target.value)}></textarea>
                    </div>
                    <div className="col-sm-12">
                        <button className="btn btn-primary" onClick={() => {
                            CreateTourSchedule();
                        }}>Add to Schedule</button>
                    </div>
                   
                </div>
                </div>
                </div>
                <div className="col-sm-12">
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
            </div>
        
      </div>
    </>
  )
}

export default TourDiarySchedule