import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
const loader = require('../assets/spinner.svg')


class Medication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSave: false,
      name: this.props.name,
      count: this.props.count,
      dose: this.props.dose,
      dispenser: this.props.dispenser,
      showEdit: false,
      loading: false,
    }
    this.deleteMedication = this.deleteMedication.bind(this)
    this.saveMedication = this.saveMedication.bind(this)
    this.toggleShowEdit = this.toggleShowEdit.bind(this)
    this.initialState = this.state
  }

  toggleShowEdit() {
    this.setState({
      showEdit: !this.state.showEdit
    })
  }

  saveMedication(e) {
    const { name, count, dose, dispenser } = this.state
    e.preventDefault()
    this.setState({
      loading:true
    })
    this.props.updateMedication({
      variables: {
        name,
        count,
        dose,
        dispenser
      },
    }).then(
      result => {
        this.setState({
          loading: false,
          showSave: false,
          showEdit: false,
          errorMsg: ''
        })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true,
        errorMsg: "Error when saving medication"
      })
    })
  }

  updateName(e) {
    this.setState({
      showSave: true
    })
    e.preventDefault()
    const name = e.target.value
    this.setState({
      name: name
    })
  }

  updateCount(e) {
    this.setState({
      showSave: true
    })
    e.preventDefault()
    const count = e.target.value
    this.setState({
      count: count
    })
  }

  updateDose(e) {
    this.setState({
      showSave: true
    })
    e.preventDefault()
    const dose = e.target.value
    this.setState({
      dose: dose
    })
  }

  updateDispenser(e) {
    this.setState({
      showSave: true
    })
    e.preventDefault()
    const dispenser = e.target.value
    this.setState({
      dispenser: dispenser
    })
  }

  deleteMedication() {
    const id = this.props.id
    this.setState({
      loading: true
    })
    this.props.deleteMedication({
      variables: {
        id
      },
      update: (store, { data: { deleteMedication } }) => {
        const data = store.readQuery({ query: MEDICATION_QUERY })
        const new_data = data.medications.filter(
          medication => {
            return medication.id !== id
          }
        )

        data.medications = new_data
        store.writeQuery({ query: MEDICATION_QUERY, data })
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
        errorMsg: 'Failed to delete medication'
      })
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
                  src= {
                    loader
                  }
                />
              ) :
              (
                <div>
                  <div>
                    {this.state.errorMsg && 
                      <p className="error"><i class="fas fa-info-circle"></i> {this.state.errorMsg}</p>
                    }
                    <h4>{this.props.name}</h4>
                    <p>{this.props.count} pills remaining</p>
                    <p>{this.props.dose} pills in each dose</p>
                    <p>Currently assigned to dispenser {this.props.dispenser}</p>
                  </div>
                  <div id="button-bar" className="">
                    <button className="btn list-card-button btn-red" onClick={this.deleteMedication}>
                      <i
                        className="fas fa-times"
                      ></i>
                    </button>
                    {!this.state.showSave ? (null) : (
                      <button className="btn list-card-button btn-green" onClick={this.saveMedication}>
                        <i
                          className="fas fa-save"
                        ></i>
                      </button>
                    )}
                    <button className="btn list-card-button btn-grey" onClick={this.toggleShowEdit}>
                      <i class="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  {this.state.showEdit ? (
                    <div>
                      <div className="form-group">
                        <input
                          id="nameInput"
                          type="text"
                          className="form-input-field text-look"
                          value={this.state.name}
                          onChange={(e) => this.updateName(e)}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          placeholder="Medication name..."
                        />
                      </div>
                      <div className="form-group row">
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
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-6 col-form-label" htmlFor="dispenserInput">Dispenser:</label>
                        <div className="col-sm-6">
                          <input
                            id="dispenserInput"
                            type="number"
                            className="form-input-field smaller"
                            value={this.state.dispenser}
                            onChange={(e) => this.updateDispenser(e)}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            placeholder="Dose"
                          />
                        </div>
                      </div>
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

const UPDATE_MEDICATION_MUTATION = gql`
  mutation UpdateMedicationMutation($id: ID!, $name: String!, $count: Int!, $dose: Int!, $dispenser: Int){
    updateMedication(id: $id, name: $name, count: $count, dose: $dose, dispenser: $dispenser){
      id
      name
      count
      dose
      dispenser
    }
  }
`

const MEDICATION_QUERY = gql`
  query MedicationQuery {
    medications {
      id
      name
      count
      dose
      dispenser
    }
  }
`

const DELETE_MEDICATION_MUTATION = gql`
  mutation DeleteMedicationMutation($id: ID!) {
    deleteMedication(id: $id){
      id
      name
      count
    }
  }
`

export default compose(
  graphql(UPDATE_MEDICATION_MUTATION, {
    name: 'updateMedication'
  }),
  graphql(DELETE_MEDICATION_MUTATION, {
    name: 'deleteMedication'
  })
)(Medication)