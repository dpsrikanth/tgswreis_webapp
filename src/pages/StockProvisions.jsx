import React,{ useEffect,useRef,useState} from 'react'
import { data, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";

const StockProvisions = () => {

   const token = useSelector((state) => state.userappdetails.TOKEN);
   const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
   const schoolsList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
   const navigate = useNavigate();
   const dataFetched = useRef(false);
   const [stockProvisionsGrid,setStockProvisionsGrid] = useState([]); 
   const [criticalCount,setCriticalCount] = useState(0);
   const [lowCount,setLowCount] = useState(0);
   const [mediumCount,setMediumCount] = useState(0);
   const [goodCount,setGoodCount] = useState(0);
   const [filterStatus,setFilterStatus] = useState('Critical')


   const fetchStockProvisionsSchools = async () => {

    const payload = {
        StatusFilter : filterStatus
    }

    try {
        _fetch('stockprovisionsschools',payload,false,token).then(res => {
            if(res.status === 'success'){
                setStockProvisionsGrid(res.data.criticalStockData);
                setCriticalCount(res.data.Summary[0].NoOfSchools)
                toast.success(res.message);
            } else {
                toast.error(res.message);
                setStockProvisionsGrid([])
            }
        })

    } catch (error) {
        console.log('Error fetching Stock Provisions data for schools',error)
    }
   }


 useEffect(() => {
  fetchStockProvisionsSchools();
}, [filterStatus]); 



  return (
    <>
     <h6 className="fw-bold mb-3"><a onClick={navigate('/samsdashboard')}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign: 'middle'}}></i></a>Food Provisions</h6>
     
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
                 <h4 className="text-danger">{criticalCount}</h4>
                 <button className='btn btn-primary' onClick={() => setFilterStatus('Critical')}>View</button>
                </div>
            </div>
        </div>
        <div className="col-sm-3">
            <div className="white-box shadow-sm">
                <div className="card-body">
                 <h5>Low Stock Levels</h5>
                 <h4 style={{color:'orange'}}>{lowCount}</h4>
                  <button className='btn btn-primary' onClick={() => setFilterStatus('Low')}>View</button>
                </div>
            </div>
        </div>
         <div className="col-sm-3">
            <div className="white-box shadow-sm ">
                <div className="card-body">
                 <h5>Medium Stock Levels</h5>
                 <h4 className="text-warning">{mediumCount}</h4>
                  <button className='btn btn-primary' onClick={() => setFilterStatus('Medium')}>View</button>
                </div>
            </div>
        </div>
         <div className="col-sm-3">
            <div className="white-box shadow-sm ">
                <div className="card-body">
                 <h5>Good Stock Levels</h5>
                 <h4 className="text-success">{goodCount}</h4>
                  <button className='btn btn-primary' onClick={() => setFilterStatus('Good')}>View</button>
                </div>
            </div>
        </div>

      <div className="col-sm-12">
         <div className="alert alert-danger d-flex justify-content-start align-items-center" role="alert">
            <div className="pe-2">
                <i className="bi bi-exclamation-triangle" style={{fontSize:'22px'}}></i>
            </div>
   <div>{criticalCount} schools have critically low stock in key items like Rice, Oil, and Milk.</div>
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
                                <th>Item</th>
                                <th>Current Stock</th>
                                <th>Required Qty</th>
                                <th>Total Strength</th>
                                <th>Stock Percentage</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                         {stockProvisionsGrid.map((item,index) => (
                            <tr key={index}>
                                <td>{item.SchoolCode}</td>
                                <td>{item.PartnerName}</td>
                                <td>{item.IngredientName}</td>
                                <td>{item.AvailQty}</td>
                                <td>{item.RequiredQty}</td>
                                <td>{item.TotalStrength}</td>
                                <td>{item.StockPercent}</td>
                                <td>
                                     <span className="badge text-bg-danger">{item.StockStatus}</span>
                                </td>
                            </tr>
                         ))}

                            {/* <tr>
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
                            </tr> */}
                           
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