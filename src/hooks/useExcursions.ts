import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface Organizer {
  name: string;
  rating: number;
  reviews: number;
}

interface Excursion {
  id: number;
  destination: string;
  neighborhood: string;
  date: string;
  time: string;
  meetingPoint: string;
  price: number;
  spotsLeft: number;
  category: string;
  image: string;
  organizer: Organizer;
  itinerary: string;
  passengers: string[];
  minParticipants: number;
  currentParticipants: number;
  isPast: boolean;
}

const initialExcursions: Excursion[] = [
  {
    id: 1,
    destination: "Praia de Copacabana",
    neighborhood: "Tijuca",
    date: "2025-10-26",
    time: "07:00",
    meetingPoint: "Praça Saens Peña (metrô)",
    price: 95.50,
    spotsLeft: 5,
    category: "praia",
    image: "https://images.unsplash.com/photo-1518623380242-d992d3c57b37?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    organizer: { name: "Beto Viagens", rating: 4.8, reviews: 120 },
    itinerary: "Saída da Tijuca, parada para café da manhã (não incluso), dia livre na praia de Copacabana, retorno às 17h.",
    passengers: ["Ana Silva", "Carlos Souza", "Mariana Lima", "Pedro Costa", "Juliana Alves", "Fernando Martins"],
    minParticipants: 0,
    currentParticipants: 6,
    isPast: false,
  },
  {
    id: 2,
    destination: "Feirinha de Itaipava",
    neighborhood: "Tijuca",
    date: "2025-08-25",
    time: "08:30",
    meetingPoint: "Shopping Tijuca (porta principal)",
    price: 70.00,
    spotsLeft: 0,
    category: "compras",
    image: "https://images.unsplash.com/photo-1610991926259-d5808c1f3a2d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    organizer: { name: "Rio Serra Tour", rating: 4.9, reviews: 85 },
    itinerary: "Viagem tranquila até a serra, 4 horas livres para compras na Feirinha de Itaipava, parada para lanche no retorno.",
    passengers: ["Ricardo Nunes", "Lúcia Pereira", "Beatriz Santos"],
    minParticipants: 0,
    currentParticipants: 15,
    isPast: false,
  },
  {
    id: 3,
    destination: "Passeio em Angra dos Reis",
    neighborhood: "Tijuca",
    date: "2025-09-10",
    time: "06:00",
    meetingPoint: "Rua Uruguai, 480",
    price: 180.00,
    spotsLeft: 8,
    category: "turismo",
    image: "https://images.unsplash.com/photo-1577623483428-b12a74c39b23?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    organizer: { name: "Beto Viagens", rating: 4.8, reviews: 120 },
    itinerary: "Passeio de escuna pelas principais ilhas de Angra, com parada para mergulho e almoço (incluso).",
    passengers: ["Marcos Andrade", "Sofia Ribeiro", "Tiago Almeida", "Clara Ferreira", "Eduardo Barros", "Helena Gomes", "Fábio Rocha", "Isabela Pinto"],
    minParticipants: 15,
    currentParticipants: 7,
    isPast: false,
  },
  {
    id: 4,
    destination: "Tour Histórico em Petrópolis",
    neighborhood: "Tijuca",
    date: "2024-07-20",
    time: "08:00",
    meetingPoint: "Praça Afonso Pena",
    price: 110.00,
    spotsLeft: 0,
    category: "turismo",
    image: "https://images.unsplash.com/photo-1621680218912-33f7a8c3d9a1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    organizer: { name: "Rio Serra Tour", rating: 4.9, reviews: 85 },
    itinerary: "Visita ao Museu Imperial, Palácio de Cristal e tempo livre na Rua Teresa para compras.",
    passengers: ["Maria Clara"],
    minParticipants: 0,
    currentParticipants: 20,
    isPast: true,
  }
];

export function useExcursions() {
  const [excursions, setExcursions] = useLocalStorage<Excursion[]>('excursions_data', initialExcursions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carregamento de dados da API
  const refreshExcursions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados locais (em produção, seria uma chamada real de API)
      const updatedExcursions = excursions.map(excursion => ({
        ...excursion,
        isPast: new Date(excursion.date) < new Date()
      }));
      
      setExcursions(updatedExcursions);
    } catch (err) {
      setError('Erro ao carregar excursões');
    } finally {
      setLoading(false);
    }
  }, [excursions, setExcursions]);

  // Adicionar participante a uma excursão
  const addParticipant = useCallback((excursionId: number, participantName: string) => {
    const updatedExcursions = excursions.map(excursion => {
      if (excursion.id === excursionId) {
        return {
          ...excursion,
          passengers: [...excursion.passengers, participantName],
          currentParticipants: excursion.currentParticipants + 1,
          spotsLeft: Math.max(0, excursion.spotsLeft - 1)
        };
      }
      return excursion;
    });
    
    setExcursions(updatedExcursions);
  }, [excursions, setExcursions]);

  // Remover participante de uma excursão
  const removeParticipant = useCallback((excursionId: number, participantName: string) => {
    const updatedExcursions = excursions.map(excursion => {
      if (excursion.id === excursionId) {
        return {
          ...excursion,
          passengers: excursion.passengers.filter(p => p !== participantName),
          currentParticipants: Math.max(0, excursion.currentParticipants - 1),
          spotsLeft: excursion.spotsLeft + 1
        };
      }
      return excursion;
    });
    
    setExcursions(updatedExcursions);
  }, [excursions, setExcursions]);

  // Buscar excursão por ID
  const getExcursionById = useCallback((id: number) => {
    return excursions.find(excursion => excursion.id === id);
  }, [excursions]);

  // Filtrar excursões
  const getExcursionsByCategory = useCallback((category: string) => {
    return excursions.filter(excursion => excursion.category === category);
  }, [excursions]);

  const getUpcomingExcursions = useCallback(() => {
    return excursions.filter(excursion => !excursion.isPast);
  }, [excursions]);

  const getPastExcursions = useCallback(() => {
    return excursions.filter(excursion => excursion.isPast);
  }, [excursions]);

  return {
    excursions,
    loading,
    error,
    refreshExcursions,
    addParticipant,
    removeParticipant,
    getExcursionById,
    getExcursionsByCategory,
    getUpcomingExcursions,
    getPastExcursions
  };
}