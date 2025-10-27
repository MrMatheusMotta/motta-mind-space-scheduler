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
      console.log('Criando novo paciente via edge function:', { email, fullName });
      
      // Obter token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar autenticado para criar pacientes');
        return;
      }

      // Chamar edge function para criar paciente (com privilégios de admin)
      const response = await fetch('https://ovmldtiwaeffsdyremnj.supabase.co/functions/v1/create-patient', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName,
          phone: phone || null,
          cpf: cpf || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erro ao criar paciente:', result);
        
        if (result.error?.includes('already registered') || result.error?.includes('already exists')) {
          toast.error('Este email já está cadastrado no sistema');
        } else if (response.status === 403) {
          toast.error('Acesso negado. Apenas administradores podem criar pacientes.');
        } else {
          toast.error(result.error || 'Erro ao criar paciente');
        }
        return;
      }

      console.log('Paciente criado com sucesso:', result);
      
      toast.success(`Paciente ${fullName} cadastrado com sucesso!`);
      onPatientCreated(result.userId, fullName);
      
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
