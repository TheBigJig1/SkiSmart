import '@/styles/routes/signin.css';
import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logo.png';


const Signin = () => {
  return (
    <div className="signin-container">
      <div className="signin-background" style={{ backgroundImage: `url(${skiMountains})` }}>
        <div className="signin-form">
          <div className="text-center mb-8">
            <img src={logo} alt="Skismart Logo" className="mx-auto w-20 h-20 mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900">Skismart</h2>
          </div>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail:</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email" 
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="user@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Don't have an account? Create Account here
              </a>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute bottom-4 text-center w-full text-white text-sm">
        Contact Us: skismartwv@gmail.com (304) 449-4516
      </div>
    </div>
  );
};

 export default Signin