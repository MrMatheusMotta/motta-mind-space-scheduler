
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login, resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    console.log('Tentando fazer login com:', { email, password });
    const result = await login(email, password);
    
    if (result.success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      console.log('Erro no login:', result.error);
      toast.error(result.error || "Email ou senha incorretos");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Por favor, digite seu email");
      return;
    }

    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      setShowForgotPassword(false);
      setResetEmail("");
    } else {
      toast.error(result.error || "Erro ao enviar email de recuperação");
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
        <Header />
        
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md border-rose-nude-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">Recuperar Senha</CardTitle>
              <CardDescription className="text-rose-nude-600">
                Digite seu email para receber instruções de recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-rose-nude-700">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="border-rose-nude-200 focus:border-rose-nude-400"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-rose-nude-700 hover:text-rose-nude-900 font-medium"
                >
                  Voltar para o login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md border-rose-nude-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Entrar na Conta</CardTitle>
            <CardDescription className="text-rose-nude-600">
              Acesse sua conta para agendar consultas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-rose-nude-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-rose-nude-700">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-rose-nude-200 focus:border-rose-nude-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-nude-500 hover:text-rose-nude-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-rose-nude-600 hover:text-rose-nude-800 font-medium"
              >
                Esqueci minha senha
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-rose-nude-600">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-rose-nude-700 hover:text-rose-nude-900 font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
