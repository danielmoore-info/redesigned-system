import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
const loader = require('../assets/spinner.svg')


class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      time: this.props.time,
      medications: this.props.medications,
      showAllMedications: false,
      showSave: false,
      showEdit: false,
      loading: false,
      errorMsg: ''
    }
    this.showAllMedications = this.showAllMedications.bind(this)
    this.saveSchedule = this.saveSchedule.bind(this)
    this.deleteSchedule = this.deleteSchedule.bind(this)
    this.toggleShowEdit = this.toggleShowEdit.bind(this)
  }

  showAllMedications() {
    this.setState({
      showAllMedications: !this.state.showAllMedications
    })
  }

  toggleShowEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    })
  }

  async deleteSchedule() {
    const id = this.props.id
    this.setState({
      loading: true
    })
    this.props.deleteSchedule({
      variables: {
        id
      },
      update: (store, { data: { deleteSchedule } }) => {
        const data = store.readQuery({ query: SCHEDULE_QUERY })
        const new_data = data.schedules.filter(
          schedule => {
            return schedule.id !== id
          }
        )
        data.schedules = new_data
        store.writeQuery({ query: SCHEDULE_QUERY, data })
      }
    }).then(
      result => {
        this.setState({
          loading: false,
          errorMsg: ''
        })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true,
        errorMsg: 'Error when deleting schedule'
      })
    })
  }

  async saveSchedule(e) {
    const { id, time, medications } = this.state
    const new_list = medications.map(medication => {
      return { id: medication.id }
    })
    this.setState({
      loading: true
    })
    this.props.updateSchedule({
      variables: {
        id,
        time,
        medications: new_list,
      },
      update: (store, { data: { updateSchedule } }) => {
        const data = store.readQuery({ query: SCHEDULE_QUERY })
        const x = data.schedules.map(schedule =>
          (schedule.id != id) ?
            schedule : {
              ...updateSchedule
            }

        )
        data.schedules = x
        store.writeQuery({ query: SCHEDULE_QUERY, data })
      }
    }).then(
      result => {
        this.setState({
          loading: false,
          showSave: false,
          errorMsg: '',
        })
      }
    ).catch(
      err => {
        this.setState({
          loading: false,
          errorMsg: 'Error when updating schedule'
        })
      }
    )
  }

  updateTime(e) {
    this.setState({
      showSave: true
    })
    e.preventDefault()
    const time = e.target.value
    this.setState({
      time: time
    })
  }

  addMedicationToList(e, medication) {
    e.preventDefault()
    const medications = [
      ...this.state.medications,
      medication
    ]
    this.setState({
      showSave: true,
      showAllMedications: false,
      medications
    })
  }

  render() {
    return (
      <div className="col-md-4 margin-bottom">
        <div className="list-card">
          <div className="card-body">
            {this.state.loading ?
              (
                <img
                  className="center-me"
                  height="100px"
                  width="100px"
                  alt="loading icon"
                  src={
                    loader
                  }
                />
              ) :
              (
                <div>
                  <div onClick={this.toggleShowEdit}>
                    {this.state.errorMsg &&
                      <p className="error"><i class="fas fa-info-circle"></i> {this.state.errorMsg}</p>
                    }
                    <h4>{this.props.time}:00</h4>
                    <div id="button-bar" className="">
                      <button className="btn list-card-button btn-red" onClick={this.deleteSchedule}>
                        <i
                          className="fas fa-times"
                        ></i>
                      </button>
                      {!this.state.showSave ? (null) : (
                        <button className="btn list-card-button btn-green" onClick={this.saveSchedule}>
                          <i
                            className="fas fa-save"
                          ></i>
                        </button>
                      )}
                    </div>
                  </div>
                  {this.state.showEdit ? (
                    <div>
                      <hr/>
                      <h5>Edit Schedule</h5>
                      <div className="form-group row">
                        <label className="col-sm-6 col-form-label" htmlFor="timeInput">Hour:</label>
                        <div className='col-sm-6'>
                          <input
                            id="timeInput"
                            type="number"
                            className="form-control"
                            value={this.state.time}
                            onChange={(e) => this.updateTime(e)}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            placeholder="Schedule time..."
                          />
                        </div>
                      </div>
                      <div className='form-group'>
                        <label className="col-form-label" htmlFor="timeInput">Medications:</label>
                        <div className="medicationList">
                          {this.state.medications &&
                            this.state.medications.map(medication =>
                              <div key={medication.id} className="nested-list-item">
                                <p>Name: {medication.name}</p>
                                <p>Dose: {medication.dose}</p>
                              </div>
                            )
                          }
                          <div className="customf">
                            <button id="cunt" className="btn" onClick={this.showAllMedications}>
                              <i
                                className="fas fa-plus"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (null)}
                  {this.state.showAllMedications ? (
                    <div>
                      {this.props.all_medications.map(medication =>
                        <div
                          key={medication.id}
                          className="nested-list-item"
                          onClick={(e) => this.addMedicationToList(e, medication)}
                        >
                          <p>Name: {medication.name}</p>
                          <p>Dose: {medication.dose}</p>
                        </div>
                      )}
                    </div>
                  ) : (null)}
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

const SCHEDULE_QUERY = gql`
  query ScheduleQuery {
    schedules {
      id
      time
      medications{
        id
        name
        count
        dose
        dispenser
      }
      takenTime
    }
  }
`

const UPDATE_SCHEDULE_MUTATION = gql`
  mutation UpdateScheduleMutation($id:ID!, $time:Int!, $medications:[MedicationIdInput]){
    updateSchedule(id:$id, time:$time, medications:$medications){
      id
      time
      medications {
        id
        name
        count
        dose
        dispenser
      }
    }
  }
`

const DELETE_SCHEDULE_MUTATION = gql`
  mutation DeleteScheduleMutation($id: ID!) {
    deleteSchedule(id: $id) {
      id
    }
  }
`
export default compose(
  graphql(UPDATE_SCHEDULE_MUTATION, {
    name: 'updateSchedule'
  }),
  graphql(DELETE_SCHEDULE_MUTATION, {
    name: 'deleteSchedule'
  })
)(Schedule)