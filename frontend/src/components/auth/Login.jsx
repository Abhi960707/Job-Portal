import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, setToken } from '@/redux/authSlice'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'recruiter' ? '/admin/companies' : '/');
    }
  }, [user, navigate]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!input.email.trim()) newErrors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(input.email.trim())) newErrors.email = "Enter a valid email address.";
    if (!input.password) newErrors.password = "Password is required.";
    else if (input.password.length < 4) newErrors.password = "Password must be at least 4 characters.";
    if (!input.role) newErrors.role = "Please select a role.";
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setToken(res.data.token)); // Store token for Authorization header fallback
        navigate(res.data.user.role === 'recruiter' ? '/admin/companies' : '/');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#6A38C2] to-[#9b55e5] px-8 py-6 text-white">
              <div className="flex items-center gap-3 mb-1">
                <LogIn className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
              </div>
              <p className="text-purple-100 text-sm">Login to access your account</p>
            </div>

            <form onSubmit={submitHandler} className="p-8 space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="you@example.com"
                  className={`h-11 ${errors.email ? 'border-red-400 focus-visible:ring-red-300' : 'border-gray-200'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className={`h-11 pr-10 ${errors.password ? 'border-red-400 focus-visible:ring-red-300' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Login As</Label>
                <RadioGroup
                  value={input.role}
                  onValueChange={(val) => {
                    setInput(prev => ({ ...prev, role: val }));
                    if (errors.role) setErrors(prev => ({ ...prev, role: "" }));
                  }}
                  className="flex gap-6"
                >
                  <label
                    htmlFor="login-student"
                    className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 flex-1 transition-all duration-200 ${input.role === 'student' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                  >
                    <RadioGroupItem value="student" id="login-student" />
                    <span className="text-sm font-medium text-gray-700">Student</span>
                  </label>
                  <label
                    htmlFor="login-recruiter"
                    className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 flex-1 transition-all duration-200 ${input.role === 'recruiter' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                  >
                    <RadioGroupItem value="recruiter" id="login-recruiter" />
                    <span className="text-sm font-medium text-gray-700">Recruiter</span>
                  </label>
                </RadioGroup>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#6A38C2] hover:bg-[#5d07f1] text-white font-semibold text-base rounded-lg transition-colors duration-200 mt-2"
              >
                {loading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                  : "Sign In"
                }
              </Button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-[#6A38C2] hover:text-[#5d07f1] transition-colors">
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login