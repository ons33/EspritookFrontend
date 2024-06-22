import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import ReactMapGl, { Marker, NavigationControl } from 'react-map-gl';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import axios from 'axios';
const jwt = require('jsonwebtoken');

const Token = process.env.REACT_APP_MAPBOX_TOKEN;

const Eventform = () => {
    const [intitule, setIntitule] = useState('');
    const [categorieEvenement, setCategorieEvenement] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState(null);
    const [description, setDescription] = useState('');
    const [dateEvenement, setDateEvenement] = useState('');
    const [typeEvenement, setTypeEvenement] = useState('');
    const [nomOrganisateur, setNomOrganisateur] = useState('');
    const [capaciteMax, setCapaciteMax] = useState('');
    const [modaliteInscription, setModaliteInscription] = useState('Gratuit');
    const [viewport, setViewport] = useState({
        latitude: 36.89758879207396,
        longitude: 10.189666390876056,
        zoom: 11,
        width: "100%",
        height: "550px"
    });
    const [marker, setMarker] = useState({
        latitude: 28.6448,
        longitude: 77.216
    });
   
    const history = useHistory();

    const handleClick = (e) => {
        const { lngLat } = e;
        const longitude = lngLat.lng;
        const latitude = lngLat.lat;
        setMarker({
            latitude: latitude,
            longitude: longitude
        });
    };

    useEffect(() => {
        console.log("new place", marker);
        const getTokenFromCookies = async () => {
            const token = document.cookie.replace(
              /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            );
            return token ? token : Promise.reject("Token not found in cookies");
          };
      
          const getUserIdFromToken = async (token) => {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const decodedToken = JSON.parse(atob(tokenParts[1]));
              return decodedToken.sub;
            } else {
              throw new Error("Token JWT invalide");
            }
          };
      
          const fetchData = async () => {
            try {
              const token = await getTokenFromCookies();
              const userId = await getUserIdFromToken(token);
              const decodedToken = jwt.decode(token);
              const emailUser = decodedToken.email;
              console.log("emailUser", emailUser);
              setEmail(emailUser);
              console.log("User ID set as:", userId); // Debugging
            } catch (error) {
              console.error('Error retrieving user ID:', error);
            }
          };
          fetchData(); // Trigger fetching and checking when component mounts
        
    }, [marker]);

  
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const categories = ['Conférence', 'Séminaire', 'Atelier', 'Webinaire'];
    const types = ['Éducation', 'Santé', 'Technologie', 'Loisirs'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!marker) {
            alert("Please select a location on the map.");
            return;
        }
    
        const formData = new FormData();
        formData.append('intitule', intitule);
        formData.append('categorieEvenement', categorieEvenement);
        formData.append('image', image);
        formData.append('description', description);
        formData.append('dateEvenement', dateEvenement);
        formData.append('lieuEvenement', JSON.stringify({ type: 'Point', coordinates: [marker.longitude, marker.latitude] }));
        formData.append('typeEvenement', typeEvenement);
        formData.append('nomOrganisateur', nomOrganisateur);
        formData.append('capaciteMax', capaciteMax);
        formData.append('modaliteInscription', modaliteInscription);
        formData.append('userId', email);
    
        try {
            await axios.post('http://localhost:8081/api/evenements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            history.push('/contactinformation');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des informations:', error);
        }
    };

    return (
        <Fragment> 
            <div className="main-wrapper">
                <Header />
                <Leftnav />
                <Rightchat />
                <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left">
                            <div className="middle-wrap">
                                <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                    <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                        <Link to="/mesEvenement" className="d-inline-block mt-2"><i className="ti-arrow-left font-sm text-white"></i></Link>
                                        <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Ajouter un evenement</h4>
                                    </div>
                                    <div className="card-body p-lg-5 p-4 w-100 border-0 mb-0">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss">Titre Evenement </label>
                                                        <input type="text" value={intitule} onChange={(e) => setIntitule(e.target.value)} className="form-control" required />
                                                    </div>        
                                                </div>
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss"> Categorie Evenement</label>
                                                        <select value={categorieEvenement} onChange={(e) => setCategorieEvenement(e.target.value)} className="form-control" required>
                                                            <option value="">Sélectionner une catégorie</option>
                                                            {categories.map((category, index) => (
                                                                <option key={index} value={category}>{category}</option>
                                                            ))}
                                                        </select>
                                                    </div>        
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss"> Image </label>
                                                        <input type="file" onChange={handleImageChange} className="form-control" required />
                                                    </div>        
                                                </div>
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss"> Description</label>
                                                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
                                                    </div>        
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss">Date de l'evenement </label>
                                                        <input type="date" value={dateEvenement} onChange={(e) => setDateEvenement(e.target.value)} className="form-control" required />
                                                    </div>        
                                                </div>
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss">Type de l'evenement</label>
                                                        <select value={typeEvenement} onChange={(e) => setTypeEvenement(e.target.value)} className="form-control" required>
                                                            <option value="">Sélectionner un type</option>
                                                            {types.map((type, index) => (
                                                                <option key={index} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>        
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss"> Nom de l'organisateur</label>
                                                        <input type="text" value={nomOrganisateur} onChange={(e) => setNomOrganisateur(e.target.value)} className="form-control" required />
                                                    </div>        
                                                </div>
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss">Capacité maximale </label>
                                                        <input type="number" value={capaciteMax} onChange={(e) => setCapaciteMax(e.target.value)} className="form-control" required />
                                                    </div>        
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label className="mont-font fw-600 font-xsss"> Modalité de participation</label>
                                                        <select value={modaliteInscription} onChange={(e) => setModaliteInscription(e.target.value)} className="form-control" required>
                                                            <option value="Gratuit">Gratuit</option>
                                                            <option value="Payant">Payant</option>
                                                            <option value="Sur invitation">Sur invitation</option>
                                                        </select>
                                                    </div>        
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="rounded-3 overflow-hidden mb-2" style={{ height: '550px', width: '100%', zIndex:999}}>
                                                        <ReactMapGl
                                                            {...viewport}
                                                            mapboxAccessToken={Token}
                                                            mapStyle="mapbox://styles/mapbox/streets-v11"
                                                            onMove={(evt) => setViewport(evt.viewState)}
                                                            onDblClick={handleClick}
                                                            doubleClickZoom={false}
                                                        >
                                                            {marker && (
                                                                <Marker 
                                                                    latitude={marker.latitude} 
                                                                    longitude={marker.longitude}
                                                                    offsetLeft={-3.5 * viewport.zoom}  
                                                                    offsetTop={-7 * viewport.zoom}
                                                                >
                                                                    <div style={{ fontSize: '24px', cursor: "pointer" }}>📍</div>
                                                                </Marker>
                                                            )}
                                                            <NavigationControl position="top-right" />
                                                        </ReactMapGl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-0 mt-2 ps-0">
                                                <button type="submit" className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
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

export default Eventform;
