import { useState, useEffect } from "react"
import './CreatePost.css'

function CreatePost({ onRouteChange, userId }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategotyInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allcategories, setAllCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setAllCategories(data);
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        }

        fetchCategories();
    }, []);

    function onTitleChange(event) {
        setTitle(event.target.value);
    }

    function onContentChange(event) {
        setContent(event.target.value);
    }

    function handlecategoryInputChange(e) {
        const value = e.target.value;
        setCategotyInput(value);

        if (value.length > 0) {
            const filtered = allcategories.filter(tag =>
                tag.title.toLowerCase().includes(value.toLowerCase()) &&
                !categories.includes(tag)
            );
            setSuggestions(filtered.slice(0, 5)); // максимум 5 подсказок
        } else {
            setSuggestions([]);
        }
    }

    function handleAddTag(cat) {
        if (categories.length >= 5) return;
        setCategories([...categories, cat]);
        setCategotyInput('');
        setSuggestions([]);
    }

    function handleRemoveTag(catToRemove) {
        setCategories(categories.filter(cat => cat.id !== catToRemove.id));
    }

    async function handleSubmitPost(e) {
        e.preventDefault();
        try {
            console.log(categories);
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    title, 
                    content, 
                    categories: categories.map(c => c.id), 
                    user_id: userId,
                    status: isActive ? 'active' : 'inactive'
                })
            });

            if (res.ok) {
                onRouteChange('home');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create post');
            }
        } catch (err) {
            console.error(err);
            setError('Network error');
        }
    }

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
            <div 
                className="flex"
                style={{ 
                    gap: '1rem',
                    marginRight: '2rem'
                }}
            >
                <div className='create-post-container'>
                    {/* Кнопка "назад" */}
                    <div 
                        className="pointer flex items-center justify-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background 0.2s',
                            marginRight: '0.5rem'
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

                <h2>Create New Post</h2>
            </div>
            
            {error && <p className="red">{error}</p>}

            <div className="create-post-content">
                <form onSubmit={handleSubmitPost}>
                    <label className="db mb1 tl">
                        Title <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        // placeholder="Title"
                        value={title}
                        onChange={onTitleChange}
                        className="db w-100 pa1 outline-0"
                        style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            border: '1px solid #acacacff',
                            borderRadius: '5px',
                            backgroundColor: '#fff',                          
                        }}
                    />

                    <label className="db mb1 tl">
                        Content <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                        // placeholder="Content"
                        value={content}
                        onChange={onContentChange}
                        className="db w-100 pa2 mb2 outline-0"
                        rows="6"
                        style={{
                            marginBottom: '1.3rem',
                            padding: '1rem',
                            border: '1px solid #acacacff',
                            borderRadius: '5px',
                            backgroundColor: '#fff',                          
                        }}
                    ></textarea>

                    <label className="db mb1 tl">
                        Categories <span style={{ color: 'red' }}>*</span>
                    </label>
                    <p className="gray f6 tl" style={{ marginTop: '-0.05rem', marginBottom: '0rem' }}>
                        Add up to 5 categories to describe what your question is about. Start typing to see suggestions.
                    </p>

                    <div className="tag-input-container relative mb4">
                        <div className="selected-categories flex flex-wrap mb2">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="bg-light-gray br2 pa2 mr2 mt2 mb2 flex items-center"
                                    style={{ gap: '5px' }}
                                >
                                    <span>{cat.title}</span>
                                    <i
                                        className="fa-solid fa-xmark pointer"
                                        onClick={() => handleRemoveTag(cat)}
                                    ></i>
                                </div>
                            ))}
                        </div>

                        <input
                            type="text"
                            value={categoryInput}
                            onChange={handlecategoryInputChange}
                            placeholder="Start typing to add categories..."
                            className="db w-100 pa2 mb2 outline-0"
                            style={{
                                border: '1px solid #acacacff',
                                borderRadius: '5px',
                                backgroundColor: '#fff'
                            }}
                        />

                        {suggestions.length > 0 && (
                            <div
                                className="suggestions-list"
                                style={{
                                    marginTop: '-0.5rem',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '.5rem',
                                    alignItems: 'flex-start'
                                }}
                            >
                                {suggestions.map(cat => (
                                    <div
                                        key={cat.id}
                                        className="category-suggestion pointer"
                                        onClick={() => handleAddTag(cat)}
                                        style={{
                                            fontSize: '.9rem',
                                            padding: '.6rem .8rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            backgroundColor: '#fafafa',
                                            width: '100%',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                                    >
                                        {cat.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb3 flex items-center" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <label htmlFor="active-switch" className="tl" style={{ marginRight: '1rem' }}>
                            Active status:
                        </label>

                        <div 
                            onClick={() => setIsActive(!isActive)}
                            className="pointer"
                            style={{
                                width: '50px',
                                height: '25px',
                                backgroundColor: isActive ? '#4caf50' : '#ccc',
                                borderRadius: '25px',
                                position: 'relative',
                                transition: 'background 0.3s',
                            }}
                        >
                            <div
                                style={{
                                    width: '21px',
                                    height: '21px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    position: 'absolute',
                                    top: '2px',
                                    left: isActive ? '26px' : '2px',
                                    transition: 'left 0.3s',
                                }}
                            ></div>
                        </div>

                        <span style={{ fontSize: '.9rem', color: isActive ? '#4caf50' : '#777' }}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>


                    <div className="tl">
                        <button
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit"
                        >        
                            <span>Post</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
