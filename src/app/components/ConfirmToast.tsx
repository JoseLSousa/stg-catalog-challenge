'use client'

import { useState } from 'react';
import { Toast } from '../components/Toast';
import { useRouter } from 'next/navigation';

interface ConfirmToastProps {
  code: string;
}

export function ConfirmToast({ code }: ConfirmToastProps) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setVisible(false);
    router.replace('/');
  };

  if (!visible) return null;

  return (
    <Toast
      type="success"
      message="Email confirmado com sucesso! Faça login para continuar"
      onClose={handleClose}
      duration={6000}
    />
  );
}
