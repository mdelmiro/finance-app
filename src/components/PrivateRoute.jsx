import { Navigate } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';

const PrivateRoute = ({ children }) => {
    const { user } = useFinance();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
