import { useState } from "react";
import "./CategoriesDropdown.css";

function CategoriesDropdown({ categories }) {
    const [isOpen, setIsOpen] = useState(true);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div
                className="mb2 pointer custom-hover pa2 tl ml4 mr4 flex justify-between items-center"
                onClick={toggleDropdown}
            >
                <span>Categories</span>
                <i
                    className={`ml3 fa-solid fa-chevron-down icon-transition ${
                        isOpen ? "rotated" : ""
                    }`}
                ></i>
            </div>

            <div className={`dropdown-container ${isOpen ? "open" : ""}`}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {categories.map((cat, index) => (
                        <li
                            key={index}
                            className="mb2 pointer custom-hover pa2 tl ml4 mr4"
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CategoriesDropdown;
