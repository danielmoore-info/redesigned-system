import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { AUTH_TOKEN } from '../constant'

class SignupPage extends Component {
  state = {
    email: '',
    password: '',
    name: '',
  }

  render() {
    return(
      <div className="container">
          <h1>Signup</h1>
          <hr/>      
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h3>Already have an accout? <a href="/login">Login</a></h3>
            <form onSubmit={this._signup}>
              <div className="form-group">
                <input
                  autoFocus
                  className="form-input-field"
                  placeholder="Name"
                  type="text"
                  onChange={e => this.setState({ name: e.target.value })}
                  value={this.state.name}
                />
              </div>
              <div className="form-group">
                <input
                  autoFocus
                  className="form-input-field"
                  placeholder="Email"
                  type="email"
                  onChange={e => this.setState({ email: e.target.value })}
                  value={this.state.email}
                />
              </div>
              <div className="form-group">
                <input
                  autoFocus
                  className="form-input-field"
                  placeholder="Enter Password"
                  type="password"
                  onChange={e => this.setState({ password: e.target.value })}
                  value={this.state.password}
                />
              </div>
              <div className="center-me">
                  <button
                    className="btn special-button"
                  >
                    Sign up
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  _signup = async e => {
    e.preventDefault()
    const { email, name, password } = this.state
    const result = await this.props.signupMutation({
      variables: {
        name,
        email,
        password,
      },
    })

    const token = result.data.signup.token
    localStorage.setItem(AUTH_TOKEN, token)

    this.props.refreshTokenFn &&
      this.props.refreshTokenFn({
        [AUTH_TOKEN]: token,
      })

    this.props.history.replace('/')
    window.location.reload()
  }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export default graphql(SIGNUP_USER_MUTATION, { name: 'signupMutation' })(
  withRouter(SignupPage),
)
