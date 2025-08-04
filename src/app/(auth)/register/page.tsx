import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Toast } from "../../components/Toast";
import { RegisterForm } from "../../components/RegisterForm";
import Link from 'next/link';

interface RegisterProps {
    searchParams: Promise<{
        error?: string;
        message?: string;
        success?: string;
    }>;
}

export default async function Register({ searchParams }: RegisterProps) {
    // Aguardar os searchParams antes de usar
    const params = await searchParams;

    async function RegisterUser(formData: FormData) {
        'use server'

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const username = formData.get('username') as string;
        const phone = formData.get('phone') as string;

        console.log('Iniciando cadastro para:', email); // Debug

        // Validações básicas
        if (!email || !password || !confirmPassword) {
            redirect('/register?error=Todos os campos são obrigatórios');
        }

        if (password !== confirmPassword) {
            redirect('/register?error=As senhas não coincidem');
        }

        if (password.length < 8) {
            redirect('/register?error=A senha deve ter pelo menos 8 caracteres');
        }

        const supabase = await createClient();

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username, phone } }
            });

            console.log('Resposta do Supabase:', {
                user: data?.user ? 'Usuário criado' : 'Nenhum usuário',
                userId: data?.user?.id,
                emailConfirmed: data?.user?.email_confirmed_at,
                confirmationSent: data?.user?.confirmation_sent_at,
                error: error?.message
            });

            // Se há erro, tratar
            if (error) {
                console.log('Erro do Supabase:', error.message);

                let errorMessage = 'Erro ao criar conta';

                if (error.message.includes('already registered') ||
                    error.message.includes('User already registered') ||
                    error.message.includes('duplicate') ||
                    error.message.includes('already exists') ||
                    error.message.includes('Email rate limit exceeded')) {
                    errorMessage = 'Este email já está cadastrado. Tente fazer login';
                } else if (error.message.includes('Invalid email')) {
                    errorMessage = 'Email inválido';
                } else if (error.message.includes('Password') || error.message.includes('password')) {
                    errorMessage = 'Senha muito fraca. Use pelo menos 8 caracteres';
                } else {
                    errorMessage = error.message;
                }

                redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
            }

            // Se não há erro e temos um usuário
            if (data?.user) {
                // Se confirmation_sent_at for falso, é usuário existente (já confirmado)
                if (!data.user.confirmation_sent_at) {
                    redirect('/register?error=Este email já está cadastrado. Tente fazer login');
                }
                // Novo usuário: verificar se auto-confirmação
                if (data.user.email_confirmed_at) {
                    redirect('/login?message=Conta criada com sucesso! Faça login para continuar');
                } else {
                    redirect('/register?success=Conta criada! Verifique seu email para ativar a conta');
                }
            }

            // Caso não esperado: sem erro e sem usuário
            console.log('Situação inesperada: sem erro mas sem usuário criado');
            redirect('/register?error=Algo deu errado. Tente novamente');

        } catch (err) {
            // Verificar se é um erro de redirect do Next.js (comportamento esperado)
            if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
                // Este é um redirect válido, não é um erro real
                console.log('Redirect executado com sucesso:', err.message);
                throw err; // Re-throw para permitir o redirect
            }

            // Outros erros reais
            console.error('Erro real no try/catch:', err);
            if (err instanceof Error) {
                console.error('Erro real na criação da conta:', err.message);
                redirect(`/register?error=${encodeURIComponent('Erro: ' + err.message)}`);
            } else {
                console.error('Erro desconhecido:', err);
                redirect('/register?error=Erro inesperado. Tente novamente');
            }
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Toast Notifications */}
            {params.error && (
                <Toast
                    type="error"
                    message={decodeURIComponent(params.error)}
                    duration={6000}
                />
            )}

            {params.success && (
                <Toast
                    type="success"
                    message={decodeURIComponent(params.success)}
                    duration={8000}
                />
            )}

            {params.message && (
                <Toast
                    type="info"
                    message={decodeURIComponent(params.message)}
                    duration={6000}
                />
            )}

            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-blue-900 mb-2">
                        Criar Conta
                    </h2>
                    <p className="text-blue-700 text-sm">
                        Junte-se a nós e explore nosso catálogo completo
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                    <RegisterForm onSubmit={RegisterUser} />

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Social Login Options */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-blue-500">Ou continue com</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="w-full inline-flex justify-center py-2.5 px-4 border border-green-200 rounded-xl shadow-sm bg-white text-sm font-medium text-blue-700 hover:bg-green-50 transition-colors duration-200">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="ml-2">Google</span>
                        </button>

                        <button className="w-full inline-flex justify-center py-2.5 px-4 border border-green-200 rounded-xl shadow-sm bg-white text-sm font-medium text-blue-700 hover:bg-green-50 transition-colors duration-200">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                            <span className="ml-2">Twitter</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}