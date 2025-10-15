import{ useEffect, useState } from 'react';
import './PostDetail.css'
import CommentsSection from '../CommentsSection/CommentsSection'

function PostDetail({ postId, onRouteChange, isSignedIn, userId }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [author, setAuthor] = useState(null);

    const [userLikeType, setUserLikeType] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!res.ok) throw new Error('Error loading post: ' + res.status);
            const data = await res.json();
            
            const catRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${data.id}/categories`);
            const catData = await catRes.json();

            const comRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${data.id}/comments`);
            const comData = await comRes.json();

            const commentsCount = Array.isArray(comData) ? comData.length : (comData.comments?.length || 0);

            const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${data.id}/like`);
            const likeData = await likeRes.json();
            const likesArr = likeData.likes || [];

            const likes_count = likesArr.filter(l => l.type === 'like').length;
            const dislikes_count = likesArr.filter(l => l.type === 'dislike').length;
            const rating = likes_count - dislikes_count;

            let userLikeType = null;
            if (likeData.likes && isSignedIn && userId) {
                const myLike = likeData.likes.find(like => like.author_id === userId);
                if (myLike) {
                    userLikeType = myLike.type; // 'like' или 'dislike'
                }
            }

            const fullPost = {
                ...data,
                categories: catData.categories || [],
                commentsCount,
                likes_count,
                dislikes_count,
                rating,
            };

            // console.log(fullPost);
            
            
            setPost(fullPost);
            setUserLikeType(userLikeType);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    useEffect(() => {
        if (!post) return;
        let cancelled = false;

        async function loadAuthor() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
                if (!res.ok) throw new Error('Error loading author');
                const data = await res.json();
                if (!cancelled) setAuthor(data);
            } catch (err) {
                console.error('Error loading author:', err);
            }
        }

        loadAuthor();
        return () => { cancelled = true };
    }, [post]);

    async function handleLike(type) {
        if (!isSignedIn) {
            // onRouteChange('login');
            return;
        }

        try {
            if (userLikeType === type) {
                // Пользователь уже поставил этот тип лайка → удаляем
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                console.log(res);
                
                if (!res.ok) throw new Error('Error when deleting a like');
                setUserLikeType(null);
            } else {
                // Пользователь ставит новый лайк/дизлайк
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ type }) // 'like' или 'dislike'
                });
                if (!res.ok) throw new Error('Error sending like');
                setUserLikeType(type);
            }

            // Обновляем данные поста (лайки/дизлайки)
            const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`);
            const likeData = await likeRes.json();
            const likesArr = likeData.likes || [];
            const likes_count = likesArr.filter(l => l.type === 'like').length;
            const dislikes_count = likesArr.filter(l => l.type === 'dislike').length;
            const rating = likes_count - dislikes_count;

            setPost(prev => ({
                ...prev,
                likes_count,
                dislikes_count,
                rating,
            }));
        } catch (err) {
            console.error(err);
            alert(err.message || 'Error when changing like');
        }
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Post not found</p>;

    function formatTime(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    const createdAt = formatTime(post.created_at);

    const avatar = `http://localhost:3000/${author?.profile_picture || 'default.png'}`;
    const username = `@${author?.login}`;

    const likes = post.likes_count || 0;    
    const dislikes = post.dislikes_count || 0;
    const rating = post.rating || 0;
    const commentsCount = post.commentsCount || 0;

    return (
        <div 
            className="post-detail bg-white tl" 
            style={{
                paddingTop: '6rem',
                paddingBottom: '3rem',
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
                <div className='post-detail-container'>
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '1.5rem'
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

                    {/* Автор */}
                    <div className="flex items-center" style={{ gap: '0.75rem' }}>
                        <img
                            src={avatar}
                            alt={username}
                            width={45}
                            height={45}
                            className="br-100"
                            style={{ objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => onRouteChange(`profile/${post.author_id}`)}
                        />
                        <div className='author-info-container'>
                            <span className="post-author-det" onClick={() => onRouteChange(`profile/${post.author_id}`)} style={{ cursor: 'pointer' }}>{username}</span>
                            <span className="middle-dot-det">&#8226;</span>
                            <span className="post-time-det">{createdAt}</span>
                        </div>
                    </div>
                </div> 
            </div>

            <div className='main-post-content' style={{marginRight: '2rem'}}>
                <h2 className='tl' style={{ marginTop: '1rem', marginBottom: '1rem' }}>{post.title}</h2>

                <div className='tl' style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                    {post.content && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
                </div>

                <div className='categories' style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    {(post.categories && post.categories.length > 0 ? post.categories : [{ title: 'no-category', id: 'none' }]).map(cat => (
                        <span key={cat.id} style={{ fontSize: '.8rem', padding: '.2rem .5rem', border: '1px solid #ddd', borderRadius: '12px' }}>
                            {cat.title}
                        </span>
                    ))}
                </div>
            </div>

            <div
                className="post-stats"
                style={{
                    marginTop: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    fontSize: '.9rem',
                    color: '#666',
                    marginLeft: '5.5rem',
                    marginRight: '2rem'
                }}
            >
                <div 
                    className="stat-item" 
                    title="Likes"
                    onClick={() => handleLike('like')}
                    style={{
                        color: userLikeType === 'like' ? '#28a745' : '#666',
                        cursor: isSignedIn ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.3rem',
                        transition: 'color .2s'
                    }}
                >
                    <i className="fa-solid fa-thumbs-up" style={{ marginRight: '.3rem', fontSize: '1.3rem' }}></i>
                    <span style={{ fontSize: '1rem' }}>{likes}</span>
                </div>

                <div 
                    className="stat-item" 
                    title="Dislikes"
                    onClick={() => handleLike('dislike')}
                    style={{
                        color: userLikeType === 'dislike' ? '#dc3545' : '#666',
                        cursor: isSignedIn ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.3rem',
                        transition: 'color .2s'
                    }}
                >
                    <i className="fa-solid fa-thumbs-down" style={{ marginRight: '.3rem', fontSize: '1.3rem' }}></i>
                    <span style={{ fontSize: '1rem' }}>{dislikes}</span>
                </div>

                <div className="stat-item" title="Rating">
                    <i className="fa-solid fa-star" style={{ color: '#f5c518', marginRight: '.3rem', fontSize: '1.3rem' }}></i>
                    <span style={{ fontSize: '1rem' }}>{rating}</span>
                </div>

                <div className="stat-item" title="Comments">
                    <i className="fa-solid fa-comment" style={{ color: '#007bff', marginRight: '.3rem', fontSize: '1.3rem' }}></i>
                    <span style={{ fontSize: '1rem' }}>{commentsCount}</span>
                </div>
            </div>
            

            <div
                style={{
                    marginLeft: '5.5rem',
                    marginTop: '3rem',
                    marginRight: '2rem'
                }}
            >
                <CommentsSection postId={postId} isSignedIn={isSignedIn} onRouteChange={onRouteChange} userId={userId} />
            </div>
        </div>
    );
}

export default PostDetail;