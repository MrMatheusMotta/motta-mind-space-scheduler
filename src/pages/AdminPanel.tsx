import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSettings from "@/components/AdminSettings";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Painel Administrativo
          </h1>
          <p className="text-rose-nude-600">
            Gerencie todas as configurações do seu consultório
          </p>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 bg-rose-nude-100">
            <TabsTrigger value="services" className="text-xs sm:text-sm">Serviços</TabsTrigger>
            <TabsTrigger value="clinic" className="text-xs sm:text-sm">Clínica</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Horários</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs sm:text-sm">Disponibilidade</TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm">Pagamento</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm">Mensagens</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Serviços</h2>
              <p className="text-rose-nude-600">Gerencie os serviços oferecidos pelo seu consultório.</p>
            </div>
          </TabsContent>

          <TabsContent value="clinic" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Clínica</h2>
              <p className="text-rose-nude-600">Informações e configurações da sua clínica.</p>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Horários</h2>
              <p className="text-rose-nude-600">Defina os horários de funcionamento do seu consultório.</p>
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Disponibilidade</h2>
              <p className="text-rose-nude-600">Gerencie a disponibilidade dos profissionais.</p>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Pagamento</h2>
              <p className="text-rose-nude-600">Configure as opções de pagamento aceitas.</p>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-rose-nude-800">Mensagens</h2>
              <p className="text-rose-nude-600">Visualize e responda as mensagens dos pacientes.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
