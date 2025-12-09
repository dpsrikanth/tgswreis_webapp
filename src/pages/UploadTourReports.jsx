import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState, useRef,} from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";

const UploadTourReports = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserId = useSelector((state) => state.userappdetails.profileData.Id)
const {TourDiaryId} = useParams();
const [photos,setPhotos] = useState([]);
const [report,setReport] = useState(null);
const [tourInfo,setTourInfo] = useState(null);
const [loading, setLoading] = useState(false);
const [uploadedReport,setUploadedReport] = useState(null);
const [uploadedPhotos,setUploadedPhotos] = useState('');
const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;


const validateFiles = () => {
    if(report && report.size > 3 * 1024 * 1024){
        toast.error('PDF Size must be less than 3MB');
        return false;
    }

    for(let file of photos){
        if(file.size > 1 * 1024 * 1024){
            toast.error('Each Photo must be less than 1MB');
            return false;
        }
    }
    return true;
}


const fetchTourInfo = async () => {
    try {

        const payload = {TourDiaryId}
        _fetch('tourinfo',payload,false,token).then(res => {
            if(res.status === 'success'){
                setTourInfo(res.data[0])
                setUploadedReport(res.data[0].ReportPDF || null)
                setUploadedPhotos(res.data[0].PhotoAttachment ? JSON.parse(res.data[0].PhotoAttachment): [])
            }else{
                toast.error('Error fetching tour info')
            }
        })

    } catch(error){
        console.error('Error fetching tour info',error)
    }
}


const handleSubmit = () => {
    if(!report && photos.length === 0){
     toast.error("Upload report or photos before completing");
      return;
    }
    if(!validateFiles()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("TourDiaryId", TourDiaryId);

    if (report) formData.append("report", report);
    photos.forEach(f => formData.append("photos", f));

    _fetch('uploadtourassetscomplete',formData,true,token).then(res => {
        setLoading(false);
        if (res.status === 'success') {
        toast.success(res.message);
        setTimeout(() => navigate("/touruservisits"), 1200);
      } else {
        toast.error(res.message);
      }
    })
}

const existingPhotos = tourInfo?.PhotoAttachment
    ? JSON.parse(tourInfo.PhotoAttachment)
    : [];


const uploadReport = async () => {
    if(!report){
        toast.error('Please select a Report File');
        return;
    }

    const formData = new FormData();

    formData.append("TourDiaryId",TourDiaryId);
    formData.append("report",report);

    try {

        _fetch("uploadtourreport",formData,true,token).then(res => {
            if(res.status === 'success'){
                toast.success('Report Uploaded')
            } else {
                toast.error(res.message)
            }
        })

    } catch(error){
        console.error('Error uploading Report',error)
    }
}


const uploadPhotos = async () => {
    if(!photos.length){
        toast.error('Please select atleast one photo');
        return;
    }

    const formData = new FormData();

    formData.append('TourDiaryId',TourDiaryId);
    photos.forEach((file) => {
  formData.append("photos", file);
});

    try {
        _fetch('uploadtourphotos',formData,true,token).then(res => {
            if(res.status === 'success'){
                toast.success('Photos Uploaded Successfully')
            } else {
                toast.error(res.message)
            }
        })

    } catch(error){
        console.error('Error fetching Photos',error);
    }
}

const markCompleted = async () => {
    try {
        const payload = {TourDiaryId}

        _fetch('markcompleted',payload,false,token).then(res => {
            if(res.status === 'success'){
                toast.success('Status updated to Completed')
            } else {
                toast.error(res.message);
            }
        })
    } catch (error){
        console.error('Error updating status to completed',error)
    }
}


useEffect(() => {
fetchTourInfo();
},[])


  return (
    <>
      <ToastContainer />
    <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/touruservisits')}} style={{cursor:'pointer'}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Upload Tour Reports</h6>
     
      <div className="row gy-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Upload Visit Report and Photos</h5>
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Visit Date:</label>
                         <span className='fw-bold ms-2'>{tourInfo ? tourInfo?.DateOfVisit?.split('T')[0] : ''}</span>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">School:</label>
                        <span className='fw-bold ms-2'>{tourInfo ? tourInfo.PartnerName : ''}</span>
                    </div>
                    {/* <div className="col-sm-4">
                        <label className="form-label">Upload Report</label>
                        <input type="file" className="form-control" accept='.pdf' onChange={(e) => setReport(e.target.files[0]) } />
                    </div> */}
                    {/* Report Upload */}

                    <div className='col-sm-6'>
                      <div className="mb-3">
          <label className="form-label">Report (PDF) <span className='fw-bold' style={{color:'red'}}>(Note: Size Limit is 3MB)</span></label>
          {tourInfo?.ReportPDF && (
            <div className="mb-2 small">
              <a
                href={`${API_URL}/uploads/tourdiary/${TourDiaryId}/reports/${tourInfo.ReportPDF}`}
                target="_blank"
              >
                📄 View Existing Report
              </a>
            </div>
          )}
          <input
            type="file"
            accept=".pdf"
            className="form-control"
            onChange={(e) => setReport(e.target.files[0])}
          />
        </div>
                    </div>
      

        {/* Photo Upload */}
        <div className='col-sm-6'>
        <div className="mb-3">
          <label className="form-label">Photos <span className='fw-bold' style={{color:'red'}}>(Note: Only 3 photos allowed)</span></label>
          <input
            type="file"
            multiple accept="image/*"
            className="form-control"
            onChange={(e) => {
            const selected = Array.from(e.target.files);
            const alreadyUploaded =  uploadedPhotos.length
            console.log(alreadyUploaded)
            const total = alreadyUploaded + selected.length;
            console.log(total);
            if(total > 3){
                toast.error(`Only 3 photos allowed`);
                e.target.value = "";
                return;
            }
                setPhotos(selected)}
            }
                
          />
        
          {photos.length > 0 && (
            <div className="text-success small mt-1">
              Selected: {photos.length} files
            </div>
          )}
           
           {existingPhotos.length > 0 && (
            <span className="ms-2 small">
              (Existing Photos: {existingPhotos.length})
            </span>
          )}
            
        </div>
        </div>
        
                    {/* <div className="col-sm-4">
                        <label className="form-label">Upload Photos (Multiple)</label>
                        <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setPhotos(Array.from(e.target.files))}
                />
                   <div className="text-muted small">
                  {photos.length} photo(s) selected
                </div>
                    </div> */}

                    {/* <div className='col-sm-12'>
                        <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="additionalVisit" />
                                <label class="form-check-label" for="additionalVisit">
                                    I visited additional locations beyond scheduled
                                </label>
                            </div>
                    </div> */}
                    {/* <div className='col-sm-4'>
                       <label className='form-label'>Select School</label>
                       <select className='form-select'>
                       <option value="">Select</option>
                       <option>51905</option>
                       </select>
                    </div> */}
                    {/* <div className="col-sm-12 text-center">
                        <button className="btn btn-primary me-2" onClick={() => uploadReport()}>Upload Report</button>
                        <button className="btn btn-primary me-2" onClick={() => uploadPhotos()}>Upload Photos</button>
                        <button className="btn btn-success" onClick={() => markCompleted()}>Mark Completed</button>
                    </div> */}
                   <div className='col-sm-12 text-center'>
                      <button
            disabled={loading}
            className="btn btn-success px-4"
            onClick={handleSubmit}
          >
            {loading ? "Uploading..." : "Submit & Mark Completed ✔"}
          </button>
                   </div> 
                </div>
                </div>
                </div>
                 {/* Submit Button */}
        <div className="text-center">
         
        </div>
        
      </div>
    </>
  )
}

export default UploadTourReports