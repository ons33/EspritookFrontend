import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
const AddChambreForm = () => {
  const [foyers, setFoyers] = useState([]);
  const [formData, setFormData] = useState({
    typeChambre: '',
    num: '',
    description: '',
    foyer: '',
    etage: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFoyers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/foyers');
        setFoyers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des foyers :", error);
      }
    };

    fetchFoyers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Vérifier si le foyer a assez de place
      const selectedFoyer = foyers.find(foyer => foyer._id === formData.foyer);
      if (!selectedFoyer) {
        setError("Sélectionnez un foyer valide.");
        return;
      }
      const chambresDansFoyer = await axios.get(`http://localhost:8081/api/foyers/foyer/${selectedFoyer._id}`);
      if (chambresDansFoyer.length >= selectedFoyer.capacite) {
        setError("Pas de place dans le foyer pour ajouter une chambre.");
        return;
      }

      // Enregistrer la chambre
      await axios.post('http://localhost:8081/api/chambres', {
        ...formData,
      });
      setSuccessMessage("Chambre ajoutée avec succès !");
      setFormData({
        typeChambre: '',
        num: '',
        description: '',
        foyer: '',
        etage: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de l'ajout de la chambre.");
      }
    }
  };

  return (
    <div   className="main-content bg-lightgrey theme-dark-bg right-chat-active">
        <Header />
   
    <Container      >

       
      <Row>
        <Col>
        <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4 mt-4 ml-4">
              <div className="card-body p-4 w-100 bg-pinterest border-0 d-flex rounded-3">
                <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Ajouter une chambre</h4>
              </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <div className="card-body p-lg-5 p-4 w-100 border-0">

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="typeChambre">
              <Form.Label>Type de chambre</Form.Label>
              <Form.Control as="select" name="typeChambre" value={formData.typeChambre} onChange={handleChange}>
                <option value="">Sélectionnez le type de chambre</option>
                <option value="Chambre double">Chambre double</option>
                <option value="Appartement pour 4 personnes S+1">Appartement pour 4 personnes S+1</option>
                <option value="Appartement pour 6 personnes S+2">Appartement pour 6 personnes S+2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="num">
              <Form.Label>Numéro de chambre</Form.Label>
              <Form.Control type="number" name="num" value={formData.num} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="foyer">
              <Form.Label>Foyer</Form.Label>
              <Form.Control as="select" name="foyer" value={formData.foyer} onChange={handleChange}>
                <option value="">Sélectionnez le foyer</option>
                {foyers.map((foyer) => (
                  <option key={foyer._id} value={foyer._id}>{foyer.typeFoyer}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="etage">
              <Form.Label>Étage</Form.Label>
              <Form.Control type="number" name="etage" value={formData.etage} onChange={handleChange} />
            </Form.Group>
            <Button style={{backgroundColor:"#405f6b", border:"#405f6b"}} className='btn button' type="submit">Ajouter la chambre</Button>
          </Form>
          </div>
          </div>

        </Col>
     
      </Row>
    </Container>
    </div>
  );
};

export default AddChambreForm;
