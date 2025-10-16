import { useState, useEffect } from 'react'
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import VerifyEmail from './components/VerifyEmail/VerifyEmail'
import PasswordReset from './components/PasswordReset/PasswordReset'

import Navigation from './components/Navigation/Navigation'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import Content from './components/Content/Content'
import PostDetail from './components/PostDetail/PostDetail'

import BodyClassController from './components/BodyClassController/BodyClassController'

import CreatePost from './components/CreatePost/CreatePost'

import Profile from './components/Profile/Profile'

import AllCategories from './components/AllCategories/AllCategories'
import CategoryPosts from './components/CategoryPosts/CategoryPosts'

import './App.css'

function App() {
  const [route, setRoute] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/password-reset/")) {
      const token = path.split("/")[2];
      setPasswordResetToken(token);
      setRoute("password-reset");
    }

    if (path.startsWith("/posts/")) {
      const id = path.split("/")[2];
      if (id) setRoute(`post:${id}`);
    }
  }, []);

  function onLoginSuccess(userId) {
    setIsSignedIn(true);
    setUserId(userId);
  }

  function onRouteChange(route) {
    if (route === 'logout') {
      setIsSignedIn(false);
      setUserId(null);
      // Можно сбросить route на home и, например, обновить посты
      setRoute('home');
    }
    setRoute(route);
  }

  const authRoutes = ['login', 'register', 'verify-email', 'password-reset'];

  const showParticle = authRoutes.includes(route);

  let routeUserId = null;
  if (route.startsWith('profile:')) {
    routeUserId = route.split(':')[1];  // id пользователя из маршрута
  } else if (route === 'profile') {
    routeUserId = userId;               // свой профиль
  }

  const routes = { 
    home: <Content onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={userId} />, 
    login: <Login onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    register: <Register onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    'verify-email': <VerifyEmail onRouteChange={onRouteChange} />, 
    'password-reset': <PasswordReset token={passwordResetToken} />,
    'create-post': <CreatePost onRouteChange={onRouteChange} userId={userId} />,
    'profile': <Profile userId={routeUserId} currentUserId={userId} onRouteChange={onRouteChange} />,
    'all-categories': <AllCategories onRouteChange={onRouteChange} />
  };

  let mainContent;
  if (route.startsWith('post:')) {    
    const postId = route.split(':')[1];
    mainContent = <PostDetail postId={postId} onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={userId} />;
  } else if (route.startsWith('profile/')) {
    const routeUserId = route.split('/')[1];
    mainContent = <Profile userId={routeUserId} currentUserId={userId} onRouteChange={onRouteChange} />
  } else if (route.startsWith('category:')) {
    const categoryId = route.split(':')[1];    
    mainContent = <CategoryPosts categoryId={categoryId} onRouteChange={onRouteChange} userId={userId} />;
  } else {
    mainContent = routes[route] || routes.home;
  }

  return (
    <>
      {showParticle && <ParticleBackground />}
      <BodyClassController route={route} />

      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} route={route} userId={userId} />

      <div className="main-content" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {!authRoutes.includes(route) && (
          <>
            <LeftSidebar onRouteChange={onRouteChange} />
            <RightSidebar onRouteChange={onRouteChange} />
          </>
        )}
        <div style={{ flex: 1 }}>
          {/* {routes[route] || routes.home} */}
          {mainContent}
        </div>
      </div>
    </>
  )
}

export default App
