import React,{ useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import {useNavigate} from 'react-router-dom'

const EditSchoolContacts = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const [SchoolContacts,setSchoolContacts] = useState([]);
const navigate = useNavigate()


useEffect(() => {
    fetchSchoolContacts();

},[])


const fetchSchoolContacts = async () => {
     try{
            _fetch('fetchschoolcontacts',null,false,token).then(res => {
                if(res.status === 'success'){
                    setSchoolContacts(res.data);
                    toast.success(res.message);
                }else{
                    toast.error(res.message);
                    setSchoolContacts([])
                }
            })
    
        } catch(error){
            console.log('Error fetching School Contact Details',error)
        }
}


const handleInputChange = (index,newValue) => {
    const updatedContacts = [...SchoolContacts]
    updatedContacts[index].ContactMobile = newValue;
    setSchoolContacts(updatedContacts)
}

const updateSchoolContact = async (schoolCode, contactNumber) => {

    try {

    const payload = {
        schoolCode: schoolCode,
        ContactMobile : contactNumber
    }

    
    _fetch('updateschoolcontact',payload,false,token).then(res => {
        
         if(res.status === 'success'){
            toast.success(res.message);
        }else {
            toast.error(res.message);
            console.error('Error updating school contact')
        }
    })
        } catch(error) {
            console.log('Error updating school contacts:',error)
        } 
    
}


  return (
   <>
   <ToastContainer/>
    <div className='row'>
        <div className='col-sm-12'>
             <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">School Contact Details</span></h5>
                </div>
                <div className='text-end'>
                    <button className='btn btn-success' onClick={() => navigate('/zonescontact')}>Update Zone Contacts</button>
                </div>
                <table className='table table-bordered'>
                    <thead>
                    <tr>
                        <th>School Code</th>
                        <th>School Name</th>
                        <th>School Contact</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {SchoolContacts.map((item,index) => (
                            <tr key={item.SchoolCode}>
                                <td>{item.SchoolCode}</td>
                                <td>{item.PartnerName}</td>
                                <td>
                                    <input type='text' className='form-control' value={item.ContactMobile} onChange={(e) => handleInputChange(index,e.target.value)} />
                                </td>
                                <td>
                                    <button className='btn btn-primary' onClick={() => updateSchoolContact(item.SchoolCode,item.ContactMobile)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
                </div>
                </div>
                </div>
   </>
  )
}

export default EditSchoolContacts