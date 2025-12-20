import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { _fetch } from '@/libs/utils';
import { ToastContainer } from 'react-toastify';
import {getInitials} from '@/libs/utils';

const StudentProfile = ({ userId,schoolId, onBack, onSelect }) => {
  console.log(userId);
  const token = useSelector(s => s.userappdetails.TOKEN);
  const [profile, setProfile] = useState(null);

  const fetchStudentProfile = async () => {
    try{
      const payload = {userid: userId,schoolId}
     _fetch('studentprofile',payload, false, token).then(res => {
      if(res.status === 'success'){
        setProfile(res.data);
      }else {
        toast.error(res.message);
      }
     })
    } catch(error){
      console.error('Error fetching Student Profile',error)
    }
  }

useEffect(() => {

  fetchStudentProfile();

},[])

if (!profile) {
  return <p>Loading student profile...</p>;
}


  return (
    
    <>
    <ToastContainer />
      <button className="btn btn-sm btn-secondary mb-2" onClick={onBack}>← Back to Students</button>
      <h5>Student Profile</h5>
      <div className="white-box shadow-sm border p-3">
        <div className='d-flex align-items-center'>
          <div className='avatar' style={{width:'80px',height:'80px'}}>{getInitials(profile.FName,profile.LName)}</div>
        <div class="profile-info">
        <h3 className='mb-0'>{profile.FName} {profile.LName}</h3>
        <p class="maroon fw-bold mb-0">Admission No: {profile.AdmissionNo}</p>
        </div>
        </div>
       <hr/>

       <div className='row gy-3'>
        <div className='col-sm-6'>
          <label>Gender</label>
          <div className='fw-bold'>{profile.GenderName}</div>
        </div>
         <div className='col-sm-6'>
          <label>Date of Birth</label>
          <div className='fw-bold'>{profile.DOB.split('T')[0]}</div>
        </div>
         <div className='col-sm-6'>
          <label>Class & Section</label>
          <div className='fw-bold'>{profile.ClassName} - {profile.SectionName}</div>
        </div>
        <div className='col-sm-6'>
          <label>Caste Category</label>
          <div className='fw-bold'>{profile.Caste}</div>
        </div>
        <div className='col-sm-6'>
          <label>Educational Institution</label>
          <div className='fw-bold'>{profile.SchoolName}</div>
        </div>
       
       </div>
      </div>
    </>
  );
};

export default StudentProfile;
