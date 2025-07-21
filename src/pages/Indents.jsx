import React,{ useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import DataTable from 'react-data-table-component';

const Indents = () => {

    const token = useSelector((state) => state.userappdetails.TOKEN);
    const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId);
    const navigate = useNavigate();
    const dataFetched = useRef(false);
    const [indents,setIndents] = useState([]);
   const queryPayload = ZoneId !== 0 ? {ZoneId} : null;
    const fetchIndents = async () => {
        _fetch("fetchindents",queryPayload,false,token).then(res => {
            if(res.status === 'success') {
                setIndents(res.data);
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
             console.error("Error fetching Indents list:", err);
             toast.error("Failed to fetch Indents list.");
        })
    };

    useEffect(() => {
        if(!dataFetched.current) {
            dataFetched.current = true;
            fetchIndents();
        }
    },[])

    const columns = [
        {
            name: 'IndentID',
            selector: row => row.IndentId,
            width: '100px',
            sortable: true
        },
        {
            name: 'School Code',
            selector: row => row.SchoolCode,
            sortable:true
        },
        {
            name: 'School Name',
            selector: row => row.PartnerName,
            sortable: true
        },
        {
            name: 'Item Name',
            selector: row => row.IngredientName,
            sortable: true
        },
        {
            name: 'Unit Name',
            selector: row => row.UnitName,
            width: '100px',
            sortable: false
        },
        {
            name: 'Available Quantity',
            selector: row => row.AvailQty,
            sortable: false
        },
        {
             name: 'Suggestion Quantity',
            selector: row => row.SuggestionQty,
            sortable: false
        },
         {
             name: 'Requested Quantity',
            selector: row => row.RequestedQty,
            sortable: false
        },
         {
             name: 'Remarks',
            selector: row => row.Remarks,
            sortable: false
        }
    ]




  return (
    <>
     <div className="row g-3 mb-3">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Indents Raised</span></h5>
                    <div className="table-tools">
                        {/* <input type="text" className="form-control" placeholder="Search..." />
                         <select className="form-select">
                            <option>Zone-1</option>
                            <option>Zone-2</option>
                            <option>Zone-3</option>
                          </select> 
                          <select className="form-select">
                            <option>District-1</option>
                            <option>District-2</option>
                            <option>District-3</option>
                          </select>
                        <select className="form-select">
                          <option>Pending</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                        </select> */}
                        <img src="img/print_icon.png" />
                    <img src="img/download_icon.png" className="download_img" />
                      </div>
                </div>
                  <DataTable 
                
                columns={columns}
                data={indents}
                pagination
                striped
                persistTableHead
                noDataComponent={<span>No data available</span>}
                highlightOnHover
                dense 
                />
                {/* <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Indent ID</th>
                                <th>School Code</th>
                                <th>School Name</th>
                                <th>Item Name</th>
                                <th>Unit Name</th>
                                <th>Available Quantity</th>
                                <th>Suggestion Quantity</th>
                                <th>Requested Quantity</th>
                                <th>Remarks</th>
                               
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {Array.isArray(indents) && indents.length > 0 ? (
                                indents.map((indent,index) => (
                                 <tr key={indent.IndentId}>
                                    <td>
                                        {indent.IndentId}
                                    </td>
                                    <td>{indent.SchoolCode}</td>
                                    <td>{indent.PartnerName}</td>
                                    <td>{indent.IngredientName}</td>
                                    <td>{indent.UnitName}</td>
                                    <td>{indent.AvailQty}</td>
                                    <td>{indent.SuggestionQty}</td>
                                    <td>{indent.RequestedQty}</td>
                                    <td>{indent.Remarks}</td>
                          
                                 </tr>
                                ))
                            ):(
                                 <tr>
                                            <td colSpan={3} className="text-center text-muted">No data available</td>
                                        </tr>
                            )}
                         
                        </tbody>
                    </table>
                </div> */}
            </div>
        </div>
      </div>
    </>
  )
}

export default Indents