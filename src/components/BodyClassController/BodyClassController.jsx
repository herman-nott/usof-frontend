import { useEffect } from 'react';

function BodyClassController({ route }) {
    useEffect(() => {
        const authRoutes = ['login', 'register', 'verify-email', 'password-reset'];

        if (authRoutes.includes(route)) {
            document.body.classList.add('auth-page');
        } else {
            document.body.classList.remove('auth-page');
        }
    }, [route]);

    return null;
}

export default BodyClassController;