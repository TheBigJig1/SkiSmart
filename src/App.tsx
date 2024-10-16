import '@/App.css'
import Navbar from './components/navbar'
import Temp1 from './routes/temp1'
import Temp2 from './routes/temp2'
import Home from './routes/home'
import Temp3 from './routes/temp3'
import Temp4 from './routes/temp4'
import Temp5 from './routes/temp5'
function App() {
  let component
  switch(window.location.pathname) {
    case "/":
      component = <Home />
      break
    case "/temp1":
      component = <Temp1></Temp1>
      break
    case "/temp2":
      component = <Temp2></Temp2>
      break
    case "/temp3":
      component = <Temp3></Temp3>
      break

    case "/temp4":
      component = <Temp4></Temp4>
      break

    case "/temp5":
      component = <Temp5></Temp5>
      break
  }

  return (
    <div className='container'>
      <Navbar></Navbar>
      {component}
    </div>
  )
}

export default App
