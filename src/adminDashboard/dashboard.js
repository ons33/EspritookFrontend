import React, { useState, useEffect } from "react";
import ProjectTables from "./components/dashboard/ProjectTable";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
const DashboardA = () => {
    const [users, setUsers] = useState([]);

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
    console.log("existingRoleMappings",existingRoleMappings);
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
            } else {
                throw new Error(`Failed to update role for user ${userId}: ${updateResponse.statusText}`);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
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
                console.log("userdata",usersData);
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
                        console.log('role',roles);
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

    useEffect(() => {
       
    
        fetchUsers();
      }, []);

    return (
        <div>
            <Header />
            <Leftnav />
            <div className=" col-md-12 px-5 pt-2 ">
                
                <div className="main-content right-chat-active" >
                    <div className="col-md-12 ">
                    <ProjectTables users={users} updateUserRole={updateUserRole} />
                </div>
                </div>





       


                

            </div>
   
        </div>
    );
};

export default DashboardA;
