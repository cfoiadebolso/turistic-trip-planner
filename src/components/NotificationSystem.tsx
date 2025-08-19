import React, { useState, useEffect } from 'react';
import { Bell, X, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  tripId?: string;
  read: boolean;
}

interface NotificationSystemProps {
  userId?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Simular notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular chegada de notificações aleatórias
      if (Math.random() > 0.95) { // 5% de chance a cada segundo
        const mockNotifications = [
          {
            type: 'info' as const,
            title: 'Ponto de Encontro Confirmado',
            message: 'Seu ponto de encontro para Copacabana foi confirmado: Praça Saens Peña às 07:00',
            tripId: '1'
          },
          {
            type: 'warning' as const,
            title: 'Mudança de Horário',
            message: 'A excursão para Itaipava teve o horário alterado para 09:00',
            tripId: '2'
          },
          {
            type: 'success' as const,
            title: 'Pagamento Confirmado',
            message: 'Seu pagamento foi processado com sucesso!',
            tripId: '3'
          },
          {
            type: 'info' as const,
            title: 'Nova Mensagem no Chat',
            message: 'O organizador enviou uma mensagem no chat da viagem',
            tripId: '1'
          }
        ];
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Manter apenas 10 notificações
    
    // Mostrar toast para notificação importante
    if (notificationData.type === 'warning' || notificationData.type === 'error') {
      toast({
        title: notificationData.title,
        description: notificationData.message,
        variant: notificationData.type === 'error' ? 'destructive' : 'default'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de notificações */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {notification.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para enviar notificações programaticamente
export const useNotifications = () => {
  const sendNotification = (notification: {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    tripId?: string;
  }) => {
    // Em produção, isso enviaria para um serviço de push notifications
    console.log('Enviando notificação:', notification);
    
    // Simular envio para localStorage para demonstração
    const notifications = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
    notifications.push({
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('pending_notifications', JSON.stringify(notifications));
  };

  return { sendNotification };
};

export default NotificationSystem;