import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfi';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		username: '',
		birthdate: '',
	});

	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		const { email, password, username, birthdate } = formData;

		if (!email || !password || !username || !birthdate) {
			setError('Por favor, completa todos los campos.');
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			await setDoc(doc(db, 'users', userCredential.user.uid), {
				email,
				username,
				birthdate,
			});

			navigate('/dashboard');
		} catch (err) {
			setError('Error al registrarse: ' + err.message);
		}
	};

	const handleLoginRedirect = () => {
		navigate('/login');
	};

	return (
		<div className='auth-container'>
			<h2>Registro</h2>
			{error && <p>{error}</p>}
			<form className='auth-form' onSubmit={handleSubmit}>
				<label>Correo Electrónico:</label>
				<input type='email' name='email' value={formData.email} onChange={handleChange} required />
				<label>Contraseña:</label>
				<input type='password' name='password' value={formData.password} onChange={handleChange} required />
				<label>Nombre de Usuario:</label>
				<input type='text' name='username' value={formData.username} onChange={handleChange} required />
				<label>Fecha de Nacimiento:</label>
				<input type='date' name='birthdate' value={formData.birthdate} onChange={handleChange} required />
				<div className='auth-buttons'>
					<button type='submit'>Registrarse</button>
					<button type='button' onClick={handleLoginRedirect}>
						Iniciar Sesión
					</button>
				</div>
			</form>
		</div>
	);
};

export default Signup;
