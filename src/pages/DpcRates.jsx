import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Select from 'react-select';
const DpcRates = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [dpcrates, setDpcRates] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalPrice, setModalPrice] = useState("");
    const [districts, setDistricts] = useState(useSelector((state) => state.userappdetails.DISTRICT_LIST) || []);
    const schoolList = useSelector((state) => state.userappdetails.SCHOOL_LIST);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [schoolsByDistrict, setSchoolsByDistrict] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    //console.log(districts);
    const columns = [
        {
            name: 'Sl. No',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'School Code',
            selector: row => row.SchoolCode,
            sortable: true,
        }, ,
        {
            name: 'Item Name',
            selector: row => row.IngredientName,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.Price,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.CategoryName,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.BaseQtyCount + row.UnitName,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row =>
            (UserType !== 'SuperAdmin' ? (<span></span>) : (
                <button
                    className="update-btn"
                    onClick={() => {
                        setSelectedRow(row);
                        setModalPrice(row.Price);
                        setShowModal(true);
                    }}
                >Update</button>
            ))
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    useEffect(() => {
        if (selectedSchool) {
            const filter = dpcrates.filter(item => item.SchoolCode === selectedSchool);
            setFilteredData(filter);
        }
        else if (searchText.length > 0) {
            const filteredData1 = Array.isArray(dpcrates)
                ? dpcrates.filter(item =>
                    item.IngredientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.CategoryName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.SchoolCode?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.SchoolCode === selectedSchool
                )
                : [];
            setFilteredData(filteredData1);
        }
        else if(selectedSchool && searchText.length === 0)
        {
             const filter = dpcrates.filter(item => item.SchoolCode === selectedSchool);
              const filteredData1 = Array.isArray(filter)
                ? filter.filter(item =>
                    item.IngredientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.CategoryName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.SchoolCode?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.SchoolCode === selectedSchool
                )``
                : [];
        }
        else {
            setFilteredData(dpcrates);
        }
    }, [searchText, selectedSchool]);

    const fetchDPCList = async () => {
        _fetch("dpcrates", null, false, token).then(res => {
            if (res.status === "success") {
                setDpcRates(res.data);
                setFilteredData(res.data);
                console.log("DPC Rates List fetched successfully:", res.data);
                //toast.success("DPC rates fetched successfully.");
            } else {
                toast.info("Failed to fetch DPC rates.");
            }
        }).catch(err => {
            console.error("Error fetching DPC rates:", err);
            toast.error("An error occurred while fetching DPC rates.");
        });
    }

    useMemo(() => {
        if (!dataFetched.current) {
            dataFetched.current = true;
            fetchDPCList();
        }
    }, []);
    const updateDPCPrice = async () => {
        if (selectedRow && modalPrice) {
            const payload = {
                MasterIngredientId: selectedRow.MasterIngredientId,
                Price: modalPrice,
                SchoolCode: selectedRow.SchoolCode
            };
            _fetch("dpcratesupdate", payload, false, token, "", "").then(res => {
                if (res.status === "success") {
                    toast.success("DPC Rate updated successfully.");
                    setShowModal(false);
                    fetchDPCList(); // Refresh the list after update
                    setSelectedRow(null);
                    setModalPrice("");
                } else {
                    toast.error("Failed to update DPC Rate.");
                }
            }).catch(err => {
                console.error("Error updating DPC Rate:", err);
                toast.error("An error occurred while updating DPC Rate.");
            });
        } else {
            toast.error("Please enter a valid price.");
        }
    }

    useEffect(() => {
        //bind district to the options
        const districtOptions = districts.map(district => ({
            value: district.DistrictId,
            label: district.DistrictName
        }));
        setDistricts(districtOptions);
    }, []);


    useEffect(() => {
        if (selectedDistrict) {
            const filteredSchools = schoolList.filter(school => school.DistrictId === selectedDistrict);
            const schoolOptions = filteredSchools.map(school => ({
                value: school.SchoolCode,
                label: school.PartnerName
            }));
            setSchoolsByDistrict(schoolOptions);
        }
    }, [selectedDistrict]);
    return (
        <>
            <ToastContainer />
            <h6 className="fw-bold mb-3">
                <a onClick={() => { navigate("/tsmess") }} style={{ cursor: "pointer" }}>
                    <i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i>
                </a> Rates Chart
            </h6>
            <div className="row mb-3">
                <div className="col-sm-6">
                    <div className="row">
                        <label className="col-sm-4 col-form-label">Select District</label>
                        <div className="col-sm-8"><Select
                            options={Array.isArray(districts) ? [{ value: '', label: 'All' }, ...districts] : [{ value: '', label: 'All' }]}
                            isClearable={true}
                            isSearchable={true}
                            placeholder="Select District"
                            value={districts.find(opt => opt.value === selectedDistrict) || null}
                            onChange={option => {
                                const value = option ? option.value : '';
                                setSelectedDistrict(value);
                                const label = option ? option.label : '';
                                setSelectedSchool('');
                            }}
                        /></div>
                    </div>

                </div>
                <div className="col-sm-6">
                    <div className="row">
                        <label className="col-sm-4 col-form-label">Select School</label>
                        <div className="col-sm-8"> <Select
                            options={Array.isArray(schoolsByDistrict) ? [{ value: '', label: 'All' }, ...schoolsByDistrict] : [{ value: '', label: 'All' }]}
                            isClearable={true}
                            isSearchable={true}
                            placeholder="Select School"
                            value={schoolsByDistrict.find(opt => opt.value === selectedSchool) || null}
                            onChange={option => {
                                //console.log('Option received:', option); // Debug what's received
                                const value = option ? option.value : '';
                                //console.log('Selected school value:', value, option); // Debug the extracted value
                                setSelectedSchool(value);

                                // Also log the current schoolsByDistrict to verify options
                                //console.log('Available schools:', schoolsByDistrict);
                            }}
                        /> </div>
                    </div>

                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by item or category..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            <div className="row">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                    persistTableHead
                    noDataComponent={<span>No data available</span>}
                    defaultSortFieldId={2}
                />
            </div>
            {/* Modal Dialog */}
            {showModal && selectedRow && (
                <div className="modal fade show" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">
                                    DPC Rate - {selectedRow.IngredientName} ({selectedRow.BaseQtyCount}{selectedRow.UnitName})
                                </h1>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label className="form-label">Price</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={modalPrice}
                                                onChange={e => setModalPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={updateDPCPrice}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DpcRates;