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
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { format } from "date-fns";
import Select from 'react-select';


const DCOWiseReport = () => {
     const token = useSelector((state) => state.userappdetails.TOKEN);
      const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
      const UserId = useSelector((state) => state.userappdetails.profileData.Id);
      const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
      const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId);

       const [officersList,setOfficersList] = useState([]);
       const [selectedOfficerId,setSelectedOfficerId] = useState(null);
       const [designation,setDesignation] = useState('');
       const [summary,setSummary] = useState('')
       const [visits,setVisits] = useState([]);
       const [selectedMonth,setSelectedMonth] = useState('')
       const [showReportModal,setShowReportModal] = useState(false);
       const [showImagesModal,setShowImagesModal] = useState(false);
       const [selectedFileUrl,setSelectedFileUrl] = useState('');
       const [selectedTourDiaryId,setSelectedTourDiaryId] = useState(null);
       const [fromDate,setFromDate] = useState('');
       const [toDate,setToDate] = useState('');
       const [selectedOfficers, setSelectedOfficers] = useState([]);  
       const apiUrl = window.gc.cdn;
     
       const officerOptions = officersList.map(o => ({
         value: o.UserId,
         label: `${o.OfficerName} (${o.DistrictName})`
       }));

        const openPhotoGallery = (tourDiaryId, photoList) => {
         const images = photoList.map((img, index) => ({
           src: `${apiUrl}/uploads/tourdiary/${tourDiaryId}/photos/${img}`,
           thumb: `${apiUrl}/uploads/tourdiary/${tourDiaryId}/photos/${img}`,
           caption: `Photo ${index + 1}`,
         }));
       
         Fancybox.show(images, {
           Thumbs: {
             autoStart: true,
           },
         });
       };


         const DownloadInspectionPdfReport = async (TourDiaryId) => {
           try {
             const response = await fetch(
               `${apiUrl}/inspection/pdf?TourDiaryId=${TourDiaryId}`,
               {
                 method: 'GET',
                 headers: {
                   Authorization: `token=${token}`
                 }
               }
             );
         
             if (!response.ok) {
               throw new Error('Failed to download PDF');
             }
         
             const blob = await response.blob();
             const url = window.URL.createObjectURL(blob);
         
             const a = document.createElement('a');
             a.href = url;
             a.download = `Inspection_${TourDiaryId}.pdf`;
             document.body.appendChild(a);
             a.click();
         
             document.body.removeChild(a);
             window.URL.revokeObjectURL(url);
         
           } catch (error) {
             console.error('PDF download error:', error);
             toast.error('Unable to download inspection report');
           }
         };


        const fetchDCOSbyZone = async () => {
           try{
               const payload = {ZoneId}
       
               _fetch('dcosbyzone',payload,false,token).then(res => {
                   if(res.status === 'success'){
                       setOfficersList(res.data);
                   }else {
                       toast.error('Error fetching Officers list')
                   }
               })
       
           }catch(error){
               console.error('Error fetching Officers list by Zone',error);
           }
         }


          const getStatus = (status) => {
    switch(status){
        case 'Planned': 
        return {badge: 'badge bg-primary'};
        
        case 'Visited - Pending Proof':
            return {badge: 'badge bg-warning text-dark'}

        case 'Completed':
            return {badge: "badge bg-success" };

        case 'Not Visited':
            return {badge: "badge bg-danger" };

        case 'Cannot Visit':
            return {badge: "badge bg-secondary" };

        default:
      return {badge: "badge bg-dark" };
    }
    
}

const fetchDCOWiseReport = async () => {
  if (!fromDate || !toDate) {
    toast.warning('Please select From and To dates');
    return;
  }

  try {

    const officerIdsToSend =
  selectedOfficers.length > 0
    ? selectedOfficers.map(o => o.value)
    : officersList.map(o => o.UserId);

    const payload = {
      FromDate: fromDate,
      ToDate: toDate,
      OfficerIds: officerIdsToSend,
      ZoneId
    };

    const res = await _fetch(
      'dcowisereport',
      payload,
      false,
      token
    );

    if (res.status === 'success') {
      setSummary(res.summary);
      setVisits(res.visits);
    } else {
      toast.error('Failed to fetch report');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error fetching DCO Wise Report');
  }
};

const ExcelReportDCOWise = async (
  summary = [],
  visits = [],
  meta = {}
) => {
  const {
    officers = [],
    fromDate,
    toDate
  } = meta;

  if (!summary.length && !visits.length) {
    toast.warning('No data available to export');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const todayDate = format(new Date(), 'dd-MM-yyyy');

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  /* =====================================================
     SHEET 1: DCO SUMMARY
  ===================================================== */
  const sheetSummary = workbook.addWorksheet("DCO Summary");

  sheetSummary.addRow([`Report Type: DCO Wise Inspection Compliance`]).font = { bold: true };
  sheetSummary.addRow([
    `DCOs: ${
      officers.length
        ? officers.map(o => o.label).join(', ')
        : 'All DCOs'
    }`
  ]).font = { bold: true };
  sheetSummary.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  sheetSummary.addRow([`To Date: ${toDate}`]).font = { bold: true };
  sheetSummary.addRow([`Generated On: ${todayDate}`]).font = { bold: true };
  sheetSummary.addRow([]);

  const summaryHeaders = [
    { header: "DCO Name", key: "OfficerName" },
    { header: "District", key: "DistrictName" },
    { header: "Monthly Visit Target", key: "VisitTarget" },
    { header: "Total Scheduled Visits", key: "TotalVisits" },
    { header: "Completed", key: "Completed" },
    { header: "Not Visited", key: "NotVisited" },
    { header: "Cannot Visit", key: "CannotVisit" },
    { header: "Additional Visits", key: "AdditionalVisits" },
  ];

  const headerRow = sheetSummary.addRow(summaryHeaders.map(h => h.header));
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };
  headerRow.eachCell(cell => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" },
    };
  });

  summary.forEach(item => {
    const row = sheetSummary.addRow(
      summaryHeaders.map(h => item[h.key] ?? '-')
    );
    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  sheetSummary.columns.forEach(col => (col.width = 22));

  /* =====================================================
     SHEET 2: VISIT DETAILS
  ===================================================== */
  const sheetVisits = workbook.addWorksheet("Inspection Details");

  sheetVisits.addRow([`Report Type: DCO Wise Inspection Details`]).font = { bold: true };
  sheetVisits.addRow([
    `DCOs: ${
      officers.length
        ? officers.map(o => o.label).join(', ')
        : 'All DCOs'
    }`
  ]).font = { bold: true };
  sheetVisits.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  sheetVisits.addRow([`To Date: ${toDate}`]).font = { bold: true };
  sheetVisits.addRow([`Generated On: ${todayDate}`]).font = { bold: true };
  sheetVisits.addRow([]);

  const visitHeaders = [
    "S.No",
    "DCO Name",
    "District",
    "Visit Date",
    "School",
    "School Code",
    "Photos Uploaded",
    "Report Submitted",
    "Status",
  ];

  const visitHeaderRow = sheetVisits.addRow(visitHeaders);
  visitHeaderRow.font = { bold: true };
  visitHeaderRow.alignment = { horizontal: "center" };
  visitHeaderRow.eachCell(cell => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E9EDF4" },
    };
  });

  visits.forEach((item, index) => {
    const row = sheetVisits.addRow([
      index + 1,
      item.OfficerName || '-',
      item.DistrictName || '-',
      item.VisitDate
        ? format(new Date(item.VisitDate), 'dd-MM-yyyy')
        : '-',
      item.PartnerName?.replace('TGSWREIS', '') || '-',
      item.SchoolCode || '-',
      item.PhotosUploaded || 'No',
      item.ReportSubmitted || 'No',
      item.StatusText || '-',
    ]);

    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  sheetVisits.columns.forEach(column => {
    let maxLength = 14;
    column.eachCell({ includeEmpty: true }, cell => {
      maxLength = Math.max(
        maxLength,
        cell.value ? cell.value.toString().length : 0
      );
    });
    column.width = maxLength + 2;
  });

  /* =====================================================
     EXPORT FILE
  ===================================================== */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `DCO_Wise_Inspection_Report_${todayDate}.xlsx`
  );
};


useEffect(
    () => {
        fetchDCOSbyZone()
    }
,[ZoneId])

  return (
    <>
    <ToastContainer/>
     <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='table-header'>
                 <h5 className="chart-title">DCO Wise Inspection Compliance Report</h5>
                 <div>
                      <button className='btn btn-success' onClick={() =>
    ExcelReportDCOWise(summary, visits, {
      officers: selectedOfficers,
      fromDate,
      toDate
    })
  }>Excel Report</button>
                 </div>
                </div>
                <div className='row align-items-center'>

                    {UserType !== 'DCO' && (
  <div className="col-sm-3">
    <label className="form-label">
      {UserType === 'Admin' ? 'Select DCOs' : 'Select Officers'}
    </label>

    <Select
      isMulti
      options={officerOptions}
      value={selectedOfficers}
      onChange={setSelectedOfficers}
      placeholder="All Officers"
      closeMenuOnSelect={false}
    />

    <small className="text-muted">
     Leave empty to include all DCOs in this zone
    </small>
  </div>
)}

                 
                    <div className="col-sm-3">
  <label className="form-label">From Date</label>
  <input
    type="date"
    className="form-control"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
  />
</div>

<div className="col-sm-3">
  <label className="form-label">To Date</label>
  <input
    type="date"
    className="form-control"
    value={toDate}
    min={fromDate}
    onChange={(e) => setToDate(e.target.value)}
  />
</div>
                    <div className='col-sm-12 text-center'>
                        <button className='btn btn-primary mt-4' onClick={() => fetchDCOWiseReport()}>Fetch</button>
                        
                    </div>
                </div>
                <div className='row pt-3 g-3'>
                    <div className='col-sm-12'>
                        <h6 className='fw-bold'>Summary</h6>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Officer Name</th>
                                    <th>Designation</th>
                                    <th>District Name</th>
                                    <th>Monthly Visit Target</th>
                                    <th>Total Scheduled Visits</th>
                                    <th>Completed</th>
                                    <th>Not Visited</th>
                                    <th>Cannot Visit</th>
                                    <th>Additional Visits</th>
                                </tr>
                            </thead>
                            <tbody>
                               {Array.isArray(summary) && summary.length > 0 ? (  summary.map((item,index) => (
                                <tr key={index}>
                                    <td>{item.OfficerName}</td>
                                    <td>District Coordinator</td>
                                    <td>{item.DistrictName}</td>
                                    <td>{item.VisitTarget}</td>
                                    <td>{item.TotalVisits}</td>
                                    <td>{item.Completed}</td>
                                    <td>{item.NotVisited}</td>
                                    <td>{item.CannotVisit}</td>
                                    <td>{item.AdditionalVisits}</td>
                                </tr>
                               ))) : (<tr> <td colSpan={6} className="text-center">No Data</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-sm-12'>
                        <h6 className='fw-bold'>Scheduled Inspections</h6>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Officer Name</th>
                                    <th>Designation</th>
                                    <th>Visit Date</th>
                                    <th>School</th>
                                    <th>School Code</th>
                                    <th>Photos Uploaded</th>
                                    <th>Report Submitted</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(visits) && visits.length > 0 ? (  visits.map((item,index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.OfficerName}</td>
                                        <td>{item.RoleDisplayName} - {item.ZoneName || item.DistrictName}</td>
                                        <td>{item.VisitDate}</td>
                                        <td>{item.PartnerName.replace('TGSWREIS','')}</td>
                                        <td>{item.SchoolCode}</td>
                                        <td>{item.PhotosUploaded}</td>
                                        <td>{item.ReportSubmitted}</td>
                                        <td><span className={getStatus(item.StatusText).badge}>{item.StatusText}</span></td>
                                        <td>
                                             <div className='d-flex gap-2 justify-content-end'>
                                         {item.ReportSubmitted === 'Yes' && ( <button className='btn btn-primary btn-sm' onClick={() => DownloadInspectionPdfReport(item.TourDiaryId)}>Download Inspection PDF</button>)}     
              
           
  {item.PhotoAttachment ? (() => {
    const photosArray = JSON.parse(item.PhotoAttachment);
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => openPhotoGallery(item.TourDiaryId, photosArray)}
      >
        View Photos ({photosArray.length})
      </button>
    );
  })() : (
    null
  )}


            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                        <tr  className='text-center'>
                                        <td colSpan={8}>No Visits Undertaken</td>
                                        </tr>
                                )}
                              
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
     {/*Report Modal*/}

      {showReportModal && selectedTourDiaryId && (
  <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Visit Report</h5>
          <button className="btn-close" onClick={() => setShowReportModal(false)} />
        </div>
        <div className="modal-body" style={{ height: '80vh' }}>
          <iframe
            src={selectedFileUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </div>
        <div className="modal-footer">
          <a
            className="btn btn-success"
            download
            href={`/uploads/reports/${visits.find(x => x.TourDiaryId === selectedTourDiaryId).ReportPDF}`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
      )}
    </>
  )
}

export default DCOWiseReport