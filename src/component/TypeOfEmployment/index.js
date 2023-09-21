const TypeOfEmployment = props => {
  const {allTypes, updateEmploymentTypesChecked} = props
  const {employmentTypeId, label} = allTypes

  const onChangeEmpType = () => {
    updateEmploymentTypesChecked(employmentTypeId)
  }

  return (
    <li className="">
      <input
        onChange={onChangeEmpType}
        className="m-1"
        type="checkbox"
        id={employmentTypeId}
      />
      <label className="m-1" htmlFor={employmentTypeId}>
        {label}
      </label>
    </li>
  )
}

export default TypeOfEmployment
