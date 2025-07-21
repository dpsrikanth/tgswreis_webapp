import React from 'react'
import { useNavigate } from 'react-router-dom'


const Reports = () => {
    const navigate = useNavigate();
  return (
    <>
      <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/tsmess')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Reports Dashboard</h6>
      
      <div className="row">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Reports Dashboard</span></h5>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <ul>
                            <li><a onClick={() => {navigate('/schoolwisevendor')}} style={{cursor: 'pointer'}} className="text-primary">School Wise Vendor Releasing</a></li>
                            <li><a onClick={() => {navigate('/vendorwisereleasing')}} className="text-primary">Vendor Wise Releasing</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <ul>
                            {/* <li><a href="#" className="text-primary">Month-Wise Vendor Report</a></li> */}
                            <li> <a href="#" className="text-primary">School-Wise Attendance and Consumption</a></li>
                        </ul>
                    </div>
                    {/* <div className="col-md-4">
                        <li><a href="#" className="text-primary">Consolidated Report</a></li>
                        <li><a href="#" className="text-primary">Dietary Annexure</a></li>
                    </div> */}
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Reports