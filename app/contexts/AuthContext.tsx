import { createContext, useContext, useEffect, useState } from 'react';
import type { Account } from '~/models/Account';
import type { Profile } from '~/models/Profile';
import { AuthService, type LoginRequest, type RegisterRequest } from '~/service/auth.service';
import { ProfileService } from '~/service/profile.service';

interface AuthContextState {
    isAuthenticated: boolean;
    profile: Profile | null;
    account: Account | null;
    loading: boolean;
    error: string | null;
    login: (userData: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const defaultAuthContextState: AuthContextState = {
    isAuthenticated: false,
    loading: true,
    error: null,
    profile: null,
    account: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
};

export const AuthContext = createContext<AuthContextState>(defaultAuthContextState);

// Auth provider props interface
interface AuthProviderProps {
    children: React.ReactNode;
}

const authService = new AuthService();
const profileService = new ProfileService();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const [userData, errr] = await profileService.getProfile();
                const [accountData, errorAccount] = await authService.getUserInfo();
                if (errr) {
                    throw new Error(errr);
                }
                if (errorAccount) {
                    throw new Error(errorAccount);
                }
                console.log('userData', accountData);
                setAccount(accountData?.user ?? null);
                setUser(userData?.data ?? null);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Authentication error:', err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    const login = async (userData: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const [data, error] = await authService.login(userData);
            if (error) {
                setError(error.message);
                return;
            }
            localStorage.setItem('token', data?.access_token || '');
            const [data1, error1] = await profileService.getProfile();

            if (error1) {
                setError(String(error1));
            }

            setUser(data1?.data ?? null);
            setIsAuthenticated(true);
        } catch (err: any) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            // await authService.logout();
            localStorage.removeItem('token');
            setUser(null);
            setAccount(null);
            setIsAuthenticated(false);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Logout failed');
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        
    };

    const contextValue: AuthContextState = {
        isAuthenticated,
        profile: user,
        loading,
        error,
        login,
        logout,
        register,
        account,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
