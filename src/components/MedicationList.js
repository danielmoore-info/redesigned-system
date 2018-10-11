import React, { Component } from 'react'
import Medication from './Medication'
import AddMedicationForm from './AddMedicationForm'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
// import {API_ENDPOINT} from '../Constants'

class MedicationList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      loading: false,
      medications: [],
      showAddForm: false,
      query: '',
      patients: []
    }
    this.showMedicationForm = this.showMedicationForm.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.addMedication = this.addMedication.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.draftsQuery.refetch()
    } true
  }



  handleSearch(e) {
    this.setState({
      query: e.target.value
    })
  }

  addMedication(name, count, dose, dispenser) {
    this.setState({
      loading: true
    })
    this.props.addMedication({
      variables: {
        name,
        count,
        dose,
        dispenser
      },
      update: (store, { data: { createMedication } }) => {
        const data = store.readQuery({ query: MEDICATION_QUERY })
        data.medications.unshift(createMedication)
        store.writeQuery({query: MEDICATION_QUERY, data})
      }
    })
      .then(
        result => {
          this.setState({
            loading: false,
            showAddForm: false
          })
        }
      ).catch(err => {
        this.setState({
          error: true,
          loading: false
        })
      })
  }

  _subsribeToChanges = subscribeToMore => {
    subscribeToMore({
      document: MEDICATION_CHANGES_SUBSCRIPTION
    })
  }


  showMedicationForm() {
    this.setState({ showAddForm: !this.state.showAddForm })
  }

  render() {
    const { onNameChange } = this
    const { error, isLoaded, medications, showAddForm, query } = this.state
    const {subscribeToMore} = this.props.medicationQuery
    this._subsribeToChanges(subscribeToMore)
    return (
      <div className="container">
        <div className="row margin-bottom function-card">
          <div className="col-md-6 offset-md-3">
            <button
              onClick={this.showMedicationForm}
              className="btn list-card-button off-green margin-bottom"
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
        <div className="row">
          {showAddForm ? (
            <AddMedicationForm addMedication={this.addMedication} />
          ) : (null)}
          {this.props.medicationQuery.medications &&
            this.props.medicationQuery.medications.map(medication => {
              return (medication.name.toLowerCase().search(query.toLowerCase()) !== -1) ?
                (
                  <Medication
                    key={medication.id} {...medication}
                  />
                ) : (
                  null
                )
              // )
            }
            )}
        </div>
      </div>
    )
  }
}

const MEDICATION_CHANGES_SUBSCRIPTION = gql`
subscription {
  medicationUpdated {
    node {
      id
      name
      count
      dose
      dispenser
    }
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

const ADD_MEDICATION_MUTATION = gql`
  mutation AddMedicationMutation ($name: String!, $count: Int!, $dose: Int!, $dispenser: Int) {
    createMedication(name: $name, count: $count, dose: $dose, dispenser:$dispenser){
      id
      name
      count
      dose
      dispenser
    }
  }
`

export default compose(
  graphql(MEDICATION_QUERY, {
    name: 'medicationQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(ADD_MEDICATION_MUTATION, {
    name: 'addMedication'
  }),
  graphql(MEDICATION_CHANGES_SUBSCRIPTION, {
    name: 'medicationChanges'
  })
)(MedicationList)