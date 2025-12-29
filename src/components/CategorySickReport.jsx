import React from 'react'

const CategorySickReport = ({
  SchoolId,
  SchoolName,
  onCategoryClick,
  onBack
}) => {

  const issueCategories = [
    { key: 'GENERAL_SICK', label: 'General Sick', color: 'secondary' },
    { key: 'SENT_HOME', label: 'Sent Home on Sick Grounds', color: 'info' },
    { key: 'REFERRED', label: 'Referred to Hospital', color: 'warning' },
    { key: 'ADMITTED', label: 'Admitted to Hospital', color: 'danger' }
  ]

  const conditionCategories = [
    { key: 'FEVER', label: 'Fever Cases', color: 'danger' },
    { key: 'FOODBORNE', label: 'Food Borne', color: 'success' },
    { key: 'EMERGENCY', label: 'Emergency', color: 'dark' },
    { key: 'ATMOST', label: 'Atmost Emergency', color: 'primary' }
  ]

  return (
    <>
      <div className="row align-items-center mb-3">
        <div className="col-sm-6">
          <h5 className="fw-bold" style={{ color: '#cc1178' }}>
            Select Category – {SchoolName}
          </h5>
        </div>
        <div className="col-sm-6 text-end">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
            Back to Schools
          </button>
        </div>
      </div>

      {/* 🔹 Health Issue Categories */}
      <h6 className="fw-bold mb-2">Health Issue Type</h6>
      <div className="row mb-4">
        {issueCategories.map(cat => (
          <div className="col-md-3 mb-3" key={cat.key}>
            <div
              className={`card text-center border-${cat.color}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onCategoryClick(cat.key)}>
              <div className={`card-body text-${cat.color}`}>
                <h6 className="card-title">{cat.label}</h6>
                <small>Click to view students</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Special Conditions */}
      <h6 className="fw-bold mb-2">Special Conditions</h6>
      <div className="row">
        {conditionCategories.map(cat => (
          <div className="col-md-3 mb-3" key={cat.key}>
            <div
              className={`card text-center border-${cat.color}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onCategoryClick(cat.key)}
            >
              <div className={`card-body text-${cat.color}`}>
                <h6 className="card-title">{cat.label}</h6>
                <small>Click to view students</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default CategorySickReport
