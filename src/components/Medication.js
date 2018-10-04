import React, { Component } from 'react'
// import { API_ENDPOINT } from '../Constants'
// import PatientList from './PatientList'
// import SelectPatients from './SelectPatients';

export default class Medication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      showUsers: false,
      loading: false
    }
    this.changeFormState = this.changeFormState.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.changeShowUserState = this.changeShowUserState.bind(this)
  }


  handleNameChange(name) {
    this.setState({
      name: name
    })
  }

  changeFormState() {
    this.setState({ showForm: !this.state.showForm })
  }

  changeShowUserState() {
    this.setState({ showUsers: !this.state.showUsers })
  }

  // async saveMedication(e) {
  //   e.preventDefault()
  //   this.setState({ loading: true })
  //   const medication = JSON.stringify(this.props)
  //   fetch(API_ENDPOINT + '/medications/' + this.props.id + '.json', {
  //     method: 'PUT',
  //     body: medication,
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then(response => response.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           showForm: false,
  //           loading: false,
  //         })
  //       }
  //     )
  //     .catch(err => {
  //       this.setState({
  //         loading: false
  //       })
  //     })
  // }

  render() {
    // patients belonging to the medication
    const { patient } = this.props

    const all_patients = this.props.patients
    console.log(all_patients)

    return (
      <div className="col-md-6 offset-md-3 margin-bottom">
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
                  <h5 className="card-title">{this.props.name}</h5>
                  <p className="card-text">{this.props.count}</p>

                  <div id="button-bar" className="margin-bottom">
                    <button className="btn list-card-button off-green" onClick={this.changeFormState}>
                      <i
                        className="far fa-edit"
                      ></i>
                    </button>
                  </div>
                  {this.state.showUsers ?
                    <div>
                      <hr />
                      {/* <SelectPatients
                        allPatients={this.props.allPatients}
                        patients={this.props.patient}
                      /> */}
                    </div>
                    : null
                  }
                  {this.state.showForm ?
                    <div>
                      <hr />
                      <form>
                        <div className="form-group">
                          <label htmlFor="medicationName">Name</label>
                          <input
                            type="text"
                            className="form-input-field"
                            id="medicationName"
                            value={this.props.name}
                            // onChange={}
                            aria-describedby="nameHelp"
                          ></input>
                          <small className="form-text text-muted" id="nameHelp">Enter the exact name of the medication</small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="medicationCount">Count</label>
                          <input
                            type="number"
                            className="form-input-field"
                            id="medicationCount"
                            value={this.props.count}
                            onChange={e => this.props.onCountChange(e.target.value)}
                          >
                          </input>
                          <small className="form-text text-muted" id="nameHelp">Enter the exact number of pills</small>
                        </div>
                        <button
                          className="btn list-card-button off-green"
                          onClick={this.saveMedication}
                        >Save
                      </button>
                        <button
                          className="btn list-card-button marone"
                          onClick={(e) => this.props.deleteMedication(e)}
                        >
                          Delete
                      </button>
                      </form>
                    </div>
                    : null}
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}