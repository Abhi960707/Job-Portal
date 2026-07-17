
import React from 'react'
import Home from './components/auth/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Browse from './components/Browse'
import JobDescription from './components/JobDescription'
import Jobs from './components/Jobs'
import Profile from './components/Profile'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Admin/Recruiter views
import RecruiterDashboard from './components/admin/RecruiterDashboard'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import EditJob from './components/admin/EditJob'
import Applicants from './components/admin/Applicants'
import AllApplicants from './components/admin/AllApplicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  // Recruiter Dashboard & Management Routes
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: '/admin/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: '/admin/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/edit',
    element: <ProtectedRoute><EditJob /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: '/admin/applicants',
    element: <ProtectedRoute><AllApplicants /></ProtectedRoute>
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
