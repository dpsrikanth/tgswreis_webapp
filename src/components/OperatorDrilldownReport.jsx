import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import OperatorZoneSummary from './OperatorZoneSummary'
import OperatorStudentList from './OperatorStudentList'
import StudentSickProfile from '../common/StudentSickProfile'

const OperatorDrilldownReport = () => {
  const profile = useSelector((state) => state.userappdetails.profileData)
  const { ZoneId } = profile

  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const isZoneUser = ZoneId > 0

  useEffect(() => {
    // Auto-select zone for zone-level operators
    if (isZoneUser) {
      setSelectedZone({ ZoneId })
    }
  }, [])

  const handleBack = () => {
    if (selectedStudent) {
      setSelectedStudent(null)
    } else if (selectedCategory) {
      setSelectedCategory(null)
    } else if (selectedZone && !isZoneUser) {
      setSelectedZone(null)
    }
  }

  return (
    <div className="mt-3">

      {/* LEVEL 1: Zone summary (only for state-level operator) */}
      {!selectedZone && !isZoneUser && (
        <OperatorZoneSummary
          onZoneSelect={(zone) => setSelectedZone(zone)}
        />
      )}

      {/* LEVEL 2: Student list (category is FILTER, not level) */}
      {selectedZone && !selectedStudent && (
        <OperatorStudentList
          ZoneId={selectedZone.ZoneId}
          ZoneName={selectedZone.ZoneName}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onStudentSelect={(userId) => setSelectedStudent(userId)}
          onBack={handleBack}
        />
      )}

      {/* LEVEL 3: Student profile (REUSED) */}
      {selectedStudent && (
        <StudentSickProfile
          UserId={selectedStudent}
          onBack={handleBack}
          mode="operator"   // optional flag if needed
        />
      )}

    </div>
  )
}

export default OperatorDrilldownReport
