import { useState, useEffect } from "react"
import './Navigation.css'

function Navigation({ onRouteChange, isSignedIn, route, userId }) {
    const [searchBar, setSearchBar] = useState('');
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        if (isSignedIn && userId) {
            fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                credentials: "include",
            })
                .then(res => res.json())
                .then(data => {setUser(data)})
                .catch(err => console.error("Error fetching user:", err));
        } else {
            setUser(null);
        }
    }, [isSignedIn, userId]);

    const avatar = user?.profile_picture
        ? `http://localhost:3000/${user.profile_picture}`
        : "http://localhost:3000/uploads/avatars/default.png";    

    function onSearchBarChange(event) {
        setSearchBar(event.target.value);
    }

    function handleSearch() {
        
    }

    function onViewProfileSubmit() {
        
    }

    if (route === 'login' || route === 'register' || route === 'verify-email' || route === 'password-reset') {
        return (
            <nav className="bb b--light-gray bg-white pa2 fixed top-0 left-0 w-100 z-5" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('home')}>Home</p>
                <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('login')}>Log In</p>
                <p className="f3 link dim black underline pa3 pointer ma0 " onClick={() => onRouteChange('register')}>Register</p>
            </nav>
        );
    }

    return (
        <nav 
            className="bb b--light-gray bg-white pa2 fixed top-0 left-0 w-100 z-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
                className="logo pointer ml4"
                onClick={() => onRouteChange('home')}
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#333',
                    marginRight: '2rem'
                }}
            >
                usof
            </div>

            <form onSubmit={handleSearch} className="flex items-center justify-center w-50-ns w-70-m w-90">
                <div className="relative w-100">
                    <i
                        className="fa-solid fa-magnifying-glass absolute left-1 top-50 translate--y-50 black-50"
                        style={{ top: '50%', transform: 'translateY(-50%)', left: '10px' }}
                    ></i>

                    <input
                        className="pa2 pl4 input-reset ba b--black-20 w-100 outline-0 focus-b--transparent"
                        type="text"
                        placeholder="Search..."
                        value={searchBar}
                        onChange={onSearchBarChange}
                    />
                </div>
            </form>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isSignedIn ? (
                    <>
                        <button
                            className="create-post-btn b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit"
                            onClick={() => onRouteChange('create-post')}
                        >
                            <div className="btn-container">
                                <i className="create-post-plus fa-solid fa-plus"></i>
                                <span>Create</span>
                            </div>
                        </button>
                        <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('logout')}>Log Out</p>
                        <img
                            className="br-100 shadow-1 ml3 mr3 pointer"
                            src={avatar}
                            alt="Avatar"
                            width={40}
                            height={40}
                            style={{ objectFit: 'cover' }}
                            onClick={onViewProfileSubmit}
                        />
                    </>
                ) : (
                    <>
                        <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('login')}>Log In</p>
                        <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('register')}>Register</p>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navigation;