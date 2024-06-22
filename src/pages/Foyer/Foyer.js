import React, { useState, useEffect, Fragment } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import axios from 'axios'; // Utilisé pour faire des requêtes HTTP
import PreinscriptionRenouvellementModal from './PreinscriptionRenouvellementModal';
import DemandesParType from './MyDocument'; // Importer le composant
import PreinscriptionModal from './PreinscriptionModal'; // Import the separate modal
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Popupchat from '../../components/Popupchat';
const jwt = require('jsonwebtoken');

const FoyerHomePage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [foyers, setFoyers] = useState([]);
  const [typeDemande, setTypeDemande] = useState('');
  const [isDemandExist, setIsDemandExist] = useState(false);
  const [user, setUser] = useState(null);  
  const [email, setEmail] = useState(null);

  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  // Combine token fetching, user setting, and demand checking
  useEffect(() => {
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
        setUser(userId);
        setEmail(emailUser);
        console.log("User ID set as:", userId); // Debugging
        checkExistingDemand(userId);
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };
 
    const checkExistingDemand = (userId) => {
      axios
        .get(`http://localhost:8081/api/demandes/exist/${userId}`)
        .then((response) => {
          setIsDemandExist(response.data.exist);
          console.log('Demand check:', response.data.exist); // Debugging
        })
        .catch((error) =>
          console.error('Error checking existing demands:', error)
        );
    };

    fetchData(); // Trigger fetching and checking when component mounts
  }, []);

  // Load foyers data
  useEffect(() => {
    axios
      .get('http://localhost:8081/api/foyers/')
      .then((response) => setFoyers(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des foyers :", error)
      );
  }, []);

  const handlePreinscriptionClick = () => {
    setTypeDemande('Hebergement');
    setModalShow(true);
  };
  const handleRenouvellementClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/demandes/get-demand-by-user/${user}`
      );
      const demandeId = response.data.demandId;

      if (demandeId) {
       console.log("  email:email,", email, );
        // Crée une nouvelle demande de renouvellement
        await axios.post('http://localhost:8081/api/demandes', {
          utilisateur: user,
          foyer: foyers[0]._id, // Assurez-vous de remplacer par la logique correcte pour sélectionner un foyer
          typeDemande: 'Renouvellement',
          demandeOriginale: demandeId,
        });
        setSuccessModalShow(true);
      } else {
        setErrorModalMessage(
          "Vous n'avez pas de demande précédente pour le renouvellement."
        );
        setErrorModalShow(true);
      }
    } catch (error) {
      console.error('Error fetching or creating demand:', error);
      setErrorModalMessage(   "Vous n'avez pas de demande précédente pour le renouvellement.");
      setErrorModalShow(true);
    }
  };

  const handleSelectFoyer = (foyer) => {
    console.log("Foyer sélectionné :", foyer);
  };

  // Conditional button rendering logic
  const isButtonDisabled = !user || isDemandExist;
  const handleMouseOver = () => {
    if (isDemandExist) {
      alert("Vous avez déjà envoyé une demande.");
    }
  };
  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      {/* Stylish title section */}
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div
            className="my-5"
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '15px',
            }}
          >
            <div
              style={{
                width: '0',
                height: '0',
                borderTop: '25px solid transparent', // Top triangle side
                borderBottom: '25px solid transparent', // Bottom triangle side
                borderLeft: '60px solid #cd2122', // Left triangle side with specified color
                marginRight: '10px', // Space between triangle and text
                backgroundColor: '#fffffff',
              }}
            ></div>

            <h1
              style={{
                fontSize: '3rem', // Large font size for the heading
                fontWeight: 'bold',
                color: '#000', // Title color
                display: 'inline-block', // Allows the underline to fit the text width
                position: 'relative', // Allows for absolute positioning of underline
              }}
            >
              Foyer
              <span
                style={{
                  content: '""',
                  display: 'block',
                  width: '50%', // Half-line under the title
                  height: '4px', // Thickness of the line
                  backgroundColor: '#cd2122', // Match underline color to triangle
                  position: 'absolute',
                  bottom: '-10px', // Position under the title
                  left: '0', // Aligns the line to the left
                }}
              ></span>
            </h1>
          </div>
        </div>

        <Container className="my-5">
          <Row className="mb-4 ">
            <Col>
              <Card style={{ marginTop: "-2rem", marginBottom: "4rem" }}>
                <Card.Body>
                  <Card.Title>
                    <strong>Ouverture des pré-inscriptions en ligne</strong>{" "}
                    {/* Utilisation de strong pour le texte en gras */}
                  </Card.Title>
                  <Card.Text style={{ color: "#bb3838" }}>
                    <strong>
                      Les pré-inscriptions au foyer débutent le 1er juillet 2024
                      et se poursuivent jusqu'à épuisement des places
                      disponibles.
                    </strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header
                  style={{
                    backgroundColor: '#fff', // Background color for the header
                    fontSize: '1.5rem', // Font size for the header
                    fontWeight: 'bold', // Bold font for emphasis
                    // Red color for the text
                    padding: '10px', // Padding inside the header
                  }}
                >
                  Étudiants déjà inscrits
                </Card.Header>
                <Card.Body style={{ paddingLeft: '20px' }}>
                  {" "}
                  {/* Adjust this padding to your sidebar width */}
                  <h5 style={{ color: '#cd2122', marginBottom: '1rem' }}>
                    Demande de renouvellement
                  </h5>
                  <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      Remplir la demande en ligne.
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      Validation par l'administration suivie d'une notification.
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      Suivre la procédure.
                    </li>
                  </ul>
                  <Col>
                  <Button
                    style={{ backgroundColor: '#cd2122', border: 'none' }}
                    onClick={handleRenouvellementClick}
                    // disabled={isDemandExist}
                    title={
                      isDemandExist ? "Vous avez déjà envoyé une demande." : ""
                    }
                  >
                    Renouvellement
                  </Button>
                  <Modal
                    show={successModalShow}
                    onHide={() => setSuccessModalShow(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Succès</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        Votre demande de renouvellement a été créée avec succès.
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setSuccessModalShow(false)}
                      >
                        Fermer
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  </Col>
                
                  {/* Bouton pour ouvrir le modal de renouvellement */}
                  {/* <Button
                onClick={handleRenouvellementClick}
                style={{ backgroundColor: '#cd2122', border: 'none' }}
            >
                Renouvellement
            </Button> */}
                  <div
                    style={{
                      borderTop: '1px solid #ccc',
                      marginTop: '2rem',
                      paddingTop: '1rem',
                    }}
                  >
                    <p>
                      Le renouvellement des inscriptions au foyer pour filles et
                      étudiants prépa est à partir du{" "}
                      <strong>01 Juin 2023</strong> au{" "}
                      <strong>15 Juin 2023</strong>.
                    </p>
                    <h6 style={{ color: '#cd2122', marginTop: '1rem' }}>
                      Mode de paiement:
                    </h6>
                    <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        Carte bancaire.
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        Virement bancaire (Scanner le reçu et l'envoyer via le
                        lien).
                      </li>
                      <li>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        Paiement à la caisse (Premier étage bloc A).
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header
                  style={{
                    backgroundColor: '#fff', // Background color for the header
                    fontSize: '1.5rem', // Font size for the header
                    fontWeight: 'bold', // Bold font for emphasis
                    // Red color for the text
                    padding: '10px', // Padding inside the header
                  }}
                >
                  {" "}
                  Nouveaux inscrits - Demande d'hébergement
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      position: 'relative',
                      paddingLeft: '60px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#cd2122',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: '15px', // Position according to your layout
                        top: '5px', // Adjust as needed
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '24px' }}>
                        e
                      </span>
                    </div>
                    <h5 style={{ color: '#cd2122', marginBottom: '1rem' }}>
                      Demande d'hébergement
                    </h5>
                    <p>
                      Le dossier ne sera traité qu'à partir de la date
                      d'inscription à Esprit Ingénieur, Esprit Prépa ou ESB.
                      Pièces à fournir si la demande est validée par
                      notification :
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        paddingLeft: '10px',
                        marginLeft: '40px',
                      }}
                    >
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        1 Photo d'identité,
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        1 Copie CIN ou passeport,
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        Attestation d'inscription,
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cd2122', marginRight: '10px' }}>
                          •
                        </span>
                        Certificat médical attestant de la capacité à vivre au
                        foyer.
                      </li>
                    </ul>
                  </div>

                  <ul
                    style={{
                      listStyle: 'none',
                      paddingLeft: '10px',
                      marginLeft: '40px',
                    }}
                  >
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      <a href="#link1">
                        Contrat à usage d'habitation (Bloc 2 pour garçons -
                        Résidence El Amen) (Signé)
                      </a>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      <a href="#link2">
                        Contrat de location meublée (Bloc 1 foyer Esprit)
                        (Signé)
                      </a>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#cd2122', marginRight: '10px' }}>
                        •
                      </span>
                      <a href="#link3">
                        Coupon à détacher à la fin du règlement intérieur après
                        l’avoir soigneusement lu, le signer
                      </a>
                    </li>
                  </ul>
                  <Button
                      disabled={isDemandExist}
                      title={
                        isDemandExist
                          ? "Vous avez déjà envoyé une demande."
                          : ""
                      }
                      style={{
                        backgroundColor: isDemandExist ? '#ccc' : '#cd2122',
                        border: 'none',
                      }}
                      onClick={handlePreinscriptionClick}
                      onMouseOver={handleMouseOver}
                    >
                      Pré-inscription
                    </Button>{" "}
                    <PreinscriptionModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    foyers={foyers}
                    onSelect={handleSelectFoyer}
                    typeDemande={typeDemande}
                  />
                 

                  <Modal
                    show={errorModalShow}
                    onHide={() => setErrorModalShow(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Erreur</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>{errorModalMessage}</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setErrorModalShow(false)}
                      >
                        Fermer
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <div
                    style={{
                      borderTop: '1px solid #ccc',
                      paddingTop: '1rem',
                      marginLeft: '40px',
                    }}
                  >
                    <strong>NB:</strong> Le règlement du loyer n'est pris en
                    considération que si le reçu est adressé via le lien
                    ci-dessus, il ne donne aucun droit de réservation de place
                    au foyer si la consigne n'est pas suivie.
                  </div>

                  <div style={{ marginTop: '1rem', marginLeft: '40px' }}>
                    Attention: bien prendre connaissance des clauses du contrat,
                    du règlement intérieur, notamment l’engagement pour l’année
                    universitaire sans possibilité de résolution ou de retrait
                    d'inscription en matière de respect des règles de conduite
                    et d'hygiène.
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default FoyerHomePage;
