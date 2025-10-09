import './LeftSidebar.css'
import CategoriesDropdown from "../CategoriesDropdown/CategoriesDropdown"

function LeftSidebar({ onRouteChange }) {

    const categories = [1,2,3,4,5]

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
                    onClick={() => onRouteChange('all-posts')}
                >
                    <i className="fa-solid fa-newspaper mr2"></i>
                    All Posts
                </li>
                <li 
                    className="mb2 pointer custom-hover pa2 tl ml4 mr4" 
                    onClick={() => onRouteChange('popular-posts')}
                >
                    <i className="fa-solid fa-star mr2"></i>
                    Popular Posts
                </li>
            </ul>

            <hr className="w-90 center mt2 mb2" style={{ borderColor: '#ffffff' }} />

            <CategoriesDropdown categories={categories} />
        </div>
    );
}

export default LeftSidebar;