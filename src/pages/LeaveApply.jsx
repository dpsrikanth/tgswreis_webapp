import React from 'react'

const LeaveApply = () => {
  return (
    <>
    <div className='row'>
        <div className="col-sm-12">
            <div className='white-box shadow-sm'>
                <div className='row'>
                    <div className='col-sm-3'>
                        <label className='form-label'>Employee Name</label>
                        <input type='text' className='form-control' disabled />
                    </div>
                     <div className='col-sm-3'>
                        <label className='form-label'>Select Leave Type</label>
                        <select className='form-select'>
                            <option>--Select--</option>
                        </select>
                    </div>
                    <div className='col-sm-3'>
                        <label className='form-label'>From Date</label>
                        <input type='date' className='form-control' />
                    </div>
                     <div className='col-sm-3'>
                        <label className='form-label'>To Date</label>
                        <input type='date' className='form-control' />
                    </div>
                     <div className='col-sm-3'>
                        <label className='form-label'>Reason</label>
                        <input type='date' className='form-control' />
                    </div>
                     <div className='col-sm-3'>
                        <label className='form-label'>Supporting Document</label>
                        <input type='file' className='form-control' />
                    </div>
                    <div className='col-sm-3'>
                        <div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
  <label className="form-check-label" for="inlineRadio1">1</label>
</div>
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
  <label className="form-check-label" for="inlineRadio2">2</label>
</div>
                    </div>
                     <div className='col-sm-3'>
                        <label className='form-label'>Address for Communication</label>
                        <textarea rows={3} className='form-control'></textarea>
                    </div>

                    <div className='col-sm-12'>
                        <button className='btn btn-primary'>Submit</button>
                        <button className='btn btn-danger'>Clear</button>
                    </div>
                </div>

            <div className='row'>
                <div className='col-sm-12'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Leave Type ID</th>
                                <th>Leave Type</th>
                                <th>No. of Days on Leave</th>
                                <th>No. of Days Sanctioned</th>
                                <th>Leaves Applied on</th>
                                <th>Reason for Leaving</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Support Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default LeaveApply