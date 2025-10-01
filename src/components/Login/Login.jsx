import { useState } from 'react'

function Login({ onRouteChange }) {
    const [logInEmailorUsername, setLogInEmailorUsername] = useState('');
    const [logInPassword, setLogInPassword] = useState('');
    const [error, setError] = useState(false);

    function onEmailOrLoginChange(event) {
        setLogInEmailorUsername(event.target.value);
    }

    function onPasswordChange(event) {
        setLogInPassword(event.target.value);
    }

    function onSubmitLogIn() {
        fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailOrLogin: logInEmailorUsername,
                password: logInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    setError('');
                    onRouteChange('home');
                } else {
                    setError('Incorrect login or email or password');
                }
            })
            .catch(() => setError('Server error. Please try again later.'));
    }

    return (
        <div className='center-container'>
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Log In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-or-login">Email or Login</label>
                                <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="text" name="login" id="login" required onChange={onEmailOrLoginChange} />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" required onChange={onPasswordChange} />
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Log In" onClick={onSubmitLogIn} />
                        </div>
                        <div className="lh-copy mt3">
                            <p className="f6 link dim black db pointer" onClick={() => onRouteChange('register')}>Register</p>
                        </div>
                    </div>
                </main>
            </article>

            {error && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                    &#10006; {error}
                </p>
            )}
        </div>
    );
}

export default Login;