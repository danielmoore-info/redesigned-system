import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import Medication from './Medication'

class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      time: this.props.time,
      medications: this.props.medications,
      showAllMedications: false,
      showSave: false,
    }
    this.showAllMedications = this.showAllMedications.bind(this)
    this.saveSchedule = this.saveSchedule.bind(this)
    this.deleteSchedule = this.deleteSchedule.bind(this)
  }

  showAllMedications() {
    this.setState({
      showAllMedications: !this.state.showAllMedications
    })
  }

  async deleteSchedule() {
    const id = this.props.id
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
        this.setState({ loading: false })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true
      })
    })
  }

  async saveSchedule(e) {
    const { id, time, medications } = this.state
    const token = this.props.token
    const meds = medications.map(medication => {
      return (
        `{id: "${medication.id}"}`
      )
    })
    const query = JSON.stringify({
      query: `mutation {
        updateSchedule(
          id: "${id}"
          time: ${time}
          medications: [
            ${meds}
          ] 
        ){
          id
          time
        }
      }`
    })
    fetch('http://localhost:4000', {
      method: 'POST',
      body: query,
      headers: {
        'Authorization': 'Bearer ' + token,
        'content-type': 'application/json'
      }
    }).then(
      result => {
        this.setState({
          showSave: false
        })
      }
    ).catch(err => {
      console.log(err)
    })
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
                <div>
                  <p>Loading</p>
                </div>
              ) :
              (
                <div>
                  <div className="form-group row">
                    <label className="col-sm-6 col-form-label" htmlFor="timeInput">Hour:</label>
                    <div className="col-sm-6">
                      <input
                        id="timeInput"
                        type="number"
                        className="form-input-field smaller"
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
                  <label className="col-form-label" htmlFor="timeInput">Medications:</label>
                  <div className="medicationList">
                    {this.state.medications &&
                      this.state.medications.map(medication =>
                        <div className="nested-list-item">
                          <p>Name: {medication.name}</p>
                          <p>Dose: {medication.dose}</p>
                        </div>
                      )
                    }
                      <div className="customf">
                        <button id="cunt" className="btn list-card-button grey-blue" onClick={this.showAllMedications}>
                          <i
                            className="fas fa-plus"
                          ></i>
                        </button>
                      </div>
                  </div>
                  {this.state.showAllMedications ? (
                    <div>
                      {this.props.all_medications.map(medication =>
                        <div
                          className="nested-list-item"
                          onClick={(e) => this.addMedicationToList(e, medication)}
                        >
                          <p>Name: {medication.name}</p>
                          <p>Dose: {medication.dose}</p>
                        </div>
                      )}
                    </div>
                  ) : (null)}
                  <div id="button-bar" className="">
                    <button className="btn list-card-button marone" onClick={this.deleteSchedule}>
                      <i
                        className="fas fa-times"
                      ></i>
                    </button>
                    {!this.state.showSave ? (null) : (
                      <button className="btn list-card-button off-green" onClick={this.saveSchedule}>
                        <i
                          className="fas fa-save"
                        ></i>
                      </button>
                    )}

                  </div>
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

const DELETE_SCHEDULE_MUTATION = gql`
  mutation DeleteScheduleMutation($id: ID!) {
    deleteSchedule(id: $id) {
      id
    }
  }
`
export default compose(
  // graphql(UPDATE_SCHEDULE_MUTATION, {
  //   name: 'updateSchedule'
  // }),
  graphql(DELETE_SCHEDULE_MUTATION, {
    name: 'deleteSchedule'
  })
)(Schedule)