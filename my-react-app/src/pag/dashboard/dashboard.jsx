import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfi';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './dashboard.css';
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
		<div className='dashboard-container'>
			<h1>Dashboard</h1>
			{userProfile ? (
				isProfileComplete ? (
					<div className='dashboard-profile'>
						<img src={userProfile.profileImage || 'default-avatar-url'} alt='Avatar' />
						<h2>{userProfile.username || 'Usuario'}</h2>
						<p>
							<strong>Correo Electrónico:</strong> {userProfile.email || 'correo@example.com'}
						</p>
						<p>
							<strong>Fecha de Nacimiento:</strong> {userProfile.birthdate || 'N/A'}
						</p>
						<p>
							<strong>Descripción:</strong> {userProfile.description || 'Sin descripción'}
						</p>
						<p>
							<strong>Intereses:</strong> {userProfile.interests?.join(', ') || 'Ninguno'}
						</p>
					</div>
				) : (
					<p>Por favor, completa tu perfil.</p>
				)
			) : (
				<p>Cargando datos del usuario...</p>
			)}
			<div className='dashboard-buttons'>
				<button onClick={handleGoToPerfil}>Ir a Perfil</button>
				<button onClick={handleLogout}>Cerrar Sesión</button>
			</div>
		</div>
	);
};

export default Dashboard;
