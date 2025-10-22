import React,{useState,useRef} from 'react'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

const ViewStaffEntry = () => {
  return (
    <>
    <div className='row'>
        <div className='col-sm-12'>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    
    </>
  )
}

export default ViewStaffEntry