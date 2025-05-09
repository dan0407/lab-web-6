import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfi';
import { useNavigate } from 'react-router-dom';

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
			// Registrar usuario con Firebase Authentication
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			// Guardar datos adicionales en Firestore
			await setDoc(doc(db, 'users', userCredential.user.uid), {
				email,
				username,
				birthdate,
			});

			// Redirigir al dashboard después de un registro exitoso
			navigate('/dashboard');
		} catch (err) {
			setError('Error al registrarse: ' + err.message);
		}
	};

	return (
		<div>
			<h2>Registro de Usuario</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Correo Electrónico:</label>
					<input type='email' name='email' value={formData.email} onChange={handleChange} required />
				</div>
				<div>
					<label>Contraseña:</label>
					<input type='password' name='password' value={formData.password} onChange={handleChange} required />
				</div>
				<div>
					<label>Nombre de Usuario:</label>
					<input type='text' name='username' value={formData.username} onChange={handleChange} required />
				</div>
				<div>
					<label>Fecha de Nacimiento:</label>
					<input type='date' name='birthdate' value={formData.birthdate} onChange={handleChange} required />
				</div>
				<button type='submit'>Registrarse</button>
			</form>
		</div>
	);
};

export default Signup;
