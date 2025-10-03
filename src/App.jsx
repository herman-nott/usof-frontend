import { useState, useEffect } from 'react'
import Navigation from './components/Navigation/Navigation'
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import VerifyEmail from './components/VerifyEmail/VerifyEmail'
import PasswordReset from './components/PasswordReset/PasswordReset'
import './App.css'

function App() {
  const [route, setRoute] = useState('login');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/password-reset/")) {
      const token = path.split("/")[2];
      setPasswordResetToken(token);
      setRoute("password-reset");
    }
  }, []);

  function onRouteChange(route) {
    if (route === 'logout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    } 
    setRoute(route);
  }

  const routes = { 
    home: <h1>Welcome</h1>, 
    login: <Login onRouteChange={onRouteChange} />, 
    register: <Register onRouteChange={onRouteChange} />, 
    'verify-email': <VerifyEmail onRouteChange={onRouteChange} />, 
    'password-reset': <PasswordReset token={passwordResetToken} />
  };

  return (
    <>
      <ParticleBackground />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {routes[route] || routes.login}
    </>
  )
}

export default App
