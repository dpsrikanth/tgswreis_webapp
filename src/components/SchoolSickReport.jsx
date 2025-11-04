import React from 'react'
import { _fetch } from '../libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux'
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const SchoolSickReport = ({ZoneId,ZoneName,onBack,onSchoolClick}) => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const [schools,setSchools] = useState([]);
const [fromDate,setFromDate] = useState('');
const [toDate,setToDate] = useState('');


const fetchSchools = async () => {

     const payload = {ZoneId};
    _fetch('sickentriesdrilldown',payload,false,token).then(res => {
        if(res.status === 'success'){
            setSchools(res.data);
        }else {
            console.error('Error fetching school sick entries');
        }
    })
}


const fetchBetweenSickReport = async () => {
    try {

      const payload= {FromDate: fromDate,ToDate: toDate,ZoneId}

        _fetch('sickentriesdrilldown',payload,false,token).then(res => {
            if(res.status === 'success'){
             setSchools(res.data)
            } else {
                console.error('Error fetching filtered school sick entries')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}


const ExcelReportSchoolWise = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

const customHeaders = [
  {header: 'Date' , key: 'Date'},
  {header: 'School Name',   key: 'PartnerName'},
  {header: 'School Code' , key: 'SchoolCode'},
  {header: 'Total No. of General Sick', key: 'GeneralSick'},
  {header: 'Total No. of Fever Cases' , key: 'Fever'},
  {header: 'Total No. of Hospital Referral Cases', key: 'ReferralCases'},
  {header: 'Total No. of Admitted Cases', key: 'AdmittedCases'}
]



const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);
  const todayDate = new Date().toISOString().split('T')[0];
  let titleRow;
  if(fromDate && toDate){
  titleRow = sheet.addRow([`Filtered School Wise Sick Entries Report - ${fromDate} to ${toDate} for ${ZoneName}`]);
  } else {
    titleRow = sheet.addRow([`Daily School Wise Sick Entries Report - ${todayDate} for ${ZoneName}`]);
  }
 
  titleRow.font = {bold: 'true', size: 16};
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:G1`);
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
saveAs(blob,`SchoolWiseSickEntriesReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}

useEffect(() => {
fetchSchools()
},[ZoneId])

  return (
   <>
    <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 style={{color:'#cc1178'}} className='fw-bold'>{ZoneName} - School Wise Report</h5>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          ← Back to Zones
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
    <button className='btn btn-success' onClick={() => ExcelReportSchoolWise(schools)}>Excel Report</button>
  </div>
</div>


      <table className='table table-bordered'>
        <thead>
            <tr>
                <th>Date</th>
                <th>School Name</th>
                <th>School Code</th>
                <th>Total General Sick</th>
                <th>Total Fever Cases</th>
                {/* <th>Temperature</th>
                <th>Action Taken</th>
                <th>TakenToTheHospital</th> */}
                <th>Referral Cases</th>
                <th>Admitted</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {schools.map((item,index) => (
                <tr key={index}>
                    <td>{item.Date.split('T')[0]}</td>
                    <td>{item.PartnerName}</td>
                    <td>{item.SchoolCode}</td>
                    <td>{item.GeneralSick}</td>
                    <td>{item.Fever}</td>
                    {/* <td>{item.Temperature}</td>
                    <td>{item.ActionTaken}</td>
                    <td>{item.TakenToTheHospital}</td> */}
                    <td>{item.ReferralCases}</td>
                    <td>{item.AdmittedCases}</td>
                    <td><button className='btn btn-primary btn-sm'
                    onClick={() => onSchoolClick(item.SchoolId,item.PartnerName,item.SchoolCode)}
                    >View Details</button></td>
                </tr>
            ))}
        </tbody>
      </table>
   
   </>
  )
}

export default SchoolSickReport