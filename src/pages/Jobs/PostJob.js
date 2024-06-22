import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import axios from 'axios';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    intitule: '',
    typeOffre: '',
    description: '',
    workplaceType: '',
    entrepriseNom: '',
    salaire: '',
    photo: '',
    userId: '', // Assumed to be retrieved from authentication
    tags: [],
  });

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenFromCookies();
        if (token) {
          const userId = await getUserIdFromToken(token);
          setJobData(prevJobData => ({ ...prevJobData, userId }));
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    fetchData();
  }, []);
  const getTokenFromCookies = async () => {
    return new Promise((resolve, reject) => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            resolve(token);
        } else {
            reject("Token not found in cookies");
        }
    });
};
const getUserIdFromToken = async () => {
    return new Promise((resolve, reject) => {
        const tokenString = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (tokenString) {
            const tokenParts = tokenString.split('.');
            if (tokenParts.length === 3) {
                const decodedToken = JSON.parse(atob(tokenParts[1]));
                console.log("Sujet du token (sub):", decodedToken.sub);
                resolve(decodedToken.sub);
            } else {
                reject("Token JWT invalide");
            }
        } else {
            reject("Token non trouvé dans les cookies");
        }
    });
};

  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  }

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  }

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  }

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    // Extract skills from state
    const data = {
      ...jobData,
      skills: skills,
    };
    try {
      
      const response = await axios.post('http://localhost:8081/api/offre/add', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 201) {
        console.log('Job offer successfully created!');
        // Reset form fields after successful submission
        setJobData({
          intitule: '',
          typeOffre: '',
          description: '',
          workplaceType: '',
          entrepriseNom: '',
          salaire: '',
          photo: '',
          userId: '',
          tags: [],
        });
        setSkills([]); // Reset skills as well
      } else {
        console.error('Error creating job offer:', response.statusText);
        // Handle errors appropriately, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error sending request:', error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  }

  return (
    <>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content bg-lightgrey theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-pinterest  border-0 d-flex rounded-3">
                  <Link to="/defaultsettings" className="d-inline-block mt-2"><i className="ti-arrow-left font-sm text-white"></i></Link>
                  <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Ajouter Offre d'emploi</h4>
                </div>
                <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Intitulé:</label>
                          <input
                            type="text"
                            name="intitule"
                            value={jobData.intitule}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Type d'Offre:</label>
                          <select
                            name="typeOffre"
                            value={jobData.typeOffre}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="">Sélectionner le Type d'Offre</option>
                            <option value="fulltime">Temps Plein</option>
                            <option value="parttime">Temps Partiel</option>
                            <option value="contract">Contrat</option>
                            <option value="internship">Stage</option>
                            <option value="others">Autre</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Description:</label>
                          <textarea
                            name="description"
                            value={jobData.description}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Type de Lieu de Travail:</label>
                          <select
                            name="workplaceType"
                            value={jobData.workplaceType}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="">Sélectionner le Type de Lieu de Travail</option>
                            <option value="on-site">Sur Site</option>
                            <option value="hybride">Hybride</option>
                            <option value="offsite">À Distance</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Nom de l'Entreprise:</label>
                          <input
                            type="text"
                            name="entrepriseNom"
                            value={jobData.entrepriseNom}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Salaire:</label>
                          <input
                            type="text"
                            name="salaire"
                            value={jobData.salaire}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="mont-font fw-600 font-xsss mb-2">Photo:</label>
                          <input
                            type="text"
                            name="photo"
                            value={jobData.photo}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-10">
                        <div className="form-group">
                          <label>Add Skills:</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={newSkill}
                              onChange={handleSkillChange}
                            />
<button type="button" className="btn" style={{ backgroundColor: "#445760", color:"#ffffff" }} onClick={addSkill}>Add</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      {skills.map((skill, index) => (
                        <div key={index} className="col-3">
                          <div className="alert alert-primary alert-dismissible fade show" role="alert">
                            {skill}
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => removeSkill(index)}></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="submit"   style={{ backgroundColor: "#bd081c", color:"#ffffff" }} className=" text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Poster</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostJob;
