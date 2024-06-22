import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle, CardText, CardSubtitle, Spinner } from 'reactstrap';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
const MesDocuments = () => {
  const [files, setFiles] = useState({});
  const [user, setUser] = useState(null);
  const [demandId, setDemandId] = useState(null);
  const [demandDetails, setDemandDetails] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTokenFromCookies = async () => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
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
        setUser(userId);
        console.log("User ID set as:", userId);
        checkExistingDemand(userId);
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    const checkExistingDemand = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8081/api/demandes/get-demand-by-user/${userId}`);
        if (response.data.demandId) {
          setDemandId(response.data.demandId);
          setDemandDetails({
            cin: response.data.cin,
            photo: response.data.photo,
            attestationInscription: response.data.attestationInscription,
            certificatMedical: response.data.certificatMedical
          });
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error('Error checking existing demands:', error);
        setMessage('Erreur lors de la vérification des demandes existantes.');
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setFiles(prev => ({ ...prev, [event.target.name]: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!demandId) {
      setMessage('Aucune demande active trouvée pour envoyer les documents.');
      return;
    }
    const formData = new FormData();
    for (const key in files) {
      formData.append(key, files[key]);
      console.log(`Appending file: ${key}`, files[key]);
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:8081/api/demandes/upload/${demandId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload success:', response.data);
      setMessage('Documents envoyés avec succès.');
      const updatedResponse = await axios.get(`http://localhost:8081/api/demandes/${demandId}`);
      setDemandDetails(updatedResponse.data);
    } catch (error) {
      console.error('Upload error:', error.response ? error.response.data : error);
      setMessage('Erreur lors de l\'envoi des documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content right-chat-active">

      <div className="middle-sidebar-bottom">

      <Container style={{ paddingTop: '70px', marginTop: '20px' }} className="mt-5">
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <h4 className="mb-3" style={{ color: '#191c48' }}>Mes Documents</h4>
            {message && <div className="alert alert-info" style={{ backgroundColor: '#e7f3fe', borderColor: '#d6e9c6', color: '#3a87ad' }}>{message}</div>}
            {demandDetails && (
              <Card className="mb-4 shadow-sm">
                <CardBody style={{ backgroundColor: '#f9f9f9' }}>
                  <CardTitle tag="h5" style={{ color: '#bd081c', fontWeight: 'bold' }}>Documents Actuels</CardTitle>
                  <Row>
                    {demandDetails.cin && (
                      <Col md="6" className="mb-3">
                        <CardSubtitle tag="h6" className="mb-2 text-muted">CIN:</CardSubtitle>
                        <CardText>
                          <a href={demandDetails.cin} target="_blank" rel="noopener noreferrer">Voir le document</a>
                        </CardText>
                      </Col>
                    )}
                    {demandDetails.photo && (
                      <Col md="6" className="mb-3">
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Photo:</CardSubtitle>
                        <CardText>
                          <a href={demandDetails.photo} target="_blank" rel="noopener noreferrer">Voir le document</a>
                        </CardText>
                      </Col>
                    )}
                    {demandDetails.attestationInscription && (
                      <Col md="6" className="mb-3">
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Attestation d'Inscription:</CardSubtitle>
                        <CardText>
                          <a href={demandDetails.attestationInscription} target="_blank" rel="noopener noreferrer">Voir le document</a>
                        </CardText>
                      </Col>
                    )}
                    {demandDetails.certificatMedical && (
                      <Col md="6" className="mb-3">
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Certificat Médical:</CardSubtitle>
                        <CardText>
                          <a href={demandDetails.certificatMedical} target="_blank" rel="noopener noreferrer">Voir le document</a>
                        </CardText>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            )}
            <h4 className="mb-3" style={{ color: '#191c48' }}>Envoyer Mes Documents</h4>
            <Card className="p-3 shadow-sm">
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="cin" style={{ fontWeight: 'bold' }}>CIN</Label>
                  <Input type="file" name="cin" id="cin" onChange={handleFileChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="photo" style={{ fontWeight: 'bold' }}>Photo</Label>
                  <Input type="file" name="photo" id="photo" onChange={handleFileChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="attestationInscription" style={{ fontWeight: 'bold' }}>Attestation d'Inscription</Label>
                  <Input type="file" name="attestationInscription" id="attestationInscription" onChange={handleFileChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="certificatMedical" style={{ fontWeight: 'bold' }}>Certificat Médical</Label>
                  <Input type="file" name="certificatMedical" id="certificatMedical" onChange={handleFileChange} />
                </FormGroup>
                <Button type="submit" color="danger" disabled={loading} style={{ backgroundColor: '#bd081c', border: 'none', fontWeight: 'bold', padding: '10px 20px', transition: 'background-color 0.3s ease' }}>
                  {loading ? <Spinner size="sm" /> : 'Envoyer les documents'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>    </div>  </div>

  );
};

export default MesDocuments;
