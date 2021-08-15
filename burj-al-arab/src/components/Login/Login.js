import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';


firebase.initializeApp(firebaseConfig);


const Login = () => {
    const [loggedUser,setLoggedUser]=useContext(UserContext)
    const history=useHistory();
    const location=useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    const handleSignWithGoogle=()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
  .signInWithPopup(provider)
 
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    const {displayName,email} = result.user;
    const signInUser={name:displayName,email:email}
    console.log(signInUser)
    setLoggedUser(signInUser)
    storeAuthToken()
    history.replace(from)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
    }

    const storeAuthToken=()=>{
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      .then(function(idToken) {
        console.log(idToken)
        sessionStorage.setItem('token',idToken)
    
      }).catch(function(error) {
        // Handle error
      });
    }
    return (
        <div>
            <h1>This is Login</h1>
            <button onClick={handleSignWithGoogle}>Sign in with Google</button>
        </div>
    );
};

export default Login;