import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfi"; 
import { useNavigate } from "react-router-dom"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    birthdate: "",
    password: "", 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, username, birthdate, password } = formData;

    if (!email || !username || !birthdate || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await setDoc(doc(db, "users", email), {
        username,
        birthdate,
        email,
      });

      setSuccess("Datos enviados exitosamente.");
      setFormData({ email: "", username: "", birthdate: "", password: "" });
    } catch (err) {
      setError("Error al enviar los datos: " + err.message);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" >Enviar</button>
      </form>
    </div>
  );
};

export default Signup;