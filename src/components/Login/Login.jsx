import { useState, useEffect, useRef } from 'react'
import './Login.css'

function Login({ onRouteChange, onLoginSuccess }) {
    const [logInEmailorUsername, setLogInEmailorUsername] = useState('');
    const [logInPassword, setLogInPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    function onEmailOrLoginChange(event) {
        setLogInEmailorUsername(event.target.value);
    }

    function onPasswordChange(event) {
        setLogInPassword(event.target.value);
    }

    function onResetEmailChange(event) {
        setResetEmail(event.target.value);
    }

    function onSubmitLogIn() {
        fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                emailOrLogin: logInEmailorUsername,
                password: logInPassword
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) {
                setError('');
                onLoginSuccess(user.id);
                onRouteChange('home');
            } else {
                setError('Incorrect login or email or password');
            }
        })
        .catch(() => setError('Server error. Please try again later.'));
    }

    function onSubmitPasswordReset() {
        setError('');
        setMessage('');
        if (!resetEmail) {
            setError('Please enter your email');
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/auth/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: resetEmail 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setMessage('Password reset email sent');
            }
        })
        .catch(() => setError('Server error. Please try again later.'));
    }

    const loginRef = useRef(null);
    const resetRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.height = isResetting 
            ? `${resetRef.current.offsetHeight}px`
            : `${loginRef.current.offsetHeight}px`;
        }
    }, [isResetting]);


    return (
        <div className='center-container login-container'>
            <div className={`forms-wrapper ${isResetting ? 'resetting' : ''}`}>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card login-form" ref={loginRef}>
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Log In</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-or-login">Email or Login <span style={{color: '#ff0000ff'}}>*</span></label>
                                    <input 
                                        className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                        type="text" 
                                        name="login" 
                                        id="login" 
                                        required 
                                        onChange={onEmailOrLoginChange} 
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password <span style={{color: '#ff0000ff'}}>*</span></label>
                                    <input 
                                        className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        required 
                                        onChange={onPasswordChange} 
                                    />
                                </div>
                            </fieldset>
                            <div className="">
                                <input 
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                    type="submit" 
                                    value="Log In" 
                                    onClick={onSubmitLogIn} 
                                />
                            </div>
                            <div className="lh-copy mt3">
                                <p className="f6 link dim black db pointer underline" onClick={() => onRouteChange('register')}>Register</p>
                                <p className="f6 link dim black db pointer underline" onClick={() => {setIsResetting(true); setError(''); setMessage('');}}>Forgot your password?</p>
                            </div>
                        </div>
                    </main>
                </article>

                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card reset-form" ref={loginRef}>
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="password_reset" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Reset Password</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="reset-email">Email</label>
                                    <input 
                                        className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                        type="email" 
                                        name="reset-email" 
                                        id="reset-email" 
                                        required 
                                        onChange={onResetEmailChange} 
                                    />
                                </div>
                            </fieldset>
                            <div className="">
                                <input 
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mt3" 
                                    type="submit" 
                                    value="Send Reset Link" 
                                    onClick={onSubmitPasswordReset} 
                                />
                                <p className="f6 link dim black db pointer underline mt3" onClick={() => {setIsResetting(false); setError(''); setMessage('');}}>Back to Login</p>
                            </div>
                        </div>
                    </main>
                </article>    
            </div>
            
            {error && (
                <p style={{ color: 'red', fontWeight: 'bold' }}> 
                    &#10006; {error}
                </p>
            )}

            {message && (
                <p style={{ color: 'green', fontWeight: 'bold' }}> 
                    &#10004; {message}
                </p>
            )}
        </div>
    );
}

export default Login;