import { useState, useEffect } from "react";
import PostPreview from '../PostPreview/PostPreview'
import "./Profile.css";

function Profile({ userId, currentUserId, onRouteChange, isSignedIn }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    const isOwnProfile = userId === currentUserId;

    useEffect(() => {
        if (!userId) return;

        async function fetchProfileAndPosts() {
            try {
                const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, { credentials: "include" });
                if (!userRes.ok) throw new Error("Error loading profile");
                const userData = await userRes.json();
                setUser(userData);
                setLoading(false);                

                const postsRes = await fetch(`${import.meta.env.VITE_API_URL}/posts`, { credentials: "include" });
                if (!postsRes.ok) throw new Error("Error loading posts");
                const postsData = await postsRes.json();

                const userPosts = postsData.posts.filter(post => {
                    return (post.author_id) === Number(userId);
                });

                const postsWithDetails = await Promise.all(userPosts.map(async post => {
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
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfileAndPosts();

    }, [userId]);

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

            const userPosts = postsData.posts.filter(post => {
                return (post.author_id) === Number(userId);
            });

            const postsWithDetails = await Promise.all(userPosts.map(async post => {
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
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    function openPost(id) {
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

    if (loading) {
        return (
            <div className="tc mt5 f4 messages">
                <div 
                    className="flex"
                    style={{ 
                        gap: '1rem',
                        marginRight: '2rem'
                    }}
                >
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem',
                            marginLeft: '1rem',
                        }}
                        onClick={() => { 
                            window.history.pushState({}, '', '/'); 
                            onRouteChange('home'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
                
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="tc mt5 f4 messages">
                <div 
                    className="flex"
                    style={{ 
                        gap: '1rem',
                        marginRight: '2rem'
                    }}
                >
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem',
                            marginLeft: '1rem',
                        }}
                        onClick={() => { 
                            window.history.pushState({}, '', '/'); 
                            onRouteChange('home'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
                
                <div className="red">Error: {error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="tc mt5 f4 messages">
                <div 
                    className="flex"
                    style={{ 
                        gap: '1rem',
                        marginRight: '2rem'
                    }}
                >
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem',
                            marginLeft: '1rem',
                        }}
                        onClick={() => { 
                            window.history.pushState({}, '', '/'); 
                            onRouteChange('home'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
                
                <div className="red">User not found</div>
            </div>
        );
    }

    const avatar = user.profile_picture
        ? `http://localhost:3000/${user.profile_picture}`
        : "http://localhost:3000/uploads/avatars/default.png";

    return (
        <div 
            className="profile bg-white tl"
            style={{
                paddingTop: '6rem',
                paddingBottom: '6rem',
                marginLeft: '20%',
                marginRight: '25%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            <div 
                className="flex"
                style={{ 
                    gap: '1rem',
                    marginRight: '2rem'
                }}
            >
                {/* Кнопка "назад" */}
                <div 
                    className="pointer flex items-center justify-center"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        transition: 'background 0.2s',
                        marginRight: '1.5rem',
                        marginLeft: '1rem',
                    }}
                    onClick={() => { 
                        window.history.pushState({}, '', '/'); 
                        onRouteChange('home'); 
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </div>

                <div className="profile-container pa4 mw8 bg-near-white shadow-4 br3">
                    <div className="flex flex-column">
                        <div className="flex flex-row items-center">
                            {/* Левая часть — аватар */}
                            <div className="mr4 tc" style={{ position: 'relative' }}>
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="br-100 shadow-1"
                                    width={150}
                                    height={150}
                                    style={{ objectFit: "cover" }}
                                />
                                {user.role === 'admin' && (
                                    <i
                                        className="fa-solid fa-crown"
                                        style={{
                                            position: 'absolute',
                                            top: '-14px',
                                            right: '7px',
                                            color: 'gold',
                                            transform: 'rotate(35deg)',
                                            fontSize: '2rem',
                                            textShadow: '0 0 2px #000',
                                        }}
                                    ></i>
                                )}
                            </div>

                            {/* Правая часть — информация */}
                            <div className="flex-auto">
                                <h2 className="f2 mt0 mb1">{user.full_name || "unknown"}</h2>
                                <p className="f4 mb2">@{user.login}</p>
                                <p className="mb3">{user.email}</p>

                                <div className="flex flex-wrap justify-between">
                                    <div className="mb2 mr5">
                                        <span className="b">Role:</span> {user.role || "user"}
                                    </div>
                                    <div className="mb2">
                                        <span className="b">Rating:</span> {user.rating ?? 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isOwnProfile && (
                            <button
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                style={{
                                    marginTop: '1.6rem',
                                }}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div 
                className="mt5"
                style={{
                    marginLeft: '2rem',
                }}
            >
                <h3 
                    className="f3 mb3"
                    style={{
                        marginLeft: '2rem',
                    }}
                >
                    @{user.login}'s posts:
                </h3>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div className="user-post-list">
                            <PostPreview key={post.id} post={post} onOpen={openPost} userId={userId} fetchPosts={fetchPosts} />
                        </div>
                    ))
                ) : (
                    <p className="gray" style={{ marginLeft: '2rem' }}>@{user.login} has no posts yet</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
