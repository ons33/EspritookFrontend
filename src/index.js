import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import './main.scss';
import './i18n'

import Demo from './demo/Demo';

import App from './pages/app';

import Home from './pages/Home';

import EventCalendar from './pages/Badge';
import Group from './pages/Group';
import Storie from './pages/Storie';
import Member from './pages/Member';
import Email from './pages/Email';
import Emailopen from './pages/Emailopen';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Contactinfo from './pages/Contactinfo';
import Socialaccount from './pages/Socialaccount';
import Password from './pages/Password';
import Payment from './pages/Payment';
import Notification from './pages/Notification';
import Helpbox from './pages/Helpbox';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Notfound from './pages/Notfound';
import WrappedApp from './pages/test'
import ShopOne from './pages/ShopOne';
import ShopTwo from './pages/ShopTwo';
import ShopThree from './pages/ShopThree';
import Singleproduct from './pages/Singleproduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Chat from './pages/Chat';
import Live from './pages/Live';

import Job from './pages/Job';
import JobDetail from './pages/JobDetail';
import PostJob from "./pages/Jobs/PostJob";

import Event from './pages/Evenement/Event';
import Hotel from './pages/Hotel';
import Videos from './pages/Videos';
import Comingsoon from './pages/Comingsoon';

import FoyerHomePage from './pages/Foyer/Foyer';

import 'mapbox-gl/dist/mapbox-gl.css';

import Grouppage from './pages/Grouppage';
import Userpage from './pages/Userpage';
import Authorpage from './pages/Authorpage';
import EventDetails from './pages/Evenement/EventDetails';
import Analytics from './pages/Analytics';


import ChatRoom from './pages/chatRoom/ChatRoom'; // Import the ChatRoom component


import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Profile from './pages/Profile';
import PDFViewerPage from './pages/PDFViewerPage';
import Jours from "./pages/Restaurant/Emplois";
import EmploiDetails from "./pages/Restaurant/components/EmploiDetails";
import JourDetails from "./pages/Restaurant/components/JourDetails";
import Emplois from "./pages/Restaurant/Emplois";
import EditProfile from "./pages/EditProfile";

import ManageInvitations from './pages/Evenement/ManageInvitations';
import Eventform from './pages/Evenement/EventForm';
import MesEvenements from './pages/Evenement/MesEvenements';
import MyEventDetails from './pages/Evenement/MyEventDetails';

import CoursList from './pages/Cours/CoursList';
import CoursDetail from './pages/Cours/CoursDetail';
import DocumentDetail from './pages/Cours/DocumentDetail';
import SectionDetail from './pages/Cours/SectionDetail';
import AddContentForm from './pages/Cours/DocumentForm'
import ParticipantList from './pages/Cours/ParticipantList'
import MesCoursList from './pages/Cours/Enseignant/MesCours'
import MesCoursDetail from './pages/Cours/Enseignant/MesCoursDetails';
import MaSectionDetail from './pages/Cours/Enseignant/MaSectionDetail';

import {About} from "./pages/Portfolio/components/About/About";
import IndexHtmlPage from "./pages/Portfolio/IndexHtmlPage";
import App2 from "./pages/Portfolio/App";


import Protected from './pages/Protected';
import Public from './pages/Public';
import DashboardA from './adminDashboard/dashboard';

import MyJobs from './pages/Jobs/MyJobs';
import Candidatures from './pages/Candidatures/Candidatures';
import CandidaturePdf from './pages/Candidatures/CandidaturePdf';
import ListeDemandes from './pages/Foyer/MyDocument';
import MesDocuments from './pages/Foyer/MyDocument';
import AttributionChambres from './pages/Foyer/Chambres';
import AddChambreForm from './pages/Foyer/AddChambreForm';

class Root extends Component{

  render(){
      return(
          <BrowserRouter basename={'/'}>
              <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/home`} component={Home}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/app`} component={App}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/dash`} component={DashboardA}/>



                    <Route exact path={`${process.env.PUBLIC_URL}/defaultbadge`} component={EventCalendar}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultgroup`} component={Group}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultstorie`} component={Storie}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultemailbox`} component={Email}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultemailopen`} component={Emailopen}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultsettings`} component={Settings}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultvideo`} component={Videos}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultanalytics`} component={Analytics}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/editProfile`} component={EditProfile}/>

                    <Route exact path={`${process.env.PUBLIC_URL}/profile`} component={Profile}/>
                  <Route exact path={`${process.env.PUBLIC_URL}/editProfile`} component={EditProfile}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/accountinformation`} component={Account}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultmember`} component={Member}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/contactinformation`} component={Contactinfo}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/socialaccount`} component={Socialaccount}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/password`} component={Password}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/payment`} component={Payment}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultnoti`} component={Notification}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/helpbox`} component={Helpbox}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/register`} component={Register}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/forgot`} component={Forgot}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/notfound`} component={Notfound}/>


                    <Route exact path={`${process.env.PUBLIC_URL}/foyer`} component={FoyerHomePage}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/mesdocuments`} component={MesDocuments}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/chambreDispo`} component={AttributionChambres}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/addChambre`} component={AddChambreForm}/>

                    
                    <Route exact path={`${process.env.PUBLIC_URL}/chatroom`} component={ChatRoom} /> {/* Add the route for ChatRoom */}



                    <Route exact path={`${process.env.PUBLIC_URL}/public`} component={Public}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/protected`} component={Protected}/>

                    <Route exact path={`${process.env.PUBLIC_URL}/shop1`} component={ShopOne}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/shop2`} component={ShopTwo}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/shop3`} component={ShopThree}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/singleproduct`} component={Singleproduct}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/cart`} component={Cart}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/checkout`} component={Checkout}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultmessage`} component={Chat}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultlive`} component={Live}/>

                    <Route exact path={`${process.env.PUBLIC_URL}/defaultjob/:id`} component={JobDetail} />
                    <Route exact path={`${process.env.PUBLIC_URL}/postjob`} component={PostJob}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/myjobs`} component={MyJobs}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultjob`} component={Job}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/candidatures/:jobId`} component={Candidatures}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/candidatures`} component={Candidatures}/>



                    {/* ***********************************Gestion evenements */}
                    <Route exact path={`${process.env.PUBLIC_URL}/defaultevent`} component={Event}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/mesEvenement`} component={MesEvenements}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/event`} component={EventDetails}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/myEvent`} component={MyEventDetails}/>

                    <Route exact path={`${process.env.PUBLIC_URL}/manage-invitations`} component={ManageInvitations}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/eventForm`} component={Eventform}/>



                      {/* ***********************************Gestion Cours */}

                      <Route exact path={`${process.env.PUBLIC_URL}/cours`} component={CoursList}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/cours/:id`} component={CoursDetail}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/sections/:id`} component={SectionDetail}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/documents/:id`} component={DocumentDetail}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/document/AddContentForm`} component={AddContentForm}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/mescours`} component={MesCoursList}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/mescours/:id`} component={MesCoursDetail}/>  
                      <Route exact path={`${process.env.PUBLIC_URL}/masections/:id`} component={MaSectionDetail}/>  

                      






                    <Route exact path={`${process.env.PUBLIC_URL}/defaulthotel`} component={Hotel}/>  
                    <Route exact path={`${process.env.PUBLIC_URL}/grouppage`} component={Grouppage}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/userpage`} component={Userpage}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/authorpage`} component={Authorpage}/>  
                    <Route exact path={`${process.env.PUBLIC_URL}/comingsoon`} component={Comingsoon}/>  
                    


                    <Route path="/pdf-viewer" component={PDFViewerPage} />
                    <Route path="/pdf-cand" component={CandidaturePdf} />

                      {/* ***********************************backoffice */}



                      {/* ***********************************Gestion Restauration */}
                  <Route exact path={`${process.env.PUBLIC_URL}/emplois`} component={Emplois}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/emploi`} component={EmploiDetails}/>
                    <Route exact path={`${process.env.PUBLIC_URL}/jour`} component={JourDetails}/>

                  {/* ***********************************Portfolio */}

                  <Route exact path={`${process.env.PUBLIC_URL}/portfolio/:idUser`} component={App2}/>
              </Switch>
          </BrowserRouter>
      )
  }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
serviceWorker.register();
