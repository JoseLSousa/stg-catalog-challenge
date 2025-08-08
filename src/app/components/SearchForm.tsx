'use client';

import { useState } from "react";
import { Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface SearchFormProps {
    className?: string;
    mobile?: boolean;
    onSearch?: (query: string) => void;
}

export function SearchForm({ className = "", mobile = false, onSearch }: SearchFormProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery);
            } else {
                // Navigate to search results page with query parameter
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
    };

    return (
        <form 
            onSubmit={handleSearch} 
            className={`${mobile ? 'w-full' : 'hidden lg:flex lg:ml-8 lg:flex-1 lg:justify-center'} ${className}`}
        >
            <div className={`relative ${mobile ? 'w-full' : 'w-80'}`}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <Input
                    type="text"
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-blue-900 ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Pesquisar produtos..."
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 hover:text-blue-800"
                    aria-label="Search"
                >
                    Buscar
                </button>
            </div>
        </form>
    );
}