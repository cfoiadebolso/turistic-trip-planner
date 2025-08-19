import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import TripForm from '../../components/admin/TripForm';
import { Plus, Edit, Trash2, Eye, Users, Calendar, MapPin, DollarSign } from 'lucide-react';

// Dados mockados - substituir por API calls
const initialTripsData = [
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
    image: "https://placehold.co/600x400/3498db/ffffff?text=Copacabana",
    itinerary: "Saída da Tijuca, parada para café da manhã (não incluso), dia livre na praia de Copacabana, retorno às 17h.",
    minParticipants: 0,
    currentParticipants: 6,
    rules: "Levar protetor solar, não é permitido levar animais"
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
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=Itaipava",
    itinerary: "Viagem tranquila até a serra, 4 horas livres para compras na Feirinha de Itaipava, parada para lanche no retorno.",
    minParticipants: 0,
    currentParticipants: 15,
    rules: "Pontualidade obrigatória, levar documento de identidade"
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
    image: "https://placehold.co/600x400/9b59b6/ffffff?text=Angra+dos+Reis",
    itinerary: "Passeio de escuna pelas principais ilhas de Angra, com parada para mergulho e almoço (incluso).",
    minParticipants: 15,
    currentParticipants: 7,
    rules: "Saber nadar é obrigatório, levar roupa de banho"
  }
];

const TripManagement = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(initialTripsData);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [filter, setFilter] = useState('all');

  // Removido: verificação de token administrativo separado

  const handleCreateTrip = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  const handleEditTrip = (trip: any) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDeleteTrip = (tripId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta viagem?')) {
      setTrips(trips.filter(trip => trip.id !== tripId));
    }
  };

  const handleSaveTrip = (tripData: any) => {
    if (editingTrip) {
      setTrips(trips.map(trip => trip.id === editingTrip.id ? tripData : trip));
    } else {
      setTrips([...trips, tripData]);
    }
    setShowForm(false);
    setEditingTrip(null);
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'active') return trip.spotsLeft > 0;
    if (filter === 'full') return trip.spotsLeft === 0;
    if (filter === 'upcoming') return new Date(trip.date) > new Date();
    return true;
  });

  const getStatusColor = (trip: any) => {
    if (trip.spotsLeft === 0) return 'bg-red-100 text-red-800';
    if (trip.minParticipants > 0 && trip.currentParticipants < trip.minParticipants) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (trip: any) => {
    if (trip.spotsLeft === 0) return 'Esgotada';
    if (trip.minParticipants > 0 && trip.currentParticipants < trip.minParticipants) return 'Aguardando Grupo';
    return 'Confirmada';
  };

  return (
    <AdminLayout title="Gerenciamento de Viagens">
      <div className="space-y-6">
        {/* Header com filtros e botão de criar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({trips.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ativas ({trips.filter(t => t.spotsLeft > 0).length})
            </button>
            <button
              onClick={() => setFilter('full')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Esgotadas ({trips.filter(t => t.spotsLeft === 0).length})
            </button>
          </div>
          <button
            onClick={handleCreateTrip}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Viagem
          </button>
        </div>

        {/* Lista de viagens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img src={trip.image} alt={trip.destination} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trip)}`}>
                    {getStatusText(trip)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.destination}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {new Date(trip.date).toLocaleDateString('pt-BR')} às {trip.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {trip.meetingPoint}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    {trip.currentParticipants} inscritos / {trip.spotsLeft} vagas
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    R$ {trip.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => navigate('/admin/passengers', { state: { tripId: trip.id } })}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ver Passageiros"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{trip.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma viagem encontrada</h3>
            <p className="text-gray-600 mb-4">Comece criando sua primeira viagem.</p>
            <button
              onClick={handleCreateTrip}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Viagem
            </button>
          </div>
        )}
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <TripForm
          trip={editingTrip}
          onSave={handleSaveTrip}
          onCancel={() => {
            setShowForm(false);
            setEditingTrip(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default TripManagement;