import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import Medication from './Medication'

class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: this.props.time,
      medications: this.props.medications
    }

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
                      // onChange={(e) => this.updateName(e)}
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
                  </div>
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
                    <button className="btn list-card-button off-green" onClick={this.saveMedication}>
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

// const MEDICATION_QUERY = gql`
//   query MedicationQuery {
//     medications {
//       id
//       name
//       count
//     }
//   }
// `

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
  // graphql(UPDATE_MEDICATION_MUTATION, {
  //   name: 'updateMedication'
  // }),
  // graphql(DELETE_MEDICATION_MUTATION, {
  //   name: 'deleteMedication'
  // })
)(Schedule)