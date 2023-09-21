import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-bg ">
      <ul className="list-unstyled d-flex flex-row justify-content-between">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <div className="w-25 d-flex flex-row justify-content-around">
          <li>
            <Link to="/" className="text-decoration-none">
              <p className="home-nav">Home</p>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="text-decoration-none">
              <p className="home-nav">Jobs</p>
            </Link>
          </li>
        </div>
        <div>
          <li>
            <button
              onClick={onLogout}
              type="button"
              className="btn btn-primary"
            >
              Logout
            </button>
          </li>
        </div>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
