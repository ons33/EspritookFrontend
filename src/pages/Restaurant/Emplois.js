import React, {Fragment, useEffect, useState} from "react";
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import {Row, Col, Table, Card, CardTitle, CardBody, CardSubtitle, Button, Alert} from "reactstrap";
import ProjectTable from "./components/ProjectTable";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Pagetitle from "../../components/Pagetitle";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
const Jours = () => {
    const [emplois, setEmplois] = useState([]);
    const[jours,setjours]=useState(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isBefore, setIsBefore] = useState('true');
    const[remplirEmploi,setRemplirEmploi] = useState("false")
    const history = useHistory();
    const wapperDivStyle = { border: '1px solid #ccc' };
    const scrollingDivStyle = { padding: '10px', height: '70px', overflow: 'auto' };
    const getAllemplois = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/emploi/getAllEmploi`);
            return response.data;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    const fetchEmplois = async () => {
        try {
            const emploisData = await getAllemplois();
            setEmplois(emploisData);
        } catch (error) {
            console.error("Erreur lors de la récupération des emplois :", error);
        }
    }
    const isLastDayBeforeToday = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/jour/isLastDayBeforeToday');
            setIsBefore(response.data.isBefore.toString());
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    useEffect(() => {


        isLastDayBeforeToday();
        fetchEmplois();

    }, []);
    const remplirEmploiSemaine=async () => {
        try {
            const response = await axios.post(`http://localhost:8081/api/emploi/emplois`);
            fetchEmplois()
            setSuccessMessage("Bien ! emploi de la semaine bien rempli");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
                clearMessagesAfterDelay();
            } else {
                setErrorMessage("Erreur lors de la création de l'emploi");
                clearMessagesAfterDelay();
            }
        }}
    const navigateToEmploiDetails = (emploiID) => {
        history.push(`/emploi?id=${emploiID}`);
    }
    const getNomJour = () => {
        const aujourdHui = new Date().getDay();
        return jours[aujourdHui];
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const createBetween2Dates = async () => {
        if (!startDate || !endDate) {
            setErrorMessage("Veuillez choisir une date de début et une date de fin.");
            return;
        }


        try {
            // Formatage des dates avant de les envoyer au backend
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            const response = await axios.post(`http://localhost:8081/api/jour/createJoursBetweenDates`, { startDate: formattedStartDate, endDate: formattedEndDate });
            setSuccessMessage("Les jours ont été ajoutés avec succès.");
            setIsBefore("false")
            setRemplirEmploi("true")
            clearMessagesAfterDelay();

        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
                clearMessagesAfterDelay();
            } else {
                setErrorMessage('Erreur lors de la création des jours entre les dates.');
                clearMessagesAfterDelay();
            }
        }
    }
    const clearMessagesAfterDelay = () => {
        setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 6000); }
    const handleAfficherPDF = async (emploiId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/emploi/afficherEmploiEnseignantParIdEmploi/${emploiId}`);
            const data = await response.json();

            // Génération du PDF
            const doc = new jsPDF();

            // Ajouter le titre
            doc.setFont('times', 'roman');
            doc.setFontSize(16);
            doc.text('Emploi de la semaine', 105, 20, { align: 'center' });

            // Ajouter l'année, la date de début et la date de fin de l'emploi
            doc.setFontSize(12);
            doc.text(`Année: ${data.emploiEnseignant.annee}`, 15, 30);
            doc.text(`Date de début: ${new Date(data.emploiEnseignant.dateDebut).toLocaleDateString('fr-FR')}`, 15, 40);
            doc.text(`Date de fin: ${new Date(data.emploiEnseignant.dateFin).toLocaleDateString('fr-FR')}`, 15, 50);

            // Créer un tableau pour stocker les données
            const tableau = [];

            // Ajouter les en-têtes du tableau
            tableau.push(['Jours', ...data.emploiEnseignant.jours.map(jour => `${jour.nomJour} - ${new Date(jour.dateJour).toLocaleDateString('fr-FR')}`)]);
            tableau.push(['Déjeuner', ...data.emploiEnseignant.jours.map(jour => {
                const menu = jour.repas.find(repas => repas.typeRepas === 'Déjeuner');
                if (menu) {
                    return `\u2022 Plat Principal: ${menu.menu.platPrincipal}\n  \u2022 Entrée: ${menu.menu.entree}\n  \u2022 Dessert: ${menu.menu.dessert}\n  \u2022 Prix: ${menu.prix}`;
                } else {
                    return '';
                }
            })]);

            // Ajouter le tableau au document
            doc.autoTable({
                head: tableau.slice(0, 1),
                body: tableau.slice(1),
                startY: 60, // Position de départ du tableau
                margin: { top: 70 } // Marge supplémentaire pour le titre et les informations d'emploi
            });

            // Téléchargement du PDF
            doc.save('emploi.pdf');
        } catch (error) {
            console.error('Erreur lors de la récupération des données PDF :', error);
            // Gérer les erreurs, par exemple afficher un message d'erreur à l'utilisateur
        }
    };


    const createMultipleJours = async () => {
        try {
           await axios.post(`http://localhost:8081/api/jour/createMultipleJours`);

            setSuccessMessage("Les jours ont été créés avec succès.");
            setRemplirEmploi("true")
            fetchEmplois();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {

                setErrorMessage(error.response.data.error);
            } else {


                setErrorMessage("Erreur lors de la création des jours.");
            }
        }
    }








    return (
        <Fragment>
            <Header />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" style={{maxWidth: "100%"}}>
                        <div className="row">


                            <div className="col-lg-12 position-relative">

                                <Row>

                                    <Col lg="12">
                                        <div>
                                            <Card>
                                                <CardBody>
                                                  <div>
                                                    <CardTitle tag="h5">Liste des emplois</CardTitle>
                                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                        Emplois
                                                    </CardSubtitle>
                                                  </div>
                                                    <h1>Jour actuel: {getNomJour()}</h1>


<div style={{marginTop:'auto'}}>
    {getNomJour()==="Dimanche" ?(<>
        <Button className="btn" color="danger" onClick={createMultipleJours}>Créer Multiple Jours</Button>
        <div className="col">
            <Button
                className="btn"
                color="primary"
                onClick={remplirEmploiSemaine}
                style={{margin: 'auto'}}
                disabled={remplirEmploi === 'false'}
            >Remplir l'emploi</Button>
        </div>
    </>):(
        <Col sm={10} style={{marginLeft:"auto"}}>


                    <div className="row align-items-center">
                        <div className="col">
                            <DatePicker
                                className="custom-date-picker"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Date de début"
                            />
                        </div>
                        <div className="col">
                            <DatePicker

                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="Date de fin"

                            />
                        </div>
                        <br/>
                        <div className="col">
                            <Button
                                style={{width:'auto'}}
                                className="btn"
                                color="danger"
                                onClick={createBetween2Dates}
                                disabled={isBefore === 'false' || !startDate || !endDate}
                            >
                                Créer jours entre les dates
                            </Button>


                        </div>
                        <div className="col">
                        <Button
                            className="btn"
                            color="primary"
                            onClick={remplirEmploiSemaine}
                            style={{margin: 'auto'}}
                            disabled={remplirEmploi === 'false'}
                        >Remplir l'emploi</Button>
                        </div>
                    </div>

            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            {successMessage && <Alert color="success">{successMessage}</Alert>}


        </Col>

    )}





                                                    </div>
                                                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                                                        <thead>
                                                        <tr>
                                                            <th>Date Debut/Fin</th>
                                                            <th>Annee</th>

                                                            <th>Statut</th>
                                                            <th>Enseignant</th>
                                                            <th>Etudiant</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {emplois.map((tdata, index) => (
                                                            <tr key={index} className="border-top"  >
                                                                <td onClick={() => navigateToEmploiDetails(tdata._id)} >
                                                                    <div className="d-flex align-items-center p-2">

                                                                        <div className="ms-3">
                                                                            <h6 className="mb-0">
                                                                                {new Date(tdata.dateDebut).toLocaleDateString('fr-FR')}</h6>
                                                                            <span className="text-muted">{new Date(tdata.dateFin).toLocaleDateString('fr-FR')}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>{tdata.annee}</td>
                                                                <td>
                                                                    {tdata.statut === "Suspendu" ? (
                                                                        <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                                                                    ) : tdata.statut === "En Cours" ? (
                                                                        <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                                                                    ) : (
                                                                        <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <button onClick={() => handleAfficherPDF(tdata._id)} className="btn btn-primary">
                                                                        PDF
                                                                    </button>
                                                                </td>
                                                                <td>{tdata.budget}</td>

                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                </CardBody>
                                            </Card>
                                        </div>
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

export default Jours;
