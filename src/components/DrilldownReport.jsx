import React,{ useEffect,useRef,useState }  from 'react'
import { useSelector } from 'react-redux'
import ZoneSickReport from './ZoneSickReport'
import SchoolSickReport from './SchoolSickReport'
import DailySickReport from './DailySickReport'

const DrilldownReport = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const [selectedZone,setSelectedZone] = useState(null);
    const [selectedSchool,setSelectedSchool] = useState(null);

    const handleZoneClick = (ZoneId,ZoneName) => setSelectedZone({ZoneId,ZoneName});
    const handleSchoolClick = (SchoolId,PartnerName,SchoolCode) => setSelectedSchool({SchoolId,PartnerName,SchoolCode});

    const handleBack = () => {
        if(selectedSchool) setSelectedSchool(null);
        else if (selectedZone) setSelectedZone(null);
    };

  return (
    <>
    <div className='mt-3'>
        {!selectedZone && <ZoneSickReport  onZoneClick={handleZoneClick} />}
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
        )}
    </div>
    
    </>
  )
}

export default DrilldownReport