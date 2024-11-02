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

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/resorts' element={<Resort />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/resortInfo' element={<ResortInfo />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App
