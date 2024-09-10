'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import Link from 'next/link';

interface FirebaseAuthError extends Error {
  code: string;
}

export default function Auth() {
  const { user, signOutUser } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      router.push('/');
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      setError(firebaseError.code ? `Error: ${firebaseError.message}` : 'Error desconocido');
    }
  };

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      router.push('/');
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      setError(firebaseError.code ? `Error: ${firebaseError.message}` : 'Error desconocido');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Autenticación</h1>
        {user ? (
          <div className="text-center">
            <p className="text-gray-800 mb-4">Bienvenido, <span className="font-semibold">{user.email}</span></p>
            <button
              onClick={async () => {
                await signOutUser();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full mb-4"
            >
              Cerrar sesión
            </button>
            <Link href="/" passHref className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded w-full text-center">
              Home 
            </Link>
          </div>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            />
            <button
              onClick={handleLogIn}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full mb-2"
            >
              Iniciar sesión
            </button>
            <button
              onClick={handleSignUp}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Registrarse
            </button>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}