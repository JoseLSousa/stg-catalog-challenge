'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ToastProps {
    type: 'error' | 'success' | 'info';
    message: string;
    duration?: number;
    onClose?: () => void;
}

export function Toast({ type, message, duration = 5000, onClose }: ToastProps) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            } else {
                // Remove o parâmetro da URL para fechar o toast
                router.replace('/register');
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose, router]);

    const getToastStyles = () => {
        switch (type) {
            case 'error':
                return 'bg-red-500 border-red-600';
            case 'success':
                return 'bg-green-500 border-green-600';
            case 'info':
            default:
                return 'bg-blue-500 border-blue-600';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error':
                return (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'success':
                return (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.replace('/register');
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full toast-container">
            <div className={`${getToastStyles()} text-white px-6 py-4 rounded-xl shadow-lg border animate-slide-in`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {getIcon()}
                        <p className="text-sm font-medium">
                            {message}
                        </p>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="ml-4 text-white/70 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                    <div 
                        className="bg-white h-1 rounded-full animate-progress"
                        style={{
                            animation: `progress ${duration}ms linear`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
