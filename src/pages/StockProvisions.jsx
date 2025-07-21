import React from 'react'

const StockProvisions = () => {
  return (
    <>
     <h6 className="fw-bold mb-3"><a href="tsmess.html"><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign: 'middle'}}></i></a>Food Provisions</h6>
     
      <div className="row gy-3">
       
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
             <h3>School Food Provision Management</h3>
             <h6>Monitoring critical food items across 270 schools</h6>
            </div>     
        </div>

        <div className="col-sm-3">
            <div className="white-box shadow-sm">
                <div className="card-body">
                 <h5>Critical Stock Levels</h5>
                 <h4 className="text-danger">48</h4>
                </div>
            </div>
        </div>
        <div className="col-sm-3">
            <div className="white-box shadow-sm">
                <div className="card-body">
                 <h5>Low Stock Levels</h5>
                 <h4 style={{color:'orange'}}>48</h4>
                </div>
            </div>
        </div>
         <div className="col-sm-3">
            <div className="white-box shadow-sm ">
                <div className="card-body">
                 <h5>Medium Stock Levels</h5>
                 <h4 className="text-warning">48</h4>
                </div>
            </div>
        </div>
         <div className="col-sm-3">
            <div className="white-box shadow-sm ">
                <div className="card-body">
                 <h5>Good Stock Levels</h5>
                 <h4 className="text-success">48</h4>
                </div>
            </div>
        </div>

      <div className="col-sm-12">
         <div className="alert alert-danger d-flex justify-content-start align-items-center" role="alert">
            <div className="pe-2">
                <i className="bi bi-exclamation-triangle" style={{fontSize:'22px'}}></i>
            </div>
   <div>48 schools have critically low stock in key items like Rice, Oil, and Milk.</div>
</div>
      </div>


        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                 <h5><span className="pink fw-bold" style={{color:'#cc1178'}}>School Wise Provisions List</span></h5>
                
                <div className="table-responsive pt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>School Code</th>
                                <th>School Name</th>
                                <th>Zone</th>
                                <th>District</th>
                                <th>Item</th>
                                <th>Current Stock</th>
                                <th>Threshold</th>
                                <th>Status</th>
                                <th>Days Left</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>Kaleshwaram</td>
                                <td>Asifabad</td>
                                <td>Rice</td>
                                <td>45 kg</td>
                                <td>250 kg</td>
                                <td>
                                    <span className="badge text-bg-danger">Critical</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-danger">2 days</span>
                                </td>
                                <td>2025-07-15</td>
                            </tr>
                             <tr>
                                <td>51902</td>
                                <td>Test School 2</td>
                                <td>Sircilla</td>
                                <td>Siddipet</td>
                                <td>Milk</td>
                                <td>18 liters</td>
                                <td>150 liters</td>
                                <td>
                                    <span className="badge text-bg-danger">Critical</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-danger">2 days</span>
                                </td>
                                <td>2025-07-15</td>
                            </tr>
                             <tr>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>Kaleshwaram</td>
                                <td>Asifabad</td>
                                <td>Oil</td>
                                <td>8 liters</td>
                                <td>60 liters</td>
                                <td>
                                    <span className="badge text-bg-danger">Critical</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-danger">2 days</span>
                                </td>
                                <td>2025-07-15</td>
                            </tr>
                            <tr>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>Kaleshwaram</td>
                                <td>Asifabad</td>
                                <td>Oil</td>
                                <td>8 liters</td>
                                <td>60 liters</td>
                                <td>
                                    <span className="badge text-bg-danger">Critical</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-danger">2 days</span>
                                </td>
                                <td>2025-07-15</td>
                            </tr>
                            <tr>
                                <td>51902</td>
                                <td>Test School</td>
                                <td>Kaleshwaram</td>
                                <td>Asifabad</td>
                                <td>Oil</td>
                                <td>8 liters</td>
                                <td>60 liters</td>
                                <td>
                                    <span className="badge text-bg-danger">Critical</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-danger">2 days</span>
                                </td>
                                <td>2025-07-15</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default StockProvisions