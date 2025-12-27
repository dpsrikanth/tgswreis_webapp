import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";


const TourUserVisits = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const UserId = useSelector((state) => state.userappdetails.profileData.Id)
const [tourschedule,setTourSchedule] = useState([]);
const [planned,setPlanned] = useState([]);
const [completed,setCompleted] = useState([]);
const [notvisited,setNotVisited] = useState([]);
const [visited,setVisited] = useState([]);
const [cannotVisit,setCannotVisit] = useState([]);
const [selectedTourDiaryId,setSelectedTourDiaryId] = useState(null);
const [visitedId,setVisitedId] = useState(null);
const [cannotVisitId,setCannotVisitId] = useState(null);
const [showMarkVisitModal, setShowMarkVisitModal] = useState(false);
const [showCannotVisitModal, setCannotVisitModal] = useState(false);
const [rejectedReason,setRejectedReason] = useState('');
const [rejectedRemarks,setRejectedRemarks] = useState('');
const navigate = useNavigate();
const [showReportModal,setShowReportModal] = useState(false);
const [showImagesModal,setShowImagesModal] = useState(false);
const [selectedFileUrl,setSelectedFileUrl] = useState('');
const apiUrl = import.meta.env.VITE_API_URL;


const fetchTourScheduleInd = async () => {
    try{
         const payload = {UserId}

        _fetch('tourscheduleindv',payload,false,token).then(res => {
            if(res.status === 'success'){
              setPlanned(res.data.filter(d => d.Status === 1));
              setVisited(res.data.filter(d => d.Status === 2));
              setCompleted(res.data.filter(d => d.Status === 3));
              setNotVisited(res.data.filter(d => d.Status === 4));
              setCannotVisit(res.data.filter(d => d.Status === 5));
            }else{
                toast.error(res.message)
            }
        })

    } catch (error){
        console.error('Error fetching Tour Schedule',error)
    }
}


const MarkCannotVisit = async () => {
    try {

        const payload = {TourDiaryId:cannotVisitId,RejectedReason:rejectedReason,RejectedRemarks:rejectedRemarks}

        _fetch('cannotvisit',payload,false,token).then(res => {
            if(res.status === 'success'){
                 setCannotVisitModal(false);
                fetchTourScheduleInd();
                toast.success(res.message);
            }
        })

    } catch (error){
        console.error('Error updating status to not visted')
    }
}


const MarkVisited = async () => {
    try {

        const payload = {TourDiaryId:visitedId}

        _fetch('markvisited',payload,false,token).then(res =>{
            if(res.status === 'success'){
                setShowMarkVisitModal(false);
                fetchTourScheduleInd();
                setVisitedId(null);
               toast.success(res.message);
               navigate(`/inspectionreportssubmission/${visitedId}`)
            } else {
                toast.error(res.message);
            }
        })

    } catch(error){
        console.error('Error updating status to visited',error)
    }
}

useEffect(() => {
fetchTourScheduleInd();    

},[])


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



const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
}


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




  return (
    <>
    <ToastContainer />
      <h6 className="fw-bold mb-3"><a href="#"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>My Scheduled Inspections</h6>

      <ul className="nav nav-tabs" id="tourTabs">
  <li className="nav-item">
    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#upcoming">Upcoming</button>
  </li>
  <li className="nav-item">
    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#notvisited">Not Visited</button>
  </li>
  <li className="nav-item">
    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#completed">Completed </button>
  </li>
  <li className="nav-item">
    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#cannotvisit">Cannot Visit </button>
  </li>
</ul>

<div className="tab-content pt-3">
    {/*UPCOMING */}
    <div className="tab-pane fade show active" id="upcoming">
      

                <div className="white-box shadow-sm">
    <h5>Upcoming Inspections</h5>

    {planned.length ? planned.map(item => (
      <div key={item.TourDiaryId} className="card mb-3 shadow-sm border-sm">
        <div className="card-body d-flex justify-content-between align-items-start">
          <div>
            <span className="badge bg-secondary">
              {item.DateOfVisit.split("T")[0]}
            </span>
            <h6 className="mt-2 mb-1 fw-bold">
              {item.PartnerName.replace("TGSWREIS", "")}
            </h6>
            <p className="text-muted small mb-0">{item.Purpose}</p>
          </div>

          <div className="text-end">
            <span className="badge bg-primary mb-2">PLANNED</span>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-success btn-sm"
                disabled={!isToday(item.DateOfVisit)}
                onClick={() => { setVisitedId(item.TourDiaryId); setShowMarkVisitModal(true); }}
              >
                Mark Visited
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={!isToday(item.DateOfVisit)}
                onClick={() => { setCannotVisitId(item.TourDiaryId); setCannotVisitModal(true); }}
              >
                Cannot Visit
              </button>
            </div>
          </div>

        </div>
      </div>
    )) : <div className="text-muted">No upcoming visits</div>}
  </div>
    </div>


     {/*NOT VISITED */}
    <div className="tab-pane fade" id="notvisited">
      <div className="white-box shadow-sm">
    <h5>Not Visited Inspections</h5>

    {notvisited.length ? notvisited.map(item => (
      <div key={item.TourDiaryId} className="card mb-3 shadow-sm border-sm">
        <div className="card-body d-flex justify-content-between align-items-start">

          <div>
            <span className="badge bg-secondary">
              {item.DateOfVisit.split("T")[0]}
            </span>
            <h6 className="mt-2 mb-1 fw-bold">
              {item.PartnerName.replace("TGSWREIS", "")}
            </h6>
            <p className="text-muted small mb-0">{item.Purpose}</p>
          </div>

          <div className="text-end">
            <span className="badge bg-danger mb-2">NOT VISITED</span>
            {/* <div> 
                <button className="btn btn-primary btn-sm"
              onClick={() => navigate(`/uploadtourreports/${item.TourDiaryId}`)}>
              Upload Proof
            </button>
            </div> */}
          </div>

        </div>
      </div>
    )) : <div className="text-muted">No Not visited records</div>}
  </div>
    </div>


     {/*COMPLETED*/}
    <div className="tab-pane fade" id="completed">

         <div className="white-box shadow-sm">
    <h5>Completed Inspections</h5>

    {completed.length ? completed.map(item => (
      <div key={item.TourDiaryId} className="card mb-3 shadow-sm border-sm">
        <div className="card-body d-flex justify-content-between align-items-start">

          <div>
            <span className="badge bg-secondary">
              {item.DateOfVisit.split("T")[0]}
            </span>
            <h6 className="mt-2 mb-1 fw-bold">{item.PartnerName}</h6>
            <p className="text-muted small mb-1">{item.Purpose}</p>
          </div>

          <div className="text-end">
             <span className="badge bg-success mb-2">COMPLETED</span>
            {/* Report */}
            <div className='d-flex gap-2 justify-content-end'>
               {/* {item.ReportPDF ? (
              <button className="btn btn-primary btn-sm mb-2"
                onClick={() => {
                  setSelectedTourDiaryId(item.TourDiaryId);
                  setSelectedFileUrl(`${apiUrl}/uploads/tourdiary/${item.TourDiaryId}/reports/${item.ReportPDF}`);
                  setShowReportModal(true);
                }}>
                View Report
              </button>
            ) : <span className="text-muted small">No Report</span>} */}

           <button className='btn btn-primary btn-sm' onClick={() => DownloadInspectionPdfReport(item.TourDiaryId)}>Download Inspection PDF</button>


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
        className="btn btn-primary btn-sm mb-2"
        onClick={() => openPhotoGallery(item.TourDiaryId, photosArray)}
      >
        View Photos ({photosArray.length})
      </button>
    );
  })() : (
    <span className="text-muted">Not Uploaded</span>
  )}


            </div>
          

           
          </div>

        </div>
      </div>
    )) : <div className="text-muted">No completed visits</div>}
  </div>
    </div>

     {/*CANNOT VISIT */}
    <div className="tab-pane fade" id="cannotvisit">

        <div className="white-box shadow-sm">
    <h5>Cannot Visit Inspections</h5>

    {cannotVisit.length ? cannotVisit.map(item => (
      <div key={item.TourDiaryId} className="card mb-3 shadow-sm border-sm">
        <div className="card-body d-flex justify-content-between align-items-start">

          <div>
            <span className="badge bg-secondary">
              {item.DateOfVisit.split("T")[0]}
            </span>
            <h6 className="mt-2 mb-1 fw-bold">
              {item.PartnerName.replace("TGSWREIS","")}
            </h6>
            <p className="text-muted small mb-1">{item.Purpose}</p>
            
          </div>
          <div className='text-end'>
          <span className="badge bg-warning text-dark">CANNOT VISIT</span>
          </div>

        </div>
      </div>
    )) : <div className="text-muted">No data</div>}
  </div>
    </div>
</div>
     
      <div className="row gy-3">
        <div className="col-sm-6">
           
        </div>


          <div className="col-sm-6">
            
        </div>

        <div className="col-sm-6">
           
        </div>

        <div className="col-sm-6">
           
        </div>


                {/* <div className="col-sm-12">
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
            </div> */}
        
      </div>

       {/* Cannot Visit Modal */}
       {showCannotVisitModal && cannotVisitId && ( 
       <div class="modal show fade" id="missedModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Add Remark for Missed Visit</h1>
              <button type="button" class="btn-close" onClick={() => setCannotVisitModal(false)} aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row gy-3">
                    <div class="col-sm-12">
                        <label class="form-label">Reason for Not Visiting</label>
                        <select class="form-select" value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)}>
                          <option value=''>--Select--</option>
                          <option value='Medical Emergency'>Medical Emergency</option>
                          <option value='Weather Conditions'>Weather Conditions</option>
                          <option value='Transportation Issues'>Transportation Issues</option>
                          <option value='Emergency Assignment'>Emergency Assignment</option>
                          <option value='Other'>Other</option>
                        </select>
                    </div>
                  
                    <div class="col-sm-12">
                        <label class="form-label">Detailed Explanation</label>
                        <textarea class="form-control" placeholder="Provide detailed explanation" value={rejectedRemarks} onChange={(e) => setRejectedRemarks(e.target.value)}></textarea>
                    </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setCannotVisitModal(false)}>Cancel</button>
                <button type="button" class="btn btn-primary" onClick={() => MarkCannotVisit()}>Save</button>
            </div>
          </div>
        </div>
      </div>)}
      
 
       {/* Mark Vist Modal */}

       {showMarkVisitModal && visitedId && (<div class="modal show fade" id="completeModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Redirecting to Inspection Report</h1>
              <button type="button" class="btn-close" aria-label="Close" onClick={() => setShowMarkVisitModal(false)}></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row gy-3">
                     <p>Have you visited today's scheduled location?</p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        You'll be redirected to fill out proforma.
                    </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setShowMarkVisitModal(false)}>Cancel</button>
                <button type="button" class="btn btn-primary" onClick={() => navigate(`/inspectionreportssubmission/${visitedId}`)}>Proceed</button>
            </div>
          </div>
        </div>
      </div>)}


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
            href={`/uploads/reports/${completed.find(x => x.TourDiaryId === selectedTourDiaryId).ReportPDF}`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
)}


    {/* Images Modal */}

    {showImagesModal && selectedTourDiaryId && (() => {
  const item = completed.find(x => x.TourDiaryId === selectedTourDiaryId);
  const photos = item.PhotoAttachment ? JSON.parse(item.PhotoAttachment) : [];

  return (
    <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Uploaded Photos</h5>
            <button className="btn-close" onClick={() => setShowImagesModal(false)} />
          </div>
          <div className="modal-body">
            <div className="row">
              
                  {photos.map((img, i) => {
                const imgUrl = `http://localhost:9001/uploads/tourdiary/${selectedTourDiaryId}/photos/${img}`;
                return (
                  <div className="col-sm-4 mb-3" key={i}>
                    <a
                      href={imgUrl}
                      data-fancybox="tour-images"
                      data-caption={`Photo ${i + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt="Tour"
                        className="img-fluid rounded border"
                        style={{ cursor: "pointer" }}
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="modal-footer">
         
        </div>
        </div>
      </div>
    </div>
  );
})()}


      
    </>
  )
}

export default TourUserVisits