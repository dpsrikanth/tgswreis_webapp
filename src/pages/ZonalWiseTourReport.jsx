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



const ZonalWiseTourReport = () => {
     const token = useSelector((state) => state.userappdetails.TOKEN);
          const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
          const UserId = useSelector((state) => state.userappdetails.profileData.Id);
          const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
          const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId);
          const MultiZoneId = useSelector((state) => state.userappdetails.profileData.MultiZoneId);

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
                 
                 
                         const fetchZonalOffcersbyMultiZone = async () => {
                            try{
                                const payload = {MultiZoneId}
                        
                           const res = await _fetch('zosbymultizone',payload,false,token)
                                    if(res.status === 'success'){
                                        setOfficersList(res.data);
                                    }else {
                                        toast.error('Error fetching Officers list')
                                    }
                                
                        
                            }catch(error){
                                console.error('Error fetching Officers list by MultiZone',error);
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
                 
                const fetchZonalWiseReport = async () => {
  if (!fromDate || !toDate) {
    toast.warning('Please select From and To dates');
    return;
  }

  const officerIdsToSend =
    selectedOfficers.length > 0
      ? selectedOfficers.map(o => o.value)
      : officersList.map(o => o.UserId);

  const payload = {
    FromDate: fromDate,
    ToDate: toDate,
    OfficerIds: officerIdsToSend,
    MultiZoneId
  };

  const res = await _fetch(
    'zonalwisetourreport',
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
};


useEffect(() => {
  if (UserType === 'MultiZone') {
    fetchZonalOffcersbyMultiZone();
  }
}, []);


const officerOptions = officersList.map(o => ({
  value: o.UserId,
  label: `${o.ZoneContactName} (${o.ZoneName})`
}));


const ExcelReportZonalWise = async (
  summary = [],
  visits = [],
  meta = {}
) => {
  const {
    multiZoneName = "Multi Zone",
    fromDate,
    toDate
  } = meta;

  const workbook = new ExcelJS.Workbook();
  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  const today = format(new Date(), "dd-MM-yyyy");

  /* =========================
     SHEET 1 – SUMMARY
     ========================= */
  const summarySheet = workbook.addWorksheet("Summary");

  summarySheet.addRow([`Multi-Zone Wise Tour Summary`]).font = {
    bold: true,
    size: 16
  };
  summarySheet.mergeCells("A1:I1");

  summarySheet.addRow([`Multi Zone: ${multiZoneName}`]).font = { bold: true };
  summarySheet.addRow([
    `Period: ${format(new Date(fromDate), "dd MMM yyyy")} to ${format(
      new Date(toDate),
      "dd MMM yyyy"
    )}`
  ]);
  summarySheet.addRow([`Report Generated: ${today}`]);
  summarySheet.addRow([]);

  const summaryHeaders = [
    "Officer Name",
    "Zone Name",
    "Monthly Target",
    "Total Visits",
    "Completed",
    "Not Visited",
    "Cannot Visit",
    "Additional Visits"
  ];

  const headerRow = summarySheet.addRow(summaryHeaders);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  headerRow.eachCell(cell => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }
    };
  });

  summary.forEach(item => {
    const row = summarySheet.addRow([
      item.ZoneContactName,
      item.ZoneName,
      item.VisitTarget,
      item.TotalVisits,
      item.Completed,
      item.NotVisited,
      item.CannotVisit,
      item.AdditionalVisits
    ]);

    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  summarySheet.columns.forEach(col => (col.width = 20));

  /* =========================
     SHEET 2 – VISITS
     ========================= */
  const visitSheet = workbook.addWorksheet("Visit Details");

  visitSheet.addRow([`Multi-Zone Visit Details`]).font = {
    bold: true,
    size: 16
  };
  visitSheet.mergeCells("A1:J1");

  visitSheet.addRow([`Multi Zone: ${multiZoneName}`]).font = { bold: true };
  visitSheet.addRow([
    `Period: ${format(new Date(fromDate), "dd MMM yyyy")} to ${format(
      new Date(toDate),
      "dd MMM yyyy"
    )}`
  ]);
  visitSheet.addRow([`Report Generated: ${today}`]);
  visitSheet.addRow([]);

  const visitHeaders = [
    "S.No",
    "Visit Date",
    "Officer Name",
    "Zone Name",
    "School",
    "School Code",
    "Status",
    "Report Submitted",
    "Photos Uploaded"
  ];

  const visitHeaderRow = visitSheet.addRow(visitHeaders);
  visitHeaderRow.font = { bold: true };
  visitHeaderRow.alignment = { horizontal: "center" };

  visitHeaderRow.eachCell(cell => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E9EDF4" }
    };
  });

  visits.forEach((item, index) => {
    const row = visitSheet.addRow([
      index + 1,
      item.VisitDate,
      item.ZoneContactName,
      item.ZoneName,
      item.PartnerName?.replace("TGSWREIS", "") || "-",
      item.SchoolCode,
      item.StatusText,
      item.ReportSubmitted,
      item.PhotosUploaded
    ]);

    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  visitSheet.columns.forEach(col => {
    let maxLen = 12;
    col.eachCell({ includeEmpty: true }, cell => {
      const len = cell.value ? cell.value.toString().length : 0;
      maxLen = Math.max(maxLen, len);
    });
    col.width = maxLen + 2;
  });

  /* =========================
     EXPORT
     ========================= */
  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `MultiZone_Tour_Report_${today}.xlsx`
  );
};


  return (
   <>
    <ToastContainer/>
     <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='table-header'>
                 <h5 className="chart-title">Zonal Wise Inspection Compliance Report</h5>
                 <div>
                      <button className='btn btn-success' onClick={() =>
    ExcelReportZonalWise(summary, visits, {
      multiZoneName: "MultiZone-I",
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
     Leave empty to include all Zonal Officers in this Multizone
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
    onChange={(e) => setToDate(e.target.value)}
  />
</div>
                    <div className='col-sm-12 text-center'>
                        <button className='btn btn-primary mt-4' onClick={() => fetchZonalWiseReport()}>Fetch</button>
                        
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
                                    <th>Zone Name</th>
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
                                    <td>{item.ZoneContactName}</td>
                                    <td>Zonal Officer</td>
                                    <td>{item.ZoneName}</td>
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
                                        <td>{item.ZoneContactName}</td>
                                        <td>Zonal Officer</td>
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

export default ZonalWiseTourReport