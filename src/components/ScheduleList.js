import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import Schedule from './Schedule';

class ScheduleList extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.draftsQuery.refetch()
    } true
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.scheduleQuery.schedules &&
              this.props.scheduleQuery.schedules.map(schedule => 
                <Schedule
                  key={schedule.id}
                  {...schedule}
                  all_medications = {this.props.medicationQuery.medications}
                />
            )}
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
  // graphql(MEDICATION_CHANGES_SUBSCRIPTION, {
  //   name: 'medicationChanges'
  // })
)(ScheduleList)