import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiSearch} from 'react-icons/bi'

import JobsListView from '../JobsListView'
import Header from '../Header'
import TypeOfEmployment from '../TypeOfEmployment'
import SalaryRange from '../SalaryRange'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locations = [
  {label: 'Hyderabad', locationId: 'HYDERABAD'},
  {label: 'Bangalore', locationId: 'BANGALORE'},
  {label: 'Chennai', locationId: 'CHENNAI'},
  {label: 'Delhi', locationId: 'DELHI'},
  {label: 'Mumbai', locationId: 'MUMBAI'},
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsPage extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    userData: [],
    jobApiStatus: apiStatusConstants.initial,
    jobsList: [],
    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesChecked: [],
    selectLocation: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  isLoader = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const userDetails = await response.json()

    if (response.ok) {
      const data = userDetails.profile_details
      const updatedDetails = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        userData: updatedDetails,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  updateSalaryRangeId = SalaryRangeId =>
    this.setState({activeSalaryRangeId: SalaryRangeId}, this.getJobsList)

  updateTypesChecked = typeId => {
    console.log(typeId)
    const {employmentTypesChecked} = this.state
    let updatedList = employmentTypesChecked
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        eachType => eachType !== typeId,
      )
    } else {
      updatedList = [...updatedList, typeId]
    }

    this.setState({employmentTypesChecked: updatedList}, this.getJobsList)
  }

  getJobsList = async () => {
    const {
      employmentTypesChecked,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    this.setState({jobApiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesChecked}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    const updatedList = data.jobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    if (response.ok === true) {
      this.setState({jobApiStatus: apiStatusConstants.success})

      this.setState({jobsList: updatedList})
    } else {
      this.setState({jobApiStatus: apiStatusConstants.failure})
    }
  }

  jobsListView = () => {
    const {jobsList} = this.state

    return (
      <div className="p-3">
        <div>
          <ul className="list-unstyled mt-4">
            {jobsList.map(each => (
              <JobsListView key={each.id} List={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.getJobsList}
      >
        Retry
      </button>
    </div>
  )

  ProfileDataView = () => {
    const {userData} = this.state
    return (
      <div className="profile-bg p-4">
        <div className="pt-4">
          <img src={userData.profileImageUrl} alt="profile" />
        </div>
        <div>
          <h1 className="pt-3">{userData.name}</h1>
          <p className="pt-3">{userData.shortBio}</p>
        </div>
      </div>
    )
  }

  ProfileDataFailureView = () => (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  FinalProfileData = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case 'IN_PROGRESS':
        return this.isLoader()
      case 'FAILURE':
        return this.ProfileDataFailureView()
      case 'SUCCESS':
        return this.ProfileDataView()

      default:
        return null
    }
  }

  LocationFilter = id => {
    console.log(id)
    const {jobsList, selectLocation} = this.state
    console.log(selectLocation)
    let updatedList = [...selectLocation]
    if (updatedList.includes(id)) {
      updatedList = updatedList.filter(e => e !== id)
      this.setState({selectLocation: updatedList})
    } else {
      updatedList.push(id)
      this.setState({selectLocation: updatedList})
    }

    const jobListBaseOnLocation = jobsList.filter(d =>
      d.location.includes(selectLocation),
    )

    this.setState({jobsList: jobListBaseOnLocation})
  }

  renderSideBar = () => {
    const {userData} = this.state

    return (
      <div className="p-3">
        {this.FinalProfileData()}
        <hr className="hr" />
        <div>
          <h5 className="fw-bold text-white">Type of Employment</h5>
          <ul className="list-unstyled text-white">
            {employmentTypesList.map(type => (
              <TypeOfEmployment
                key={type.employmentTypeId}
                id={type.employmentTypeId}
                label={type.label}
                updateTypesChecked={this.updateTypesChecked}
                type="employees"
              />
            ))}
          </ul>
        </div>
        <hr className="hr" />
        <div>
          <h5 className="fw-bold text-white">Locations</h5>
          <ul className="list-unstyled text-white">
            {locations.map(type => (
              <TypeOfEmployment
                key={type.locationId}
                id={type.locationId}
                label={type.label}
                updateTypesChecked={this.LocationFilter}
                type="location"
              />
            ))}
          </ul>
        </div>
        <hr className="hr" />
        <div className="text-white">
          <h5>Salary Range</h5>
          <ul className="list-unstyled">
            {salaryRangesList.map(range => (
              <SalaryRange
                key={range.salaryRangeId}
                salary={range}
                updateSalaryRangeId={this.updateSalaryRangeId}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  finalJobList = () => {
    const {jobApiStatus} = this.state

    switch (jobApiStatus) {
      case 'IN_PROGRESS':
        return this.isLoader()
      case 'FAILURE':
        return this.failureView()
      case 'SUCCESS':
        return this.jobsListView()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div className="jobs-bg d-flex flex-row">
          <div>{this.renderSideBar()}</div>
          <div className="w-100">
            <div className="SearchAndIcon w-25">
              <input
                type="search"
                className="searchInput"
                placeholder="Search"
                value={searchInput}
                onChange={e => this.setState({searchInput: e.target.value})}
              />
              <button
                onClick={() => this.getJobsList()}
                data-testid="searchButton"
                type="button"
                className="btn"
              >
                <BiSearch color="#ffffff" />
              </button>
            </div>
            <div className="mt-2 w-100">{this.finalJobList()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default JobsPage
