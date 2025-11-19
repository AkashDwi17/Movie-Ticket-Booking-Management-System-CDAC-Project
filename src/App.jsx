import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CardComponent from './CardComponent.jsx'
import NotFound from './Errorpage.jsx'
import Navbar from './Navbar.jsx'
import Carousel from './Carousel.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MovieDetails from './MovieDetails.jsx'
import Footer from './Footer.jsx'

function App() {
  

  return (
    <>
    <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<> 
            
            <Carousel />
            <CardComponent />
          </>} />
          <Route path='/MovieDetails' element={<MovieDetails />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
