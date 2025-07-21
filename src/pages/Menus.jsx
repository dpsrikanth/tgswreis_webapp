import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef, use } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Menus = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [menuList, setMenuList] = useState([]);
    const [showExampleModal1, setShowExampleModal1] = useState(false);
    const mealTypes = ["BreakFast","Break", "Lunch", "EveningSnacks", "Dinner"];
    const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMealItems, setSelectedMealItems] = useState([]);
    const [menuDate, setMenuDate] = useState(null);
    const [masterMenuId, setMasterMenuId] = useState(null);
    const originalCheckedIdsRef = useRef([]);

    const fetchMenuList = async () => {
        _fetch("menu", null, false, token).then(res => {
            if (res.status === "success") {
                setMenuList(res.data);
                //toast.success("Menu list fetched successfully.");
            } else {
                toast.info("Failed to fetch menu list.");
            }
        }).catch(err => {
            //console.error("Error fetching menu list:", err);
            toast.error("An error occurred while fetching menu list.");
        });
    }
    const getmenuitemsbydayoftheweek = async (mealtypeid) => {
        console.log("Fetching menu items for Meal Type ID:", mealtypeid);
        if (!mealtypeid) {
            toast.error("Meal Type ID is required to fetch menu items.");
            return [];
        }
        try {
            const res = await _fetch('menuitemsbytype', null, false, token, "$mealtypeid$", mealtypeid);
            if (res.status === "success") {
                return res.data;
            } else {
                toast.error("Failed to fetch menu items for the selected day.");
                return [];
            }
        } catch (err) {
            console.error("Error fetching menu items:", err);
            toast.error("An error occurred while fetching menu items.");
            return [];
        }
    }
    useEffect(() => {
        if (!dataFetched.current) {
            dataFetched.current = true;
            fetchMenuList();
        }
    }, []);
    const handleUpdateClick = async (day, mealItems, mealTypeId, menuDate, masterMenuId) => {
        setSelectedDay(day);
        const items = await getmenuitemsbydayoftheweek(mealItems[0]?.MealTypeId);
        // Mark Checked=true if item is present in the meal's items
        const checkedItems = items.map(item => ({
            ...item,
            Checked: (mealItems || []).some(meal => meal.FoodItemId === item.FoodItemId)
        }));
        // Store original checked FoodItemIds
        originalCheckedIdsRef.current = (mealItems || []).map(meal => meal.FoodItemId);
        setMasterMenuId(masterMenuId);
        setMenuDate(menuDate);
        setSelectedMealItems(checkedItems);
        setShowExampleModal1(true);
    };
     const handleSubmit = () => {
        const updatedItems = selectedMealItems.filter(item => item.Checked);
        if (updatedItems.length === 0) {
            toast.error("Please select at least one item to update.");
            return;
        }
        // Only show as removed those that were originally checked but are now unchecked
        const removedItems = selectedMealItems.filter(item =>
            !item.Checked && originalCheckedIdsRef.current.includes(item.FoodItemId)
        );
        // Only show as newly added those that are now checked but were not checked before
        const newlyAddedItems = selectedMealItems.filter(item =>
            item.Checked && !originalCheckedIdsRef.current.includes(item.FoodItemId)
        );
        if (removedItems.length > 0) {
            toast.info("Some items were removed from the selection.");
        }
        if (newlyAddedItems.length === 0) {
            toast.info("No new items were added.");
        }
        // Here you can handle the submission of only newlyAddedItems
        // console.log("Newly added items:", newlyAddedItems);
        // console.log("Selected mealTypeId:", selectedMealType);
        // console.log("removed items:", removedItems);
        // console.log("Selected Day:", menuDate);
        // console.log("Master Menu ID:", masterMenuId);
        // Perform the update operation with newlyAddedItems only
    }
    const handleCheckboxChange = (foodItemId) => {
        setSelectedMealItems(prev =>
            prev.map(item =>
                item.FoodItemId === foodItemId ? { ...item, Checked: !item.Checked } : item
            )
        );
    };
    return (
        <>
            <ToastContainer />
            <h6 className="fw-bold mb-3"><a onClick={() => { navigate("/tsmess") }}><i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i></a> Daily Menu</h6>
            <div className="row">
                <div className="col-sm-12 text-end">
                    {UserType === 'SuperAdmin' ? (<button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalAdd">Add New Menu Item</button>) : (<span></span>)}  
                </div>
                <div className="tabs">
                    {mealTypes.map(type => (
                        <div
                            key={type}
                            className={selectedMealType === type ? "active-tab" : ""}
                            style={{ cursor: 'pointer', display: 'inline-block', marginRight: 10 }}
                            onClick={() => {console.log(type);setSelectedMealType(type)}}
                        >
                            {type}
                        </div>
                    ))}
                </div>
                <h2>Week - 1</h2>
                <div className="text-end" style={{ marginBottom: "8px" }}>
                    <img src="img/print_icon.png" style={{ marginRight: "8px", cursor: "pointer" }} />
                    <img src="img/download_icon.png" className="download_img" style={{ cursor: "pointer" }} />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Menu</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuList && menuList["Week 1"] && Object.entries(menuList["Week 1"]).map(([day, meals]) => {
                            // Compare MenuDate to today
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const menuDate = meals.MenuDate ? new Date(meals.MenuDate) : null;
                            if (menuDate) menuDate.setHours(0,0,0,0);
                            const isPastOrToday = menuDate && menuDate <= today;
                            return (
                                <tr key={day}>
                                    <td>{day}</td>
                                    <td>{meals.MenuDate}</td>
                                    <td className="text-start">
                                        {meals[selectedMealType] && (
                                            <ul style={{ marginBottom: 0 }}>
                                                {[...new Set(meals[selectedMealType].map(item => item.FoodItemName))].map((name, i) => (
                                                    <li key={i}>{name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                    <td>
                                        {UserType === 'SuperAdmin' ? (<label
                                            className={`modalpopup att_rate${isPastOrToday ? ' disabled' : ''}`}
                                            style={{ cursor: isPastOrToday ? 'not-allowed' : 'pointer', color: isPastOrToday ? '#aaa' : undefined }}
                                            onClick={() => {
                                                if (!isPastOrToday) handleUpdateClick(day, meals[selectedMealType], meals[selectedMealType]?.[0]?.MealTypeId, meals.MenuDate, meals.MasterMenuId);
                                            }}
                                            disabled={isPastOrToday}
                                        >
                                            Update
                                        </label>) : (<span></span>)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showExampleModal1 && selectedDay && (
                <div className="modal" id="exampleModal1" tabIndex={-1} aria-labelledby="exampleModalLabel" style={{ display: 'block' }} aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                    Menu - {selectedDay}
                                </h1>
                                <button type="button" className="btn-close" onClick={() => setShowExampleModal1(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        {selectedMealItems.map((item, index) => (
                                            <div className="col-md-4" key={index}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`item-${item.FoodItemId}-${index}`}
                                                        checked={!!item.Checked}
                                                        onChange={() => handleCheckboxChange(item.FoodItemId)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`item-${item.FoodItemId}-${index}`}>
                                                        {item.FoodItemName}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowExampleModal1(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Menus;