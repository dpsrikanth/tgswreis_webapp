import React from 'react'

const LeaveApproval = () => {
  return (
    <>
    <div className='row'>
        <div className='col-sm-12'>
            <div className='white-box shadow-sm'>
              <div className="row align-items-center mb-3">
        <div className='col-sm-6'>
       <h5 className="fw-bold" style={{ color: '#cc1178' }}>
        Leave Approval
      </h5>
        </div>
        <div className='col-sm-6 text-end'>
           <button className="btn btn-secondary btn-sm" onClick={() => navigate('-1')}>
            Back
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <div className='table-responsive'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Leave Type ID</th>
                  <th>Employee Name</th>
                  <th>Designation</th>
                  <th>Leave Type</th>
                  <th>Leave(s) Applied on</th>
                  <th>No. of Days Applied</th>
                  <th>No. of Days Sanctioned</th>
                  <th>Leave(s) Sanctioned</th>
                  <th>Applied Date</th>
                  <th>Approved Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Remarks</th>
                  <th>Support Documents</th>
                  <th>Print</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10101</td>
                  <td>Test</td>
                  <td>JAA</td>
                  <td>EL</td>
                  <td>29 Dec 2025:First Half,02 Jan 2026:Second Half</td>
                  <td>5.0</td>
                  <td>0.0</td>
                  <td></td>
                  <td>23rd Dec 2025</td>
                  <td></td>
                  <td>Pending</td>
                  <td>Applied by : Test
Recommended by :
Authorised by :
Forwarded by : -
Approved by : -</td>
<td>Personal</td>
<td>Click Here</td>
<td></td>
<td>
  <button className='btn btn-primary btn-sm'>Edit</button>
  <button className='btn btn-primary btn-sm'>Actions</button>
</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default LeaveApproval