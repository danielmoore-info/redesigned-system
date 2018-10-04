import  React, {Component} from 'react'

const AddMedicationForm = ({addMedication=f=>f}) => {
  let _name, _count
  const submit = e => {
    e.preventDefault()
    addMedication(_name.value, _count.value)
    _name.value=''
    _count.value=''
  }

  return(
    <form onSubmit={submit}>
      <div className="form-group">
        <label htmlFor="medicationNameInput">Name</label>
        <input
          ref={input => _name = input}
          type="text"
          className="form-control"
          id="medicationNameInput"
        />
      </div>
      <div className="form-group">
        <label htmlFor="medicationCountInput">Count</label>
        <input
          ref={input => _count = input}
          type="number"
          className="form-control"
          id="medicationCountInput"
        />
      </div>
      <button className="btn btn-primary">Add</button>
    </form>
  )
}

export default AddMedicationForm