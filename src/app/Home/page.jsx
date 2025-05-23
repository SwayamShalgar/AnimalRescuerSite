'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [formData, setFormData] = useState({
    animalName: '',
    description: '',
    location: '',
    bread: '',
    species: ''
  });
  const [images, setImages] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('animalName', formData.animalName);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('bread', formData.bread);
    data.append('species', formData.species);
    data.append('images', images);

    try {
      const res = await fetch('/api/animal-request', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        alert('Request submitted successfully!');
        setFormData({ animalName: '', description: '', location: '', bread: '', species: '' });
        setImages();
      } else {
        alert('Failed to submit request.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting request.');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Report Injured Animal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="animalName"
            placeholder="Animal Name/Type"
            value={formData.animalName}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            rows={4}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />
          <input
            name="bread"
            placeholder="Breed"
            value={formData.bread}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />
          <input
            name="species"
            placeholder="Species"
            value={formData.species}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-[200px] border-2 p-[10px] rounded-2xl cursor-pointer"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
}
