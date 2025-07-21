import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

const Vendors = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
    const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [vendorlist, setVendorList] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [dpcrates, setDpcRates] = useState([]);
    const [mapItemsList, setMapItemsList] = useState([]);
    // State for Map Items modal
    const [showMapItemsModal, setShowMapItemsModal] = useState(false);
    const [mapItemsChecked, setMapItemsChecked] = useState({});
    const [mapItemsVendor, setMapItemsVendor] = useState(null);
    const [mapItemsSearch, setMapItemsSearch] = useState("");
    const [vendorFormErrors, setVendorFormErrors] = useState({});

    const fetchDPCList = async () => {
        _fetch("dpcrates", null, false, token).then(res => {
            if (res.status === "success") {
                setDpcRates(res.data);
                // Map DPC items to id/label and store in state
                const items = res.data.map(item => ({ id: item.MasterIngredientId, label: item.IngredientName, price: item.Price }));
                setMapItemsList(items);
                //toast.success("DPC rates fetched successfully.");
            } else {
                toast.info("Failed to fetch DPC rates.");
            }
        }).catch(err => {
            console.error("Error fetching DPC rates:", err);
            toast.error("An error occurred while fetching DPC rates.");
        });
    }
    const fetchVendorList = async () => {
        _fetch("vendors", null, false, token).then(res => {
            if (res.status === "success") {
                setVendorList(res.data);
                //console.log("Vendor List fetched successfully:", res.data);
                //toast.success("Vendor list fetched successfully.");
            } else {
                toast.info("Failed to fetch vendor list.");
            }
        }).catch(err => {
            console.error("Error fetching vendor list:", err);
            toast.error("An error occurred while fetching vendor list.");
        });
    }
    useEffect(() => {
        if (!dataFetched.current) {
            dataFetched.current = true;
            fetchVendorList();
            fetchDPCList();
        }
    }, []);

    // DataTable columns
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            width: '60px',
            sortable: false,
        },
        {
            name: 'Vendor Name',
            selector: row => row.VendorName,
            sortable: true,
        },            
        {
            name: 'City',
            selector: row => row.VendorLocationCity,    
            sortable: true,
        },
        {
            name: "GSTNumber",
            selector: row => row.VendorGSTNumber,
            sortable: true,
        },
        {
            name: 'Bank AccountNo',
            selector: row => row.VendorBankAccountNo,
            sortable: true,
        },
        {
            name: 'Branch',
            selector: row => row.VendorBankBranch,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => 
            (UserType === 'SuperAdmin' ? ( <div className="icon-container">
                    <i
                        className="bi bi-pencil-square"
                        style={{ cursor: "pointer", color: "var(--primary-purple)" }}
                        onClick={() => {
                            setSelectedVendor(row);
                            setShowModal(true);
                        }}
                    ></i>
                    <i
                        className="bi bi-link text-primary"
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => {
                            setSelectedVendor(row);
                            handleOpenMapItemsModal(row);
                        }}
                    ></i>
                </div>) : (<span></span>))
                ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // Filtered data for search (remove SchoolName, SchoolCode, VendorLocationZone from search)
    const filteredData = vendorlist.filter(item => {
        if (!filterText) return true;
        const search = filterText.toLowerCase();
        return (

            (item.VendorLocationZone && item.VendorLocationZone.toLowerCase().includes(search)) ||
            (item.VendorName && item.VendorName.toLowerCase().includes(search)) ||
            (item.VendorAddress && item.VendorAddress.toLowerCase().includes(search)) ||
            (item.VendorContact && item.VendorContact.toLowerCase().includes(search)) ||
            (item.ItemsSupply && item.ItemsSupply.toLowerCase().includes(search))
        );
    });

    const handleDownloadXLS = () => {
        // Export all columns, even if not shown in the table
        const exportData = filteredData.map((row, idx) => ({
            '#': idx + 1,
            'Vendor Name': row.VendorName || '',
            'Contact No.': row.VendorContact || '',
            'Account Type': row.VendorAcType || '',
            'Address': row.VendorAddress || '',
            'Pin Code': row.VendorPinCode || '',
            'Zone': row.VendorLocationZone || '',
            'Bank Account': row.VendorBankAccountNo || '',
            'Branch': row.VendorBankBranch || '',
            'City': row.VendorLocationCity || '',
            'GST Number': row.VendorGSTNumber || '',
            'PAN Number': row.VendorPANNumber || '',
            'TIN Number': row.VendorTINNumber || '',
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
        XLSX.writeFile(workbook, 'vendors.xlsx');
    };

    const handlePrint = () => {
        // Create a new window for printing
        const printWindow = window.open('', '', 'width=900,height=700');
        const tableHeaders = [
            '#',
            'Vendor Name',
            'Account Type',
            'Address',
            'Pin Code',
            'Contact No.',
            'Zone',
            'Items Supply',
        ];
        let html = `<html><head><title>Vendors List</title>`;
        html += `<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background: #f5f5f5; }</style>`;
        html += `</head><body>`;
        html += `<h2>Vendors List</h2>`;
        html += `<table><thead><tr>`;
        tableHeaders.forEach(h => { html += `<th>${h}</th>`; });
        html += `</tr></thead><tbody>`;
        filteredData.forEach((row, idx) => {
            html += `<tr>`;
            html += `<td>${idx + 1}</td>`;
            html += `<td>${row.VendorName || ''}</td>`;
            html += `<td>${row.VendorAcType || ''}</td>`;
            html += `<td>${row.VendorAddress || ''}</td>`;
            html += `<td>${row.VendorPinCode || ''}</td>`;
            html += `<td>${row.VendorContact || ''}</td>`;
            html += `<td>${row.VendorLocationZone || ''}</td>`;
            html += `</tr>`;
        });
        html += `</tbody></table></body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        // Optionally, close the window after printing
        // printWindow.close();
    };

    const handleMapItemsChange = (id) => {
        setMapItemsChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenMapItemsModal = (vendor) => {
        setMapItemsVendor(vendor);
        setShowMapItemsModal(true);
        //get vendor mapped items
        dataFetched.current = false; // Reset data fetch flag to refetch items
        //console.log("Fetching vendor mapped items for:", vendor.VendorId);
        _fetch(`vendoritemmapping`, null, false, token,'$vendorId$',vendor.VendorId).then(res => {            
            // Map items to checked state
            if(res.status !== "success") {
                return toast.info(res.message || "No items mapped to this vendor.");
            }
            res.data.forEach(item => {
                item.MasterIngredientId && setMapItemsChecked((prev) => ({ ...prev, [item.MasterIngredientId]: true }));
            });            
            dataFetched.current = true; // Set flag to true after fetching
        }).catch(err => {
            console.error("Error fetching vendor mapped items:", err);
            toast.error("An error occurred while fetching vendor mapped items.");
        });
        setMapItemsChecked({}); // Optionally reset or load vendor's mapped items
    };

    const handleCloseMapItemsModal = () => {
        setShowMapItemsModal(false);
        setMapItemsVendor(null);
    };

   
    // Helper: Validate and prepare vendor update payload
    const validateAndPrepareVendorPayload = (vendor, showAllErrors = false) => {
        const errors = {};
        const payload = { ...vendor };
        // All fields mandatory
        if (!payload.VendorAcType || payload.VendorAcType.trim() === "") {
            errors.VendorAcType = "Account type is required";
        }
        if (!payload.VendorType || payload.VendorType.trim() === "") {
            errors.VendorType = "Vendor type is required";
        }
        if (!payload.VendorName || payload.VendorName.trim() === "") {
            errors.VendorName = "Vendor name is required";
        }
        if (!payload.VendorLocationCity || payload.VendorLocationCity.trim() === "") {
            errors.VendorLocationCity = "City is required";
        }
        if (!payload.VendorPinCode || payload.VendorPinCode.trim() === "") {
            errors.VendorPinCode = "Postal code is required";
        }
        if (!payload.VendorPANNumber || payload.VendorPANNumber.trim() === "") {
            errors.VendorPANNumber = "PAN number is required";
        }
        if (!payload.VendorTINNumber || payload.VendorTINNumber.trim() === "") {
            errors.VendorTINNumber = "TIN number is required";
        }
        if (!payload.VendorGSTNumber || payload.VendorGSTNumber.trim() === "") {
            errors.VendorGSTNumber = "GST number is required";
        }
        if (!payload.VendorAddress || payload.VendorAddress.trim() === "") {
            errors.VendorAddress = "Supplier address is required";
        }
        if (!payload.VendorContact || payload.VendorContact.trim() === "") {
            errors.VendorContact = "Contact number is required";
        }
        if (!payload.VendorBankName || payload.VendorBankName.trim() === "") {
            errors.VendorBankName = "Vendor bank is required";
        }
        if (!payload.VendorBankBranch || payload.VendorBankBranch.trim() === "") {
            errors.VendorBankBranch = "Vendor bank branch is required";
        }
        // PAN validation: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
        if (payload.VendorPANNumber && !/^([A-Z]{5}[0-9]{4}[A-Z])$/i.test(payload.VendorPANNumber.trim())) {
            errors.VendorPANNumber = "Invalid PAN format (e.g., ABCDE1234F)";
        }
        // GST validation: 15 chars, 2 digits, 10 PAN, 1 letter, 1 digit, 1 letter (e.g., 22ABCDE1234F1Z5)
        if (payload.VendorGSTNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(payload.VendorGSTNumber.trim())) {
            errors.VendorGSTNumber = "Invalid GST format (e.g., 22ABCDE1234F1Z5)";
        }
        // TIN validation: 11 digits (common format, adjust as needed)
        if (payload.VendorTINNumber && !/^\d{11}$/.test(payload.VendorTINNumber.trim())) {
            errors.VendorTINNumber = "Invalid TIN format (11 digits)";
        }
        // Mobile number validation: 10 digits, starts with 6-9
        if (payload.VendorContact && !/^[6-9]\d{9}$/.test(payload.VendorContact.trim())) {
            errors.VendorContact = "Invalid mobile number (must be 10 digits, start with 6-9)";
        }
        if (showAllErrors) setVendorFormErrors(errors);
        return { isValid: Object.keys(errors).length === 0, errors, payload };
    };

    const handleVendorInputChange = (field, value) => {
        setSelectedVendor(prev => ({ ...prev, [field]: value }));
        // Validate this field only
        const { errors } = validateAndPrepareVendorPayload({ ...selectedVendor, [field]: value });
        setVendorFormErrors(errors);
    };
    //call this below function on submit button click
    // Function to update items to vendor
    const updateItemsToVendor = (e) => {
        e.preventDefault();
        //get newly checked items and removed items in separate arrays
        const items = Object.keys(mapItemsChecked)
            .filter(id => mapItemsChecked[id])
            .map(id => parseInt(id, 10)); // Convert to integer IDs
        if (items.length === 0) {
            toast.error("No items selected.");
            return;
        }
        //console.log("Selected items to map:", items);
        const vendorId = selectedVendor.VendorId;
        if (!vendorId) {
            toast.error("No vendor selected.");
            return;
        }
        debugger
        _fetch(`vendoritemmappingupdate`, { "items": items }, false, token, '$vendorId$', vendorId).then(res => {
            if (res.status === "success") {
                toast.success(res.message || "Items mapped to vendor successfully!");
                handleCloseMapItemsModal();
            } else {
                toast.info(res.message || "Failed to map items to vendor.");
            }
        }).catch(err => {
            console.error("Error mapping items to vendor:", err);
            toast.error("An error occurred while mapping items to vendor.");
        });
    };

    const handleVendorUpdate = () => {
        const { isValid, errors, payload } = validateAndPrepareVendorPayload(selectedVendor, true);
        if (!isValid) {
            Object.values(errors).forEach(msg => toast.error(msg));
            return;
        }
        // Ensure VendorId is included in the payload for API update
        payload.VendorId = selectedVendor.VendorId;
        _fetch("vendorupdate", payload, false, token, "$id$", selectedVendor.VendorId).then(res => {
            if (res.status === "success") {
                fetchVendorList(); // Refresh vendor list after update
                toast.success('Vendor updated successfully!');
                setShowModal(false);
                setSelectedVendor(null);
            } else {
                toast.info("Failed to update vendor.");
            }
        }).catch(err => {
            console.error("Error updating vendor:", err);
            toast.error("An error occurred while updating vendor.");
        });
    };

    return (
        <>
            <ToastContainer />
            <h6 className="fw-bold mb-3"><a onClick={() => { navigate("/tsmess") }}><i className="bi bi-arrow-left pe-2" style={{ fontSize: "24px", verticalAlign: "middle" }}></i></a> Vendor Manager</h6>
            <div className="row">
                <div className="text-end" style={{ marginBottom: "8px" }}>
                    <img src="img/print_icon.png" style={{ marginRight: "8px", cursor: "pointer" }} onClick={handlePrint} />
                    <img src="img/download_icon.png" className="download_img" style={{ cursor: "pointer" }} onClick={handleDownloadXLS} />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search vendors..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        style={{ maxWidth: 300, display: 'inline-block', marginRight: 10 }}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    striped
                    responsive
                    noDataComponent={<div className="text-center text-muted">No data available</div>}
                />
            </div>

            {showModal && selectedVendor && (
                <div className="modal fade show" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                    Vendor Details{selectedVendor.VendorName ? ` - ${selectedVendor.VendorName}` : ''}
                                </h1>
                                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setSelectedVendor(null); }} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <table className="vendors table table-striped">
                                        <tbody>
                                            <tr>
                                                <td>Account Type</td>
                                                <td>
                                                    <select
                                                        className="form-control"
                                                        value={selectedVendor.VendorAcType.toLowerCase() === 'individual' || selectedVendor.VendorAcType.toLowerCase() === 'firm' ? selectedVendor.VendorAcType : ''}
                                                        onChange={e => handleVendorInputChange('VendorAcType', e.target.value)}
                                                    >
                                                        <option value="">Select Account Type</option>
                                                        <option value="individual">Individual</option>
                                                        <option value="firm">Firm</option>
                                                    </select>
                                                    {vendorFormErrors.VendorAcType && <div className="text-danger small">{vendorFormErrors.VendorAcType}</div>}
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td>Supplier Type</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.SupplierType || ''} onChange={e => handleVendorInputChange('SupplierType', e.target.value)} />
                                                    {vendorFormErrors.SupplierType && <div className="text-danger small">{vendorFormErrors.SupplierType}</div>}
                                                </td>
                                            </tr> */}
                                            <tr>
                                                <td>Supplier name</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorName || ''} onChange={e => handleVendorInputChange('VendorName', e.target.value)} />
                                                    {vendorFormErrors.VendorName && <div className="text-danger small">{vendorFormErrors.VendorName}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>City</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorLocationCity || ''} onChange={e => handleVendorInputChange('VendorLocationCity', e.target.value)} />
                                                    {vendorFormErrors.VendorLocationCity && <div className="text-danger small">{vendorFormErrors.VendorLocationCity}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Postal Code</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorPinCode || ''} onChange={e => handleVendorInputChange('VendorPinCode', e.target.value)} />
                                                    {vendorFormErrors.VendorPinCode && <div className="text-danger small">{vendorFormErrors.VendorPinCode}</div>}
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td>Supplier aadhaar number</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.SupplierAadhar || ''} onChange={e => handleVendorInputChange('SupplierAadhar', e.target.value)} />
                                                    {vendorFormErrors.SupplierAadhar && <div className="text-danger small">{vendorFormErrors.SupplierAadhar}</div>}
                                                </td>
                                            </tr> */}
                                            <tr>
                                                <td>PAN NUMBER</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorPANNumber || ''} onChange={e => handleVendorInputChange('VendorPANNumber', e.target.value)} />
                                                    {vendorFormErrors.VendorPANNumber && <div className="text-danger small">{vendorFormErrors.VendorPANNumber}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tin number</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorTINNumber || ''} onChange={e => handleVendorInputChange('VendorTINNumber', e.target.value)} />
                                                    {vendorFormErrors.VendorTINNumber && <div className="text-danger small">{vendorFormErrors.VendorTINNumber}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>GST NUMBER</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorGSTNumber || ''} onChange={e => handleVendorInputChange('VendorGSTNumber', e.target.value)} />
                                                    {vendorFormErrors.VendorGSTNumber && <div className="text-danger small">{vendorFormErrors.VendorGSTNumber}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Supplier address</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorAddress || ''} onChange={e => handleVendorInputChange('VendorAddress', e.target.value)} />
                                                    {vendorFormErrors.VendorAddress && <div className="text-danger small">{vendorFormErrors.VendorAddress}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Supplier contact number</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorContact || ''} onChange={e => handleVendorInputChange('VendorContact', e.target.value)} />
                                                    {vendorFormErrors.VendorContact && <div className="text-danger small">{vendorFormErrors.VendorContact}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Supplier bank</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorBankName || ''} onChange={e => handleVendorInputChange('VendorBankName', e.target.value)} />
                                                    {vendorFormErrors.VendorBankName && <div className="text-danger small">{vendorFormErrors.VendorBankName}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Supplier Account number</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorBankAccountNo || ''} onChange={e => handleVendorInputChange('VendorBankAccountNo', e.target.value)} />
                                                    {vendorFormErrors.VendorBankAccountNo && <div className="text-danger small">{vendorFormErrors.VendorBankAccountNo}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Branch IFSC Code</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorBankIFSC || ''} onChange={e => handleVendorInputChange('VendorBankIFSC', e.target.value)} />
                                                    {vendorFormErrors.VendorBankIFSC && <div className="text-danger small">{vendorFormErrors.VendorBankIFSC}</div>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Supplier ID Card Number</td>
                                                <td>
                                                    <input type="text" className="form-control" value={selectedVendor.VendorIDCardNumer || ''} onChange={e => handleVendorInputChange('VendorIDCardNumer', e.target.value)} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setSelectedVendor(null); }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleVendorUpdate}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Items Modal (React-compliant) */}
            {showMapItemsModal && mapItemsVendor && (
                <div className="modal fade show" tabIndex={-1} aria-modal="true" role="dialog" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Map Items for {mapItemsVendor.VendorName}</h1>
                                <button type="button" className="btn-close" onClick={handleCloseMapItemsModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search items..."
                                                value={mapItemsSearch}
                                                onChange={e => setMapItemsSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {[0, 1, 2].map(col => {
                                            // Filter items by search text before slicing for columns
                                            const filteredItems = mapItemsList.filter(item =>
                                                item.label.toLowerCase().includes(mapItemsSearch.toLowerCase())
                                            );
                                            return (
                                                <div className="col-md-4" key={col}>
                                                    {filteredItems.slice(col * 7, (col + 1) * 7).map(item => (
                                                        <div className="form-check" key={item.id}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={item.id}
                                                                checked={!!mapItemsChecked[item.id]}
                                                                onChange={() => handleMapItemsChange(item.id)}
                                                            />
                                                            <label className="form-check-label" htmlFor={item.id} title={`Price: ₹${item.price}`}>{item.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseMapItemsModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={updateItemsToVendor}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Vendors;