import axios from 'axios';

const fetchKeycloakUsers = async (accessToken) => {
  try {
    const response = await axios.get('http://localhost:8080/auth/admin/realms/espritookKeycloak/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users from Keycloak:', error);
    return [];
  }
};
