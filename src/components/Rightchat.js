import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Rightchat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 182 });
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  const updateDimensions = () => {
    if (window.innerWidth < 500) {
      setDimensions({ width: 450, height: 102 });
    } else {
      const update_width = window.innerWidth - 100;
      const update_height = Math.round(update_width / 4.4);
      setDimensions({ width: update_width, height: update_height });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    fetchData();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const getTokenFromCookies = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    console.log("tokentoken", token);
    return token ? token : Promise.reject('Token not found in cookies');
  };

  const getUserIdFromToken = async (token) => {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      return decodedToken.sub;
    } else {
      throw new Error('Invalid JWT token');
    }
  };

  const fetchData = async () => {
    try {
      const token = await getTokenFromCookies();
      const userId = await getUserIdFromToken(token);
      console.log("userIdddddddddddddd", token);
      setUser(userId);

      // Fetch users from Keycloak
      const response = await fetch('http://localhost:8080/auth/admin/realms/espritookKeycloak/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const selectUser = (selectedUser) => {
    history.push({
      pathname: '/chatroom',
      state: { selectedUser, currentUser: user, selectedUserName: selectedUser.username },
    });
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const menuClass = `${isOpen ? ' d-block' : ''}`;

  return (
    <div id="main-content-wrap" className={`right-chat nav-wrap mt-2 right-scroll-bar ${dimensions.width > 1500 ? 'active-sidebar' : ' '}`}>
      <div className="middle-sidebar-right-content bg-white shadow-xss rounded-xxl">
        <div className="section full pe-3 ps-4 pt-4 position-relative feed-body">
          <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">CONTACTS</h4>
          <input
            type="text"
            placeholder="Recherche..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control mb-3"
          />
          <ul className="list-group list-group-flush">
            {filteredUsers.map((user, index) => (
              <li key={index} className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
                <figure className="avatar float-left mb-0 me-2">
            

                  <img  src={user.attributes.image} alt="avatar" className="w35" />
                </figure>
                <h3 className="fw-700 mb-0 mt-0">
                  <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={() => selectUser(user)}>
                    {user.username || user.email}
                  </span>
                </h3>
              </li>
            ))}
          </ul>
        </div>
        <div className="section full pe-3 ps-4 pt-4 pb-4 position-relative feed-body">
          <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">GROUPS</h4>
          <ul className="list-group list-group-flush">
            <li className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
              <span className="btn-round-sm bg-primary-gradiant me-3 ls-3 text-white font-xssss fw-700">UD</span>
              <h3 className="fw-700 mb-0 mt-0">
                <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={toggleOpen}>
                  Studio Express
                </span>
              </h3>
              <span className="badge mt-0 text-grey-500 badge-pill pe-0 font-xsssss">2 min</span>
            </li>
            <li className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
              <span className="btn-round-sm bg-gold-gradiant me-3 ls-3 text-white font-xssss fw-700">AR</span>
              <h3 className="fw-700 mb-0 mt-0">
                <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={toggleOpen}>
                  Armany Design
                </span>
              </h3>
              <span className="bg-warning ms-auto btn-round-xss"></span>
            </li>
            <li className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
              <span className="btn-round-sm bg-mini-gradiant me-3 ls-3 text-white font-xssss fw-700">UD</span>
              <h3 className="fw-700 mb-0 mt-0">
                <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={toggleOpen}>
                  De fabous
                </span>
              </h3>
              <span className="bg-success ms-auto btn-round-xss"></span>
            </li>
          </ul>
        </div>
        <div className="section full pe-3 ps-4 pt-0 pb-4 position-relative feed-body">
          <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">Pages</h4>
          <ul className="list-group list-group-flush">
            <li className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
              <span className="btn-round-sm bg-primary-gradiant me-3 ls-3 text-white font-xssss fw-700">AB</span>
              <h3 className="fw-700 mb-0 mt-0">
                <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={toggleOpen}>
                  Armany Seary
                </span>
              </h3>
              <span className="bg-success ms-auto btn-round-xss"></span>
            </li>
            <li className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">
              <span className="btn-round-sm bg-gold-gradiant me-3 ls-3 text-white font-xssss fw-700">SD</span>
              <h3 className="fw-700 mb-0 mt-0">
                <span className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer" onClick={toggleOpen}>
                  Entropio Inc
                </span>
              </h3>
              <span className="bg-success ms-auto btn-round-xss"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rightchat;
