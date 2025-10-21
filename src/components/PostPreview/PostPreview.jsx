import { useEffect, useState } from 'react'
import './PostPreview.css'

function PostPreview({ post, onOpen, onRouteChange, userId, fetchPosts }) {
    const [author, setAuthor] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    function stripHtml(html) {
        if (!html) return '';
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    }

    function excerpt(text, n = 200) {
        const s = stripHtml(text).trim();
        if (s.length <= n) return s;

        let cut = s.slice(0, n);

        const lastSpace = cut.lastIndexOf(' ');

        if (lastSpace > 0) {
            cut = cut.slice(0, lastSpace);
        }

        return cut.trim() + '...';
    }

    useEffect(() => {
        if (!post.author_id) return;
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
    }, [post.author_id]);

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

    async function handleDelete() {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                alert('Post successfully deleted');
                // onRouteChange('home');

                await fetchPosts();
            } else {
                alert('Error when deleting post');
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    }

    const createdAt = formatTime(post.created_at);
    const avatar = `http://localhost:3000/${author?.profile_picture}?t=${Date.now()}`;
    const username = `@${author?.login}`;

    const likes = post.likes_count || 0;    
    const dislikes = post.dislikes_count || 0;
    const rating = post.rating || 0;
    const commentsCount = post.commentsCount || 0;
    
    return (
        <div 
            className="bg-white pointer custom-hover tl pa3 post-preview"
            style={{
                margin: '0 2rem',
                padding: '1rem 1rem',
                borderBottom: '1px solid #ddd',
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                {post.status === 'inactive' && (
                    <div className="post-status-badge">Inactive</div>
                )}

                {userId === post.author_id && (
                    <div style={{ position: 'relative' }}>
                        <i
                            className="fa-solid fa-ellipsis-vertical"
                            style={{
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '.3rem',
                            }}
                            onClick={() => setShowMenu(!showMenu)}
                        ></i>

                        {showMenu && (
                            <div
                                className="post-menu"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '1.5rem',
                                    background: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    zIndex: 100,
                                    minWidth: '150px'
                                }}
                            >
                                <div
                                    className="menu-item"
                                    onClick={() => onRouteChange(`editpost/${post.id}`)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <i className="fa-solid fa-pen" style={{ marginRight: '6px' }}></i> Edit
                                </div>
                                <div
                                    className="menu-item"
                                    onClick={handleDelete}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        color: '#c00'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fbeaea'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i> Delete
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            

            <div className="post-header pointer">
                <img src={avatar} alt={username} className="post-avatar" onClick={() => onRouteChange(`profile/${post.author_id}`)} style={{ cursor: 'pointer' }} />
                <div className="post-meta">
                    <span className="post-author-preview" onClick={() => onRouteChange(`profile/${post.author_id}`)} style={{ cursor: 'pointer' }}>{username}</span>
                    <span className="middle-dot">&#8226;</span>
                    <span className="post-time">{createdAt}</span>
                </div>
            </div>

            <a
                href={`/posts/${post.id}`}
                onClick={(e) => { e.preventDefault(); onOpen(post.id); }}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{excerpt(post.content)}</p>
            </a>

            <div style={{ marginTop: '.5rem', marginBottom: '.5rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                {(post.categories && post.categories.length > 0 ? post.categories : [{ title: 'no-category', id: 'none' }]).map(cat => (
                    <span 
                        key={cat.id} 
                        style={{ fontSize: '.8rem', padding: '.2rem .5rem', border: '1px solid #ddd', borderRadius: '12px' }}
                        onClick={() => onRouteChange(`category:${cat.id}`)}
                    >
                        {cat.title}
                    </span>
                ))}
            </div>

            <div
                className="post-stats"
                style={{
                    marginTop: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    fontSize: '.9rem',
                    color: '#666'
                }}
            >
                <div className="stat-item" title="Likes">
                    <i className="fa-solid fa-thumbs-up" style={{ color: '#28a745', marginRight: '.3rem' }}></i>
                    {likes}
                </div>

                <div className="stat-item" title="Dislikes">
                    <i className="fa-solid fa-thumbs-down" style={{ color: '#dc3545', marginRight: '.3rem' }}></i>
                    {dislikes}
                </div>

                <div className="stat-item" title="Rating">
                    <i className="fa-solid fa-star" style={{ color: '#f5c518', marginRight: '.3rem' }}></i>
                    {rating}
                </div>

                <div className="stat-item" title="Comments">
                    <i className="fa-solid fa-comment" style={{ color: '#007bff', marginRight: '.3rem' }}></i>
                    {commentsCount}
                </div>
            </div>
        </div>
    );
}

export default PostPreview;