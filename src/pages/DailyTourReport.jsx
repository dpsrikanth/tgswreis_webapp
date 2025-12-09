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

const DailyTourReport = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserId = useSelector((state) => state.userappdetails.profileData.Id);
const [tourReport,setTourReport] = useState([])


const fetchDailyTourReport = async () => {
  try{
   _fetch('dailytourreport',null,false,token).then(res => {
    if(res.status === 'success'){
      setTourReport(res.data);
      toast.success(res.message);
    }else {
      toast.error(res.message);
    }
   })
  } catch(error){
    console.error('Error fetching Daily Tour Report',error)
  }
}


const ExcelReportTourDaily = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

const customHeaders = [
  {header: 'S.No' , key: 'index'},
  {header: 'Officer Name',   key: 'OfficerName'},
  {header: 'Designation' , key: 'RoleDisplayName'},
  {header: 'Date Of Visit', key: 'DateOfVisit'},
  {header: 'Scheduled School' , key: 'ScheduledSchool'},
  {header: 'Status', key: 'Status'},
  {header: 'Report Uploaded', key: 'ReportUploaded'},
  {header: 'Photos Uploaded', key: 'PhotosUploaded'},
  {header: 'Not Visited Reason', key: 'NotVisitedReason'},
  {header: 'Not Visited Remarks', key: 'NotVisitedRemarks'}
]


data = data.map((row, i) => ({
    index: i + 1,
    OfficerName: row.OfficerName,
    RoleDisplayName: `${row.RoleDisplayName} - ${row.Region || ''}`,
    DateOfVisit: row.DateOfVisit,
    ScheduledSchool: row.ScheduledSchool,
    Status: row.StatusText,
    ReportUploaded: row.ReportUploaded,
    PhotosUploaded: row.PhotosUploaded,
    NotVisitedReason: row.NotVisitedReason,
    NotVisitedRemarks: row.NotVisitedRemarks
  }));



const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);
  const todayDate = new Date().toISOString().split('T')[0];
  let titleRow;
  titleRow = sheet.addRow([`Daily Tour Compliance Report - ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16};
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:J1`);
  sheet.addRow([]);


  const headerNames = headers.map(h => h.header);
  const headerRow = sheet.addRow(headerNames);
  headerRow.font = {bold: true};
  headerRow.alignment = {horizontal: 'center'};

  headerRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' },
    };
  });

     data.forEach((item) => {
      const rowData = customHeaders.map(h => {
       if (h.key === 'Date') {
      return item.Date ? new Date(item.Date).toLocaleDateString('en-IN') : '-';
    }
    return item[h.key] != null ? item[h.key] : ''
      })

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 7;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
};

if(Array.isArray(data) && data.length > 0){
  const headers = Object.keys(data[0]);
  createSheet("Tour Daily Report",customHeaders,data);
} else {
  toast.error(`No Entries for these dates`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`DailyTourReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}

useEffect(() => {
fetchDailyTourReport();
},[])

  return (
   <>
    <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/tourdiarydashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Daily Tour Compliance Report</h6>
   <div className='row'>
    <div className='col-sm-12'>
            <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Daily Tour Compliance Report</span></h5>
                    <div>
                       <button className='btn btn-success' onClick={() => ExcelReportTourDaily(tourReport)}>Excel Report</button>
                    </div>
                </div>
                <div className='table-responsive pt-2'>
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                      <th>S.No</th>
                      <th>Officer Name</th>
                      <th>Designation</th>
                      <th>Date Of Visit</th>
                      <th>Scheduled School</th>
                      <th>School Code</th>
                      <th>Status</th>
                      <th>Report Uploaded</th>
                      <th>Photos Uploaded</th>
                      <th>Not Visited Reason</th>
                      <th>Not Visited Remarks</th>
                    </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(tourReport) && tourReport.length > 0 ? (
                        tourReport.map((item,index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.OfficerName}</td>
                            <td>{item.RoleDisplayName} - {item.Region}</td>
                            <td>{item.DateOfVisit}</td>
                            <td>{item.ScheduledSchool}</td>
                            <td>{item.SchoolCode}</td>
                            <td>{item.StatusText}</td>
                            <td>{item.ReportUploaded}</td>
                            <td>{item.PhotosUploaded}</td>
                            <td>{item.NotVisitedReason}</td>
                            <td>{item.NotVisitedRemarks}</td>
                          </tr>
                        ))
                      ) : (<tr colSpan={10} className='text-center'>No Data available</tr>)}
                    </tbody>
                  </table>
                </div>
            </div>
    </div>
   </div>
   </>
  )
}

export default DailyTourReport