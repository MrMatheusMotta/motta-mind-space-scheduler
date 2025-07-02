
import { useServicesSettings } from "./useServicesSettings";
import { useClinicSettings } from "./useClinicSettings";
import { usePaymentSettings } from "./usePaymentSettings";
import { useHomeContent } from "./useHomeContent";

export const useAdminSettings = () => {
  const { services, updateServices } = useServicesSettings();
  const { clinic, updateClinic } = useClinicSettings();
  const { payment, updatePayment } = usePaymentSettings();

  const settings = {
    services,
    clinic,
    payment
  };

  const updateSettings = (newSettings: any) => {
    if (newSettings.services) updateServices(newSettings.services);
    if (newSettings.clinic) updateClinic(newSettings.clinic);
    if (newSettings.payment) updatePayment(newSettings.payment);
  };

  return {
    settings,
    updateSettings,
    updateServices,
    updateClinic,
    updatePayment
  };
};

// Re-export the useHomeContent hook for convenience
export { useHomeContent } from "./useHomeContent";
