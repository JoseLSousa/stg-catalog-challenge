'use client'
import { Button } from '@headlessui/react'
import Image from 'next/image'
import { useState } from 'react'

interface ProductGalleryProps {
    images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [current, setCurrent] = useState(0)

    if (!images || images.length === 0) {
        return <div className="w-full h-64 bg-gray-100 flex items-center justify-center">Sem imagens</div>
    }


    return (
        <div>
            <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={images[current]}
                    alt={`Slide ${current + 1}`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex space-x-2 mt-4 overflow-x-auto">
                {images.map((src, idx) => (
                    <Button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-16 h-16 flex-shrink-0 rounded-lg border-2 cursor-pointer ${idx === current ? 'border-green-600' : 'border-transparent'} overflow-hidden`}
                    >
                        <Image src={src} alt={`Thumb ${idx + 1}`} width={64} height={64} className="object-cover" />
                    </Button>
                ))}
            </div>
        </div>)
}
