import React,{ useEffect,useRef,useState }  from 'react'
import { useSelector } from 'react-redux'
import ZoneSickReport from './ZoneSickReport'
import DistrictSickReport from './DistrictSickReport'
import SchoolSickReport from './SchoolSickReport'
import CategorySickReport from './CategorySickReport'
import StudentSickList from './StudentSickList'
import StudentSickProfile from './StudentSickProfile'
import DailySickReport from './DailySickReport'

const DrilldownReport = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const profile = useSelector((state) => state.userappdetails.profileData)
    const { ZoneId, DistrictId } = profile
    const isStateAdmin = ZoneId === 0 && DistrictId == null
const isZoneUser = ZoneId > 0 && DistrictId == null
const isDistrictUser = ZoneId == null && DistrictId > 0

    const [selectedZone,setSelectedZone] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedSchool,setSelectedSchool] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const handleZoneClick = (ZoneId,ZoneName) => setSelectedZone({ZoneId,ZoneName});
    const handleSchoolClick = (SchoolId,PartnerName,SchoolCode) => setSelectedSchool({SchoolId,PartnerName,SchoolCode});

    const handleBack = () => {
        if (selectedStudent) setSelectedStudent(null)
    else if (selectedCategory) setSelectedCategory(null)
    else if (selectedSchool) setSelectedSchool(null)
    else if (selectedDistrict && !isDistrictUser) setSelectedDistrict(null)
    else if (selectedZone && isStateAdmin) setSelectedZone(null)
    };


  useEffect(() => {
  // District Officer → start at School level
  if (isDistrictUser) {
    setSelectedDistrict({ DistrictId })
  }
  // Zone Officer → start at District level
  else if (isZoneUser) {
    setSelectedZone({ ZoneId })
  }
  // State Admin → start at Zone level (do nothing)
}, [])



  return (
    <>
    <div className='mt-3'>
        {/* {!selectedZone && <ZoneSickReport  onZoneClick={handleZoneClick} />}
        {selectedZone && !selectedSchool && (
            <SchoolSickReport ZoneId={selectedZone.ZoneId} ZoneName={selectedZone.ZoneName} onSchoolClick={handleSchoolClick} onBack={handleBack} />
        )}
        {selectedSchool && (
            <DailySickReport 
            SchoolId={selectedSchool.SchoolId}
            PartnerName={selectedSchool.PartnerName}
            SchoolCode={selectedSchool.SchoolCode}
            onBack={handleBack}
            />
        )} */}

        <div className="mt-3">

      {/* Level 1: Zone */}
      {!selectedZone && isStateAdmin && (
        <ZoneSickReport
          onZoneClick={(ZoneId, ZoneName) =>
            setSelectedZone({ ZoneId, ZoneName })
          }
        />
      )}

      {/* Level 2: District */}
      {(isZoneUser || selectedZone) && !selectedDistrict && (
        <DistrictSickReport
          ZoneId={isZoneUser ? ZoneId : selectedZone.ZoneId}
          onDistrictClick={(DistrictId, DistrictName) =>
            setSelectedDistrict({ DistrictId, DistrictName })
          }
          onBack={handleBack}
        />
      )}

      {/* Level 3: School */}
      {selectedDistrict && !selectedSchool && (
        <SchoolSickReport
          DistrictId={selectedDistrict.DistrictId}
          onSchoolClick={(SchoolId, SchoolName, SchoolCode) =>
            setSelectedSchool({ SchoolId, SchoolName, SchoolCode })
          }
          onBack={handleBack}
        />
      )}

      {/* Level 4: Category */}
      {selectedSchool && !selectedCategory && (
        <CategorySickReport
          SchoolId={selectedSchool.SchoolId}
          SchoolName={selectedSchool.SchoolName}
          onCategoryClick={(category) =>
            setSelectedCategory(category)
          }
          onBack={handleBack}
        />
      )}

      {/* Level 5: Student list */}
      {selectedCategory && !selectedStudent && (
        <StudentSickList
          SchoolId={selectedSchool.SchoolId}
          Category={selectedCategory}
          onStudentClick={(UserId) =>
            setSelectedStudent(UserId)
          }
          onBack={handleBack}
        />
      )}

      {/* Level 6: Student profile */}
      {selectedStudent && (
        <StudentSickProfile
          UserId={selectedStudent}
          onBack={handleBack}
        />
      )}

    </div>
    </div>
    
    </>
  )
}

export default DrilldownReport