import { useEffect, useState } from "react";
import PostPreview from '../PostPreview/PostPreview'

function SearchResults({ route, onRouteChange, userId }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = decodeURIComponent(route.split("query=")[1] || "").toLowerCase();
    
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, userId]);

    async function fetchPosts() {
        try {
            const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, { credentials: "include" });
            if (!userRes.ok) throw new Error("Error loading profile");
            const userData = await userRes.json();
            setUser(userData);
            setLoading(false);                

            const postsRes = await fetch(`${import.meta.env.VITE_API_URL}/posts`, { credentials: "include" });
            if (!postsRes.ok) throw new Error("Error loading posts");
            const postsData = await postsRes.json();

            const postsWithDetails = await Promise.all(postsData.posts.map(async post => {
                const catRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/categories`);
                const catData = await catRes.json();                    

                const comRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/comments`);
                const comData = await comRes.json();

                const commentsCount = Array.isArray(comData) ? comData.length : (comData.comments?.length || 0);

                return {
                    ...post,
                    categories: catData.categories || [],
                    commentsCount
                };
            }));

            setPosts(postsWithDetails);            

            const filtered = postsWithDetails.filter(p => p.title && p.title.toLowerCase().includes(query));
            setFilteredPosts(filtered);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    }

    function openPost(id) {
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

    if (loading) return <p>Loading...</p>;
    if (!user || !posts || error) return <p>Error: {error}</p>;

    return (
        <div 
            className="search-results"
            style={{
                paddingTop: '6rem',
                paddingBottom: '6rem',
                marginLeft: '20%',
                marginRight: '25%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            <h2>Search results for: "{query}"</h2>
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <div key={post.id} className="search-posts-list">
                        <PostPreview key={post.id} post={post} onOpen={openPost} userId={userId} fetchPosts={fetchPosts} />
                    </div>
                ))
            ) : (
                <p>Nothing found</p>
            )}
        </div>
    );
}

export default SearchResults;
