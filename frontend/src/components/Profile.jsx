import "./../index.css";
import { useLocation } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";

const Profile = () => {

   const [searchParams] = useSearchParams();

   const id = searchParams.get("id");
   const fullname = searchParams.get("fullName");
   const gender = searchParams.get("job");
   const job = searchParams.get("experience");
   const experience = searchParams.get("gender");

    // console.log(id,fullname,gender, job, experience)

    const { state } = useLocation();

    // console.log(state);

    const user = {
    uuid: state?.id || id,
    fullname: state?.fullname || fullname,
    gender: state?.gender || gender,
    jobtype: state?.job || job,
    experience: state?.experience || experience,
  };

  console.log()

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Candidate Profile</h2>

        <div className="profile-item">
          <span className="label">UUID</span>
          <span className="value">{user?.uuid}</span>
        </div>

        <div className="profile-item">
          <span className="label">Full Name</span>
          <span className="value">{user?.fullname}</span>
        </div>

        <div className="profile-item">
          <span className="label">Gender</span>
          <span className="value">{user?.gender}</span>
        </div>

        <div className="profile-item">
          <span className="label">Job Type</span>
          <span className="value">{user?.jobtype}</span>
        </div>

        <div className="profile-item">
          <span className="label">Experience</span>
          <span className="value">{user?.experience} Years</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
