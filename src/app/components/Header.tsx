'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel
} from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SearchForm } from './SearchForm'

interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartStr = localStorage.getItem('cart')
        const cart = cartStr ? JSON.parse(cartStr) as { quantity: number }[] : []
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
      } catch {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    return () => window.removeEventListener('storage', updateCartCount)
  }, [])

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-blue-50 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Mobile search form */}
            <div className="px-4 py-6">
              <SearchForm mobile={true} onSearch={() => setOpen(false)} />
            </div>

            {/* Mobile navigation */}
            <div className="space-y-6 border-t border-blue-200 px-4 py-6">
              <div className="flow-root">
                <Link
                  href="/catalog"
                  className="-m-2 block p-2 font-medium text-blue-700 hover:text-blue-800"
                  onClick={() => setOpen(false)}
                >
                  Catálogo
                </Link>
              </div>

              <div className="flow-root">
                <Link
                  href="/cart"
                  className="-m-2 flex items-center p-2 font-medium text-blue-700 hover:text-blue-800"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingBagIcon className="mr-2 size-5 text-blue-400" />
                  Carrinho ({cartCount})
                </Link>
              </div>
              {username && (
                <div className="flow-root">
                  <Link
                    href="/orders"
                    className="-m-2 flex items-center p-2 font-medium text-blue-700 hover:text-blue-800"
                    onClick={() => setOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 size-5 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v1.5m9 0v10.5A2.25 2.25 0 0114.25 20.25h-4.5A2.25 2.25 0 017.5 18.75V8.25m9 0h-9" />
                    </svg>
                    Histórico de pedidos
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile account section */}
            <div className="space-y-6 border-t border-blue-200 px-4 py-6">
              {username ? (
                <div className="flow-root">
                  <p className="-m-2 block p-2 font-medium text-gray-900">Olá, {username}</p>
                </div>
              ) : (
                <>
                  <div className="flow-root">
                    <Link href="/auth/login" className="-m-2 block p-2 font-medium text-gray-900">
                      Login
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link href="/auth/sign-up" className="-m-2 block p-2 font-medium text-gray-900">
                      Cadastre-se
                    </Link>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-blue-50">
        <p className="flex h-10 items-center justify-center bg-blue-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Frete grátis para pedidos acima de R$100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-blue-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-blue-50 p-2 text-blue-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">STG Catalog</span>
                  <Image
                    alt="STG Logo"
                    src="/logo.svg"
                    className="h-8 w-auto"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>

              {/* Catalog Button - visible only on desktop */}
              <div className='hidden lg:ml-10 lg:flex'>
                <Button className="rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <Link href="/catalog" className="text-blue-700 hover:text-blue-800">
                    Catálogo
                  </Link>
                </Button>
              </div>

              {/* Search - using our new component */}
              <SearchForm />

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {username ? (
                    <span className="text-sm font-medium text-blue-700">Olá, {username}</span>
                  ) : (
                    <>
                      <Link href="/auth/login" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                        Login
                      </Link>
                      <span aria-hidden="true" className="h-6 w-px bg-blue-200" />
                      <Link href="/auth/sign-up" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                        Cadastre-se
                      </Link>
                    </>
                  )}
                </div>

                {/* Cart + Orders */}
                <div className="ml-4 lg:ml-6 flex items-center gap-2">
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-blue-400 group-hover:text-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-blue-700 group-hover:text-blue-800">{cartCount}</span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                  {username && (
                    <Link href="/orders" className="group -m-2 flex items-center p-2" title="Histórico de pedidos">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 shrink-0 text-blue-400 group-hover:text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v1.5m9 0v10.5A2.25 2.25 0 0114.25 20.25h-4.5A2.25 2.25 0 017.5 18.75V8.25m9 0h-9" />
                      </svg>
                      <span className="sr-only">Histórico de pedidos</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
