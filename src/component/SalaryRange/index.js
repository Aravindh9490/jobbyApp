const SalaryRange = props => {
  const {salary, updateSalaryRangeId} = props
  const {salaryRangeId, label} = salary
  const onClickRange = () => {
    updateSalaryRangeId(salaryRangeId)
  }

  return (
    <li>
      <input
        className="m-1"
        type="radio"
        id={salaryRangeId}
        name="salaryRange"
        onChange={onClickRange}
      />
      <label className="m-1" htmlFor={salaryRangeId}>
        {label}
      </label>
    </li>
  )
}

export default SalaryRange
