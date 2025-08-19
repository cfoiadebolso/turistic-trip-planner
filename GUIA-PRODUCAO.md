# 🚀 Guia Completo para Produção - Turistic Trip Planner

## 📋 Visão Geral
Este guia explica PASSO A PASSO como transformar o MVP atual em um sistema de produção completo, com todas as ferramentas externas configuradas e funcionando.

## 🎯 Objetivo
Transformar o frontend React atual em uma aplicação completa de produção com:
- ✅ Backend funcional (Supabase)
- ✅ Banco de dados PostgreSQL
- ✅ Autenticação completa
- ✅ Pagamentos (Mercado Pago + PIX)
- ✅ Chat em tempo real
- ✅ Notificações WhatsApp
- ✅ Deploy automático
- ✅ Analytics e monitoramento

---

## 🔧 Stack Tecnológica Completa

### 1. **Backend: Supabase** (Gratuito até 50k usuários)
- **Função:** PostgreSQL + APIs REST + Auth + Realtime + Storage
- **Tempo de configuração:** 3-4 horas
- **Custo:** Gratuito até 500MB DB

### 2. **Pagamentos: Mercado Pago** 
- **Função:** PIX + Cartão + Split de pagamentos
- **Tempo de configuração:** 2-3 horas
- **Custo:** 3.99% + R$ 0,39 por transação

### 3. **Deploy: Vercel**
- **Função:** Hospedagem + CDN + Deploy automático
- **Tempo de configuração:** 30 minutos
- **Custo:** Gratuito até 100GB bandwidth

### 4. **Comunicação: WhatsApp Business API**
- **Função:** Notificações automáticas + Chat de grupo
- **Tempo de configuração:** 2-3 horas
- **Custo:** Gratuito até 1.000 conversas/mês, depois R$ 0,05-0,09 por conversa

#### 4.1 Configurar Meta Business e WhatsApp

1. **Criar Meta Business Account:**
   - Acesse: [business.facebook.com](https://business.facebook.com)
   - Clique em "Criar conta"
   - Nome: "Turistic Trip Planner"
   - Adicione seu número de telefone comercial

2. **Configurar WhatsApp Business:**
   - No Meta Business → "WhatsApp" → "Começar"
   - Adicione número de telefone (deve ser diferente do pessoal)
   - Verificar número via SMS/chamada

3. **Criar App no Meta for Developers:**
   - Acesse: [developers.facebook.com](https://developers.facebook.com)
   - "Meus Apps" → "Criar App" → "Empresa"
   - Nome: "Turistic Trip Planner API"
   - Adicionar produto: "WhatsApp Business API"

#### 4.2 Configurar Credenciais e Tokens

1. **Obter Token de Acesso:**
   - No painel do App → "WhatsApp" → "API Setup"
   - Copie o **Token de Acesso Temporário** (válido por 24h)
   - Anote o **Phone Number ID**
   - Anote o **WhatsApp Business Account ID**

2. **Gerar Token Permanente:**
```bash
# No terminal, execute:
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=SEU_TOKEN_TEMPORARIO"

# Para gerar token permanente, vá em:
# Meta Business → Configurações → Usuários do sistema → Adicionar
# Nome: "WhatsApp API Bot"
# Função: "Administrador"
# Gerar token com escopo: whatsapp_business_messaging
```

3. **Configurar variáveis de ambiente:**
```env
# .env.local
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

#### 4.3 Configurar Templates de Mensagem

1. **No Meta Business Manager:**
   - WhatsApp → "Gerenciador de mensagens" → "Templates"
   - Criar templates para cada situação:

2. **Template de Confirmação de Reserva:**
```
Nome: booking_confirmation
Categoria: TRANSACTIONAL
Idioma: pt_BR

Texto:
🎉 *Reserva Confirmada!*

Olá {{1}}, sua reserva foi confirmada!

📅 *Excursão:* {{2}}
🗓️ *Data:* {{3}}
👥 *Passageiros:* {{4}}
💰 *Valor:* R$ {{5}}

📍 *Ponto de Encontro:* {{6}}
⏰ *Horário:* {{7}}

Em caso de dúvidas, responda esta mensagem.

Boa viagem! 🚌✨
```

3. **Template de Lembrete:**
```
Nome: trip_reminder
Categoria: UTILITY
Idioma: pt_BR

Texto:
⏰ *Lembrete de Viagem*

Olá {{1}}! Sua excursão é amanhã:

📅 *{{2}}* às *{{3}}*
📍 *Local:* {{4}}

✅ *Checklist:*
• Documento com foto
• Protetor solar
• Água
• Lanche (se necessário)

Nos vemos lá! 🚌
```

4. **Template de Cancelamento:**
```
Nome: booking_cancelled
Categoria: TRANSACTIONAL
Idioma: pt_BR

Texto:
❌ *Reserva Cancelada*

Olá {{1}}, informamos que sua reserva foi cancelada:

📅 *Excursão:* {{2}}
🗓️ *Data:* {{3}}
💰 *Valor:* R$ {{4}}

💳 O reembolso será processado em até 5 dias úteis.

Para nova reserva, acesse: {{5}}
```

#### 4.4 Configurar Webhook

1. **Criar endpoint webhook:**
```javascript
// pages/api/webhooks/whatsapp.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Verificação do webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  }
  
  if (req.method === 'POST') {
    // Processar mensagens recebidas
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(entry => {
        entry.changes?.forEach(change => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            
            messages?.forEach(async (message) => {
              const from = message.from;
              const messageBody = message.text?.body;
              
              // Salvar mensagem no Supabase
              await supabase.from('chat_messages').insert({
                phone_number: from,
                message: messageBody,
                direction: 'incoming',
                timestamp: new Date()
              });
              
              // Resposta automática
              if (messageBody?.toLowerCase().includes('ajuda')) {
                await sendWhatsAppMessage(from, 
                  'Olá! 👋\n\nPara suporte, acesse: https://seu-site.com/suporte\n\nOu fale com nossa equipe pelo chat do site.'
                );
              }
            });
          }
        });
      });
    }
    
    res.status(200).json({ status: 'success' });
  }
}
```

2. **Configurar webhook no Meta:**
   - No App → "WhatsApp" → "Configuration"
   - Webhook URL: `https://seu-dominio.vercel.app/api/webhooks/whatsapp`
   - Verify Token: `meu_token_secreto_123`
   - Webhook Fields: `messages`

#### 4.5 Implementar Funções de Envio

```javascript
// lib/whatsapp.js
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    throw error;
  }
};

export const sendWhatsAppTemplate = async (to, templateName, parameters) => {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'pt_BR' },
            components: [{
              type: 'body',
              parameters: parameters.map(param => ({ type: 'text', text: param }))
            }]
          }
        })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar template WhatsApp:', error);
    throw error;
  }
};

// Função para confirmar reserva
export const sendBookingConfirmation = async (bookingData) => {
  const parameters = [
    bookingData.user_name,
    bookingData.excursion_title,
    bookingData.date,
    bookingData.passengers.toString(),
    bookingData.total.toFixed(2),
    bookingData.meeting_point,
    bookingData.meeting_time
  ];
  
  return await sendWhatsAppTemplate(
    bookingData.phone_number,
    'booking_confirmation',
    parameters
  );
};

// Função para lembrete de viagem
export const sendTripReminder = async (bookingData) => {
  const parameters = [
    bookingData.user_name,
    bookingData.excursion_title,
    bookingData.meeting_time,
    bookingData.meeting_point
  ];
  
  return await sendWhatsAppTemplate(
    bookingData.phone_number,
    'trip_reminder',
    parameters
  );
};
```

#### 4.6 Integrar com o Sistema

```javascript
// Exemplo de uso no componente de pagamento
import { sendBookingConfirmation } from '../lib/whatsapp';

const handlePaymentSuccess = async (paymentData) => {
  // Atualizar status no banco
  await supabase
    .from('bookings')
    .update({ status: 'confirmed', payment_status: 'paid' })
    .eq('id', paymentData.bookingId);
  
  // Enviar confirmação via WhatsApp
  const booking = await supabase
    .from('bookings')
    .select('*, excursions(*), profiles(*)')
    .eq('id', paymentData.bookingId)
    .single();
  
  await sendBookingConfirmation({
    phone_number: booking.profiles.phone,
    user_name: booking.profiles.name,
    excursion_title: booking.excursions.title,
    date: new Date(booking.excursions.date).toLocaleDateString('pt-BR'),
    passengers: booking.passengers,
    total: booking.total,
    meeting_point: booking.excursions.meeting_point,
    meeting_time: booking.excursions.meeting_time
  });
};
```

### 5. **Email: EmailJS**
- **Função:** Confirmações e notificações por email
- **Tempo de configuração:** 1 hora
- **Custo:** Gratuito até 200 emails/mês, depois $15/mês

#### 5.1 Configurar EmailJS

1. **Criar conta:** [emailjs.com](https://www.emailjs.com)
2. **Configurar serviço de email:**
   - "Email Services" → "Add New Service"
   - Escolha: "Gmail" ou "Outlook"
   - Autorize acesso à sua conta

3. **Criar templates:**
```html
<!-- Template: booking_confirmation -->
<h2>🎉 Reserva Confirmada!</h2>
<p>Olá {{user_name}},</p>
<p>Sua reserva foi confirmada com sucesso!</p>

<div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
  <h3>📅 Detalhes da Excursão</h3>
  <p><strong>Excursão:</strong> {{excursion_title}}</p>
  <p><strong>Data:</strong> {{date}}</p>
  <p><strong>Horário:</strong> {{time}}</p>
  <p><strong>Passageiros:</strong> {{passengers}}</p>
  <p><strong>Valor Total:</strong> R$ {{total}}</p>
</div>

<div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
  <h3>📍 Informações do Encontro</h3>
  <p><strong>Local:</strong> {{meeting_point}}</p>
  <p><strong>Horário:</strong> {{meeting_time}}</p>
</div>

<p>Em caso de dúvidas, entre em contato conosco.</p>
<p>Boa viagem! 🚌✨</p>
```

4. **Implementar no projeto:**
```bash
npm install @emailjs/browser
```

```javascript
// lib/emailjs.js
import emailjs from '@emailjs/browser';

// Configurar EmailJS
emailjs.init(process.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendBookingEmail = async (bookingData) => {
  try {
    const templateParams = {
      user_name: bookingData.user_name,
      user_email: bookingData.user_email,
      excursion_title: bookingData.excursion_title,
      date: bookingData.date,
      time: bookingData.time,
      passengers: bookingData.passengers,
      total: bookingData.total,
      meeting_point: bookingData.meeting_point,
      meeting_time: bookingData.meeting_time
    };

    const result = await emailjs.send(
      process.env.VITE_EMAILJS_SERVICE_ID,
      'booking_confirmation',
      templateParams
    );

    console.log('Email enviado:', result.text);
    return result;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

export const sendReminderEmail = async (bookingData) => {
  const templateParams = {
    user_name: bookingData.user_name,
    user_email: bookingData.user_email,
    excursion_title: bookingData.excursion_title,
    date: bookingData.date,
    meeting_point: bookingData.meeting_point,
    meeting_time: bookingData.meeting_time
  };

  return await emailjs.send(
    process.env.VITE_EMAILJS_SERVICE_ID,
    'trip_reminder',
    templateParams
  );
};
```

5. **Configurar variáveis:**
```env
# .env.local
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### 6. **Analytics: Google Analytics 4**
- **Função:** Tracking de usuários e conversões
- **Tempo de configuração:** 1 hora
- **Custo:** Gratuito

#### 6.1 Configurar Google Analytics

1. **Criar conta:** [analytics.google.com](https://analytics.google.com)
2. **Criar propriedade:**
   - Nome: "Turistic Trip Planner"
   - Fuso horário: "Brasil"
   - Moeda: "Real brasileiro (R$)"

3. **Configurar stream de dados:**
   - Plataforma: "Web"
   - URL: "https://seu-dominio.vercel.app"
   - Nome: "Website Principal"

4. **Implementar no projeto:**
```bash
npm install gtag
```

```javascript
// lib/analytics.js
export const GA_TRACKING_ID = process.env.VITE_GA_TRACKING_ID;

// Inicializar Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Rastrear visualizações de página
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Rastrear eventos personalizados
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Eventos específicos do negócio
export const trackBookingStart = (excursionId) => {
  trackEvent('booking_start', 'ecommerce', `excursion_${excursionId}`);
};

export const trackBookingComplete = (excursionId, value) => {
  trackEvent('purchase', 'ecommerce', `excursion_${excursionId}`, value);
};

export const trackExcursionView = (excursionId) => {
  trackEvent('view_item', 'ecommerce', `excursion_${excursionId}`);
};
```

5. **Adicionar ao HTML:**
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

6. **Configurar eventos de conversão:**
```javascript
// Exemplo de uso nos componentes
import { trackBookingComplete, trackExcursionView } from '../lib/analytics';

// No componente de excursão
const ExcursionCard = ({ excursion }) => {
  const handleView = () => {
    trackExcursionView(excursion.id);
  };
  
  useEffect(() => {
    handleView();
  }, []);
};

// No componente de pagamento
const handlePaymentSuccess = (paymentData) => {
  trackBookingComplete(paymentData.excursionId, paymentData.total);
};
```

7. **Configurar metas no GA4:**
   - Acesse "Configurar" → "Eventos" → "Criar evento"
   - Criar metas para:
     - `booking_start` (início de reserva)
     - `purchase` (compra concluída)
     - `view_item` (visualização de excursão)

8. **Configurar relatórios personalizados:**
   - "Explorar" → "Criar exploração"
   - Métricas importantes:
     - Taxa de conversão
     - Valor médio por transação
     - Excursões mais populares
     - Origem do tráfego

---

## 📝 Passo a Passo Detalhado

### **ETAPA 1: Configurar Backend (Supabase) - DETALHADO**

#### 1.1 Criar Projeto Supabase
```bash
🔗 PASSO A PASSO:
1. Acesse: https://supabase.com
2. Clique em "Start your project" 
3. Faça login com GitHub (recomendado)
4. Clique "New Project"
5. Organização: Selecione sua organização
6. Nome: "turistic-trip-planner"
7. Database Password: Crie uma senha FORTE (anote!)
8. Região: South America (São Paulo) - sa-east-1
9. Pricing Plan: Free tier
10. Clique "Create new project"

⏱️ AGUARDE: 2-3 minutos para provisionar

📝 ANOTE ESSAS INFORMAÇÕES:
- Project URL: https://[seu-projeto].supabase.co
- API Key (anon/public): eyJ... (encontre em Settings > API)
- Database Password: [sua-senha]
```

#### 1.2 Configurar Autenticação
```bash
🔗 CONFIGURAR AUTH:
1. No dashboard Supabase → Authentication → Settings
2. Site URL: http://localhost:8080 (desenvolvimento)
3. Redirect URLs: 
   - http://localhost:8080
   - https://[seu-dominio].vercel.app (produção)
4. Auth Providers:
   ✅ Email (habilitado por padrão)
   ✅ Google (opcional - configurar OAuth)
   ✅ Phone (opcional - para WhatsApp)

📧 CONFIGURAR EMAIL:
1. Authentication → Settings → SMTP Settings
2. Enable custom SMTP: ON
3. SMTP Host: smtp.gmail.com (ou seu provedor)
4. SMTP Port: 587
5. SMTP User: seu-email@gmail.com
6. SMTP Pass: [senha de app do Gmail]
7. SMTP Sender name: Excursões Tijuca
```

#### 1.3 Criar Estrutura do Banco de Dados
```sql
-- 🗃️ EXECUTAR NO SQL EDITOR DO SUPABASE
-- (Dashboard → SQL Editor → New Query)

-- 1. Tabela de perfis de usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  whatsapp_number TEXT,
  is_organizer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de organizadores
CREATE TABLE organizers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  mercadopago_access_token TEXT,
  commission_rate DECIMAL(5,4) DEFAULT 0.15, -- 15% padrão
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de excursões
CREATE TABLE excursions (
  id SERIAL PRIMARY KEY,
  destination TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  meeting_point TEXT NOT NULL,
  meeting_latitude DECIMAL(10, 8),
  meeting_longitude DECIMAL(11, 8),
  price DECIMAL(10,2) NOT NULL,
  spots_total INTEGER NOT NULL,
  spots_taken INTEGER DEFAULT 0,
  min_participants INTEGER DEFAULT 0,
  organizer_id INTEGER REFERENCES organizers(id),
  category TEXT NOT NULL,
  itinerary TEXT NOT NULL,
  image_url TEXT,
  whatsapp_group_link TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de reservas
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  excursion_id INTEGER REFERENCES excursions(id) ON DELETE CASCADE,
  booking_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  amount_paid DECIMAL(10,2),
  organizer_amount DECIMAL(10,2),
  platform_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de avaliações
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  excursion_id INTEGER REFERENCES excursions(id) ON DELETE CASCADE,
  organizer_id INTEGER REFERENCES organizers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de mensagens do chat
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  excursion_id INTEGER REFERENCES excursions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location')),
  is_organizer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de analytics
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de notificações
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'reminder', 'general')),
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 1.4 Configurar RLS (Row Level Security) e Políticas
```sql
-- 🔒 HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 👤 POLÍTICAS PARA PROFILES
CREATE POLICY "Usuários podem ver perfis públicos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir próprio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 🏢 POLÍTICAS PARA ORGANIZERS
CREATE POLICY "Todos podem ver organizadores" ON organizers FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar perfil de organizador" ON organizers FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Organizadores podem atualizar próprio perfil" ON organizers FOR UPDATE USING (user_id = auth.uid());

-- 🚌 POLÍTICAS PARA EXCURSIONS
CREATE POLICY "Todos podem ver excursões ativas" ON excursions FOR SELECT USING (status = 'active');
CREATE POLICY "Organizadores podem criar excursões" ON excursions FOR INSERT WITH CHECK (organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid()));
CREATE POLICY "Organizadores podem atualizar próprias excursões" ON excursions FOR UPDATE USING (organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid()));

-- 🎫 POLÍTICAS PARA BOOKINGS
CREATE POLICY "Usuários podem ver próprias reservas" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Organizadores podem ver reservas de suas excursões" ON bookings FOR SELECT USING (excursion_id IN (SELECT id FROM excursions WHERE organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid())));
CREATE POLICY "Usuários podem criar reservas" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias reservas" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- ⭐ POLÍTICAS PARA RATINGS
CREATE POLICY "Todos podem ver avaliações" ON ratings FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar avaliações" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias avaliações" ON ratings FOR UPDATE USING (auth.uid() = user_id);

-- 💬 POLÍTICAS PARA CHAT_MESSAGES
CREATE POLICY "Participantes podem ver mensagens da excursão" ON chat_messages FOR SELECT USING (
  excursion_id IN (
    SELECT excursion_id FROM bookings WHERE user_id = auth.uid() AND status = 'confirmed'
    UNION
    SELECT id FROM excursions WHERE organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Participantes podem enviar mensagens" ON chat_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND excursion_id IN (
    SELECT excursion_id FROM bookings WHERE user_id = auth.uid() AND status = 'confirmed'
    UNION
    SELECT id FROM excursions WHERE organizer_id IN (SELECT id FROM organizers WHERE user_id = auth.uid())
  )
);

-- 📊 POLÍTICAS PARA ANALYTICS_EVENTS
CREATE POLICY "Usuários podem inserir próprios eventos" ON analytics_events FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admins podem ver todos os eventos" ON analytics_events FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE is_organizer = true));

-- 🔔 POLÍTICAS PARA NOTIFICATIONS
CREATE POLICY "Usuários podem ver próprias notificações" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Sistema pode criar notificações" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar próprias notificações" ON notifications FOR UPDATE USING (auth.uid() = user_id);
```

#### 1.5 Criar Funções e Triggers
```sql
-- 🔄 FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 📝 TRIGGERS PARA ATUALIZAR updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_excursions_updated_at BEFORE UPDATE ON excursions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 👤 FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE APÓS SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 📊 FUNÇÃO PARA ATUALIZAR RATING DO ORGANIZADOR
CREATE OR REPLACE FUNCTION update_organizer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizers 
  SET 
    rating = (SELECT AVG(rating) FROM ratings WHERE organizer_id = NEW.organizer_id),
    total_reviews = (SELECT COUNT(*) FROM ratings WHERE organizer_id = NEW.organizer_id)
  WHERE id = NEW.organizer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🎯 TRIGGER PARA ATUALIZAR RATING AUTOMATICAMENTE
CREATE TRIGGER update_organizer_rating_trigger
  AFTER INSERT OR UPDATE ON ratings
  FOR EACH ROW EXECUTE PROCEDURE update_organizer_rating();
```

### **ETAPA 2: Integrar Frontend com Supabase**

#### 2.1 Instalar Dependências
```bash
npm install @supabase/supabase-js
```

#### 2.2 Configurar Cliente Supabase
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA_URL_SUPABASE'
const supabaseKey = 'SUA_CHAVE_PUBLICA'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 2.3 Substituir Dados Mock
```javascript
// Substituir excursionsData por:
const { data: excursions } = await supabase
  .from('excursions')
  .select('*')
  .order('date', { ascending: true })
```

### **ETAPA 3: Implementar Autenticação**

#### 3.1 Configurar Auth no Supabase
```bash
1. Supabase Dashboard → Authentication → Settings
2. Habilitar: Email, Google, Phone (opcional)
3. Configurar URLs de redirect
```

#### 3.2 Implementar Login
```javascript
// Substituir LoginModal por autenticação real
const handleLogin = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({ email })
  if (!error) alert('Link enviado para seu email!')
}
```

### **ETAPA 4: Configurar Pagamentos (Mercado Pago)**

#### 4.1 Criar Conta e Obter Credenciais

**Tempo estimado:** 45 minutos
**Custo:** Gratuito (taxas: 4,99% + R$ 0,39 por transação)

```bash
1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login com sua conta Mercado Pago
3. Vá em "Suas integrações" → "Criar aplicação"
4. Preencha os dados:
   - Nome: "Turistic Trip Planner"
   - Modelo de negócio: "Marketplace"
   - Produtos: "Checkout Pro", "Split de pagamentos"

5. Anote as credenciais:
```

```env
# .env.local
VITE_MERCADOPAGO_PUBLIC_KEY_TEST=TEST-xxxxxxxx
VITE_MERCADOPAGO_ACCESS_TOKEN_TEST=TEST-xxxxxxxx
VITE_MERCADOPAGO_PUBLIC_KEY_PROD=APP_USR-xxxxxxxx
VITE_MERCADOPAGO_ACCESS_TOKEN_PROD=APP_USR-xxxxxxxx
```

#### 4.2 Configurar Split de Pagamentos

```bash
1. No painel do Mercado Pago:
   - Vá em "Marketplace" → "Configurações"
   - Ative "Split de pagamentos"
   - Configure taxa da plataforma: 15%

2. Configurar contas dos organizadores:
```

```javascript
// Função para criar conta de organizador
const createOrganizerAccount = async (organizerData) => {
  const response = await fetch('https://api.mercadopago.com/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      site_id: 'MLB',
      email: organizerData.email
    })
  });
  return response.json();
};
```

#### 4.3 Configurar Webhooks

```bash
1. No painel: Vá em "Webhooks" → "Criar webhook"
2. URL: https://seu-dominio.vercel.app/api/webhooks/mercadopago
3. Eventos selecionados:
   - payment.created
   - payment.updated
   - merchant_order.updated
```

```javascript
// pages/api/webhooks/mercadopago.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body;
  
  try {
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Buscar detalhes do pagamento
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      }).then(res => res.json());
      
      // Atualizar status no Supabase
      await supabase
        .from('bookings')
        .update({ 
          payment_status: payment.status,
          payment_id: paymentId
        })
        .eq('external_reference', payment.external_reference);
        
      // Enviar notificação
      if (payment.status === 'approved') {
        await sendBookingConfirmation(payment.external_reference);
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### 4.4 Implementar no Frontend

```bash
npm install @mercadopago/sdk-react
```

```javascript
// components/MercadoPagoCheckout.jsx
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

const MercadoPagoCheckout = ({ bookingData }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  
  const createPreference = async () => {
    const preference = {
      items: [{
        title: bookingData.excursion.title,
        quantity: bookingData.passengers,
        unit_price: bookingData.excursion.price,
        currency_id: 'BRL'
      }],
      marketplace_fee: bookingData.total * 0.15, // 15% para plataforma
      external_reference: bookingData.id,
      back_urls: {
        success: `${window.location.origin}/booking/success`,
        failure: `${window.location.origin}/booking/failure`,
        pending: `${window.location.origin}/booking/pending`
      },
      auto_return: 'approved'
    };
    
    const response = await fetch('/api/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preference)
    });
    
    const { id } = await response.json();
    setPreferenceId(id);
  };
  
  useEffect(() => {
    createPreference();
  }, []);
  
  return (
    <div>
      {preferenceId && (
        <Wallet 
          initialization={{ preferenceId }}
          customization={{ texts: { valueProp: 'smart_option' } }}
        />
      )}
    </div>
  );
};
```

```javascript
// pages/api/create-preference.js
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const preference = new Preference(client);
    const result = await preference.create({ body: req.body });
    
    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Failed to create preference' });
  }
}
```

### **ETAPA 5: Deploy para Produção (Vercel)**

**Tempo estimado:** 30 minutos
**Custo:** Gratuito para projetos pessoais

#### 5.1 Preparar Deploy

1. **Instalar Vercel CLI:**
```bash
npm i -g vercel
```

2. **Fazer login:**
```bash
vercel login
```

3. **Configurar projeto:**
```bash
# Na raiz do projeto
vercel

# Seguir as instruções:
# ? Set up and deploy "~/turistic-trip-planner"? [Y/n] y
# ? Which scope do you want to deploy to? [Use arrows to move, type to filter]
# ? Link to existing project? [y/N] n
# ? What's your project's name? turistic-trip-planner
# ? In which directory is your code located? ./
```

4. **Deploy para produção:**
```bash
vercel --prod
```

#### 5.2 Configurar Variáveis de Ambiente

1. **No painel Vercel:**
   - Acesse: [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecione seu projeto
   - Vá em "Settings" → "Environment Variables"

2. **Adicionar todas as variáveis:**
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx

# WhatsApp
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123

# EmailJS
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Outros
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

#### 5.3 Configurar Domínio Personalizado

1. **No painel Vercel:**
   - "Settings" → "Domains"
   - "Add Domain"
   - Digite: `seudominio.com`

2. **Configurar DNS:**
   - No seu provedor de domínio
   - Adicionar registro CNAME:
     - Nome: `www`
     - Valor: `cname.vercel-dns.com`
   - Adicionar registro A:
     - Nome: `@`
     - Valor: `76.76.19.61`

#### 5.4 Configurar Redirects e Headers

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **ETAPA 6: Notificações e Comunicação**

#### 6.1 EmailJS para Emails
```bash
1. Criar conta em emailjs.com
2. Configurar template de confirmação
3. Integrar no frontend
```

#### 6.2 WhatsApp Business API
```bash
1. Meta Business → WhatsApp Business API
2. Configurar webhook para notificações
3. Templates para confirmação de reserva
```

---

## ⚡ Checklist de Produção

### Funcionalidades Essenciais
- [ ] ✅ Frontend responsivo (FEITO)
- [ ] 🔄 Backend com Supabase
- [ ] 🔄 Autenticação real
- [ ] 🔄 Pagamentos com Stripe
- [ ] 🔄 Deploy automático
- [ ] 🔄 Notificações por email/WhatsApp

### Funcionalidades Avançadas (Fase 2)
- [ ] Chat em tempo real (Supabase Realtime)
- [ ] Push notifications (PWA)
- [ ] Geolocalização (Google Maps API)
- [ ] Analytics (Google Analytics)
- [ ] SEO otimizado

---

## 💰 Custos Estimados (Primeiros 6 meses)

| Serviço | Custo Mensal | Limite Gratuito |
|---------|--------------|----------------|
| Supabase | R$ 0 | 50k usuários |
| Stripe | 3.99% + R$ 0,39 | Por transação |
| Vercel | R$ 0 | 100GB bandwidth |
| Domínio | R$ 40/ano | - |
| **Total** | **~R$ 40/ano** | **Até escalar** |

---

## 🎯 Próximos Passos Imediatos

1. **Hoje:** Criar conta Supabase + configurar tabelas (2h)
2. **Amanhã:** Integrar frontend com Supabase (4h)
3. **Dia 3:** Configurar Stripe + pagamentos (3h)
4. **Dia 4:** Deploy Vercel + testes (2h)
5. **Dia 5:** Configurar notificações (2h)

**Total:** ~13 horas para MVP em produção

---

## 📞 Suporte

- **Supabase:** Documentação excelente + Discord ativo
- **Stripe:** Docs + Suporte via chat
- **Vercel:** Docs + GitHub Issues

**Dica:** Comece pelo Supabase. É a base de tudo e tem a melhor documentação para iniciantes.

---

## **CHECKLIST COMPLETO DE PRODUÇÃO**

### ✅ **1. Backend (Supabase)**
- [ ] Projeto criado no Supabase
- [ ] Todas as 8 tabelas criadas (profiles, organizers, excursions, bookings, ratings, chat_messages, analytics_events, notifications)
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de segurança configuradas
- [ ] Funções e triggers implementados
- [ ] Autenticação configurada (email + redes sociais)
- [ ] SMTP configurado para emails
- [ ] Variáveis de ambiente copiadas

### ✅ **2. Pagamentos (Mercado Pago)**
- [ ] Conta Mercado Pago criada
- [ ] Aplicação configurada no painel
- [ ] Split de pagamentos ativado (15%)
- [ ] Webhooks configurados
- [ ] SDK instalado no frontend
- [ ] API de preferências implementada
- [ ] Testes realizados com credenciais de teste
- [ ] Credenciais de produção configuradas

### ✅ **3. WhatsApp Business API**
- [ ] Meta Business Account criada
- [ ] WhatsApp Business configurado
- [ ] App no Meta for Developers criado
- [ ] Token permanente gerado
- [ ] 3 templates de mensagem aprovados
- [ ] Webhook configurado e testado
- [ ] Funções de envio implementadas
- [ ] Integração com sistema testada

### ✅ **4. EmailJS**
- [ ] Conta EmailJS criada
- [ ] Serviço de email configurado (Gmail/Outlook)
- [ ] Templates de email criados
- [ ] SDK instalado no projeto
- [ ] Funções de envio implementadas
- [ ] Testes de envio realizados

### ✅ **5. Google Analytics 4**
- [ ] Conta Google Analytics criada
- [ ] Propriedade configurada
- [ ] Stream de dados configurado
- [ ] Código de tracking implementado
- [ ] Eventos personalizados configurados
- [ ] Metas de conversão definidas
- [ ] Relatórios personalizados criados

### ✅ **6. Deploy (Vercel)**
- [ ] Vercel CLI instalado
- [ ] Projeto configurado no Vercel
- [ ] Deploy de produção realizado
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Domínio personalizado configurado (opcional)
- [ ] DNS configurado
- [ ] Headers de segurança configurados

### ✅ **7. Testes Finais**
- [ ] Cadastro de usuário funcionando
- [ ] Login/logout funcionando
- [ ] Criação de excursão funcionando
- [ ] Processo de reserva completo testado
- [ ] Pagamento via Mercado Pago testado
- [ ] Notificações WhatsApp sendo enviadas
- [ ] Emails sendo enviados
- [ ] Analytics rastreando eventos
- [ ] Chat funcionando
- [ ] Dashboard administrativo funcionando

---

## **CUSTOS DETALHADOS**

### **Custos Iniciais (Setup)**
- Domínio: **R$ 40-80/ano** (opcional)
- Certificado SSL: **Gratuito** (Vercel)
- **Total inicial: R$ 0-80**

### **Custos Mensais (até 1.000 usuários/mês)**

| Serviço | Plano Gratuito | Custo Pago |
|---------|----------------|-------------|
| **Supabase** | 500MB DB, 2GB bandwidth | R$ 100/mês (Pro) |
| **Mercado Pago** | - | 4,99% + R$ 0,39/transação |
| **Vercel** | 100GB bandwidth | R$ 100/mês (Pro) |
| **WhatsApp API** | 1.000 conversas | R$ 0,05-0,09/conversa |
| **EmailJS** | 200 emails | R$ 75/mês (1.000 emails) |
| **Google Analytics** | Ilimitado | Gratuito |

### **Cenários de Custo**

**🟢 Cenário Inicial (0-100 usuários/mês):**
- Supabase: Gratuito
- Vercel: Gratuito
- WhatsApp: ~R$ 25
- EmailJS: Gratuito
- Mercado Pago: ~R$ 50 (10 transações)
- **Total: R$ 75/mês**

**🟡 Cenário Crescimento (100-500 usuários/mês):**
- Supabase: R$ 100
- Vercel: Gratuito
- WhatsApp: ~R$ 125
- EmailJS: R$ 75
- Mercado Pago: ~R$ 250 (50 transações)
- **Total: R$ 550/mês**

**🔴 Cenário Escala (500+ usuários/mês):**
- Supabase: R$ 100
- Vercel: R$ 100
- WhatsApp: ~R$ 250
- EmailJS: R$ 75
- Mercado Pago: ~R$ 500 (100 transações)
- **Total: R$ 1.025/mês**

---

## **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **📅 Dia 1 - Backend e Banco (3-4 horas)**
1. **Configurar Supabase** (1h30)
   - Criar projeto
   - Configurar tabelas
   - Configurar RLS e políticas
   - Configurar autenticação

2. **Integrar Frontend com Supabase** (1h30)
   - Instalar dependências
   - Configurar cliente
   - Substituir dados mock
   - Testar autenticação

### **📅 Dia 2 - Pagamentos (2-3 horas)**
1. **Configurar Mercado Pago** (1h30)
   - Criar conta e app
   - Configurar split
   - Configurar webhooks

2. **Implementar no Frontend** (1h)
   - Instalar SDK
   - Implementar checkout
   - Testar pagamentos

### **📅 Dia 3 - Notificações (3-4 horas)**
1. **WhatsApp Business API** (2h)
   - Configurar Meta Business
   - Criar templates
   - Implementar webhook
   - Testar envios

2. **EmailJS** (1h)
   - Configurar serviço
   - Criar templates
   - Implementar envios

### **📅 Dia 4 - Analytics e Deploy (2 horas)**
1. **Google Analytics** (30min)
   - Configurar propriedade
   - Implementar tracking
   - Configurar eventos

2. **Deploy Vercel** (1h)
   - Configurar projeto
   - Configurar variáveis
   - Deploy produção
   - Configurar domínio

3. **Testes Finais** (30min)
   - Testar fluxo completo
   - Verificar notificações
   - Validar analytics

**⏱️ Tempo total estimado: 8-13 horas (distribuído em 4 dias)**

---

## **PRÓXIMOS PASSOS APÓS PRODUÇÃO**

### **🚀 Melhorias Imediatas (Semana 1-2)**
1. **SEO e Performance**
   - Configurar meta tags
   - Otimizar imagens
   - Implementar sitemap
   - Configurar robots.txt

2. **Monitoramento**
   - Configurar alertas de erro
   - Monitorar performance
   - Configurar backup automático

### **📈 Funcionalidades Avançadas (Mês 1-2)**
1. **Sistema de Avaliações Avançado**
   - Fotos nas avaliações
   - Resposta do organizador
   - Sistema de moderação

2. **Programa de Fidelidade**
   - Pontos por viagem
   - Descontos progressivos
   - Convites para amigos

3. **Relatórios Avançados**
   - Dashboard financeiro
   - Relatórios de ocupação
   - Análise de satisfação

### **🌟 Expansão (Mês 3+)**
1. **App Mobile**
   - React Native
   - Push notifications
   - Geolocalização

2. **Integrações Avançadas**
   - Google Maps API
   - Previsão do tempo
   - Integração com hotéis

3. **Marketplace**
   - Múltiplos organizadores
   - Sistema de comissões
   - Verificação de organizadores

---

## **🆘 SUPORTE E TROUBLESHOOTING**

### **Problemas Comuns**

**❌ Erro de CORS no Supabase:**
```bash
# Adicionar domínio nas configurações do Supabase
# Settings → API → URL Configuration
```

**❌ Webhook não funcionando:**
```bash
# Verificar se a URL está acessível
# Verificar logs no Vercel
# Testar endpoint manualmente
```

**❌ Pagamentos não processando:**
```bash
# Verificar credenciais do Mercado Pago
# Verificar se webhook está configurado
# Verificar logs de erro
```

### **Recursos de Ajuda**
- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Mercado Pago:** [developers.mercadopago.com](https://developers.mercadopago.com)
- **WhatsApp API:** [developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)

---

*🎉 **Parabéns!** Seguindo este guia completo, você terá transformado seu MVP em uma aplicação de produção robusta, escalável e pronta para receber usuários reais. O sistema estará preparado para crescer junto com seu negócio!*