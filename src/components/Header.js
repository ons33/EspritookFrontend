import React, { Fragment, useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom';
import Darkbutton from '../components/Darkbutton';
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import jwt from 'jsonwebtoken';
import { Dropdown } from 'react-bootstrap';

const locales = {
    en: { title: 'English' },
    ar: { title: 'Arabic' },
    fr: { title: "Français" }
};

const Header = () => {
    const [isOpenFoyer, setIsOpenFoyer] = useState(false);
    const [isOpenEvenements, setIsOpenEvenements] = useState(false);
    const [isOpenCours, setIsOpenCours] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isNoti, setIsNoti] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const GlobeIcon = ({ width = 24, height = 24 }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="currentColor"
            className="bi bi-globe"
            viewBox="0 0 16 16"
        >
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
        </svg>
    );

    const toggleOpenFoyer = () => setIsOpenFoyer(!isOpenFoyer);
    const toggleOpenEvenements = () => setIsOpenEvenements(!isOpenEvenements);
    const toggleOpenCours = () => setIsOpenCours(!isOpenCours);
    const toggleActive = () => setIsActive(!isActive);
    const toggleisNoti = () => setIsNoti(!isNoti);

    const getTokenFromCookies = async () => {
        return new Promise((resolve, reject) => {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (token) {
                resolve(token);
            } else {
                reject("Token not found in cookies");
            }
        });
    };

    const getUserFromToken = (token) => {
        try {
            const decodedToken = jwt.decode(token);
            return decodedToken ? decodedToken : null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    const user = getUserFromToken(token);
                    if (user && user.realm_access && user.realm_access.roles) {
                        setUserRoles(user.realm_access.roles);
                    }
                }
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };
        fetchUserRoles();
        
    }, []);

    const checkRole = (role) => {
        return userRoles.includes(role);
    };

    const navClass = (isOpenFoyer || isOpenEvenements || isOpenCours) ? " nav-active" : "";
    const buttonClass = (isOpenFoyer || isOpenEvenements || isOpenCours) ? " active" : "";
    const searchClass = isActive ? " show" : "";
    const notiClass = isNoti ? " show" : "";
    const { t, i18n } = useTranslation();

    return (
        <Suspense fallback="---Loading">
            <div className="nav-header bg-white shadow-xs border-0">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

                <div className="nav-top">
                    <Link to="/">
                        <img src={require("../assets/favicon.png").default} alt="Logo" style={{ width: "250px", height: "auto" }} />
                    </Link>
                    <Link to="/defaultmessage" className="mob-menu ms-auto me-2 chat-active-btn"><i className="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
                    <Link to="/defaultvideo" className="mob-menu me-2"><i className="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></Link>
                    <span onClick={toggleActive} className="me-2 menu-search-icon mob-menu"><i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></span>
                    <button onClick={() => { setIsOpenFoyer(false); setIsOpenEvenements(false); setIsOpenCours(false); }} className={`nav-menu me-0 ms-2 ${buttonClass}`}></button>
                </div>

                <form action="#" className="float-left header-search ms-3">
                    <div className="form-group mb-0 icon-input">
                        <i className="feather-search font-sm text-grey-400"></i>
                        <input type="text" placeholder="Start typing to search.." className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg" />
                    </div>
                </form>

                <NavLink activeClassName="active" to="/home" className="p-2 text-center ms-3 menu-icon center-menu-icon"><i className="feather-home font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
                <NavLink activeClassName="active" to="/defaultstorie" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-zap font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
                <NavLink activeClassName="active" to="/defaultvideo" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-video font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
                <NavLink activeClassName="active" to="/defaultgroup" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>
                <NavLink activeClassName="active" to="/shop2" className="p-2 text-center ms-0 menu-icon center-menu-icon"><i className="feather-shopping-bag font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 "></i></NavLink>

                <div className="dropdown mt-6" style={{ display: 'block' }}>
                    <button
                        style={{ display: 'block !important' }}
                        className="btn btn-link dropdown-toggle ml-6"
                        data-bs-toggle="dropdown"
                    >
                        <GlobeIcon />
                    </button>
                    <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                        style={{ display: 'block !important' }}
                    >
                        <li>
                            <span className="dropdown-item-text">{t('language')}</span>
                        </li>
                        {Object.keys(locales).map((locale) => (
                            <li key={locale}><button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>
                                {locales[locale].title}
                            </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <span className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`} id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false" onClick={toggleisNoti}><span className="dot-count bg-warning"></span><i className="feather-bell font-xl text-current"></i></span>
                <div className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${notiClass}`} aria-labelledby="dropdownMenu3">
                    <h4 className="fw-700 font-xss mb-4">Notification</h4>
                    <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
                        <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                        <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Hendrix Stamp <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 3 min</span></h5>
                        <h6 className="text-grey-500 fw-500 font-xssss lh-4">There are many variations of pass..</h6>
                    </div>
                    <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
                        <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                        <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Goria Coast <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 2 min</span></h5>
                        <h6 className="text-grey-500 fw-500 font-xssss lh-4">Mobile Apps UI Designer is require..</h6>
                    </div>

                    <div className="card bg-transparent-card w-100 border-0 ps-5">
                        <img src="assets/images/user.png" alt="user" className="w40 position-absolute left-0" />
                        <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">Victor Exrixon <span className="text-grey-400 font-xsssss fw-600 float-right mt-1"> 30 sec</span></h5>
                        <h6 className="text-grey-500 fw-500 font-xssss lh-4">Mobile Apps UI Designer is require..</h6>
                    </div>
                </div>
                <Link to="/defaultmessage" className="p-2 text-center ms-3 menu-icon chat-active-btn"><i className="feather-message-square font-xl text-current"></i></Link>
                <Darkbutton />
                <Link to="/defaultsettings" className="p-0 ms-3 menu-icon"><img src="assets/images/user.png" alt="user" className="w40 mt--1" /></Link>

                <nav className={`navigation scroll-bar ${navClass}`}>
                    <div className="container ps-0 pe-0">
                        <div className="nav-content">
                            <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                                <div className="nav-caption fw-600 font-xssss text-grey-500"><span>New </span>Feeds</div>
                                <ul className="mb-1 top-content">
                                    <li className="logo d-none d-xl-block d-lg-block"></li>
                                    <li><Link to="/home" className="nav-content-bttn open-font"><i className="feather-home btn-round-md bg-blue me-3" style={{background:"#d52f49"}}></i><span>{t('Accueil')}</span></Link></li>
                                    <li><Link to="/authorpage" className="nav-content-bttn open-font"><i className="feather-user btn-round-md bg-blue me-3 text-white" style={{background:"#e76463"}}></i><span>{t('Profile')}</span></Link></li>
                                    
                                    <li><Link to="/defaultgroup" className="nav-content-bttn open-font"><i className="feather-zap btn-round-md  me-3 text-white" style={{background:"#ff9181"}}></i><span>{t('Afficher plus')}</span></Link></li>
                                 
                                    {checkRole('Admin') && (
                                        <Fragment>
                                            <li><Link to="/defaultjob" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#90b0b3"}}></i><span>{t('Jobs')}</span></Link></li>
                                            <li><Link to="/myjobs" className="nav-content-bttn open-font"><i className="feather-user btn-round-md bg-primary-gradiant me-3"></i><span>{t('My jobs')}</span></Link></li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenFoyer}>
                                                        <i className="feather-user btn-round-md bg-red me-3"></i>
                                                        Foyer
                                                    </button>
                                                    {isOpenFoyer && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/chambreDispo" className="dropdown-item">{t('Demandes')}</NavLink></li>
                                                            <li><NavLink to="/mesdocuments" className="dropdown-item">{t('Mes Documents')}</NavLink></li>
                                                            <li><NavLink to="/foyer" className="dropdown-item">{t('Foyer')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenEvenements}>
                                                        <i className="feather-user btn-round-md bg-red me-3"></i>
                                                        Evenements
                                                    </button>
                                                    {isOpenEvenements && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/defaultevent" className="dropdown-item">{t('evenements')}</NavLink></li>
                                                            <li><NavLink to="/mesEvenement" className="dropdown-item">{t('Mes evenements')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenCours}>
                                                        <i className="feather-user btn-round-md bg-red me-3"></i>
                                                        Cours
                                                    </button>
                                                    {isOpenCours && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/cours" className="dropdown-item">{t('Cours')}</NavLink></li>
                                                            <li><NavLink to="/mescours" className="dropdown-item">{t('Mes cours')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                          
                                        </Fragment>
                                    )}

                                    {checkRole('etudiant') && (
                                        <Fragment>
                                            <li><Link to="/defaultjob" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#90b0b3"}}></i><span>{t('Jobs')}</span></Link></li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" style={{fontSize: "15px", color: "#8d8d8d",fontWeight:"600"}} onClick={toggleOpenFoyer}>
                                                        <i className="feather-user btn-round-md  me-3" style={{background:"#607d8b",color:"white", }}></i>
                                                        Foyer
                                                    </button>
                                                    {isOpenFoyer && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/mesdocuments" className="dropdown-item">{t('Mes Documents')}</NavLink></li>
                                                            <li><NavLink to="/foyer" className="dropdown-item">{t('Foyer')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                       
                                            <li><Link to="/defaultevent" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#2c7293"}}></i><span>{t('Evenements')}</span></Link></li>
                                            <li><Link to="/cours" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#2e4155"}}></i><span>{t('Cours')}</span></Link></li>

                                            
                                          
                                        </Fragment>
                                    )}

                                    {checkRole('employee') && (
                                        <Fragment>
                                            <li><Link to="/defaultjob" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#009688"}}></i><span>{t('Offres demploi')}</span></Link></li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenFoyer} style={{fontSize: "15px", color: "#8d8d8d",fontWeight:"600"}}>
                                                        <i className="feather-user btn-round-md bg-red me-3" style={{background:"#8BC34A",color:"white", }}></i>
                                                        Foyer
                                                    </button>
                                                    {isOpenFoyer && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/chambreDispo" className="dropdown-item">{t('Demandes')}</NavLink></li>
                                                            <li><NavLink to="/foyer" className="dropdown-item">{t('Foyer')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenEvenements} style={{fontSize: "15px", color: "#8d8d8d",fontWeight:"600"}}>
                                                        <i className="feather-user btn-round-md bg-red me-3"style={{background:"#795548",color:"white", }}></i>
                                                        Evenements
                                                    </button>
                                                    {isOpenEvenements && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/defaultevent" className="dropdown-item">{t('evenements')}</NavLink></li>
                                                            <li><NavLink to="/mesEvenement" className="dropdown-item">{t('Mes evenements')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                           
                                        </Fragment>
                                    )}

                                    {checkRole('enseignant') && (
                                        <Fragment>
                                            <li><Link to="/defaultevent" className="nav-content-bttn open-font"><i className="feather-award btn-round-md bg-yellow me-3"></i><span>{t('Evenements')}</span></Link></li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenEvenements} style={{fontSize: "15px", color: "#8d8d8d",fontWeight:"600"}}>
                                                        <i className="feather-user btn-round-md bg-red me-3" style={{background:"#CDDC39",color:"white", }}></i>
                                                        Offres d'emploi
                                                    </button>
                                                    {isOpenEvenements && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/defaultjob" className="dropdown-item">{t('Offres demploi')}</NavLink></li>
                                                            <li><NavLink to="/myjobs" className="dropdown-item">{t('Mes Offres demploi')}</NavLink></li>

                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="dropdown">
                                                    <button className="btn btn-link dropdown-toggle" onClick={toggleOpenCours} style={{fontSize: "15px", color: "#8d8d8d",fontWeight:"600"}}>
                                                        <i className="feather-user btn-round-md bg-red me-3" style={{background:"#009688",color:"white", }}></i>
                                                        Cours
                                                    </button>
                                                    {isOpenCours && (
                                                        <ul className="dropdown-menu show">
                                                            <li><NavLink to="/cours" className="dropdown-item">{t('Cours')}</NavLink></li>
                                                            <li><NavLink to="/mescours" className="dropdown-item">{t('Mes cours')}</NavLink></li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </li>
                                           
                                        </Fragment>
                                    )}

                                    {checkRole('rh') && (
                                        <Fragment>
                                            <li><Link to="/defaultjob" className="nav-content-bttn open-font"><i className="feather-award btn-round-md  me-3" style={{background:"#009688", }}></i><span>{t('Offres demploi')}</span></Link></li>
                                            <li><Link to="/myjobs" className="nav-content-bttn open-font"><i className="feather-user btn-round-md bg-primary-gradiant me-3"></i><span>{t('Mes Offres demploi')}</span></Link></li>
                                            <li><Link to="/defaultevent" className="nav-content-bttn open-font"><i className="feather-user btn-round-md bg-primary-gradiant me-3"></i><span>{t('Evenements')}</span></Link></li>

                                            
                                         
                                        </Fragment>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className={`app-header-search ${searchClass}`}>
                    <form className="search-form">
                        <div className="form-group searchbox mb-0 border-0 p-1">
                            <input type="text" className="form-control border-0" placeholder="Search..." />
                            <i className="input-icon">
                                <ion-icon name="search-outline" role="img" className="md hydrated" aria-label="search outline"></ion-icon>
                            </i>
                            <span className="ms-1 mt-1 d-inline-block close searchbox-close">
                                <i className="ti-close font-xs" onClick={toggleActive}></i>
                            </span>
                        </div>
                    </form>
                </div>

            </div>
        </Suspense>
    );
}

export default Header;