import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _fetch } from "../libs/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const exportExcel = async () => {

  if (!todaySchedule.length) {
    toast.warning("No data available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Today Inspections");

  // ===== TITLE =====
  worksheet.mergeCells("A1:H1");
  worksheet.getCell("A1").value =
    `Today's Scheduled Inspections (${format(new Date(), "dd MMM yyyy")})`;

  worksheet.getCell("A1").font = {
    size: 14,
    bold: true
  };

  worksheet.getCell("A1").alignment = {
    horizontal: "center"
  };

  worksheet.addRow([]);

  // ===== HEADERS =====
  const headers = [
    "S.No",
    "Visit Date",
    "Officer Name",
    "Designation",
    "Region",
    "School Name",
    "School Code",
    "Status"
  ];

  worksheet.addRow(headers);

  worksheet.getRow(3).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // ===== DATA =====
  todaySchedule.forEach((item, index) => {
    const statusObj = getStatus(
      item.Status,
      item.IsAdditionalVisit
    );

    worksheet.addRow([
      index + 1,
      format(new Date(item.DateOfVisit), "dd-MM-yyyy"),
      item.OfficerName,
      item.RoleDisplayName,
      item.Region,
      item.PartnerName.replace("TGSWREIS", ""),
      item.SchoolCode,
      statusObj.label
    ]);
  });

  // ===== COLUMN WIDTH =====
  worksheet.columns = [
    { width: 6 },
    { width: 14 },
    { width: 22 },
    { width: 25 },
    { width: 18 },
    { width: 30 },
    { width: 15 },
    { width: 20 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `Today_Inspections_${format(new Date(), "dd-MM-yyyy")}.xlsx`
  );
};


const TodayTotalInspections = () => {
  const token = useSelector(state => state.userappdetails.TOKEN);
 const [todaySchedule,setTodaySchedule] = useState([]);
const navigate = useNavigate();


const getStatus = (status, isAdditional = false) => {

  // ⭐ highest priority
  if (isAdditional) {
    return {
      label: "Additional Visit",
      badge: "badge bg-info text-dark"
    };
  }

  switch (status) {

    case 1:
      return {
        label: "Pending",
        badge: "badge bg-warning text-dark"
      };

    case 3:
      return {
        label: "Completed",
        badge: "badge bg-success"
      };

    case 4:
      return {
        label: "Not Visited",
        badge: "badge bg-danger"
      };

    case 5:
      return {
        label: "Cannot Visit",
        badge: "badge bg-secondary"
      };

    default:
      return {
        label: "Unknown",
        badge: "badge bg-dark"
      };
  }
};


  const fetchTodaySchedule = async () => {
     
    try{

        _fetch('todaytourschedule',null,false,token).then(res => {
            if(res.status === 'success'){
                setTodaySchedule(res.data);
            }else {
                console.error(res.message);
            }
        })

    }catch(error){
        console.error('Error fetching Todays Schedule',error)
    }
  }


useEffect(() => {
   fetchTodaySchedule(); 
},[])




  return (
    <>
    <div className="row">
         <div className='col-sm-12'>
             <div className="white-box shadow-sm">
                <div className="table-header mb-2">
                  <h5 className="chart-title">Today's Scheduled Inspections</h5>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tourdiarydashboard')}>
            Back
          </button>

          <button
      className="btn btn-success btn-sm"
      onClick={exportExcel}
    >
      Export Excel
    </button>
                </div>
                
                <div className="row">
                    <div className="col-sm-12">
                      <div className='table-responsive'>
                      <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Visit Date</th>
                                    <th>Officer Name</th>
                                    <th>Designation</th>
                                    <th>School Name</th>
                                    <th>School Code</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(todaySchedule) && todaySchedule.length > 0 ? (
                                todaySchedule.map((item,index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{new Date(item.DateOfVisit).toLocaleDateString('en-IN')}</td>
                                        <td>{item.OfficerName}</td>
                                        <td>{item.RoleDisplayName} - {item.Region}</td>
                                        <td>{item.PartnerName.replace('TGSWREIS','')}</td>
                                        <td>{item.SchoolCode}</td>
                                        <td><span className={getStatus(item.Status,item.IsAdditionalVisit).badge}>{getStatus(item.Status,item.IsAdditionalVisit).label}</span></td>
                                    </tr>
                                ))
                              ) : (
                                <div>No Visits Scheduled Today</div>
                              )}
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

export default TodayTotalInspections