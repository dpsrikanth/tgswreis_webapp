import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'

const DistrictSickReport = ({
  ZoneId,
  ZoneName,
  onDistrictClick,
  onBack
}) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)

  const [districtData, setDistrictData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDistrictData = async () => {
    try {
      setLoading(true)

      const payload = { ZoneId }
      const res = await _fetch(
        'sickdistrictsummary',
        payload,
        false,
        token
      )

      if (res.status === 'success') {
        setDistrictData(res.data)
      } else {
        console.error('Error fetching district data')
      }
    } catch (error) {
      console.error('Error fetching district data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistrictData()
  }, [ZoneId])

  return (
    <>
      <div className="row align-items-center mb-2">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            District Wise Sick Report – {ZoneName}
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            Back to Zones
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>District Name</th>
              <th>General Sick</th>
              <th>Sent Home</th>
              <th>Referred</th>
              <th>Admitted</th>
              <th>Fever</th>
              <th>Food Borne</th>
              <th>Emergency</th>
              <th>Atmost Emergency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : districtData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              districtData.map((item) => (
                <tr key={item.DistrictId}>
                  <td>{item.DistrictName}</td>
                  <td>{item.GeneralSick}</td>
                  <td>{item.SentHome}</td>
                  <td>{item.ReferredToHospital}</td>
                  <td>{item.AdmittedToHospital}</td>
                  <td>{item.FeverCases}</td>
                  <td>{item.FoodBorneCases}</td>
                  <td>{item.EmergencyCases}</td>
                  <td>{item.AtmostEmergencyCases}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        onDistrictClick(
                          item.DistrictId,
                          item.DistrictName
                        )
                      }
                    >
                      View Schools
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DistrictSickReport
