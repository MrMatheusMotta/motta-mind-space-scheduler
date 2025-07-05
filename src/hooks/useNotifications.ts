import { useState } from "react";

interface NotificationSettings {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  reminderHours: number[];
  webhookUrl?: string;
  emailConfig?: {
    apiKey: string;
    fromEmail: string;
  };
}

const defaultSettings: NotificationSettings = {
  emailEnabled: false,
  whatsappEnabled: false,
  reminderHours: [24, 2], // 24h e 2h antes
  webhookUrl: undefined,
  emailConfig: undefined
};

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

  const sendReminder = async (appointment: any, type: 'email' | 'whatsapp') => {
    // Preparado para integração futura com serviços de email/WhatsApp
    console.log(`Sending ${type} reminder for appointment:`, appointment);
    
    if (type === 'email' && settings.emailEnabled && settings.emailConfig) {
      // Integração com serviço de email (ex: Resend)
      // TODO: Implementar quando necessário
    }
    
    if (type === 'whatsapp' && settings.whatsappEnabled && settings.webhookUrl) {
      // Integração com webhook do Whatsapp
      try {
        await fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'appointment_reminder',
            appointment,
            message: `Lembrete: Você tem consulta marcada para ${appointment.date} às ${appointment.time}`
          })
        });
      } catch (error) {
        console.error('Error sending WhatsApp reminder:', error);
      }
    }
  };

  return {
    settings,
    updateSettings,
    sendReminder
  };
};