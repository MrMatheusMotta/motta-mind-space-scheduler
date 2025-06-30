
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Buscar dados do perfil do usuário
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
                full_name: profile?.full_name || '',
                phone: profile?.phone || '',
                cpf: profile?.cpf || '',
                role: isAdmin ? 'admin' : 'user'
              });
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: session.user.email === 'admin@daianemotta.com' ? 'admin' : 'user'
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
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
        return { success: false, error: error.message };
      }

      // Se o usuário foi criado com sucesso, consideramos sucesso
      if (data.user) {
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o cadastro' };
    } finally {
      setIsLoading(false);
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
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
