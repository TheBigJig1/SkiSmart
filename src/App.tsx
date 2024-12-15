{/* This file is the main file that is rendered when the app is started. It contains the routes for the app and the navbar. */}

import '@/App.css'
import Navbar from './components/navbar'
import Weather from './routes/weather'
import Resort from './routes/resort'
import Home from './routes/home'
import Feedback from './routes/feedback'
import Signin from './routes/signin'
import Signup from './routes/signup'
import ResortInfo from './components/resortInfo'
import Account from './routes/account'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';

{/* The App component works as the main component of the app. It contains the routes for the app and the navbar. */}
function App() {

  return (
    <Router>
      {/* Render the navigation bar */}
      <Navbar />
      <Routes>
        {/* Define the route for the home page */}
        <Route path='/' element={<Home />} />

        {/* Define the route for the weather page */}
        <Route path='/weather' element={<Weather />} />

        {/* Define the route for the resorts page */}
        <Route path='/resorts' element={<Resort />} />

        {/* Define the route for the feedback page */}
        <Route path='/feedback' element={<Feedback />} />

        {/* Define the route for the signin page */}
        <Route path='/signin' element={<Signin />} />

        {/* Define the route for the signup page */}
        <Route path='/signup' element={<Signup />} />

        {/* Define the route for the resortInfo page */}
        <Route path='/resortInfo' element={<ResortInfo />} />

        {/* Define the route for the account page, redirect to sign-in if not authenticated */}
        <Route path='/account' element={isAuthenticated() ? <Account /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App
