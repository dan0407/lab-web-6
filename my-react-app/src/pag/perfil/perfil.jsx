import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebaseConfi';
import { doc, setDoc } from 'firebase/firestore';

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

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div>
						<h2>Selecciona tu Imagen de Perfil</h2>
						<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
							{predefinedImages.map((image, index) => (
								<img
									key={index}
									src={image}
									alt={`Avatar ${index + 1}`}
									style={{
										width: '100px',
										height: '100px',
										cursor: 'pointer',
										border: formData.profileImage === image ? '2px solid blue' : '2px solid transparent',
									}}
									onClick={() => setFormData({ ...formData, profileImage: image })}
								/>
							))}
						</div>
						{!formData.profileImage && <p>Por favor, selecciona una imagen.</p>}
					</div>
				);
			case 2:
				return (
					<div>
						<h2>Escribe una Descripción Personal</h2>
						<textarea
							name='description'
							value={formData.description}
							onChange={handleChange}
							placeholder='Escribe algo sobre ti...'
							required
						/>
					</div>
				);
			case 3:
				return (
					<div>
						<h2>Selecciona tus Intereses</h2>
						{interestsOptions.map((interest) => (
							<div key={interest}>
								<input
									type='checkbox'
									checked={formData.interests.includes(interest)}
									onChange={() => handleInterestChange(interest)}
								/>
								{interest}
							</div>
						))}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div>
			<h1>Completa tu Perfil</h1>
			<form onSubmit={handleSubmit}>
				{renderStep()}
				<div style={{ marginTop: '20px' }}>
					{step > 1 && (
						<button type='button' onClick={() => setStep(step - 1)} style={{ marginRight: '10px' }}>
							Anterior
						</button>
					)}
					{step < 3 ? (
						<button type='button' onClick={() => setStep(step + 1)}>
							Siguiente
						</button>
					) : (
						<button type='submit'>Guardar Perfil</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default Perfil;
