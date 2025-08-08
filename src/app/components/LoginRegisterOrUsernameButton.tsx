'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronDownIcon, DivideIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function LoginRegisterOrUsernameButton() {
    const [username, setUsername] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUsername(user.user_metadata.username || null)
            }

        }
        fetchUser()
    }, [])

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };
    return (
        <div>
            {username ? (
                <div className="flow-root">
                    <Menu>
                        <MenuButton className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 cursor-pointer">
                            Olá, {username}
                            <ChevronDownIcon className="w-4 h-4 text-blue-700" />
                        </MenuButton>
                        <MenuItems anchor='bottom'>
                            <MenuItem>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                                >
                                    Sair
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            ) : (
                <div className="flex space-x-4">
                    <div className="flow-root">
                        <Link href="/auth/login" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            Login
                        </Link>
                    </div>
                    
                    <div className="flow-root">
                        <Link href="/auth/sign-up" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}