import React, { useState, useEffect, Fragment } from "react";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Pagetitle from '../components/Pagetitle';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import axios from 'axios';
import { Link } from "react-router-dom";
import JobDetail from './JobDetail'; // Import the JobDetail component


const Job = () => {
    const [jobList, setJobList] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterWorkplaceType, setFilterWorkplaceType] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showFilters, setShowFilters] = useState(false); // Add state for showing filters

    useEffect(() => {
        fetchJobs();
         // Load jobs when component mounts
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/offre');
            setJobList(response.data.data);
        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };

    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
    };



    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        handleSearch(newSearchTerm);
    };
    const handleSearch = async (term) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/offre/offre/search?intitule=${term}`);
            setJobList(response.data.data);
            console.log("jobList", jobList);
        } catch (error) {
            console.error('Error searching for jobs:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };

    const handleWorkplaceTypeFilterChange = (event) => {
        setFilterWorkplaceType(event.target.value);
    };

    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    // Function to toggle the visibility of filters
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
 // Function to check if the job date falls within the specified range
 const checkDate = (jobDate, filterDate) => {
    const currentDate = new Date();
    switch (filterDate) {
        case 'lastMonth':
            const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            return jobDate >= firstDayOfLastMonth && jobDate <= lastDayOfLastMonth;
        case 'lastWeek':
            const lastWeekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
            return jobDate >= lastWeekStartDate && jobDate <= currentDate;
        case 'last24h':
            const last24hDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)); // Get the date and time 24 hours ago
            return jobDate >= last24hDate && jobDate <= currentDate;
        default:
            return true;
    }
};

const filteredJobs = jobList.filter(job => {
    if (filterType && filterWorkplaceType && filterDate) {
        return job.typeOffre === filterType && job.workplaceType === filterWorkplaceType && checkDate(new Date(job.createdAt), filterDate);
    } else if (filterType && filterWorkplaceType) {
        return job.typeOffre === filterType && job.workplaceType === filterWorkplaceType;
    } else if (filterType && filterDate) {
        return job.typeOffre === filterType && checkDate(new Date(job.createdAt), filterDate);
    } else if (filterWorkplaceType && filterDate) {
        return job.workplaceType === filterWorkplaceType && checkDate(new Date(job.createdAt), filterDate);
    } else if (filterType) {
        return job.typeOffre === filterType;
    } else if (filterWorkplaceType) {
        return job.workplaceType === filterWorkplaceType;
    } else if (filterDate) {
        return checkDate(new Date(job.createdAt), filterDate);
    } else {
        return true;
    }
});
const calculateBrighterRed = (index) => {
    // Parse the hexadecimal color
    const hexColor = "#c32439";
    const hex = hexColor.slice(1);
    const bigint = parseInt(hex, 16);
  
    // Extract RGB values
    let red = (bigint >> 16) & 255;
    let green = (bigint >> 8) & 255;
    let blue = bigint & 255;
  
    // Calculate brightness increase factor
    const factor = 20 * index;
  
    // Increase brightness while ensuring values don't exceed 255
    red = Math.min(255, red + factor);
    green = Math.min(255, green + factor);
    blue = Math.min(255, blue + factor);
  
    // Convert RGB values back to hexadecimal
    const brighterHex = ((red << 16) | (green << 8) | blue).toString(16);
  
    // Return the brighter shade
    return `#${brighterHex.padStart(6, "0")}`;
};

   
    




    return (
        <Fragment> 
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" style={{maxWidth: "100%"}}>
                        <div className="row">
                            <div className="col-xl-6 chat-left scroll-bar">
                                <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                    <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">Les offres d'emplois
                                        <form action="#" className="pt-0 pb-0 ms-auto">
                                            <div className="search-form-2 ms-2">
                                                <i className="ti-search font-xss"></i>
                                                <input type="text" className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here."  value={searchTerm}  onChange={handleChange} />
                                            </div>
                                            <a className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" onClick={toggleFilters}><i className="feather-filter font-xss text-grey-500"></i></a>
                                            {showFilters && (
                                                <div>
                                                    <select className="form-select ms-2 bg-greylight theme-dark-bg text-grey-500 rounded-3" value={filterType} onChange={handleFilterChange}>
                                                        <option value="">Tous les types</option>
                                                        <option value="fulltime">Temps plein</option>
                                                        <option value="parttime">Temps partiel</option>
                                                        <option value="contract">Contrat</option>
                                                        <option value="internship">Stage</option>
                                                    </select>
                                                    <select className="form-select ms-2 bg-greylight theme-dark-bg text-grey-500 rounded-3" value={filterWorkplaceType} onChange={handleWorkplaceTypeFilterChange}>
                                                        <option value="">Tous les types de lieu de travail</option>
                                                        <option value="on-site">Bureau</option>
                                                        <option value="offsite">À distance</option>
                                                        <option value="hybride">Hybride</option>
                                                    </select>
                                                    <select className="form-select ms-2 bg-greylight theme-dark-bg text-grey-500 rounded-3" value={filterDate} onChange={handleFilterDateChange}>
                                                        <option value="">Date postée</option>
                                                        <option value="lastMonth">Le mois dernier</option>
                                                        <option value="lastWeek">La semaine dernière</option>
                                                        <option value="last24h">Les dernières 24 heures</option>
                                                    </select>
                                                </div>
                                            )}
                                        </form>
                                    </h2>
                                    <p className="review-link font-xssss fw-500 text-grey-500 lh-3"></p>
                                    <h4 className="text-danger font-xssss fw-700 ls-2"></h4>
                                </div>  

                                {filteredJobs.map((value, index) => (
                                    <div key={index} className="card d-block w-100 border-0 mb-3 shadow-xss bg-white rounded-3 pe-4 pt-4 pb-4"  style={{paddingLeft: "120px"}}>
                                        <img src={value.photo} alt="job-avater" className="position-absolute p-2 bg-lightblue2 w65 ms-4 left-0" />
                                        <i className="feather-bookmark font-md text-grey-500 position-absolute right-0 me-3"></i>
                                        <h4 className="font-xss fw-700 text-grey-900 mb-3 pe-4">{value.intitule}  </h4>
                                        <h5 className="font-xssss mb-2 text-grey-500 fw-600"><span className="text-grey-900 font-xssss text-dark">Type Offre : </span>{value.typeOffre}</h5>
                                        <h5 className="font-xssss text-grey-500 fw-600 mb-3"><span className="text-grey-900 font-xssss text-dark">Salaire : </span> {value.salaire} DT</h5>
                                        {value.skills && value.skills.map((skills, tagIndex) => (
    <h6 key={tagIndex} 
        className="d-inline-block p-2 fw-600 font-xssss rounded-3 me-2" 
        style={{ backgroundColor: calculateBrighterRed(tagIndex), color:"#ffffff" }}>
        {skills}
    </h6>
))}
                                       <button onClick={() => handleJobSelect(value._id)} 
    className="position-absolute bottom-15 mb-3 right-15" 
    style={{ 
        border: 'none',
        outline: 'none' // Remove default focus styling
    }}     
    onMouseDown={(e) => e.currentTarget.querySelector('i').style.backgroundColor = '#c90c0f'} // Change color when button is pressed
    onMouseUp={(e) => e.currentTarget.querySelector('i').style.backgroundColor = '#6c757d'} // Restore original color when button is released
>
    <i className="btn-round-sm text-white font-sm feather-chevron-right" style={{ backgroundColor: '#6c757d' }}></i>
</button>
                                    </div>
                                ))}
                            </div>
                            <div className="col-xl-6 ps-0 d-none d-xl-block">
                                {selectedJobId && <JobDetail jobId={selectedJobId} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter /> 
        </Fragment>
    );
};

export default Job;
