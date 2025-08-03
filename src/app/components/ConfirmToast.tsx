'use client'

import { useState } from 'react';
import { Toast } from '../components/Toast';
import { useRouter } from 'next/navigation';

export function ConfirmToast() {
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
