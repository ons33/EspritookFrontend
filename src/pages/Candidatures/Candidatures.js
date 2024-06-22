import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Pagetitle from '../../components/Pagetitle';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import { FaEye, FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';

const getTokenFromCookies = async () => {
  return new Promise((resolve, reject) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      console.log("Token:", token);
      resolve(token);
    } else {
      reject("Token not found in cookies");
    }
  });
};

const getCircleColor = (percentage) => {
  if (percentage > 50) return '#4caf50'; // Green
  if (percentage < 50) return '#f44336'; // Red
  return '#ff9800'; // Orange
};

const getStatusBorderColor = (statut) => {
  switch (statut) {
    case 'Accepter':
      return '3px solid #4caf50'; // Green for accepted
    case 'Rejeter':
      return '3px solid #f44336'; // Red for rejected
    default:
      return '3px solid #ff9800'; // Orange for in progress
  }
};

// Function to calculate SVG circle styles
const circularProgressStyle = (percent) => {
  const radius = 39; // The radius of the SVG circle
  const circumference = radius * 2 * Math.PI;
  const offset = ((100 - percent) / 100) * circumference;
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
    stroke: getCircleColor(percent), // Apply the color based on percentage
  };
};

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [users, setUsers] = useState({});
  const history = useHistory(); // Initialize useHistory
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');

  // Function to navigate to the PDF Viewer Page
  const navigateToPDFViewer = (userId) => {
    const url = `${window.location.origin}/pdf-cand?userId=${userId}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const fetchCandidaturesByJobId = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/candidature/getCansByJobId/${jobId}`);
        setCandidatures(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidatures by jobId:', error);
        setLoading(false);
      }
    };

    if (jobId) {
      fetchCandidaturesByJobId();
    }
  }, [jobId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (candidatures.length === 0) return; // Exit early if there are no candidatures
      const accessToken = await getTokenFromCookies(); // Ensure you have this function implemented
      const usersToFetch = candidatures.filter(
        (candidature) => !users[candidature.userId]
      );

      for (const candidature of usersToFetch) {
        try {
          const response = await fetch(
            `http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${candidature.userId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.ok) {
            const userDetails = await response.json();
            setUsers((prevUsers) => ({
              ...prevUsers,
              [candidature.userId]: userDetails,
            }));
          } else {
            console.error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    if (!loading) {
      fetchUserDetails(); // Call to fetch user details for new candidatures
    }
  }, [loading, candidatures, users]); // Add dependencies here to ensure the effect runs correctly

  useEffect(() => {
    const handleMatching = async () => {
      const newPredictions = [];
      const uniquePairs = new Set();
  
      for (const candidature of candidatures) {
        const { userId, jobId } = candidature;
        const pair = `${userId}-${jobId}`;
  
        if (!userId || !jobId || uniquePairs.has(pair)) {
          continue; // Skip this iteration if either ID is missing or already processed
        }
  
        uniquePairs.add(pair);
  
        try {
          const response = await axios.post('http://localhost:3003/api/match', {
            userId,
            jobId,
          });
  
          console.log('API response:', response.data);
  
          if (response.data.success) {
            newPredictions.push({
              ...candidature,
              matchingData: response.data.matchingPercentage, // Adjust based on the correct key
            });
          } else {
            console.error('Error in API response:', response.data.error);
          }
        } catch (error) {
          console.error('Error matching candidate to job offer:', error);
        }
      }
  
      newPredictions.sort((a, b) => b.matchingData - a.matchingData);
      setPredictions(newPredictions);
    };
  
    if (!loading) {
      handleMatching(); // Existing logic to handle matching
    }
  }, [loading, candidatures]); // Add dependencies here to ensure the effect runs correctly
  
  const handleStatusChange = async (candidatureId, newStatus) => {
    try {
      console.log(newStatus);
      await axios.put(
        `http://localhost:8081/api/candidature/updateCanStatus/${candidatureId}`,
        { newStatus: newStatus }
      );

      // Update local state to reflect the change immediately
      const updatedCandidatures = candidatures.map((candidature) => {
        if (candidature._id === candidatureId) {
          return { ...candidature, statut: newStatus };
        }
        return candidature;
      });
      setCandidatures(updatedCandidatures);

      if (newStatus === 'Accepter') {
        // Find the card element and add the animation class
        const card = document.querySelector(`#card-${candidatureId}`);
        if (card) {
          card.classList.add('status-animation');
          setTimeout(() => {
            card.classList.remove('status-animation');
          }, 1000); // match the duration of your animation
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Function to calculate the difference in days
  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const differenceInTime = now.getTime() - date.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return `Il y a ${differenceInDays} jour${differenceInDays > 1 ? 's' : ''} `;
  };

  return (
    <>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <Pagetitle title="Liste des Candidatures" />
              {loading ? (
                <div>Loading...</div>
              ) : (
                predictions.map((prediction, index) => {
                  const candidature = candidatures.find(
                    (c) =>
                      c.userId === prediction.userId &&
                      c.jobId === prediction.jobId
                  );
                  const matchingData = Math.round(prediction.matchingData || 0);
                  const borderColor = getStatusBorderColor(candidature.statut); // Use the new function here
                  const user = users[candidature.userId]; // Access user details
                  return (
                    <div key={index} className="col-md-4 col-sm-6">
                      <div
                        className="card user-card"
                        style={{
                          border: borderColor,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                          }}
                        >
                          {getDaysAgo(candidature.createdAt)}
                        </div>
                        <div className="card-body text-center">
                      
                          <div 
                            className="circular-progress-container"
                            style={{ position: 'relative' }}
                          >
                            <svg width="100" height="100">
                              <circle
                                cx="50"
                                cy="50"
                                r="39"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="4"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="39"
                                fill="none"
                                style={circularProgressStyle(matchingData)}
                                strokeWidth="4"
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '20px',
                                color: '#333',
                              }}
                            >{`${matchingData}%`}</div> 
                          </div>
                          matching
                          <figure className="avatar mx-auto mt-3">
                            <img
                              src="https://png.pngtree.com/png-vector/20240223/ourlarge/pngtree-graduates-transparent-icon-pro-user-avatar-simple-for-web-and-mobile-vector-png-image_11871568.png"
                              style={{ width: "40%" }}
                              alt="avatar"
                              className="rounded-circle"
                            />
                          </figure>
                          {candidature.statut === "Accepter" && (
                            <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                              <svg width="37" height="40" viewBox="0 0 37 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.636814 28.9226C0.212271 25.9017 0 22.8979 0 19.9113C0 16.9251 0.212214 13.9217 0.636642 10.9012C0.73113 10.2287 1.08653 9.61915 1.62751 9.20164C4.04382 7.33678 6.56609 5.65353 9.19432 4.15191C11.8233 2.64988 14.5582 1.32956 17.3992 0.190965C18.034 -0.0634525 18.7439 -0.0636621 19.3788 0.19038C22.2044 1.32087 24.9391 2.64138 27.5829 4.15191C30.2264 5.66223 32.749 7.34541 35.1509 9.20145C35.6911 9.61894 36.046 10.2281 36.1404 10.9C36.565 13.9209 36.7773 16.9247 36.7773 19.9113C36.7773 22.8975 36.5651 25.9009 36.1406 28.9214C36.0461 29.5938 35.6907 30.2034 35.1498 30.6209C32.7334 32.4858 30.2112 34.169 27.5829 35.6707C24.954 37.1727 22.2191 38.493 19.3781 39.6316C18.7433 39.886 18.0334 39.8862 17.3984 39.6322C14.5728 38.5017 11.8381 37.1812 9.19432 35.6707C6.55087 34.1603 4.02823 32.4772 1.6264 30.6211C1.08614 30.2036 0.731235 29.5945 0.636814 28.9226Z" fill="#50B5FF"/>
                                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="37" height="40">
                                  <path d="M0.636814 28.9226C0.212271 25.9017 0 22.8979 0 19.9113C0 16.9251 0.212214 13.9217 0.636642 10.9012C0.73113 10.2287 1.08653 9.61915 1.62751 9.20164C4.04382 7.33678 6.56609 5.65353 9.19432 4.15191C11.8233 2.64988 14.5582 1.32956 17.3992 0.190965C18.034 -0.0634525 18.7439 -0.0636621 19.3788 0.19038C22.2044 1.32087 24.9391 2.64138 27.5829 4.15191C30.2264 5.66223 32.749 7.34541 35.1509 9.20145C35.6911 9.61894 36.046 10.2281 36.1404 10.9C36.565 13.9209 36.7773 16.9247 36.7773 19.9113C36.7773 22.8975 36.5651 25.9009 36.1406 28.9214C36.0461 29.5938 35.6907 30.2034 35.1498 30.6209C32.7334 32.4858 30.2112 34.169 27.5829 35.6707C24.954 37.1727 22.2191 38.493 19.3781 39.6316C18.7433 39.886 18.0334 39.8862 17.3984 39.6322C14.5728 38.5017 11.8381 37.1812 9.19432 35.6707C6.55087 34.1603 4.02823 32.4772 1.6264 30.6211C1.08614 30.2036 0.731235 29.5945 0.636814 28.9226Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask0)">
                                </g>
                                <path d="M14.7671 11.6607H22.5839L28.0972 6.46487C28.5852 6.00497 28.2597 5.18506 27.5891 5.18506H23.1085C22.1642 5.18506 21.2556 5.54576 20.5683 6.19342L14.7671 11.6607Z" fill="#F1543F"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.939 11.1065V15.1146H24.0338V11.1065C24.0338 10.6974 23.7022 10.3657 23.2931 10.3657H13.6797C13.2706 10.3657 12.939 10.6974 12.939 11.1065ZM22.7731 13.8811H14.1997V11.5992H22.7731V13.8811Z" fill="#F8B64C"/>
                                <path d="M22.5839 11.6607H14.7671L9.20569 6.46718C8.7144 6.00838 9.03905 5.18506 9.71126 5.18506H14.2424C15.1867 5.18506 16.0954 5.54576 16.7826 6.19341L22.5839 11.6607Z" fill="#FF7058"/>
                                <path d="M18.4864 34.7883C24.9273 34.7883 30.1486 29.6801 30.1486 23.3788C30.1486 17.0775 24.9273 11.9692 18.4864 11.9692C12.0456 11.9692 6.82422 17.0775 6.82422 23.3788C6.82422 29.6801 12.0456 34.7883 18.4864 34.7883Z" fill="#FFD15C"/>
                                <path d="M18.4568 32.0151C13.6028 32.0151 9.63135 28.1297 9.63135 23.3808C9.63135 18.632 13.6028 14.7466 18.4568 14.7466C23.3108 14.7466 27.2823 18.632 27.2823 23.3808C27.2823 28.1297 23.3108 32.0151 18.4568 32.0151Z" fill="#F8B64C"/>
                                <path d="M18.4396 17.6978L19.9024 22.0374H24.5933L20.7598 24.7496L22.2226 29.0892L18.4396 26.377L14.6566 29.0892L16.1193 24.7496L12.2859 22.0374H16.9768L18.4396 17.6978Z" fill="#FFD15C"/>
                              </svg>
                            </div>
                          )}
                          {candidature.statut === "Rejeter" && (
                            <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                              <img src="https://cdn-icons-png.freepik.com/512/4337/4337045.png" alt="Rejected" style={{ width: '50px', height: '50px' }} />
                            </div>
                          )}
                          <h3
                            className="card-title mt-3"
                            style={{ fontWeight: 'bold', color: '#666' }}
                          >
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : 'Loading...'}
                          </h3>{" "}
                          {matchingData}
                          <select
                            defaultValue={candidature.statut}
                            onChange={(e) =>
                              handleStatusChange(
                                candidature._id,
                                e.target.value
                              )
                            }
                            style={{
                              padding: '8px 16px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',

                              backgroundColor: '#607d8b14',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              cursor: 'pointer',
                              fontSize: '16px',
                              color: '#333',
                              appearance: 'none', // This is to remove default browser styles
                              WebkitAppearance: 'none', // This targets webkit browsers like Safari and Chrome
                              MozAppearance: 'none', // This targets Firefox
                              width: '-webkit-fill-available', // for WebKit browsers
                              textAlign: 'center', // center the text
                            }}
                          >
                            <option value="En cours">En cours</option>
                            <option value="Accepter">Approuvé</option>
                            <option value="Rejeter">Rejeter</option>
                          </select>
                          <div className="action-icons">
                            <button
                              onClick={() => navigateToPDFViewer(candidature.userId)}
                              className="btn"
                              style={{ background: 'none', border: 'none', color: "white", backgroundColor: "#4c4c4c" }}
                            >
                              <FaEye style={{ fontSize: "24px" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </>
  );
};

export default Candidatures;
