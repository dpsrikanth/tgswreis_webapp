import React,{useState} from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AttendanceandConsumptionReport = () => {
      const token = useSelector((state) => state.userappdetails.TOKEN);
      const userid = useSelector((state) => state.userappdetails.profileData.Id);
      const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);

     const [selectedMonth,setSelectedMonth] = useState(dayjs());
     const [ConsAttendReport, setConsAttendReport] = useState([]);

     const handleMonthChange = (e) => {
       setSelectedMonth(dayjs(e.target.value))
     }


     const handleAttendAndConsData = async () => {
     
         const payload = {
             month: selectedMonth.format("YYYY-MM")
         }
     
         _fetch('consandattendreport',payload,false,token).then(res => {
             if(res.status === 'success') {
                 setConsAttendReport(res.data);
                 toast.success(res.message);
             } else {
                 toast.error(res.message);
             }
         }).catch(err => {
             console.error("Failed to Generate Report:",err);
             toast.error("Failed to Generate Report");
         })
     }
     
     
     const exportToExcel = () => {
         const worksheet = XLSX.utils.json_to_sheet(ConsAttendReport);
         const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook,worksheet,"AttendandConsumptionReport");
     
         const fileName = `AttendanceAndConsumptionReport_${selectedMonth.format("YYYY-MM")}.xlsx`;
         XLSX.writeFile(workbook,fileName);
     };
     
      const fromDate = dayjs(new Date(selectedMonth.year(), selectedMonth.month() - 1, 26)).format("DD MMM YYYY");
       const toDate = dayjs(new Date(selectedMonth.year(), selectedMonth.month(), 25)).format("DD MMM YYYY");

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
                       <input type='month'  value={selectedMonth.format("YYYY-MM")} onChange={handleMonthChange} className='form-control' />
                      </div>
                      <div className='col-sm-6 text-start'>
                       <button className='btn btn-primary mt-4' onClick={handleAttendAndConsData}>Generate</button>
                      </div>

                       <>
   
                        <p>
           Showing data from: <strong>{fromDate}</strong> to <strong>{toDate}</strong>
         </p>
                        <div className='col-sm-12'>
                       <button onClick={exportToExcel} className='btn btn-success mb-2' style={{ marginTop: '1rem' }}>
                        Download Excel
                       </button>
                       <div className='table-responsive'>
                          <table className='table table-bordered'>
                           <thead>
                               <tr>
                                   <th>School Name</th>
                                   <th>School Code</th>
                                   <th>Region</th>
                                   <th>District</th>
                                   <th>Cat 1 Attendance</th>
                                   <th>Cat 2 Attendance</th>
                                   <th>Cat 3 Attendance</th>
                                   <th>Cat 4 Attendance</th>
                                   <th>Cat 1 Per Day</th>
                                   <th>Cat 2 Per Day</th>
                                   <th>Cat 3 Per Day</th>
                                   <th>Cat 4 Per Day</th>
                                   <th>Cat 1 Amount</th>
                                   <th>Cat 2 Amount</th>
                                   <th>Cat 3 Amount</th>
                                   <th>Cat 4 Amount</th>
                                   <th>Attendance</th>
                                   <th>Highest Attendance</th>
                                   <th>Allowed Amount</th>
                                   <th>Purchased Amount</th>
                                   <th>Consumption Amount</th>
                                   <th>Remaining Amount</th>
                                   <th>School Type</th>
                                   <th>Cat 1 Guest Attendance</th>
                                   <th>Cat 2 Guest Attendance</th>
                                   <th>Cat 3 Guest Attendance</th>
                                   <th>Cat 4 Guest Attendance</th>
                                   <th>Cat 1 Highest Attendance</th>
                                   <th>Cat 2 Highest Attendance</th>
                                   <th>Cat 3 Highest Attendance</th>
                                   <th>Cat 4 Highest Attendance</th>
                                   <th>Cat 1 Lowest Attendance</th>
                                   <th>Cat 2 Lowest Attendance</th>
                                   <th>Cat 3 Lowest Attendance</th>
                                   <th>Cat 4 Lowest Attendance</th>
                                   <th>Cat 1 Average Attendance</th>
                                   <th>Cat 2 Average Attendance</th>
                                   <th>Cat 3 Average Attendance</th>
                                   <th>Cat 4 Average Attendance</th>
                                   <th>Cat 1 Guest Highest Attendance</th>
                                   <th>Cat 2 Guest Highest Attendance</th>
                                   <th>Cat 3 Guest Highest Attendance</th>
                                   <th>Cat 4 Guest Highest Attendance</th>
                                   <th>Cat 1 Guest Lowest Attendance</th>
                                   <th>Cat 2 Guest Lowest Attendance</th>
                                   <th>Cat 3 Guest Lowest Attendance</th>
                                   <th>Cat 4 Guest Lowest Attendance</th>
                                   <th>Cat 1 Guest Average Attendance</th>
                                   <th>Cat 2 Guest Average Attendance</th>
                                   <th>Cat 3 Guest Average Attendance</th>
                                   <th>Cat 4 Guest Average Attendance</th>
                               </tr>
                           </thead>
                           <tbody>
                                {ConsAttendReport.map((item,index) => (
                                <tr key={index}>
                                 <td>{item["School Name"]}</td>
                                 <td>{item["School Code"]}</td>
                                 <td>{item["Region"]}</td>
                                 <td>{item["District"]}</td>
                                 <td>{item["Cat 1 Attendance"]}</td>
                                 <td>{item["Cat 2 Attendance"]}</td>
                                 <td>{item["Cat 3 Attendance"]}</td>
                                 <td>{item["Cat 4 Attendance"]}</td>
                                 <td>{item["Cat 1 Per Day"]}</td>
                                 <td>{item["Cat 2 Per Day"]}</td>
                                 <td>{item["Cat 3 Per Day"]}</td>
                                 <td>{item["Cat 4 Per Day"]}</td>
                                 <td>{item["Cat 1 Amount"]}</td>
                                 <td>{item["Cat 2 Amount"]}</td>
                                 <td>{item["Cat 3 Amount"]}</td>
                                 <td>{item["Cat 4 Amount"]}</td>
                                 <td>{item["Attendance"]}</td>
                                 <td>{item["Highest Attendance"]}</td>
                                 <td>{item["Allowed Amount"]}</td>
                                 <td>{item["Purchased Amount"]}</td>
                                 <td>{item["Consumption Amount"]}</td>
                                 <td>{item["Remaining Amount"]}</td>
                                 <td>{item["School Type"]}</td>
                                 <td>{item["Cat 1 Guest Attendance"]}</td>
                                 <td>{item["Cat 2 Guest Attendance"]}</td>
                                 <td>{item["Cat 3 Guest Attendance"]}</td>
                                 <td>{item["Cat 4 Guest Attendance"]}</td>
                                 <td>{item["Cat 1 Highest Attendance"]}</td>
                                <td>{item["Cat 2 Highest Attendance"]}</td>
                                <td>{item["Cat 3 Highest Attendance"]}</td>
                                <td>{item["Cat 4 Highest Attendance"]}</td>
                                <td>{item["Cat 1 Lowest Attendance"]}</td>
                                <td>{item["Cat 2 Lowest Attendance"]}</td>
                                <td>{item["Cat 3 Lowest Attendance"]}</td>
                                <td>{item["Cat 4 Lowest Attendance"]}</td>
                                <td>{item["Cat 1 Average Attendance"]}</td>
                                <td>{item["Cat 2 Average Attendance"]}</td>
                                <td>{item["Cat 3 Average Attendance"]}</td>
                                <td>{item["Cat 4 Average Attendance"]}</td>
                                <td>{item["Cat 1 Guest Highest Attendance"]}</td>
                                <td>{item["Cat 2 Guest Highest Attendance"]}</td>
                                <td>{item["Cat 3 Guest Highest Attendance"]}</td>
                                <td>{item["Cat 4 Guest Highest Attendance"]}</td>
                                <td>{item["Cat 1 Guest Lowest Attendance"]}</td>
                                <td>{item["Cat 2 Guest Lowest Attendance"]}</td>
                                <td>{item["Cat 3 Guest Lowest Attendance"]}</td>
                                <td>{item["Cat 4 Guest Lowest Attendance"]}</td>
                                <td>{item["Cat 1 Guest Average Attendance"]}</td>
                                <td>{item["Cat 2 Guest Average Attendance"]}</td>
                                <td>{item["Cat 3 Guest Average Attendance"]}</td>
                                <td>{item["Cat 4 Guest Average Attendance"]}</td>
                                </tr>
                            ))}
                           </tbody>
                       </table>
                       </div>
                      
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