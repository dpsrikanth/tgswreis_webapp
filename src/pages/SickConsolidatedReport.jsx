import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'
import { exportToExcel } from '../libs/exportToExcel'

const SickConsolidatedReport = () => {
  return (
    <>
    <div className='white-box shadow-sm'>
        <div className='row'>
            <div className='col-sm-6'>
                <label>Select Zone</label>
                <select>
                    <option>All</option>
                </select>
            </div>
             <div className='col-sm-6'>
                <label>Select District</label>
                <select>
                    <option>All</option>
                </select>
            </div>
            <div className='col-sm-6'>
                <label>Select School</label>
                <select>
                    <option>All</option>
                </select>
            </div>
             <div className='col-sm-6'>
                <label>Select Type</label>
                <select>
                    <option>General Sick</option>
                    <option>Admitted</option>
                    <option>Referred</option>
                    <option>Sent Home on Sick Grounds</option>
                    <option>Utmost Emergency</option>
                    <option>Emergency</option>
                    <option>Recovered</option>
                    <option>Sick Not Entered</option>
                    <option>Sick Entered</option>
                    <option>No Sick Students Schools</option>
                    <option>chronic students</option>
                    <option>Food Borne</option>
                    <option>Fever</option>
                    <option>Insect Bite</option>
                </select>
            </div>
            <div className='col-sm-6'>
                <label>From Date</label>
                <input type='date' className='form-control' />
            </div>
             <div className='col-sm-6'>
                <label>To Date</label>
                <input type='date' className='form-control' />
            </div>
        </div>
    </div>
    </>
  )
}

export default SickConsolidatedReport