import React from 'react'

const TourSystemSettings = () => {
  return (
   <>
   <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style="font-size: 24px;vertical-align: middle;"></i></a>Tour System Settings</h6>
     
      <div className="row gy-3">
       
       



        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <h5>Mandatory Visit Requirements</h5>
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">District Coordinators (DCOs)</label>
                        <input type="number" value="18" className="form-control" />
                        <span>Visits/month</span>
                    </div>
                     <div className="col-sm-4">
                        <label className="form-label">Zonal Officers</label>
                        <input type="number" value="12" className="form-control" />
                        <span>Visits/month</span>
                    </div>
                     <div className="col-sm-4">
                        <label className="form-label">Special Officers</label>
                        <input type="number" value="8" className="form-control" />
                        <span>Visits/month</span>
                    </div>
                  
                   <hr/>
                   <div className="col-sm-12">
                    <h5>Notification Settings</h5>
                   </div>
                   <hr />

                   <div className="col-sm-12">Report Deadline Settings</div>
                   <div className="col-sm-6">
                    <label className="form-label">Report Upload Deadline (Days after Visit)</label>
                    <input type="number" className="form-control" />
                   </div>
                   <div className="col-sm-6">
                    <label className="form-label">Photo Upload Requirement</label>
                    <select className="form-select">
                        <option>--Select--</option>
                        <option>Mandatory for all visits</option>
                        <option>Optional</option>
                        <option>Required for Specific Visit Types</option>
                    </select>
                   </div>
                   <div className="col-sm-12">
                    <button className="btn btn-primary">Save</button>
                    <button className="btn btn-secondary">Reset to Default</button>
                   </div>
                   
                   
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">User Management</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Officer Name</th>
                                <th>Designation</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>DCO</td>
                                <td>john.doe@example.com</td>
                                <td><span className="badge bg-success">Active</span></td>
                                <td>
                                    <div>
                                        <button className="btn btn-sm">Edit</button>
                                        <button className="btn btn-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-sm-12">
                    <button className="btn btn-primary">Add New Officer</button>
                </div>
                </div>
            </div>
        
      </div>
   </>
  )
}

export default TourSystemSettings