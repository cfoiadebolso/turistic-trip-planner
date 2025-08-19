import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationComponentProps {
  meetingPoint: {
    name: string;
    latitude: number;
    longitude: number;
    address: string;
  };
  departureTime: string;
}

export const LocationComponent: React.FC<LocationComponentProps> = ({
  meetingPoint,
  departureTime
}) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeToMeeting, setTimeToMeeting] = useState<string>('');

  // Calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calcular tempo até o encontro
  useEffect(() => {
    const updateTimeToMeeting = () => {
      const now = new Date();
      const departure = new Date(departureTime);
      const diff = departure.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeToMeeting('Partida já ocorreu');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeToMeeting(`${hours}h ${minutes}min`);
      } else {
        setTimeToMeeting(`${minutes}min`);
      }
    };

    updateTimeToMeeting();
    const interval = setInterval(updateTimeToMeeting, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [departureTime]);

  // Obter localização do usuário
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        
        setUserLocation(location);
        
        // Calcular distância
        const dist = calculateDistance(
          location.latitude,
          location.longitude,
          meetingPoint.latitude,
          meetingPoint.longitude
        );
        setDistance(dist);
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout ao obter localização';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Abrir no Google Maps
  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${meetingPoint.latitude},${meetingPoint.longitude}`;
    window.open(url, '_blank');
  };

  // Determinar cor baseada na distância
  const getDistanceColor = (dist: number) => {
    if (dist < 0.5) return 'text-green-600';
    if (dist < 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-800">Ponto de Encontro</h3>
      </div>

      {/* Meeting Point Info */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-800">{meetingPoint.name}</h4>
        <p className="text-sm text-gray-600">{meetingPoint.address}</p>
        <div className="flex items-center gap-2 mt-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            Partida em: <span className="font-medium">{timeToMeeting}</span>
          </span>
        </div>
      </div>

      {/* Location Actions */}
      <div className="space-y-3">
        <button
          onClick={getUserLocation}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Navigation size={16} />
          {loading ? 'Obtendo localização...' : 'Verificar minha distância'}
        </button>

        <button
          onClick={openInMaps}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <MapPin size={16} />
          Abrir no Google Maps
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Distance Info */}
      {distance !== null && userLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Distância:</span>
            <span className={`font-semibold ${getDistanceColor(distance)}`}>
              {distance < 1 
                ? `${Math.round(distance * 1000)}m` 
                : `${distance.toFixed(1)}km`
              }
            </span>
          </div>
          
          {distance < 0.1 && (
            <div className="mt-2 text-sm text-green-700 font-medium">
              🎯 Você está no ponto de encontro!
            </div>
          )}
          
          {distance > 5 && (
            <div className="mt-2 text-sm text-orange-700">
              ⚠️ Você está longe. Considere sair mais cedo.
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            Precisão: ±{Math.round(userLocation.accuracy)}m
          </div>
        </div>
      )}
    </div>
  );
};