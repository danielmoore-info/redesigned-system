import React, { Component } from 'react'

export default class ScheduleSummary extends Component {
  render() {
    return(
      <div>
        <p>{this.props.time}:00</p>
        <ul>
          {this.props.medications.map(medication => 
            <li key={medication.id}>{medication.name}</li>
          )}
        </ul>
      </div>
    )
  }
}