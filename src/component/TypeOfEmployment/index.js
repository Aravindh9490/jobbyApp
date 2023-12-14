const TypeOfEmployment = props => {
  const {id, label, updateTypesChecked, type} = props

  const onChangeEmpType = () => {
    if (type === 'employees') {
      updateTypesChecked(id)
    } else if (type === 'location') {
      updateTypesChecked(label)
    }
  }

  return (
    <li className="">
      <input
        onChange={onChangeEmpType}
        className="m-1"
        type="checkbox"
        id={id}
      />
      <label className="m-1" htmlFor={id}>
        {label}
      </label>
    </li>
  )
}

export default TypeOfEmployment
