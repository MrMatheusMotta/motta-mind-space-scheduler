
import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSettings from "@/components/AdminSettings";
import ServicesManager from "@/components/admin/ServicesManager";
import ClinicInfo from "@/components/admin/ClinicInfo";
import ScheduleManager from "@/components/admin/ScheduleManager";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import PaymentSettings from "@/components/admin/PaymentSettings";
import MessagesManager from "@/components/admin/MessagesManager";

const AdminPanel = () => {
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
            <ServicesManager />
          </TabsContent>

          <TabsContent value="clinic" className="space-y-6">
            <ClinicInfo />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <AvailabilityManager />
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagesManager />
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
