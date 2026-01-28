import React from 'react'
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect,useState } from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const InspectionCoverageReport = () => {
     const token = useSelector((state) => state.userappdetails.TOKEN);
            const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
            const UserId = useSelector((state) => state.userappdetails.profileData.Id);
            const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
            const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId);

    const [fromDate,setFromDate] = useState('');
    const [toDate,setToDate] = useState('');
    const [completed,setCompleted] = useState([]);
    const [notCompleted,setNotCompleted] = useState([]);


    const fetchInspectionCoverage = async () => {
        try{

            const payload = {fromDate,toDate}

            const res = await _fetch('inspectioncoveragereport',payload,false,token)

            if(res.status === 'success'){
                setCompleted(res.data.completed);
                setNotCompleted(res.data.notInspected)
            } else {
                toast.error(res.message);
            }

        } catch(error){
            console.error('Error fetching Inspection Coverage Report',error);
        }
    }


  return (
    <>
    <div className='white-box shadow-sm'>
   <div className='row'>
    <div className='col-sm-3'>
    <label>From Date</label>
    <input type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} className='form-control' />
    </div>
    <div className='col-sm-3'>
    <label>To Date</label>
    <input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} className='form-control' />
    </div>
    <div className='col-sm-3'>
        <button className='btn btn-primary' onClick={() => fetchInspectionCoverage()}>Fetch</button>
    </div>


     <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sickentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{completed.length}</h3>
      <h6 className="fw-bold">Total Schools</h6>
      <small>Today</small>
    </div>
  </div>


  <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sickentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{notCompleted.length}</h3>
      <h6 className="fw-bold">Total Schools</h6>
      <small>Today</small>
    </div>
  </div>


  <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sickentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{notCompleted.length + completed.length}</h3>
      <h6 className="fw-bold">Total Schools</h6>
      <small>Today</small>
    </div>
  </div>


  <div className="col-md-3">
    <div
      className="white-box shadow-sm text-center bg-warning"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        navigate('/sickentered') // optional list page
      }}
    >
      <h3 className="fw-bold">{(completed.length/completed.length + notCompleted.length) * 100}</h3>
      <h6 className="fw-bold">Total Schools</h6>
      <small>Today</small>
    </div>
  </div>


    <div className='col-sm-12'>
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>School Code</th>
                    <th>School Name</th>
                    <th>No. of times Inspection Completed</th>
                </tr>
            </thead>
            <tbody>
               {Array.isArray(completed) && completed.length > 0 ? (
                completed.map((item,index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.SchoolCode}</td>
                        <td>{item.SchoolName}</td>
                        <td>{item.VisitCount}</td>
                    </tr>
                ))
               ) : (<tr colSpan={4}>No Data found</tr>)}
            </tbody>
        </table>
    </div>

      <div className='col-sm-12'>
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>School Code</th>
                    <th>School Name</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
               {Array.isArray(notCompleted) && notCompleted.length > 0 ? (
                notCompleted.map((item,index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.SchoolCode}</td>
                        <td>{item.SchoolName}</td>
                        <td>{item.VisitCount}</td>
                    </tr>
                ))
               ) : (<tr colSpan={4}>No Data found</tr>)}
            </tbody>
        </table>
    </div>
    </div> 
    </div>
    </>
  )
}

export default InspectionCoverageReport