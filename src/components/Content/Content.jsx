import { useEffect, useState } from 'react'
import PostPreview from '../PostPreview/PostPreview'

function Content({ onRouteChange }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
                if (!res.ok) throw new Error('Error loading posts: ' + res.status);
                const data = await res.json();

                const items = Array.isArray(data) ? data : (data.posts || []);

                const postsWithCategories = await Promise.all(items.map(async post => {
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
    }, []);    

    function openPost(id) {
        // обновляем адресную строку и маршрут (чтобы можно было делиться ссылкой)
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

    const visible = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    return (
        <div 
            className="bg-white"
            style={{
                paddingTop: '6rem',
                paddingBottom: '6rem',
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

            <div className="post-list">
                {visible.map(post => (
                    <PostPreview key={post.id} post={post} onOpen={openPost} />
                ))}
            </div>

            {!loading && !error && visible.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Назад</button>
                    <span style={{ margin: '0 0.5rem' }}>Стр. {page} из {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Вперёд</button>
                </div>
            )}
        </div>
    );
}

export default Content;