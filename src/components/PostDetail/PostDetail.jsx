import{ useEffect, useState } from 'react';
import './PostDetail.css'

function PostDetail({ postId, onRouteChange, isSignedIn }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [author, setAuthor] = useState(null);

    // const [comments, setComments] = useState([]);
    // const [loadingComments, setLoadingComments] = useState(false);
    // const [commentText, setCommentText] = useState('');
    // const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
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

                const fullPost = {
                    ...data,
                    categories: catData.categories || [],
                    commentsCount,
                    likes_count,
                    dislikes_count,
                    rating,
                };

                console.log(fullPost);
                    
                if (!cancelled) setPost(fullPost);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; }
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

    // useEffect(() => {
    //     loadComments();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [postId]);

    // async function loadComments() {
    //     setLoadingComments(true);
    //     try {
    //     const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
    //     if (!res.ok) throw new Error('Ошибка комментариев: ' + res.status);
    //     const data = await res.json();
    //     setComments(Array.isArray(data) ? data : (data.comments || []));
    //     } catch (err) {
    //     console.error(err);
    //     } finally {
    //     setLoadingComments(false);
    //     }
    // }

    // async function handleCommentSubmit(e) {
    //     e.preventDefault();
    //     if (!commentText.trim()) return;
    //     if (!isSignedIn) {
    //     // Попросим пользователя залогиниться
    //     onRouteChange('login');
    //     return;
    //     }
    //     setSubmitting(true);
    //     try {
    //     const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json'
    //         },
    //         credentials: 'include', // важно, если сервер использует сессии
    //         body: JSON.stringify({ content: commentText })
    //     });
    //     if (res.status === 401) {
    //         onRouteChange('login');
    //         return;
    //     }
    //     if (!res.ok) throw new Error('Ошибка при отправке комментария: ' + res.status);
    //     setCommentText('');
    //     await loadComments();
    //     } catch (err) {
    //     console.error(err);
    //     alert(err.message || 'Ошибка при отправке комментария');
    //     } finally {
    //     setSubmitting(false);
    //     }
    // }

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

    const avatar = author?.avatar_url || 'http://localhost:3000/uploads/avatars/default.png';
    const username = `@${author?.login}`;

    const likes = post.likes_count || 0;    
    const dislikes = post.dislikes_count || 0;
    const rating = post.rating || 0;
    const commentsCount = post.commentsCount || 0;

    return (
        <div 
            className="post-detail bg-white" 
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
                style={{ gap: '1rem' }}
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
                            style={{ objectFit: 'cover' }}
                        />
                        <div className='author-info-container'>
                            <span className="post-author-det">{username}</span>
                            <span className="middle-dot-det">&#8226;</span>
                            <span className="post-time-det">{createdAt}</span>
                        </div>
                    </div>
                </div> 
            </div>

            <div className='main-post-content'>
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
                    marginLeft: '5.5rem'
                }}
            >
                <div className="stat-item" title="Лайки">
                    <i className="fa-solid fa-thumbs-up" style={{ color: '#28a745', marginRight: '.3rem' }}></i>
                    {likes}
                </div>

                <div className="stat-item" title="Дизлайки">
                    <i className="fa-solid fa-thumbs-down" style={{ color: '#dc3545', marginRight: '.3rem' }}></i>
                    {dislikes}
                </div>

                <div className="stat-item" title="Рейтинг">
                    <i className="fa-solid fa-star" style={{ color: '#f5c518', marginRight: '.3rem' }}></i>
                    {rating}
                </div>

                <div className="stat-item" title="Комментарии">
                    <i className="fa-solid fa-comment" style={{ color: '#007bff', marginRight: '.3rem' }}></i>
                    {commentsCount}
                </div>
            </div>
            

            {/* <section>
                <h3>Комментарии</h3>
                {loadingComments && <p>Загрузка комментариев...</p>}
                {!loadingComments && comments.length === 0 && <p>Комментариев пока нет.</p>}
                <ul>
                {comments.map(c => (
                    <li key={c.id} style={{ marginBottom: '.8rem' }}>
                    <div style={{ fontSize: '.9rem' }}>{c.content}</div>
                    <div style={{ fontSize: '.8rem', color: '#666' }}>{c.author?.username || c.author_name || ''} — {c.created_at ? new Date(c.created_at).toLocaleString() : ''}</div>
                    </li>
                ))}
                </ul>

                <form onSubmit={handleCommentSubmit} style={{ marginTop: '1rem' }}>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={4} style={{ width: '100%' }} placeholder={isSignedIn ? "Напишите комментарий..." : "Войдите, чтобы оставить комментарий"} />
                <div style={{ marginTop: '.5rem' }}>
                    <button type="submit" disabled={submitting}>{submitting ? 'Отправка...' : 'Отправить комментарий'}</button>
                </div>
                </form>
            </section> */}


        </div>
    );
}

export default PostDetail;