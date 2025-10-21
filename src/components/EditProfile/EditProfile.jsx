import { useState, useEffect } from "react";
import "./EditProfile.css";

function EditProfile({ currentUserId, onRouteChange,  }) {
    const [user, setUser] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [login, setlogin] = useState('');
    // const [email, setEmail] = useState('');

     function onLoginChange(event) {
        setlogin(event.target.value);
    }

    // function onEmailChange(event) {
    //     setEmail(event.target.value);
    // }

    function onFirstnameChange(event) {
        setFirstname(event.target.value);
    }

    function onLastnameChange(event) {
        setLastname(event.target.value);
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUserId}`, { credentials: "include" });
                if (!res.ok) throw new Error("Error loading user data");
                const data = await res.json();
                setUser(data);                

                setFirstname(data.full_name.split(' ')[0]);
                setLastname(data.full_name.split(' ')[1]);
                setlogin(data.login);
                // setEmail(data.email);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [currentUserId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    login: login,
                    // email: email,
                    full_name: `${firstname} ${lastname}`
                }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                window.history.pushState({}, "", `/profile/${currentUserId}`);
                onRouteChange(`profile:${currentUserId}`);
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleAvatarChange(e) {
        const file = e.target.files[0];        
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to upload avatar");

            const updated = await res.json();
            setUser(prev => ({ ...prev, profile_picture: updated.profile_picture }));
        } catch (err) {
            setError(err.message);
        }
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
                
                Loading...
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
                
                User not found
            </div>
        );
    }

    const avatarUrl = preview
        ? preview
        : user.profile_picture
        ? `http://localhost:3000/${user.profile_picture}`
        : "http://localhost:3000/uploads/avatars/default.png";        

    return (
        <div 
            className="edit-profile"
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

                <div className="edit-profile-card">
                    <h2>Edit Profile</h2>

                    {error && <div className="alert error">{error}</div>}
                    {success && <div className="alert success">{success}</div>}

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                <img src={avatarUrl} alt="Avatar" className="avatar-preview" />
                                <label htmlFor="avatar-upload" className="edit-icon">
                                    <i className="fa-solid fa-pen"></i>
                                </label>
                                <input 
                                    type="file" 
                                    id="avatar-upload" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange} 
                                    hidden 
                                />
                            </div>
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="first-name">First name</label>
                            <input 
                                className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="first-name" 
                                id="first-name" 
                                value={firstname}
                                onChange={onFirstnameChange}
                            />
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="first-name">Last name</label>
                            <input 
                                className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="last-name" 
                                id="last-name" 
                                value={lastname}
                                onChange={onLastnameChange}
                            />
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="first-name">Login</label>
                            <input 
                                className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="login" 
                                id="login" 
                                value={login}
                                onChange={onLoginChange}
                            />
                        </div>

                        {/* <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="first-name">Email</label>
                            <input 
                                className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email}
                                onChange={onEmailChange}
                            />
                        </div> */}

                        <div className="form-actions">
                            <button type="submit" className="save-btn b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">Save Changes</button>
                            <button
                                type="button"
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                onClick={() => {
                                    window.history.pushState({}, "", `/profile/${currentUserId}`);
                                    onRouteChange(`profile:${currentUserId}`);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            
        </div>
    );
}

export default EditProfile;
