import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

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
      router.push('/'); // Redirige a la página principal después del registro
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      if (firebaseError.code) {
        setError(`Error: ${firebaseError.message}`);
      } else {
        setError('Error desconocido');
      }
    }
  };

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      router.push('/'); // Redirige a la página principal después del inicio de sesión
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      if (firebaseError.code) {
        setError(`Error: ${firebaseError.message}`);
      } else {
        setError('Error desconocido');
      }
    }
  };

  return (
    <div>
      <h1>Autenticación</h1>
      {user ? (
        <div>
          <p>Bienvenido, {user.email}</p>
          <button onClick={async () => {
            await signOutUser();
            router.push('/auth/login');
          }}>Cerrar sesión</button>
          <button onClick={() => {
            router.push('/');
          }}>Home</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogIn}>Iniciar sesión</button>
          <button onClick={handleSignUp}>Registrarse</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
