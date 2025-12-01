import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState, useRef,} from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select';

const UploadTourReports = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserId = useSelector((state) => state.userappdetails.profileData.Id)
const {TourDiaryId} = useParams();
const [photos,setPhotos] = useState([]);
const [report,setReport] = useState(null);
const [tourInfo,setTourInfo] = useState(null);


const fetchTourInfo = async () => {
    try {

        const payload = {TourDiaryId}
        _fetch('tourinfo',payload,false,token).then(res => {
            if(res.status === 'success'){
                setTourInfo(res.data)
            }else{
                toast.error('Error fetching tour info')
            }
        })

    } catch(error){
        console.error('Error fetching tour info',error)
    }
}


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
    <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Upload Tour Reports</h6>
     
      <div className="row gy-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Upload Visit Report and Photos</h5>
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Visit Date:</label>
                         <div className='fw-bold'>{tourInfo ? tourInfo[0]?.DateOfVisit?.split('T')[0] : ''}</div>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">School:</label>
                        <div className='fw-bold'>{tourInfo ? tourInfo[0].PartnerName : ''}</div>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Upload Report</label>
                        <input type="file" className="form-control" accept='.pdf' onChange={(e) => setReport(e.target.files[0]) } />
                    </div>
                    <div className="col-sm-4">
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
                    </div>
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
                    <div className="col-sm-12 text-center">
                        <button className="btn btn-primary me-2" onClick={() => uploadReport()}>Upload Report</button>
                        <button className="btn btn-primary me-2" onClick={() => uploadPhotos()}>Upload Photos</button>
                        <button className="btn btn-primary" onClick={() => markCompleted()}>Mark Completed</button>
                    </div>
                   
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Uploaded Reports</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Officer</th>
                                <th>Location</th>
                                <th>Report</th>
                                <th>Photos</th>
                                <th>Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-11-15</td>
                                <td>John Doe</td>
                                <td>51902 - Adilabad</td>
                                <td><button className="btn btn-sm">Report</button></td>
                                <td><span className="badge bg-primary">5 Photos</span></td>
                                <td>2025-11-15 18:30</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        
      </div>
    </>
  )
}

export default UploadTourReports