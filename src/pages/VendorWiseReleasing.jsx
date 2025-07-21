import React,{useState} from 'react'
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { _fetch } from '../libs/utils';
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';





const VendorWiseReleasing = () => {
     const token = useSelector((state) => state.userappdetails.TOKEN);
  const userid = useSelector((state) => state.userappdetails.profileData.Id)
  const ZoneId = useSelector((state) => state.userappdetails.profileData.ZoneId)
  const navigate = useNavigate();

const [selectedMonth,setSelectedMonth] = useState(dayjs());
const [paymentData, setPaymentData] = useState([]);


const handleMonthChange = (e) => {
  setSelectedMonth(dayjs(e.target.value))
}


const handleVendorWiseData = async () => {

    const payload = {
        month: selectedMonth.format("YYYY-MM")
    }

    _fetch('vendorwisepayments',payload,false,token).then(res => {
        if(res.status === 'success') {
            setPaymentData(res.data);
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        console.error("Failed to Generate Report:",err);
        toast.error("Failed to Generate Report");
    })
}


  const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(paymentData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook,worksheet,"Schoolwise Vendors Report");

      const fileName = `Vendor_Payments_${selectedMonth.format("YYYY-MM")}.xlsx`;
      XLSX.writeFile(workbook,fileName);
  };









 const fromDate = dayjs(new Date(selectedMonth.year(), selectedMonth.month() - 1, 26)).format("DD MMM YYYY");
  const toDate = dayjs(new Date(selectedMonth.year(), selectedMonth.month(), 25)).format("DD MMM YYYY");




  return (
   <>
     <ToastContainer />
    <h6 className="fw-bold mb-3"><a onClick={() => {navigate('/reportsdashboard')}}><i className="bi bi-arrow-left pe-2" style={{fontSize:'24px',verticalAlign:'middle'}}></i></a>Vendor Wise Releasing Amount Report</h6>
      
      <div className="row">
        <div className="col-sm-12">
            <div className="white-box shadow-sm">
                <div className="table-header">
                    <h5><span className="pink fw-bold">Vendor Wise Releasing Amount Report</span></h5>
                </div>
                <div className="row gy-3 align-items-center pt-2">
                   <div className='col-sm-6'>
                    <label className='form-label'>Select Month</label>
                    <input type='month' value={selectedMonth.format("YYYY-MM")} onChange={handleMonthChange} className='form-control' />
                   </div>
                   <div className='col-sm-6 text-start'>
                    <button className='btn btn-primary mt-4' onClick={handleVendorWiseData}>Generate</button>
                   </div>

                   

                   {paymentData.length > 0 && (
                    <>

                     <p>
        Showing data from: <strong>{fromDate}</strong> to <strong>{toDate}</strong>
      </p>
                     <div className='col-sm-12'>
                    <button onClick={exportToExcel} className='btn btn-success mb-2' style={{ marginTop: '1rem' }}>
                     Download Excel
                    </button>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>A/C number</th>
                                <th>Name of Party</th>
                                <th>Bank Name</th>
                                <th>Branch</th>
                                <th>IFSC</th>
                                <th>Total Amount</th>
                                <th>TDS Amount - 2%</th>
                                <th>Final Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.map((item,index) => (
                                <tr key={index}>
                                 <td>{item["A/C Number"]}</td>
                                 <td>{item["Name of Party"]}</td>
                                 <td>{item["Bank Name"]}</td>
                                 <td>{item.Branch}</td>
                                 <td>{item.IFSC}</td>
                                 <td>{item["Total Amount"]}</td>
                                 <td>{item["TDS Deducted 2%"]}</td>
                                 <td>{item["Final Amount"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                   </div>
                    </>
                   ) }

                  
                </div>
            </div>
        </div>
          
        
      </div>
   </>
  )
}

export default VendorWiseReleasing;