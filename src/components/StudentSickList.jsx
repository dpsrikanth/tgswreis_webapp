import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const StudentSickList = ({
  SchoolId,
  Category,
  onStudentClick,
  onBack
}) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchStudents = async () => {
    try {
      setLoading(true)

      const payload = {
        SchoolId,
        Category
      }

      const res = await _fetch(
        'sickstudentslist',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setStudents(res.data)
      } else {
        console.error('Error fetching student sick list')
      }
    } catch (error) {
      console.error('Error fetching student sick list', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [SchoolId, Category])

  // const getCategoryLabel = () => {
  //   switch (Category) {
  //     case 'general':
  //       return 'General Sick'
  //     case 'fever':
  //       return 'Fever Cases'
  //     case 'foodborne':
  //       return 'Food Borne'
  //     case 'emergency':
  //       return 'Emergency'
  //     case 'atmost':
  //       return 'Atmost Emergency'
  //     default:
  //       return ''
  //   }
  // }

  const getCategoryLabel = () => {
  switch (Category) {
    case 'GENERAL_SICK': return 'General Sick'
    case 'SENT_HOME': return 'Sent Home'
    case 'REFERRED': return 'Referred to Hospital'
    case 'ADMITTED': return 'Admitted to Hospital'
    case 'FEVER': return 'Fever Cases'
    case 'FOODBORNE': return 'Food Borne'
    case 'EMERGENCY': return 'Emergency'
    case 'ATMOST': return 'Atmost Emergency'
    default: return ''
  }
}

const excelColumns = [
  { header: 'Student Name', key: 'StudentName', width: 25 },
  { header: 'Gender', key: 'GenderName', width: 12 },
  { header: 'Health Issue Date', key: 'HealthIssueDate', width: 18 },
  { header: 'Sick From Date', key: 'SickFromDate', width: 18 },
  { header: 'Health Issue Title', key: 'HealthIssueTitle', width: 25 },
  { header: 'Health Issue Description', key: 'HealthIssueDescription', width: 40 },
  { header: 'Action Taken', key: 'HealthActionTaken', width: 30 },
  { header: 'Any Medical Emergency', key: 'IsMedicalEmergencies', width: 22 },
  { header: 'Student in Wellness Center', key: 'StudentInWellnessCenter', width: 28 }
]


const excelData = students.map(item => ({
  ...item,
  StudentName: `${item.FName} ${item.LName || ''}`.trim(),

  HealthIssueDate: item.HealthIssueDate
    ? new Date(item.HealthIssueDate).toLocaleDateString('en-IN')
    : '-',

  SickFromDate: item.SickFromDate
    ? new Date(item.SickFromDate).toLocaleDateString('en-IN')
    : '-',

  
}))

const categoryLabel = getCategoryLabel()
const contextRows = []

if (categoryLabel) {
  contextRows.push(`Category : ${categoryLabel}`)
}

const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Student List',
    fileName: 'Student_Sick_List',
    title: `${categoryLabel} – Student List`,
    context: contextRows
  })
}



  return (
    <>
      <div className="row align-items-center mb-2">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            {getCategoryLabel()} – Student List
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
      className="btn btn-success btn-sm me-2"
      onClick={handleExport}
      disabled={students.length === 0}
    >
      Export Excel
    </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
           ← Back to Schools
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Student Name</th>
              <th>Gender</th>
              <th>Health Issue Date</th>
              <th>Sick From Date</th>
              <th>Health Issue Title</th>
              <th>Health Issue Description</th>
              <th>Action Taken</th>
              <th>Any Medical Emergencies</th>
              <th>Is Student In Wellness Center</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((item) => (
                <tr key={item.UserId}>
                  <td>
                    {item.FName} {item.LName}
                  </td>
                 
                  <td>{item.GenderName}</td>
                  <td>
                    {item.HealthIssueDate
                      ? new Date(item.HealthIssueDate).toLocaleDateString('en-IN')
                      : '-'}
                  </td>
                  <td>{item.SickFromDate ? new Date(item.SickFromDate).toLocaleDateString('en-IN') : '-'}</td>
                  <td>{item.HealthIssueTitle}</td>
                  <td>{item.HealthIssueDescription}</td>
                  <td>{item.HealthActionTaken}</td>
                  <td>{item.IsMedicalEmergencies}</td>
                  <td>{item.StudentInWellnessCenter}</td>
                 
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onStudentClick(item.UserId)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentSickList
