import { useEffect, useState } from 'react'
import './RightSidebar.css'

function RightSidebar({ onRouteChange }) {
    const [topPosts, setTopPosts] = useState([]);

     useEffect(() => {
        async function fetchTopPosts() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
                const postsData = await res.json();
                const posts = postsData.posts;

                const top3 = posts.sort((a, b) => b.rating - a.rating).slice(0, 3);

                const postsWithAuthors = await Promise.all(
                top3.map(async (post) => {
                    try {
                        const authorRes = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
                        const authorData = await authorRes.json();
                        return { ...post, authorName: authorData.login || 'unknown' };
                    } catch {
                        return { ...post, authorName: 'unknown' };
                    }
                    })
                );

                setTopPosts(postsWithAuthors);
            } catch (err) {
                console.error("Error loading posts:", err);
            }
        }
        fetchTopPosts();
    }, []);

    return (
        <div 
            className="bl b--light-gray bg-white w-25 vh-100 fixed left-0 top-0 overflow-auto right-sidebar" 
            style={{
                paddingTop: '6rem',
                marginLeft: '75%',
                minHeight: '100vh',
                overflowY: 'auto',
                // background: 'red'
            }}
        >
            <h2 className="hashtag">#top_3_rated_posts</h2>

            <hr className="w-90 center mb3" style={{ marginTop: '-0.5rem', borderColor: '#ffffff' }} />

            {topPosts.length > 0 ? (
                <div className="top-posts-list">
                    {topPosts.map((post, index) => (
                        <div 
                            key={post.id} 
                            className="top-post"
                            data-rank={`#${index + 1}`}
                            onClick={() => onRouteChange(`post:${post.id}`)}
                        >
                            <h4 className="post-title-rightsidebar">{post.title}</h4>
                            <p className="post-author-rightsidebar">Author: @{post.authorName}</p>
                            <p className="post-rating-rightsidebar">Rating: {post.rating}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default RightSidebar;