import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export const exportStudentProfileExcel = async ({
  profile,
  clinicalHistory = [],
  chronicConditions = []
}) => {
  const workbook = new ExcelJS.Workbook()
  const border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  }

  const now = new Date()
  const generatedAt = now.toLocaleString('en-IN')

  /* ===============================
     SHEET 1 – STUDENT PROFILE
     =============================== */
  const profileSheet = workbook.addWorksheet('Student Profile')

  profileSheet.addRow(['Student Health Profile']).font = {
    bold: true,
    size: 16
  }
  profileSheet.mergeCells('A1:D1')

  profileSheet.addRow([`Generated On: ${generatedAt}`])
  profileSheet.addRow([])

  const profileRows = [
    ['Student Name', `${profile.FName} ${profile.LName}`],
    ['Class', `${profile.ClassName} - ${profile.SectionName}`],
    ['School', profile.SchoolName],
    ['Zone', profile.ZoneName],
    ['District', profile.DistrictName],
    ['Gender', profile.GenderName],
    ['Admission No', profile.AdmissionNo || '-']
  ]

  profileRows.forEach(row => {
    const r = profileSheet.addRow(row)
    r.eachCell(c => (c.border = border))
  })

  profileSheet.columns = [{ width: 25 }, { width: 40 }]

  /* ===============================
     SHEET 2 – CLINICAL HISTORY
     =============================== */
  const clinicalSheet = workbook.addWorksheet('Clinical History')

  clinicalSheet.addRow([
    'Health Date',
    'Sick From',
    'Sick To',
    'Issue Title',
    'Description',
    'Action Taken',
    'Category',
    'Emergency',
    'Temperature',
    'Emergency Level',
    'Wellness Center'
  ]).font = { bold: true }

  clinicalHistory.forEach(item => {
    const row = clinicalSheet.addRow([
      item.HealthIssueDate
        ? new Date(item.HealthIssueDate).toLocaleDateString('en-IN')
        : '-',
      item.SickFromDate
        ? new Date(item.SickFromDate).toLocaleDateString('en-IN')
        : '-',
      item.SickToDate
        ? new Date(item.SickToDate).toLocaleDateString('en-IN')
        : '-',
      item.HealthIssueTitle,
      item.HealthIssueDescription,
      item.HealthActionTaken,
      item.IsFever === 1
        ? 'Fever'
        : item.IsFoorneCase === 1
        ? 'Food Borne'
        : '-',
      item.IsMedicalEmergencies || '-',
      item.ClinicalTemperature || '-',
      item.EmergencyLevel || '-',
      item.StudentInWellnessCenter ? 'Yes' : 'No'
    ])

    row.eachCell(c => (c.border = border))
  })

  clinicalSheet.columns.forEach(c => (c.width = 20))

  /* ===============================
     SHEET 3 – CHRONIC CONDITIONS
     =============================== */
  const chronicSheet = workbook.addWorksheet('Chronic Conditions')

  chronicSheet.addRow([
    'Condition',
    'Treatment',
    'Last Synced'
  ]).font = { bold: true }

  chronicConditions.forEach(item => {
    const row = chronicSheet.addRow([
      item.ChronicDisease,
      item.ChronicTreatment || '-',
      item.LastSyncedAt
        ? new Date(item.LastSyncedAt).toLocaleDateString('en-IN')
        : '-'
    ])

    row.eachCell(c => (c.border = border))
  })

  chronicSheet.columns.forEach(c => (c.width = 30))

  /* ===============================
     EXPORT
     =============================== */
  const buffer = await workbook.xlsx.writeBuffer()

  saveAs(
    new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }),
    `Student_Health_Profile_${profile.AdmissionNo || profile.UserId}.xlsx`
  )
}
