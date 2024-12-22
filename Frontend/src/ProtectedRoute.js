import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { bilkentId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = window.location.pathname;
  console.log('Current user:', user);

  // If user is not logged in, redirect to home page instead of login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but trying to access non-userHome paths
  if (user && !currentPath.includes(`/userHome/${user.sub}`)) {
    return <Navigate to={`/userHome/${user.sub}`} replace />;
  }

  // Check if user's bilkentId matches the URL parameter
  const numericBilkentId = parseInt(bilkentId);
  if (bilkentId && user.sub !== numericBilkentId.toString()) {
    return <Navigate to={`/userHome/${user.sub}`} replace />;
  }

  // Get role from JWT claims
  const userRole = user.role;
  console.log('User Role from JWT:', userRole);
  console.log('Allowed Roles:', allowedRoles);

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/userHome/${user.sub}`} replace />;
  }

  return children;
};
