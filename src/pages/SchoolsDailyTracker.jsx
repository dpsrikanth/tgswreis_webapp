import React,{ useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import {data, useNavigate} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

const SchoolsDailyTracker = () => {

const token = useSelector((state) => state.userappdetails.TOKEN);
const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
const dataFetched = useRef(false);
const [schoolsStockList,setSchoolsStockList] = useState([]);
const [schoolsPrintList,setSchoolsPrintList] = useState([]);
const navigate = useNavigate();





const fetchSchoolsListStock = async () => {
    try {

        _fetch('schoolslistnostock',null,false,token).then(res => {
            if(res.status === 'success'){
                setSchoolsStockList(res.data);
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        })

    } catch (error){

        console.error('Error fetching data',error)
        toast.error(res.message);
    }
}

const fetchSchoolsListPrint = async () => {
    try {

        _fetch('schoolslistnoprint',null,false,token).then(res => {
            if(res.status === 'success'){
                setSchoolsPrintList(res.data)
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        })

    } catch (error){

        console.error('Error fetching data',error)
        toast.error(res.message);
    }
}




const SchoolsListNoStockReport = async (data) => {
 const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

 const customHeaders = [
  {header: 'School Code', key: 'SchoolCode'},
  {header: 'School Name', key: 'PartnerName'},
  {header: 'School Contact', key: 'ContactMobile'}
 ]


const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);

  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Schools with No Stock Data Report - ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16};
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:C1`);
  sheet.addRow([]);


  const headerNames = headers.map(h => h.header);
  const headerRow = sheet.addRow(headerNames);
  headerRow.font = {bold: true};
  headerRow.alignment = {horizontal: 'center'};

  headerRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' },
    };
  });

     data.forEach((item) => {
      const rowData = customHeaders.map(h => {
    return item[h.key] != null ? item[h.key] : ''
      })

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 5;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
};

if(Array.isArray(data) && data.length > 0){
  const headers = Object.keys(data[0]);
  createSheet("Schools List",customHeaders,data);
} else {
  toast.error(`Schools List with no stock data not found`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`SchoolsListNoStockData_${new Date().toISOString().split('T')[0]}.xlsx`);
}

const SchoolsListNoPrintReport = async (data) => {
     const workbook = new ExcelJS.Workbook();

 const borderStyle = {
  top: {style:'thin'},
  left:{style:'thin'},
  bottom:{style: 'thin'},
  right: {style: 'thin'}
 }

 const customHeaders = [
  {header: 'School Code', key: 'SchoolCode'},
  {header: 'School Name', key: 'PartnerName'},
  {header: 'School Contact', key: 'ContactMobile'}
 ]


const createSheet = (sheetName,headers,data) => {
  const sheet = workbook.addWorksheet(sheetName);

  const todayDate = new Date().toISOString().split('T')[0];
  const titleRow = sheet.addRow([`Schools who have not clicked Print Provisions Today - ${todayDate}`]);
  titleRow.font = {bold: 'true', size: 16};
  titleRow.alignment = {horizontal: 'center'};
  sheet.mergeCells(`A1:C1`);
  sheet.addRow([]);


  const headerNames = headers.map(h => h.header);
  const headerRow = sheet.addRow(headerNames);
  headerRow.font = {bold: true};
  headerRow.alignment = {horizontal: 'center'};

  headerRow.eachCell((cell) => {
    cell.border = borderStyle;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' },
    };
  });

     data.forEach((item) => {
      const rowData = customHeaders.map(h => {
    return item[h.key] != null ? item[h.key] : ''
      })

      const row = sheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Auto-fit column width
    sheet.columns.forEach((column) => {
      let maxLength = 5;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength + 2;
    });

    return sheet;
};

if(Array.isArray(data) && data.length > 0){
  const headers = Object.keys(data[0]);
  createSheet("Schools List",customHeaders,data);
} else {
  toast.error(`Schools List who have not clicked print provisions not found`);
}

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer],{
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
});
saveAs(blob,`SchoolsListNoPrintData_${new Date().toISOString().split('T')[0]}.xlsx`);
}



const columns = [

   { name: 'S.No',
    selector: (row,index) => index + 1,
    width: '100px' 
   },
   {
    name: 'School Code',
    selector: row => row.SchoolCode,
    width:'100px ',
    sortable:true,
   },
   {
    name: 'School Name',
    selector: row => row.PartnerName,
    sortable:true,
   },
   {
    name: 'School Contact',
    selector: row => row.ContactMobile,
    sortable:true,
   },
]


const columnsprint = [
    
   { name: 'S.No',
    selector: (row,index) => index + 1,
    width: '100px' 
   },
   {
    name: 'School Code',
    selector: row => row.SchoolCode,
    width:'100px ',
    sortable:true,
   },
   {
    name: 'School Name',
    selector: row => row.PartnerName,
    sortable:true,
   },
   {
    name: 'School Contact',
    selector: row => row.ContactMobile,
    sortable:true,
   },
]


useEffect(() => {
if(!token) {
    navigate('/login');
}

if(!dataFetched.current){
  dataFetched.current = true;
  fetchSchoolsListStock();
 fetchSchoolsListPrint();
}


},[token])

  return (
    <>

     <ToastContainer/>
     <h6 className="fw-bold mb-3"><a onClick={() => navigate('/samsdashboard')} style={{cursor:'pointer'}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Schools Daily Tracker</h6>
     <div className='row'>
        <div className='col-sm-12'>
             <div className="white-box shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <h5><span className="headercolor fw-bold">Schools with No Stock Details</span></h5>
                    <button className='btn btn-success' onClick={() => SchoolsListNoStockReport(schoolsStockList)}>Get Report</button>
                </div>
                <div className='text-end'>
                    
                </div>
                <div>
                    <DataTable 
                    columns={columns}
                    data={schoolsStockList}
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
                </div>

     <div className='row mt-3'>
        <div className='col-sm-12'>
             <div className="white-box shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <h5><span className="headercolor fw-bold">Schools who have not Clicked Print Provisions Today</span></h5>
                     <button className='btn btn-success' onClick={() => SchoolsListNoPrintReport(schoolsPrintList)}>Get Report</button>
                </div>
                <div className='text-end'>
                   
                </div>
                <div>
                    <DataTable 
                    columns={columnsprint}
                    data={schoolsPrintList}
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
                </div>
    </>
  )
}

export default SchoolsDailyTracker