import React,{useState} from 'react';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';


const GrievanceForm = () => {



const [MobileNumber,setMobileNumber] = useState('');
const [Category,setCategory] = useState('');
const [ComplainantName,setComplainantName] = useState('');
const [EmailAddress,setEmailAddress] = useState('');
const [Subject,setSubject] = useState('');
const [Description,setDescription] = useState('');
const [schoolsList,setSchoolList] = useState([]);
const [selectedSchoolCode,setSelectedSchoolCode] = useState('');
const [attachment,setAttachment] = useState(null);
const [grievanceCode,setGrievanceCode] = useState('');
const [showModal,setShowModal] = useState(false);


const fetchSchools = async () => {
    try {
        _fetch('schoolslistgrievance',null,false).then(res => {
            if(res.status === 'success'){
                setSchoolList(res.data);
            } else {
                console.error('Error fetching schools list',res.message)
            }
        }
        )

    } catch(error){
      console.error('Error fetching Schools',error)
    }
}



const sendGrievance = async () => {
    try{

        const payload = {SchoolId:selectedSchoolCode,MobileNumber,Category,ComplainantName,EmailAddress,Subject,Description}

        const formData = new FormData();

        formData.append('SchoolId',selectedSchoolCode);
        formData.append('MobileNumber',MobileNumber);
        formData.append('Category',Category);
        formData.append('ComplainantName',ComplainantName);
        formData.append('EmailAddress',EmailAddress);
        formData.append('Subject',Subject);
        formData.append('Description',Description);
        if(attachment){
         formData.append('Attachment',attachment);
        }



        _fetch("creategrievance",formData,true).then(res => {
            if(res.status === 'success'){
                toast.success(res.message)
                setMobileNumber('');
                setCategory('');
                setComplainantName('');
                setEmailAddress('');
                setSubject('');
                setDescription('');
                setSelectedSchoolCode('');
                setAttachment(null);
                setGrievanceCode(res.data.GrievanceCode);
                setShowModal(true);
            } else {
                toast.error(res.message)
            }
        })

    } catch(error) {
      console.error('Error creating grievance',error)
      toast.error('Error creating a new grievance')
    }
}


useEffect(() => {

    fetchSchools();

},[])


  return (
   <>
   <ToastContainer />
     <div className="row justify-content-center">
        <div className="col-sm-8">
            <div className="white-box shadow-sm">
            <div className="form-header text-center">
                <h2><i className="fas fa-comments"></i> Submit Grievance</h2>
                <p>Lodge your complaint 24x7. We're here to help you.</p>
            </div>
            
            <div className="form-body">
                <div className="info-box">
                    <i className="fas fa-info-circle text-primary"></i>
                    <strong>Note:</strong> All grievances will be automatically assigned a unique tracking number and forwarded to the concerned department for resolution.
                </div>

                
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="required">*</span></label>
                                <input type="text" className="form-control" id="fullName" value={ComplainantName} onChange={(e) => setComplainantName(e.target.value)} required="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Mobile Number <span className="required">*</span></label>
                                <input type="tel" className="form-control" id="mobile" pattern="[0-9]{10}" value={MobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required="" />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" id="email" value={EmailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Institution/School</label>
                                <select className='form-select' value={selectedSchoolCode} onChange={(e) => setSelectedSchoolCode(e.target.value)} >
                                    <option value=''>--Select School--</option>
                                    {schoolsList.map((item) => (
                                        (<option key={item.SchoolCode} value={item.SchoolCode}>{item.InstitutionName}</option>)
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Grievance Category <span className="required">*</span></label>
                                <select className="form-select" id="category" required="" value={Category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    <option value="Academic Issues">Academic Issues</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Health & Medical">Health &amp; Medical</option>
                                    <option value="Food & Dining">Food &amp; Dining</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Admission">Admission Related</option>
                                    <option value="Discipline">Discipline Issues</option>
                                    <option value="Staff">Staff Related</option>
                                    <option value="Financial & Scholarship">Financial/Scholarship</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>
                        {/* <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Priority Level <span className="required">*</span></label>
                                <select className="form-select" id="priority" required="">
                                    <option value="">Select Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div> */}
                    </div>

                    <div className="form-group mt-3">
                        <label className="form-label">Grievance Subject <span className="required">*</span></label>
                        <input type="text" className="form-control" id="subject" placeholder="Brief subject of your grievance" value={Subject} onChange={(e) => setSubject(e.target.value)} required="" />
                    </div>

                    <div className="form-group mt-3">
                        <label className="form-label">Detailed Description <span className="required">*</span></label>
                        <textarea className="form-control" id="description" rows="6" placeholder="Please provide detailed description of your grievance..." required="" value={Description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                     <div className="form-group mt-3">
                        <label className="form-label">Attachment<span className="required">*</span></label>
                        <input className="form-control" id="attachment" type='file' onChange={(e) => setAttachment(e.target.files[0])} />
                        </div>

                  
                    <div className="col-sm-12 mt-3">
                       <button type="submit" className="btn btn-primary w-100" onClick={() => sendGrievance()}>
                        <i className="fas fa-paper-plane"></i> Submit Grievance
                    </button>
                    </div>
                   
               

                
            </div>
        </div>
        </div>
       </div>

       {showModal && (
        <div className="modal fade show"  tabIndex="-1" role='dialog' style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Grievance Submitted</h1>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body row g-3">
        <div className='col-sm-12 text-center'>
         Your Grievance has been successfully Submitted
         <br/>
         Grievance Code: <strong>{grievanceCode}</strong>
        </div>
       
       
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
      </div>
     )}
   </>
  )
}

export default GrievanceForm