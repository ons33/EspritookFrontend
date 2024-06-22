import React, { Fragment, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from "../../../components/Header";
import Leftnav from "../../../components/Leftnav";
import Rightchat from "../../../components/Rightchat";
import Pagetitle from "../../../components/Pagetitle";
import Popupchat from "../../../components/Popupchat";
import Appfooter from "../../../components/Appfooter";
import PageTitleJour from "../../../components/PageTitleJour";
import {Alert, Button} from "reactstrap";
// import { BsAm} from 'react-icons/bs';
import { FaCookie, FaUtensilSpoon } from 'react-icons/fa';
import { BsClock, BsCoffee, BsSun } from 'react-icons/bs';
import { FaUtensils } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
const JourDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const jourId = searchParams.get('id');
    const [jour, setJour] = useState(null);
    const history = useHistory();
    const [isEditing, setIsEditing] = useState(false);
    const [editedRepasMenu, setEditedRepasMenu] = useState({});
    const [editingRepasID, setEditingRepasID] = useState(null);
    const[editedRepasType,setEditedRepasType]=useState(null);
    const [editedRepasPrix,setEditedRepasPrix] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorsRepas,setErrorsRepas] =useState(null)
    const [menu, setMenu] = useState({
        platPrincipal: '',
        entree: '',
        dessert: ''
    });
    const [repasData, setRepasData] = useState({
        platPrincipal: "",
        entree: "",
        dessert: "",
        typeRepas: "",
        prix: ""
    });
    const [successMessage,setSuccessMessage]=useState(null);
    const fetchJour = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/jour/getJourById/${jourId}`);
            setJour(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'emploi :', error);
        }
    };
    useEffect(() => {


        if (jourId) {
            fetchJour();
        }

        const timer = setTimeout(() => {

            setSuccessMessage('');

        }, 3000);

        return () => clearTimeout(timer);
    }, [jourId, successMessage]);

    const handleEditClick = async (repasID) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/repas/repasById/${repasID}`);
            const repasData = response.data.repas;
            setEditedRepasMenu({
                platPrincipal: repasData.menu.platPrincipal,
                entree: repasData.menu.entree,
                dessert: repasData.menu.dessert
            });
            setEditedRepasType(repasData.typeRepas);
            setEditedRepasPrix(repasData.prix);
            setIsEditing(true);
            setEditingRepasID(repasID);
        } catch (error) {
            console.error('Erreur lors de la récupération du repas :', error);
        }
    };

    const handleRepasModification = async (e, repasID) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8081/api/repas/updateRepas/${repasID}`, {
                typeRepas: editedRepasType,
                prix: editedRepasPrix,
                menu: {
                    platPrincipal: editedRepasMenu.platPrincipal,
                    entree: editedRepasMenu.entree,
                    dessert: editedRepasMenu.dessert
                }
            });

            setIsEditing(false);
            setEditingRepasID(null);
            const refreshedJourResponse = await axios.get(`http://localhost:8081/api/jour/getJourById/${jourId}`);
            setJour(refreshedJourResponse.data);
            setErrors({});

            setSuccessMessage("Repas Modifié");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response && error.response.data && error.response.data.message) {
                // Si le serveur a renvoyé un message d'erreur spécifique
                setErrorsRepas( error.response.data.message);
                // Affichez le message d'erreur dans une boîte de dialogue, une alerte ou tout autre moyen approprié dans votre interface utilisateur
            } else {
                setErrorsRepas( error.message);
            }
        }
    };

    const handleInputChange = (field, value) => {
        if (field === 'typeRepas') {
            setEditedRepasType(value);
        } else if (field === 'prix') {
            setEditedRepasPrix(value);
        } else {
            setEditedRepasMenu(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    };
    const getRepasData = (typeRepas) => {
        const repasData = {
            'Déjeuner': '#f4c6f7',
            'Petit Déjeuner': '#F9E79F',
            'Dîner': '#b5b8f2'
        };

        return repasData[typeRepas] || '#FFFFFF'; // Blanc par défaut
    };
    const handleAddRepas = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8081/api/jour/AddJourWithRepasAndMenuByID/${jourId}`, repasData);


            console.log(response.data)
            console.log("repas Data:",JSON.stringify(repasData))
            //
            // if (!response.ok) {
            //     throw new Error('Erreur lors de l\'ajout du repas');
            // }

            setShowModal(false);
            setErrors({});
            if(jourId){
                fetchJour()
            }
            setSuccessMessage(response.data.message);
            // Ajoutez ici d'autres actions après l'ajout du repas, si nécessaire
        }  catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response && error.response.data && error.response.data.message) {
                // Si le serveur a renvoyé un message d'erreur spécifique
                setErrorsRepas( error.response.data.message);
                // Affichez le message d'erreur dans une boîte de dialogue, une alerte ou tout autre moyen approprié dans votre interface utilisateur
            } else {
             setErrorsRepas( error.message);
            }
        }
    };
    const handleInputChangeRepas = (event) => {
        const { name, value } = event.target;
        setRepasData({ ...repasData, [name]: value });
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
                            <div className="col-xl-12 chat-left scroll-bar">
                                {jour ? (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="col-auto">
                                            <PageTitleJour title="Jour :" dateJour={new Date(jour.dateJour).toLocaleDateString('fr-FR')} nomJour={jour.nomJour} typeJour={jour.typeJour} />
                                        </div>
                                        <div className="col-auto">

                                            <button className="btn btn-primary"onClick={handleAddRepas} >Ajouter Repas</button>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 999 }}>
                                    {successMessage && (
                                        <Alert variant="info"  dismissible>
                                            {successMessage}
                                        </Alert>
                                    )}
                                </div>
                                <Modal show={showModal} onHide={handleCloseModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Ajouter Repas</Modal.Title>


                                    </Modal.Header>
                                    <Modal.Body>
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="platPrincipal" className="form-label">Plat Principal</label>
                                                <div className="input-group">
                                                    <span className="input-group-text"><FaUtensils /></span>

                                                    <input type="text" className="form-control" id="platPrincipal" name="platPrincipal" value={repasData.platPrincipal} onChange={handleInputChangeRepas} />
                                                {errors.platPrincipal && <div className="text-danger">{errors.platPrincipal}</div>}
                                                </div>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="entree" className="form-label">Entrée</label>
                                                <div className="input-group">
                                                    <span className="input-group-text"><FaUtensilSpoon /></span>

                                                    <input type="text" className="form-control" id="entree" name="entree" value={repasData.entree} onChange={handleInputChangeRepas} />
                                                {errors.entree && <div className="text-danger">{errors.entree}</div>}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="dessert" className="form-label">Dessert</label>
                                                <div className="input-group">
                                                    <span className="input-group-text"><FaCookie /></span>
                                                <input type="text" className="form-control" id="dessert" name="dessert" value={repasData.dessert} onChange={handleInputChangeRepas} />
                                                {errors.dessert && <div className="text-danger">{errors.dessert}</div>}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="typeRepas" className="form-label">Type de Repas</label>
                                                <select className="form-select" id="typeRepas" name="typeRepas" value={repasData.typeRepas} onChange={handleInputChangeRepas}>
                                                    <option value="Déjeuner">Déjeuner</option>
                                                    <option value="Petit Déjeuner">Petit Déjeuner</option>
                                                    <option value="Dîner">Dîner</option>
                                                </select>



                                                {errors.typeRepas && <div className="text-danger">{errors.typeRepas}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="prix" className="form-label">Prix</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">DT</span>
                                                <input type="text" className="form-control" id="prix" name="prix" value={repasData.prix} onChange={handleInputChangeRepas} />
                                                {errors.prix && <div className="text-danger">{errors.prix}</div>}
                                                </div>
                                            </div>
                                            <Button type="submit" className="btn btn-primary">Ajouter</Button>
                                            {errorsRepas && <div className="text-danger">{errorsRepas}</div>}
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
                                    </Modal.Footer>
                                </Modal>
                                <div className="row ps-5 pe-2">
                                    {jour ? (
                                        <>
                                            {jour.repas.map((repas, index) => {
                                                const couleur = getRepasData(repas.typeRepas);

                                                return (
                                                    <div className="col-lg-4 pe-2 border-top" key={index} >
                                                        <div className="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style={{ background: couleur }}>
                                                            <div className="card-body d-flex p-0">
                                                                <h4 className="text-primary font-xl fw-700">{repas.typeRepas}</h4>
                                                            </div>

                                                            {repas.menu != null ? (
                                                                <div>
                                                                    <ul key={repas.menu._id}>
                                                                        <h4 className="text-danger font-xssss fw-700 ls-2">Menu</h4>
                                                                        {isEditing && editingRepasID === repas._id ? (
                                                                            <form onSubmit={(e) => handleRepasModification(e, repas._id)}>

                                                                                <div className="form-group">
                                                                                    <label htmlFor="typeRepas">Type de repas:</label>
                                                                                    <select
                                                                                        className="form-control"
                                                                                        value={editedRepasType}
                                                                                        onChange={(e) => handleInputChange('typeRepas', e.target.value)}
                                                                                        disabled
                                                                                    >
                                                                                        <option value="Déjeuner">Déjeuner</option>
                                                                                        <option value="Petit Déjeuner">Petit Déjeuner</option>
                                                                                        <option value="Dîner">Dîner</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label htmlFor="prix">Prix:</label>

                                                                                    <div className="input-group">
                                                                                        <span className="input-group-text">DT</span>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="form-control"
                                                                                            value={editedRepasPrix}
                                                                                            onChange={(e) => handleInputChange('prix', e.target.value)}
                                                                                        />
                                                                                        {errors.prix && <div className="text-danger">{errors.prix}</div>}

                                                                                    </div>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label htmlFor="platPrincipal">Plat principal:</label>
                                                                                    <div className="input-group">
                                                                                        <span className="input-group-text"><FaUtensils /></span>

                                                                                        <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={editedRepasMenu.platPrincipal}
                                                                                        onChange={(e) => handleInputChange('platPrincipal', e.target.value)}
                                                                                    />
                                                                                        {errors.platPrincipal && <div className="text-danger">{errors.platPrincipal}</div>}

                                                                                    </div>
                                                                                </div>
                                                                                <div className="form-group">

                                                                                    <label htmlFor="entree">Entrée:</label>
                                                                                    <div className="input-group">
                                                                                        <span className="input-group-text"><FaUtensilSpoon /></span>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={editedRepasMenu.entree}
                                                                                        onChange={(e) => handleInputChange('entree', e.target.value)}
                                                                                    />
                                                                                        {errors.entree && <div className="text-danger">{errors.entree}</div>}

                                                                                    </div>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label htmlFor="dessert">Dessert:</label>
                                                                                    <div className="input-group">
                                                                                    <span className="input-group-text"><FaCookie /></span>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={editedRepasMenu.dessert}
                                                                                        onChange={(e) => handleInputChange('dessert', e.target.value)}
                                                                                    />
                                                                                        {errors.dessert && <div className="text-danger">{errors.dessert}</div>}

                                                                                    </div>
                                                                                </div>
                                                                                <br/>
                                                                                <Button type="submit" className="btn btn-primary">Enregistrer</Button>
                                                                            </form>
                                                                        ) : (
                                                                            <>
                                                                                <h6 className="text-black font-xssss fw-700 ls-2">Plat principal: {repas.menu.platPrincipal}</h6>
                                                                                <h6 className="text-black font-xssss fw-700 ls-2">Entrée: {repas.menu.entree}</h6>
                                                                                <h6 className="text-black font-xssss fw-700 ls-2">Dessert: {repas.menu.dessert}</h6>
                                                                                <h6 className="text-black font-xssss fw-700 ls-2">Prix: {repas.prix} DT</h6>
                                                                                <br/>
                                                                                <Button className="btn btn-primary" onClick={() => handleEditClick(repas._id)}>Modifier</Button>
                                                                            </>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            ) : (
                                                                <p>Aucun repas prévu pour ce jour.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : null}
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

export default JourDetails;
