import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'recruiter' ? '/admin/companies' : '/');
    }
  }, [user, navigate]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
    if (errors.file) setErrors(prev => ({ ...prev, file: "" }));
  }

  const validate = () => {
    const newErrors = {};
    if (!input.fullname.trim() || input.fullname.trim().length < 2) newErrors.fullname = "Full name must be at least 2 characters.";
    if (!input.email.trim()) newErrors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(input.email.trim())) newErrors.email = "Enter a valid email address.";
    
    const cleanPhone = String(input.phoneNumber).replace(/\s/g, "");
    if (!cleanPhone) newErrors.phoneNumber = "Phone number is required.";
    else if (!PHONE_REGEX.test(cleanPhone)) newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    
    if (!input.password) newErrors.password = "Password is required.";
    else if (input.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    
    if (!input.role) newErrors.role = "Please select a role.";

    if (input.file) {
       const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
       if (!allowedTypes.includes(input.file.type)) {
           newErrors.file = "Please select a valid image file (JPEG, PNG, WebP).";
       } else if (input.file.size > 5 * 1024 * 1024) {
           newErrors.file = "Image must be less than 5MB.";
       }
    }
    
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-10">
      <Navbar />
      <div className="flex items-center justify-center pt-10 px-4">
        <div className="w-full max-w-lg">
           {/* Card */}
           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#6A38C2] to-[#9b55e5] px-8 py-6 text-white">
              <div className="flex items-center gap-3 mb-1">
                <UserPlus className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Create Account</h1>
              </div>
              <p className="text-purple-100 text-sm">Join us and find your dream job</p>
            </div>

            <form onSubmit={submitHandler} className="p-8 space-y-5">
              
              <div className="space-y-1.5">
                <Label htmlFor="fullname" className="font-semibold text-gray-700">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="e.g. Abhijeet"
                  className={`h-11 ${errors.fullname ? 'border-red-400 focus-visible:ring-red-300' : 'border-gray-200'}`}
                />
                {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
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

              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="font-semibold text-gray-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="10-digit mobile number"
                  className={`h-11 ${errors.phoneNumber ? 'border-red-400 focus-visible:ring-red-300' : 'border-gray-200'}`}
                />
                 {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Min. 6 characters"
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

              {/* Role & Profile Photo row */}
              <div className="flex flex-col sm:flex-row gap-5 pt-2">
                 <div className="flex-1 space-y-2">
                    <Label className="font-semibold text-gray-700">Join As</Label>
                    <RadioGroup
                      value={input.role}
                      onValueChange={(val) => {
                         setInput(prev => ({ ...prev, role: val }));
                         if (errors.role) setErrors(prev => ({ ...prev, role: "" }));
                      }}
                      className="flex gap-4"
                    >
                      <label
                        htmlFor="signup-student"
                        className={`flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border-2 flex-1 transition-all duration-200 ${input.role === 'student' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                      >
                        <RadioGroupItem value="student" id="signup-student" />
                        <span className="text-sm font-medium text-gray-700">Student</span>
                      </label>
                      <label
                        htmlFor="signup-recruiter"
                        className={`flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border-2 flex-1 transition-all duration-200 ${input.role === 'recruiter' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}
                      >
                        <RadioGroupItem value="recruiter" id="signup-recruiter" />
                        <span className="text-sm font-medium text-gray-700">Recruiter</span>
                      </label>
                    </RadioGroup>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                 </div>
                 
                 <div className="sm:w-1/3 space-y-2">
                    <Label htmlFor="profile" className="font-semibold text-gray-700">Profile Photo</Label>
                    <Input
                      id="profile"
                      accept="image/*"
                      type="file"
                      onChange={changeFileHandler}
                      className={`cursor-pointer ${errors.file ? 'border-red-400 text-red-500' : ''}`}
                    />
                    {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                 </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#6A38C2] hover:bg-[#5d07f1] text-white font-semibold text-base rounded-lg transition-colors duration-200 mt-4"
              >
                {loading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
                  : "Sign Up"
                }
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#6A38C2] hover:text-[#5d07f1] transition-colors">
                  Login instead
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup