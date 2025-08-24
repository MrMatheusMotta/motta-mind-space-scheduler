
import { supabase } from "@/integrations/supabase/client";

export const checkAdminPermissions = async () => {
  try {
    console.log('🔍 Checking admin permissions...');
    
    // Verificar usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 Current user:', user?.email);
    
    if (userError || !user) {
      console.error('❌ No user found:', userError);
      return { isAdmin: false, error: 'Usuário não autenticado' };
    }
    
    // Verificar se é admin
    const isAdmin = user.email === 'psicologadaianesilva@outlook.com';
    console.log('🔑 Is admin:', isAdmin);
    
    if (!isAdmin) {
      return { isAdmin: false, error: 'Usuário não é administrador' };
    }
    
    // Testar acesso direto aos agendamentos
    console.log('📋 Testing appointment access...');
    const { data: testData, error: testError } = await supabase
      .from('appointments')
      .select('count', { count: 'exact' });
    
    console.log('📊 Appointment count test:', testData, 'Error:', testError);
    
    return { 
      isAdmin: true, 
      error: null,
      appointmentCount: testData?.[0]?.count || 0,
      testError: testError?.message 
    };
    
  } catch (error) {
    console.error('💥 Error checking admin permissions:', error);
    return { isAdmin: false, error: 'Erro ao verificar permissões' };
  }
};

export const debugAppointmentAccess = async () => {
  try {
    console.log('🔍 Starting appointment access debug...');
    
    // Verificar usuário
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Debug - Current user:', user?.email);
    
    // Tentar buscar agendamentos com diferentes abordagens
    console.log('📋 Method 1: Direct select all');
    const { data: method1, error: error1 } = await supabase
      .from('appointments')
      .select('*');
    console.log('Result 1:', method1?.length, 'Error:', error1?.message);
    
    console.log('📋 Method 2: Count only');
    const { count, error: error2 } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });
    console.log('Result 2 (count):', count, 'Error:', error2?.message);
    
    console.log('📋 Method 3: With profiles');
    const { data: method3, error: error3 } = await supabase
      .from('appointments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          phone
        )
      `);
    console.log('Result 3:', method3?.length, 'Error:', error3?.message);
    
    return {
      method1: { data: method1, error: error1 },
      method2: { count, error: error2 },
      method3: { data: method3, error: error3 }
    };
    
  } catch (error) {
    console.error('💥 Debug error:', error);
    return { error };
  }
};
