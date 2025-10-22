import React,{useState,useRef} from 'react'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import {useForm} from 'react-hook-form'
import DataTable from 'react-data-table-component';

const StaffEntryForm = () => {

const [EmployeeType,setEmployeeType] = useState('')
const dataFetched = useRef(false);
  const token = useSelector((state) => state.userappdetails.TOKEN);
const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const [showModal,setShowModal] = useState(false);
const [employeeList,setEmployeeList] = useState([]);




const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();



const onSubmit = async (data) => {
    try{

        const payload = {
      ZoneId: ZoneId,
      EmployeeType: data.EmployeeType || null,
      FirstName: data.FirstName || null,
      LastName: data.LastName || null,
      DDOCode: data.DDOCode || null,
      BillId: data.BillId || null,
      GenderInfo: data.GenderInfo || null,
      DOB: data.DOB || null,
      AdharNo: data.AdharNo || null,
      MaritalStatus: data.MaritalStatus || null,
      PanNo: data.PanNo || null,
      EmailId: data.EmailId || null,
      PresentAddress: data.PresentAddress || null,
      MobileNumber: data.MobileNumber || null,
      BankName: data.BankName || null,
      AccountNumber: data.AccountNumber || null,
      IFSC: data.IFSC || null,
      Branch: data.Branch || null,
      DateOfJoin: data.DateOfJoin || null,
      CPSGPFType: data.CPSGPFType || null,
      CPSGPFNo: data.CPSGPFNo || null,
      TSGLINo: data.TSGLINo || null,
      NameOfTheOffice: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.NameOfTheOffice || null : null,
      AdminSanctionOrderDept: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.AdminSanctionOrderDept || null : null,
      AdminSanctionOrderGoNo: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.AdminSanctionOrderGoNo || null : null,
      AdminSanctionOrderDate: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.AdminSanctionOrderDate || null : null,
      ContractFrom: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.ContractFrom || null : null,
      ContractTo: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.ContractTo || null : null,
      MaximumPayablePerMonth: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.MaximumPayablePerMonth || null : null,
      FatherOrHusbandName: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.FatherOrHusbandName || null : null,
      NativeDistrict: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.NativeDistrict || null : null,
      Caste: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.Caste || null : null,
      QualificationCode: (data.EmployeeType === 'Honorarium' || data.EmployeeType === 'Part-Time' || data.EmployeeType === 'Contract' || data.EmployeeType === 'OutSourcing') ? data.QualificationCode || null : null,
      AgencyName: (data.EmployeeType === 'OutSourcing') ? data.AgencyName || null : null,
      ESIEarnings: (data.EmployeeType === 'OutSourcing') ? data.ESIEarnings || null : null,
      EPFEmployerContribution: (data.EmployeeType === 'OutSourcing') ? data.EPFEmployerContribution || null : null,
      GSTEarnings: (data.EmployeeType === 'OutSourcing') ? data.GSTEarnings || null : null,
      ESIDeductions: (data.EmployeeType === 'OutSourcing') ? data.ESIDeductions || null : null,
      EPFDeductions: (data.EmployeeType === 'OutSourcing') ? data.EPFDeductions || null : null,
      ProfessionalTaxDeductions: (data.EmployeeType === 'OutSourcing') ? data.ProfessionalTaxDeductions || null : null,
      TDSTobecreditedintoDDOAc: (data.EmployeeType === 'OutSourcing') ? data.TDSTobecreditedintoDDOAc || null : null,
      GSTTDSTobecreditedintoDDOAc: (data.EmployeeType === 'OutSourcing') ? data.GSTTDSTobecreditedintoDDOAc || null : null,
      ESICNo: (data.EmployeeType === 'OutSourcing') ? data.ESICNo || null : null,
      UANNo: (data.EmployeeType === 'OutSourcing') ? data.UANNo || null : null,
    };



    console.log("Payload:", payload);

        _fetch("createstaff",payload,false,token).then(res => {
            if(res.status === 'success'){
                toast.success(res.message)
                reset();
                setShowModal(true);
            } else {
                toast.error(res.message)
            }
        })

    } catch(error) {
      console.error('Error adding staff',error)
      toast.error('Error adding staff')
    }
}


const fetchAdminStaffList = async () => {
    const payload = {}

    payload.ZoneId = ZoneId 

    try {
        _fetch('getadminstaff',payload,false,token).then(res => {
            if(res.status === 'success'){
                setEmployeeList(res.data);
                toast.success(res.message);
            }
        })

    } catch(error){
        console.error('Error fetching Staff');
        toast.error('Error fetching staff')
    }
}


const columns = [
    {
        name: 'Employee Id',
        selector: row => row.EmployeeId,
        sortable: true,
        width: '120px',
        wrap: true
    },
    {
        name: 'Employee Type',
        selector: row => row.EmployeeType,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: row => row.FirstName,
    },
    {
        name: 'Last Name',
        selector: row => row.LastName,
    },
    {
        name: 'DDOCode',
        selector: row => row.DDOCode
    }
    ,{
        name: 'Gender',
        selector: row => row.GenderInfo === 1 ? 'Male' : 'Female'
    },
    {
        name: 'DOB',
        selector: row => row.DOB.split('T')[0]
    },
    {
        name: 'Date of Join',
        selector: row => row.DateOfJoin.split('T')[0]
    },
    {
        name: 'Mobile Number',
        selector: row => row.MobileNumber
    }
]


useEffect (() => {
if(!dataFetched.current){
    dataFetched.current = true;
    fetchAdminStaffList();
}


},[])


  return (
  <>
   <>
   <ToastContainer />
     <div className="row gy-3 justify-content-center">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
            <div className="form-header text-center">
                <h2><i className="fas fa-comments"></i> Staff HRMS Data Entry</h2>
            </div>
            
             <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-body">
                <div className="info-box">
                    <i className="fas fa-info-circle text-primary"></i>
                    
                </div>

                
                    <div className="row gy-3">
                          <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Employee Type <span className="required">*</span></label>
                                <select className='form-select' {...register("EmployeeType", { required: "Employee Type is required" })} onChange={(e) => setEmployeeType(e.target.value)}>
                                 <option value=''>--Select Employee Type--</option>
                                 <option value='Permanent'>Permanent</option>
                                 <option value='Part-Time'>Part Time</option>
                                 <option value='Honorarium'>Honorarium</option>
                                 <option value='Contract'>Contract</option>
                                 <option value='OutSourcing'>Out Sourcing</option>   
                                </select>
                            </div>
                        </div>

                
                   {EmployeeType && (
                        <>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">First Name <span className="required">*</span></label>
                                <input type="text" className="form-control" id="firstName" {...register('FirstName',{required: 'First Name is required'})} />
                                {errors.FirstName && <p style={{ color: "red" }}>{errors.FirstName.message}</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Last Name <span className="required">*</span></label>
                                <input type="text" className="form-control" id="LastName" {...register('LastName',{required: 'Last Name is required'})} />
                                {errors.LastName && <p style={{ color: "red" }}>{errors.LastName.message}</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">DDO Code <span className="required">*</span></label>
                                <input type="text" className="form-control" id="DDOCode" {...register('DDOCode')} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Bill ID <span className="required">*</span></label>
                                <input type="text" className="form-control" id="BillId" {...register('BillId')} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Gender Info <span className="required">*</span></label>
                                <select className='form-select' id="GenderInfo" {...register('GenderInfo')}>
                                    <option value=''>Please Select</option>
                                    <option value='1'>Male</option>
                                    <option value='2'>Female</option>
                                    <option value='3'>Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">DOB<span className="required">*</span></label>
                                <input type="date" className="form-control" id="DOB" {...register('DOB')} />
                                
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Aadhar No<span className="required">*</span></label>
                                <input type="text" className="form-control" id="AdharNo" {...register('AdharNo')} />
                                
                            </div>
                        </div>

                        {EmployeeType === 'Permanent' && (
                            <>
                          <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Marital Status<span className="required">*</span></label>
                                <select className='form-select' id="MaritalStatus" {...register('MaritalStatus')}>
                                    <option value=''>Please Select</option>
                                    <option value='1'>UnMarried</option>
                                    <option value='2'>Married</option>
                                </select>
                            </div>
                        </div>
                        
                       
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">PAN No<span className="required">*</span></label>
                                <input type="text" className="form-control" id="PanNo" {...register('PanNo')} />
                                
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Email Address <span className="required">*</span></label>
                                <input type="email" className="form-control" id="EmailId" {...register('EmailId')} />
                               
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Present Address<span className="required">*</span></label>
                                <input type="text" className="form-control" id="PresentAddress" {...register('PresentAddress')} />
                               
                            </div>
                        </div>
                        </>
                        )}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Mobile Number <span className="required">*</span></label>
                                <input type="tel" className="form-control" id="mobile" {...register('MobileNumber')} />
                               
                            </div>
                        </div>
                    
                    {EmployeeType === 'Permanent' || EmployeeType === 'Honorarium' || EmployeeType === 'Part-Time' || EmployeeType === 'Contract' && (
                        <>
                         <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Bank Name<span className="required">*</span></label>
                                <input type="text" className="form-control" id="BankName" {...register('BankName')} />
                            </div>
                    </div>
                    <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Account Number<span className="required">*</span></label>
                                <input type="text" className="form-control" id="AccountNumber" {...register('AccountNumber')} />
                                
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">IFSC<span className="required">*</span></label>
                                <input type="text" className="form-control" id="IFSC" {...register('IFSC')} />
                               
                            </div>
                        </div>
                        </>
                    )}
                   
                        {EmployeeType === 'Permanent' && (
                         <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Branch<span className="required">*</span></label>
                                <input type="text" className="form-control" id="Branch" {...register('Branch')} />
                               
                            </div>
                        </div>
                        )}
                        
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Date of Join<span className="required">*</span></label>
                                <input type="date" className="form-control" id="DateOfJoin" {...register('DateOfJoin')} />
                               
                            </div>
                        </div>

                        {EmployeeType === 'Permanent' && (
                         <>
                         <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">CPSGPF Type<span className="required">*</span></label>
                                <select className='form-control' id="CPSGPFType" {...register('CPSGPFType')}>
                                    <option value=''>Please Select</option>
                                    <option value='1'>AG GPF</option>
                                    <option value='2'>CPS</option>
                                </select>
                               
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">CPSGPF No<span className="required">*</span></label>
                                <input type="text" className="form-control" id="CPSGPFNo" {...register('CPSGPFNo')} />
                               
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">TSGLI Number<span className="required">*</span></label>
                                <input type="text" className="form-control" id="TSGLINo" {...register('TSGLINo')} />
                               
                            </div>
                        </div>
                         </>
                        )}
                        

                

        {(EmployeeType === 'Honorarium' || EmployeeType === 'Part-Time' || EmployeeType === 'Contract' || EmployeeType === 'OutSourcing') && (
         <>
          <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Name of the Office<span className="required">*</span></label>
                                <input type="text" className="form-control" id="NameOfTheOffice" {...register('NameOfTheOffice')} />
                               
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Admin Sanction Order Department<span className="required">*</span></label>
                                <input type="text" className="form-control" id="AdminSanctionOrderDept" {...register('AdminSanctionOrderDept')} />
                                
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Admin Sanction Order GO No.<span className="required">*</span></label>
                                <input type="text" className="form-control" id="AdminSanctionOrderGoNo" {...register('AdminSanctionOrderGoNo')} />
                              
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Admin Sanction Order Date<span className="required">*</span></label>
                                <input type="date" className="form-control" id="AdminSanctionOrderDate" {...register('AdminSanctionOrderDate')} />
                                
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Contract From<span className="required">*</span></label>
                                <input type="date" className="form-control" id="ContractFrom" {...register('ContractFrom')} />
                               
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Contract To<span className="required">*</span></label>
                                <input type="date" className="form-control" id="ContractTo" {...register('ContractTo')} />
                                
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Maximum Payable Per Month<span className="required">*</span></label>
                                <input type="text" className="form-control" id="MaximumPayablePerMonth" {...register('MaximumPayablePerMonth')} />
                             
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Father or Husband Name<span className="required">*</span></label>
                                <input type="text" className="form-control" id="FatherOrHusbandName" {...register('FatherOrHusbandName')} />
                               
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Native District as Per New District<span className="required">*</span></label>
                                <input type="text" className="form-control" id="NativeDistrict" {...register('NativeDistrict')} />
                                
                            </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Caste<span className="required">*</span></label>
                                <select className='form-select' id="caste" {...register('Caste')}>
                                    <option value=''>Please Select</option>
                                    <option value='1'>General</option>
                                    <option value='2'>BC</option>
                                    <option value='3'>SC</option>
                                    <option value='4'>ST</option>
                                </select>
                                
                    </div>
                   </div>
                    <div className='col-md-6'>
                     <div className="form-group">
                                <label className="form-label">Qualification Code<span className="required">*</span></label>
                                <select className='form-select' id="qualcode" {...register('QualificationCode')}>
                                    <option value=''>Please Select</option>
                                    <option value='1'>Below SSC or SSC</option>
                                    <option value='2'>Below Inter or Inter</option>
                                    <option value='3'>Below Degree or Degree</option>
                                </select>
                                
                            </div>
                   </div>
          </>
        )} 


              {(EmployeeType === 'OutSourcing') && ( 

          <>
        <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">Agency Name<span className="required">*</span></label>
                                <input type="text" className="form-control" id="AgencyName" {...register('AgencyName')} />
                                
        </div>
        </div>   

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">ESI Earnings<span className="required">*</span></label>
                                <input type="text" className="form-control" id="esiearnings" {...register('ESIEarnings')} />
                                
        </div>
        </div> 

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">EPF Employer Contribution<span className="required">*</span></label>
                                <input type="text" className="form-control" id="epfemp" {...register('EPFEmployerContribution')} />
                               
        </div>
        </div>   

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">GST Earnings<span className="required">*</span></label>
                                <input type="text" className="form-control" id="gstearnings" {...register('GSTEarnings')} />
                                
        </div>
        </div>   

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">ESI Deductions<span className="required">*</span></label>
                                <input type="text" className="form-control" id="esided" {...register('ESIDeductions')} />
                                
        </div>
        </div>   


        <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">EPF Deductions<span className="required">*</span></label>
                                <input type="text" className="form-control" id="epfded" {...register('EPFDeductions')} />
                                
        </div>
        </div>  


        <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">Professional Tax Deductions<span className="required">*</span></label>
                                <input type="text" className="form-control" id="professionaltax" {...register('ProfessionalTaxDeductions')} />
                                
        </div>
        </div>  


         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">TDS To be credited into DDOAc<span className="required">*</span></label>
                                <input type="text" className="form-control" id="tdscredited" {...register('TDSTobecreditedintoDDOAc')} />
                                
        </div>
        </div>

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">GST TDS To be credited into DDOAc<span className="required">*</span></label>
                                <input type="text" className="form-control" id="gstcredited" {...register('GSTTDSTobecreditedintoDDOAc')} />
                               
        </div>
        </div>

         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">ESIC No<span className="required">*</span></label>
                                <input type="text" className="form-control" id="esicno" {...register('ESICNo')} />
                                
        </div>
        </div>


         <div className='col-md-6'>
         <div className="form-group">
                                <label className="form-label">UAN No<span className="required">*</span></label>
                                <input type="text" className="form-control" id="UANNo" {...register('UANNo')} />
                               
        </div>
        </div>
        </>
              )}
                  <div className='row text-center'>
                  <div className="col-sm-12 text-center mt-3">
                       <button type="submit" className="btn btn-primary py-2">
                        <i className="fas fa-paper-plane"></i> Submit
                    </button>
                    </div>
                  </div>

                  </>
  )}
            
                   
                  </div>
                

                
            </div>
            </form> 
            

        </div>
        </div>

        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
                  <div className="table-header">
                    <h5><span className="pink fw-bold">{UserType === 'SuperAdmin' ? 'Head Office Staff List' : `Zone ${ZoneId} Office Staff List` }</span></h5>
                    </div>
                <div className='table-responsive'>
                    <DataTable
                    columns={columns}
                    data={employeeList}
                     pagination
                  striped
                  persistTableHead
                  noDataComponent={<span>No data available</span>}
                  highlightOnHover
                  dense
                    
                    />
                </div>
            </div>
        </div>
       </div>

       {showModal && (
        <div className="modal fade show"  tabIndex="-1" role='dialog' style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Staff Added</h1>
        <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
      </div>
      <div className="modal-body row g-3">
        <div className='col-sm-12 text-center'>
         Staff has been successfully added
         <br/>
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
  </>
  )

}

export default StaffEntryForm