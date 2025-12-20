import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const SchoolsTable = ({districtId,onSelect,onBack,schools}) => {
const token = useSelector((state) => state.userappdetails.TOKEN);
// const [schools,setSchools] = useState([]);

// const fetchSchoolsTotalStudents = async () => {
//     try{
//      _fetch('studentsummary',null,false,token).then(res => {
//         if(res.status === 'success'){
//             setSchools(res.data.perSchool.filter(s => s.DistrictId === districtId))
//         }else{
//             toast.error(res.message);
//         }
//      })
//     } catch (error){
//       console.error('Error fetching schools students',error)
//     }
// }

// useEffect(() => {
// if(districtId){
//     fetchSchoolsTotalStudents();
// }
// },[districtId])


  return (
    <>
    <button className='btn btn-sm btn-secondary mb-2' onClick={onBack}>
      ← Back to Districts
    </button>
    <h5>Educational Institutions</h5>
     <table className='table table-bordered'>
        <thead>
            <tr>
                <th>School Name</th>
                <th>Total Students</th>
            </tr>
        </thead>
        <tbody>
           {schools.map(s => (
            <tr key={s.SchoolID} style={{ cursor: 'pointer' }} onClick={() => onSelect(s)}>
              <td style={{color:'blue'}}>{s.SchoolName}</td>
              <td>{s.TotalStudents}</td>
            </tr>
          ))}
        </tbody>
    </table>
    </>
  )
}

export default SchoolsTable