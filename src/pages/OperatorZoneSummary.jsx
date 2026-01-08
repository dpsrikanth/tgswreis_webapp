import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { _fetch } from '../libs/utils'

const OperatorZoneSummary = ({ onZoneSelect }) => {
  const token = useSelector((state) => state.userappdetails.TOKEN)
  const [zones, setZones] = useState([])

  useEffect(() => {
    fetchZones()
  }, [])


  const fetchZones = async () => {
    const res = await _fetch('operatorzonesummary',null, false, token)
    if (res.status === 'success') {
      setZones(res.data)
    }
  }


  const CATEGORY_CONFIG = [
  { label: 'General', key: 'GeneralSick', value: 'GENERAL' },
  { label: 'Fever', key: 'Fever', value: 'FEVER' },
  { label: 'Admitted', key: 'Admitted', value: 'ADMITTED', danger: true },
  { label: 'Referred', key: 'Referred', value: 'REFERRED' },
  {label: 'Sent Home', key: 'SentHome', value: 'SENT_HOME'}
]


  return (
    <div className="row g-3 pt-3">
      <div className="col-sm-12">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Zone Wise Summary
          </h5>
        </div>
      {zones.map((zone, idx) => (
        <div key={idx} className="col-md-4">
         <div className="white-box shadow-sm border">
  <h6 className="fw-bold">{zone.ZoneName}</h6>

  {CATEGORY_CONFIG.map(cat => (
    <div
      key={cat.value}
      className="d-flex justify-content-between mt-2"
      style={{
        cursor: zone[cat.key] > 0 ? 'pointer' : 'default',
        opacity: zone[cat.key] > 0 ? 1 : 0.5
      }}
      onClick={() => {
        if (zone[cat.key] > 0) {
          onZoneSelect({
            ZoneId: zone.ZoneId,
            ZoneName: zone.ZoneName,
            Category: cat.value
          })
        }
      }}
    >
      <span>{cat.label}</span>
      <span className={`fw-bold ${cat.danger ? 'text-danger' : ''}`}>
        {zone[cat.key]}
      </span>
    </div>
  ))}
</div>

        </div>
      ))}
    </div>
  )
}

export default OperatorZoneSummary
