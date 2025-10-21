import { useEffect, useState } from 'react'
import './LeftSidebar.css'
import AdminFeatures from '../AdminFeatures/AdminFeatures'

function LeftSidebar({ onRouteChange, userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        async function loadUser() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
                if (!res.ok) throw new Error('Error loading author');
                const data = await res.json();
                if (!cancelled) setUser(data);
            } catch (err) {
                console.error('Error loading author:', err);
            }
        }

        loadUser();
        return () => { cancelled = true };
    }, [userId]);

    return (
        <div 
            className="br b--light-gray bg-white w-20 vh-100 fixed left-0 top-0 overflow-auto" 
            style={{
                paddingTop: '5rem',
                marginRight: '20%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li 
                    className="mb2 pointer custom-hover pa2 tl ml4 mr4" 
                    onClick={() => onRouteChange('home')}
                >
                    <i className="fa-solid fa-house mr2"></i>
                    Home
                </li>
                {/* <li 
                    className="mb2 pointer custom-hover pa2 tl ml4 mr4" 
                    onClick={() => onRouteChange('all-users')}
                >
                    <i className="fa-solid fa-users mr2"></i>
                    All Users
                </li> */}
                <li 
                    className="mb2 pointer custom-hover pa2 tl ml4 mr4" 
                    onClick={() => onRouteChange('all-categories')}
                >
                    <i className="fa-solid fa-tags mr2"></i>
                    All Categories
                </li>
                {/* <li 
                    className="mb2 pointer custom-hover pa2 tl ml4 mr4" 
                    onClick={() => onRouteChange('popular-posts')}
                >
                    <i className="fa-solid fa-fire mr2"></i>
                    Popular Posts
                </li> */}
            </ul>

            <hr className="w-90 center mt2 mb2" style={{ borderColor: '#ffffff' }} />

            {user?.role === 'admin' && <AdminFeatures onRouteChange={onRouteChange} />}
        </div>
    );
}

export default LeftSidebar;