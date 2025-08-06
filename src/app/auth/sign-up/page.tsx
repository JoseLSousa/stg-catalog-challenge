import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ToastHandler } from '@/components/ToastHandler'

export default function Page({ searchParams }: { searchParams?: { error?: string } }) {
  async function handleSignUp(formData: FormData) {
    'use server'
    const username = formData.get('username') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const repeatPassword = formData.get('repeatPassword') as string

    if (password !== repeatPassword) {
      redirect(`/auth/sign-up?error=${encodeURIComponent('As senhas não coincidem')}`)
      return
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, phoneNumber }
      }
    })
    if (error) {
      redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
      return
    }
    redirect('/auth/sign-up-success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4">
      {searchParams?.error && (
        <ToastHandler type="error" message={searchParams.error} replacePath="/auth/sign-up" />
      )}
      <form action={handleSignUp} method="post" className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-blue-900 text-center">Criar Conta</h2>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
          <input id="username" name="username" type="text" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefone</label>
          <input id="phoneNumber" name="phoneNumber" type="tel" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
          <input id="password" name="password" type="password" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700">Repetir Senha</label>
          <input id="repeatPassword" name="repeatPassword" type="password" required className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white font-medium rounded-xl py-2 hover:from-blue-600 hover:to-green-700">Criar Conta</button>
        <p className="text-sm text-center text-gray-600">
          Já tem conta? <a href="/auth/login" className="text-blue-600 hover:underline">Faça login</a>
        </p>
      </form>
    </main>
  )
}
