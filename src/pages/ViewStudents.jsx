import React from 'react'
import { _fetch } from '../libs/utils';
import { useEffect,useRef,useState } from 'react';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import StudentDrilldown from '../components/students/StudentDrilldown';

const ViewStudents = () => {
  return (
   <>
   <div className='row'>
    <div className='col-sm-12'>
        <div className='white-box shadow-sm'>
            <StudentDrilldown />
        </div>
    </div>
   </div>
   </>
  )
}

export default ViewStudents