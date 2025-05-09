import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pag/login/login';
import Signup from './pag/signup/signup';
import Dashboard from './pag/dashboard/dashboard';
import Perfil from './pag/perfil/perfil';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/perfil' element={<Perfil />} />
			</Routes>
		</Router>
	);
}

export default App;
