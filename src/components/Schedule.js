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
  }

  showAllMedications(){
    this.setState({
      showAllMedications: !this.state.showAllMedications
    })
  }

  async saveSchedule(e) {
    const {id, time, medications} = this.state
    const token = this.props.token
    const meds = medications.map(medication => {
      return(
        {
          id:medication.id
        }
      )
    })
    const query = JSON.stringify({
      query: `mutation {
        updateSchedule(
          id: "${id}"
          medications: [
            ${meds}
          ] 
        ){
          id
          time
        }
      }`
    })
    // console.log(test)
    // console.log(this.props.token)
    const response = fetch('http://localhost:4000', {
      method: 'POST',
      body: query,
      headers: {
        'Authorization': 'Bearer ' + token,
        'content-type': 'application/json'
      }
    })

    const responseJson = await response.json()
    console.log(responseJson.data)
    // .then(res => res.json())
    // .then(res => console.log(res.data))
    // .catch(err => {
    //   console.log(err)
    // })
    // e.preventDefault()
    // // // this.setState({
    // // //   loading:true
    // // // })
    // this.props.updateSchedule({
    //   variables: {
    //     time,
    //     meds
    //   },
    // }).then(
    //   result => {
    //     this.setState({
    //       loading: false,
    //       showSave:false
    //     })
    //   }
    // ).catch(err => {
    //   this.setState({
    //     loading: false,
    //     error: true
    //   })
    // })
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
                  <div className="form-group">
                    <input
                      id="timeInput"
                      type="number"
                      className="form-input-field text-look"
                      value={this.state.time}
                      onChange={(e) => this.updateTime(e)}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      placeholder="Medication name..."
                    />
                  </div>
                  <div className="medicationList">
                    {this.state.medications &&
                      this.state.medications.map(medication => 
                        <div className="nested-list-item">
                          <p>Name: {medication.name}</p>
                          <p>Dose: {medication.dose}</p>
                        </div>
                      )
                      }
                    <button className="btn list-card-button off-green" onClick={this.showAllMedications}>
                      <i
                        className="fas fa-plus"
                      ></i>
                    </button>                      
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
                  ):(null)}
                  {/* <div className="form-group row">
                    <label className="col-sm-6 col-form-label" htmlFor="countInput">Left:</label>
                    <div className="col-sm-6">
                      <input
                        id="countInput"
                        type="number"
                        className="form-input-field smaller"
                        value={this.state.count}
                        onChange={(e) => this.updateCount(e)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        placeholder="Number of tablets"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-6 col-form-label" htmlFor="countInput">Dose:</label>
                    <div className="col-sm-6">
                      <input
                        id="countInput"
                        type="number"
                        className="form-input-field smaller"
                        value={this.state.dose}
                        onChange={(e) => this.updateDose(e)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        placeholder="Dose"
                      />
                    </div>
                  </div> */}
                  <div id="button-bar" className="">
                    <button className="btn list-card-button marone" onClick={this.deleteMedication}>
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

// const UPDATE_MEDICATION_MUTATION = gql`
//   mutation UpdateMedicationMutation($id: ID!, $name: String!, $count: Int!, $dose: Int!){
//     updateMedication(id: $id, name: $name, count: $count, dose: $dose){
//       id
//       name
//       count
//       dose
//     }
//   }
// `

const UPDATE_SCHEDULE_MUTATION = `
  mutation UpdateScheduleMutation($id:ID!, $time:Int!, $medications:[MedicationIdInput]){
    updateSchedule(id: $id, time:$time, medications: $medications){
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

// const UPDATE_SCHEDULE_MUTATION = gql`
//   mutation UpdateScheduleMutation($id:ID!, $time:Int!, $medications:[MedicationIdInput]){
//     updateSchedule(id: $id, time:$time, medications: $medications){
//       id
//       time
//       medications {
//         id
//         name
//         count
//         dose
//         dispenser
//       }
//     }
//   }
// `


const MEDICATION_QUERY = gql`
  query MedicationQuery {
    medications {
      id
      name
      count
    }
  }
`

// const DELETE_MEDICATION_MUTATION = gql`
//   mutation DeleteMedicationMutation($id: ID!) {
//     deleteMedication(id: $id){
//       id
//       name
//       count
//     }
//   }
// `

export default compose(
  // graphql(UPDATE_SCHEDULE_MUTATION, {
  //   name: 'updateSchedule'
  // }),
  // graphql(DELETE_MEDICATION_MUTATION, {
  //   name: 'deleteMedication'
  // })
)(Schedule)