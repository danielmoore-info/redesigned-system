import  React, {Component} from 'react'

const AddMedicationForm = ({addMedication=f=>f}) => {
  let _name, _count, _dose, _dispenser
  const submit = e => {
    e.preventDefault()
    addMedication(_name.value, _count.value, _dose.value, _dispenser.value)
    _name.value=''
    _count.value=''
  }

  return(
  <div className="col-md-4 margin-bottom">
    <div className="list-card">
      <div className="card-body">
        <div>
          <form onSubmit={submit}>
            <input
              ref={input => _name = input}
              type="text"
              className="form-input-field"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder="Medication name..."
            />
            <input
              ref={input => _count = input}
              type="number"
              className="form-input-field smaller"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder="Number of tablets"
            />
            <input
              ref={input => _dose = input}
              type="number"
              className="form-input-field smaller"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder="Dose of medication"
            />
            <input
              ref={input => _dispenser = input}
              type="number"
              className="form-input-field smaller"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder="Dispenser number"
            />
              <div id="button-bar" className="">
                <button className="btn list-card-button off-green">
                  <i
                    className="fas fa-plus"
                  ></i>
                </button>
              </div> 
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AddMedicationForm