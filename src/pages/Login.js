import React, { Component, Fragment } from "react";
import axios from "axios"; // Import axios for making HTTP requests
//import faviconImg from '/images/favicon.png';
import { withRouter } from 'react-router-dom'; // Import withRouter from react-router-dom
import Cookies from "js-cookie"; // Import js-cookie library

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleFormSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
console.log("email",email);
console.log("password",password);
        try {
            const response = await axios.post("http://localhost:8081/api/user/login", {
                email,
                password
            });
            const { accessToken } = response.data;
            console.log("response.data.accessToken",response.data.accessToken);

            Cookies.set('token', response.data.accessToken, { expires: 7 });

            // Assuming the token is received in the response
            const user = response.data.user;
            console.log("yyyyyyyyyyyyyyyyyyyyyy",response.data.user);
            // Redirect to "/authorpage" and pass token as state
            this.props.history.push('/authorpage', { accessToken ,user });
        } catch (error) {
            console.error("Login error:", error);
            // Handle login error here
        }
    };


    render() {
        return (
            <Fragment> 
                <div className="main-wrap">
                    <div className="nav-header bg-transparent shadow-none border-0">
                        <div className="nav-top w-100">
                        <img src="assets/images/favicon.png" alt="Favicon"  style={{ width: '20rem', marginTop: '1%',marginLeft:'1%' }}  />

                            <button className="nav-menu me-0 ms-auto"></button>
            
                            <a href="/login" className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Login</a>
                            <a href="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{backgroundImage: `url("https://mydigilearn-dev.s3.ap-southeast-3.amazonaws.com/k9Wx03HWth2bfdzO2TY8/content/branding/2023/1/2023113141335.svg")`}}></div>
                            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                                <div className="card shadow-none border-0 ms-auto me-auto login-card">
                                    <div className="card-body rounded-0 text-left">
                                        <h2 className="fw-700 display1-size display2-md-size mb-3">Login into <br />your account</h2>
                                        <form onSubmit={this.handleFormSubmit}>
    <div className="form-group icon-input mb-3">
        <i className="font-sm ti-email text-grey-500 pe-0"></i>
        <input
            type="text"
            name="email"
            value={this.state.email} // Update value
            onChange={this.handleInputChange}
            className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
            placeholder="Your Email Address"
        />                        
    </div>
    <div className="form-group icon-input mb-1">
        <input
            type="Password"
            name="password"
            value={this.state.password} // Update value
            onChange={this.handleInputChange}
            className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
            placeholder="Password"
        />
        <i className="font-sm ti-lock text-grey-500 pe-0"></i>
    </div>
    <button type="submit" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0">Login</button>
</form>

                                        
                                        <div className="col-sm-12 p-0 text-left">
                                            <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <a href="/register" className="fw-700 ms-1">Register</a></h6>
                                        </div>
                                        <div className="col-sm-12 p-0 text-center mt-2">
                                            
                                            <h6 className="mb-0 d-inline-block bg-white fw-500 font-xsss text-grey-500 mb-3">Or, Sign in with your social account </h6>
                                            <div className="form-group mb-1"><a href="/register" style={{backgroundColor:"#d84a4a"}} className="form-control text-left style2-input text-white  bg-facebook border-0 p-0 mb-2"><img src="assets/images/icon-1.png" alt="icon" className="ms-2 w40 mb-1 me-5" /> Sign in with Google</a></div>
                                            <div className="form-group mb-1"><a href="/register" className="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="assets/images/icon-3.png" alt="icon" className="ms-2 w40 mb-1 me-5" /> Sign in with Facebook</a></div>
                                            <div className="form-check text-left mb-3">
                                                <input type="checkbox" className="form-check-input mt-2" id="exampleCheck5" />
                                                <label className="form-check-label font-xsss text-grey-500">Remember me</label>
                                                <a href="/forgot" className="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Login); // Wrap your component with withRouter HOC
