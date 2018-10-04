import React, { Component } from 'react'
import Medication from './Medication'
import AddMedicationForm from './AddMedicationForm'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
// import {API_ENDPOINT} from '../Constants'

class MedicationList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      medications: [],
      showAddForm: false,
      query: '',
      patients: []
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.onCountChange = this.onCountChange.bind(this)
    // this.deleteMedication = this.deleteMedication.bind(this)
    this.showMedicationForm = this.showMedicationForm.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.draftsQuery.refetch()
    }
  }


  addPatient(id, patient) {
    console.log(patient)
  }

  onNameChange(id, name) {
    const medications = this.state.medications.map(medication =>
      (medication.id !== id) ?
        medication :
        {
          ...medication,
          name
        }
    )
    this.setState({ medications })
  }

  handleSearch(e) {
    this.setState({
      query: e.target.value
    })
  }

  // deleteMedication(e, id) {
  //   e.preventDefault()
  //   fetch(API_ENDPOINT+'/medications/'+id, {
  //     method: 'DELETE',
  //     headers: {'Content-Type': 'application/json'}
  //   }).then(
  //     (response) => {
  //       if(response.ok) {
  //         const medications = this.state.medications.filter(
  //           medication => medication.id !== id
  //         )
  //         this.setState({
  //           medications
  //         })
  //       }
  //     }
  //   ).catch(err => {
  //     this.setState({
  //       isLoaded:true
  //     })
  //   })
  // }

  onCountChange(id, count) {
    const medications = this.state.medications.map(medication =>
      (medication.id !== id) ?
        medication :
        {
          ...medication,
          count
        }
    )
    this.setState({ medications })
  }

  showMedicationForm() {
    this.setState({ showAddForm: true })
  }

  render() {
    const { onNameChange } = this
    const { error, isLoaded, medications, showAddForm, query } = this.state

    return (
      <div className="container">
        <div className="row margin-bottom function-card">
          <div className="col-md-6 offset-md-3">
            <button
              onClick={this.showMedicationForm}
              className="btn list-card-button margin-bottom"
            >
              <i className="fas fa-plus"></i>
            </button>
            <input
              className="form-input-field"
              type="text"
              placeholder="Search..."
              onChange={e => this.handleSearch(e)}
            />
          </div>
        </div>
        <div className="col-md-4">
        </div>
        <div className="row">
          {this.props.medicationQuery.medications &&
            this.props.medicationQuery.medications.map(medication => {
              return(medication.name.toLowerCase().search(query.toLowerCase()) !== -1) ?
              (
                <Medication
                  key={medication.id} {...medication}
                  onNameChange={(name) => onNameChange(medication.id, name)}
                  saveMedication={(e) => this.saveMedication(e, medication.id)}
                  onCountChange={(count) => this.onCountChange(medication.id, count)}
                  deleteMedication={(e) => this.deleteMedication(e, medication.id)}
                  addPatient={(patient) => this.addPatient(medication.id, patient)}
                  allPatients={this.state.patients}
                  client={this.props.client}
                />
              ) : (
                null
              )
              // )
            }
            )}
        </div>
        {showAddForm ? (
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <AddMedicationForm addMedication={this.addMedication} />
                </div>
              </div>
            </div>
          </div>
        ) : (null)}
      </div>
    )
  }
}

const MEDICATION_QUERY = gql`
  query MedicationQuery {
    medications {
      id
      name
      count
    }
  }
`

export default graphql(MEDICATION_QUERY, {
  name: 'medicationQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(MedicationList)