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


const OfficerWiseTourReport = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const UserId = useSelector((state) => state.userappdetails.profileData.Id);

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
  const apiUrl = import.meta.env.VITE_API_URL;


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


  

  const fetchOfficersList = async () => {
    try{

        const payload = {Designation:designation}

        _fetch('getofficersbydesig',payload,false,token).then(res => {
            if(res.status === 'success'){
                setOfficersList(res.data);
            }else {
                toast.error('Error fetching Officers list')
            }
        })

    }catch(error){
        console.error('Error fetching Officers list by desgination',error);
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


  const fetchOfficerWiseReport = async() => {
    try {
         const [year,month] = selectedMonth.split('-');
        const payload = {UserId:selectedOfficerId,Month:month,Year:year}

        _fetch('officerwisereport',payload,false,token).then(res => {
            if(res.status === 'success'){
                setSummary(res.summary);
                setVisits(res.visits);
            }
        })

    } catch(error){
        console.error('Error fetching Officer Wise Report',error)
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


const ExcelReportOfficerWise = async (summary, visits,meta) => {
    const {designation,officerName,selectedMonth} = meta;
  const workbook = new ExcelJS.Workbook();

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // ================== SHEET-1 Summary ==================
  const summaryHeaders = [
    { header: "Visit Target", key: "VisitTarget" },
    { header: "Total Visits", key: "TotalVisits" },
    { header: "Completed", key: "Completed" },
    { header: "Not Visited", key: "NotVisited" },
    { header: "Cannot Visit", key: "CannotVisit" },
    { header: "Additional Visits", key: "AdditionalVisits" },
  ];

  const sheetSummary = workbook.addWorksheet("Summary");
  const todayDate = new Date().toISOString().split("T")[0];

//   const title1 = sheetSummary.addRow([
//     `Officer Wise Tour Summary - ${todayDate}`,
//   ]);
//   title1.font = { bold: true, size: 16 };
//   title1.alignment = { horizontal: "center" };
//   sheetSummary.mergeCells("A1:H1");
//   sheetSummary.addRow([]);

  // Metadata (Designation, Officer, Month)
sheetSummary.addRow([`Role: ${designation}`]).font = { bold: true };
sheetSummary.addRow([`Officer Name: ${officerName}`]).font = { bold: true };
sheetSummary.addRow([`Month: ${format(new Date(selectedMonth), 'MMMM yyyy')}`]).font = { bold: true };
sheetSummary.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
sheetSummary.addRow([]); // Blank row


  const summaryHeaderRow = sheetSummary.addRow(
    summaryHeaders.map((h) => h.header)
  );
  summaryHeaderRow.font = { bold: true };
  summaryHeaderRow.alignment = { horizontal: "center" };
  summaryHeaderRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" },
    };
  });

  const rowValues = summaryHeaders.map((h) => summary[h.key] ?? "");
  const summaryRow = sheetSummary.addRow(rowValues);
  summaryRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.alignment = { horizontal: "center" };
  });

  sheetSummary.columns.forEach((col) => (col.width = 18));

  // ================= SHEET-2 Detailed Visits =================
  const visitHeaders = [
    { header: "S.No", key: "index" },
    { header: "Visit Date", key: "DateOfVisit" },
    { header: "School", key: "PartnerName" },
    { header: "School Code", key: "SchoolCode" },
    { header: "Photos Uploaded", key: "PhotosUploaded" },
    { header: "Report Uploaded", key: "ReportUploaded" },
    { header: "Status", key: "StatusText" },
  ];

  const sheetVisits = workbook.addWorksheet("Visit Details");

//   const title2 = sheetVisits.addRow([
//     `Officer Visit-wise Details - ${todayDate}`,
//   ]);
//   title2.font = { bold: true, size: 16 };
//   title2.alignment = { horizontal: "center" };
//   sheetVisits.mergeCells("A1:G1");
//   sheetVisits.addRow([]);


   // Metadata (Designation, Officer, Month)
sheetVisits.addRow([`Role: ${designation}`]).font = { bold: true };
sheetVisits.addRow([`Officer Name: ${officerName}`]).font = { bold: true };
sheetVisits.addRow([`Month: ${format(new Date(selectedMonth), 'MMMM yyyy')}`]).font = { bold: true };
sheetVisits.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
sheetVisits.addRow([]); // Blank row

  const visitHeaderRow = sheetVisits.addRow(
    visitHeaders.map((h) => h.header)
  );
  visitHeaderRow.font = { bold: true };
  visitHeaderRow.alignment = { horizontal: "center" };
  visitHeaderRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E9EDF4" },
    };
  });

  visits.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.VisitDate ? item.VisitDate.split("T")[0] : "-",
      item.PartnerName?.replace("TGSWREIS", "") || "-",
      item.SchoolCode || "-",
      item.PhotosUploaded || "",
      item.ReportUploaded || "",
      item.StatusText || "",
    ];

    const row = sheetVisits.addRow(rowData);
    row.eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });
  });

  // Autofit
  sheetVisits.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value ? cell.value.toString().length : 0;
      maxLength = Math.max(maxLength, len);
    });
    column.width = maxLength + 2;
  });

  // Export file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `OfficerWiseTourReport_${todayDate}.xlsx`
  );
};




  useEffect(() => {
    if(designation){
        fetchOfficersList();
    }
  },[designation])


  return (
    <>
    <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='table-header'>
                 <h5 className="chart-title">Officer Wise Compliance Report</h5>
                 <div>
                      <button className='btn btn-success' onClick={() => ExcelReportOfficerWise(summary,visits,{
  designation,
  officerName: officersList.find(o => o.UserId === selectedOfficerId)?.OfficerName,
  selectedMonth,
})}>Excel Report</button>
                 </div>
                </div>
                <div className='row align-items-center'>
                    <div className='col-sm-3'>
                        <label className='form-label'>Select Role</label>
                         <select className='form-select' value={designation} onChange={(e) => setDesignation(e.target.value)}>
                            <option value=''>Please Select</option>
                            <option value='District Coordinator'>District Coordinator</option>
                            <option value='Zonal Officer'>Zonal Officer</option>
                            <option value='Special Officer'>Special Officer</option>
                        </select>
                    </div>
                    <div className='col-sm-3'>
                        <label className='form-label'>Select Officer</label>
                        <select className='form-select' value={selectedOfficerId} onChange={(e) => setSelectedOfficerId(e.target.value)}>
                            <option value=''>--Select--</option>
                            {officersList.map((item,index) => (
                                <option key={item.UserId} value={item.UserId}>{item.OfficerName}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-sm-3'>
                        <label className='form-label'>Select Month</label>
                        <input type="month" className='form-control' value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                    </div>
                    <div className='col-sm-2'>
                        <button className='btn btn-primary mt-4' onClick={() => fetchOfficerWiseReport()}>Fetch</button>
                        
                    </div>
                </div>
                <div className='row pt-3 g-3'>
                    <div className='col-sm-12'>
                        <h6 className='fw-bold'>Summary</h6>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Visit Target</th>
                                    <th>Total Visits</th>
                                    <th>Completed</th>
                                    <th>Not Visited</th>
                                    <th>Cannot Visit</th>
                                    <th>Additional Visits</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{summary.VisitTarget}</td>
                                    <td>{summary.TotalVisits}</td>
                                    <td>{summary.Completed}</td>
                                    <td>{summary.NotVisited}</td>
                                    <td>{summary.CannotVisit}</td>
                                    <td>{summary.AdditionalVisits}</td>
                                </tr>
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
                                    <th>Report Uploaded</th>
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
                                        <td>{item.ReportUploaded}</td>
                                        <td><span className={getStatus(item.StatusText).badge}>{item.StatusText}</span></td>
                                        <td>
                                             <div className='d-flex gap-2 justify-content-end'>
                                               <button className='btn btn-primary btn-sm' onClick={() => DownloadInspectionPdfReport(item.TourDiaryId)}>Download Inspection PDF</button>
               {/* {item.ReportPDF ? (
              <button className="btn btn-primary btn-sm mb-2"
                onClick={() => {
                  setSelectedTourDiaryId(item.TourDiaryId);
                  setSelectedFileUrl(`${apiUrl}/uploads/tourdiary/${item.TourDiaryId}/reports/${item.ReportPDF}`);
                  setShowReportModal(true);
                }}>
                View Report
              </button>
            ) : null} */}

             {/* Photos */}
            {/* {item.PhotoAttachment && (
              <div>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => { setSelectedTourDiaryId(item.TourDiaryId); setShowImagesModal(true); }}>
                  Photos
                </button>
                <small className="text-muted ms-1">
                  ({JSON.parse(item.PhotoAttachment).length}) photos
                </small>
              </div>
            )} */}
           
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

export default OfficerWiseTourReport