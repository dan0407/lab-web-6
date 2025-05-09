import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebaseConfi';
import { doc, setDoc } from 'firebase/firestore';
import './perfil.css';
const Perfil = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		profileImage: '',
		description: '',
		interests: [],
	});

	const [step, setStep] = useState(1);

	const interestsOptions = ['Arte', 'Ciencia', 'Juegos', 'Tecnología', 'Deportes'];

	const predefinedImages = [
		'https://cdn.forbes.com.mx/2020/04/Gemera_exterior_5_high-1-640x360.jpg',
		'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2025/img-right-mobile.jpg',
		'https://cdn.ferrari.com/cms/network/media/img/resize/6673fe695834c800109ce469-laferrari_20240627_cover_1920x1080v2?',
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT01h9Ybm5frthMyMNtggcR-GmFOFJ45sZcQ&s',
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleInterestChange = (interest) => {
		setFormData((prev) => {
			const interests = prev.interests.includes(interest)
				? prev.interests.filter((i) => i !== interest)
				: [...prev.interests, interest];
			return { ...prev, interests };
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.profileImage || !formData.description || formData.interests.length === 0) {
			alert('Por favor, completa todos los campos antes de guardar.');
			return;
		}

		const user = auth.currentUser;
		if (user) {
			try {
				await setDoc(
					doc(db, 'users', user.uid),
					{
						...formData,
						isProfileComplete: true,
					},
					{ merge: true }
				);
				alert('Perfil completado con éxito.');
				navigate('/dashboard');
			} catch (err) {
				console.error('Error al guardar el perfil:', err.message);
			}
		} else {
			alert('No se encontró un usuario logueado.');
		}
	};

	return (
		<div className='perfil-container'>
			<h1>Completa tu Perfil</h1>
			<div className='perfil-step'>
				<h2>Selecciona tu Imagen de Perfil</h2>
				<div className='perfil-images'>
					{predefinedImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Avatar ${index + 1}`}
							className={formData.profileImage === image ? 'selected' : ''}
							onClick={() => setFormData({ ...formData, profileImage: image })}
						/>
					))}
				</div>
			</div>
			<form className='perfil-form' onSubmit={handleSubmit}>
				<label>Descripción Personal:</label>
				<textarea
					name='description'
					value={formData.description}
					onChange={handleChange}
					placeholder='Escribe algo sobre ti...'
					required
				/>
				<label>Selecciona tus Intereses:</label>
				<ul className='perfil-interests'>
					{interestsOptions.map((interest) => (
						<li key={interest}>
							<input
								type='checkbox'
								id={interest}
								checked={formData.interests.includes(interest)}
								onChange={() => handleInterestChange(interest)}
							/>
							<label htmlFor={interest}>{interest}</label>
						</li>
					))}
				</ul>
				<div className='perfil-buttons'>
					<button type='submit'>Guardar Perfil</button>
				</div>
			</form>
		</div>
	);
};

export default Perfil;
