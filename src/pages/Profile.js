import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [competences, setCompetences] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenFromCookies();
        if (token) {
          const userId = getUserIdFromToken(token);
          if (userId) {
            const [userData, competencesData] = await Promise.all([
              axios.get(`http://localhost:8081/api/user/getUser/${userId}`),
              axios.get(`http://localhost:8081/api/user/${userId}/competences-and-experiences`)
            ]);
console.log("experiencesData",competencesData);
            setUser(userData.data.user);
            setCompetences(competencesData.data.competences);
            setExperiences(competencesData.data.experiences);
            console.log("experiencesDataaaaaaaaaa",competencesData.data.experiences);


          } else {
            console.error('User ID not found in the token');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect will run once when the component mounts

  // Function to get the token from cookies
  const getTokenFromCookies = async () => {
    return new Promise((resolve, reject) => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        resolve(token);
      } else {
        reject("Token not found in cookies");
      }
    });
  };

  // Function to get the user ID from the token
  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwt.decode(token);
      return decodedToken ? decodedToken._id : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  if (loading || user === null) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                  <Link to="/defaultsettings" className="d-inline-block mt-2"><i className="ti-arrow-left font-sm text-white"></i></Link>
                  <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Account Details</h4>
                </div>
                <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 text-center">
                      <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                        <img src="https://via.placeholder.com/300x300.png" alt="avater" className="shadow-sm rounded-3 w-100" />
                      </figure>
                      <h2 className="fw-700 font-sm text-grey-900 mt-3">{user.firstName} {user.lastName}</h2>
                      <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">{user.city}</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <h5 className="mont-font fw-600 font-xsss mb-2">Email: </h5>
                      <p>{user.email}</p>
                    </div>

                    <div className="col-lg-12 mb-3">
                      <h5 className="mont-font fw-600 font-xsss mb-2">Phone:</h5>
                      <p>{user.phone}</p>
                    </div>

                    <div className="col-lg-12 mb-3">
                      <h5 className="mont-font fw-600 font-xsss mb-2">Description:</h5>
                      <p>{user.description}</p>
                    </div>
                  </div>
                  <div className="row">
        <div className="col-lg-12 mb-3">
          <h5 className="mont-font fw-600 font-xsss mb-2">Competences:</h5>
          <ul>
            {competences.map((competence) => (
              <li key={competence._id}>
                <strong>{competence.nomCompetence}</strong> - {competence.niveauMaitrise}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 mb-3">
          <h5 className="mont-font fw-600 font-xsss mb-2">Experiences:</h5>
          <ul>
            {experiences.map((experience) => (
              <li key={experience._id}>
                <strong>{experience.nomEntreprise}</strong> - {experience.poste} ({experience.dateDebut} to {experience.dateFin})
              </li>
            ))}
          </ul>
        </div>
      </div>
                  <div className="col-lg-12">
                    <Link to="/accountinformation" className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Save</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </React.Fragment>
  );
};

export default Profile;
