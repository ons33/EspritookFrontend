import React, { useState, useEffect, Fragment } from "react";
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from "react-router-dom";
import CandidaturesByJobs from '../Candidatures/CandidaturesByJobs'; // Import the JobDetail component

const MyJobs = () => {
    const [jobList, setJobList] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [showStats, setShowStats] = useState(false); // Add state to toggle statistics view

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    const userId = await getUserIdFromToken(token);
                    const response = await axios.get(`http://localhost:8081/api/offre/offre/${userId}`);
                    const jobs = response.data.data;
                    setJobList(jobs);

                    // Fetch the number of candidatures for each job
                    const candidaturesCountPromises = jobs.map(job => 
                        axios.get(`http://localhost:8081/api/candidature/count/${job._id}`)
                    );

                    const candidaturesCounts = await Promise.all(candidaturesCountPromises);
                    const chartData = jobs.map((job, index) => ({
                        name: job.intitule,
                        value: candidaturesCounts[index].data.count
                    }));

                    setChartData(chartData);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchJobs();
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
                    resolve(decodedToken.sub);
                } else {
                    reject("Token JWT invalide");
                }
            } else {
                reject("Token non trouvé dans les cookies");
            }
        });
    };

    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
    };

    const handleShowStats = () => {
        setShowStats(true);
        setSelectedJobId(null);
    };

    const handleHideStats = () => {
        setShowStats(false);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" style={{ maxWidth: "100%" }}>
                        <div className="row">
                            <div className="col-xl-6 chat-left scroll-bar">
                                <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                    <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
                                        Mes offres d'emplois
                                        <form action="#" className="pt-0 pb-0 ms-auto">
                                            <div className="search-form-2 ms-2">
                                                <i className="ti-search font-xss"></i>
                                                <input type="text" className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here." />
                                            </div>
                                        </form>
                                        <Link title="add new" to="/postjob" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" style={{ border: 'none', textDecoration: 'none' }}>
                                            <i className="feather-plus-circle font-xss text-grey-500"></i>
                                        </Link>
                                        <button onClick={handleShowStats} title="Afficher Statistiques" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" style={{ border: 'none', textDecoration: 'none' }}>
                                            <i className="feather-bar-chart-2 font-xss text-grey-500"></i> 
                                        </button>
                                    </h2>
                                </div>

                                {jobList.map((value, index) => (
                                    <div key={index} className="card d-block w-100 border-0 mb-3 shadow-xss bg-white rounded-3 pe-4 pt-4 pb-4" style={{ paddingLeft: "120px" }}>
                                        <img src={value.photo} alt="job-avater" className="position-absolute p-2 bg-lightblue2 w65 ms-4 left-0" />
                                        <i className="feather-bookmark font-md text-grey-500 position-absolute right-0 me-3"></i>
                                        <h4 className="font-xss fw-700 text-grey-900 mb-3 pe-4">{value.intitule} <span className="font-xssss fw-500 text-grey-500 ms-4">({value.date})</span> </h4>
                                        <h5 className="font-xssss mb-2 text-grey-500 fw-600"><span className="text-grey-900 font-xssss text-dark">Location : </span> {value.lieu}</h5>
                                        <h5 className="font-xssss mb-2 text-grey-500 fw-600"><span className="text-grey-900 font-xssss text-dark">Type Offre : </span>{value.typeOffre}</h5>
                                        <h5 className="font-xssss text-grey-500 fw-600 mb-3"><span className="text-grey-900 font-xssss text-dark">Salary : </span> {value.salaire}</h5>
                                        <button onClick={() => handleJobSelect(value._id)} className="position-absolute bottom-15 mb-3 right-15" style={{ border: 'none', outline: 'none' }}>
                                            <i className="btn-round-sm text-white font-sm feather-chevron-right" style={{ backgroundColor: '#6c757d' }}></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="col-xl-6 ps-0 d-none d-xl-block">
                                {selectedJobId && <CandidaturesByJobs jobId={selectedJobId} />}
                                {showStats && (
                                    <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                        <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
                                            Statistiques des candidatures
                                            <button onClick={handleHideStats} className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" style={{ border: 'none', textDecoration: 'none' }}>
                                                <i className="feather-x font-xss text-grey-500"></i> 
                                            </button>
                                        </h2>
                                        {chartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p>Aucune donnée disponible pour le graphique.</p>
                                        )}
                                    </div>
                                )}
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

export default MyJobs;
