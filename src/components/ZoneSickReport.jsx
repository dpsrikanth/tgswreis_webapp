import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect,useRef,useState } from 'react';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import { _fetch } from '../libs/utils';



const ZoneSickReport = ({onZoneClick }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
  const [fromDate,setFromDate] = useState('');
  const [toDate,setToDate] = useState('');
  const [zonewiseData,setZonewiseData] = useState([]);


const fetchZoneWiseData = async () => {
    try {

      const payload = {ZoneId}

        _fetch('zonewisedatasick',payload,false,token).then(res => {
            if(res.status === 'success'){
              setZonewiseData(res.data);
              
            } else {
                console.error('Error fetching zonewise data')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}


const BetweenZoneWiseData = async () => {
   try {

      const payload = {FromDate:fromDate,ToDate:toDate,ZoneId}

        _fetch('zonewisedatasick',payload,false,token).then(res => {
            if(res.status === 'success'){
              setZonewiseData(res.data);
              
            } else {
                console.error('Error fetching zonewise data')
            }
        })

    } catch (error){
        console.error('Error fetching zone wise data',error);
    }
}

// const DailySickReport = async () => {
//     try {

//       const payload = {}
//         payload.ZoneId = ZoneId;

//         _fetch('zonewisedatasick',payload,false,token).then(res => {
//             if(res.status === 'success'){
//               DailySickEntryReport(res.data);
//               toast.success('Report generated successfully')
//             } else {
//                 console.error('Error fetching zonewise data')
//             }
//         })

//     } catch (error){
//         console.error('Error fetching zone wise data',error);
//     }
// }


// const fetchBetweenSickReport = async () => {
//     try {

//       const payload= {fromDate,toDate,ZoneId}

//         _fetch('zonalreportsick',payload,false,token).then(res => {
//             if(res.status === 'success'){
//              BetweenSickReport(res.data);
//               toast.success('Report generated successfully')
//             } else {
//                 console.error('Error fetching zonewise data')
//             }
//         })

//     } catch (error){
//         console.error('Error fetching zone wise data',error);
//     }
// }





const ExcelReport = async(data) => {
  const workbook = new ExcelJS.Workbook();
  
  const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
}

const customHeaders = [
  {header: 'Date' , key: 'Date'},
  {header: 'Zone Name' , key: 'ZoneName'},
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
   titleRow = sheet.addRow([`Filtered Zone Wise Statistics Report - ${fromDate} to ${toDate}`]);
  } else {
    titleRow = sheet.addRow([`Daily Zone Wise Statistics Report - ${todayDate}`]);
  }

  titleRow.font = {bold: 'true', size: 16}
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:F1`);
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
    createSheet("Daily Sick Report",customHeaders,data);
  } else {
    toast.error(`No Entries for today's date`);
  }
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer],{
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob,`ZoneStatisticsSickEntryReport_${new Date().toISOString().split('T')[0]}.xlsx`);
}


// const BetweenSickReport = async (data) => {
//  const workbook = new ExcelJS.Workbook();

//  const borderStyle = {
//   top: {style:'thin'},
//   left:{style:'thin'},
//   bottom:{style: 'thin'},
//   right: {style: 'thin'}
//  }

// const customHeaders = [
//   {header: 'Date' , key: 'Date'},
//   {header: 'Zone',   key: 'ZoneId'},
//   {header: 'Zone Name' , key: 'ZoneName'},
//   {header: 'Total No. of General Sick', key: 'GeneralSick'},
//   {header: 'Total No. of Fever Cases' , key: 'Fever'},
//   {header: 'Total No. of Hospital Referral Cases', key: 'ReferralCases'},
//   {header: 'Total No. of Admitted Cases', key: 'AdmittedCases'}
// ]



// const createSheet = (sheetName,headers,data) => {
//   const sheet = workbook.addWorksheet(sheetName);

//   const todayDate = new Date().toISOString().split('T')[0];
//   const titleRow = sheet.addRow([`Filtered Sick Entries Report - ${fromDate} and ${toDate}`]);
//   titleRow.font = {bold: 'true', size: 16};
//   titleRow.alignment = {horizontal: 'center'};
//   sheet.mergeCells(`A1:G1`);
//   sheet.addRow([]);


//   const headerNames = headers.map(h => h.header);
//   const headerRow = sheet.addRow(headerNames);
//   headerRow.font = {bold: true};
//   headerRow.alignment = {horizontal: 'center'};

//   headerRow.eachCell((cell) => {
//     cell.border = borderStyle;
//     cell.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'D9E1F2' },
//     };
//   });

//      data.forEach((item) => {
//       const rowData = customHeaders.map(h => {
//        if (h.key === 'Date') {
//       return item.Date ? new Date(item.Date).toLocaleDateString('en-IN') : '-';
//     }
//     return item[h.key] != null ? item[h.key] : ''
//       })

//       const row = sheet.addRow(rowData);
//       row.eachCell((cell) => {
//         cell.border = borderStyle;
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//       });
//     });

//     // Auto-fit column width
//     sheet.columns.forEach((column) => {
//       let maxLength = 7;
//       column.eachCell({ includeEmpty: true }, (cell) => {
//         const length = cell.value ? cell.value.toString().length : 0;
//         if (length > maxLength) maxLength = length;
//       });
//       column.width = maxLength + 2;
//     });

//     return sheet;
// };

// if(Array.isArray(data) && data.length > 0){
//   const headers = Object.keys(data[0]);
//   createSheet("Sick Entries",customHeaders,data);
// } else {
//   toast.error(`No Entries for these dates`);
// }

// const buffer = await workbook.xlsx.writeBuffer();
// const blob = new Blob([buffer],{
//   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// });
// saveAs(blob,`ConsolidatedSickEntriesReport_${new Date().toISOString().split('T')[0]}.xlsx`);
// }

useEffect(() => {
fetchZoneWiseData();
},[])
  
  return (
    <>
     <div className="row align-items-center">
                  <div className='col-sm-2'>
                  <h5 className='fw-bold'><span className="pink fw-bold" style={{color:'#cc1178'}}>Zonal Wise Report</span></h5>
                  </div>
                    
                       <div className='col-sm-1'> <label className='col-form-label'>From Date:</label></div>
                  <div className='col-sm-2'> 
                    <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
                     <div className='col-sm-1'> <label className='col-form-label'>To Date:</label></div>
                  <div className='col-sm-2'>
                    <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                    <div className='col-sm-1'><button className='btn btn-success' onClick={() => BetweenZoneWiseData()}>Filter</button></div>
                     <div className='col-sm-2'><button className='btn btn-success' onClick={() => ExcelReport(zonewiseData)}>Excel Report</button></div>
                
                
                </div>
    <div className="table-responsive">
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Date</th>
            <th>Zone Name</th>
            <th>Total No of General Sick</th>
            <th>Total No. of Fever Cases</th>
            <th>Total No. of Hospital Referral Cases</th>
            <th>Total No. of Admitted Cases</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {zonewiseData.map((item, index) => (
            <tr key={index}>
              <td>{item.Date.split('T')[0]}</td>
              <td>{item.ZoneName}</td>
              <td>{item.TotalGeneralSick}</td>
              <td>{item.TotalFever}</td>
              <td>{item.TotalReferralCases}</td>
              <td>{item.TotalAdmittedCases}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onZoneClick(item.ZoneId, item.ZoneName)}>
                  View Schools
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default ZoneSickReport