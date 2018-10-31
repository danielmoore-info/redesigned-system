import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
import ScheduleSummary from './ScheduleSummary'
import Medication from './Medication';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    //
    this.consumeSchedule = this.consumeSchedule.bind(this)
    this.deleteNotification = this.deleteNotification.bind(this)
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
      update: (store, {data: {updateSchedule}}) => {
        const data = store.readQuery({query: SCHEDULE_QUERY})
        const x = data.schedules.map(schedule => 
          (schedule.id !== id) ?
          schedule : {
            ...updateSchedule
          }
        )
        data.schedules = x
        store.writeQuery({query: SCHEDULE_QUERY, data})
      }
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

  deleteNotification(e, id) {
    e.preventDefault()
    this.props.deleteNotification({
      variables: {
        id
      },
      update: (store, {data: {deleteNotification}}) => {
        const data = store.readQuery({query: NOTIFICATION_QUERY})
        const new_data = data.notifications.filter(
          notification => {
            return notification.id !==id
          }
        )
        data.notifications = new_data
        store.writeQuery({ query: NOTIFICATION_QUERY, data})
      }
    })
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
            <h5>Notifications</h5>
            {this.props.notificationQuery.notifications &&
              this.props.notificationQuery.notifications.map(notification => 
                <div 
                  key={notification.id} 
                  className={'list-card margin-bottom '+ notification.type}
                  onClick={(e) => this.deleteNotification(e, notification.id)}
                >
                  <div className="card-body">
                    <p>{notification.message}</p>
                  </div>
                </div>  
              )
            }
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

const NOTIFICATION_QUERY = gql`
  query NotificationQuery {
    notifications{
      id
      type
      message
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

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id:ID!){
    deleteNotification(id:$id){
      id
      type
      message
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
  graphql(NOTIFICATION_QUERY, {
    name: 'notificationQuery',
  }),
  graphql(DELETE_NOTIFICATION_MUTATION, {
    name: 'deleteNotification',
  }),
)(Home)