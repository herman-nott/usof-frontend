import { useState } from 'react'
import './Register.css'

function Register({ onRouteChange }) {
    const [login, setlogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [error, setError] = useState('');
    // const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function onLoginChange(event) {
        setlogin(event.target.value);
    }

    function onEmailChange(event) {
        setEmail(event.target.value);
    }

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    function onPasswordConfirmationChange(event) {
        setPasswordConfirmation(event.target.value);
    }

    function onFirstnameChange(event) {
        setFirstname(event.target.value);
    }

    function onLastnameChange(event) {
        setLastname(event.target.value);
    }

    function onSubmitRegister() {
        setError('');
        // setIsLoading(true);
        const loaderTimeout = setTimeout(() => setIsLoading(true), 150);

        fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                login: login,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                firstname: firstname,
                lastname: lastname,
            })
        })
            .then(response => response.json())
            .then(data => {
                clearTimeout(loaderTimeout);

                if (data.error) {
                    setError(data.error); // ошибка от сервера
                } else {
                    setError('');
                    // setMessage(`Password reset email sent to ${email}`);

                    onRouteChange('verify-email');
                }                
            })
            .catch(() => {
                clearTimeout(loaderTimeout);
                setError('Server error. Please try again later')
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className='center-container mt6'>
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>

                            <div className="flex-container">
                                <div className="flex-item">
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="login">Login <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input 
                                            className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                            type="text" 
                                            name="login" 
                                            id="login" 
                                            required 
                                            onChange={onLoginChange}
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
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="first-name">First name</label>
                                        <input 
                                            className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                            type="text" 
                                            name="first-name" 
                                            id="first-name" 
                                            onChange={onFirstnameChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex-item">
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input 
                                            className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            required 
                                            onChange={onEmailChange}
                                        />
                                    </div>
                                    <div className="mv3">
                                        <label className="db fw6 lh-copy f6" htmlFor="password-confirmation">Password Confirmation <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input 
                                            className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                                            type="password" 
                                            name="password-confirmation" 
                                            id="password-confirmation" 
                                            required 
                                            onChange={onPasswordConfirmationChange}
                                        />
                                    </div>
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="last-name">Last name</label>
                                        <input 
                                            className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
                                            type="text" 
                                            name="last-name" 
                                            id="last-name" 
                                            onChange={onLastnameChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="">
                            <input 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                id="register-bnt" 
                                type="submit" 
                                value="Register" 
                                onClick={onSubmitRegister} 
                            />
                        </div>
                    </div>
                </main>
            </article>
            
            {isLoading && !error && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
            

            {error && (
                <p style={{ color: 'red', fontWeight: 'bold' }}> 
                    &#10006; {error}
                </p>
            )}

            {/* {message && (
                <p style={{ color: 'green', fontWeight: 'bold' }}> 
                    &#10004; {message}
                </p>
            )} */}
            
            <style jsx>{`
                .flex-container {
                    display: flex;
                    gap: 2rem;
                }
                .flex-item {
                    flex: 1;
                }
                #register-bnt {
                    margin-top: 20px;
                }
                @media (max-width: 768px) {
                    .flex-container {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
}

export default Register;