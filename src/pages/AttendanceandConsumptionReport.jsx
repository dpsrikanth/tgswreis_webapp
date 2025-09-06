import React,{useState} from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AttendanceandConsumptionReport = () => {
  return (
   <>
        <ToastContainer />
       <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/reportsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Attendance and Consumption Report</h6>
         
         <div className="row">
           <div className="col-sm-12">
               <div className="white-box shadow-sm">
                   <div className="table-header">
                       <h5><span className="pink fw-bold">Attendance and Consumption Report</span></h5>
                   </div>
                   <div className="row gy-3 align-items-center pt-2">
                      <div className='col-sm-6'>
                       <label className='form-label'>Select Month</label>
                       <input type='month' className='form-control' />
                      </div>
                      <div className='col-sm-6 text-start'>
                       <button className='btn btn-primary mt-4'>Generate</button>
                      </div>

                       <>
   
                        <p>
           Showing data from: <strong></strong> to <strong></strong>
         </p>
                        <div className='col-sm-12'>
                       <button className='btn btn-success mb-2' style={{ marginTop: '1rem' }}>
                        Download Excel
                       </button>
                       <table className='table table-bordered'>
                           <thead>
                               <tr>
                                   <th>S.No</th>
                                   <th>School Code</th>
                                   <th>School Name</th>
                                   <th>District</th>
                                   <th>Type</th>
                                   <th>Attendance</th>
                                   <th>Highest Attendance</th>
                                   <th>Allowed Amount</th>
                                   <th>Purchased Amount</th>
                                   <th>Consumption Amount</th>
                                   <th>As per TGDIET Releasing</th>
                                   <th>Vendor Wise Releasing</th>
                                   <th>TDS 2%</th>
                                   <th>Difference Amount</th>
                               </tr>
                           </thead>
                           <tbody>
                               
                           </tbody>
                       </table>
                      </div>
                       </>
                   
   
                     
                   </div>
               </div>
           </div>
             
           
         </div>
      </>
  )
}

export default AttendanceandConsumptionReport