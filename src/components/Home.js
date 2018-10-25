import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import ScheduleSummary from './ScheduleSummary'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    //
    this.consumeSchedule = this.consumeSchedule.bind(this)
  }

  consumeSchedule(e, id) {
    e.preventDefault()
    const d = new Date()
    const takenTime = d.toISOString()
    this.props.updateSchedule({
      variables: {
        id,
        takenTime
      },
    }).then(
      result => {
        this.setState({
          loading:false
        })
      }
    ).catch(
      err => {
        this.setState({
          loading:false
        })
        console.log(err)
      }
    )
  }

  render() {
    const d = new Date()
    const current_hour = d.getHours()
    const current_month = d.getUTCMonth()
    const current_day = d.getUTCDate()
    return (
      <div className='container'>
        <h1>Feed</h1>
        <hr />
        <div className='row'>
          <div className='col-lg-4'>
            <h5>Current Schedules</h5>
            {this.props.scheduleQuery.schedules &&
              this.props.scheduleQuery.schedules.map(schedule =>
                (schedule.time == current_hour && 
                (new Date(schedule.takenTime).getUTCDate() < current_day &&
                  new Date(schedule.takenTime).getUTCMonth() <= current_month
                ) || (
                  new Date(schedule.takenTime).getUTCDate() > current_day &&
                    new Date(schedule.takenTime).getUTCMonth() > current_month
                )
                ) ? (
                  <div key={schedule.id} className='list-card margin-bottom'>
                    <div className='card-body'>
                      <ScheduleSummary
                        {...schedule}
                      />
                      <button 
                        className="btn list-card-button btn-green"
                        onClick={(e) => this.consumeSchedule(e, schedule.id)}  
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    </div>
                  </div>
                  ) : (null)

              )
            }
          </div>
          <div className='col-lg-4'>

          </div>
          <div className='col-lg-4'>

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
const UPDATE_SCHEDULE_MUTATION = gql`
  mutation UpdateScheduleMutation($id:ID!, $time:Int, $medications:[MedicationIdInput], $takenTime:DateTime){
    updateSchedule(id:$id, time:$time, medications:$medications, takenTime:$takenTime){
      id
      time
      medications {
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
export default compose(
  graphql(SCHEDULE_QUERY, {
    name: 'scheduleQuery',
  }),
  graphql(UPDATE_SCHEDULE_MUTATION, {
    name: 'updateSchedule',
  }),
)(Home)