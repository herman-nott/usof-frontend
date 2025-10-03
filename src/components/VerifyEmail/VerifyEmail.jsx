import { useState } from 'react'
import './VerifyEmail.css'

function VerifyEmail({ onRouteChange }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState('');

    function handleChange(event, index) {
        const value = event.target.value.replace(/[^0-9]/g, "");

        const newOtp = [...otp];

        if (value) {
            newOtp[index] = value[0];
            setOtp(newOtp);

            if (event.target.nextSibling) {
                event.target.nextSibling.focus();
            }
        } else {
            newOtp[index] = "";
            setOtp(newOtp);

            if (event.target.previousSibling) {
                event.target.previousSibling.focus();
            }
        }
    }

    function handlePaste(event) {
        event.preventDefault();
        const paste = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (!paste) return;

        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = paste[i] || "";
        }
        setOtp(newOtp);

        const lastIndex = Math.min(paste.length, 6) - 1;
        const inputElems = event.target.form.querySelectorAll('input');
        if (inputElems[lastIndex]) inputElems[lastIndex].focus();
    }

    function handleSubmit(event) {
        event.preventDefault();
        const code = otp.join("");

        fetch(`${import.meta.env.VITE_API_URL}/auth/register/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                code: code
            })
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.error) {
                setError(data.error);
            } else {
                setError('');
                onRouteChange('home');
            }
        })
    };

    return (
        <div className='center-container'>
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 center shadow-5 blur-card">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw7 ph0 mh0">Email Verification</legend>
                            <p className="f5 black db">Enter the 6-digit verification code that was sent to your email</p>

                            <div className="flex-container">
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="flex items-center justify-center gap-3">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(e, i)}
                                                onPaste={handlePaste}
                                                className="w3 h3 tc f2 ma2 br2 mt3 input-square"
                                            />
                                        ))}
                                    </div>
                                </form>
                            </div>
                        </fieldset>
                        <div className="">
                            <input 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mt3 mb3" 
                                id="register-bnt" 
                                type="submit" 
                                value="Verify Account" 
                                onClick={handleSubmit} 
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p className="f6 black db">
                                Didn't receive code? <span className="f6 link dim black pointer underline" >Resend</span>
                            </p>
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
    )
}

export default VerifyEmail;