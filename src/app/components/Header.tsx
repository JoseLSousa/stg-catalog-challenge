'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Input
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { LoginRegisterOrUsernameButton } from './LoginRegisterOrUsernameButton'

export default function Header() {
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

            <div className="space-y-6 border-t border-blue-200 px-4 py-6">
            </div>

            <div className="space-y-6 border-t border-blue-200 px-4 py-6">

            </div>

            <div className="border-t border-blue-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <Image
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                  width={20}
                  height={15}
                />
                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-blue-50">
        <p className="flex h-10 items-center justify-center bg-blue-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
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
                <a href="#">
                  <span className="sr-only">Your Company</span>
                  <Image
                    alt=""
                    src="/logo.svg"
                    className="h-8 w-auto"
                    width={32}
                    height={32}
                  />
                </a>
              </div>
              {/* {CatalogButton} */}
              <div className='ml-10 flex lg:ml-10'>
                <Button>
                  <Link href="/catalog" className="text-blue-700 hover:text-blue-800">
                    Catálogo
                  </Link>
                </Button>
              </div>

              {/* Search */}
              <div className="hidden lg:flex lg:ml-8 lg:flex-1 lg:justify-center">
                <div className="relative w-80">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <Input
                    type="text"
                    name="search"
                    className="block w-full rounded-md border-0 bg-blue-50 py-1.5 pl-10 pr-3 text-blue-900 ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Pesquisar..."
                  />
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <LoginRegisterOrUsernameButton />
                </div>
                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-blue-400 group-hover:text-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-blue-700 group-hover:text-blue-800">{cartCount}</span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
