import React, { useState } from 'react'
import OperatorZoneSummary from '../pages/OperatorZoneSummary'
import OperatorStudentList from '../pages/OperatorStudentList'
import StudentSickProfile from './StudentSickProfile'

const OperatorHealthView = () => {
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleBack = () => {
    if (selectedStudent) {
      setSelectedStudent(null)
    } else if (selectedZone) {
      setSelectedZone(null)
      setSelectedCategory(null)
    }
  }

  return (
    <>
      {!selectedZone && (
        <OperatorZoneSummary
          onZoneSelect={(zone) => {setSelectedZone(zone)
             setSelectedCategory(zone.Category || null)
          }}
        />
      )}

      {selectedZone && !selectedStudent && (
        <OperatorStudentList
          ZoneId={selectedZone.ZoneId}
          ZoneName={selectedZone.ZoneName}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onStudentSelect={setSelectedStudent}
          onBack={handleBack}
        />
      )}

      {selectedStudent && (
        <StudentSickProfile
          UserId={selectedStudent}
          onBack={handleBack}
        />
      )}
    </>
  )
}

export default OperatorHealthView
