import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'
import { useNavigate } from 'react-router-dom'

const HealthSupervisorsList = ({ ZoneId, DistrictId }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const fetchSupervisors = async () => {
    try {
      setLoading(true)

 let payload ={};
       if (DistrictId && DistrictId !== 0) {
      payload.DistrictId = DistrictId;
    } else if (ZoneId && ZoneId !== 0) {
      payload.ZoneId = ZoneId;
    }

      const res = await _fetch(
        'healthsupervisorslist',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setSupervisors(res.data)
      }
    } catch (error) {
      console.error('Error fetching health supervisors', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSupervisors()
  }, [ZoneId, DistrictId])

  return (
    <>
    <div className='white-box shadow-sm'>
      <div className="row align-items-center mb-3">
        <div className='col-sm-6'>
        <h5 className="fw-bold" style={{ color: '#cc1178' }}>
        Health Supervisors List
      </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sickdashboard')}>
            Back
          </button>
        </div>
      </div>
      

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>School</th>
              <th>District</th>
              <th>Zone</th>
              <th>Supervisor Name</th>
              <th>Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : supervisors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No supervisors found
                </td>
              </tr>
            ) : (
              supervisors.map((item, index) => (
                <tr key={index}>
                  <td>{item.SchoolName}</td>
                  <td>{item.DistrictName}</td>
                  <td>{item.ZoneName}</td>
                  <td className="fw-bold">
                    {item.HealthSupervisorName}
                  </td>
                  <td>
                    <a href={`tel:${item.HealthSupervisorMobile}`}>
                      {item.HealthSupervisorMobile}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
     
    </>
  )
}

export default HealthSupervisorsList
