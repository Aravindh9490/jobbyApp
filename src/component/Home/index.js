import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div>
    <Header />
    <div className="home-bg">
      <h1 className="w-25 text-white fw-bold">
        Find The Job That Fits Your Life
      </h1>
      <p className="w-50 mt-4 text-white">
        Millions of people are searching for jobs
      </p>
      <p className="text-white">
        ,salary information, company reviews. Find the job that fits your
        abilities and potential.
      </p>
      <div className="mt-5">
        <Link to="/jobs">
          <button type="button" className="btn btn-primary">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
