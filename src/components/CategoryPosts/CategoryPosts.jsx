import { useEffect, useState } from "react";
import PostPreview from "../PostPreview/PostPreview";
import "./CategoryPosts.css";

function CategoryPosts({ categoryId, onRouteChange, userId }) {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const catRes = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`);
                if (!catRes.ok) throw new Error("Failed to load category");
                const catData = await catRes.json();
                setCategory(catData || catData);

                // const postsRes = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}/posts`);
                // if (!postsRes.ok) throw new Error("Failed to load posts");
                // const postsData = await postsRes.json();
                // setPosts(postsData || []);
                // console.log(postsData);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error loading posts: ' + res.status);
                const data = await res.json();                

                const items = Array.isArray(data) ? data : (data.posts || []);

                const postsWithCategories = await Promise.all(items.map(async post => {
                    const catRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/categories`, {
                        credentials: 'include',
                    });
                    const catData = await catRes.json();

                    const comRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/comments`, {
                        credentials: 'include',
                    });
                    const comData = await comRes.json();

                    const commentsCount = Array.isArray(comData) ? comData.length : (comData.comments?.length || 0);
                
                    return {
                        ...post,
                        categories: catData.categories || [],
                        commentsCount
                    };
                }));
                
                // setPosts(postsWithCategories);
                const filteredPosts = postsWithCategories.filter(post =>
                    post.categories.some(cat => cat.id === Number(categoryId))
                );

                setPosts(filteredPosts);
            } catch (err) {
                console.error(err);
                setError("Error loading category posts");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [categoryId]);

    function openPost(id) {
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

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
                <p className="loading">Loading posts...</p>
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
            className="category-posts-container bg-white"
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
                className="pointer flex items-center justify-center"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    transition: 'background 0.2s',
                    marginRight: '1.5rem',
                    marginLeft: '1.5rem'
                }}
                onClick={() => { 
                    window.history.pushState({}, '', '/'); 
                    onRouteChange('all-categories'); 
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            
            <h2 className="category-title tl">
                {category ? `#${category.title}` : "Category"}
            </h2>
            <p className="category-description tl">
                {category?.description || "No description available."}
            </p>

            <div className="category-posts-list">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostPreview key={post.id} post={post} onOpen={openPost} onRouteChange={onRouteChange} userId={userId} />
                    ))
                ) : (
                    <p>No posts in this category yet.</p>
                )}
            </div>
        </div>
  );
}

export default CategoryPosts;
