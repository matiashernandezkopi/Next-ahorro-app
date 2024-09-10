import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Bienvenido a la Aplicación de Gastos</h1>
      <nav>
        <Link href="/auth/login">Iniciar Sesión</Link>
        <Link href="/expenses">Ver Gastos</Link>
      </nav>
    </div>
  );
}
