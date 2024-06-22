import React, { Fragment, useEffect, useState } from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import axios from 'axios';
import Header from "../../../components/Header";
import Leftnav from "../../../components/Leftnav";
import Rightchat from "../../../components/Rightchat";
import Pagetitle from "../../../components/Pagetitle";
import Popupchat from "../../../components/Popupchat";
import Appfooter from "../../../components/Appfooter";
import {Alert, Button} from "reactstrap";
import PageTitleEmploi from "../../PageTitleEmploi";

const EmploiDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const emploiID = searchParams.get('id');
    const [emploi, setEmploi] = useState(null);
    const history = useHistory();
    const [successMessage,setSuccessMessage]=useState(null);
    const fetchEmploi = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/emploi/getEmploiByID/${emploiID}`);
            setEmploi(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'emploi :', error);
        }
    };

    useEffect(() => {

        if (emploiID) {
            fetchEmploi();
        }
    }, [emploiID]);

    // Fonction pour mapper chaque jour à son icône et sa couleur correspondantes
    const getJourData = (nomJour) => {
        const joursData = {
            dimanche: { couleur: '#f4c6f7', icone: 'D' }, // Rouge très clair
            lundi: { couleur: '#F9E79F', icone: 'L' }, // Jaune très clair
            mardi: { couleur: '#E8F8F5', icone: 'Ma' }, // Vert très clair
            mercredi: { couleur: '#D5F5E3', icone: 'Me' }, // Bleu très clair
            jeudi: { couleur: '#FDEBD0', icone: 'J' }, // Orange très clair
            vendredi: { couleur: '#edc7c6', icone: 'V' }, // Violet très clair
            samedi: { couleur: '#dfbced', icone: 'S' }, // Rose très clair
        };

        return joursData[nomJour.toLowerCase()] || { couleur: '#FFFFFF', icone: '' }; // Blanc par défaut
    };
    const navigateToJourDetails = (jourID) => {
        history.push(`/jour?id=${jourID}`);
    }
    // const [selectedStatut, setSelectedStatut] = useState('');

    const handleChangeStatut = async () => {
        try {
            // Faire la requête pour changer le statut de l'emploi
            const response = await axios.get(`http://localhost:8081/api/emploi/changestteAndCreateEmploienseignant/${emploiID}`);
            fetchEmploi()
            setSuccessMessage("Emploi Confirmé");

            console.log('Statut changé avec succès :', response.data);
            // Réactualiser ou mettre à jour les données si nécessaire
        } catch (error) {
            console.error('Erreur lors du changement de statut :', error);
        }
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
                                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 999 }}>
                                    {successMessage && (
                                        <Alert variant="info"  dismissible>
                                            {successMessage}
                                        </Alert>
                                    )}
                                </div>
                                <div className="col-xl-12 chat-left scroll-bar">
                                    {emploi ? (<>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="col-auto">
                                    <PageTitleEmploi title="Jours de l'emploi" dateDebut={new Date(emploi.dateDebut).toLocaleDateString('fr-FR')} dateFin={new Date(emploi.dateFin).toLocaleDateString('fr-FR')} annee={emploi.annee} status={emploi.statut} />
                                        </div>
                                        <span style={{marginRight:"20px"}} >
                                        <p>si vous avez verifier l'empli , vous pouvez le confirmer !</p>
 <div className="row">
            <div className="col">
                <form className="d-flex align-items-center">
                    <select className="form-select me-3" name="statutEmploi" >
                        <option value="Terminé">Confirmé</option>
                        <option value="En Cours">Petit En Cours</option>
                    </select>
                </form>
                                    <button className="btn btn-secondary" onClick={handleChangeStatut}>Changer Statut</button>

            </div>
        </div>

                                            </span>
                                    </div>

                                        </>
                                        ) :(<></>) }
                                    <div className="row ps-5 pe-2">



                                        {emploi ? (
                                            <>
                                                {emploi.jours.map((jour, index) => {
                                                    const { couleur, icone } = getJourData(jour.nomJour);
                                                    return (

                                                        <div className="col-lg-3 pe-2 border-top" key={index} >
                                                            <div className="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style={{ background: couleur }}>
                                                                <div className="card-body d-flex p-0">
                                                                    {/*<i className="btn-round-lg d-inline-block  bg-primary-gradiant  font-md text-white">{icone}</i>*/}
                                                                    <h4 className="text-primary font-xl fw-700">{jour.nomJour} <span className="fw-500 mt-0 d-block text-grey-500 font-xssss">{jour.typeJour} , {new Date(jour.dateJour).toLocaleDateString('fr-FR')}</span></h4>

                                                                </div>
                                                                {jour.repas.length > 0 ? (
                                                                    <div>
                                                                        <ul>
                                                                            {jour.repas.map((repas, index) => (
                                                                              <tr key={index} >
                                                                                    <b>{repas.typeRepas}</b>
                                                                                    <h6 className="font-xsss fw-600 text-grey-500 ls-2">Prix: {repas.prix}</h6>
                                                                                    <h4 className="text-danger font-xssss fw-700 ls-2">Menu</h4>
                                                                                    <h6 className="font-xsss fw-600 text-grey-500 ls-2">Plat principal: {repas.menu.platPrincipal}</h6>
                                                                                    <h6 className="font-xsss fw-600 text-grey-500 ls-2">Entrée: {repas.menu.entree}</h6>
                                                                                    <h6 className="font-xsss fw-600 text-grey-500 ls-2">Dessert: {repas.menu.dessert}</h6>
                                                                                </tr>
                                                                            ))}

                                                                        </ul>
                                                                        {emploi.statut !== "Terminé" ?(
                                                                        <Button onClick={() => navigateToJourDetails(jour._id) }  >Modifier</Button>
                                                                        ) : null
                                                                        }
                                                                    </div>
                                                                ) : (<>
                                                                    <p>Aucun repas prévu pour ce jour.</p>
                                                                        {emploi.statut !== "Terminé" ?(
                                                                            < Button onClick={() => navigateToJourDetails(jour._id)}  >Ajouter</Button>
                                                                        ) : null
                                                                        }
</>
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


        // <div>
        //     {emploi ? (
        //         <div>
        //             <h1>Emploi Details</h1>
        //             <p>Date de début: {emploi.dateDebut}</p>
        //             <p>Date de fin: {emploi.dateFin}</p>
        //             <p>Année: {emploi.annee}</p>
        //             {/* Affichez d'autres détails de l'emploi selon vos besoins */}
        //         </div>
        //     ) : (
        //         <p>Loading...</p>
        //     )}
        // </div>
    );
};

export default EmploiDetails;
