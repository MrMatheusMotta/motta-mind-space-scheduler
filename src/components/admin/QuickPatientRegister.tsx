import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";

interface QuickPatientRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated: (userId: string, name: string) => void;
}

const QuickPatientRegister = ({ open, onOpenChange, onPatientCreated }: QuickPatientRegisterProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email) {
      toast.error("Nome completo e email são obrigatórios");
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setLoading(true);

    try {
      // Gerar senha temporária forte
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!1Aa";
      
      console.log('Criando novo paciente:', { email, fullName });
      
      // Criar usuário com signUp (não precisa de permissões admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        
        // Tratamento de erros específicos
        if (authError.message.includes('already registered')) {
          toast.error('Este email já está cadastrado no sistema');
        } else {
          toast.error(`Erro ao criar paciente: ${authError.message}`);
        }
        return;
      }

      if (!authData.user) {
        toast.error('Erro ao criar usuário - dados não retornados');
        return;
      }

      console.log('Usuário criado:', authData.user.id);

      // Criar perfil do paciente
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          phone: phone || null,
          cpf: cpf || null
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        toast.error(`Erro ao criar perfil do paciente: ${profileError.message}`);
        return;
      }

      console.log('Perfil criado com sucesso');
      
      toast.success(`Paciente ${fullName} cadastrado com sucesso! Email de confirmação enviado para ${email}`);
      onPatientCreated(authData.user.id, fullName);
      
      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setCpf("");
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro ao cadastrar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-rose-nude-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Cadastro Rápido de Paciente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome completo do paciente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-rose-nude-500 hover:bg-rose-nude-600"
            >
              {loading ? "Cadastrando..." : "Cadastrar Paciente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPatientRegister;
