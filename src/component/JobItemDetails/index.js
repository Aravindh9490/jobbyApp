import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'

import './index.css'

const apiStatuesProgress = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const JobItemDetails = props => {
  const [apiData, setApiData] = useState([])
  const [similarData, setSimilarData] = useState([])
  const [apiStatues, setApiStatues] = useState(apiStatuesProgress.initial)

  const {match} = props
  const {params} = match
  const {id} = params

  const getCamelCasedData = data => {
    const jobDetails = data.job_details

    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      rating: jobDetails.rating,
      title: jobDetails.title,
      packagePerAnnum: jobDetails.package_per_annum,
      skills: jobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompany: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
    }

    const similarJobs = data.similar_jobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

    return {updatedJobDetails, similarJobs}
  }

  const getApiData = async () => {
    setApiStatues(apiStatuesProgress.loading)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const {updatedJobDetails, similarJobs} = getCamelCasedData(data)
      setApiStatues(apiStatuesProgress.success)
      setApiData(updatedJobDetails)
      setSimilarData(similarJobs)
    } else {
      setApiStatues(apiStatuesProgress.failure)
    }
  }

  useEffect(() => {
    getApiData()
  }, [])

  const successView = () => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = apiData

    return (
      <div className="bg">
        <div className="bg-2">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div>
            <h1>{title}</h1>
            <p>
              <AiFillStar color="yellow" />
              {rating}
            </p>
          </div>
          <div>
            <p>
              <IoLocationSharp />
              {location}
            </p>
            <p>
              <BsFillBriefcaseFill />
              {employmentType}
            </p>
          </div>
          <div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <div>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                Visit <FiExternalLink />
              </a>
            </div>
            <div>
              <p>{jobDescription}</p>
            </div>
            <div>
              <h1>Skills</h1>
              <ul>
                {apiData.skills?.map(each => (
                  <li key={each.name}>
                    <img src={each.imageUrl} alt={each.name} />
                    <p>{each.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1>Life at Company</h1>
              {lifeAtCompany?.description && <p>{lifeAtCompany.description}</p>}
              {lifeAtCompany?.imageUrl && (
                <img src={lifeAtCompany.imageUrl} alt="life at company" />
              )}
            </div>
          </div>
        </div>
        <div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarData.map(each => (
              <li key={each.id} className="bg-sim">
                <div>
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <h1>{each.title}</h1>
                  <p>
                    <AiFillStar />
                    {each.rating}
                  </p>
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                  <div>
                    <p>
                      <IoLocationSharp />
                      {each.location}
                    </p>
                    <p>
                      <BsFillBriefcaseFill />
                      {each.employmentType}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const LoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#000000" height="50" width="50" />
    </div>
  )

  const renderApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={getApiData}>
        Retry
      </button>
    </div>
  )

  const finalResult = () => {
    switch (apiStatues) {
      case 'LOADING':
        return LoaderView()
      case 'FAILURE':
        return renderApiFailureView()
      case 'SUCCESS':
        return successView()

      default:
        return null
    }
  }

  return (
    <div>
      <Header />
      {finalResult()}
    </div>
  )
}

export default JobItemDetails
