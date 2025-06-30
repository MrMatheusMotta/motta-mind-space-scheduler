
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: ""
  });
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone || !formData.cpf || !formData.password) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!validateCPF(formData.cpf)) {
      toast.error("CPF inválido");
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone,
      cpf: formData.cpf
    });
    
    if (result.success) {
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      // Redirecionamento direto para login
      navigate("/login");
    } else {
      toast.error(result.error || "Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md border-rose-nude-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Criar Conta</CardTitle>
            <CardDescription className="text-rose-nude-600">
              Cadastre-se para agendar suas consultas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-rose-nude-700">Nome Completo *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-rose-nude-700">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-rose-nude-700">Telefone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(22) 99999-9999"
                  value={formatPhone(formData.phone)}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-rose-nude-700">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="123.456.789-00"
                  value={formatCPF(formData.cpf)}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-rose-nude-700">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-rose-nude-700">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-rose-nude-200 focus:border-rose-nude-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-rose-nude-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-rose-nude-700 hover:text-rose-nude-900 font-medium">
                  Entre aqui
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-rose-nude-50 rounded-lg border border-rose-nude-200">
              <p className="text-xs text-rose-nude-600">
                * Campos obrigatórios. Suas informações são necessárias para garantir a qualidade do atendimento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
