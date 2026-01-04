import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'

const StudentSickProfile = ({ UserId, onBack }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [profile, setProfile] = useState(null)
  const [clinicalHistory, setClinicalHistory] = useState([])
  const [chronicConditions, setChronicConditions] = useState([])
  const [activeTab, setActiveTab] = useState('clinical')
  const [loading, setLoading] = useState(false)

  const fetchStudentProfile = async () => {
    try {
      setLoading(true)

      const payload = { UserId }
      const res = await _fetch(
        'sickstudentprofile',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setProfile(res.data.studentProfile)
        setClinicalHistory(res.data.clinicalHistory || [])
        setChronicConditions(res.data.chronicConditions || [])
      } else {
        console.error('Error fetching student profile')
      }
    } catch (error) {
      console.error('Error fetching student profile', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentProfile()
  }, [UserId])

  if (loading) {
    return <div className="text-center mt-3">Loading...</div>
  }

  if (!profile) {
    return <div className="text-center mt-3">No profile found</div>
  }

  return (
    <>
      {/* Header */}
      <div className="row align-items-center mb-3">
        <div className="col-sm-8">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Student Health Profile
          </h5>
          <p className="mb-0">
            <strong>{profile.FName} {profile.LName}</strong> | {profile.ClassName} - {profile.SectionName}
          </p>
          <small>
            {profile.SchoolName} | {profile.ZoneName}, {profile.DistrictName}
          </small>
        </div>
        <div className="col-sm-4 text-end">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
            Back to Student List
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'clinical' ? 'active' : ''}`}
            onClick={() => setActiveTab('clinical')}
          >
            Clinical History
          </button>
        </li>
         <li className="nav-item">
    <button className={`nav-link ${activeTab === 'hospital' ? 'active' : ''}`}
      onClick={() => setActiveTab('hospital')}>
      Hospital / Referral
    </button>
  </li>

  <li className="nav-item">
    <button className={`nav-link ${activeTab === 'sickground' ? 'active' : ''}`}
      onClick={() => setActiveTab('sickground')}>
      Sent Home on Sick Grounds
    </button>
  </li>

  <li className="nav-item">
    <button className={`nav-link ${activeTab === 'insect' ? 'active' : ''}`}
      onClick={() => setActiveTab('insect')}>
      Insect Bite
    </button>
  </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'chronic' ? 'active' : ''}`}
            onClick={() => setActiveTab('chronic')}
          >
            Chronic Conditions
          </button>
        </li>
      </ul>

      {/* Clinical History */}
      {activeTab === 'clinical' && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Health Issue Date</th>
                <th>Sick From Date</th>
                <th>Sick To Date</th>
                <th>Health Issue Title</th>
                <th>Health Issue Description</th>
                <th>Action Taken</th>
                <th>Category</th>
                <th>Any Medical Emergencies</th>
                <th>Temperature</th>
                <th>Clinical Details</th>
                {/* <th>Action Taken</th> */}
                <th>Emergency Level</th>
              </tr>
            </thead>
            <tbody>
              {clinicalHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No clinical history found
                  </td>
                </tr>
              ) : (
                clinicalHistory.map((item) => (
                  <tr key={item.HealthIssueId}>
                    <td>
                      {item.HealthIssueDate
                        ? new Date(item.HealthIssueDate).toLocaleDateString('en-IN')
                        : '-'}
                    </td>
                    <td>
                      {item.SickFromDate ? new Date(item.SickFromDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td>
                      {item.SickToDate ? new Date(item.SickToDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td>{item.HealthIssueTitle}</td>
                    <td>{item.HealthIssueDescription}</td>
                    <td>{item.HealthActionTaken}</td>
                    <td>
                      {item.IsFever === 1
                        ? 'Fever'
                        : item.IsFoorneCase === 1
                        ? 'Food Borne'
                        : '-' }
                    </td>
                    <td>{item.IsMedicalEmergencies || '-'}</td>
                    <td>{item.ClinicalTemperature || '-'}</td>
                    <td>{item.ClinicalDetails || '-'}</td>
                    {/* <td>{item.ClinicalActionTaken || '-'}</td> */}
                    <td>{item.EmergencyLevel || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'hospital' && (
  <div className="card p-3">
    {clinicalHistory.ReferredHospitalName && (
      <>
        <h6 className="fw-bold text-warning">Referral Details</h6>
        <p><b>Hospital:</b> {clinicalHistory.ReferredHospitalName}</p>
        <p><b>Date:</b> {clinicalHistory.ReferralHospitalDate}</p>
        <p><b>Reason:</b> {clinicalHistory.RefrralHospitalReason}</p>
        <p><b>Status:</b> {clinicalHistory.ReferredHospitalStatus}</p>
        <hr />
      </>
    )}

    {clinicalHistory.HospitalAdmittedName && (
      <>
        <h6 className="fw-bold text-danger">Admission Details</h6>
        <p><b>Hospital:</b> {clinicalHistory.HospitalAdmittedName}</p>
        <p><b>Doctor:</b> {clinicalHistory.HospitalAdmittedDoctorName}</p>
        <p><b>Diagnosis:</b> {clinicalHistory.HospitalAdmittedDiagnosis}</p>
        <p><b>Discharge Date:</b> {clinicalHistory.DischargeDate}</p>
        <p><b>Summary:</b> {clinicalHistory.DischargSummary}</p>
      </>
    )}
  </div>
)}


{activeTab === 'sickground' && (
  <div className="card p-3">
    <p><b>Sent Home Date:</b> {clinicalHistory.SickGroundHomeDate}</p>
    <p><b>Parent Name:</b> {clinicalHistory.SickGroundParentName}</p>
    <p><b>Contact:</b> {clinicalHistory.SickGroundContactNo}</p>
    <p><b>Remarks:</b> {clinicalHistory.SickGroundRemarks}</p>
    <p><b>Family Feedback:</b> {clinicalHistory.SickGroundFamilyHealthFeedback}</p>
    <p><b>Health Status:</b> {clinicalHistory.SickGroundHealthStatus}</p>
  </div>
)}


{activeTab === 'insect' && (
  <div className="card p-3">
    {clinicalHistory.InsectByte === 1 ? (
      <>
        <p><b>Details:</b> {clinicalHistory.InsectByteDetails}</p>
        <p><b>Treatment:</b> {clinicalHistory.InsectTreatment}</p>
        <p><b>Recovered Date:</b> {clinicalHistory.RecoveredDate}</p>
      </>
    ) : (
      <p>No insect bite reported.</p>
    )}
  </div>
)}



      

      {/* Chronic Conditions */}
      {activeTab === 'chronic' && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Condition</th>
                <th>Treatment Given</th>
                <th>Last Synced On</th>
              </tr>
            </thead>
            <tbody>
              {chronicConditions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No chronic conditions recorded
                  </td>
                </tr>
              ) : (
                chronicConditions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ChronicDisease}</td>
                    <td>{item.ChronicTreatment || '-'}</td>
                    <td>
                      {item.LastSyncedAt
                        ? new Date(item.LastSyncedAt).toLocaleDateString('en-IN')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default StudentSickProfile
