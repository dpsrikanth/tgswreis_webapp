import React, { useEffect,useRef,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";




const FoodItemIngredientMapping = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const navigate = useNavigate();
const dataFetched = useRef(false);
const currentFoodItemId = useRef('');
const [foodItems,setFoodItems] = useState([]);
const [selectedFoodItemId,setSelectedFoodItemId] = useState('');
const [ingredients,setIngredients] = useState([]);
const [ingredientsList,setIngredientsList] = useState([]);
const [selectedIngredientName,setSelectedIngredientName] = useState('');
const [selectedUnitName,setSelectedUnitName] = useState('');
const [selectedQuantity,setSelectedQuantity] = useState('');


const fetchFoodItems = async () => {

    _fetch('fetchfooditems',null,false,token).then(res => {
        if(res.status === 'success') {
            setFoodItems(res.data);
            toast.success(res.message);
        } else {
            toast.error(res.message)
        }
    }).catch(err => {
        console.error('Error Fetching Food Items List',err);
        toast.error('Failed to Fetch Food Items List')
    })

}


const fetchIngredients = async(foodItemId) => {
      //console.log('Fetching ingredients for FoodItemId:', foodItemId);
       //console.log('Current selectedFoodItemId state:', selectedFoodItemId);
      //console.log('About to call _fetch with foodItemId:', foodItemId);
     
    _fetch('fetchIngredients',null,false,token,':FoodItemId',foodItemId).then(res => {
        if(res.status === 'success') {
            setIngredients(res.data);
            //console.log(res.data)
            //console.log(ingredients);
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        console.error('Error Fetching Ingredients mapped to Selected FoodItem',err);
        toast.error('Failed to Fetch Ingredients mapped to Selected FoodItem')
    })
}


const fetchIngredientsList = async () => {
    _fetch('fetchIngredientsList',null,false,token,).then(res => {
        if(res.status === 'success') {
            setIngredientsList(res.data);

        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        console.error('Error fetching Ingredients List',err);
        toast.error('Failed to fetch Ingredients List')
    })
}

 const handleInputChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };


  const handleUpdate = async (ingredient) => {
    const payload = {
        MasterIngredientId : ingredient.MasterIngredientId,
        Quantity: ingredient.Quantity,
        UnitName: ingredient.UnitName
    }


 const foodItemId = ingredient.FoodItemId || currentFoodItemId.current || selectedFoodItemId;

    _fetch("handleUpdate",payload,false,token,':FoodItemId',foodItemId).then(res => {
        if(res.status === 'success'){
            toast.success(res.message)
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
         console.error('Error Updating Ingredient',err);
        toast.error('Error Updating Ingredient');
    })
  }


useEffect(() => {
if(!token) {
    navigate('/login');
}

if(!dataFetched.current) {
    dataFetched.current = true;
    fetchFoodItems();
    fetchIngredientsList();
}

},[token])









  return (
    <>
    <ToastContainer />
    <div className="row g-3 mb-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
             

                <div className="row">
                    <div className='col-sm-12 table-header'>
                       <h5><span className='pink fw-bold'>Food Item Ingredients Mapping</span></h5> 
                        </div>
                        
                        <div className="col-sm-6">
                            <label className="form-label">Select Food Item</label>
                            <select className="form-select" value={selectedFoodItemId} onChange={(e) => {
                                const id = e.target.value;
                                 setSelectedFoodItemId(id);
                                 currentFoodItemId.current = id;
                                setIngredients([]);
                                if(id) {
                                fetchIngredients(id);   
                                }
                                   
                            }}>
                             {foodItems &&   
                                 foodItems.map(option => (
                                   <option key={option.FoodItemId} value={option.FoodItemId}>{option.FoodItemName}</option>
                                 ))
                               }   
                            </select>
                        </div>

                       
                    </div>

                    <hr/>
                   
                   {UserType === 'SuperAdmin' ? ( <div className="row gy-3 py-3">
                        <div className="col-sm-6">
                            <label className="form-label">Ingredient Name</label>
                            <select className="form-select" value={selectedIngredientName} onChange={(e) => setSelectedIngredientName(e.target.value)}>
                                {ingredientsList.map((ingredient) => (
                                    <option value={ingredient.IngredientName}>{ingredient.IngredientName}</option>
                                ))} 
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Quantity</label>
                            <input type="text" className="form-control" value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)} />
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">UnitName</label>
                            <select className="form-select" value={selectedUnitName} onChange={(e) => selectedUnitName(e.target.value)}>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="units">units</option>
                            </select>
                        </div>

                        <div className="col-sm-12 text-center pt-3">
                            <button className="btn btn-primary">Add</button>
                            <button className="btn btn-secondary ms-3">Clear</button>
                        </div>
                    </div>) : (<span></span>)}
                   

                <div className="table-header pt-3">
                    <h5><span className="pink fw-bold">List of Mapped Ingredients</span></h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Food Item Name</th>
                                <th>Ingredient Name</th>
                                <th>Quantity</th>
                                <th>Unit Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                          
                           {Array.isArray(ingredients) && ingredients.length > 0 ? (
                                ingredients.map((ingredient,index) => (
                                 <tr key={ingredient.MasterIngredientId}>
                                    <td>
                                        {ingredient.FoodItemName}
                                    </td>
                                    <td>{ingredient.IngredientName}</td>
                                    <td>
                                        <input type='text' className='form-control' value={ingredient.Quantity}
                                        onChange={(e) => handleInputChange(index,'Quantity',e.target.value)}
                                        />
                                    </td>
                                    
                                    <td>
                                        <input type='text' className='form-control' value={ingredient.UnitName}
                                        onChange={(e) => handleInputChange(index,'UnitName',e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        {UserType === 'SuperAdmin' ? (
                                            <>
                                            <button className='btn btn-primary' onClick={() => handleUpdate(ingredient)}>Update</button>
                                        <button className='btn btn-danger ms-3'>Delete</button>
                                        </>
                                        ) : (<span></span>)}
                                        
                                    </td>
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
    </>
  )
}

export default FoodItemIngredientMapping