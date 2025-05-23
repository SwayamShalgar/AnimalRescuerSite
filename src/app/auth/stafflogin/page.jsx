'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function StaffAuth() {
  const router = useRouter();
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [centerId, setCenterId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = tab === 'login' ? '/api/stafflogin' : '/api/staffsignup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, center_id: centerId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${tab === 'login' ? 'Login' : 'Signup'} Successful`);
        localStorage.setItem('staffid', data.staff.staffid);
        setTimeout(() => {
          router.push('/StaffHome');
        }, 1500);
      } else {
        toast.error(data.error || `${tab === 'login' ? 'Login' : 'Signup'} Failed`);
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <Toaster position="top-right" />
      <motion.div
        className="p-8 w-full max-w-md bg-white rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setTab('login')}
            className={`w-1/2 py-2 font-semibold rounded-l-lg ${
              tab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`w-1/2 py-2 font-semibold rounded-r-lg ${
              tab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Center ID"
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            {tab === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
