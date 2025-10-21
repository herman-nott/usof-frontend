import { useEffect, useState } from "react";
import "./AllCategories.css";

function AllCategories({ onRouteChange, isSignedIn, userId }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                if (isSignedIn && userId) {
                    const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, { credentials: "include" });
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setUser(userData);
                    }
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                const baseCategories = data || [];

                const categoriesWithCounts = await Promise.all(
                    baseCategories.map(async (cat) => {
                        try {
                            const postsRes = await fetch(`${import.meta.env.VITE_API_URL}/categories/${cat.id}/posts`);
                            const postsData = await postsRes.json();

                            const activePosts = postsData.filter(post => post.status === 'active');
                            
                            return { ...cat, post_count: activePosts.length || 0 };
                        } catch {
                            return { ...cat, post_count: 0 };
                        }
                    })
                );

                setCategories(categoriesWithCounts);                
            } catch (err) {
                console.error(err);
                setError("Error loading categories");
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, [isSignedIn, userId]);    

    if (loading) {
        return (
            <div 
                className="all-categories-container bg-white"
                style={{
                    paddingTop: '6rem',
                    paddingBottom: '2rem',
                    marginLeft: '20%',
                    marginRight: '25%',
                    minHeight: '100vh',
                    overflowY: 'auto',
                }}
            >
                <p className="loading">Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="all-categories-container bg-white"
                style={{
                    paddingTop: '6rem',
                    paddingBottom: '2rem',
                    marginLeft: '20%',
                    marginRight: '25%',
                    minHeight: '100vh',
                    overflowY: 'auto',
                }}
            >
                <p className="error">{error}</p>
            </div>
        );
    }    

    return (
        <div 
            className="all-categories-container bg-white"
            style={{
                paddingTop: '6rem',
                paddingBottom: '2rem',
                marginLeft: '20%',
                marginRight: '25%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            <div 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1rem' }}
            >
                <h2>All Categories</h2>
                {isSignedIn && user?.role === 'admin' && (
                    <button
                        className="create-category-btn b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                        onClick={() => onRouteChange('create-category')}
                    >
                        <div className="btn-container">
                            <i className="create-post-plus fa-solid fa-plus"></i>
                            <span>Create New Category</span>
                        </div>
                    </button>
                )}
            </div>

            <div className="categories-grid">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="category-card"
                        onClick={() => onRouteChange(`category:${cat.id}`)}
                    >
                        <h3>{cat.title}</h3>
                        <p>{cat.description || "No description"}</p>
                        <span className="category-meta">
                            {cat.post_count || 0} posts
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCategories;
