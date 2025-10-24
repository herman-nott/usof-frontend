import { useEffect, useState } from 'react'
import PostPreview from '../PostPreview/PostPreview'
import './Content.css'

function Content({ onRouteChange, isSignedIn, userId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;

    const [sort, setSort] = useState('date');
    const [order, setOrder] = useState('desc');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    sort,
                    order,
                });

                console.log('Запрос:', `http://localhost:3000/api/posts?${params.toString()}`);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts?${params.toString()}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error loading posts: ' + res.status);
                const data = await res.json();                

                const items = Array.isArray(data) ? data : (data.posts || []);

                const activeItems = items.filter(post => post.status === 'active');

                const postsWithCategories = await Promise.all(activeItems.map(async post => {
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
                if (!cancelled) {
                    setPosts(postsWithCategories);
                    setTotalPages(data.totalPages)
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; }
    }, [isSignedIn, order, sort]);        

    async function fetchPosts() {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error loading posts: ' + res.status);
            const data = await res.json();                

            const items = Array.isArray(data) ? data : (data.posts || []);

            const activeItems = items.filter(post => post.status === 'active');

            const postsWithCategories = await Promise.all(activeItems.map(async post => {
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
            
            setPosts(postsWithCategories);
            setTotalPages(data.totalPages)
        
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function openPost(id) {
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

    const visible = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    return (
        <div 
            className="bg-white"
            style={{
                paddingTop: '6rem',
                paddingBottom: '2rem',
                marginLeft: '20%',
                marginRight: '25%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            {loading && !error && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && visible.length === 0 && <p>There are no posts</p>}

            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0 1rem',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '0.5rem',
                }}
            >
                {/* Сортировка */}
                <div>
                    <label style={{ marginRight: '0.5rem' }}>Sort by:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{ padding: '0.3rem', borderRadius: '4px' }}
                    >
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                        <option value="likes_count">Likes</option>
                    </select>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        style={{ padding: '0.3rem', marginLeft: '0.5rem', borderRadius: '4px' }}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            <div className="post-list">
                {visible.map(post => (
                    <PostPreview key={post.id} post={post} onOpen={openPost} onRouteChange={onRouteChange} userId={userId} fetchPosts={fetchPosts} />
                ))}
            </div>

            {!loading && !error && visible.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if(page !== 1) e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <span style={{ fontSize: '0.9rem', minWidth: '80px', textAlign: 'center' }}>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if(page !== totalPages) e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}

        </div>
    );
}

export default Content;