import React from 'react'
import { useNavigate } from 'react-router-dom'

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4 py-8">
     
      

      <h1 className="text-center mt-5 text-4xl font-bold">
        We love
        <span className="text-primary px-3 py-2 border rounded-full shadow-sm inline-block ml-2 bg-blue-100 text-blue-700 border-blue-300">
          comfy
        </span>
      </h1>

      <p className="text-center mt-8 text-lg font-semibold max-w-2xl">
        We Love Comfy<br />
        At Comfy, we believe that comfort isn't just a luxury — it's a lifestyle.<br />
        We are dedicated to creating products that make your everyday moments softer, warmer, and more relaxing.<br />
        From the smallest details to the biggest comforts, everything we design is made with care, quality, and you in mind.<br />
        Whether you're unwinding after a long day or simply enjoying time at home, we want you to feel truly at ease.<br />
        Because at the heart of everything we do is one simple idea: you deserve to feel good, always.
      </p>
    </div>
  )
}

export default About