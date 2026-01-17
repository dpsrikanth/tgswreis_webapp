import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'


const CATEGORY_BUTTONS = [
  { label: 'All', value: null },
  { label: 'General', value: 'GENERAL' },
  { label: 'Fever', value: 'FEVER' },
  {label: 'Sent Home', value: 'SENT_HOME'},
  { label: 'Admitted', value: 'ADMITTED' },
  { label: 'Referred', value: 'REFERRED' }
]

const OperatorStudentList = ({
  ZoneId,
  ZoneName,
  selectedCategory,
  onCategoryChange,
  onStudentSelect,
  onBack
}) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [ZoneId, selectedCategory])

  const fetchStudents = async () => {
    const payload = {
      ZoneId,
    }

    if(selectedCategory){
      payload.Category = selectedCategory;
    }

    const res = await _fetch(
      'operatorstudentsbyzone',
      payload,
      false,
      token
    )

    if (res.status === 'success') {
      setStudents(res.data)
    }
  }

  const filteredStudents = students.filter(s =>
    `${s.FName} ${s.LName}`.toLowerCase().includes(search.toLowerCase())
  )

  const excelColumns = [
  { header: 'Student Name', key: 'StudentName', width: 25 },
  { header: 'Gender', key: 'GenderName', width: 12 },
  { header: 'School', key: 'SchoolName', width: 30 },
  { header: 'Health Issue Title', key: 'HealthIssueTitle', width: 25 },
  { header: 'Health Issue Date', key: 'HealthIssueDate', width: 18 },
  { header: 'Sick From Date', key: 'SickFromDate', width: 18 },
  { header: 'Health Issue Description', key: 'HealthIssueDescription', width: 40 },
  { header: 'Health Action Taken', key: 'HealthActionTaken', width: 30 },
  { header: 'Any Medical Emergencies', key: 'IsMedicalEmergencies', width: 22 },
  { header: 'Student in Wellness Center', key: 'StudentInWellnessCenter', width: 25 }
]


const excelData = filteredStudents.map(s => ({
  ...s,
  StudentName: `${s.FName} ${s.LName || ''}`.trim(),
  HealthIssueDate: s.HealthIssueDate
    ? new Date(s.HealthIssueDate).toLocaleDateString('en-IN')
    : '-',
  SickFromDate: s.SickFromDate
    ? new Date(s.SickFromDate).toLocaleDateString('en-IN')
    : '-',
 
}))

const contextRows = []

if (ZoneName) {
  contextRows.push(`Zone : ${ZoneName}`)
}

const categoryLabel =
  CATEGORY_BUTTONS.find(b => b.value === selectedCategory)?.label || 'All'

contextRows.push(`Category : ${categoryLabel}`)


const handleExport = () => {
  exportToExcel({
    data: excelData,
    columns: excelColumns,
    sheetName: 'Students',
    fileName: 'Sick_Students_List',
    title: 'Sick – Student List',
    context: contextRows
  })
}



  return (
    <div className="white-box shadow-sm">

      <div className="d-flex justify-content-between mb-2 align-items-center">
        <h6 className="fw-bold">
          Zone: {ZoneName}
        </h6>
        <div>
          <button
      className="btn btn-success btn-sm me-2"
      onClick={handleExport}
      disabled={filteredStudents.length === 0}
    >
      Export Excel
    </button>
        <button className="btn btn-link" onClick={onBack}>
          ← Back
        </button>
        </div>
        
      </div>

      {/* Category filters */}
      <div className="mb-3">
        {CATEGORY_BUTTONS.map(btn => (
          <button
            key={btn.label}
            className={`btn btn-sm me-2 ${
              selectedCategory === btn.value
                ? 'btn-primary'
                : 'btn-outline-primary'
            }`}
            onClick={() => onCategoryChange(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search student"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Student table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>School</th>
              <th>Health Issue Title</th>
              <th>Health Issue Date</th>
              <th>Sick From Date</th>
              <th>Health Issue Title</th>
              <th>Health Issue Description</th>
              <th>Health Action Taken</th>
              <th>Any Medical Emergencies</th>
              <th>Is Student in Wellness Center</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => onStudentSelect(s.UserId)}
              >
                <td>{s.FName} {s.LName}</td>
                <td>{s.GenderName}</td>
                <td>{s.SchoolName}</td>
                <td>
                  <span className="badge bg-primary">
                    {s.HealthIssueTitle}
                  </span>
                </td>
                <td>{s.HealthIssueDate
                      ? new Date(s.HealthIssueDate).toLocaleDateString('en-IN')
                      : '-'}
                      </td>
                        <td>{s.SickFromDate ? new Date(s.SickFromDate).toLocaleDateString('en-IN') : '-'}</td>
                  <td>{s.HealthIssueTitle}</td>
                  <td>{s.HealthIssueDescription}</td>
                  <td>{s.HealthActionTaken}</td>
                  <td>{s.IsMedicalEmergencies}</td>
                  <td>{s.StudentInWellnessCenter}</td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default OperatorStudentList
