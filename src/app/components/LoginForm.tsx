'use client'

import { useState, useEffect } from 'react';

interface LoginFormProps {
    onSubmit: (formData: FormData) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const emailValid = formData.email.includes('@') && formData.email.includes('.');
        const passwordValid = formData.password.length >= 8;
        setIsValid(emailValid && passwordValid);
    }, [formData]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid) {
            const form = e.currentTarget;
            const data = new FormData(form);
            onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                            formData.email && formData.email.includes('@') && formData.email.includes('.')
                                ? 'border-green-300 focus:ring-green-500'
                                : formData.email
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-green-500'
                        }`}
                    />
                </div>
                {formData.email && (!formData.email.includes('@') || !formData.email.includes('.')) && (
                    <p className="mt-1 text-xs text-red-500">Digite um email válido</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                            formData.password.length >= 8
                                ? 'border-green-300 focus:ring-green-500'
                                : formData.password
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-green-500'
                        }`}
                    />
                </div>
                <div className="mt-1 text-xs">
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        Mínimo de 8 caracteres {formData.password.length >= 8 ? '✓' : `(${formData.password.length}/8)`}
                    </span>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isValid
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:-translate-y-0.5 hover:shadow-xl focus:ring-green-500'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {isValid ? 'Entrar' : 'Preencha todos os campos'}
                </span>
            </button>
        </form>
    );
}
