import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Login from './Login.jsx'
import Carousel from './Carousel.jsx'
import CardComponent from './CardComponent.jsx'
import MovieDetails from './MovieDetails.jsx'
import Booking from './Booking.jsx'
import Confirmation from './Confirmation.jsx'
import NotFound from './Errorpage.jsx'
import SeatLayout from './SeatLayout.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='/' element={<>
            <Carousel />
            <CardComponent />
          </>} />

          <Route path='/MovieDetails' element={<MovieDetails />} />
          <Route path='/Booking' element={<Booking />} />
          <Route path='/SeatLayout' element={<SeatLayout />} />
          <Route path='/Confirmation' element={<Confirmation />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
