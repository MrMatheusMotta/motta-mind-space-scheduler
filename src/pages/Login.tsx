
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      toast.error(result.error || "Email ou senha incorretos");
    }
  };

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
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
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
