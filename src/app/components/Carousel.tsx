'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  '/banner.jpg',
  '/banner.jpg',
  '/banner.jpg',
  '/banner.jpg',
  '/banner.jpg',

]

export default function Carousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrent(prev => (prev + 1) % slides.length)

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-4">
      <div className="overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((src, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <Image src={src} alt={`Slide ${idx + 1}`} width={1024} height={300} className="object-cover w-full h-64 md:h-80" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
        ‹
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
        ›
      </button>
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full ${idx === current ? 'bg-green-600' : 'bg-green-300'}`} />
        ))}
      </div>
    </div>
  )
}