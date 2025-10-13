import { useState, useEffect } from "react";

function CommentsSection({ postId, isSignedIn, onRouteChange, userId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    async function loadComments() {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`);
            const data = await res.json();
            const comments = Array.isArray(data.comments) ? data.comments : [];

            const withDetails = await Promise.all(
                comments.map(async (c) => {
                    const userRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${c.author_id}`);
                    const userData = await userRes.json();

                    const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/comments/${c.id}/like`);
                    const likeData = await likeRes.json();                    

                    const likesArray = Array.isArray(likeData) ? likeData : [];
                    const likes_count = likesArray.filter(l => l.type === 'like').length;
                    const dislikes_count = likesArray.filter(l => l.type === 'dislike').length;

                    let userLikeType = null;
                    if (isSignedIn && userId) {
                        const myLike = likesArray.find(like => like.author_id === userId);
                        if (myLike) {
                            userLikeType = myLike.type;
                        }
                    }

                    return { 
                        ...c, 
                        author: userData, 
                        likes: likes_count,
                        dislikes: dislikes_count,
                        userLikeType
                    };
                })
            );
            setComments(withDetails);
        } catch (err) {
            console.error('Error loading comments:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleLike(commentId, type) {
        if (!isSignedIn) return onRouteChange('login');

        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        try {
            if (comment.userLikeType === type) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}/like`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!res.ok) throw new Error('Error deleting like');
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}/like`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ type })
                });
                if (!res.ok) throw new Error('Error sending like');
            }

            await loadComments();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!isSignedIn) return onRouteChange('login');

        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ content: commentText })
            });
            if (!res.ok) throw new Error('Error sending');
            setCommentText('');
            await loadComments();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

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

    return (
        <div style={{ marginTop: '3rem' }}>
            <h3>Comments</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '.5rem' }}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={isSignedIn ? "Write a comment..." : "Login to comment"}
                    rows={2}
                    style={{
                        flex: 1,
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '.5rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={submitting || !isSignedIn}
                    style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        cursor: isSignedIn ? 'pointer' : 'not-allowed'
                    }}
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </form>

            {loading && <p>Loading comments...</p>}
            {!loading && comments.length === 0 && <p>No comments yet</p>}

            <div style={{ marginTop: '1rem' }}>
                {comments.map((c) => {
                    const avatar = `http://localhost:3000/${c.author?.profile_picture || 'default.png'}`;
                    const username = `@${c.author?.login || 'unknown'}`;
                    const createdAt = formatTime(c.created_at);
                    return (
                        <div key={c.id} style={{
                            marginBottom: '1.2rem',
                            padding: '1rem',
                            border: '1px solid #eee',
                            borderRadius: '10px',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                                <img src={avatar} width={40} height={40} style={{ borderRadius: '50%', cursor: 'pointer' }} onClick={() => onRouteChange(`profile/${c.author_id}`)} />
                                <div>
                                    <div style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => onRouteChange(`profile/${c.author_id}`)}>{username}</div>
                                    <div style={{ fontSize: '.8rem', color: '#777' }}>{createdAt}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '.5rem', fontSize: '.95rem' }}>{c.content}</div>

                            <div
                                style={{
                                    marginTop: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.2rem',
                                    fontSize: '.9rem',
                                    color: '#666',
                                }}
                            >
                                <div
                                    className="stat-item"
                                    title="Likes"
                                    onClick={() => handleLike(c.id, 'like')}
                                    style={{
                                        color: c.userLikeType === 'like' ? '#28a745' : '#666',
                                        cursor: isSignedIn ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '.3rem',
                                        transition: 'color .2s'
                                    }}
                                >
                                    <i className="fa-solid fa-thumbs-up" style={{ fontSize: '1rem' }}></i>
                                    <span>{c.likes}</span>
                                </div>

                                <div
                                    className="stat-item"
                                    title="Dislikes"
                                    onClick={() => handleLike(c.id, 'dislike')}
                                    style={{
                                        color: c.userLikeType === 'dislike' ? '#dc3545' : '#666',
                                        cursor: isSignedIn ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '.3rem',
                                        transition: 'color .2s'
                                    }}
                                >
                                    <i className="fa-solid fa-thumbs-down" style={{ fontSize: '1rem' }}></i>
                                    <span>{c.dislikes}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CommentsSection;
