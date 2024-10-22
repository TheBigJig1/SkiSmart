import '@/styles/components/navbar.css'

 function Navbar() {
    return (
    <div className='navbarContainer'>
        <div className='navLeft'>
            
            <a href='/'> SkiSmart</a>
            
            
        </div>
        <div className='imgContainer'>
        <img src = "src\assets\logo.png" />
        </div>
        <div className='navRight'><a href='/'>Home  </a>
        <a href='/resorts'>Resorts  </a>
        <a href='/feedback'>Feedback  </a>
        <a href='/signin'> Sign-in</a></div>
    </div>
    )
 }

 export default Navbar