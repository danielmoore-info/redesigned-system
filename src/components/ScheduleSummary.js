import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { gql } from 'apollo-boost'
export default class ScheduleSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  render() {
    return(
      <div>
        <p>{this.props.time}:00</p>
        <p>Medications:</p>
        <ul>
          {this.props.medications.map(medication => 
            <li key={medication.id}>{medication.name}</li>
          )}
        </ul>
      </div>
    )
  }
}