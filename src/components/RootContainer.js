import React, { Component, Fragment } from 'react'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import FeedPage from './FeedPage'
import DraftsPage from './DraftsPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PageNotFound from './PageNotFound'
import LogoutPage from './LogoutPage'
import MedicationList from './MedicationList'
import ScheduleList from './ScheduleList'
import LandingPage from './LandingPage'
import Home from './Home'
import { AUTH_TOKEN } from '../constant'
import { isTokenExpired } from '../helper/jwtHelper'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
  return token ? (
    <Route {...rest} render={matchProps => <Component {...matchProps} />} />
  ) : (
    <Redirect to="/login" />
  )
}

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.refreshTokenFn = this.refreshTokenFn.bind(this)
    this.toggleNav = this.toggleNav.bind(this)

    this.state = {
      token: props.token,
      navExpanded: true
    }
  }

  toggleNav() {
    this.setState({
      navExpanded: !this.state.navExpanded
    })
  }

  refreshTokenFn(data = {}) {
    const token = data.AUTH_TOKEN

    if (token) {
      localStorage.setItem(AUTH_TOKEN, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN)
    }

    this.setState({
      token: data.AUTH_TOKEN,
    })
  }

  bootStrapData() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN)
      if (token !== null && token !== undefined) {
        const expired = isTokenExpired(token)
        if (!expired) {
          this.setState({ token: token })
        } else {
          localStorage.removeItem(AUTH_TOKEN)
          this.setState({ token: null })
        }
      }
    } catch (e) {
      console.log('')
    }
  }

  //verify localStorage check
  componentDidMount() {
    this.bootStrapData()
  }

  render() {
    return (
      <Router>
        <Fragment>
          {this.renderNavBar()}
          {this.renderRoute()}
        </Fragment>
      </Router>
    )
  }

  renderNavBar() {
    const {navExpanded} = this.state
    const classOne = navExpanded ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'
    const classTwo = navExpanded ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right'
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark margin-bottom">
        <a className="navbar-brand" href="/">Magic Meds</a>
        <button onClick={this.toggleNav} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${classOne}`} id="navbarNav">
          <ul className="navbar-nav">
          {this.state.token ? (
            <li className="nav-item">
              <NavLink
                to="/home"
                className="nav-link"
                activeClassName="active"
                exact={true}
              >
                Home
              </NavLink>
            </li>
          ):(null)}
            {this.state.token ? (
              <li className="nav-item">
                <NavLink
                  to="/medications"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Medications
                </NavLink>
              </li>              
            ) : (null)}
            {this.state.token ? (
              <li className="nav-item">
                <NavLink
                  to="/schedules"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Schedules
                </NavLink>
              </li>
            ):(null)}
            {this.state.token ? (
              <li className="nav-item">
                <div 
                  onClick={() => {
                    this.refreshTokenFn &&
                      this.refreshTokenFn({
                        [AUTH_TOKEN]: null
                      })
                      window.location.href = '/'
                  }}
                >
                  <NavLink
                    to="/logout"
                    className="nav-link"
                    activeClassName="active"
                    exact={true}
                  >
                    Logout
                  </NavLink>
                </div>
              </li>

            ) : (
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Login
                </NavLink>
              </li>
            )}
            {this.state.token ? (null) : (
              <li className="nav-item">
                <NavLink
                  to="/signup"
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  Signup
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav> 
    )
  }

  renderRoute() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <ProtectedRoute
            token={this.state.token}
            path="/drafts"
            component={DraftsPage}
          />
          <ProtectedRoute
            token={this.state.token}
            path="/home"
            component={Home}
          />
          <ProtectedRoute
            token={this.state.token}
            path="/medications"
            component={MedicationList}
          />
          <Route
            token={this.state.token}
            path="/schedules"
            // component={ScheduleList}
            render={props => (
              <ScheduleList token={this.state.token}/>
            )}
          />
          <ProtectedRoute
            token={this.state.token}
            path="/create"
            component={CreatePage}
          />
          <Route path="/post/:id" component={DetailPage} />
          <Route
            token={this.state.token}
            path="/login"
            render={props => <LoginPage refreshTokenFn={this.refreshTokenFn} />}
          />
          <Route
            token={this.state.token}
            path="/signup"
            render={props => (
              <SignupPage refreshTokenFn={this.refreshTokenFn} />
            )}
          />
          <Route path="/logout" component={LogoutPage} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    )
  }
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      name
    }
  }
`

export default graphql(ME_QUERY, {
  options: {
    errorPolicy: 'all',
  },
})(RootContainer)
