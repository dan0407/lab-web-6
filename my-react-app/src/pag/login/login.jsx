import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfi'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            navigate('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión: ' + err.message);
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div>
            <h2>Inicio de Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo Electrónico:</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>Iniciar Sesión</button>
            </form>
            <button onClick={handleSignupRedirect} style={{ marginTop: '10px' }}>
                Registrarse
            </button>
        </div>
    );
};

export default Login;