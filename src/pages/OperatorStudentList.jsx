import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { exportToExcel } from '../libs/exportToExcel'

const getCaseType = (s) => {
  const tags = [];

  if (s.IsFever === 1 || s.IsFever === true) tags.push("Fever");
  if (s.InsectByte === 1 || s.InsectByte === true) tags.push("Insect Bite");
  if (s.IsFoorneCase === 1 || s.IsFoorneCase === true) tags.push("Food Borne");

  return tags.length ? tags.join(", ") : "Other";
};


const getFileUrl = (refDocNo,fileType="jpg",schoolCode) => {
  return `https://tgswreisuat.unicampus.in/viewfile.aspx?fname=${refDocNo}&ftype=${fileType}&rdoctype=Health&SchoolCode=${schoolCode}`
}


const COMMON_COLUMNS = [
    {header: "Zone Name", render: (s) => s.ZoneName},
  {header: "District Name", render: (s) => s.DistrictName},
  {header: "School Code", render: (s) => s.SchoolCode},
  {header: "School Name", render: (s) => s.SchoolName},
  {header: "Student Name", render: (s) => `${s.FName} ${s.LName || ""}`},
  {header: "Gender" , render: (s) => s.GenderName},
  {header: "Health Issue Title", render: (s) => (  <span className="badge bg-primary">
                    {s.HealthIssueTitle}
                  </span>)},
  {header: "Health Issue Date", render: (s) => s.HealthIssueDate ? new Date(s.HealthIssueDate).toLocaleDateString("en-IN") : "-" },
  {header: "Sick From Date", render: (s) => s.SickFromDate ? new Date(s.SickFromDate).toLocaleDateString("en-IN") : "-" },
  {header: "Health Action Taken", render: (s) => s.HealthActionTaken},
  {header: "Health Issue Description", render: (s) => s.HealthIssueDescription},
  {header: "Case Type", render:  (s) => getCaseType(s)},
  {
  header: "Prescription/ Attachments",
  render: (s) =>
    s.RefDocNo ? (
      <a
        href={getFileUrl(s.RefDocNo, "jpg",s.SchoolCode)}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        View
      </a>
    ) : (
      "Not Uploaded"
    )
} 
]

const CATEGORY_COLUMNS = {
  GENERAL: [
    {header: "Is Student in Wellness Center", render: (s) => s.StudentInWellnessCenter}
  ],
  ADMITTED: [
    {header: "Name of Hospital", render: (s) => s.HospitalAdmittedName},
    {header: "Date of Admission", render: (s) => s.HospitalAdmittedDate},
    {header: "Diagnosis", render: (s) => s.HospitalAdmittedDiagnosis},
    {header: "Remarks", render: (s) => s.HospitalAdmittedRemarks}
  ],
  REFERRED: [
    {header: "Referred Hospital Name", render: (s) => s.ReferredHospitalName},
    {header: "Referral Date", render: (s) => s.ReferredDate},
    {header: "Reason for Referral", render: (s) => s.RefrralHospitalReason},
    {header: "Follow up Status", render: (s) => s.ReferredHospitalStatus}
  ],
  SENT_HOME: [
    {header: "Parent Contact Number", render: (s) => s.SickGroundHomeDate},
    {header: "Parent Name", render: (s) => s.SickGroundRemarks},
    {header: "Sent Home Date", render: (s) => s.SickGroundContactNo},
    {header: "Family Feedback", render: (s) => s.SickGroundFamilyHealthFeedback},
    {header: "Health Status", render: (s) => s.SickGroundHealthStatus}
  ]
}


const CATEGORY_BUTTONS = [
  { label: 'All', value: null },
  { label: 'General', value: 'GENERAL' },
  // { label: 'Fever', value: 'FEVER' },
  {label: 'Sent Home', value: 'SENT_HOME'},
  { label: 'Admitted', value: 'ADMITTED' },
  { label: 'Referred', value: 'REFERRED' },
  // { label: 'Bite', value: 'INSECT_BITE' }
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





const columns = [
  ...COMMON_COLUMNS,
  ...(CATEGORY_COLUMNS[selectedCategory] || [])
]



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
            {/* <tr>
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
              <th>Uploaded Document</th>
            </tr> */}
            <tr>
              {columns.map((col) => (<th key={col.header}>{col.header}</th>))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr
                key={s.UserId}
                style={{ cursor: 'pointer' }}
                onClick={() => onStudentSelect(s.UserId)}
              >
                {/* <td>{s.FName} {s.LName}</td>
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
                  <td>{s.RefDocNo ? (<a href={getFileUrl(s.RefDocNo, "jpg")} target="_blank" rel="noreferrer">View</a>) : (<span>No Document Uploaded</span>)}</td> */}
                  {columns.map((col) => (
                    <td key={col.header}>{col.render(s)}</td>
                  ))}
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
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
