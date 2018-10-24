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
  }

  render() {
    // const { takenTime } = this.props.scheduleQuery.sc
    const d = new Date()
    const current_hour = d.getHours()
    const current_month = d.getUTCMonth()
    const current_day = d.getUTCDate()
    // const takenDate = new Date(takenTime)
    // const taken_month = takenDate.getUTCMonth()
    // const taken_day = takenDate.getUTCDate()
    // console.log(taken_day)
    // console.log(current_day)
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
                        // key={schedule.id}
                        {...schedule}
                      />
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
export default compose(
  graphql(SCHEDULE_QUERY, {
    name: 'scheduleQuery',
  }),
)(Home)