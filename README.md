# 🌍 Turistic Trip Planner

Uma aplicação moderna e intuitiva para planejamento e participação em excursões turísticas, desenvolvida com React, TypeScript e Vite.

## ✨ Funcionalidades

### 🎯 Principais
- **Lista de Excursões**: Visualize todas as excursões disponíveis com filtros por categoria
- **Detalhes da Excursão**: Informações completas incluindo itinerário, preços e organizador
- **Sistema de Reservas**: Processo simplificado de reserva com confirmação
- **Perfil do Usuário**: Gerencie suas reservas e histórico de viagens

### 💳 Pagamentos
- **Processamento de Pagamentos**: Integração com múltiplos métodos (PIX, cartão)
- **Split de Pagamentos**: Dashboard para divisão de custos entre participantes
- **Histórico Financeiro**: Acompanhe todas as transações

### 💬 Comunicação
- **Chat em Tempo Real**: Comunicação entre participantes da excursão
- **Sistema de Notificações**: Alertas sobre atualizações e lembretes
- **Avaliações**: Sistema de rating para excursões e organizadores

### 📍 Localização
- **Geolocalização**: Integração com mapas para pontos de encontro
- **Cálculo de Distância**: Tempo estimado até o local de partida
- **Navegação**: Links diretos para aplicativos de mapas

### 📊 Analytics
- **Dashboard de Métricas**: Acompanhe estatísticas de uso
- **Relatórios**: Dados sobre participação e engajamento
- **Insights**: Análises de comportamento do usuário

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Persistência**: LocalStorage com hooks customizados
- **PWA**: Manifest e Service Worker ready

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/turistic-trip-planner.git

# Entre no diretório
cd turistic-trip-planner

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── PaymentComponent.tsx
│   ├── ChatComponent.tsx
│   ├── AnalyticsComponent.tsx
│   └── ...
├── hooks/              # Hooks customizados
│   ├── useUserData.ts
│   ├── useExcursions.ts
│   └── useLocalStorage.ts
├── pages/              # Páginas da aplicação
│   └── Index.tsx
├── lib/                # Utilitários
└── data/               # Dados mockados
```

## 🎨 Design System

- **Tema**: Suporte a modo claro/escuro
- **Responsivo**: Design mobile-first
- **Acessibilidade**: Componentes acessíveis por padrão
- **Consistência**: Sistema de design unificado

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=https://api.exemplo.com
VITE_MAPS_API_KEY=sua_chave_do_maps
```

### PWA

A aplicação está configurada como PWA com:
- Manifest para instalação
- Meta tags otimizadas
- Suporte offline (em desenvolvimento)

## 📱 Funcionalidades Mobile

- Interface responsiva
- Gestos touch otimizados
- Instalação como app nativo (PWA)
- Geolocalização nativa

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com coverage
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📈 Performance

- **Code Splitting**: Chunks otimizados por funcionalidade
- **Lazy Loading**: Carregamento sob demanda
- **Tree Shaking**: Eliminação de código não utilizado
- **Minificação**: Compressão com Terser
- **Caching**: Estratégias de cache otimizadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe Turistic Trip Planner
- **Design**: UI/UX Team
- **QA**: Quality Assurance Team

## 📞 Suporte

Para suporte, envie um email para suporte@turistic-trip-planner.com ou abra uma issue no GitHub.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
