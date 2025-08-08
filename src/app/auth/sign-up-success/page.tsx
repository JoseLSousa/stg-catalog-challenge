import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro realizado com sucesso!</h2>
        <p className="text-gray-600 mb-6">Verifique seu email para confirmar sua conta e, após isso, faça login.</p>
        <Link href="/auth/login" className="inline-block bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-xl transition-colors">
          Fazer Login
        </Link>
      </div>
    </main>
  )
}
