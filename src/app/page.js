'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/auth/login');
  };

  const goToSignup = () => {
    router.push('/auth/signup');
  };

  const goToStaffSignup = () => {
    router.push('/auth/stafflogin');
  };

  return (
    <motion.div
      className="w-screen h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar */}
      <motion.div
        className="h-[50px] flex justify-between items-center px-4 bg-white shadow"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="font-semibold text-lg">Animal-Rescuer</h1>
        <div className="flex gap-4">
          <button
            onClick={goToLogin}
            className="border-2 px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-sky-300 transition"
          >
            Login
          </button>
          <button
            onClick={goToStaffSignup}
            className="border-2 px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-sky-300 transition"
          >
            Staff-Login
          </button>
          <button
            onClick={goToSignup}
            className="border-2 px-4 py-1 rounded-lg bg-blue-400 text-white hover:bg-sky-300 transition"
          >
            Signup
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-grow flex items-center justify-center gap-16 px-4 py-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Image Section */}
        <motion.div
          className="w-[600px] max-w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <img
            src="https://media.istockphoto.com/id/1468791740/photo/black-couple-love-or-petting-dog-in-animal-shelter-foster-kennel-or-adoption-center-smile.jpg?s=612x612&w=0&k=20&c=RRewE-O27JreZUdRJxJ8uQkY7cNmrLAm7XIIcQVEhvY="
            alt="Adoption image"
            className="w-full h-auto rounded-lg shadow"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="max-w-[400px]"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Adopt a Bundle of Joy</h2>
          <p className="text-lg leading-relaxed">
            "Pawsitively Adorable", "Whiskers and Wishes", "Barking for a Better Tomorrow", and "Where wagging tails meet open hearts."
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
