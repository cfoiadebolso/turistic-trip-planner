import React, { useState, useCallback, useMemo } from 'react';
import { MapPin, Calendar, Users, ArrowLeft, Star, User, X, CheckCircle, Copy, LogIn, Plus, Minus, Search, Compass, Ticket, MessageSquare, CalendarPlus, LogOut, Edit } from 'lucide-react';

// --- DADOS MOCKADOS (Substituir por API calls) ---
// Adicionando novos campos: minParticipants, currentParticipants, isPast
const excursionsData = [
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
    organizer: { name: "Beto Viagens", rating: 4.8, reviews: 120 },
    itinerary: "Saída da Tijuca, parada para café da manhã (não incluso), dia livre na praia de Copacabana, retorno às 17h.",
    passengers: ["Ana Silva", "Carlos Souza", "Mariana Lima", "Pedro Costa", "Juliana Alves", "Fernando Martins"],
    minParticipants: 0, // 0 significa que não precisa de mínimo
    currentParticipants: 6,
    isPast: false,
  },
  {
    id: 2,
    destination: "Feirinha de Itaipava",
    neighborhood: "Tijuca",
    date: "2025-08-25", // Data futura próxima
    time: "08:30",
    meetingPoint: "Shopping Tijuca (porta principal)",
    price: 70.00,
    spotsLeft: 0, // Esgotado
    category: "compras",
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=Itaipava",
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
    image: "https://placehold.co/600x400/9b59b6/ffffff?text=Angra+dos+Reis",
    organizer: { name: "Beto Viagens", rating: 4.8, reviews: 120 },
    itinerary: "Passeio de escuna pelas principais ilhas de Angra, com parada para mergulho e almoço (incluso).",
    passengers: ["Marcos Andrade", "Sofia Ribeiro", "Tiago Almeida", "Clara Ferreira", "Eduardo Barros", "Helena Gomes", "Fábio Rocha", "Isabela Pinto"],
    minParticipants: 15, // Precisa de 15 para confirmar
    currentParticipants: 7,
    isPast: false,
  },
  {
    id: 4,
    destination: "Tour Histórico em Petrópolis",
    neighborhood: "Tijuca",
    date: "2025-07-20", // Viagem passada
    time: "08:00",
    meetingPoint: "Praça Afonso Pena",
    price: 110.00,
    spotsLeft: 0,
    category: "turismo",
    image: "https://placehold.co/600x400/f39c12/ffffff?text=Petrópolis",
    organizer: { name: "Rio Serra Tour", rating: 4.9, reviews: 85 },
    itinerary: "Visita ao Museu Imperial, Palácio de Cristal e tempo livre na Rua Teresa para compras.",
    passengers: ["Maria Clara"],
    minParticipants: 0,
    currentParticipants: 20,
    isPast: true,
  }
];

const userData = {
    name: "Maria Clara",
    phone: "+55 21 98765-4321",
    photo: "https://placehold.co/100x100/e74c3c/ffffff?text=MC",
    bookedTrips: [
        { id: 3, destination: "Passeio em Angra dos Reis", date: "2025-09-10", status: "Aguardando Grupo", bookingCode: "ANGRA-MC-8J3K", isPast: false },
        { id: 4, destination: "Tour Histórico em Petrópolis", date: "2025-07-20", status: "Realizada", bookingCode: "PETRO-MC-4F8L", isPast: true, rated: false }
    ]
};


// --- COMPONENTES DA UI ---

const BottomNav = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'list', icon: Compass, label: 'Explorar' },
        { id: 'profile', icon: Ticket, label: 'Minhas Viagens' },
    ];
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-40">
            <div className="container mx-auto flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)} className={`flex flex-col items-center justify-center transition-colors duration-300 ${activeView === item.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
                        <item.icon size={24} strokeWidth={activeView === item.id ? 2.5 : 2} />
                        <span className="text-xs font-semibold mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Header = ({ onProfileClick }) => (
  <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200/80">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800">
        Excursões <span className="text-blue-600">Tijuca</span>
      </h1>
      <button onClick={onProfileClick} className="w-10 h-10 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center">
        <User className="text-slate-600" />
      </button>
    </div>
  </header>
);

const GroupGoalIndicator = ({ current, goal }) => {
    if (!goal || goal === 0) return null;
    const percentage = Math.round((current / goal) * 100);
    const isConfirmed = current >= goal;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className={`font-semibold ${isConfirmed ? 'text-green-600' : 'text-blue-600'}`}>
                    {isConfirmed ? 'Grupo Confirmado!' : 'Meta para confirmar:'}
                </span>
                <span className="font-bold text-slate-600">{current}/{goal}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${isConfirmed ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
            </div>
        </div>
    );
};

const ExcursionCard = ({ excursion, onParticipate }) => {
    const isSoldOut = excursion.spotsLeft === 0;
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <img src={excursion.image} alt={excursion.destination} className="w-full h-48 object-cover" />
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-xl tracking-wider uppercase">Lotado</span>
                    </div>
                )}
                {!isSoldOut && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm">
                        {excursion.spotsLeft} vagas!
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-slate-800 mb-2 truncate">{excursion.destination}</h2>
                <div className="flex items-center text-slate-600 text-sm mb-1">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{new Date(excursion.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {excursion.time}</span>
                </div>
                <div className="flex items-center text-slate-600 text-sm mb-3">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{excursion.meetingPoint}</span>
                </div>
                <GroupGoalIndicator current={excursion.currentParticipants} goal={excursion.minParticipants} />
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-500">Valor</p>
                        <p className="text-2xl font-bold text-slate-800">R$ {excursion.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button
                        onClick={() => onParticipate(excursion)}
                        disabled={isSoldOut}
                        className={`font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${isSoldOut ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {isSoldOut ? 'Esgotado' : 'Ver Detalhes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExcursionList = ({ excursions, onParticipate }) => (
    <div className="container mx-auto p-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {excursions.filter(e => !e.isPast).map(excursion => (
            <ExcursionCard key={excursion.id} excursion={excursion} onParticipate={onParticipate} />
        ))}
    </div>
);

const ExcursionDetails = ({ excursion, onBack, onConfirm }) => (
    <div className="bg-slate-50 min-h-screen">
        <div className="relative">
            <img src={excursion.image} alt={excursion.destination} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button onClick={onBack} className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors z-10">
                <ArrowLeft className="text-slate-800" />
            </button>
            <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold shadow-2xl">{excursion.destination}</h1>
                <p className="font-semibold">{excursion.organizer.name}</p>
            </div>
        </div>
        <div className="p-5 bg-slate-50 relative">
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Informações Gerais</h3>
                    <div className="space-y-3 text-slate-700">
                        <div className="flex items-center"><Calendar size={18} className="mr-3 text-blue-500"/> {new Date(excursion.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} às {excursion.time}</div>
                        <div className="flex items-center"><MapPin size={18} className="mr-3 text-blue-500"/> {excursion.meetingPoint}</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Descrição do Passeio</h3>
                    <p className="text-slate-600">{excursion.itinerary}</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Comunicação e Extras</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg hover:bg-green-200 transition-colors"><MessageSquare size={20}/> Entrar no Chat da Viagem</button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-800 font-semibold py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"><CalendarPlus size={20}/> Adicionar ao Calendário</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="h-24"></div>
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 border-t border-slate-200 flex justify-between items-center">
            <div>
                <p className="text-sm text-slate-500">Valor por pessoa</p>
                <p className="text-2xl font-bold text-slate-800">R$ {excursion.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <button onClick={() => onConfirm(excursion)} className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Reservar Vaga
            </button>
        </div>
    </div>
);

const ProfileScreen = ({ user, onLogout, onRateTrip }) => {
    const upcomingTrips = user.bookedTrips.filter(t => !t.isPast);
    const pastTrips = user.bookedTrips.filter(t => t.isPast);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="p-4 bg-white border-b">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500 p-0.5" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
                            <p className="text-slate-500">{user.phone}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full hover:bg-slate-100"><LogOut className="text-slate-600"/></button>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Minhas Viagens</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Próximas</h3>
                        {upcomingTrips.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingTrips.map(trip => (
                                    <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="font-bold">{trip.destination}</p>
                                        <p className="text-sm text-slate-600">{new Date(trip.date).toLocaleDateString('pt-BR', {dateStyle: 'full'})}</p>
                                        <div className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${trip.status === 'Confirmada' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{trip.status}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-slate-500 bg-white p-4 rounded-xl shadow-sm">Nenhuma viagem futura agendada.</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Anteriores</h3>
                        {pastTrips.length > 0 ? (
                            <div className="space-y-3">
                                {pastTrips.map(trip => (
                                    <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm">
                                        <p className="font-bold">{trip.destination}</p>
                                        <p className="text-sm text-slate-600">{new Date(trip.date).toLocaleDateString('pt-BR', {dateStyle: 'long'})}</p>
                                        {!trip.rated && <button onClick={() => onRateTrip(trip)} className="mt-2 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">Avaliar Viagem</button>}
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-slate-500 bg-white p-4 rounded-xl shadow-sm">Nenhuma viagem no seu histórico.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RatingModal = ({ trip, onClose }) => {
    const [rating, setRating] = useState(0);
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
                <h2 className="text-xl font-bold text-center mb-2">Avalie sua viagem</h2>
                <p className="text-center text-slate-600 mb-4">{trip.destination}</p>
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setRating(star)}>
                            <Star size={32} className={`transition-colors ${rating >= star ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                        </button>
                    ))}
                </div>
                <textarea placeholder="Deixe um comentário (opcional)" className="w-full p-2 border border-slate-300 rounded-lg h-24 resize-none mb-4"></textarea>
                <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all">
                    Enviar Avaliação
                </button>
            </div>
        </div>
    );
};

const LoginModal = ({ onClose, onLoginSuccess }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative transform transition-all opacity-100 scale-100">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Acesse sua conta</h2>
            <div className="space-y-3">
                <button onClick={onLoginSuccess} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-all">
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5"/> Continuar com Google
                </button>
                <input type="email" placeholder="Seu e-mail" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                <button onClick={onLoginSuccess} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all">
                    Continuar com E-mail
                </button>
            </div>
        </div>
    </div>
);


export default function Index() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'booking', 'confirmation', 'profile'
  const [activeNav, setActiveNav] = useState('list');
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isRatingModalOpen, setRatingModalOpen] = useState(false);
  const [tripToRate, setTripToRate] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'list' || view === 'profile') {
        setActiveNav(view);
    }
  };

  const handleParticipate = useCallback((excursion) => {
    setSelectedExcursion(excursion);
    handleNavigate('details');
    window.scrollTo(0, 0);
  }, []);

  const handleConfirm = useCallback((excursion) => {
    if (!isLoggedIn) {
        setLoginModalOpen(true);
        return;
    }
    // Simula fluxo de pagamento, pulando para confirmação
    setSelectedExcursion(excursion);
    handleNavigate('confirmation');
    window.scrollTo(0, 0);
  }, [isLoggedIn]);

  const handleBack = useCallback(() => {
    handleNavigate(activeNav);
    setSelectedExcursion(null);
    window.scrollTo(0, 0);
  }, [activeNav]);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setLoginModalOpen(false);
    if (selectedExcursion) {
        handleNavigate('confirmation');
    } else {
        handleNavigate('profile');
    }
  };
  
  const handleLogout = () => {
    setLoggedIn(false);
    handleNavigate('list');
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
        handleNavigate('profile');
    } else {
        setLoginModalOpen(true);
    }
  };
  
  const handleRateTrip = (trip) => {
      setTripToRate(trip);
      setRatingModalOpen(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'details':
        return <ExcursionDetails excursion={selectedExcursion} onBack={handleBack} onConfirm={handleConfirm} />;
      case 'confirmation':
        // ConfirmationScreen não foi solicitada para alteração, mas seria o próximo passo
        return <div className="p-4">Tela de Confirmação para {selectedExcursion.destination}</div>;
      case 'profile':
        return <ProfileScreen user={userData} onLogout={handleLogout} onRateTrip={handleRateTrip} />;
      case 'list':
      default:
        return (
          <>
            <Header onProfileClick={handleProfileClick} />
            <main className="bg-slate-50 pb-20">
              <ExcursionList excursions={excursionsData} onParticipate={handleParticipate} />
            </main>
          </>
        );
    }
  };

  return (
    <div className="font-sans antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="relative">
        {renderContent()}
      </div>
      {(activeNav === 'list' || activeNav === 'profile') && <BottomNav activeView={activeNav} setActiveView={handleNavigate} />}
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      {isRatingModalOpen && <RatingModal trip={tripToRate} onClose={() => setRatingModalOpen(false)} />}
    </div>
  );
}
