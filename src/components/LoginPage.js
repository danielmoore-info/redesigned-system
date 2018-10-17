import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { AUTH_TOKEN } from '../constant'

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    return(
      <div className="container">
          <h1>Login</h1>
          <hr/>      
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h3>Don't have an account? <a href="/signup">Signup</a></h3>
              <form onSubmit={this._login}>
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
                    placeholder="Password"
                    type="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    value={this.state.password}
                  />
                </div>
                <div className="center-me">
                  <button
                    className="btn special-button"
                    // onClick={this._login}
                  >
                    log in
                  </button>
                </div>
              </form>
          </div>
          </div>
        </div>
    )
  }

  _login = async e => {
    e.preventDefault()
    const { email, password } = this.state
    this.props
      .loginMutation({
        variables: {
          email,
          password,
        },
      })
      .then(result => {
        const token = result.data.login.token

        this.props.refreshTokenFn &&
          this.props.refreshTokenFn({
            [AUTH_TOKEN]: token,
          })
        this.props.history.replace('/')
        window.location.reload()
      })
      .catch(err => {
        console.log('error')
      })
  }
}

const LOGIN_USER_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export default graphql(LOGIN_USER_MUTATION, { name: 'loginMutation' })(
  withRouter(LoginPage),
)
