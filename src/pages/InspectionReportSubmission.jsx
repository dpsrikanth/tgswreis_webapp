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
    const hasRestoredRef = useRef(false);
    const navigate = useNavigate();
    const [academicReportFile, setAcademicReportFile] = useState(null);
    const [sections,setSections] = useState({});


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

        validateFiles();
    
        const formData = new FormData();
    
        formData.append('TourDiaryId',TourDiaryId);
        photos.forEach((p) => {
      formData.append("photos", p.file);
    });
    
        try {
            const res = await _fetch('uploadtourphotos', formData, true, token);

  if (res.status !== 'success') {
    throw new Error(res.message);
  }

  return res.data; // array of filenames
    
        } catch(error){
            console.error('Error fetching Photos',error);
        }
    }


    const uploadAcademicReport = async () => {
       const fd = new FormData();
  fd.append('TourDiaryId', TourDiaryId);
  fd.append('report', academicReportFile);

  try{
    const res = await _fetch(
    'uploadtourreport',
    fd,
    true,
    token
  );

  if(res.status !== 'success'){
    throw new Error(res.message);
  }

  return res.file;

  } catch (error){
    console.error('Error uploading academic report')
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

//       const sections = {
//     academics: {
//       title: 'Academics',
//       questions: [
//         { id: '1', label:'1', text: 'Is a question paper analysis conducted for Unit Tests, Quarterly, Half-Yearly, and Summative Assessments I & II?' },
//         { id: '2', label: '2', text: 'Is the Principal maintaining a list of specific areas or difficult concepts in each subject?' },
//         { id: '3', label: '3', text: 'Are academic strategy meetings conducted, and is their impact on teachers reviewed? (Number of meetings conducted may be mentioned in the remarks.)' },
//         { id: '4', label: '4', text: 'Are academic review meetings conducted by the Principal? (Number of meetings conducted may be mentioned in the remarks.)' },
//         { id: '5', label: '5', text: 'Are there any outstanding achievements in scholastic activities? (Details may be mentioned in the remarks.)' },
//         { id: '6', label: '6', text: 'Are there any outstanding achievements in co-scholastic activities? (Details may be mentioned in the remarks.)'  },
//         { id: '7', label: '7', text: 'Implementation of student calendar of events. Difficulty, if any?' },
//         { id: '8', label: '8', text: 'Are innovative activities being implemented in the school? (Details may be mentioned in the remarks.)' },
//         {id: '47', label: '9(a)', text: 'Number of Text Books received (2025–26)', type: 'number'},
//         {id: '47_1', label: '9(b)', text: 'Number of books in good condition', type: 'number'},
//         {id: '47_2', label: '9(c)', text: 'Number of books in scrap', type: 'number'},
//       ]
//     },
//     academicReport: {
//   title: 'Academic Books Report',
//   questions: []
// },
//     administration: {
//       title: 'Administration',
//       questions: [
//         { id: '9',label: '10', text: 'What is the number of students admitted? (Number may be mentioned in the remarks.)' },
//         { id: '10',label: '11', text: 'What is the number of students present? (Number may be mentioned in the remarks.)' },
//         { id: '11',label: '12', text: 'What is the number of students absent? (Number may be mentioned in the remarks.)' },
//         { id: '12',label: '13', text: 'What is the total strength of staff? (Number may be mentioned in the remarks.)' },
//         { id: '13',label: '14', text: 'What is the total number of staff present? (Number may be mentioned in the remarks.)' },
//         { id: '14',label: '15', text: 'What is the total number of staff who left without leave? (Number may be mentioned in the remarks.)' },
//         { id: '15',label: '16', text: 'Is the Principal regular to the school and attending the prayer?' },
//         { id: '16',label: '17', text: 'Is the movement register for staff and the Principal maintained?' },
//         { id: '17',label: '18', text: 'Is the Principal attending classroom observations?' },
//         { id: '18',label: '19', text: 'Are points noted during interaction with students to assess the teaching ability and communication skills of the concerned teachers?' },
//         { id: '19',label: '20', text: 'Is a class-wise plan of action prepared for the improvement of future learners and higher achievers?' },
//         { id: '20',label: '21', text: 'Is the Principal regularly checking the correction work of teachers and the teaching diary of the staff?' },
//         { id: '21',label: '22', text: 'Are suggestions and instructions given by the Principal to individual teachers or lecturers based on classroom observation?' }
//       ]
//     },
//     mess: {
//   title: 'Mess',
//   questions: [
//     {
//       id: '22',
//       label: '23',
//       text: 'Is the weekly menu followed and is the quality of food served satisfactory?'
//     },
//     {
//       id: '23',
//       label: '24(a)',
//       text: 'Is the Mess Committee actively functioning?'
//     },
//     {
//       id: '23_1',
//       label: '24(b)',
//       text: 'If so, is the Mess Committee aware of the weekly menu?'
//     },
//     {
//       id: '23_2',
//       label: '24(c)',
//       text: 'What is the number of Mess Committee meetings conducted during this month?',
//       type: 'number'
//     },
//     {
//       id: '24',
//       label: '25',
//       text: 'Are food preparation, dishwashing, and handwashing areas maintained properly?'
//     },
//     {
//       id: '25',
//       label: '26',
//       text: 'Is the storage of fruits, vegetables, provisions, and rice maintained properly?'
//     },
    
//   ]
// },

//    hygiene: {
//   title: 'Hygiene & Maintenance',
//   questions: [
//     {
//       id: '26',
//       label: '27',
//       text: 'Is cleanliness maintained in the school building, dormitory, and dining hall?'
//     },
//     {
//       id: '27',
//       label: '28(a)',
//       text: 'Is an adequate water supply provided through Bhagiratha connection or RO plant?'
//     },
//     {
//       id: '27_1',
//       label: '28(b)',
//       text: 'Is regular testing of water being conducted?'
//     },
//     {
//       id: '27_2',
//       label: '28(c)',
//       text: 'How frequently is the testing of water conducted?'
//     },
//     {
//       id: '28',
//       label: '29',
//       text: 'Are the toilets and bathrooms maintained in good condition?'
//     },
//     {
//       id: '29',
//       label: '30',
//       text: 'Are account-related registers properly maintained?'
//     },
//     {
//       id: '30',
//       label: '31',
//       text: 'Are diet registers properly maintained?'
//     },
//     {
//       id: '31',
//       label: '32',
//       text: 'Are amenities registers properly maintained?'
//     },
//     {
//       id: '32',
//       label: '33',
//       text: 'Is the suggestion box properly maintained?'
//     },
//     {
//       id: '33',
//       label: '34',
//       text: 'Are all textbooks distributed to all class students?'
//     },
//     {
//       id: '34',
//       label: '35',
//       text: 'What are the names of the amenities distributed to the students?'
//     }
//   ]
// },

//    communication: {
//   title: 'Communication & Feedback',
//   questions: [
//     {
//       id: '35',
//       label: '36',
//       text: 'Is the Phone Mithra functioning effectively?'
//     },
//     {
//       id: '36',
//       label: '37',
//       text: 'Are parent-teacher meetings being conducted?'
//     },
//     {
//       id: '37',
//       label: '38',
//       text: 'Any feedback from students?'
//     },
//     {
//       id: '38',
//       label: '39',
//       text: 'Any staff grievances?'
//     },
//     {
//       id: '39',
//       label: '40',
//       text: 'Are student councillors functioning effectively?'
//     },
//     {
//       id: '40',
//       label: '41(a)',
//       text: 'Is social media functioning effectively in the district?'
//     },
//     {
//       id: '40_1',
//       label: '41(b)',
//       text: 'Is FRS implemented?'
//     }
   
//   ]
// },

//    infrastructure: {
//   title: 'Infrastructure',
//   questions: [
//     {
//       id: '42',
//       label: '42',
//       text: 'Is the computer lab functional, and are the available systems, laptops, and tablets in working condition?'
//     },
//     {
//       id: '43',
//       label: '43',
//       text: 'Are CCTV cameras functioning properly?'
//     },
//     {
//       id: '44',
//       label: '44',
//       text: 'Are the incinerators in proper working condition?'
//     },
//     {
//       id: '48',
//       label: '45(a)',
//       text: 'No. of dual desks received',
//       type: 'number'
//     },
//     {
//       id: '48_1',
//       label: '45(b)',
//       text: 'No. of dual desks in good condition',
//       type: 'number'
//     },
//     {
//       id: '48_2',
//   label: '45(c)',
//   text: 'No. of dual desks in scrap',
//   type: 'number'
//     },
//     { id: '49', label: '46(a)', text: 'No. of chairs received', type: 'number' },
//     { id: '49_1', label: '46(b)', text: 'No. of chairs in good condition', type: 'number' },
//     { id: '49_2', label: '46(c)', text: 'No. of chairs in scrap', type: 'number' },

//     { id: '50', label: '47(a)', text: 'No. of tables received', type: 'number' },
//     { id: '50_1', label: '47(b)', text: 'No. of tables in good condition', type: 'number' },
//     { id: '50_2', label: '47(c)', text: 'No. of tables in scrap', type: 'number' },

//     { id: '51', label: '48(a)', text: 'No. of computers received for office', type: 'number' },
//     { id: '51_1', label: '48(b)', text: 'No. of computers in good condition', type: 'number' },
//     { id: '52_1', label: '48(c)', text: 'No. of computers in scrap', type: 'number' },

//     { id: '53', label: '49(a)', text: 'No. of computers received for lab', type: 'number' },
//     { id: '53_1', label: '49(b)', text: 'No. of computers in good condition', type: 'number' },
//     { id: '53_2', label: '49(c)', text: 'No. of computers in scrap', type: 'number' },

//     { id: '54', label: '50(a)', text: 'No. of laptops received for school', type: 'number' },
//     { id: '54_1', label: '50(b)', text: 'No. of laptops in good condition', type: 'number' },
//     { id: '54_2', label: '50(c)', text: 'No. of laptops in scrap', type: 'number' },

//     { id: '55', label: '51(a)', text: 'No. of tablets received', type: 'number' },
//     { id: '55_1', label: '51(b)', text: 'No. of tablets in good condition', type: 'number' },
//     { id: '55_2', label: '51(c)', text: 'No. of tablets in scrap', type: 'number' }
//   ]
// },

//     health: {
//   title: 'Health',
//   questions: [
//     {
//       id: '45',
//       label: '52(a)',
//       text: 'Is a wellness room with adequate amenities available?'
//     },
//     {
//       id: '45_1',
//       label: '52(b)',
//       text: 'Is an anonymous room maintained?'
//     },
//     {
//       id: '45_2',
//       label: '52(c)',
//       text: 'Are records properly maintained?'
//     },
//     {
//       id: '46',
//       label: '53',
//       text: 'Is a special diet provided for sick children?'
//     },
    
//   ]
// },

// remarks: {
// title: 'Final Remarks',
// questions: [
//    {
//       id: '41',
//       label: '54',
//       text: 'Any final general remarks and suggestions by the visiting officer?'
//     }
// ]
// },

//     photos: {
//     title: 'Photos',
//     questions: [] 
//   }
//   };


  const fetchInspectionQuestions = async () => {
    try{

      const res = await _fetch('inspectionquestions',null,false,token)

      if(res.status === 'success'){
        const frontendSections = {
          academicReport: {
            title: 'Academic Books Report',
            questions: []
          },
          photos: {
            title: 'Photos',
            questions: []
          }
        };

        setSections({
          ...res.data,
          ...frontendSections
        });
      } else {
        toast.error(res.message);
      }

    } catch(error){
      console.error('Error fetching Questions',error)
    }
  }




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


useEffect(() => {
 if(!hasRestoredRef.current) return;
 if(!TourDiaryId) return;

 if (
    Object.keys(formData.responses).length === 0 &&
    !arrivalTime &&
    !departureTime
  ) {
    return;
  }

  const data = {
    responses: formData.responses,
    arrivalTime,
    departureTime,
  };

  localStorage.setItem(
    `inspection_draft_${TourDiaryId}`,
    JSON.stringify(data)
  );
}, [formData.responses, arrivalTime, departureTime]);


useEffect(() => {
  if(!TourDiaryId) return;
  const saved = localStorage.getItem(`inspection_draft_${TourDiaryId}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    setFormData({ responses: parsed.responses || {} });
    setArrivalTime(parsed.arrivalTime || '');
    setDepartureTime(parsed.departureTime || '');
  }
  hasRestoredRef.current = true
}, []);




const SubmitCaptureInfo =  async () => {
    try{

      const getMissingDetails = () => {
  const missing = [];

  // Object.entries(sections).forEach(([tabKey, section]) => {
  //   section.questions.forEach(q => {
  //     const r = formData.responses[q.id];
  //     if (!r?.answer || !r?.remarks || r.remarks.trim() === '') {
  //       missing.push({
  //         tab: tabKey,
  //         question: `${q.label}. ${q.text}`
  //       });
  //     }
  //   });
  // });

  // return missing;

   Object.entries(sections).forEach(([tabKey, section]) => {
    section.questions.forEach(q => {
      const r = formData.responses[q.id];

      if (q.type === 'number') {
        if (r?.value === undefined || r?.value === '') {
          missing.push({
            tab: tabKey,
            question: `${q.label}. ${q.text}`
          });
        }
      } else {
        if (!r?.answer || !r?.remarks || !r?.remarks?.trim() === '') {
          missing.push({
            tab: tabKey,
            question: `${q.label}. ${q.text}`
          });
        }
      }
    });
  });

  return missing;
};


const missing = getMissingDetails();

if (missing.length > 0) {
  const firstMissingTab = missing[0].tab;
  setActiveTab(firstMissingTab);
  scrollToTop();

  toast.error(
    `Please complete pending questions in "${sections[firstMissingTab].title}" tab`
  );

  return;
}



        if(!canSubmit){
        if(!isGeneralValid){
          alert('Designation,VisitDate and Institution Name not available');
        } else if(!(answeredQuestions === totalQuestions)){
          alert(`Please answer all questions with yes/no and remarks Ans Questions: ${answeredQuestions} , Total Questions: ${totalQuestions}`)
        } else if(!canProceed){
          alert('Please undertake geo capture')
        } else if(!isTimeValid){
          alert('Please enter correct time of arrival and departure')
        } else if(!isTimeOrderValid){
          alert('Departure time should be greater than arrival time')
        } else if(!arePhotosValid){
          alert('Please upload atleast 1 photo')
        } else if (!isAcademicReportValid) {
  alert('Please upload Academic Books Utilization Report');
}
    
      return;
      }

      const uploadedPhotos = await uploadPhotos();

      const uploadedReport = await uploadAcademicReport();

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
            academicReport: uploadedReport,
            responses: formData.responses
        };

      


        const payload = {TourDiaryId,CapturedInfo}

       

        _fetch('inspectionreportsubmit',payload,false,token).then(res => {
            if(res.status === 'success'){
                toast.success(res.message);
                localStorage.removeItem(`inspection_draft_${TourDiaryId}`);
                navigate('/touruservisits')
            } else{
              toast.error(res.message);
            }
        })

    }catch(error){
        console.error('Error Submitting Inspection Report',error);
        toast.error('Error submitting Inspection Report')
    }
}

const totalQuestions = Object.values(sections || {}).reduce((sum,section) => sum + section.questions.length,0);

// const answeredQuestions = Object.values(formData.responses).filter(r => r?.answer && r?.remarks && r.remarks.trim().length > 0).length;

const answeredQuestions = Object.entries(formData.responses).filter(
  ([qid, r]) => {
    const question = Object.values(sections)
      .flatMap(s => s.questions)
      .find(q => q.id === qid);

    if (!question) return false;

    if (question.type === 'number') {
      return r?.value !== undefined && r?.value !== '';
    }

    return r?.answer && r?.remarks?.trim();
  }
).length;


const isGeneralValid = designation?.trim() && DateOfVisit && institutionName?.trim();

const isTimeValid = arrivalTime.trim() !== '' && departureTime.trim() !== '';

const isTimeOrderValid = departureTime > arrivalTime;

const canProceed = distance !== null && accuracy !== null && distance <= (700 + accuracy) ;

const arePhotosValid = photos.length > 0;

const isAcademicReportValid = !!academicReportFile;


const canSubmit = isGeneralValid && answeredQuestions === totalQuestions && canProceed && isTimeValid && isTimeOrderValid && arePhotosValid && isAcademicReportValid;

useEffect(() => {
fetchInspectionQuestions();
fetchTourInfo();
},[])




const tabOrder = [
  'general',
  'academics',
  'academicReport',
  'administration',
  'mess',
  'hygiene',
  'communication',
  'infrastructure',
  'health',
  'remarks',
  'photos'
];


const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


const goToNextTab = () => {
  const currentIndex = tabOrder.indexOf(activeTab);
  if (currentIndex === -1) return;

  const nextTab = tabOrder[currentIndex + 1];
  if (nextTab) {
    setActiveTab(nextTab);
    scrollToTop();
  }
};

const getTabStatus = () => {
  const status = {};

  tabOrder.forEach(tabKey => {

    // ✅ GENERAL INFO
    if (tabKey === 'general') {
      status.general =
        designation?.trim() &&
        DateOfVisit &&
        institutionName?.trim() &&
        arrivalTime &&
        departureTime &&
        departureTime > arrivalTime;
      return;
    }

    // ✅ PHOTOS
    if (tabKey === 'photos') {
      status.photos = photos.length > 0;
      return;
    }

    if (tabKey === 'academicReport') {
  status.academicReport = !!academicReportFile;
  return;
}


    // ✅ QUESTION-BASED TABS
    const section = sections[tabKey];
    if (!section) return;

    const allAnswered = section.questions.every(q => {
      const r = formData.responses[q.id];
      // return r?.answer && r?.remarks?.trim();
      if (q.type === 'number') {
  return r?.value !== undefined && r?.value !== '';
}

return r?.answer && r?.remarks?.trim();
    });

    status[tabKey] = allAnswered;
  });

  return status;
};


const tabStatus = getTabStatus();


useEffect(() => {
  return () => {
    photos.forEach(p => URL.revokeObjectURL(p.preview));
  };
}, [photos]);




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
         {tabStatus.general && (
    <span className="ms-2 text-success">✔</span>
  )}
      </button>
    </li>

    {/* {Object.entries(sections).map(([key, section]) => (
       
      <li className="nav-item" key={key}>
        <button
          className={`nav-link ${activeTab === key ? 'active fw-semibold text-primary' : ''}`}
          onClick={() => {setActiveTab(key)
            scrollToTop();
          }}
        >
          {section.title}
          {tabStatus[key] && (
    <span className="ms-2 text-success">✔</span>
  )}
        </button>
      </li>
    ))} */}

    {tabOrder
  .filter(key => sections[key])
  .map(key => {
    const section = sections[key];

    return (
      <li className="nav-item" key={key}>
        <button
          className={`nav-link ${
            activeTab === key ? 'active fw-semibold text-primary' : ''
          }`}
          onClick={() => {
            setActiveTab(key);
            scrollToTop();
          }}
        >
          {section.title}
          {tabStatus[key] && (
            <span className="ms-2 text-success">✔</span>
          )}
        </button>
      </li>
    );
  })}

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

{activeTab === 'academicReport' && (
  <div className="card">
    <div className="card-body">

      <h4 className="fw-bold mb-3">
        Academic Books Utilization Report
      </h4>

      <p className=" small">
        Upload a class/ subject-wise pdf report signed by the Principal in the following format:
      </p>

      <ul className="small">
        <li>S. No.</li>
        <li>Class</li>
        <li>Subject</li>
        <li>No. of Books Received</li>
        <li>No. of Books Used</li>
        <li>No. of Books in Scrap</li>
      </ul>

      <p>S.No | Class | Subject | No. of Books Received | No. of Books Used | No. of Books in Scrap</p>

      <input
        type="file"
        className="form-control"
        accept=".pdf,image/*"
        onChange={(e) => setAcademicReportFile(e.target.files[0])}
      />

      {academicReportFile && (
        <div className="text-success mt-2">
          Selected: {academicReportFile.name}
        </div>
      )}
    </div>
  </div>
)}


{Object.entries(sections).map(([key, section]) =>
  activeTab === key && (
    <div key={key}>
      <h4 className="fw-bold mb-4">{section.title}</h4>

      {section.questions.map((question) => {
        
  //       const isIncomplete =
  // !formData.responses[question.id]?.answer ||
  // !formData.responses[question.id]?.remarks?.trim();

  const response = formData.responses[question.id];

const isIncomplete =
  question.type === 'number'
    ? response?.value === undefined || response?.value === ''
    : !response?.answer || !response?.remarks?.trim();

      return (

     
        <div className={`card mb-3 ${isIncomplete ? 'border-danger' : ''}`} key={question.id}>
          <div className="card-body">
            <p className="fw-semibold mb-3">
              {question.label}. {question.text}
            </p>

            {/* <div className="d-flex gap-4 mb-2">
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
            </div> */}


            {question.type !== 'number' && (
  <div className="d-flex gap-4 mb-2">
    <div className="form-check">
      <input
        type="radio"
        name={`q${question.id}`}
        value="yes"
        className='form-check-input'
        checked={formData.responses[question.id]?.answer === 'yes'}
        onChange={(e) =>
          handleResponseChange(question.id, 'answer', e.target.value)
        }
      />
      <label className="form-check-label">Yes</label>
    </div>

    <div className="form-check">
      <input
        type="radio"
        name={`q${question.id}`}
        value="no"
        className='form-check-input'
        checked={formData.responses[question.id]?.answer === 'no'}
        onChange={(e) =>
          handleResponseChange(question.id, 'answer', e.target.value)
        }
      />
      <label  className="form-check-label" >No</label>
    </div>
  </div>
)}



{question.type === 'number' && (
  <input
    type="number"
    className="form-control mb-2"
    placeholder="Enter count"
    value={formData.responses[question.id]?.value || ''}
    onChange={(e) =>
      handleResponseChange(
        question.id,
        'value',
        e.target.value
      )
    }
  />
)}


            {errors[`q${question.id}`] && (
              <div className="text-danger small mb-2">
                {errors[`q${question.id}`]}
              </div>
            )}

{question.type !== 'number' && (
           <>
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
           </>
)}


          </div>
        </div>
)})}

    </div>
  )
)}

{activeTab !== 'photos' && (
  <div className="text-end mt-4">
    <button
      className="btn btn-outline-primary px-4"
      onClick={goToNextTab}
    >
      Next →
    </button>
  </div>
)}

{activeTab === 'photos' && (
  <div className="card">
    <div className="card-body">
      <h4 className="fw-bold mb-3">Inspection Photos</h4>

      <label className="form-label fw-semibold">
        Upload Photos <span className="text-danger">(Max 3)</span>
      </label>

      <input
        type="file"
        className="form-control"
        multiple
        accept="image/*"
        onChange={(e) => {
          const selected = Array.from(e.target.files);
          if (selected.length > 3) {
            toast.error('Only 3 photos allowed');
            e.target.value = '';
            return;
          }
           const mapped = selected.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
          setPhotos(mapped);
        }}
      />

      {photos.length > 0 && (
        // <div className="text-success small mt-2">
        //   Selected: {photos.length} photo(s)
        // </div>

         <div className="row mt-3 g-2">
    {photos.map((photo, index) => (
      <div key={index} className="col-4 position-relative">
        <img
          src={photo.preview}
          alt="preview"
          className="img-fluid rounded border"
          style={{
            height: '200px',
            objectFit: 'cover',
            width: '100%'
          }}
        />

        <button
          type="button"
          className="btn btn-sm btn-danger position-absolute top-0 end-0"
          style={{ borderRadius: '50%' }}
          onClick={() => {
            URL.revokeObjectURL(photo.preview);
            setPhotos(prev => prev.filter((_, i) => i !== index));
          }}
        >
          ×
        </button>
      </div>
    ))}
  </div>
      )}

       <button
        className="btn btn-primary px-4 py-2 mt-3 fw-semibold"
       
        onClick={SubmitCaptureInfo}
      >
        Submit Report
      </button>
    </div>
  </div>
)}





<div className="border-top white-box shadow-sm p-4 mt-2">
  <div className="row align-items-end">
    
   

    {/* RIGHT SIDE: Submit Button */}
    <div className="col-md-12 text-end mt-3 mt-md-0">
     
    </div>

    <div className='col-sm-12'>
      <div className="text-danger small mt-2 fw-bold">
  Note: Please upload photos, enter arrival & departure time, and answer all questions
  (Yes/No with remarks) to enable the Submit Report button.
    <p className='text-primary'>{`Answered Questions: ${answeredQuestions}`} / {`Total Questions: ${totalQuestions}`} (Inclusive of Sub questions)</p>
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
          <div className="col-sm-6"><strong>Your Latitude:</strong>{geo.latitude}</div>
          <div className='col-sm-6'><strong>Your Longitude:</strong>{geo.longitude}</div>
          <div className='col-sm-6'><strong>School Latitude:</strong>{schoolLat}</div>
          <div className='col-sm-6'><strong>School Longitude:</strong>{schoolLong}</div>
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
              <button className='btn btn-danger' onClick={() => navigate('/touruservisits')}>Back</button>
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