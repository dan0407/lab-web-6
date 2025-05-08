import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const { uid, email } = location.state || {}; // Obtenemos el uid y el email del estado

  return (
    <div>
      <h1>Dashboard</h1>
      {uid && email ? (
        <div>
          <p><strong>UID:</strong> {uid}</p>
          <p><strong>Correo Electrónico:</strong> {email}</p>
        </div>
      ) : (
        <p>No se encontró información del usuario.</p>
      )}
    </div>
  );
};

export default Dashboard;