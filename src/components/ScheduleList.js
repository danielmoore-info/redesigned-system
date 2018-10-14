import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import Schedule from './Schedule';
import AddScheduleForm from './AddScheduleForm';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class ScheduleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddForm: false
    }
    this.toggleScheduleForm = this.toggleScheduleForm.bind(this)
    this.addSchedule = this.addSchedule.bind(this)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.location.key !== nextProps.location.key) {
  //     this.props.draftsQuery.refetch()
  //   } true
  // }

  toggleScheduleForm(){
    this.setState({
      showAddForm: !this.state.showAddForm
    })
  }

  addSchedule(time) {
    this.props.addSchedule({
      variables: {
        time
      },
      update: (store, {data: {createSchedule}}) => {
        const data = store.readQuery({query:SCHEDULE_QUERY})
        data.schedules.unshift(createSchedule)
        store.writeQuery({query: SCHEDULE_QUERY, data})
      }
    })
    .then(
      result => {
        this.setState({
          showAddForm:false
        })
      }
    ).catch(
      err => {
        console.log(err)
      }
    )
  }

  render() {
    const {showAddForm} = this.state
    return (
      <div className="container">
        <h1>Schedules</h1>
        <hr/>      
        <div className="row function-card">
          <div className="col-md-6 offset-md-3">
            <button
              onClick={this.toggleScheduleForm}
              className="btn list-card-button off-green margin-bottom"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>      
        <div className="row">
        <div className={"col-md-6 offset-md-3 margin-bottom " + (showAddForm? '':'hide')}>
          <div className={"list-card "}>
            <div className="card-body">
              <AddScheduleForm addSchedule={this.addSchedule} />
            </div>
          </div>
        </div>
        <CSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
          {this.props.scheduleQuery.schedules &&
              this.props.scheduleQuery.schedules.map(schedule => 
                <Schedule
                  className=""
                  key={schedule.id}
                  {...schedule}
                  all_medications = {this.props.medicationQuery.medications}
                  token = {this.props.token}
                />
            )}
        </CSSTransitionGroup>
        </div>
      </div>
    )
  }
}

const ADD_SCHEDULE_QUERY = gql`
  mutation AddScheduleMutation($time: Int!) {
    createSchedule(time: $time) {
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

export default compose(
  graphql(SCHEDULE_QUERY, {
    name: 'scheduleQuery',
  }),
  graphql(MEDICATION_QUERY, {
    name: 'medicationQuery'
  }),
  graphql(ADD_SCHEDULE_QUERY, {
    name: 'addSchedule'
  }),
  // graphql(MEDICATION_CHANGES_SUBSCRIPTION, {
  //   name: 'medicationChanges'
  // })
)(ScheduleList)