import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
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

// Função para traduzir mensagens de erro do Supabase
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              const isAdmin = session.user.email === 'admin@daianemotta.com';
              
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: profile?.full_name || (isAdmin ? 'Administrador' : ''),
                phone: profile?.phone || '',
                cpf: profile?.cpf || '',
                role: isAdmin ? 'admin' : 'user'
              });
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
              const isAdmin = session.user.email === 'admin@daianemotta.com';
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: isAdmin ? 'Administrador' : '',
                role: isAdmin ? 'admin' : 'user'
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      console.log('Tentando fazer login com:', { email });
      
      // Login direto sem tentar criar usuário
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Erro no login:', error);
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    updatePassword,
    resetPassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
