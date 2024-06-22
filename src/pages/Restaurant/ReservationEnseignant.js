import React, { Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import Popupchat from "../../components/Popupchat";
import Appfooter from "../../components/Appfooter";
import { Row, Col, Card, CardTitle, CardBody, CardSubtitle } from "reactstrap";
import Checkbox from '@mui/material/Checkbox';
import { pink, blue, green, yellow, orange, purple } from '@mui/material/colors';
import axios from "axios";

const ColorCheckboxes = () => {
    const [emploiEnseignant, setEmploiEnseignant] = useState({});
    const [jours, setJours] = useState([]);
    const [nomClient, setNomClient] = useState("John Doe");
    const [nbPersonnes, setNbPersonnes] = useState(4);
    const [checkedDays, setCheckedDays] = useState([]);
    const [prixTotal, setPrixTotal] = useState(0);
    const [userId,setUserId]=useState(null)

    const getEmploiEns = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/emploiEnseignant/isLastEmploienseiganant`);
            const joursIds = response.data.lastEmploiEnseignant.jours.map(jour => jour._id);
            setEmploiEnseignant(response.data.lastEmploiEnseignant);
            setJours(joursIds);

            // Calcul de la somme des prix des repas
            const totalPrixRepas = response.data.lastEmploiEnseignant.jours.reduce((total, jour) => {
                return total + (jour.repas[0].prix || 0);
            }, 0);

            setPrixTotal(totalPrixRepas);
            setCheckedDays(joursIds);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        console.log("**********IdUser***************")
        console.log(localStorage.getItem('userId'));
        console.log("***********IdUser**************")
        setUserId(localStorage.getItem('userId'))
        getEmploiEns();
    }, []);

    const handleCheckboxChange = (event, jourId) => {
        const { checked } = event.target;

        console.log('Jour**************');
        console.log("Checkbox changed - jourId:", jourId);
        console.log('Jour**************');

        if (checked) {
            const jour = emploiEnseignant.jours.find(jour => jour._id === jourId);
            if (jour) {
                const prixRepasAajouter = jour.repas[0]?.prix || 0;
                setPrixTotal(prevPrixTotal => prevPrixTotal + prixRepasAajouter);
                setCheckedDays(prevChecked => [...prevChecked, jourId]);
            }
        } else {
            const jour = emploiEnseignant.jours.find(jour => jour._id === jourId);
            if (jour) {
                const prixRepasADeduire = jour.repas[0]?.prix || 0;
                setPrixTotal(prevPrixTotal => prevPrixTotal - prixRepasADeduire);
                setCheckedDays(prevChecked => prevChecked.filter(item => item !== jourId));
            }
        }

        console.log("Jours checked:", checkedDays);
    };


    const colors = [pink[800], blue[800], green[800], yellow[800], orange[800], purple[800]];



    const ajouterReservation = async () => {
        try {
            const idsJoursSelectionnes = checkedDays;
console.log("idsJoursSelectionnes")
            console.log(idsJoursSelectionnes)
            console.log("idsJoursSelectionnes")
            const response = await axios.post("http://localhost:8081/api/reservation/ajouterReservation", {
                dateReservation: new Date().toISOString(),
                nomClient: userId,
                nbPersonnes: nbPersonnes,
                statutReservation: "En Attente", // Ajoutez le statut de réservation si nécessaire
                jours: idsJoursSelectionnes // Utiliser le tableau des IDs des jours sélectionnés
            });

            console.log("Réservation ajoutée :", response.data);
            // Mettre à jour l'état ou afficher un message de succès à l'utilisateur si nécessaire
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réservation :", error);
            // Gérer les erreurs ou afficher un message d'erreur à l'utilisateur si nécessaire
        }
    };






    return (
        <Fragment>
            <Header />
            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" style={{ maxWidth: "100%" }}>
                        <div className="row">
                            <div className="col-lg-12 position-relative">
                                <Row>
                                    <Col lg="12">
                                        <div>
                                            <Card>
                                                <CardBody>
                                                    <div>
                                                        <CardTitle tag="h5">Liste des jours</CardTitle>
                                                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                            Cochez les jours
                                                        </CardSubtitle>
                                                    </div>
                                                    {emploiEnseignant.jours && emploiEnseignant.jours.map((jour, index) => (
                                                        <div key={index}>
                                                            <Checkbox
                                                                checked={checkedDays.includes(jour._id)}
                                                                sx={{
                                                                    color: colors[index % colors.length],
                                                                    '&.Mui-checked': {
                                                                        color: colors[index % colors.length],
                                                                    },
                                                                }}
                                                                onChange={(event) => handleCheckboxChange(event, jour._id)}
                                                            />
                                                            <span>{jour.nomJour}</span>
                                                            <div>
                                                                {jour.repas.map((repas, repasIndex) => (
                                                                    <div key={repasIndex}>
                                                                        {repas.menu && (
                                                                            <>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>Prix: </span>
                                                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'blue' }}>{repas.prix} </span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>-</span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>(</span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>{repas.menu.entree}</span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}> - </span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>{repas.menu.platPrincipal}</span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}> - </span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>{repas.menu.dessert}</span>
                                                                                <span style={{ fontSize: '10px', fontWeight: 'bold', margin: '0 5px' }}>)</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <span>Prix Total: {prixTotal}</span>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="12">
                                        <button onClick={ajouterReservation}>Ajouter la réservation</button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popupchat />
            <Appfooter />
        </Fragment>
    );
}

export default ColorCheckboxes;
