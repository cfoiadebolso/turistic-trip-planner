import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { MapPin, Users, DollarSign, Calendar, TrendingUp, Clock, Star, MessageSquare } from 'lucide-react';
import { getRecentRatings, getRatingStats } from '../../data/ratingsData';

// Dados mockados - substituir por API calls
const dashboardData = {
  stats: {
    totalTrips: 12,
    activeTrips: 8,
    totalPassengers: 156,
    monthlyRevenue: 15420.50
  },
  recentTrips: [
    { id: 1, destination: 'Praia de Copacabana', date: '2025-10-26', passengers: 6, status: 'Confirmada' },
    { id: 2, destination: 'Feirinha de Itaipava', date: '2025-08-25', passengers: 15, status: 'Esgotada' },
    { id: 3, destination: 'Passeio em Angra dos Reis', date: '2025-09-10', passengers: 7, status: 'Aguardando' },
  ],
  upcomingTrips: [
    { id: 1, destination: 'Praia de Copacabana', date: '2025-10-26', time: '07:00' },
    { id: 2, destination: 'Feirinha de Itaipava', date: '2025-08-25', time: '08:30' },
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const recentRatings = getRecentRatings(3);
  const ratingStats = getRatingStats([]);

  // Removido: verificação de token administrativo separado

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={MapPin}
            title="Total de Viagens"
            value={dashboardData.stats.totalTrips}
            subtitle={`${dashboardData.stats.activeTrips} ativas`}
            color="bg-blue-500"
          />
          <StatCard
            icon={Users}
            title="Total de Passageiros"
            value={dashboardData.stats.totalPassengers}
            subtitle="Este mês"
            color="bg-green-500"
          />
          <StatCard
            icon={DollarSign}
            title="Receita Mensal"
            value={`R$ ${dashboardData.stats.monthlyRevenue.toLocaleString('pt-BR')}`}
            color="bg-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Taxa de Ocupação"
            value="87%"
            subtitle="Média mensal"
            color="bg-orange-500"
          />
          <StatCard
            icon={Star}
            title="Avaliação Média"
            value={ratingStats.averageRating.toFixed(1)}
            subtitle={`${ratingStats.totalRatings} avaliações`}
            color="bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Viagens Recentes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{trip.destination}</p>
                      <p className="text-sm text-gray-600">{new Date(trip.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{trip.passengers} passageiros</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        trip.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        trip.status === 'Esgotada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/admin/trips')}
                className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Ver todas as viagens →
              </button>
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Próximas Viagens</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.upcomingTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calendar size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900">{trip.destination}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1" />
                        {new Date(trip.date).toLocaleDateString('pt-BR')} às {trip.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/admin/trips')}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gerenciar Viagens
              </button>
            </div>
          </div>

          {/* Recent Ratings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Avaliações Recentes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentRatings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{rating.userId}</p>
                        <p className="text-sm text-gray-600">{rating.tripDestination}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-700">{rating.rating}</span>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-600 italic">\"{rating.comment}\"</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(rating.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
              {recentRatings.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
                  <p className="text-gray-600">As avaliações dos passageiros aparecerão aqui.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/trips')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <MapPin className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm font-medium text-gray-700">Nova Viagem</p>
            </button>
            <button 
              onClick={() => navigate('/admin/passengers')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Users className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm font-medium text-gray-700">Ver Passageiros</p>
            </button>
            <button 
              onClick={() => navigate('/admin/payments')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <DollarSign className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm font-medium text-gray-700">Relatório Financeiro</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;