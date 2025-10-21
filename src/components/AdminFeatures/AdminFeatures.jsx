import { useState } from "react";
import "./AdminFeatures.css";

function AdminFeatures({ onRouteChange  }) {
    const [isOpen, setIsOpen] = useState(true);

    const adminOptions = [
        { label: "Admin Panel", route: "admin-panel", icon: "fa-wrench", action: () => window.open('http://localhost:3000/admin', '_blank') },
        { label: "All Users", route: "all-users", icon: "fa-users" }
    ];

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div
                className="admin-features pointer custom-hover pa2 tl ml4 mr4 flex justify-between items-center"
                onClick={toggleDropdown}
            >
                <span>Admin Features</span>
                <i
                    className={`ml3 fa-solid fa-chevron-down icon-transition ${
                        isOpen ? "rotated" : ""
                    }`}
                ></i>
            </div>

            <div className={`dropdown-container ${isOpen ? "open" : ""}`}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {adminOptions.map((item, index) => (
                        <li
                            key={index}
                            className="mb2 pointer custom-hover pa2 tl ml4 mr4"
                            onClick={item.action ? item.action : () => onRouteChange(item.route)}
                        >
                            <i className={`fa-solid ${item.icon} mr2`}></i>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminFeatures;
