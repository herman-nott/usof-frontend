function Register({ onRouteChange }) {
    return (
        <div className='center-container'>
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>

                            <div className="flex-container">
                                <div className="flex-item">
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="login">Login <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="text" name="login" id="login" required />
                                    </div>
                                    <div className="mv3">
                                        <label className="db fw6 lh-copy f6" htmlFor="password">Password <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" required />
                                    </div>
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="first-name">First name</label>
                                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="text" name="first-name" id="first-name" />
                                    </div>
                                </div>

                                <div className="flex-item">
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="email" name="email" id="email" required />
                                    </div>
                                    <div className="mv3">
                                        <label className="db fw6 lh-copy f6" htmlFor="password-confirmation">Password Confirmation <span style={{color: '#ff0000ff'}}>*</span></label>
                                        <input className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="password" name="password-confirmation" id="password-confirmation" required />
                                    </div>
                                    <div className="mt3">
                                        <label className="db fw6 lh-copy f6" htmlFor="last-name">Last name</label>
                                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="text" name="last-name" id="last-name" />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" id="register-bnt" type="submit" value="Register" onClick={() => onRouteChange('home')} />
                        </div>
                    </div>
                </main>
            </article>
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