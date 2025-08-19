import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  User, 
  Bell, 
  CreditCard, 
  MessageSquare, 
  Mail, 
  Phone, 
  Save, 
  Eye, 
  EyeOff,
  Settings,
  Shield,
  Smartphone
} from 'lucide-react';

interface OrganizerProfile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePhoto: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  newBookings: boolean;
  paymentUpdates: boolean;
  tripReminders: boolean;
  customerMessages: boolean;
}

interface IntegrationSettings {
  mercadoPagoToken: string;
  whatsappToken: string;
  whatsappPhoneId: string;
  emailServiceKey: string;
  analyticsEnabled: boolean;
}

const OrganizerSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showTokens, setShowTokens] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para os dados do perfil
  const [profile, setProfile] = useState<OrganizerProfile>({
    name: 'João Silva',
    email: 'joao@excursoestijuca.com',
    phone: '+55 21 99999-9999',
    businessName: 'Excursões Tijuca',
    document: '12.345.678/0001-90',
    address: 'Rua das Palmeiras, 123',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20000-000',
    profilePhoto: 'https://placehold.co/150x150/3b82f6/ffffff?text=JS'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    newBookings: true,
    paymentUpdates: true,
    tripReminders: true,
    customerMessages: false
  });

  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    mercadoPagoToken: 'APP_USR_1234567890abcdef',
    whatsappToken: 'EAAxxxxxxxxxxxxxxx',
    whatsappPhoneId: '123456789012345',
    emailServiceKey: 'service_xxxxxxx',
    analyticsEnabled: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    alert('Configurações salvas com sucesso!');
  };

  const handleProfileChange = (field: keyof OrganizerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegrationChange = (field: keyof IntegrationSettings, value: string | boolean) => {
    setIntegrations(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'integrations', label: 'Integrações', icon: Settings }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
        
        <div className="flex items-center mb-6">
          <img 
            src={profile.profilePhoto} 
            alt="Foto do perfil" 
            className="w-20 h-20 rounded-full border-4 border-blue-100"
          />
          <div className="ml-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Alterar Foto
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG ou GIF. Máximo 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => handleProfileChange('businessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
            <input
              type="text"
              value={profile.document}
              onChange={(e) => handleProfileChange('document', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => handleProfileChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={profile.state}
              onChange={(e) => handleProfileChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="RJ">Rio de Janeiro</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="ES">Espírito Santo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <input
              type="text"
              value={profile.zipCode}
              onChange={(e) => handleProfileChange('zipCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais de Notificação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="text-blue-600 mr-3" size={20} />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">Receber notificações por email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Phone className="text-green-600 mr-3" size={20} />
              <div>
                <p className="font-medium text-gray-900">SMS</p>
                <p className="text-sm text-gray-600">Receber notificações por SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsNotifications}
                onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="text-green-600 mr-3" size={20} />
              <div>
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">Receber notificações pelo WhatsApp</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.whatsappNotifications}
                onChange={(e) => handleNotificationChange('whatsappNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Notificação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Novas Reservas</p>
              <p className="text-sm text-gray-600">Quando um cliente fizer uma nova reserva</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newBookings}
                onChange={(e) => handleNotificationChange('newBookings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Atualizações de Pagamento</p>
              <p className="text-sm text-gray-600">Quando houver mudanças no status de pagamento</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.paymentUpdates}
                onChange={(e) => handleNotificationChange('paymentUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Lembretes de Viagem</p>
              <p className="text-sm text-gray-600">Lembretes automáticos antes das viagens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.tripReminders}
                onChange={(e) => handleNotificationChange('tripReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Mensagens de Clientes</p>
              <p className="text-sm text-gray-600">Quando clientes enviarem mensagens no chat</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.customerMessages}
                onChange={(e) => handleNotificationChange('customerMessages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mercado Pago</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
            <div className="relative">
              <input
                type={showTokens ? 'text' : 'password'}
                value={integrations.mercadoPagoToken}
                onChange={(e) => handleIntegrationChange('mercadoPagoToken', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="APP_USR_xxxxxxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => setShowTokens(!showTokens)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showTokens ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Obtenha seu token em: <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mercado Pago Developers</a>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Business API</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
            <input
              type={showTokens ? 'text' : 'password'}
              value={integrations.whatsappToken}
              onChange={(e) => handleIntegrationChange('whatsappToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="EAAxxxxxxxxxxxxxxx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number ID</label>
            <input
              type="text"
              value={integrations.whatsappPhoneId}
              onChange={(e) => handleIntegrationChange('whatsappPhoneId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123456789012345"
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Configure em: <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta for Developers</a>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Service</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">EmailJS Service Key</label>
            <input
              type={showTokens ? 'text' : 'password'}
              value={integrations.emailServiceKey}
              onChange={(e) => handleIntegrationChange('emailServiceKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="service_xxxxxxx"
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Configure em: <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EmailJS</a>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Shield className="text-blue-600 mr-3" size={20} />
            <div>
              <p className="font-medium text-gray-900">Coleta de Dados</p>
              <p className="text-sm text-gray-600">Permitir coleta de dados para analytics</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.analyticsEnabled}
              onChange={(e) => handleIntegrationChange('analyticsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} className="mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrganizerSettings;