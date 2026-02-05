import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/employer/Dashboard";
import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";
import MyCompanies from "./pages/employer/MyCompanies";
import CompanyForm from "./pages/employer/CompanyForm";
import MyApplications from "./pages/candidate/MyApplications";
import EmployerApplications from "./pages/employer/EmployerApplications";
import LandingPage from "./pages/landing/LandingPage";
import AboutUs from "./pages/landing/AboutUs";
import Contact from "./pages/landing/Contact";
import Profile from "./pages/profile/Profile";
import CompanyDetails from "./pages/employer/CompanyDetails";
import JobForm from "./pages/jobs/JobForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import JobManagement from "./pages/admin/JobManagement";
import CompanyManagement from "./pages/admin/CompanyManagement";
import ApplicationManagement from "./pages/admin/ApplicationManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import MaintenanceMode from "./pages/MaintenanceMode";
import { useAuth } from "./contexts/AuthContext";

/**
 * Higher Order Component to protect routes based on role
 */
const ProtectedRoute = ({ children, allowedRole }) => {
    const { token, role } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />
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
                path: '/about',
                element: <AboutUs />
            },
            {
                path: '/contact',
                element: <Contact />
            },
            {
                path: '/maintenance',
                element: <MaintenanceMode />
            }
        ]
    },
    {
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/jobs',
                element: <Jobs />
            },
            {
                path: '/jobs/:id',
                element: <JobDetails />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            // Employer Only Routes
            {
                path: '/my-companies',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <MyCompanies />
                    </ProtectedRoute>
                )
            },
            {
                path: '/companies/new',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <CompanyForm key="companyCreate" />
                    </ProtectedRoute>
                )
            },
            {
                path: '/companies/:id',
                element: <CompanyDetails />
            },
            {
                path: '/companies/:id/edit',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <CompanyForm key="companyUpdate" />
                    </ProtectedRoute>
                )
            },
            {
                path: '/jobs/new',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <JobForm key="jobCreate" />
                    </ProtectedRoute>
                )
            },
            {
                path: '/jobs/:id/edit',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <JobForm key="jobUpdate" />
                    </ProtectedRoute>
                )
            },
            {
                path: '/employer/applications',
                element: (
                    <ProtectedRoute allowedRole="employer">
                        <EmployerApplications />
                    </ProtectedRoute>
                )
            },
            {
                path: '/my-applications',
                element: (
                    <ProtectedRoute allowedRole="seeker">
                        <MyApplications />
                    </ProtectedRoute>
                )
            },
            // Admin Routes
            {
                path: '/admin',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: '/admin/users',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <UserManagement />
                    </ProtectedRoute>
                )
            },
            {
                path: '/admin/management/jobs',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <JobManagement />
                    </ProtectedRoute>
                )
            },
            {
                path: '/admin/management/companies',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <CompanyManagement />
                    </ProtectedRoute>
                )
            },
            {
                path: '/admin/management/applications',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <ApplicationManagement />
                    </ProtectedRoute>
                )
            },
            {
                path: '/admin/activities',
                element: (
                    <ProtectedRoute allowedRole="admin">
                        <ActivityLogs />
                    </ProtectedRoute>
                )
            },
        ]
    },
])

export default router;
