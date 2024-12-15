// Importing global CSS styles
import '@/App.css'
// Importing components and routes
import Navbar from './components/navbar'
import Weather from './routes/weather'
import Resort from './routes/resort'
import Home from './routes/home'
import Feedback from './routes/feedback'
import Signin from './routes/signin'
import Signup from './routes/signup'
import ResortInfo from './components/resortInfo'
import Account from './routes/account'
// Importing necessary modules from react-router-dom
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Importing authentication utility
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      {/* Navbar component displayed on all pages */}
      <Navbar />
      <Routes>
        {/* Route for each page */}
        <Route path='/' element={<Home />} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/resorts' element={<Resort />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/resortInfo' element={<ResortInfo />} />
        {/* Route for the account page, redirects to sign-in if not authenticated */}
        <Route path='/account' element={isAuthenticated() ? <Account /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App
