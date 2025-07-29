import React,{ useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";

const EditZoneContacts = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const [ZoneContacts,setZoneContacts] = useState([]);

useEffect(() => {
    fetchZoneContacts()
},[])


const fetchZoneContacts = async () => {
    try{
        _fetch('fetchzonecontacts',null,false,token).then(res => {
            if(res.status === 'success'){
                setZoneContacts(res.data);
                toast.success(res.message);
            }else{
                toast.error(res.message);
                setZoneContacts([])
            }
        })

    } catch(error){
        console.log('Error fetching Zone Contact Details',error)
    }
}


const handleInputChange = (index,newValue) => {
    const updatedContacts = [...ZoneContacts];
    console.log(updatedContacts);
    updatedContacts[index].ZoneContactNumber = newValue;
    setZoneContacts(updatedContacts);
}


const updateZoneContact = async (zoneId,contactNumber) => {
    try{

        const payload = {
            ZoneId: zoneId,
            ZoneContactNumber: contactNumber
        };

    _fetch('updatezonecontact',payload,false,token).then(res => {
        if(res.status === 'success'){
            toast.success(res.message);
        }else{
            toast.error(res.message);
            console.log('Error updating zone contact')
        }
    })    

    } catch (error){
        console.log('Error updating contact number:',error)
    }
}

  return (
    <>
    <ToastContainer/>
    <div className='row'>
        <div className='col-sm-12'>
             <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Zones Contact Details</span></h5>
                </div>
                <table className='table table-bordered'>
                 <thead>
                    <tr>
                        <th>Zone</th>
                        <th>Zone Contact Name</th>
                        <th>Zone Contact Number</th>
                        <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                   {ZoneContacts.map((item,index) => (
                    <tr key={item.ZoneId}>
                        <td>{item.ZoneId}</td>
                        <td>{item.ZoneContactName}</td>
                        <td>
                            <input type='text' className='form-control' value={item.ZoneContactNumber} onChange={(e) => handleInputChange(index,e.target.value)} />
                        </td>
                        <td>
                            <button className='btn btn-primary' onClick={() => updateZoneContact(item.ZoneId,item.ZoneContactNumber)}>Update</button>
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

export default EditZoneContacts