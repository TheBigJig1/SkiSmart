import '@/App.css'
import Navbar from './components/navbar'
import Weather from './routes/weather'
import Resort from './routes/resort'
import Home from './routes/home'
import Feedback from './routes/feedback'
import Signin from './routes/signin'
import Temp5 from './routes/temp5'

function App() {
  
  let component
  switch(window.location.pathname) {
    case "/":
      component = <Home />
      break
    case "/weather":
      component = <Weather />
      break
    case "/resort":
      component = <Resort />
      break
    case "/feedback":
      component = <Feedback />
      break

    case "/Sign In":
      component = <Signin />
      break

    case "/temp5":
      component = <Temp5></Temp5>
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
