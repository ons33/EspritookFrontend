import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Table, Button, FormGroup, Input } from "reactstrap";
import Switch from "react-switch"; // Import the Switch component
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Import Font Awesome icons

const DashboardA = () => {
    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});

    const getTokenFromCookies = async () => {
        return new Promise((resolve, reject) => {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (token) {
                console.log("Token:", token);
                resolve(token);
            } else {
                reject("Token not found in cookies");
            }
        });
    };

    const fetchUsers = async () => {
        try {
            const accessToken = await getTokenFromCookies();
            const response = await fetch('http://localhost:8080/auth/admin/realms/espritookKeycloak/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const usersData = await response.json();
                console.log("userdata", usersData);
                const usersWithRoles = await Promise.all(usersData.map(async (user) => {
                    const rolesResponse = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${user.id}/role-mappings/realm`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (rolesResponse.ok) {
                        const rolesData = await rolesResponse.json();
                        const roles = rolesData.map(role => role.name);
                        console.log('role', roles);
                        return { ...user, roles };
                    }
                    return user;
                }));
                setUsers(usersWithRoles);
            } else {
                console.error('Failed to fetch users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            console.log("ff", userId);
            const accessToken = await getTokenFromCookies(); // Retrieve the access token from Keycloak
    
            // Fetch existing role mappings
            const response = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}/role-mappings/realm`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch existing role mappings for user ${userId}: ${response.statusText}`);
            }
    
            const existingRoleMappings = await response.json();
            console.log("existingRoleMappings", existingRoleMappings);
            // Check if the user already has the new role
            const hasNewRole = existingRoleMappings.some(roleMapping => roleMapping.name === newRole);
    
            // If the user already has the new role, no need to update
            if (hasNewRole) {
                console.log(`User ${userId} already has the role ${newRole}`);
                return;
            }
    
            // Add the new role to the existing roles
            existingRoleMappings.push({
                id: newRole,
                name: newRole,
            });
    
            // Update the role mappings
            const updateResponse = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}/role-mappings/realm`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(existingRoleMappings),
            });
    
            if (updateResponse.ok) {
                console.log(`Role updated successfully for user ${userId}`);
                fetchUsers(); // Fetch users immediately after updating the role
            } else {
                throw new Error(`Failed to update role for user ${userId}: ${updateResponse.statusText}`);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleToggleEnable = async (userId) => {
        try {
            const accessToken = await getTokenFromCookies();
            const userToUpdate = users.find(user => user.id === userId);
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return { ...user, enabled: !user.enabled };
                }
                return user;
            });

            const response = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled: !userToUpdate.enabled }),
            });

            if (response.ok) {
                console.log(`Blocked status updated successfully for user ${userId}`);
                fetchUsers(); // Fetch users immediately after updating the status
            } else {
                console.error(`Failed to update blocked status for user ${userId}:`, response.statusText);
            }
        } catch (error) {
            console.error('Error updating blocked status:', error);
        }
    };

    const fetchAvailableRoles = async () => {
        try {
            const accessToken = await getTokenFromCookies();
            const response = await fetch('http://localhost:8080/auth/admin/realms/espritookKeycloak/roles', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAvailableRoles(data);
            } else {
                console.error('Failed to fetch roles:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleSelectRole = (userId, selectedRole) => {
        setSelectedRoles({ ...selectedRoles, [userId]: selectedRole });
    };

    const handleRoleUpdate = async (userId) => {
        try {
            const accessToken = await getTokenFromCookies();
            const selectedRoleId = availableRoles.find(role => role.name === selectedRoles[userId])?.id;

            if (!selectedRoleId) {
                console.error(`Role not found for user ${userId}`);
                return;
            }

            const roleRepresentation = {
                id: selectedRoleId,
                name: selectedRoles[userId],
            };

            const response = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}/role-mappings/realm`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([roleRepresentation]),
            });

            if (response.ok) {
                console.log(`Role updated successfully for user ${userId}`);
                fetchUsers(); // Fetch users immediately after updating the role
            } else {
                console.error(`Failed to update role for user ${userId}:`, response.statusText);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleRemoveRole = async (userId) => {
        try {
            const accessToken = await getTokenFromCookies();
            const selectedRoleId = availableRoles.find(role => role.name === selectedRoles[userId])?.id;
            console.log("roleId", selectedRoleId);
            if (!selectedRoleId) {
                console.error(`Role not found for user ${userId}`);
                return;
            }

            const roleRepresentation = {
                id: selectedRoleId,
                name: selectedRoles[userId],
            };
            const response = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}/role-mappings/realm`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([roleRepresentation]), // Specify the role ID to be removed
            });

            if (response.ok) {
                console.log(`Role removed successfully for user ${userId}`);
                fetchUsers(); // Fetch users immediately after removing the role
            } else {
                console.error(`Failed to remove role for user ${userId}:`, response.statusText);
            }
        } catch (error) {
            console.error('Error removing user role:', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Initial fetch
        fetchAvailableRoles(); // Fetch roles initially
        const interval = setInterval(() => {
            fetchUsers(); // Fetch users every 10 seconds
        }, 10000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div>
            <Header />
            <Rightchat />
            <div className="col-md-12 px-5 pt-2">
                <div className="main-content right-chat-active">
                    <div className="col-md-12">
                        <Card className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                            <CardBody>
                                <CardTitle tag="h5">La liste des utilisateur </CardTitle>
                                <CardSubtitle className="mb-2 text-muted" tag="h6">
                                    Overview of the users
                                </CardSubtitle>
                                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Role</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Blocked</th>
                                            <th>Role Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index} className="border-top">
                                                <td>{user.username}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.roles.filter(role => role !== 'offline_access' && role !== 'uma_authorization').join(', ')}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>
                                                    <Switch
                                                        onChange={() => handleToggleEnable(user.id)}
                                                        checked={!user.enabled} // Reverse the logic: checked is true when enabled is false
                                                        onColor="#97ff86" // Green color for true (enabled)
                                                        offColor="#9d968a" // Red color for false (disabled)
                                                        onHandleColor="#28a745"
                                                        handleDiameter={24}
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        height={18}
                                                        width={48}
                                                    />
                                                </td>
                                                <td>
                                                    <FormGroup>
                                                        <Input type="select" value={selectedRoles[user.id]} onChange={(e) => handleSelectRole(user.id, e.target.value)}>
                                                            <option value="">Select Role</option>
                                                            {availableRoles.map(role => (
                                                                <option key={role.id} value={role.name}>{role.name}</option>
                                                            ))}
                                                        </Input>
                                                    </FormGroup>
                                                </td>
                                                <td>
                                                    <Button
                                                        className="btn"
                                                        style={{
                                                            backgroundColor: '#28a745', // Custom success color
                                                            color: '#fff', // White text color
                                                            border: 'none', // Remove border
                                                        }}
                                                        onClick={() => handleRoleUpdate(user.id)}
                                                    >
                                                        <FaPlus />
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        className="btn"
                                                        style={{
                                                            backgroundColor: '#dc3545', // Custom danger color
                                                            color: '#fff', // White text color
                                                            border: 'none', // Remove border
                                                        }}
                                                        onClick={() => handleRemoveRole(user.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardA;
