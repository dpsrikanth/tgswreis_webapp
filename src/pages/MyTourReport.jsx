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


const MyTourReport = () => {
        const token = useSelector((state) => state.userappdetails.TOKEN);
        const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
        const UserId = useSelector((state) => state.userappdetails.profileData.Id);
        const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
        const DistrictId = useSelector((state) => state.userappdetails.profileData.DistrictId);

        const [officersList,setOfficersList] = useState([]);
               const [designation,setDesignation] = useState('');
               const [summary,setSummary] = useState('')
               const [visits,setVisits] = useState([]);
               const [showReportModal,setShowReportModal] = useState(false);
               const [showImagesModal,setShowImagesModal] = useState(false);
               const [selectedFileUrl,setSelectedFileUrl] = useState('');
               const [selectedTourDiaryId,setSelectedTourDiaryId] = useState(null);
               const [fromDate,setFromDate] = useState('');
               const [toDate,setToDate] = useState('');
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


const fetchMyTourReport = async () => {
  if (!fromDate || !toDate) {
    toast.warning('Please select From and To dates');
    return;
  }

  try {
    const payload = {
      FromDate: fromDate,
      ToDate: toDate,
    };

    const res = await _fetch(
      'mytourreport',
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
    toast.error('Error fetching My Inspection Report');
  }
};


const ExcelReportMyTour = async (summary, visits, meta) => {
  const { fromDate, toDate } = meta;

  if (!summary.length && !visits.length) {
      toast.warning('No data available to export');
      return;
    }

  const workbook = new ExcelJS.Workbook();

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const todayDate = new Date().toISOString().split("T")[0];

  /* =======================
     SHEET 1 – SUMMARY
     ======================= */
  const summarySheet = workbook.addWorksheet("Summary");

  summarySheet.addRow([`My Inspection Summary`]).font = { bold: true, size: 14 };
  summarySheet.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  summarySheet.addRow([`To Date: ${toDate}`]).font = { bold: true };
  summarySheet.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
  summarySheet.addRow([]);

  const summaryHeaders = [
    "Total Scheduled Visits",
    "Yet to Visit / Planned",
    "Completed",
    "Not Visited",
    "Cannot Visit",
  ];

  const headerRow = summarySheet.addRow(summaryHeaders);
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

  if (Array.isArray(summary) && summary.length > 0) {
    const s = summary[0];
    const dataRow = summarySheet.addRow([
      s.TotalVisits || 0,
      s.Planned || 0,
      s.Completed || 0,
      s.NotVisited || 0,
      s.CannotVisit || 0,
    ]);

    dataRow.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  }

  summarySheet.columns.forEach(col => (col.width = 25));

  /* =======================
     SHEET 2 – VISITS
     ======================= */
  const visitSheet = workbook.addWorksheet("Scheduled Inspections");

  visitSheet.addRow([`My Scheduled Inspections`]).font = { bold: true, size: 14 };
  visitSheet.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  visitSheet.addRow([`To Date: ${toDate}`]).font = { bold: true };
  visitSheet.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
  visitSheet.addRow([]);

  const visitHeaders = [
    "S.No",
    "Visit Date",
    "School",
    "School Code",
    "Photos Uploaded",
    "Report Submitted",
    "Status",
  ];

  const visitHeaderRow = visitSheet.addRow(visitHeaders);
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
    const row = visitSheet.addRow([
      index + 1,
      item.VisitDate || "-",
      item.PartnerName?.replace("TGSWREIS", "") || "-",
      item.SchoolCode || "-",
      item.PhotosUploaded || "No",
      item.ReportSubmitted || "No",
      item.StatusText || "-",
    ]);

    row.eachCell(cell => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  // Auto-fit columns
  visitSheet.columns.forEach(column => {
    let maxLength = 12;
    column.eachCell({ includeEmpty: true }, cell => {
      const len = cell.value ? cell.value.toString().length : 0;
      maxLength = Math.max(maxLength, len);
    });
    column.width = maxLength + 2;
  });

  /* =======================
     DOWNLOAD FILE
     ======================= */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `My_Inspection_Report_${todayDate}.xlsx`
  );
};


  
  return (
    <>
    <ToastContainer />
      <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='table-header'>
                 <h5 className="chart-title">My Inspection Report</h5>
                 <div>
                      <button className='btn btn-success' onClick={() =>
    ExcelReportMyTour(summary, visits, {
      fromDate,
      toDate,
    })
  }>Excel Report</button>
                 </div>
                </div>
                <div className='row align-items-center'>

                   
                 
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
                        <button className='btn btn-primary mt-4' onClick={() => fetchMyTourReport()}>Fetch</button>
                        
                    </div>
                </div>
                <div className='row pt-3 g-3'>
                    <div className='col-sm-12'>
                        <h6 className='fw-bold'>Summary</h6>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Total Scheduled Visits</th>
                                    <th>Yet to Visit/ Planned</th>
                                    <th>Completed</th>
                                    <th>Not Visited</th>
                                    <th>Cannot Visit</th>
                                </tr>
                            </thead>
                            <tbody>
                               {Array.isArray(summary) && summary.length > 0 ? (  summary.map((item,index) => (
                                <tr key={index}>
                                    <td>{item.TotalVisits || 0}</td>
                                    <td>{item.Planned || 0}</td>
                                    <td>{item.Completed || 0}</td>
                                    <td>{item.NotVisited || 0}</td>
                                    <td>{item.CannotVisit || 0}</td>
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

export default MyTourReport