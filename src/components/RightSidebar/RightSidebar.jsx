import './RightSidebar.css'
import CategoriesDropdown from "../CategoriesDropdown/CategoriesDropdown"

function RightSidebar({ onRouteChange }) {
    return (
        <div 
            className="bl b--light-gray bg-white w-25 vh-100 fixed left-0 top-0 overflow-auto" 
            style={{
                paddingTop: '5rem',
                marginLeft: '75%',
                minHeight: '100vh',
                overflowY: 'auto',
                // background: 'red'
            }}
        >
            
        </div>
    );
}

export default RightSidebar;