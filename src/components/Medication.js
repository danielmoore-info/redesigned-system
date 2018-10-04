import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'

class Medication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      showUsers: false,
      loading: false
    }
    this.deleteMedication = this.deleteMedication.bind(this)
  }

  updateName(e) {
    e.preventDefault()
    const name = e.target.value
    // this.setState({
    //   loading:true
    // })
    this.props.updateMedication({
      variables: {
        name
      },
    }).then(
      result => {
        this.setState({
          loading: false
        })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true
      })
    })
  }
  updateCount(e) {
    e.preventDefault()
    const count = e.target.value
    // this.setState({
    //   loading:true
    // })
    this.props.updateMedication({
      variables: {
        count
      }
    }).then(
      result => {
        this.setState({
          loading: false
        })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true
      })
    })
  }

  deleteMedication() {
    const id = this.props.id
    this.props.deleteMedication({
      variables: {
        id
      },
      update: (store, { data: { deleteMedication } }) => {
        const data = store.readQuery({ query: MEDICATION_QUERY })
        console.log(data)
        const new_data = data.medications.filter(
          medication => {
            return medication.id !== id
          }
        )
        
        data.medications=new_data
        console.log(data)
        store.writeQuery({query: MEDICATION_QUERY, data})
      }
    }).then(
      result => {
        this.setState({
          loading: false
        })
      }
    ).catch(err => {
      this.setState({
        loading: false,
        error: true
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
                <div>
                  <p>Loading</p>
                </div>
              ) :
              (
                <div>
                  <input
                    type="text"
                    className="form-input-field"
                    value={this.props.name}
                    onChange={(e) => this.updateName(e)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Medication name..."
                  />
                  <input
                    type="number"
                    className="form-input-field smaller"
                    value={this.props.count}
                    onChange={(e) => this.updateCount(e)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Number of tablets"
                  />
                  <div id="button-bar" className="">
                    <button className="btn list-card-button marone" onClick={this.deleteMedication}>
                      <i
                        className="fas fa-times"
                      ></i>
                    </button>
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

const UPDATE_MEDICATION_MUTATION = gql`
  mutation UpdateMedicationMutation($id: ID!, $name: String!, $count: Int!){
    updateMedication(id: $id, name: $name, count: $count){
      id
      name
      count
    }
  }
`

const MEDICATION_QUERY = gql`
  query MedicationQuery {
    medications {
      id
      name
      count
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