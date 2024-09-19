'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Bienvenido a la Aplicación de Gastos
        </h1>
        <nav className="space-y-4">
          <Link
            href="/auth/login"
            className="block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/expenses"
            className="block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-200 dark:bg-green-700 dark:hover:bg-green-600"
          >
            Ver Gastos
          </Link>
          <Link
            href="/sales"
            className="block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-200 dark:bg-green-700 dark:hover:bg-green-600"
          >
            Ver Ventas
          </Link>
        </nav>
      </div>
    </div>
  );
}
