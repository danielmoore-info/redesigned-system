import  React, {Component} from 'react'

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  redirect(e){
    e.preventDefault()
    window.location.href = '/medications'
  }

  render() {
    return(
      <div class="feature-background">
        <div className="container">
          <div className="jumbotron">
            <h1>Magic Meds</h1>
            <hr class="my-4"></hr>
            <p>Simplify your medications</p>
            <button onClick={this.redirect} className="btn special-button">Continue to Application</button>
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage