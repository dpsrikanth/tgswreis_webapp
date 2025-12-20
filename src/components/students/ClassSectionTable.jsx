import React from 'react'
import { _fetch } from '@/libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const ClassSectionTable = ({schoolId,onSelect,onBack}) => {
  console.log('classsection',schoolId)
const token = useSelector((state) => state.userappdetails.TOKEN);
const [rows,setRows] = useState([]);


const fetchClassSection = async () => {
    const payload = {schoolId}
    try{
      _fetch('studentdrilldown',payload,false,token).then(res => {
        if(res.status === 'success'){
          console.log('res',res)
             const classSection = res?.data?.data?.classSection || [];
            setRows(res.data.data.classSection);
              console.log('rows',rows)
        }else {
            toast.error(res.message);
        }
      })

    } catch (error){
        console.error('Error fetching Class Section',error)
    }
}


useEffect(() => {
    if(schoolId){
        fetchClassSection();
    }
},[schoolId])


  return (
    <>
     <button className="btn btn-sm btn-secondary mb-2" onClick={onBack}>
        ← Back to Institutions
      </button>
      <h5>Class and Sections</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Section</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
        {rows.map((r,index) => (
            <tr key={index}
                onClick={() => onSelect(r)} style={{ cursor: 'pointer' }}>
              <td style={{color:'blue'}}>{r.ClassName}</td>
              <td>{r.SectionName}</td>
              <td>{r.StudentCount}</td>
            </tr>
          ))}
        </tbody>
         
      </table>
    </>
  )
}

export default ClassSectionTable