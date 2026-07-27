import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, User } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        const res = await authService.login(formData.email, formData.password);
        login(res.data.token, res.data);
        toast.success('Successfully logged in!');
      } else {
        const res = await authService.register(formData.fullName, formData.email, formData.password);
        login(res.data.token, res.data);
        toast.success('Registration successful!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-sm">
            <CheckSquare size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">TaskFlow</h1>
        <p className="text-slate-500 mb-8 font-medium">
          {isLoginMode ? 'Welcome back! Please login.' : 'Create an account to get started.'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left mb-6">
          {!isLoginMode && (
            <Input
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<User size={18} />}
            />
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail size={18} />}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            leftIcon={<Lock size={18} />}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-soft flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isLoginMode ? 'Continue' : 'Sign Up')}
          </button>
        </form>

        <p className="text-sm text-slate-500">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLoginMode ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
