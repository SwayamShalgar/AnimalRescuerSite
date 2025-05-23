'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password: hashedPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Received JWT token:", data.token);
        toast.success('Signup successful!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.error(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An error occurred during signup.');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Signup
          </button>
        </form>
      </motion.div>
    </div>
  );
}