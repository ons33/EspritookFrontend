import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const ManageInvitations = () => {
    const query = useQuery();
    const eventId = query.get("eventId");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (eventId) {
            fetchRequests();
        }
    }, [eventId]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/participations/invitations?eventId=${eventId}`);
            setRequests(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes d\'invitation:', error);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await axios.post('http://localhost:8081/api/participations/invitations/approve', { requestId });
            alert('Invitation approuvée et email envoyé');
            fetchRequests();
        } catch (error) {
            console.error('Erreur lors de l\'approbation de l\'invitation:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post('http://localhost:8081/api/participations/invitations/reject', { requestId });
            alert('Invitation rejetée');
            fetchRequests();
        } catch (error) {
            console.error('Erreur lors du rejet de l\'invitation:', error);
        }
    };

    return (
        <div className="main-wrapper">
            <Header />
            <Leftnav />
            <Rightchat />
            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="middle-wrap">
                            <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                    <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Gérer les Demandes d'Invitation</h4>
                                </div>
                                <div className="card-body p-lg-5 p-4 w-100 border-0 mb-0">
                                    <h4 className="fw-700 mb-3">Demandes d'Invitation</h4>
                                    <ul className="list-group">
                                        {requests.map(request => (
                                            <li key={request._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{request.userId}</span>
                                                <span>{request.status}</span>
                                                <div>
                                                    <button className="btn btn-success me-2" onClick={() => handleApprove(request._id)}>Approuver</button>
                                                    <button className="btn btn-danger" onClick={() => handleReject(request._id)}>Rejeter</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popupchat />
            <Appfooter />
        </div>
    );
};

export default ManageInvitations;
