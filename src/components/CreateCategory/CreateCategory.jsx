import { useState } from "react"
import './CreateCategory.css'

function CreateCategory({ onRouteChange }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmitCategory(e) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        console.log(title.trim());
        console.log(description.trim());

        

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ 
                    title: title.trim(), 
                    description: description.trim() 
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to create category");
            }

            console.log(res.json());
            

            setTitle("");
            setDescription("");

            // через секунду редирект на все категории
            setTimeout(() => {
                onRouteChange("all-categories");
            }, 1000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function onTitleChange(event) {
        setTitle(event.target.value);
    }

    function onDescriptionChange(event) {
        setDescription(event.target.value);
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
                <div className='create-category-container'>
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
                            onRouteChange('all-categories'); 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                </div> 

                <h2 style={{ marginTop: '2rem' }}>Create New Category</h2>
            </div>
            
            {error && <p className="red">{error}</p>}

            <div className="create-post-content">
                <form onSubmit={handleSubmitCategory}>
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
                        Description <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                        // placeholder="Content"
                        value={description}
                        onChange={onDescriptionChange}
                        className="db w-100 pa2 mb2 outline-0"
                        rows="3"
                        style={{
                            marginBottom: '1.3rem',
                            padding: '1rem',
                            border: '1px solid #acacacff',
                            borderRadius: '5px',
                            backgroundColor: '#fff',                          
                        }}
                    ></textarea>

                    <div className="tl">
                        <button
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit"
                        >        
                            <span>Create</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategory;
