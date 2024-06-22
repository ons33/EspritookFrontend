import React, { Component , Fragment } from "react";
import API_BASE_URL from "../api/config";
import axios from "axios";

class Register extends Component {
    state = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        confirmPassword: '',
        termsAccepted: false,
        secondPassword: '',
        errors:[],
        interests:[],
        msgPassword:'merci de taper un mot de passe conforme'

    };


    handleChange = (e) => {

        const fieldName = e.target.name;
        let pass = this.state.password; // Déclaration de pass en dehors du bloc if
        let secPass = this.state.secondPassword; // Déclaration de secPass en dehors du bloc if


        this.setState(prevState => ({
            errors: prevState.errors.filter(error => error.param !== fieldName)
        }));

        this.setState({ [fieldName]: e.target.value });

if(fieldName==="password" ||fieldName=== "secondPassword"){
   if(fieldName==="password"){

        pass=e.target.value;


   }
   if(fieldName==="secondPassword"){
       secPass=e.target.value;
   }
    if(pass!==secPass){
        this.state.msgPassword="les mots de passes ne correspondent pas"
    }else{
        this.state.msgPassword="les mots de passes correspondent "
    }

}

    };

    handleCheckboxChange = () => {
        this.setState({ termsAccepted: !this.state.termsAccepted });
    };
    handleVerifyPassword = (e) => {
        const { password, secondPassword } = this.state;

        // Vérifiez si les mots de passe correspondent
        if (password !== secondPassword) {
            this.setState(prevState => ({
                errors: [...prevState.errors, { param: 'secondPassword', msg: 'Les mots de passe ne correspondent pas' }]
            }));
        } else {
            // Si les mots de passe correspondent, supprimez l'erreur du champ de confirmation de mot de passe
            this.setState(prevState => ({
                errors: prevState.errors.filter(error => error.param !== 'secondPassword')
            }));
        }
    };


    handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            email: this.state.email,
password: this.state.password,
            // role: 'etudiant',
            interests: this.state.interests,
            phoneNumber:this.state.phoneNumber,
            hasRestaurantSubscription: true
        };

        try {
            const response = await axios.post('http://localhost:8081/api/user/createUserAndKeycloak', userData);
            console.log(response.data);
        } catch (error) {
            if(error.response.data.error) {
                this.setState(prevState => (
                    {
                    errors: [...prevState.errors, { param: error.response.data.param, msg: error.response.data.error }]
                }));
                console.log(this.state.errors)
        }
            console.error('Error creating user:', error);
        }
    };
    handleInterestChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            this.setState(prevState => ({
                interests: [...prevState.interests, value]
            }));
            console.log("intersts checked",this.state.interests)
        } else {
            this.setState(prevState => ({
                interests: prevState.interests.filter(interest => interest !== value)
            }));
            console.log("intersts non  checked",this.state.interests)
        }
    };

    render() {
        return (
            <Fragment>

                <div className="main-wrap">
                    <div className="nav-header bg-transparent shadow-none border-0">
                        <div className="nav-top w-100">
                            <a href="/"><i className="feather-zap text-success display1-size me-2 ms-0"></i><span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">Sociala. </span> </a>
                            <button className="nav-menu me-0 ms-auto"></button>
            
                            <a href="/login" className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Login</a>
                            <a href="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</a>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-xl-5 d-none d-xl-block p-0  bg-image-cover bg-no-repeat"
                        style={{backgroundImage: `url("https://via.placeholder.com/800x950.png")`}}></div>
                        <div className="col-xl-7  align-items-center d-flex bg-white rounded-3 overflow-hidden">
                            <div className="card shadow-none border-0 ms-auto me-auto login-card">
                                <div className="card-body rounded-0 text-left">
                                    <h2 className="fw-700 display1-size display2-md-size mb-4">Create <br />your account</h2>
                                    <form onSubmit={this.handleSubmit}>
                                        
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-user text-grey-500 pe-0"></i>
                                            <input type="text" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="firstName" name="firstName" onChange={this.handleChange}  required={true} />


                                        </div>


                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-user text-grey-500 pe-0"></i>
                                            <input type="text" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="lastName" name="lastName" onChange={this.handleChange}  required={true}/>
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-user text-grey-500 pe-0"></i>
                                            <input type="text" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="username" name="username" onChange={this.handleChange} required={true} />

                                            {this.state.errors.map(error => (
                                                error.param === 'username' && (
                                                    <p key={error.param} className="text-danger">{error.msg}</p>
                                                )
                                            ))}
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-mobile text-grey-500 pe-0"></i>
                                            <input type="phone" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="phoneNumber" name="phoneNumber" onChange={this.handleChange}         defaultValue="+216" required={true}
                                            />

                                            {this.state.errors.map(error => (
                                                error.param === 'phoneNumber' && (
                                                    <p key={error.param} className="text-danger">{error.msg}</p>
                                                )
                                            ))}


                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <i className="font-sm ti-email text-grey-500 pe-0"></i>
                                            <input type="text" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address" name="email" onChange={this.handleChange} required={true}/>
                                            {this.state.errors.map(error => (
                                                error.param === 'email' && (
                                                    <p key="email" className="text-danger">{error.msg}</p>
                                                )
                                            ))}
                                        </div>
                                        <div className="form-group icon-input mb-3">
                                            <input type="Password" className="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password" name="password" onChange={this.handleChange} required={true}/>
                                            <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                                            {this.state.errors.map(error => (
                                                error.param === 'password' && (
                                                    <p key="password" className="text-danger">{error.msg}</p>
                                                )
                                            ))}
                                        </div>
                                        <div className="form-group icon-input mb-1">
                                            <input type="Password" className="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Confirm Password" name="secondPassword" onChange={this.handleChange} required={true} />

                                            <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                                            {

                                                <p key="password" className="text-danger">{this.state.msgPassword}</p>
                                            }

                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="font-xssss fw-600 text-grey-500">Select your interests:</label>
                                            <br/>
                                            <div className="d-block">
                                                <div className="form-check d-inline-block me-4">
                                                    <input className="form-check-input" type="checkbox" id="interest1" value="Lecture" onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest1">Lecture</label>
                                                </div>
                                                <div className="form-check d-inline-block me-4">
                                                    <input className="form-check-input" type="checkbox" id="interest2" value="Sport" onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest2">Sport</label>
                                                </div>
                                                <div className="form-check d-inline-block me-4">
                                                    <input className="form-check-input" type="checkbox" id="interest3" value="Cuisine " onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest3">Cuisine </label>
                                                </div>
                                                <div className="form-check d-inline-block me-4">
                                                    <input className="form-check-input" type="checkbox" id="interest4" value="Animaux " onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest4">Animaux </label>
                                                </div>

                                                <div className="form-check d-inline-block me-4">
                                                    <input className="form-check-input" type="checkbox" id="interest5" value="Volontariat " onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest5">Volontariat </label>
                                                </div>
                                                <div className="form-check d-inline-block">
                                                    <input className="form-check-input" type="checkbox" id="interest6" value="Camping" onChange={this.handleInterestChange} />
                                                    <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor="interest6">Camping</label>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-check text-left mb-3">
                                            <input type="checkbox" className="form-check-input mt-2" id="exampleCheck2" name="termsAccepted" onChange={this.handleCheckboxChange} />
                                            <label className="form-check-label font-xsss text-grey-500">Accept Term and Conditions</label>
                                            
                                        </div>
                                        <button type="submit" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0">Register</button>

                                    </form>
                                    
                                    <div className="col-sm-12 p-0 text-left">
                                        {/*<div className="form-group mb-1"><a href="/register" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Register</a></div>*/}
                                        <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Already have account <a href="/login" className="fw-700 ms-1">Login</a></h6>
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

export default Register;
