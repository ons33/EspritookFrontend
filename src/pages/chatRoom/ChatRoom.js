import React, { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import "./ChatRoom.css";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [chatRoomId, setChatRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const { selectedUser, currentUser, selectedUserName } = location.state || {};

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
        throw new Error("Invalid JWT token");
      }
    };

    const fetchData = async () => {
      try {
        const token = await getTokenFromCookies();
        const userId = await getUserIdFromToken(token);
        setUser(userId);
        console.log("User ID set as:", userId);

        // Fetch user sessions to check connection status
        const sessions = await fetchUserSessions(selectedUser.id, token);
        setIsConnected(sessions.length > 0);
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    fetchData();
  }, [selectedUser]);

  const fetchUserSessions = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  };

  useEffect(() => {
    if (selectedUser && currentUser) {
      const getChatRoomId = async () => {
        const chatRoomsRef = collection(firestore, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('participants', 'array-contains', currentUser)
        );

        const querySnapshot = await getDocs(q);
        let roomFound = false;
        querySnapshot.forEach((doc) => {
          if (doc.data().participants.includes(selectedUser.id)) {
            setChatRoomId(doc.id);
            roomFound = true;
          }
        });

        if (!roomFound) {
          const newChatRoom = await addDoc(chatRoomsRef, {
            participants: [currentUser, selectedUser.id],
            createdAt: serverTimestamp(),
          });
          setChatRoomId(newChatRoom.id);
        }
      };

      getChatRoomId();
    }
  }, [selectedUser, currentUser]);
  useEffect(() => {
    if (chatRoomId) {
      const messagesRef = collection(firestore, 'chatRooms', chatRoomId, 'messages');
      const q = query(messagesRef, orderBy('timestamp'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timestamp) {
            messagesData.push({ ...data, id: doc.id });
          }
        });
        setMessages(messagesData);
      });
  
      return unsubscribe;
    }
  }, [chatRoomId]);
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && chatRoomId) {
      await addDoc(collection(firestore, 'chatRooms', chatRoomId, 'messages'), {
        senderId: currentUser,
        message: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    }
  };
  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return 'Invalid timestamp';
    }
  
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);
  
    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  };

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0" style={{ maxWidth: "100%" }}>
            <div className="row">
              <div className="col-lg-12 position-relative">
                <div className="chat-wrapper pt-0 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                  <div className="chat-body p-3">
                    <h5 className="selected-user-name" style={{marginBottom: "4%"}}>
                      {selectedUserName}
                      {isConnected && <span className="bg-success ms-auto btn-round-xss"></span>}
                    </h5>
*                      <div className="messages-content pb-5">
                        {messages.map((msg) => (
                          <div key={msg.id} className={`message-item ${msg.senderId === currentUser ? 'outgoing-message' : ''}`}>
                            <div className="message-user">
                              <figure className="avatar">
                                <img src="assets/images/user.png" alt="avatar" />
                              </figure>
                              <div>
                                <h5>{msg.senderId === currentUser ? 'You' : selectedUser.username}</h5>
                                <div className="time">{formatTimestamp(msg.timestamp)}</div>
                              </div>
                            </div>
                            <div className="message-wrap">{msg.message}</div>
                          </div>
                        ))}
                      </div>
                   
                  </div>
                </div>
                <div className="chat-bottom dark-bg p-3 shadow-none theme-dark-bg" style={{ width: "98%" }}>
                  <form className="chat-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <button type="button" className="bg-grey float-left"><i className="ti-microphone text-grey-600"></i></button>
                    <div className="form-group">
                      <input type="text" onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message" />
                    </div>
                    <button type="submit" className="bg-current"><i className="ti-arrow-right text-white"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default ChatRoom;
