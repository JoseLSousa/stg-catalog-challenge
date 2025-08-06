import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ToastHandler } from '@/components/ToastHandler'

export default function Page({ searchParams }: { searchParams?: { error?: string } }) {
  async function handleLogin(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    }
    redirect('/protected')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      {/* Display error toast if present */}
      {searchParams?.error && (
        <ToastHandler type="error" message={searchParams.error} replacePath="/auth/login" />
      )}
      <form action={handleLogin} method="post" className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-blue-900 text-center">Faça Login</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
          <input id="password" name="password" type="password" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white font-medium rounded-xl py-2 hover:from-blue-600 hover:to-green-700">Entrar</button>
        <p className="text-sm text-center text-gray-600">
          Não tem conta?{' '}
          <Link href="/auth/sign-up" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </main>
  )
}