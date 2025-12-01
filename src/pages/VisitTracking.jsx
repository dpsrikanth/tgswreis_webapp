import React from 'react'

const VisitTracking = () => {
  return (
    <>
    <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style="font-size: 24px;vertical-align: middle;"></i></a>Visit Tracking</h6>
     
      <div className="row gy-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Filter by Officer</label>
                        <select className="form-select">
                            <option>--Select--</option>
                        </select>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Filter by Status</label>
                        <select className="form-select">
                            <option>--Select--</option>
                        </select>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Month</label>
                        <input type="month" className="form-control" />
                    </div>
                    
                   
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Visit Records</span></h5>
                    <div>
                    <span className="badge bg-success">Scheduled</span>
                    <span className="badge bg-primary">Additional</span>
                    <span className="badge bg-danger">Not Visited</span>
                    </div>
                   
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Officer</th>
                                <th>Scheduled Location</th>
                                <th>Status</th>
                                <th>Report</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-11-18</td>
                                <td>John Doe</td>
                                <td>51902 - Adilabad</td>
                                <td><span className="badge bg-success">Scheduled Visit</span></td>
                                <td><span className="badge bg-success">Uploaded</span></td>
                                <td><button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button></td>
                            </tr>

                             <tr>
                               <td>2025-11-18</td>
                                <td>Sarah</td>
                                <td>51903 - Adilabad</td>
                                <td><span className="badge bg-success">Scheduled Visit</span>
                                <span className="badge bg-primary">Additional</span>
                                </td>
                                <td><span className="badge bg-success">Uploaded</span></td>
                                <td><button className="btn btn-primary btn-sm">View</button></td>
                            </tr> 
                            <tr>
                               <td>2025-11-17</td>
                                <td>Mike</td>
                                <td>51905 - Adilabad</td>
                                <td><span className="badge bg-danger">Not Visited</span>
                                </td>
                                <td><span className="badge bg-danger">Pending</span></td>
                                <td><button className="btn btn-primary btn-sm">View</button></td>
                            </tr> 
                        </tbody>
                    </table>
                </div>
                </div>
            </div>

            <div className="col-sm-12">
                <div className="white-box shadow-sm">
                    <h5>Visit Compliance Summary</h5>
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>Officer</th>
                                <th>Designation</th>
                                <th>Required</th>
                                <th>Completed</th>
                                <th>Missed</th>
                                <th>Additional</th>
                                <th>Compliance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>DCO</td>
                                <td>18</td>
                                <td>16</td>
                                <td>2</td>
                                <td>3</td>
                                <td>89%</td>
                            </tr>
                             <tr>
                                <td>Sarah</td>
                                <td>Zonal Officer</td>
                                <td>12</td>
                                <td>11</td>
                                <td>1</td>
                                <td>2</td>
                                <td>92%</td>
                            </tr>
                             <tr>
                                <td>Mike</td>
                                <td>Special Officer</td>
                                <td>8</td>
                                <td>5</td>
                                <td>3</td>
                                <td>1</td>
                                <td>63%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        
      </div>

       <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Visit Report Details</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                
                    <div className="row gy-3">
                    
                    <div className="col-sm-4">
                        <div>Officer</div>
                        <div>John Doe</div>
                    </div>
                  
                    <div className="col-sm-4">
                        <div>Status</div>
                        <div>Scheduled Visit</div>
                    </div>
                    <div className="col-sm-4">
                        <div>Date</div>
                        <div>2025-11-15<div>
                    </div>
                    <div className="col-sm-4">
                       <div>Duration</div>
                       <div>4 hours</div>
                    </div>
                    <div className="col-sm-4">
                         <div>Location</div> 
                         <div>District A - Zone 1</div>
                    </div>
                     <div className="col-sm-4">
                         <div>Report Uploaded</div> 
                         <div>2025-11-15 18:30</div>
                    </div>
                    <hr/>
                    <div className="col-sm-12">
                        <h5>Visit Summary</h5>
                        <p>Conducted comprehensive inspection of Zone 1 facilities. Reviewed compliance documents, interviewed staff, and assessed infrastructure conditions. All areas were found to be in satisfactory condition with minor recommendations for improvement.</p>
                    </div>
                    <hr/>
                    <div className="col-sm-12">
                        <h5>Photographs</h5>
                        <div className="d-flex justify-content-around">
                        <div>Photo 1</div>
                        <div>Photo 2</div>
                        <div>Photo 2</div>
                        </div>
                        
                    </div>
                    </div>
                
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Downlaod Pdf</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default VisitTracking