import React from 'react'
import { _fetch } from '../libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const DailySickReport = ({SchoolId,PartnerName,SchoolCode,onBack}) => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const [entries,setEntries] = useState([]);
const [fromDate,setFromDate] = useState('');
const [toDate,setToDate] = useState('');

 const fetchDailyReport = async () => {
    const payload = {SchoolId};

    _fetch('sickentriesdrilldown',payload,false,token).then(res => {
        if(res.status === 'success'){
            setEntries(res.data);
        } else {
            console.error('Error fetching daily sick report');
        }
    })
 }


 const fetchBetweenSickReport = async () => {
     try {
 
       const payload= {FromDate: fromDate,ToDate: toDate,SchoolId}
 
         _fetch('sickentriesdrilldown',payload,false,token).then(res => {
             if(res.status === 'success'){
              setEntries(res.data)
             } else {
                 console.error('Error fetching filtered school detailed entries')
             }
         })
 
     } catch (error){
         console.error('Error fetching zone wise data',error);
     }
 }


 const ExcelReportSickDetailed = async (data) => {
  const workbook = new ExcelJS.Workbook();
 
  const borderStyle = {
   top: {style:'thin'},
   left:{style:'thin'},
   bottom:{style: 'thin'},
   right: {style: 'thin'}
  }
 
 const customHeaders = [
   {header: 'Date' , key: 'Date'},
   {header: 'Total No. of General Sick', key: 'GeneralSick'},
   {header: 'Total No. of Fever Cases' , key: 'Fever'},
   {header: 'Temperature', key: 'Temperature'},
   {header: 'Action Taken', key: 'ActionTaken'},
   {header: 'Taken To The Hospital', key: 'TakenToTheHospital'},
   {header: 'Total No. of Hospital Referral Cases', key: 'ReferralCases'},
   {header: 'Total No. of Admitted Cases', key: 'AdmittedCases'},
   {header: 'Name of Admitted Persons with Health Supervisor Phone Number', key: 'Remarks'}
 ]
 
 
 
 const createSheet = (sheetName,headers,data) => {
   const sheet = workbook.addWorksheet(sheetName);
   const todayDate = new Date().toISOString().split('T')[0];
   let titleRow;
   if(fromDate && toDate){
   titleRow = sheet.addRow([`Filtered Detailed Sick Entries Report - ${fromDate} to ${toDate} for ${PartnerName} - ${SchoolCode}`]);
   } else {
     titleRow = sheet.addRow([`Daily Detailed Sick Entries Report - ${todayDate} for ${PartnerName} - ${SchoolCode}`]);
   }
  
   titleRow.font = {bold: 'true', size: 16};
   titleRow.alignment = {horizontal: 'center'};
   sheet.mergeCells(`A1:I1`);
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
   createSheet("Sick Entries",customHeaders,data);
 } else {
   toast.error(`No Entries for these dates`);
 }
 
 const buffer = await workbook.xlsx.writeBuffer();
 const blob = new Blob([buffer],{
   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
 });
 saveAs(blob,`DetailedSchoolSickEntriesReport_${new Date().toISOString().split('T')[0]}.xlsx`);
 }

 useEffect(() => {
 fetchDailyReport();
 },[])

  return (
    <>
     <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 style={{color:'#cc1178'}} className='fw-bold'>{PartnerName} - {SchoolCode} - Detailed Entries</h5>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          ← Back to Schools
        </button>
      </div>

        <div className="row align-items-center mb-3">
  <div className="col-sm-1">
    <label className="col-form-label">From Date:</label>
  </div>
  <div className="col-sm-2">
    <input
      type="date"
      className="form-control"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </div>

  <div className="col-sm-1">
    <label className="col-form-label">To Date:</label>
  </div>
  <div className="col-sm-2">
    <input
      type="date"
      className="form-control"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>

  <div className="col-sm-1">
    <button
      className="btn btn-success"
      onClick={() => fetchBetweenSickReport(fromDate, toDate)}
    >
      Filter
    </button>
  </div>
  <div className='col-sm-2'>
    <button className='btn btn-success' onClick={() => ExcelReportSickDetailed(entries)}>
      Excel Report
    </button>
  </div>
</div>

      <table className='table table-bordered'>
        <thead>
            <tr>
                <th>Date</th>
                <th>General Sick</th>
                <th>Fever</th>
                <th>Temperature</th>
                <th>Action Taken</th>
                <th>Taken To The Hospital</th>
                <th>Referral Cases</th>
                <th>Admitted Cases</th>
                <th>Name of Admitted Persons with Health Supervisor Phone Number</th>
            </tr>
        </thead>
        <tbody>
            {entries.map((item,index) => (
                <tr key={index}>
                    <td>{item.Date.split('T')[0]}</td>
                    <td>{item.GeneralSick}</td>
                    <td>{item.Fever}</td>
                    <td>{item.Temperature}</td>
                    <td>{item.ActionTaken}</td>
                    <td>{item.TakenToTheHospital}</td>
                    <td>{item.ReferralCases}</td>
                    <td>{item.AdmittedCases}</td>
                    <td>{item.Remarks}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export default DailySickReport