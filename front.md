import React, { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { MapPin, Calendar, ArrowLeft, User, X, Compass, Ticket, MessageSquare, CalendarPlus, LogOut, Sun, Moon, CreditCard, Bell, BarChart3, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentComponent } from '../components/PaymentComponent';
import { NotificationSystem } from '../components/NotificationSystem';
import { AnalyticsComponent } from '../components/AnalyticsComponent';
import { ChatComponent } from '../components/ChatComponent';
import { LocationComponent } from '../components/LocationComponent';
import RatingComponent from '../components/RatingComponent';
import { PaymentSplitDashboard } from '../components/PaymentSplitDashboard';
import { useUserData } from '../hooks/useUserData';
import { useExcursions } from '../hooks/useExcursions';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- TIPOS E INTERFACES (TypeScript) ---
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

interface BookedTrip {
    id: number;
    destination: string;
    date: string;
    status: string;
    bookingCode: string;
    isPast: boolean;
    rated?: boolean;
}

interface UserData {
    name: string;
    phone: string;
    photo: string;
    bookedTrips: BookedTrip[];
}


// --- HOOKS ---
// Hook customizado para gerenciar o tema (claro/escuro)
const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};





// --- COMPONENTES DA UI ---
interface IconButtonProps {
    children: ReactNode;
    onClick: () => void;
    className?: string;
    title: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, className = '', title }) => (
    <motion.button
        onClick={onClick}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${className}`}
        whileTap={{ scale: 0.9 }}
        title={title}
    >
        {children}
    </motion.button>
);

interface BottomNavProps {
    activeView: string;
    setActiveView: (view: 'list' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'list' as const, icon: Compass, label: 'Explorar' },
        { id: 'profile' as const, icon: Ticket, label: 'Minhas Viagens' },
    ];
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-40">
            <div className="container mx-auto flex justify-around items-center h-20">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)} className="flex flex-col items-center justify-center transition-colors duration-300 group">
                        <item.icon size={26} className={`mb-1 transition-all duration-300 ${activeView === item.id ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`} strokeWidth={activeView === item.id ? 2.5 : 2} />
                        <span className={`text-xs font-semibold transition-colors duration-300 ${activeView === item.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface HeaderProps {
    onProfileClick: () => void;
    toggleTheme: () => void;
    theme: 'light' | 'dark';
    onNotificationsClick: () => void;
    onAnalyticsClick: () => void;
    onPaymentSplitClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, toggleTheme, theme, onNotificationsClick, onAnalyticsClick, onPaymentSplitClick }) => {
  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-200/80 dark:border-gray-800/80">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Excursões <span className="text-blue-500">Tijuca</span>
        </h1>
        <div className="flex items-center gap-2">
          <IconButton onClick={onAnalyticsClick} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Analytics">
            <BarChart3 className="text-gray-600 dark:text-gray-300" />
          </IconButton>
          <IconButton onClick={onNotificationsClick} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Notificações">
            <Bell className="text-gray-600 dark:text-gray-300" />
          </IconButton>
          <IconButton onClick={onPaymentSplitClick} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Dashboard de Pagamentos">
            <CreditCard className="text-gray-600 dark:text-gray-300" />
          </IconButton>
          <IconButton onClick={toggleTheme} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Alterar tema">
            {theme === 'light' ? <Moon className="text-gray-600 dark:text-gray-300" /> : <Sun className="text-gray-600 dark:text-gray-300" />}
          </IconButton>
          <IconButton onClick={onProfileClick} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Perfil">
            <User className="text-gray-600 dark:text-gray-300" />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

interface GroupGoalIndicatorProps {
    current: number;
    goal: number;
}

const GroupGoalIndicator: React.FC<GroupGoalIndicatorProps> = ({ current, goal }) => {
    if (!goal || goal === 0) return null;
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    const isConfirmed = current >= goal;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1 text-gray-600 dark:text-gray-400">
                <span className={`font-semibold ${isConfirmed ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {isConfirmed ? 'Grupo Confirmado!' : `${percentage}% para confirmar`}
                </span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{current}/{goal}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isConfirmed ? 'bg-green-500' : 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

interface ExcursionCardProps {
    excursion: Excursion;
    onParticipate: (excursion: Excursion) => void;
}

const ExcursionCard: React.FC<ExcursionCardProps> = React.memo(({ excursion, onParticipate }) => {
    const isSoldOut = excursion.spotsLeft === 0;
    return (
        <motion.div
            onClick={() => onParticipate(excursion)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/20 hover:-translate-y-1.5 cursor-pointer flex flex-col group"
            layoutId={`card-container-${excursion.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.img 
                    src={excursion.image} 
                    alt={excursion.destination} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    layoutId={`card-image-${excursion.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg tracking-wider uppercase">Esgotado</span>
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{excursion.destination}</h2>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{new Date(excursion.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {excursion.time}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{excursion.meetingPoint}</span>
                </div>
                <GroupGoalIndicator current={excursion.currentParticipants} goal={excursion.minParticipants} />
                <div className="mt-auto pt-4 flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">A partir de</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {excursion.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    {!isSoldOut && (
                         <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                            Ver Detalhes
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

interface ExcursionListProps {
    excursions: Excursion[];
    onParticipate: (excursion: Excursion) => void;
}

const ExcursionList: React.FC<ExcursionListProps> = React.memo(({ excursions, onParticipate }) => {
    const activeExcursions = useMemo(() => excursions.filter(e => !e.isPast), [excursions]);
    
    return (
        <div className="container mx-auto p-4 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
                {activeExcursions.map(excursion => (
                    <ExcursionCard key={excursion.id} excursion={excursion} onParticipate={onParticipate} />
                ))}
            </AnimatePresence>
        </div>
    );
});

interface ExcursionDetailsProps {
    excursion: Excursion;
    onBack: () => void;
    onConfirm: () => void;
    onPayment: () => void;
    onOpenChat: () => void;
}

const ExcursionDetails: React.FC<ExcursionDetailsProps> = ({ excursion, onBack, onConfirm, onPayment, onOpenChat }) => {
  return (
    <motion.div 
        className="bg-gray-50 dark:bg-black min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        layoutId={`card-container-${excursion.id}`}
    >
        <div className="relative">
            <motion.img 
                src={excursion.image} 
                alt={excursion.destination} 
                className="w-full h-80 object-cover"
                layoutId={`card-image-${excursion.id}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute top-5 left-5 z-10">
                <IconButton onClick={onBack} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800" title="Voltar">
                    <ArrowLeft className="text-gray-800 dark:text-white" />
                </IconButton>
            </div>
            <div className="absolute bottom-6 left-5 right-5 text-white">
                <motion.h1 
                    className="text-4xl font-bold tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {excursion.destination}
                </motion.h1>
                <motion.p 
                    className="font-semibold text-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Organizado por {excursion.organizer.name}
                </motion.p>
            </div>
        </div>
        <div className="p-5 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Informações Gerais</h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center"><Calendar size={18} className="mr-3 text-blue-500"/> {new Date(excursion.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} às {excursion.time}</div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Ponto de Encontro</h3>
                <LocationComponent 
                    meetingPoint={{
                        name: excursion.meetingPoint,
                        latitude: -22.9068,
                        longitude: -43.1729,
                        address: excursion.meetingPoint
                    }}
                    departureTime={`${excursion.date}T${excursion.time}`}
                />
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Descrição do Passeio</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{excursion.itinerary}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Ações Rápidas</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={onOpenChat} className="flex-1 flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-semibold py-3 px-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-900 transition-colors">
                        <MessageSquare size={20}/> Entrar no Chat
                    </button>
                    <button onClick={onPayment} className="flex-1 flex items-center justify-center gap-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-semibold py-3 px-4 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors">
                        <CreditCard size={20}/> Pagamento
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold py-3 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                        <CalendarPlus size={20}/> Adicionar ao Calendário
                    </button>
                </div>
            </div>
        </div>

        {/* Floating Action Bar */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor por pessoa</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {excursion.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <motion.button
                    onClick={onConfirm}
                    disabled={excursion.spotsLeft === 0}
                    className={`font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ${
                        excursion.spotsLeft === 0 
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    whileTap={{ scale: 0.95 }}
                >
                    {excursion.spotsLeft === 0 ? 'Esgotado' : 'Reservar Vaga'}
                </motion.button>
            </div>
        </div>
    </motion.div>
  );
};

interface ProfileScreenProps {
    user: UserData;
    onLogout: () => void;
    onRateTrip: (trip: BookedTrip) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onRateTrip }) => {
    const upcomingTrips = user.bookedTrips.filter(t => !t.isPast);
    const pastTrips = user.bookedTrips.filter(t => t.isPast);

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen pb-24">
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500 p-0.5" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
                        </div>
                    </div>
                    <IconButton onClick={onLogout} className="hover:bg-gray-100 dark:hover:bg-gray-800" title="Sair">
                        <LogOut className="text-gray-600 dark:text-gray-300"/>
                    </IconButton>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Minhas Viagens</h2>
                <div className="space-y-8">
                    <section>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Próximas</h3>
                        {upcomingTrips.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingTrips.map(trip => (
                                    <div key={trip.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                                        <p className="font-bold text-gray-900 dark:text-white">{trip.destination}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(trip.date).toLocaleDateString('pt-BR', {dateStyle: 'full'})}</p>
                                        <div className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${trip.status === 'Confirmada' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'}`}>{trip.status}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">Nenhuma viagem futura agendada.</p>}
                    </section>
                    <section>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Anteriores</h3>
                        {pastTrips.length > 0 ? (
                            <div className="space-y-4">
                                {pastTrips.map(trip => (
                                    <div key={trip.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white">{trip.destination}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(trip.date).toLocaleDateString('pt-BR', {dateStyle: 'long'})}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Código: {trip.bookingCode}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                                    {trip.status}
                                                </span>
                                                {!trip.rated ? (
                                                    <button 
                                                        onClick={() => onRateTrip(trip)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900 transition-colors"
                                                    >
                                                        <Star size={12}/> Avaliar
                                                    </button>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg text-xs font-semibold">
                                                        <Star size={12} className="fill-current"/> Avaliado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">Nenhuma viagem no seu histórico.</p>}
                    </section>
                </div>
            </div>
        </div>
    );
};

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full relative shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <IconButton onClick={onClose} className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-700" title="Fechar">
                <X size={20} className="text-gray-500 dark:text-gray-400"/>
            </IconButton>
            {children}
        </motion.div>
    </motion.div>
);

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    return (
        <Modal onClose={onClose}>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Acesse sua conta</h2>
            <div className="space-y-4">
                <button
                    onClick={onLoginSuccess}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5"/>
                    Continuar com Google
                </button>
                <button
                    onClick={onLoginSuccess}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all"
                >
                    Continuar com E-mail
                </button>
            </div>
        </Modal>
    );
};

type View = 'list' | 'details' | 'profile';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [activeNav, setActiveNav] = useState<Extract<View, 'list' | 'profile'>>('list');
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [tripToRate, setTripToRate] = useState<BookedTrip | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showPaymentSplit, setShowPaymentSplit] = useState(false);
    const { theme, toggleTheme } = useTheme();
  
  // Hooks para gerenciamento de dados
  const { userData, login, logout, addBooking, rateTrip, isLoggedIn } = useUserData();
  const { excursions, loading, addParticipant, getExcursionById } = useExcursions();

  const handleNotificationsClick = useCallback(() => {
    setShowNotifications(true);
  }, []);

  const handleAnalyticsClick = useCallback(() => {
        setShowAnalytics(true);
    }, []);

    const handlePaymentSplitClick = useCallback(() => {
        setShowPaymentSplit(true);
    }, []);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view === 'list' || view === 'profile') {
        setActiveNav(view);
    }
  };

  const handleParticipate = useCallback((excursion: Excursion) => {
    setSelectedExcursion(excursion);
    handleNavigate('details');
    window.scrollTo(0, 0);
  }, []);

  const handlePayment = useCallback(() => {
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = useCallback((paymentData: any) => {
    if (selectedExcursion && userData) {
      // Adiciona a reserva aos dados do usuário
      addBooking({
        id: selectedExcursion.id,
        destination: selectedExcursion.destination,
        date: selectedExcursion.date,
        status: 'Confirmada',
        bookingCode: `EXC${selectedExcursion.id}${Date.now()}`,
        isPast: false,
        rated: false
      });
    }
    console.log('Pagamento realizado:', paymentData);
    setShowPayment(false);
  }, [selectedExcursion, userData, addBooking]);

  const handleOpenChat = useCallback(() => {
    setShowChat(true);
  }, []);

  const handleRateTrip = useCallback((trip: BookedTrip) => {
    setTripToRate(trip);
    setShowRating(true);
  }, []);

  const handleSubmitRating = useCallback((rating: number, comment: string) => {
    if (tripToRate) {
      // Salva a avaliação usando o hook
      rateTrip(tripToRate.id, rating, comment);
      setShowRating(false);
      setTripToRate(null);
    }
  }, [tripToRate, rateTrip]);

  const handleConfirm = useCallback(() => {
    if (!isLoggedIn) {
        setLoginModalOpen(true);
        return;
    }
    // Lógica de confirmação aqui
    alert("Reserva confirmada!");
  }, [isLoggedIn]);

  const handleBack = useCallback(() => {
    handleNavigate(activeNav);
    setSelectedExcursion(null);
  }, [activeNav]);

  const handleLoginSuccess = useCallback((email: string, password: string) => {
        // Simula login com dados básicos
        login({
            name: email.split('@')[0],
            email: email,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            bookedTrips: []
        });
        setShowLoginModal(false);
        if (!selectedExcursion) {
            handleNavigate('list');
        }
    }, [login, selectedExcursion, handleNavigate]);
  
  const handleLogout = () => {
    logout();
    handleNavigate('list');
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
        handleNavigate('profile');
    } else {
        setLoginModalOpen(true);
    }
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'details':
        return selectedExcursion && <ExcursionDetails 
          excursion={selectedExcursion} 
          onBack={handleBack} 
          onConfirm={handleConfirm}
          onPayment={handlePayment}
          onOpenChat={handleOpenChat}
        />;
      case 'profile':
          return userData && <ProfileScreen user={userData} onLogout={handleLogout} onRateTrip={handleRateTrip} />;
      case 'list':
      default:
        return (
          <>
            <Header 
              onProfileClick={handleProfileClick} 
              toggleTheme={toggleTheme} 
              theme={theme}
              onNotificationsClick={handleNotificationsClick}
              onAnalyticsClick={handleAnalyticsClick}
              onPaymentSplitClick={handlePaymentSplitClick}
            />
            <main className="bg-gray-50 dark:bg-black pb-24">
              <ExcursionList excursions={excursions} onParticipate={handleParticipate} />
            </main>
          </>
        );
    }
  };

  return (
    <div className="font-sans antialiased bg-gray-50 dark:bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        <motion.div key={currentView}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      
      {(currentView === 'list' || currentView === 'profile') && <BottomNav activeView={activeNav} setActiveView={handleNavigate} />}
      
      <AnimatePresence>
        {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
        {showPayment && selectedExcursion && (
           <Modal onClose={() => setShowPayment(false)}>
             <PaymentComponent 
               tripPrice={selectedExcursion.price}
               organizerName={selectedExcursion.organizer.name}
               tripTitle={selectedExcursion.destination}
               onPaymentSuccess={handlePaymentSuccess}
             />
           </Modal>
         )}
         {showChat && selectedExcursion && userData && (
           <Modal onClose={() => setShowChat(false)}>
             <ChatComponent 
               tripId={selectedExcursion.id.toString()}
               userName={userData.name}
               isOrganizer={false}
             />
           </Modal>
         )}
         {showRating && tripToRate && (
           <Modal onClose={() => setShowRating(false)}>
             <RatingComponent 
               onSubmit={handleSubmitRating}
               organizerName={excursions.find(e => e.id === tripToRate.id)?.organizer.name}
             />
           </Modal>
         )}
         {showNotifications && userData && (
           <Modal onClose={() => setShowNotifications(false)}>
             <NotificationSystem userId={userData.name} />
           </Modal>
         )}
         {showAnalytics && (
           <Modal onClose={() => setShowAnalytics(false)}>
             <AnalyticsComponent isAdmin={false} />
           </Modal>
         )}
         {showPaymentSplit && (
           <Modal onClose={() => setShowPaymentSplit(false)}>
             <PaymentSplitDashboard />
           </Modal>
         )}
      </AnimatePresence>
    </div>
  );
}
