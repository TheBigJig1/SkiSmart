import '@/styles/components/navbar.css'

 function Navbar() {
    return (
    <div className='navbarContainer'>
        <div className='navLeft'>
            <a href='/'>SkiSmart</a>
        </div>
        <div className='navRight'>
            <a href='/'>Home</a>
            <a href='/temp1'>Resorts</a>
            <a href='/temp2'>Feedback</a>
            <a href='/temp3'>Sign-in</a>
        </div>
    </div>
    )
 }

 export default Navbar