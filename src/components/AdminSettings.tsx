
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Key } from "lucide-react";

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const { updatePassword } = useAuth();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (currentPassword !== "daianemotta1234") {
      toast.error("Senha atual incorreta");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    const result = await updatePassword(newPassword);
    
    if (result.success) {
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Erro ao alterar senha");
    }
  };

  return (
    <Card className="border-rose-nude-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-nude-800">
          <Key className="h-5 w-5" />
          Configurações do Administrador
        </CardTitle>
        <CardDescription>
          Altere suas configurações de acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-rose-nude-700">
              Senha Atual
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-rose-nude-200 focus:border-rose-nude-400 pr-10"
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-rose-nude-700">
              Nova Senha
            </Label>
            <Input
              id="new-password"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-rose-nude-200 focus:border-rose-nude-400"
              placeholder="Digite sua nova senha"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-rose-nude-700">
              Confirmar Nova Senha
            </Label>
            <Input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-rose-nude-200 focus:border-rose-nude-400"
              placeholder="Confirme sua nova senha"
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
          >
            Alterar Senha
          </Button>
        </form>

        <div className="mt-6 p-4 bg-rose-nude-50 rounded-lg border border-rose-nude-200">
          <h4 className="font-medium text-rose-nude-800 mb-2">Informações Importantes:</h4>
          <ul className="text-sm text-rose-nude-600 space-y-1">
            <li>• A nova senha deve ter pelo menos 8 caracteres</li>
            <li>• Recomenda-se usar uma combinação de letras, números e símbolos</li>
            <li>• Após alterar a senha, você precisará fazer login novamente</li>
            <li>• Email atual: psicologadaianesilva@outlook.com</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
