import  React, {Component} from 'react'

const AddScheduleForm = ({addSchedule=f=>f}) => {
  let _time
  const submit = e => {
    e.preventDefault()
    addSchedule(_time.value)
    _time.value=''
  }

  return(
  <div className="col-md-4 margin-bottom">
    <div className="list-card">
      <div className="card-body">
        <form onSubmit={submit}>
          <div className="form-group">
            <input
              ref={input => _time = input}
              id="timeInput"
              type="number"
              className="form-input-field"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Schedule hour..."
            />
            <div id="button-bar" className="">
              <button className="btn list-card-button off-green">
                <i
                  className="fas fa-plus"
                ></i>
              </button>
            </div>       
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default AddScheduleForm