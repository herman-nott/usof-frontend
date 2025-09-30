import { useState } from 'react'
import Navigation from './components/Navigation/Navigation'
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import './App.css'

function App() {
  const [route, setRoute] = useState('login');
  const [isSignedIn, setIsSignedIn] = useState(false);

  function onRouteChange(route) {
    if (route === 'logout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <>
      <ParticleBackground />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      
      {
        route === 'home'
          ? <div>
              <h1>Welcome</h1>
            </div>
          : (
              route === 'register' 
                ? <Register onRouteChange={onRouteChange} />
                : <Login onRouteChange={onRouteChange} />
            )
      }
    </>
  )
}

export default App
