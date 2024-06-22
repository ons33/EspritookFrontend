// src/pages/chatRoom/UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ accessToken, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchKeycloakUsers = async (accessToken) => {
      try {
        const response = await axios.get('http://localhost:8080/auth/admin/realms/espritookKeycloak/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users from Keycloak:', error);
      }
    };

    fetchKeycloakUsers(accessToken);
  }, [accessToken]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onSelectUser(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
