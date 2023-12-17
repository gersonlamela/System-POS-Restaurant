'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
 
import axios from "axios";
import { UserRole } from "@prisma/client";




export default function SignupPage() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pin: 0,
    role:"ADMIN", // Valor padrão
  });

  const [errorMessage, setErrorMessage] = useState("");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSignup() {
 
      const role: UserRole = formData.role as UserRole;

      const userData = {
        name:  formData.name,
        email: formData.email,
        pin: formData.pin,
        role:role,
      };
      

      console.log("Criando novo usuário:", userData)
      axios({
        method: 'POST',
        url: '/api/auth/createUser',
        data: userData,
        headers: {   "Content-Type": "application/json", },
      }).then(function (response) {
        console.log("Novo usuário criado:", response.data);
        route.push("/");
      }).catch(function (error) {
        setErrorMessage( error.response.data.error);
        console.error("Erro ao criar usuário:", error.response.data.error);
      });
   
  }

  return (
    <div className="container mx-auto my-10 p-6 bg-white shadow-md max-w-md">
      <h1 className="text-3xl font-semibold mb-4 text-black">Signup Page</h1>
      <label className="block mb-4 text-black">
        Nome:
        <input
          className="border p-2 w-full text-black"
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter your name"
          onChange={handleInputChange}
        />
              
      </label>

      <label className="block mb-4 text-black">
        Email:
        <input
          className="border p-2 w-full text-black"
          type="email"
          name="email"
          value={formData.email}
          placeholder="example@example.com"
          onChange={handleInputChange}
        />
     
      </label>

      <label className="block mb-4 text-black">
        PIN:
        <input
          className="border p-2 w-full text-black"
          type="number"
          name="pin"
          max={4}
          min={4}
          value={formData.pin}
          placeholder="1234"
          onChange={handleInputChange}
        />
   
      </label>

      <label className="block mb-4 text-black">
        Função:
        <select
          className="border p-2 w-full text-black"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="ADMIN">Admin</option>
          <option value="COZINHEIRO">Cozinheiro</option>
          <option value="FUNCIONARIO">Funcionário</option>
        </select>
      </label>

      <p className="text-red-500">{errorMessage}</p>
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>
  );
}
