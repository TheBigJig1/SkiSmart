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

function App() {
  
  let component
  switch(window.location.pathname) {
    case "/":
      component = <Home />
      break
    case "/weather":
      component = <Weather />
      break
    case "/resorts":
      component = <Resort />
      break
    case "/feedback":
      component = <Feedback />
      break
    case "/signin":
      component = <Signin />
      break
    case "/signup":
      component = <Signup />
      break
    case "/resortInfo":
        component = <ResortInfo />
      break
    case "/account":
      component = <Account />
      break
    default:
      component = <Home />
  }

  return (
    <div className='container'>
      <Navbar></Navbar>
      {component}
    </div>
  )
}

export default App
