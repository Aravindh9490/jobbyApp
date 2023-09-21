import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {userName: '', password: '', errorMsg: '', showErrorMsg: false}

  onFormSubmit = event => {
    event.preventDefault()
    this.getUserDetails()
  }

  onSuccessLogin = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  fairerView = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  getUserDetails = async () => {
    const {userName, password} = this.state

    const userDetails = {username: userName, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.fairerView(data.error_msg)
    }
  }

  updateUserName = event => {
    this.setState({userName: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {userName, password, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg d-flex flex-column justify-content-center align-items-center ">
        <div className="login-sub-bg rounded ">
          <div className="text-center">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.onFormSubmit} className="text-white mt-5">
            <div className="mt-4">
              <label className="text-left" htmlFor="username">
                USERNAME
              </label>
              <br />
              <input
                onChange={this.updateUserName}
                className="form-control"
                id="username"
                type="text"
                placeholder="Username"
                required
                value={userName}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password">PASSWORD</label>
              <br />
              <input
                onChange={this.updatePassword}
                className="form-control"
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary form-control">
                Login
              </button>
            </div>
          </form>
          <p className="text-danger">{showErrorMsg && errorMsg}</p>
        </div>
      </div>
    )
  }
}

export default Login
