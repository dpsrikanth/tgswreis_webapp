import React, { useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { data, Form, useNavigate } from 'react-router-dom';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";

const Items = () => {
const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const navigate = useNavigate();
const dataFetched = useRef(false);
const [items,setItems] = useState([]);
const [showModal,setShowModal] = useState(false);
const [EditItemId,setEditItemId] = useState(null);
const [formData,setFormData] = useState({
    category: '',
    itemName: '',
    unitName: ''
})

const fetchItems = async () => {
    _fetch('fetchitems',null,false,token).then(res => {
        if(res.status === 'success') {
            setItems(res.data);
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        console.error('Error fetching Items List',err);
        toast.error('Failed to fetch Items List');
    })
};

useEffect(() => {
if(!token) {
    navigate('/login');
}

if(!dataFetched.current) {
    dataFetched.current = true;
    fetchItems();
}
},[token])


const addItem = async () => {
    const payload = {IngredientName: formData.itemName,CategoryName: formData.category,UnitName: formData.unitName}
   
    _fetch("additems",payload,false,token).then(res => {
        if(res.status === 'success') {
            toast.success(res.message);
            fetchItems();
            setShowModal(false);
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        console.error('Failed to Add a New Item',err);
        toast.error('Failed to add a new item');
    })
}




  return (
    <>
     <ToastContainer />
     <h6 className="fw-bold mb-3">
                <a onClick={() => { navigate("/tsmess") }} style={{ cursor: "pointer" }}>
                    <i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i>
                </a> Items List
    </h6>
     <div className="row g-3 mb-3">
        <div className='col-sm-12 text-end'>
            {UserType === 'SuperAdmin' ? (<button className='btn btn-primary' onClick={() => setShowModal(true)}>Add New Item</button>) : (<span></span>)}
            
        </div>
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Items List</span></h5>
                    <div className="table-tools">
                        <input type="text" className="form-control" placeholder="Search..." />
                         <select className="form-select">
                            <option>Dry Provision</option>
                            <option>Perishables</option>
                            <option>Rice</option>
                            <option>Cleaning Agents</option>
                            <option>Utensils/Equipments</option>
                          </select> 
                        <img src="img/print_icon.png" />
                    <img src="img/download_icon.png" className="download_img" />
                      </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Item ID</th>
                                <th>Category</th>
                                <th>Item Name</th>
                                <th>Unit Name</th>
                                 {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {Array.isArray(items) && items.length > 0 ? (
                                items.map((item,index) => (
                                 <tr key={item.MasterIngredientId}>
                                    <td>
                                        {item.MasterIngredientId}
                                    </td>
                                    <td>{item.CategoryName}</td>
                                    <td>
                                        {item.IngredientName}
                                    </td>
                                    
                                    <td>{item.UnitName}</td>
                             {/* <td>
                                <div className="icon-container">
                                    <i className="bi bi-pencil-square" style={{ cursor: 'pointer', color: 'var(--primary-purple)' }} data-bs-toggle="modal" data-bs-target="#exampleModal"  ></i>
                                </div>    
                            </td>  */}
                                 </tr>
                                ))
                            ):(
                                 <tr>
                                            <td colSpan={3} className="text-center text-muted">No data available</td>
                                </tr>
                            )}
                         
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
       {/* Modal Dialog */}
            {showModal && (
                <div className="modal fade show" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">
                                   Add New Item
                                </h1>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                    <div className="row gy-3">
                                        <div className='col-sm-6'>
                                            <label className='form-label'>Select Category</label>
                                            <select className='form-select' value={formData.category} onChange={e => setFormData({...formData,category: e.target.value})}>
                                                <option>--Select--</option>
                                                <option value="Dry Provision">Dry Provision</option>
                                                <option value="Perishables">Perishables</option>
                                                <option value="Rice">Rice</option>
                                                <option value="Cleaning Agents">Cleaning Agents</option>
                                                <option value="Utensils/Equipments">Utensils/Equipments</option>
                                            </select>
                                        </div>
                                        <div className='col-sm-6'>
                                            <label className='form-label'>Item Name</label>
                                            <input type='text' className='form-control' value={formData.itemName} onChange={e => setFormData({...formData,itemName: e.target.value})} />
                                        </div>
                                        <div className='col-sm-6'>
                                            <label className='form-label'>Unit Name</label>
                                            <select className='form-select' value={formData.unitName} onChange={e => setFormData({...formData,unitName: e.target.value})}>
                                                <option value="kg">Kg</option>
                                                <option value="Units">Units</option>
                                            </select>
                                        </div>
                                    </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={() => addItem()}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </>
  )
}

export default Items