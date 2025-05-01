import { createContext, useContext, useEffect, useState } from "react";
import { AuthService, type LoginRequest, type RegisterRequest } from "~/service/auth.service";
import { ProfileService, type Profile } from "~/service/profile.service";


interface AuthContextState {
    isAuthenticated: boolean,
    user: Profile | null,
    loading: boolean;
    error: string | null,
    login: (userData: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>
}


const defaultAuthContextState: AuthContextState = {
    isAuthenticated: false,
    loading: true,
    error: null,
    user: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {}
} 

export const AuthContext = createContext<AuthContextState>(defaultAuthContextState);

// Auth provider props interface
interface AuthProviderProps {
  children: React.ReactNode;
}

const authService = new AuthService();
const profileService = new ProfileService();

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    const [isAuthenticated,setIsAuthenticated ] = useState<boolean>(false);
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
           const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const [userData , errr]= await profileService.getProfile();
        if (errr) {
            throw new Error(errr)
        }
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthentication();
    }, [])

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
                setError(String(error1))
            }

            setUser(data1);
            setIsAuthenticated(true);
                
        }
        catch (err: any) {
            alert(err)
        }
        finally {
            setLoading(false)
        }


    }

    const logout = async () => {
        console.log('hello')

    }

    const register = async () => {
        console.log('hello')
    }

    const contextValue: AuthContextState = {
        isAuthenticated, user, loading, error, login, logout, register
    }

    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
}


export const useAuth = () => useContext(AuthContext)
