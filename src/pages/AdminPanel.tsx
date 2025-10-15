
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
import HomeContentManager from "@/components/admin/HomeContentManager";
import AboutContentManager from "@/components/admin/AboutContentManager";
import AppointmentsManager from "@/components/admin/AppointmentsManager";
import EvolutionsManager from "@/components/admin/EvolutionsManager";

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

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-11 bg-rose-nude-100 overflow-x-auto">
            <TabsTrigger value="home" className="text-xs sm:text-sm whitespace-nowrap">Página Inicial</TabsTrigger>
            <TabsTrigger value="about" className="text-xs sm:text-sm whitespace-nowrap">Sobre Mim</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm whitespace-nowrap">Agendamentos</TabsTrigger>
            <TabsTrigger value="evolutions" className="text-xs sm:text-sm whitespace-nowrap">Evoluções</TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm whitespace-nowrap">Serviços</TabsTrigger>
            <TabsTrigger value="clinic" className="text-xs sm:text-sm whitespace-nowrap">Clínica</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm whitespace-nowrap">Horários</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs sm:text-sm whitespace-nowrap">Disponibilidade</TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm whitespace-nowrap">Pagamento</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm whitespace-nowrap">Mensagens</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm whitespace-nowrap">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <HomeContentManager />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <AboutContentManager />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <AppointmentsManager />
          </TabsContent>

          <TabsContent value="evolutions" className="space-y-6">
            <EvolutionsManager />
          </TabsContent>

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
