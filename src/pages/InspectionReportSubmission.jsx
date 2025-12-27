import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState, useRef,} from 'react';
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";

const InspectionReportSubmission = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const UserId = useSelector((state) => state.userappdetails.profileData.Id)
    const {TourDiaryId} = useParams();
    const [photos,setPhotos] = useState([]);
    const [activeTab,setActiveTab] = useState('general')
    const [geoLocation, setGeoLocation] = useState(null);
    const [formData,setFormData] = useState({responses:{}});
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [officerName,setOfficerName] = useState('');
    const [designation,setDesignation] = useState('');
    const [DateOfVisit,setDateOfVisit] = useState('');
    const [arrivalTime,setArrivalTime] = useState('');
    const [departureTime,setDepartureTime] = useState('');
    const [institutionName,setInstitutionName] = useState('')
    const [district,setDistrict] = useState('');
    const [tourInfo,setTourInfo] = useState([]);
    const [schoolLat,setSchoolLat] = useState('');
    const [schoolLong,setSchoolLong] = useState('');
    const [schoolCode,setSchoolCode] = useState('');
    const [showGeoModal,setShowGeoModal] = useState(true);
    const [geo, setGeo] = useState(null);
    const [distance,setDistance] = useState(null);
    const [address,setAddress] = useState('');
    const [accuracy,setAccuracy] = useState(null);
    const [reason,setReason] = useState('');
    const [loadingGeo,setLoadingGeo] = useState(true);
    const navigate = useNavigate();

    const validateFiles = () => {
        // if(report && report.size > 3 * 1024 * 1024){
        //     toast.error('PDF Size must be less than 3MB');
        //     return false;
        // }
    
        for(let file of photos){
            if(file.size > 1 * 1024 * 1024){
                toast.error('Each Photo must be less than 1MB');
                return false;
            }
        }
        return true;
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
                if (res.status !== 'success') {
    throw new Error(res.message || 'Photo upload failed');
  }
  return res.data;
            })
    
        } catch(error){
            console.error('Error fetching Photos',error);
        }
    }

    const fetchTourInfo = async () => {
        try {
    
            const payload = {TourDiaryId}
            _fetch('tourinfo',payload,false,token).then(res => {
                if(res.status === 'success'){
                    setDesignation(res.data[0].RoleDisplayName);
                    setInstitutionName(res.data[0].PartnerName);
                    setDateOfVisit(res.data[0].DateOfVisit);
                    setSchoolLat(Number(res.data[0].Latitude));
                    setSchoolLong(Number(res.data[0].Longitude));
                    setOfficerName(res.data[0].OfficerName);
                    setDistrict(res.data[0].DistrictName)
                }else{
                    toast.error(res.message);
                }
            })
    
        } catch(error){
            console.error('Error fetching tour info',error)
        }
    }

      const sections = {
    academics: {
      title: 'Academics',
      questions: [
        { id: '7', text: 'Question paper analysis of Unit test / Quarterly / Half yearly / Summative Assessment I & II' },
        { id: '8', text: 'Is Principal maintaining the list of specific areas/difficult concepts in each subject or not?' },
        { id: '9', text: 'No of Academic strategy meetings and the impact of meetings on teachers.' },
        { id: '10', text: 'No. of Academic review meetings conducted by the principal' },
        { id: '11', text: 'Outstanding achievements in scholastic activities' },
        { id: '12', text: 'Outstanding achievements in Co-scholastic activities' },
        { id: '13', text: 'Implementation of student calendar of events. Difficulty, if any?' },
        { id: '14', text: 'Innovative activities' }
      ]
    },
    administration: {
      title: 'Administration',
      questions: [
        { id: '15', text: 'No of Students Admitted' },
        { id: '16', text: 'No of Students Present' },
        { id: '17', text: 'No of Students Absent' },
        { id: '18', text: 'Total strength of staff' },
        { id: '19', text: 'Total strength of staff present' },
        { id: '20', text: 'Total strength of staff left without leave' },
        { id: '21', text: 'Whether Principal is regular to school and attending prayer or not?' },
        { id: '22', text: 'Whether movement register for staff & principal maintained?' },
        { id: '23', text: 'Whether the Principal attending the class room observation or not?' },
        { id: '24', text: 'Points noted during interaction with the students to know the teaching ability and communication skills of concerned teachers.' },
        { id: '25', text: 'Class wise plan of action for improvement of future learners/higher achievers' },
        { id: '26', text: 'Whether Principal is checking regular correction work of teachers and teaching dairy of the staff' },
        { id: '27', text: 'Suggestions & Instructions given by the Principal to the individual teacher / lecturer on observation of class room.' }
      ]
    },
    midDayMeal: {
      title: 'Mid-Day Meal',
      questions: [
        { id: '28', text: 'Whether followed weekly menu & quality of food served' },
        { id: '29', text: 'a. Is the Mess-Committee actively functioning' },
        { id: '29_1', text: 'b. If so are they aware about weekly menu' },
        { id: '29_2', text: 'c. No. of mess committee meetings conducted during this month' },
        { id: '30', text: 'Observation of food preparation, dishwashing and hand washing area' },
        { id: '31', text: 'Observation of storage of fruits, vegetables, provisions and rice' },
        { id: '32', text: 'Maintenance of cleanliness in School building, dormitory and dining hall' },
        { id: '33', text: 'Supply of water / Bhagiratha connection / RO plant' }
      ]
    },
    hygiene: {
      title: 'Hygiene & Maintenance',
      questions: [
        { id: '33_1', text: 'b. Regular Testing done or not?' },
        { id: '33_2', text: 'c. How frequently?' },
        { id: '34', text: 'Condition of Toilets / Bathrooms' },
        { id: '35', text: 'Maintenance of Account related registers' },
        { id: '36', text: 'Maintenance of Diet registers' },
        { id: '37', text: 'Maintenance of Amenities registers' },
        { id: '38', text: 'Maintenance of suggestion box' },
        { id: '39', text: 'Whether all textbooks distributed to all the class students or not' },
        { id: '40', text: 'Name of the amenities distribution to the student' }
      ]
    },
    communication: {
      title: 'Communication & Feedback',
      questions: [
        { id: '41', text: 'Functioning of the Phone Mithra' },
        { id: '42', text: 'Conducting of parents teachers meeting Yes or No' },
        { id: '43', text: 'Feedback from the students' },
        { id: '44', text: 'Grievances of the Staff' },
        { id: '45', text: 'Functioning of Student councillors' },
        { id: '46', text: 'a. Functioning of Social Media in the District' },
        { id: '46_1', text: 'b. FRS implemented or not' },
        { id: '47', text: 'General remarks and suggestions for improvement' }
      ]
    },
    infrastructure: {
      title: 'Infrastructure',
      questions: [
        { id: '48', text: 'Computer lab & No of systems / Laptops / TABs available and working condition' },
        { id: '49', text: 'CC Cameras functionality' },
        { id: '50', text: 'Working condition of Incinerators' }
      ]
    },
    health: {
      title: 'Health',
      questions: [
        { id: '51', text: 'a. Wellness room with amenities' },
        { id: '51_1', text: 'b. Anonymous room maintained or not?' },
        { id: '51_2', text: 'c. Whether the record is maintained or not?' },
        { id: '52', text: 'Special diet for sick children provided or not?' }
      ]
    }
  };

  const handleResponseChange = (questionId,field,value) => {
    setFormData(prev => ({
        ...prev,responses: {
            ...prev.responses,
            [questionId] : {
                ...prev.responses[questionId],
                [field] : value
            }
        }
    }))
    
  }

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // meters
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};


useEffect(() => {
  console.log('Updated responses:', formData.responses);
  console.log('answered questions',answeredQuestions);
  console.log('totalQuestions',totalQuestions);
  console.log('isGeneralValid',isGeneralValid)
  console.log('canSubmit:',canSubmit)
}, [formData.responses]);

const formatTimeForInput = (date) => {
  return date.toTimeString().slice(0, 5); // HH:mm
};

const captureLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser');
    return;
  }

  setLoadingGeo(true);

  let retryCount = 0;
  const MAX_RETRIES = 2;

  const successHandler = async (position) => {
    const { latitude, longitude, accuracy } = position.coords;

    const dist = getDistanceInMeters(
      latitude,
      longitude,
      Number(schoolLat),
      Number(schoolLong)
    );

    const capturedAt = new Date();

    setGeo({ latitude, longitude, capturedAt: capturedAt.toISOString() });
    setAccuracy(Math.round(accuracy));
    setDistance(Math.round(dist));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || '');
    } catch {
      console.warn('Reverse geocoding failed');
    }

    setLoadingGeo(false);
  };

  const errorHandler = (error) => {
    if (error.code === error.TIMEOUT && retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(captureLocation, 2000);
      return;
    }

    alert('Unable to detect location. Please try again.');
    setLoadingGeo(false);
  };

  navigator.geolocation.getCurrentPosition(
    successHandler,
    errorHandler,
    {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 60000
    }
  );
};



useEffect(() => {
if (!schoolLat || !schoolLong) return;
  captureLocation();
}, [schoolLat, schoolLong]);



const SubmitCaptureInfo =  async () => {
    try{

      const uploadedPhotos = await uploadPhotos();

      const departureTime = new Date();
         const CapturedInfo = {
            generalInfo: {
                officerName: officerName,
                designation: designation,
                institutionName: institutionName,
                DateOfVisit: DateOfVisit,
                district: district,
                arrivalTime: arrivalTime,
                departureTime: departureTime
            },
            geo: {
              schoolLat: schoolLat,
              schoolLong: schoolLong,
              CapturedAt: geo.capturedAt,
              userLat: geo.latitude,
              userLong: geo.longitude,
              distanceMeters: distance,
              accuracyMeters: accuracy,
              userAddress:address,
              remoteReason: reason || null
            },
            photos: uploadedPhotos,
            responses: formData.responses
        };

      


        const payload = {TourDiaryId,CapturedInfo}

       

        _fetch('inspectionreportsubmit',payload,false,token).then(res => {
            if(res.status === 'success'){
                toast.success(res.message);
                navigate('/touruservisits')
            }
        })

    }catch(error){
        console.error('Error Submitting Inspection Report',error);
        toast.error('Error submitting Inspection Report')
    }
}

const totalQuestions = Object.values(sections).reduce((sum,section) => sum + section.questions.length,0);

const answeredQuestions = Object.values(formData.responses).filter(r => r?.answer && r?.remarks && r.remarks.trim().length > 0).length;

const isGeneralValid = designation?.trim() && DateOfVisit && institutionName?.trim();

const isTimeValid = arrivalTime.trim() !== '' && departureTime.trim() !== '';

const isTimeOrderValid = departureTime > arrivalTime;

const canProceed = distance !== null && accuracy !== null && distance <= (700 + accuracy) && isTimeValid && isTimeOrderValid;

const canSubmit = isGeneralValid && answeredQuestions === totalQuestions && canProceed;

useEffect(() => {
fetchTourInfo();
},[])


  return (
    <>
      <ToastContainer />
     <div className={showGeoModal ? 'pointer-events-none' : ''}>
     <>
      <div className="border-bottom bg-white overflow-auto">
  <ul className="nav nav-tabs flex-nowrap">
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === 'general' ? 'active fw-semibold text-primary' : ''}`}
        onClick={() => setActiveTab('general')}
      >
        General Info
      </button>
    </li>

    {Object.entries(sections).map(([key, section]) => (
       
      <li className="nav-item" key={key}>
        <button
          className={`nav-link ${activeTab === key ? 'active fw-semibold text-primary' : ''}`}
          onClick={() => setActiveTab(key)}
        >
          {section.title}
        </button>
      </li>
    ))}
  </ul>
</div>

<div className="p-4">
    {activeTab === 'general' && (
  <div className='shadow-sm white-box'>
    <h4 className="fw-bold mb-4">General Information</h4>

    <div className="row g-3 ">
      <div className="col-md-6">
        <label className="form-label">Name of the Visiting Officer *</label>
        <input
          type="text"
          className="form-control fw-bold"
          value={officerName || ''}
          onChange={(e) => handleGeneralInfoChange('officerName', e.target.value)}
          disabled
        />
        {errors.officerName && <div className="text-danger small">{errors.officerName}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label">Designation *</label>
        <input
          type="text"
          className="form-control fw-bold"
          disabled
          value={designation || ''}
        />
        {errors.designation && <div className="text-danger small">{errors.designation}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label">Date of Visit *</label>
        <input
          type="date"
          className="form-control fw-bold"
          value={DateOfVisit.split('T')[0] || ''}
          disabled
        />
        {errors.visitDate && <div className="text-danger small">{errors.visitDate}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label">Time of Arrival</label>
        <input
          type="time"
          className="form-control"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Time of Departure</label>
        <input
          type="time"
          className="form-control"
          value={departureTime || ''}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Institution Name *</label>
        <input
          type="text"
          className="form-control fw-bold"
          value={institutionName || ''}
         disabled
        />
        {errors.institutionName && <div className="text-danger small">{errors.institutionName}</div>}
      </div>

      <div className="col-md-6">
        <label className="form-label">District</label>
        <input
          type="text"
          className="form-control fw-bold"
          value={district || ''}
          onChange={(e) => handleGeneralInfoChange('district', e.target.value)}
          disabled
        />
      </div>
    </div>
  </div>
)}

{Object.entries(sections).map(([key, section]) =>
  activeTab === key && (
    <div key={key}>
      <h4 className="fw-bold mb-4">{section.title}</h4>

      {section.questions.map((question) => (
        <div className="card mb-3" key={question.id}>
          <div className="card-body">
            <p className="fw-semibold mb-3">
              {question.id}. {question.text}
            </p>

            <div className="d-flex gap-4 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q${question.id}`}
                  value="yes"
                  checked={formData.responses[question.id]?.answer === 'yes'}
                  onChange={(e) =>
                    handleResponseChange(question.id, 'answer', e.target.value)
                  }
                />
                <label className="form-check-label">Yes</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q${question.id}`}
                  value="no"
                  checked={formData.responses[question.id]?.answer === 'no'}
                  onChange={(e) =>
                    handleResponseChange(question.id, 'answer', e.target.value)
                  }
                />
                <label className="form-check-label">No</label>
              </div>
            </div>

            {errors[`q${question.id}`] && (
              <div className="text-danger small mb-2">
                {errors[`q${question.id}`]}
              </div>
            )}

            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              rows="2"
              value={formData.responses[question.id]?.remarks || ''}
              onChange={(e) =>
                handleResponseChange(question.id, 'remarks', e.target.value)
              }
              placeholder="Enter remarks..."
            />
          </div>
        </div>
      ))}
    </div>
  )
)}


{/* <div className="border-top bg-light p-4 d-flex justify-content-between align-items-center">
  <div>
    {Object.keys(errors).length > 0 && (
      <div className="alert alert-danger py-2 mb-0">
        Please complete all required fields
      </div>
    )}
  </div>

   <div className='col-sm-12 pt-3'>
                    <div className="mb-3">
                      <label className="form-label">Photos <span className='fw-bold' style={{color:'red'}}>(Note: Only 3 photos allowed)</span></label>
                      <input
                        type="file"
                        multiple accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                        const selected = Array.from(e.target.files);
                        if(selected.length > 2){
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
                        
                    </div>
                    </div>

  <button className="btn btn-primary px-4 py-2 fw-semibold" disabled={!canSubmit} onClick={SubmitCaptureInfo}>
    Submit Report
  </button>
</div> */}

<div className="border-top white-box shadow-sm p-4">
  <div className="row align-items-end">
    
    {/* LEFT SIDE: Errors + Photo Upload */}
    <div className="col-md-8">
      
      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger py-2 mb-3">
          Please complete all required fields
        </div>
      )}

      <div className="mb-2">
        <label className="form-label fw-semibold">
          Inspection Photos{" "}
          <span className="text-danger">(Max 3 photos)</span>
        </label>

        <input
          type="file"
          className="form-control"
          multiple
          accept="image/*"
          onChange={(e) => {
            const selected = Array.from(e.target.files);

            if (selected.length > 3) {
              toast.error('Only 3 photos are allowed');
              e.target.value = '';
              return;
            }

            setPhotos(selected);
          }}
        />

        {photos.length > 0 && (
          <div className="text-success small mt-1">
            Selected: {photos.length} photo(s)
          </div>
        )}
      </div>
    </div>

    {/* RIGHT SIDE: Submit Button */}
    <div className="col-md-4 text-end mt-3 mt-md-0">
      <button
        className="btn btn-primary px-4 py-2 fw-semibold"
        disabled={!canSubmit}
        onClick={SubmitCaptureInfo}
      >
        Submit Report
      </button>
    </div>

    <div className='col-sm-12'>
      <div className="text-danger small mt-2">
  Note: Please upload photos, enter arrival & departure time, and answer all questions
  (Yes/No with remarks) to enable the Submit Report button.
</div>

    </div>

  </div>
</div>


</div>

{showGeoModal && ( <div class="modal show fade" id="missedModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Location Verification</h1>
              {/* <button type="button" class="btn-close" onClick={() => setCannotVisitModal(false)} aria-label="Close"></button> */}
            </div>
            <div class="modal-body">
                {loadingGeo ? (
      <p>Detecting your location…</p>
    ) : (
      <>
        <p><strong>Your Location:</strong> {address}</p>
        <div className='row pb-3'>
          <div className="col-sm-4"><strong>Your Latitude:</strong>{geo.latitude}</div>
          <div className='col-sm-4'><strong>Your Longitude:</strong>{geo.longitude}</div>
        </div>
        <p><strong>Distance from Institution:</strong> {distance} meters</p>
        <p><strong>GPS Accuracy:</strong> ±{accuracy} meters</p>

       {distance !== null && accuracy !== null && !canProceed && (
  <div className="alert alert-warning mt-3">
    You are too far from the Institution. Please move closer to the location and try again.
  </div>
)}

      </>
    )}
            </div>
            <div class="modal-footer">
              <button
  type="button"
  className="btn btn-outline-secondary me-2"
  onClick={captureLocation}
>
  Retry Location
</button>
              
                {/* <button type="button" class="btn btn-secondary" onClick={() => setCannotVisitModal(false)}>Cancel</button> */}
                <button type="button" disabled={!canProceed} class="btn btn-primary" onClick={() => setShowGeoModal(false)}>Proceed to Inspection</button>
                
            </div>
          </div>
        </div>
      </div>)}
     </>
   </div>
    </>

  

  )
}

export default InspectionReportSubmission