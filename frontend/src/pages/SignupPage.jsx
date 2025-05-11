import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Name is required';
    } else if (formData.fullname.length < 3) {
      newErrors.fullname = 'Name must be at least 3 characters';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase letters and numbers';
    }
    
    setErrors(newErrors);
    
    // Show toast notifications for validation errors
    if (Object.keys(newErrors).length > 0) {
      // Get the first error message to show
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');
    
    try {
      // Call the signup method from useAuthStore
      await signup(formData);
      
      // Success notification
      toast.success('Account created successfully!', { id: loadingToast });
      
      // Reset form and redirect to login page
      setFormData({
        fullname: '',
        email: '',
        password: ''
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Signup failed:', error);
      
      // Show appropriate error message based on server response
      const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Toast provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          },
        }}
      />

      <div className="flex w-full max-w-5xl">
        {/* Signup Form */}
        <div className="w-full md:w-1/2 p-8 bg-white rounded-l-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join our community today
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
          <input
                    id="fullname"
                    name="fullname"
            type="text"
                    autoComplete="name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>
                  )}
                </div>
        </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
          <input
                    id="email"
                    name="email"
            type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
        </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
          <input
            id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10 text-gray-900"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long and include uppercase, lowercase letters and numbers.
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
        
        {/* 6 Box Decoration */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-100 rounded-r-lg shadow-lg">
          <div className="w-full h-full p-8 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-indigo-800 mb-8">Join Our Community</h2>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {/* Box 1 */}
              <div className="bg-blue-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Connect</span>
              </div>
              
              {/* Box 2 */}
              <div className="bg-purple-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Share</span>
              </div>
              
              {/* Box 3 */}
              <div className="bg-pink-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Discover</span>
              </div>
              
              {/* Box 4 */}
              <div className="bg-yellow-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Learn</span>
              </div>
              
              {/* Box 5 */}
              <div className="bg-green-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Grow</span>
              </div>
              
              {/* Box 6 */}
              <div className="bg-red-500 rounded-lg shadow-md p-4 text-white flex items-center justify-center h-32 transform transition-transform hover:scale-105">
                <span className="font-bold text-lg">Create</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage; 