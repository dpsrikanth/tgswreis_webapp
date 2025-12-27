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
                <th>Date</th>
                <th>Health Issue</th>
                <th>Category</th>
                <th>Temperature</th>
                <th>Clinical Details</th>
                <th>Action Taken</th>
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
                    <td>{item.HealthIssueTitle}</td>
                    <td>
                      {item.IsFever === 1
                        ? 'Fever'
                        : item.IsFoorneCase === 1
                        ? 'Food Borne'
                        : item.EmergencyLevel
                        ? 'Emergency'
                        : 'General'}
                    </td>
                    <td>{item.ClinicalTemperature || '-'}</td>
                    <td>{item.ClinicalDetails || '-'}</td>
                    <td>{item.ClinicalActionTaken || '-'}</td>
                    <td>{item.EmergencyLevel || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Chronic Conditions */}
      {activeTab === 'chronic' && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Condition</th>
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
