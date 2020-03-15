import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => {
  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <Fragment>
          {" "}
          <h2 className='text-primary'>
            {name
              .trim()
              .split(" ")
              .slice(0, 1)}
            's Bio
          </h2>
          <p>{bio}</p>
        </Fragment>
      )}

      <div className='line'></div>
      <h2 className='text-primary'>Skill Set</h2>
      <div className='skills'>
        {skills.map((skill, index) => (
          <div className='p-1' key={index}>
            {" "}
            {skill}
            <i className='fas fa-check'></i>
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
