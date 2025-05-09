import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfi';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Dashboard = () => {
	const navigate = useNavigate();
	const [userProfile, setUserProfile] = useState(null);
	const [isProfileComplete, setIsProfileComplete] = useState(true);
	const [formData, setFormData] = useState({
		username: '',
		birthdate: '',
		profileImage: '',
		description: '',
		interests: [],
	});

	useEffect(() => {
		const fetchUserProfile = async () => {
			const user = auth.currentUser;
			if (user) {
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data();
					setUserProfile(data);

					if (!data.username || !data.birthdate || !data.profileImage || !data.description || !data.interests) {
						setIsProfileComplete(false);
					}
				} else {
					setIsProfileComplete(false);
				}
			} else {
				navigate('/login');
			}
		};

		fetchUserProfile();
	}, [navigate]);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate('/login');
		} catch (err) {
			console.error('Error al cerrar sesión:', err.message);
		}
	};

	const handleGoToPerfil = () => {
		navigate('/perfil');
	};

	return (
		<div>
			<h1>Dashboard</h1>
			{userProfile ? (
				isProfileComplete ? (
					<div>
						<h2>Resumen del Perfil</h2>
						<p>
							<strong>Nombre de Usuario:</strong> {userProfile.username}
						</p>
						<p>
							<strong>Correo Electrónico:</strong> {userProfile.email}
						</p>
						<p>
							<strong>Fecha de Nacimiento:</strong> {userProfile.birthdate}
						</p>
						<p>
							<strong>Descripción:</strong> {userProfile.description}
						</p>
						<p>
							<strong>Intereses:</strong> {userProfile.interests?.join(', ')}
						</p>
						<p>
							<strong>Imagen de Perfil:</strong>{' '}
							<img src={userProfile.profileImage} alt='Avatar' style={{ width: '50px', height: '50px' }} />
						</p>
					</div>
				) : (
					<p>Por favor, completa tu perfil.</p>
				)
			) : (
				<p>Cargando datos del usuario...</p>
			)}
			<div style={{ marginTop: '20px' }}>
				<button onClick={handleGoToPerfil} style={{ marginRight: '10px' }}>
					Ir a Perfil
				</button>
				<button onClick={handleLogout}>Cerrar Sesión</button>
			</div>
		</div>
	);
};

export default Dashboard;
