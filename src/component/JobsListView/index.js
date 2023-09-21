import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation} from 'react-icons/im'
import {HiOutlineMail} from 'react-icons/hi'
import './index.css'

const JobsListView = props => {
  const {List} = props
  const {
    title,
    rating,
    packagePerAnnum,
    location,
    jobDescription,
    id,
    employmentType,
    companyLogoUrl,
  } = List
  return (
    <Link to={`/jobs/${id}`} className="underline">
      <li className="jobListBg m-2 p-4 text-white">
        <div className="d-flex flex-row">
          <div>
            <img className="imgLogo" src={companyLogoUrl} alt="company logo" />
          </div>
          <div className="marL">
            <h1>{title}</h1>
            <p>
              <AiFillStar className="m-1" color="#fbbf24" />
              {rating}
            </p>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <p>
              <ImLocation className="m-1" />
              {location}
            </p>
            <p className="marL">
              <HiOutlineMail className="m-1" />
              {employmentType}
            </p>
          </div>
          <div>
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="border " />
        <div>
          <h1 className="fw-bold">Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsListView
