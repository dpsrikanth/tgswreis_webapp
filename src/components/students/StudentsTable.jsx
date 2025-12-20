import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import { ToastContainer } from 'react-toastify';

const StudentsTable = ({schoolId,classId,sectionId,onBack,onSelect}) => {
  console.log(schoolId,classId,sectionId);
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const [students,setStudents] = useState([]);


const fetchStudents = async () => {
    try{
          const payload = {schoolId,sectionId,classId}
        _fetch('studentlist',payload,false,token).then(res => {
            if(res.status === 'success'){
              console.log('res',res);
                setStudents(res.data)
          
          console.log('students',students);
            }else {
                toast.error(res.message);
            }
        })

    } catch(error){
        console.error('Error fetching Students',error)
    }
}


useEffect(() => {
fetchStudents();
},[schoolId,classId,sectionId])

  return (
    <>
    <ToastContainer />
     <button className="btn btn-sm btn-secondary mb-2" onClick={onBack}>
        ← Back to Classes
      </button>
       <h5><i class="bi bi-person-fill me-1 maroon"></i>Students Roster</h5>
       <table className="table table-hover">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Name</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
           {students.map(s => (
            <tr key={s.UserId}
                onClick={() => onSelect(s)} style={{ cursor: 'pointer' }}>
              <td style={{color:'blue'}}>{s.AdmissionNo}</td>
              <td>{s.FName} {s.LName}</td>
              <td>{s.GenderName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default StudentsTable