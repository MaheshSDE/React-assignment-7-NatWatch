import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isShowingErrorMsg: false,
    errorMsg: '',
    isPasswordShown: false,
  }

  onChangeCheckBox = () => {
    const {isPasswordShown} = this.state
    this.setState({isPasswordShown: !isPasswordShown})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMessage => {
    this.setState({isShowingErrorMsg: true, errorMsg: errorMessage})
  }

  onSubmit = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const url = 'https://apis.ccbp.in/login'

    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {
      username,
      password,
      isShowingErrorMsg,
      errorMsg,
      isPasswordShown,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="login-form-container" onSubmit={this.onSubmit}>
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
              alt="nxt watch logo"
              className="website-logo"
            />
          </div>

          <div className="input-container">
            <label htmlFor="username" className="style-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="style-label">
              PASSWORD
            </label>
            <input
              type={isPasswordShown ? 'text' : 'password'}
              id="password"
              className="password-input"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="checkbox-container">
            <input
              checked={isPasswordShown}
              type="checkbox"
              id="label"
              onChange={this.onChangeCheckBox}
            />
            <label className="label" htmlFor="label">
              Show Password
            </label>
          </div>

          <div className="login-button-container">
            <button type="submit" className="login-button-style">
              Login
            </button>
          </div>
          {isShowingErrorMsg && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
