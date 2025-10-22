import React,{useState,useRef} from 'react';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

import {useForm} from 'react-hook-form'


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
const fileInputRef = useRef(null);



const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

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



const onSubmit = async (data) => {
    try{

        // e.preventDefault();

        // const payload = {SchoolId:selectedSchoolCode,MobileNumber,Category,ComplainantName,EmailAddress,Subject,Description}

        const formData = new FormData();

        formData.append('SchoolId',data.schoolCode);
        formData.append('MobileNumber',data.mobilenum);
        formData.append('Category',data.Category);
        formData.append('ComplainantName',data.name);
        formData.append('EmailAddress',data.emailaddress);
        formData.append('Subject',data.Subject);
        formData.append('Description',data.Description);
         formData.append('Attachment',data.Attachment[0]);



        _fetch("creategrievance",formData,true).then(res => {
            if(res.status === 'success'){
                toast.success(res.message)
                reset();
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
            
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-body">
                <div className="info-box">
                    <i className="fas fa-info-circle text-primary"></i>
                    <strong>Note:</strong> All grievances will be automatically assigned a unique tracking number and forwarded to the concerned department for resolution.
                </div>

                
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="required">*</span></label>
                                <input type="text" className="form-control" id="fullName" {...register('name',{required: 'Name is required'})} />
                                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Mobile Number <span className="required">*</span></label>
                                <input type="tel" className="form-control" id="mobile" {...register('mobilenum',{required: 'Mobile Number is required'})} />
                                {errors.mobilenum && <p style={{ color: "red" }}>{errors.mobilenum.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Email Address <span className="required">*</span></label>
                                <input type="email" className="form-control" id="email" {...register('emailaddress',{required: 'Email Address is required'})} />
                                {errors.emailaddress && <p style={{ color: "red" }}>{errors.emailaddress.message}</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Institution/School <span className="required">*</span></label>
                                <select className='form-select' {...register("schoolCode", { required: "School is required" })} >
                                    <option value=''>--Select School--</option>
                                    {schoolsList.map((item) => (
                                        (<option key={item.SchoolCode} value={item.SchoolCode}>{item.InstitutionName}</option>)
                                    ))}
                                </select>
                                 {errors.schoolCode && (
            <p style={{ color: "red" }}>{errors.schoolCode.message}</p>
          )}
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Grievance Category <span className="required">*</span></label>
                                <select className="form-select" id="category" required="" {...register('Category',{required:'Select Grievance Category'})}>
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
                                {errors.Category && (
              <p style={{ color: "red" }}>{errors.Category.message}</p>
            )}
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
                        <input type="text" className="form-control" id="subject" placeholder="Brief subject of your grievance" {...register('Subject',{required: 'Subject is required'})} />
                        {errors.Subject && <p style={{ color: "red" }}>{errors.Subject.message}</p>}
                    </div>

                    <div className="form-group mt-3">
                        <label className="form-label">Detailed Description <span className="required">*</span></label>
                        <textarea className="form-control" id="description" rows="6" placeholder="Please provide detailed description of your grievance..." {...register('Description',{required: 'Description is required'})}></textarea>
                        {errors.Description && <p style={{ color: "red" }}>{errors.Description.message}</p>}
                    </div>

                    <div className="form-group mt-3">
                        <label className="form-label">Attachment<span className="required">*</span></label>
                        <input className="form-control" id="attachment" type='file' {...register('Attachment',{required: 'Attachment is required'})} />
                         {errors.Attachment && (<p style={{ color: "red" }}>{errors.Attachment.message}</p>)}
                    </div>

                  
                    <div className="col-sm-12 mt-3">
                       <button type="submit" className="btn btn-primary w-100">
                        <i className="fas fa-paper-plane"></i> Submit Grievance
                    </button>
                    </div>
                  
               

                
            </div>
            </form>

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