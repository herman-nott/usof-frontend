import { useState } from 'react'

function PasswordReset({ token }) {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    function onPasswordChange(event) {
        setPassword(event.target.value);
    }

    function onPasswordConfirmationChange(event) {
        setPasswordConfirmation(event.target.value);
    }

    function onSubmitChangePassword() {
        setError('');
        setMessage('');

        fetch(`${import.meta.env.VITE_API_URL}/auth/password-reset/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                new_password: password,
                new_password_confirmation: passwordConfirmation
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setMessage('Password has been reset successfully');
            }
        })
        .catch(() => setError('Server error. Please try again later.'));
    }

    return (
        <div className='center-container mt6'>
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Reset Password</legend>
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
                        </fieldset>
                        <div className="">
                            <input 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                id="register-bnt" 
                                type="submit" 
                                value="Change Password" 
                                onClick={onSubmitChangePassword} 
                            />
                        </div>
                    </div>
                </main>
            </article>

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

export default PasswordReset;