export interface Rating {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  tripId?: number;
  tripDestination?: string;
}

// Dados mockados de avaliações
export const ratingsData: Rating[] = [
  {
    id: 1,
    userId: 1,
    userName: "Ana Silva",
    userEmail: "ana.silva@email.com",
    rating: 5,
    comment: "Organizador excelente! Viagem muito bem planejada e executada. Recomendo!",
    date: "2025-01-20",
    tripId: 1,
    tripDestination: "Praia de Copacabana"
  },
  {
    id: 2,
    userId: 2,
    userName: "Carlos Souza",
    userEmail: "carlos.souza@email.com",
    rating: 4,
    comment: "Boa organização, apenas alguns pequenos atrasos no cronograma.",
    date: "2025-01-18",
    tripId: 1,
    tripDestination: "Praia de Copacabana"
  },
  {
    id: 3,
    userId: 3,
    userName: "Mariana Lima",
    userEmail: "mariana.lima@email.com",
    rating: 5,
    comment: "Perfeito! Atendimento impecável e viagem inesquecível.",
    date: "2025-01-15",
    tripId: 2,
    tripDestination: "Feirinha de Itaipava"
  },
  {
    id: 4,
    userId: 4,
    userName: "Ricardo Nunes",
    userEmail: "ricardo.nunes@email.com",
    rating: 3,
    comment: "Viagem ok, mas poderia ter mais atividades incluídas.",
    date: "2025-01-12",
    tripId: 2,
    tripDestination: "Feirinha de Itaipava"
  },
  {
    id: 5,
    userId: 5,
    userName: "Lúcia Pereira",
    userEmail: "lucia.pereira@email.com",
    rating: 5,
    comment: "Organizador muito atencioso e profissional. Viagem superou expectativas!",
    date: "2025-01-10",
    tripId: 3,
    tripDestination: "Passeio em Angra dos Reis"
  },
  {
    id: 6,
    userId: 6,
    userName: "João Santos",
    userEmail: "joao.santos@email.com",
    rating: 4,
    comment: "Muito bom! Apenas o transporte poderia ser mais confortável.",
    date: "2025-01-08",
    tripId: 3,
    tripDestination: "Passeio em Angra dos Reis"
  }
];

// Função para calcular estatísticas das avaliações
export const getRatingStats = (ratings: Rating[]) => {
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const totalRatings = ratings.length;
  const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = sumRatings / totalRatings;

  const ratingDistribution = ratings.reduce((dist, rating) => {
    dist[rating.rating as keyof typeof dist]++;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalRatings,
    ratingDistribution
  };
};

// Função para adicionar nova avaliação
export const addRating = (newRating: Omit<Rating, 'id'>) => {
  const id = Math.max(...ratingsData.map(r => r.id), 0) + 1;
  const rating: Rating = {
    ...newRating,
    id
  };
  ratingsData.push(rating);
  return rating;
};

// Função para obter avaliações por viagem
export const getRatingsByTrip = (tripId: number) => {
  return ratingsData.filter(rating => rating.tripId === tripId);
};

// Função para obter avaliações recentes
export const getRecentRatings = (limit: number = 5) => {
  return ratingsData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};