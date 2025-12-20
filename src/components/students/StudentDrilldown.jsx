import React, { useEffect } from 'react'
import ZonesTable from './ZonesTable'
import DistrictsTable from './DistrictsTable'
import SchoolsTable from './SchoolsTable'
import StudentsTable from './StudentsTable'
import ClassSectionTable from './ClassSectionTable'
import { useState } from 'react'
import StudentProfile from './StudentProfile'
import { _fetch } from '../../libs/utils'
import { useSelector } from 'react-redux';

const LEVELS = {
    ZONE: 'ZONE',
    DISTRICT: 'DISTRICT',
    SCHOOL: 'SCHOOL',
    CLASS: 'CLASS',
    STUDENTS: 'STUDENTS',
    PROFILE: 'PROFILE'
};

const StudentDrilldown = () => {

const [level,setLevel] = useState(LEVELS.ZONE);
const token = useSelector((state) => state.userappdetails.TOKEN);
const [context,setContext] = useState({});
const [summary,setSummary] = useState([]);

const handleBack = () => {
    if(level === LEVELS.PROFILE) setLevel(LEVELS.STUDENTS);
    else if(level === LEVELS.STUDENTS) setLevel(LEVELS.CLASS);
    else if(level === LEVELS.CLASS) setLevel(LEVELS.SCHOOL);
    else if(level === LEVELS.SCHOOL) setLevel(LEVELS.DISTRICT);
    else if(level === LEVELS.DISTRICT) setLevel(LEVELS.ZONE);
};

const fetchSummary = async () => {
  try{
  _fetch('studentsummary',null,false,token).then(res => {
    if(res.status === 'success'){
      setSummary(res.data);
    }else{
      toast.error(res.message);
    }
  })

 }catch(error){
  console.error('Error fetching Summary',error)
 } 
}


useEffect(() => {
 fetchSummary();

},[])



  return (
    <div className="mt-3">
      {level === LEVELS.ZONE && (
        <ZonesTable
        zones = {summary?.perZone || []}
          onSelect={(zone) => {
            setContext({ zone });
            setLevel(LEVELS.DISTRICT);
          }}
        />
      )}

      {level === LEVELS.DISTRICT && (
        <DistrictsTable
         districts={summary?.perDistrict || []}
          zoneId={context.zone.ZoneId}
          onBack={handleBack}
          onSelect={(district) => {
            setContext((c) => ({ ...c, district }));
            setLevel(LEVELS.SCHOOL);
          }}
        />
      )}

      {level === LEVELS.SCHOOL && (
        <SchoolsTable
          schools ={summary?.perSchool || []}
          districtId={context.district.DistrictId}
          onBack={handleBack}
          onSelect={(school) => {
            setContext((c) => ({ ...c, school }));
            setLevel(LEVELS.CLASS);
          }}
        />
      )}

      {level === LEVELS.CLASS && (
        <ClassSectionTable
          schoolId={context.school.SchoolID}
          onBack={handleBack}
          onSelect={(cls) => {
            setContext((c) => ({ ...c, classSection: cls }));
            setLevel(LEVELS.STUDENTS);
          }}
        />
      )}

      {level === LEVELS.STUDENTS && (
        <StudentsTable
          schoolId={context.school.SchoolID}
          classId={context.classSection.ClassID}
          sectionId={context.classSection.SectionID}
           onSelect={(std) => {
            setContext((s) => ({ ...s, Students: std }));
            setLevel(LEVELS.PROFILE);
          }}
          onBack={handleBack}
        />
      )}

      {level === LEVELS.PROFILE && (
        <StudentProfile 
        userId = {context.Students.UserId}
        schoolId = {context.school.SchoolID}
        onBack={handleBack} />
        
      )}
    </div>
  )
}

export default StudentDrilldown