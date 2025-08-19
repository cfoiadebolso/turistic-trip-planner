import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Clock, MapPin, Users, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  timeSpent: number; // em segundos
  tripsViewed: string[];
  searchQueries: string[];
  clickEvents: {
    type: string;
    timestamp: number;
    data?: any;
  }[];
  userSession: {
    startTime: number;
    lastActivity: number;
    pagesVisited: string[];
  };
}

interface AnalyticsComponentProps {
  isAdmin?: boolean;
}

export const AnalyticsComponent: React.FC<AnalyticsComponentProps> = ({ 
  isAdmin = false 
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Inicializar analytics
  useEffect(() => {
    initializeAnalytics();
    trackPageView();
    trackTimeSpent();
    
    // Cleanup ao sair
    return () => {
      updateLastActivity();
    };
  }, []);

  const initializeAnalytics = () => {
    const stored = localStorage.getItem('user_analytics');
    let data: AnalyticsData;
    
    if (stored) {
      data = JSON.parse(stored);
      // Atualizar sessão existente
      data.userSession.lastActivity = Date.now();
      data.userSession.pagesVisited.push(window.location.pathname);
    } else {
      // Criar nova sessão
      data = {
        pageViews: 0,
        timeSpent: 0,
        tripsViewed: [],
        searchQueries: [],
        clickEvents: [],
        userSession: {
          startTime: Date.now(),
          lastActivity: Date.now(),
          pagesVisited: [window.location.pathname]
        }
      };
    }
    
    setAnalytics(data);
    localStorage.setItem('user_analytics', JSON.stringify(data));
  };

  const trackPageView = () => {
    const stored = localStorage.getItem('user_analytics');
    if (stored) {
      const data = JSON.parse(stored);
      data.pageViews += 1;
      data.userSession.lastActivity = Date.now();
      localStorage.setItem('user_analytics', JSON.stringify(data));
      setAnalytics(data);
    }
  };

  const trackTimeSpent = () => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('user_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        data.timeSpent += 10; // Incrementar 10 segundos
        data.userSession.lastActivity = Date.now();
        localStorage.setItem('user_analytics', JSON.stringify(data));
        setAnalytics(data);
      }
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval);
  };

  const updateLastActivity = () => {
    const stored = localStorage.getItem('user_analytics');
    if (stored) {
      const data = JSON.parse(stored);
      data.userSession.lastActivity = Date.now();
      localStorage.setItem('user_analytics', JSON.stringify(data));
    }
  };

  // Funções públicas para tracking
  const trackTripView = (tripId: string) => {
    const stored = localStorage.getItem('user_analytics');
    if (stored) {
      const data = JSON.parse(stored);
      if (!data.tripsViewed.includes(tripId)) {
        data.tripsViewed.push(tripId);
      }
      data.clickEvents.push({
        type: 'trip_view',
        timestamp: Date.now(),
        data: { tripId }
      });
      localStorage.setItem('user_analytics', JSON.stringify(data));
      setAnalytics(data);
    }
  };

  const trackSearch = (query: string) => {
    const stored = localStorage.getItem('user_analytics');
    if (stored) {
      const data = JSON.parse(stored);
      data.searchQueries.push(query);
      data.clickEvents.push({
        type: 'search',
        timestamp: Date.now(),
        data: { query }
      });
      localStorage.setItem('user_analytics', JSON.stringify(data));
      setAnalytics(data);
    }
  };

  const trackClick = (elementType: string, elementData?: any) => {
    const stored = localStorage.getItem('user_analytics');
    if (stored) {
      const data = JSON.parse(stored);
      data.clickEvents.push({
        type: elementType,
        timestamp: Date.now(),
        data: elementData
      });
      localStorage.setItem('user_analytics', JSON.stringify(data));
      setAnalytics(data);
    }
  };

  // Expor funções globalmente para uso em outros componentes
  useEffect(() => {
    (window as any).trackTripView = trackTripView;
    (window as any).trackSearch = trackSearch;
    (window as any).trackClick = trackClick;
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  const getSessionDuration = (): string => {
    if (!analytics) return '0min';
    const duration = (analytics.userSession.lastActivity - analytics.userSession.startTime) / 1000;
    return formatTime(duration);
  };

  const getMostViewedTrips = (): string[] => {
    if (!analytics) return [];
    // Contar frequência de visualizações
    const tripCounts: { [key: string]: number } = {};
    analytics.clickEvents
      .filter(event => event.type === 'trip_view')
      .forEach(event => {
        const tripId = event.data?.tripId;
        if (tripId) {
          tripCounts[tripId] = (tripCounts[tripId] || 0) + 1;
        }
      });
    
    return Object.entries(tripCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tripId]) => tripId);
  };

  if (!analytics) return null;

  // Versão admin (dashboard completo)
  if (isAdmin) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Analytics do Usuário</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              <span className="text-sm text-gray-600">Visualizações</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{analytics.pageViews}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="text-green-600" size={20} />
              <span className="text-sm text-gray-600">Tempo Total</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatTime(analytics.timeSpent)}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="text-purple-600" size={20} />
              <span className="text-sm text-gray-600">Viagens Vistas</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{analytics.tripsViewed.length}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-orange-600" size={20} />
              <span className="text-sm text-gray-600">Sessão Atual</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{getSessionDuration()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Buscas Recentes</h3>
            <div className="space-y-2">
              {analytics.searchQueries.slice(-5).map((query, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  "{query}"
                </div>
              ))}
              {analytics.searchQueries.length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma busca realizada</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Viagens Mais Vistas</h3>
            <div className="space-y-2">
              {getMostViewedTrips().map((tripId, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  Viagem #{tripId}
                </div>
              ))}
              {getMostViewedTrips().length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma viagem visualizada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versão usuário (widget simples)
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <BarChart3 size={20} />
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
          <h3 className="font-semibold text-gray-800 mb-3">Sua Atividade</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Páginas vistas:</span>
              <span className="font-medium">{analytics.pageViews}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tempo online:</span>
              <span className="font-medium">{formatTime(analytics.timeSpent)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Viagens vistas:</span>
              <span className="font-medium">{analytics.tripsViewed.length}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Sessão atual:</span>
              <span className="font-medium">{getSessionDuration()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para usar analytics em outros componentes
export const useAnalytics = () => {
  const trackTripView = (tripId: string) => {
    if ((window as any).trackTripView) {
      (window as any).trackTripView(tripId);
    }
  };

  const trackSearch = (query: string) => {
    if ((window as any).trackSearch) {
      (window as any).trackSearch(query);
    }
  };

  const trackClick = (elementType: string, elementData?: any) => {
    if ((window as any).trackClick) {
      (window as any).trackClick(elementType, elementData);
    }
  };

  return { trackTripView, trackSearch, trackClick };
};