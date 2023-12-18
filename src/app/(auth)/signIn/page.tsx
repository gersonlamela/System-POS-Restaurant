'use client'

import { FormEvent, useState } from "react";

import { getSession, signIn } from "next-auth/react";
import  { useRouter } from "next/navigation";


export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    id: "",
    pin: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event:FormEvent) => {
    event.preventDefault();
  

      const signinResponse = await signIn('credentials', {
        id: formData.id, 
        pin: formData.pin, 
        redirect: false,
      })


      if (signinResponse?.status === 200) {
      router.push('/')
      } else {
        setErrorMessage(signinResponse?.error ?? 'Signin failed')
      }
  }

  return (
    <div className="container mx-auto my-10 p-6 bg-white shadow-md max-w-md">
      <h1 className="text-3xl font-semibold mb-4 text-black">Signup Page</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
      <label className="block mb-4 text-black">
        Id:
        <input
          className="border p-2 w-full text-black"
          type="text"
          name="id"
          value={formData.id}
          placeholder="Enter your id"
          required
          onChange={handleInputChange}
        />
              
      </label>

 

      <label className="block mb-4 text-black">
        PIN:
        <input
          className="border p-2 w-full text-black"
          type="tel"
          name="pin"
         maxLength={4}
          required
          value={formData.pin}
          placeholder="1234"
          onChange={handleInputChange}
        />
   
      </label>

  

      <p className="text-red-500">{errorMessage}</p>
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
      >
        Signup
      </button>
      </form>
    </div>
  );
}
