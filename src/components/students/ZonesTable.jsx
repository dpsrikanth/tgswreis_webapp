import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';



const ZonesTable = ({onSelect,zones}) => {
const token = useSelector((state) => state.userappdetails.TOKEN);
// const [zones,setZones] = useState([]);


// const fetchZoneTotalStudents = async () => {
//     try{

//         _fetch('studentsummary',null,false,token).then(res => {
//             if(res.status === 'success'){
//                 setZones(res.data.perZone);
//             }else {
//                 toast.error(res.message);
//             }
//         })

//     }catch(error){
//       console.error('Error fetching zone student totals',error)
//       toast.error('Error fetching Student Totals Zone Wise')
//     }
// }

// useEffect(() => {
//     fetchZoneTotalStudents();
// },[])

  return (
    <>
    <div className='row'>
        <div className='col-sm-12'>
            <h5 className='text-center'>Students Drilldown</h5>
        </div>
    </div>
    <div className='table-responsive'>
        <h5><i class="bi bi-map-fill me-2"></i> Geographic Zones</h5>
     <table className='table table-bordered'>
        <thead>
            <tr>
                <th>Zone</th>
                <th>Total Students</th>
            </tr>
        </thead>
        <tbody>
           {zones.map(z => (
          <tr key={z.ZoneId} style={{ cursor: 'pointer' }} onClick={() => onSelect(z)}>
            <td className='' style={{color:'blue'}}>{z.ZoneName}</td>
            <td>{z.TotalStudents}</td>
          </tr>
        ))}
        </tbody>
    </table>
    </div>
    </>
    
    
  )
}

export default ZonesTable