import React,{ useEffect,useRef,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";

const EditTGDietEntries = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
const navigate = useNavigate();
const dataFetched = useRef(false);
const [selectedSchool,setSelectedSchool] = useState('');
const [selectedSchoolId,setSelectedSchoolId] = useState('');
const [schoolList,setSchoolList] = useState([]);

useEffect(() => {
if(schoolList && Array.isArray(schoolList)){
    setSchoolList(schoolsList)
}
},[schoolsList])


const schoolOptions = schoolList.map((school) => ({
    value: school.SchoolCode,
    label: school.PartnerName.replace('TGSWREIS',''),
    schoolid: school.SchoolID
}))



  return (
    <>
    <div className='row gy-3'>
    <div className='col-sm-12'>
        <div className='white-box shadow-sm'>
            <div className='row gy-3'>
                <div className='col-sm-3'>
                   <label className='form-label'>Select School</label>
                   <Select id='schooldisp'
                               isClearable={true}
                               isSearchable={true}
                               placeholder="Select School"
                               options={schoolOptions}
                               onChange={(option) => {setSelectedSchool(option ? option.value : '')
                                 setSelectedSchoolId(option ? option.schoolid : '')
                                }}
                    />
                </div>
                <div className='col-sm-3'>
                    <label className='form-label'>Select Date</label>
                    <input type='date' className='form-control' />
                </div>
            </div>
        </div>
    </div>
    <div className='col-sm-12'>
        <div className='white-box shadow-sm'>
            <div className='row gy-3'>
                <div className='col-sm-12'>
                    <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Purchase and Consumption Entries for 10-11-2025</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>School Code</th>
                                <th>School Name</th>
                                <th>Date</th>
                                <th>Total Strength</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Sick</th>
                                <th>Guest</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                           
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default EditTGDietEntries