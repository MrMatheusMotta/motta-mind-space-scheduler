
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  service TEXT NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'concluido')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de depoimentos
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de configurações do site
CREATE TABLE public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

-- Inserir configurações padrão do site
INSERT INTO public.site_settings (section, title, content) VALUES
('hero', 'Daiane Motta - Psicóloga', 'Terapia Cognitivo-Comportamental para transformar sua vida'),
('about', 'Sobre Mim', 'Sou Daiane Motta, psicóloga especializada em Terapia Cognitivo-Comportamental...'),
('services', 'Serviços', 'Oferecemos terapia individual, de casal e familiar'),
('contact', 'Contato', 'Entre em contato para agendar sua consulta');

-- Criar função para atualizar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para appointments
CREATE POLICY "Usuários podem ver seus próprios agendamentos" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios agendamentos" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para testimonials
CREATE POLICY "Todos podem ver depoimentos aprovados" ON public.testimonials
  FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Usuários podem criar depoimentos" ON public.testimonials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para site_settings
CREATE POLICY "Todos podem ver configurações do site" ON public.site_settings
  FOR SELECT USING (true);

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'admin@daianemotta.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para admin nas configurações do site
CREATE POLICY "Admins podem atualizar configurações" ON public.site_settings
  FOR UPDATE USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins podem inserir configurações" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

-- Políticas para admin visualizar todos os dados
CREATE POLICY "Admins podem ver todos os perfis" ON public.profiles
  FOR SELECT USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins podem ver todos os agendamentos" ON public.appointments
  FOR ALL USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Admins podem gerenciar depoimentos" ON public.testimonials
  FOR ALL USING (public.is_admin((SELECT email FROM auth.users WHERE id = auth.uid())));
