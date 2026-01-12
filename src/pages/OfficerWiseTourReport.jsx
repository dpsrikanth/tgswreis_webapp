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


const OfficerWiseTourReport = () => {
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
    label: o.OfficerName
  }));


  const roleOptions = [
  { value: 'ALL', label: 'All Roles' },
  { value: 'DCO', label: 'District Coordinator' },
  { value: 'Admin', label: 'Zonal Officer' },
  { value: 'MultiZone', label: 'Multi Zone Officer' },
  { value: 'StateOfficer', label: 'State Officer' },
  { value: 'SpecialOfficer', label: 'Special Officer' },  
];

const [selectedRoles, setSelectedRoles] = useState([
  { value: 'ALL', label: 'All Roles' }
]);


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
        const roles = selectedRoles.map(r => r.value);
        const Roles = `${roles.join(',')}`
        const payload = {Roles}

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
    if (!fromDate || !toDate) {
    toast.warning('Please select From and To dates');
    return;
  }

    const roles = selectedRoles.map(r => r.value);
        const Roles = `${roles.join(',')}`

    try {
        const payload = 
        {
        FromDate: fromDate,
        ToDate: toDate,
        Roles,
        OfficerIds: selectedOfficers.map(o => o.value),
        ZoneId
        }

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


const ExcelReportOfficerWise = async (summary = [], visits = [], meta = {}) => {
  const {
    designation = selectedRoles.some(r => r.value === 'ALL')
    ? 'All Roles'
    : selectedRoles.map(r => r.label).join(', '),
    officers = [],
    fromDate,
    toDate
  } = meta;

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

  const todayDate = format(new Date(), 'dd-MM-yyyy');

  /* =====================================================
     SHEET 1: SUMMARY
  ===================================================== */
  const sheetSummary = workbook.addWorksheet("Summary");

  sheetSummary.addRow([`Role: ${designation}`]).font = { bold: true };
  sheetSummary.addRow([
    `Officers: ${
      officers.length ? officers.map(o => o.label).join(', ') : 'All Officers'
    }`
  ]).font = { bold: true };
  sheetSummary.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  sheetSummary.addRow([`To Date: ${toDate}`]).font = { bold: true };
  sheetSummary.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
  sheetSummary.addRow([]);

  const summaryHeaders = [
    { header: "Officer Name", key: "OfficerName" },
    { header: "Designation", key: "RoleDisplayName" },
    { header: "Visit Target", key: "VisitTarget" },
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

  sheetSummary.columns.forEach(col => (col.width = 20));

  /* =====================================================
     SHEET 2: VISIT DETAILS
  ===================================================== */
  const sheetVisits = workbook.addWorksheet("Visit Details");

  sheetVisits.addRow([`Role: ${designation}`]).font = { bold: true };
  sheetVisits.addRow([
    `Officers: ${
      officers.length ? officers.map(o => o.label).join(', ') : 'All Officers'
    }`
  ]).font = { bold: true };
  sheetVisits.addRow([`From Date: ${fromDate}`]).font = { bold: true };
  sheetVisits.addRow([`To Date: ${toDate}`]).font = { bold: true };
  sheetVisits.addRow([`Report Generated: ${todayDate}`]).font = { bold: true };
  sheetVisits.addRow([]);

  const visitHeaders = [
    "S.No",
    "Officer Name",
    "Designation",
    "Visit Date",
    "School",
    "School Code",
    "Photos Uploaded",
    "Report Uploaded",
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
      `${item.RoleDisplayName || ''} ${item.ZoneName || item.DistrictName || ''}`,
      item.VisitDate ? format(new Date(item.VisitDate), 'dd-MM-yyyy') : '-',
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
    let maxLength = 12;
    column.eachCell({ includeEmpty: true }, cell => {
      maxLength = Math.max(
        maxLength,
        cell.value ? cell.value.toString().length : 0
      );
    });
    column.width = maxLength + 2;
  });

  /* =====================================================
     EXPORT
  ===================================================== */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `OfficerWiseTourReport_${todayDate}.xlsx`
  );
};




  useEffect(() => {
    if(selectedRoles){
        fetchOfficersList();
    }
  },[selectedRoles])


  useEffect(() => {
    if(UserType === 'Admin'){
      setDesignation('DCO');
      fetchOfficersList();
    }
  },[UserType])


  useEffect(() => {
  setSelectedOfficers([]);
}, [officersList]);


  return (
    <>
    <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                <div className='table-header'>
                 <h5 className="chart-title">Officer Wise Compliance Report</h5>
                 <div>
                      <button className='btn btn-success' onClick={() => ExcelReportOfficerWise(summary, visits, {
  selectedRoles,
  officers: selectedOfficers,
  fromDate,
  toDate
})}>Excel Report</button>
                 </div>
                </div>
                <div className='row align-items-center'>
               {/* {UserType === 'SuperAdmin' || UserType === 'StateOfficer' && (<div className='col-sm-3'>
                        <label className='form-label'>Select Role</label>
                   
                        <select className='form-select' value={designation} onChange={(e) => setDesignation(e.target.value)}>
                            <option value=''>Please Select</option>
                             <option value='SpecialOfficer'>Special Officer</option>
                            <option value='StateOfficer'>State Officer</option>
                            <option value='MultiZone'>Multi Zone Officer</option>
                             <option value='Admin'>Zonal Officer</option>
                            <option value='DCO'>District Coordinator</option>
                        </select> 
                    </div> )} */}
                    {/* <div className='col-sm-3'>
                        <label className='form-label'>Select Officer</label>
                        <select className='form-select' value={selectedOfficerId} onChange={(e) => setSelectedOfficerId(e.target.value)}>
                            <option value=''>--Select--</option>
                            {officersList.map((item,index) => (
                                <option key={item.UserId} value={item.UserId}>{item.OfficerName}</option>
                            ))}
                        </select>
                    </div> */}
                     <div className='col-sm-3'>
                      <label className='form-label'>Select Roles</label>
                       <Select
  isMulti
  options={roleOptions}
  value={selectedRoles}
  onChange={(selected) => {
    if (selected.some(r => r.value === 'ALL')) {
      setSelectedRoles([{ value: 'ALL', label: 'All Roles' }]);
    } else {
      setSelectedRoles(selected);
    }
  }}
  closeMenuOnSelect={false}
/>
                     </div>
                   


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
      Leave empty to include all
    </small>
  </div>
)}

                    {/* <div className='col-sm-3'>
                        <label className='form-label'>Select Month</label>
                        <input type="month" className='form-control' value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                    </div> */}
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
                        <button className='btn btn-primary mt-4' onClick={() => fetchOfficerWiseReport()}>Fetch</button>
                        
                    </div>
                </div>
                <div className='row pt-3 g-3'>
                    <div className='col-sm-12'>
                        <h6 className='fw-bold'>Summary</h6>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Officer Name</th>
                                    <th>Designation</th>
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
                                  <td>{index + 1}</td>
                                    <td>{item.OfficerName}</td>
                                    <th>{item.RoleDisplayName}  {(item.RoleDisplayName === 'Zonal Officer' ||
    item.RoleDisplayName === 'District Coordinator') && (
      <> - {item.ZoneName || item.DistrictName}</>
  )}</th>
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
                                        <td>{item.RoleDisplayName}  {(item.RoleDisplayName === 'Zonal Officer' ||
    item.RoleDisplayName === 'District Coordinator') && (
      <> - {item.ZoneName || item.DistrictName}</>
  )}</td>
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

export default OfficerWiseTourReport