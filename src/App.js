import React, { useState, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import services from "./services";
import axios from "axios";
import "./index.css";

function App() {
  // React States
  
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLogin, setIsLogin] = useState();
  const [loading, setLoading] = useState(false);

  const [ profile, setProfile ] = useState(null);
  const clientId = '712105478949-mpna27nalosn2he2sqdu7vbjuba6icnh.apps.googleusercontent.com';

  useEffect(() => {
    const initClient = () => {
        gapi.client.init({
            clientId: clientId,
            scope: ''
        });
    };
    gapi.load('client:auth2', initClient);
  });

  const onSuccess = (res) => {
    setProfile(res.profileObj);
};

const onFailure = (err) => {
    console.log('failed', err);
};

const logOut = () => {
    setProfile(null);
};

  const errors = {
    pass: "invalid email or password"
  };

  const user = {
    email: "",
    password: ""
  };

  async function fetchData() {
    
    const { data } = await axios.post(
      'http://localhost:8080/authentication/api/login',
      user
    )
    setIsLogin(data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    if (isLogin){
      setIsSubmitted(true);
    }
    else if (isLogin===false){
      setErrorMessages({ name: "pass", message: errors.pass });
    }
  }, [isLogin])

  
  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    user.email = uname.value;
    user.password = pass.value;
    
    fetchData();
  }; 

  if (loading) {
    return <div className="loader-container"></div>;
  }

  // Generate JSX code for error message
  
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
      
    );

  // JSX code for login form
  
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
    <br />
    <br />
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
        <br/>
        {profile ? (
        <div>
            <img src={profile.imageUrl} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile.name}</p>
            <p>Email Address: {profile.email}</p>
            <br />
            <br />
            <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut}/>
        </div>
    ) : (
        <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            type="submit"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
        />
    )}
      </form>
    </div>
  );

  return (

    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div> 
    </div>
  );
}

export default App;