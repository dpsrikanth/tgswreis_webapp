import React from 'react'

const TourDiaryEntry = () => {
  return (
    <>
     <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style="font-size: 24px;vertical-align: middle;"></i></a>Tour Diary Entry</h6>
     
      <div className="row gy-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="row gy-3">
                    <div className="col-sm-4">
                        <label className="form-label">Select Entry Category</label>
                        <select className="form-select">
                            <option>--Select--</option>
                            <option>Consumption</option>
                            <option>Purchase</option>
                        </select>
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Import File</label>
                         <input type="file" className="form-control" />
                    </div>
                </div>
                </div>
                </div>
                <div className="col-sm-12">
                    <div className="white-box shadow-sm">
                 <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">Tour Diary Entries for the Month of</span></h5>
                </div> 
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Visit</th>
                                <th>School Name</th>
                                <th style="width: 100px;">Quantity</th>
                                <th>Unit</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" className="form-check-input" /></td>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>25-09-2025</td>
                                <td>Aavalu</td>
                                <td><input type="text" value="2" className="form-control form-control-sm" /></td>
                                <td>kg</td>
                                
                            </tr>

                             <tr>
                                <td><input type="checkbox" className="form-check-input" /></td>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>26-09-2025</td>
                                <td>Salt</td>
                                <td><input type="text" value="1" className="form-control form-control-sm" /></td>
                                <td>kg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col-sm-12 text-center">
                        <button className="btn btn-primary">Save</button>
                    </div>
                </div>
                </div>
            </div>
        
      </div>
    </>
  )
}

export default TourDiaryEntry