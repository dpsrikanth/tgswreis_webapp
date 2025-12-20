import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const DistrictsTable = ({zoneId,onSelect,onBack,districts}) => {
    console.log(zoneId);
const token = useSelector((state) => state.userappdetails.TOKEN);
// const [districts,setDistricts] = useState([]);

// const fetchDistrictTotalStudents = async (zoneId) => {
//     try{

//         _fetch('studentsummary',null,false,token).then(res => {
//             if(res.status === 'success'){
//                 const districts = res.data.perDistrict.filter(d => d.ZoneId === zoneId)
//                 setDistricts(districts);
//             }else{
//                 toast.error(res.message);
//             }
//         })

//     } catch (error){
//         console.error('Error fetching district total students',error);
//         toast.error('Error fetching Districts corresponding to zone')
//     }
// }


// useEffect(() => {
//     if(zoneId){
//      fetchDistrictTotalStudents(zoneId);
//     }
// },[zoneId])


  return (
    <>
     <button className='btn btn-sm btn-secondary mb-2' onClick={onBack}>
       ← Back to Zones
    </button>
    <h5>Districts</h5>
     <table className='table table-bordered'>
        <thead>
            <tr>
                <th>District</th>
                <th>Total Students</th>
            </tr>
        </thead>
        <tbody>
           {districts.map(d => (
            <tr key={d.DistrictId} style={{ cursor: 'pointer' }} onClick={() => onSelect(d)}>
              <td style={{color:'blue'}}>{d.DistrictName}</td>
              <td>{d.TotalStudents}</td>
            </tr>
          ))}
        </tbody>
    </table>
    </>
  
  )
}

export default DistrictsTable