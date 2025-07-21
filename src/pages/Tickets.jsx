import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { data, useNavigate } from 'react-router-dom';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import DataTable from 'react-data-table-component';

const Tickets = () => {
  const token = useSelector((state) => state.userappdetails.TOKEN);
  const userid = useSelector((state) => state.userappdetails.profileData.Id)
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const navigate = useNavigate();
  const dataFetched = useRef(false);
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ApprovedStatus, setApprovedStatus] = useState('');
  const [ApprovedFromDate, setApprovedFromDate] = useState('');
  const [ApprovedToDate, setApprovedToDate] = useState('');
  const [ApprovedReason, setApprovedReason] = useState('');
  const [showModalpdf, setShowModalpdf] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const queryData = ZoneId !== 0 ? { ZoneId } : null;

  const fetchTickets = async () => {
    _fetch('fetchtickets', queryData, false, token).then(res => {
      if (res.status === 'success') {
        setTickets(res.data);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }).catch(err => {
      console.error("Error fetching tickets list:", err);
      toast.error("Failed to fetch tickets list.");
    })
  };

  useEffect(() => {
    if (!dataFetched.current) {
      dataFetched.current = true;
      fetchTickets();
    }

  }, [])

  useEffect(() => {
    if (selectedTicket) {
      setApprovedFromDate(selectedTicket.RequestFromDate.slice(0, 10));
      setApprovedToDate(selectedTicket.RequestToDate.slice(0, 10));
    }
  }, [selectedTicket])


  const processTicket = async (ticketid) => {

    if(!ApprovedStatus) {
    alert('Please Select Approved or Rejected');
    return;
  }

    _fetch('processTicket', { TicketId: ticketid, ApprovedStatus, ApprovedFromDate, ApprovedToDate, ApprovedReason, ApprovedBy: userid, ApprovedOn: new Date().toISOString() }, false, token).then(res => {
      if (res.status === 'success') {
        toast.success(res.message);
        setShowModal(false);
        fetchTickets();
      }
      else {
        toast.error(res.message);
      }
    }).catch(err => {
      console.error('Error Updating Ticket Status:', err);
      toast.error("Failed to update ticket status.");
    })
  }

  const columns = [
    {
      name: 'Ticket ID',
      selector: row => row.TicketId,
      width: '100px',
      sortable: true,
    },
    {
      name: 'ZoneID',
      selector: row => row.ZoneName,
      width: '90px',
      sortable: true
    },
    {
      name: 'SchoolCode',
      selector: row => row.SchoolCode,
      width: '120px',
      sortable: true
    },
    {
      name: 'From Date',
      selector: row => row.RequestFromDate?.slice(0, 10),
      sortable: true
    },
    {
      name: 'To Date',
      selector: row => row.RequestToDate?.slice(0, 10),
      sortable: true
    },
    {
      name: 'Changed Menu',
      selector: row => row.ChangedMealType,
      sortable: true
    },
    {
      name: 'Reason',
      selector: row => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', padding: '10px' }}>
          {row.ReasonChangeType}
        </div>
      ),
      sortable: true
    },
    {
      name: 'Details',
      selector: row => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {row.RequestReason}
        </div>
      ),
      sortable: false
    },
    {
      name: 'Document',
      selector: row => (
        //             <a
        //     href={`https://tgmess.edusync.in/Images/PartnerImages/${row.UserName}/Tickets/${row.Attachment}`}
        //     className="text-primary"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     View
        //   </a>
        <button
          className="btn btn-link text-primary p-0"
          onClick={() => {
            const url = `https://tgmess.edusync.in/Images/PartnerImages/${row.UserName}/Tickets/${row.Attachment}`;
            setSelectedFileUrl(url);
            setShowModalpdf(true);
          }}
        >
          View
        </button>
      ),
      width: '100px',
      sortable: false
    },
    {
      name: 'Status',
      selector: row => (
        <span
          className={`badge text-bg-${row.ApprovedStatus === 'Rejected'
              ? 'secondary'
              : row.ApprovedStatus === 'pending'
                ? 'danger'
                : row.ApprovedStatus === 'Approved'
                  ? 'success'
                  : 'light'
            }`}
        >
          {row.ApprovedStatus}
        </span>
      ),
      width: '90px',
      sortable: true
    },
    {
      name: 'Action',
      selector: row => (
        row.ApprovedStatus === 'pending' ? (
          <div className="icon-container">
            <i className="bi bi-pencil-square" style={{ cursor: 'pointer', color: 'var(--primary-purple)' }} onClick={() => {
              setSelectedTicket(row);
              setShowModal(true)
            }}></i>
          </div>
        ) : <span>&nbsp;</span>
      ),
      width: '90px',
      sortable: false,
      ignoreRowClick: true,

    }
  ]

  return (
    <>
      <ToastContainer />
      <div className="row g-3 mb-3">
        <div className="col-sm-12">
          <div className="white-box shadow-sm">
            {/* <div className="table-header">
                    <h5><span className="pink fw-bold">Tickets Raised</span></h5>
                    <div className="table-tools">
                        <input type="text" className="form-control" placeholder="Search..." />
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
                        </select>
                        <img src="img/print_icon.png" />
                    <img src="img/download_icon.png" className="download_img" />
                      </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered mt-2" id="tsmess-table">
                        <thead id="attendance-table">
                            <tr>
                                <th>Ticket ID</th>
                                <th>Zone ID</th>
                                <th>School ID</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Changed Menu</th>
                                <th>Reason</th>
                                <th>Details</th>
                                <th>Document</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {Array.isArray(tickets) && tickets.length > 0 ? (
                                tickets.map((ticket,index) => (
                                 <tr key={ticket.TicketId}>
                                    <td>
                                        {ticket.TicketId}
                                    </td>
                                    <td>
                                        {ticket.ZoneId}
                                    </td>
                                    <td>
                                        {ticket.SchoolId}
                                    </td>
                                    <td>{ticket.RequestFromDate}</td>
                                    <td>{ticket.RequestToDate}</td>
                                    <td>{ticket.ChangedMealType}</td>
                                    <td>{ticket.ReasonChangeType}</td>
                                    <td>{ticket.RequestReason}</td>
                                    <td><a href={`https://tgmess.edusync.in/Images/PartnerImages/${ticket.UserName}/Tickets/${ticket.Attachment}`} className="text-primary">View</a></td>
                            <td><span className={`badge text-bg-${
                                ticket.ApprovedStatus === 'Rejected' ? 'secondary'
                               : ticket.ApprovedStatus === 'pending' ? 'danger'
                               : ticket.ApprovedStatus === 'Approved' ? 'success' : 'light'
                            }`}>{ticket.ApprovedStatus}</span></td>
                            <td>
                                <div className="icon-container">
                                    <i className="bi bi-pencil-square" style={{ cursor: 'pointer', color: 'var(--primary-purple)' }} onClick={() => setShowModal(true)}></i>
                                </div>    
                            </td>
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

            <DataTable
              title="Tickets Raised"
              columns={columns}
              data={tickets}
              pagination
              striped
              persistTableHead
              noDataComponent={<span>No data available</span>}
              highlightOnHover
              dense
            />
          </div>
        </div>
      </div>

      {showModal && selectedTicket && (
        <div className="modal fade show" tabIndex="-1" aria-modal="true" role="dialog" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Action</h1>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label">Select Action</label>
                    <select className="form-select" value={ApprovedStatus} onChange={e => setApprovedStatus(e.target.value)}>
                      <option value="" disabled>--Select--</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className='form-label'>TicketID</label>
                    <input type='text' className='form-control' value={selectedTicket.TicketId} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">From Date</label>
                    <input type="date" className="form-control" value={ApprovedFromDate} onChange={e => setApprovedFromDate(e.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">To Date</label>
                    <input type="date" className="form-control" value={ApprovedToDate} onChange={e => setApprovedToDate(e.target.value)} />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label">Reason</label>
                    <textarea rows="2" className="form-control" value={ApprovedReason} onChange={e => setApprovedReason(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => processTicket(selectedTicket.TicketId)}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalpdf && selectedFileUrl && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Attachment Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowModalpdf(false)}></button>
              </div>
              <div className="modal-body text-center">
                {selectedFileUrl.endsWith('.pdf') ? (
                  <iframe src={selectedFileUrl} width="100%" height="500px" title="PDF Preview" />
                ) : (
                  <img src={selectedFileUrl} alt="Attachment" className="img-fluid" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tickets