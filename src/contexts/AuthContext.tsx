
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: () => boolean;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  cpf: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const translateError = (error: string): string => {
  const translations: { [key: string]: string } = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'User already registered': 'Usuário já cadastrado',
    'Email not confirmed': 'Email não confirmado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Password is too weak': 'Senha muito fraca',
    'User not found': 'Usuário não encontrado',
    'Email already exists': 'Email já existe',
    'Invalid email': 'Email inválido',
    'Signup is disabled': 'Cadastro desabilitado',
    'Too many requests': 'Muitas tentativas, tente novamente mais tarde',
    'Email rate limit exceeded': 'Limite de emails excedido, tente novamente mais tarde'
  };

  return translations[error] || error;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    console.log('🔄 Setting up auth state listener...');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log(`🔄 Auth state changed: ${event}`, session?.user ? 'User found' : 'No user');
        
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const isAdmin = session.user.email === 'psicologadaianesilva@outlook.com';
              
              // Try to get profile data
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              console.log('Profile data:', profile, 'Error:', error);

              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: profile?.full_name || session.user.user_metadata?.full_name || (isAdmin ? 'Dra. Daiane Silva' : ''),
                phone: profile?.phone || session.user.user_metadata?.phone || '',
                cpf: profile?.cpf || session.user.user_metadata?.cpf || '',
                avatar_url: profile?.avatar_url || '',
                role: isAdmin ? 'admin' : 'user'
              });
              
              // Create or update profile if it doesn't exist
              if (!profile && !error && !isAdmin) {
                console.log('Creating profile for user...');
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || '',
                    phone: session.user.user_metadata?.phone || '',
                    cpf: session.user.user_metadata?.cpf || ''
                  });
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                }
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
              const isAdmin = session.user.email === 'psicologadaianesilva@outlook.com';
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || (isAdmin ? 'Dra. Daiane Silva' : ''),
                phone: session.user.user_metadata?.phone || '',
                cpf: session.user.user_metadata?.cpf || '',
                avatar_url: '',
                role: isAdmin ? 'admin' : 'user'
              });
            }
            
            setIsLoading(false);
          }, 100);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          return;
        }

        console.log('Initial session check:', session ? 'Session found' : 'No session');
        
        if (!session && isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      console.log('Tentando fazer login com:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Erro no login:', error);
        
        // Se for o admin e der erro de credenciais inválidas, vamos tentar criar
        if (email === 'psicologadaianesilva@outlook.com' && error.message === 'Invalid login credentials') {
          console.log('Tentando criar usuário admin...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                full_name: 'Dra. Daiane Silva',
              }
            }
          });

          if (signUpError) {
            console.log('Erro ao criar admin:', signUpError);
            return { success: false, error: translateError(signUpError.message) };
          }

          console.log('Admin criado, tentando login novamente...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginError) {
            console.log('Erro no segundo login:', loginError);
            return { success: false, error: translateError(loginError.message) };
          }

          console.log('Login admin realizado com sucesso');
          return { success: true };
        }
        
        return { success: false, error: translateError(error.message) };
      }

      console.log('Login realizado com sucesso:', data);
      return { success: true };
    } catch (error) {
      console.error('Erro inesperado durante o login:', error);
      return { success: false, error: 'Erro inesperado durante o login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      console.log('Tentando cadastrar usuário:', { email: userData.email });
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            cpf: userData.cpf,
          }
        }
      });

      if (error) {
        console.log('Erro no cadastro:', error);
        return { success: false, error: translateError(error.message) };
      }

      console.log('Cadastro realizado com sucesso:', data);
      return { success: true };
    } catch (error) {
      console.error('Erro inesperado durante o cadastro:', error);
      return { success: false, error: 'Erro inesperado durante o cadastro' };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: translateError(error.message) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar senha' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, error: translateError(error.message) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao enviar email de recuperação' };
    }
  };

  const logout = async () => {
    try {
      // Clear session state first
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Erro ao fazer logout:', error);
      }
      
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Force reload even if there's an error
      window.location.href = '/';
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.email === 'psicologadaianesilva@outlook.com';
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updatePassword,
    resetPassword,
    isAdmin,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
