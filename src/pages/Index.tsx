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
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${className}`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
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
        { id: 'profile' as const, icon: User, label: 'Perfil' },
    ];
    
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 safe-area-pb">
            <div className="flex justify-center">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 m-3">
                    {navItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveView(item.id)} 
                            className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                                activeView === item.id 
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                            }`}
                        >
                            <item.icon size={20} className="mr-2" strokeWidth={activeView === item.id ? 2.5 : 2} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>
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
    const actions = [
        { icon: Bell, onClick: onNotificationsClick, title: "Notificações" },
        { icon: BarChart3, onClick: onAnalyticsClick, title: "Analytics" },
        { icon: CreditCard, onClick: onPaymentSplitClick, title: "Pagamentos" },
        { icon: theme === 'light' ? Moon : Sun, onClick: toggleTheme, title: "Tema" },
    ];

    return (
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-200/30 dark:border-gray-800/30 safe-area-pt">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <motion.h1 
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    Excursões <span className="text-blue-500">Tijuca</span>
                </motion.h1>
                
                <div className="flex items-center gap-1">
                    {actions.map((action, index) => (
                        <IconButton 
                            key={index}
                            onClick={action.onClick} 
                            className="hover:bg-gray-100/70 dark:hover:bg-gray-800/70" 
                            title={action.title}
                        >
                            <action.icon size={20} className="text-gray-600 dark:text-gray-400" />
                        </IconButton>
                    ))}
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
    
    const percentage = Math.min((current / goal) * 100, 100);
    const isConfirmed = current >= goal;

    return (
        <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold ${
                    isConfirmed 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                }`}>
                    {isConfirmed ? 'Grupo Confirmado!' : `${Math.round(percentage)}% confirmado`}
                </span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {current}/{goal}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${
                        isConfirmed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
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
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden cursor-pointer group border border-gray-200/50 dark:border-gray-700/50"
            layoutId={`card-container-${excursion.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ duration: 0.6 }}
        >
            <div className="relative overflow-hidden">
                <motion.img 
                    src={excursion.image} 
                    alt={excursion.destination} 
                    className="w-full h-56 object-cover"
                    layoutId={`card-image-${excursion.id}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {isSoldOut && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-lg tracking-wider">ESGOTADO</span>
                    </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold mb-1">{excursion.destination}</h2>
                    <p className="text-sm text-white/90">{excursion.neighborhood}</p>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{new Date(excursion.date).toLocaleDateString('pt-BR', { 
                        day: 'numeric', 
                        month: 'short' 
                    })} • {excursion.time}</span>
                </div>
                
                <div className="flex items-start text-gray-600 dark:text-gray-400 text-sm mb-4">
                    <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{excursion.meetingPoint}</span>
                </div>
                
                <GroupGoalIndicator 
                    current={excursion.currentParticipants} 
                    goal={excursion.minParticipants} 
                />
                
                <div className="flex justify-between items-end mt-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">A partir de</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            R$ {excursion.price.toFixed(0)}
                        </p>
                    </div>
                    
                    {!isSoldOut && (
                        <motion.div 
                            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-2xl text-sm shadow-lg shadow-blue-500/20"
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Ver Detalhes
                        </motion.div>
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
        <div className="max-w-7xl mx-auto p-6 pb-32">
            <motion.div
                className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence>
                    {activeExcursions.map((excursion, index) => (
                        <motion.div
                            key={excursion.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ExcursionCard excursion={excursion} onParticipate={onParticipate} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
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
    const quickActions = [
        { icon: MessageSquare, label: 'Chat', onClick: onOpenChat, color: 'green' },
        { icon: CreditCard, label: 'Pagamento', onClick: onPayment, color: 'purple' },
        { icon: CalendarPlus, label: 'Calendário', onClick: () => {}, color: 'blue' },
    ];

    return (
        <motion.div 
            className="bg-gray-50 dark:bg-gray-900 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId={`card-container-${excursion.id}`}
        >
            {/* Hero Image */}
            <div className="relative h-96">
                <motion.img 
                    src={excursion.image} 
                    alt={excursion.destination} 
                    className="w-full h-full object-cover"
                    layoutId={`card-image-${excursion.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Back Button */}
                <div className="absolute top-12 left-4 z-10">
                    <IconButton 
                        onClick={onBack} 
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30" 
                        title="Voltar"
                    >
                        <ArrowLeft className="text-white" size={20} />
                    </IconButton>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <motion.h1 
                        className="text-4xl font-bold mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {excursion.destination}
                    </motion.h1>
                    <motion.p 
                        className="text-lg text-white/90"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Por {excursion.organizer.name}
                    </motion.p>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8 space-y-8 pb-32">
                {/* Info Card */}
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quando & Onde</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Calendar className="text-blue-500 mr-3" size={20}/>
                            <span className="text-gray-700 dark:text-gray-300">
                                {new Date(excursion.date).toLocaleDateString('pt-BR', { 
                                    weekday: 'long', 
                                    day: 'numeric', 
                                    month: 'long' 
                                })} às {excursion.time}
                            </span>
                        </div>
                        <div className="flex items-start">
                            <MapPin className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20}/>
                            <span className="text-gray-700 dark:text-gray-300">{excursion.meetingPoint}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Location Component */}
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Localização</h3>
                    <LocationComponent 
                        meetingPoint={{
                            name: excursion.meetingPoint,
                            latitude: -22.9068,
                            longitude: -43.1729,
                            address: excursion.meetingPoint
                        }}
                        departureTime={`${excursion.date}T${excursion.time}`}
                    />
                </motion.div>

                {/* Description */}
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sobre o Passeio</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                        {excursion.itinerary}
                    </p>
                </motion.div>
                
                {/* Quick Actions */}
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                onClick={action.onClick}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold transition-all ${
                                    action.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' :
                                    action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50' :
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <action.icon size={20}/>
                                {action.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 p-6 safe-area-pb">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor por pessoa</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            R$ {excursion.price.toFixed(0).replace('.', ',')}
                        </p>
                    </div>
                    <motion.button
                        onClick={onConfirm}
                        disabled={excursion.spotsLeft === 0}
                        className={`font-bold py-4 px-8 rounded-2xl transition-all ${
                            excursion.spotsLeft === 0 
                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        }`}
                        whileHover={excursion.spotsLeft > 0 ? { scale: 1.05 } : {}}
                        whileTap={excursion.spotsLeft > 0 ? { scale: 0.95 } : {}}
                    >
                        {excursion.spotsLeft === 0 ? 'Esgotado' : 'Reservar Agora'}
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
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-32">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            <img 
                                src={user.photo} 
                                alt={user.name} 
                                className="w-20 h-20 rounded-3xl border-2 border-blue-500/20" 
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                                {upcomingTrips.length} viagens agendadas
                            </p>
                        </div>
                    </div>
                    <IconButton 
                        onClick={onLogout} 
                        className="hover:bg-gray-100 dark:hover:bg-gray-700" 
                        title="Sair"
                    >
                        <LogOut className="text-gray-600 dark:text-gray-400" size={20}/>
                    </IconButton>
                </div>
            </div>

            {/* Trips Content */}
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <motion.h2 
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Minhas Viagens
                </motion.h2>
                
                {/* Upcoming Trips */}
                <section>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                        Próximas Viagens
                    </h3>
                    {upcomingTrips.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            {upcomingTrips.map((trip, index) => (
                                <motion.div 
                                    key={trip.id} 
                                    className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                                        {trip.destination}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        {new Date(trip.date).toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </p>
                                    <div className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                                        trip.status === 'Confirmada' 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    }`}>
                                        {trip.status}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm text-center">
                            <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Nenhuma viagem futura agendada
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                Explore nossa seleção de destinos incríveis
                            </p>
                        </div>
                    )}
                </section>
                
                {/* Past Trips */}
                <section>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                        Viagens Anteriores
                    </h3>
                    {pastTrips.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            {pastTrips.map((trip, index) => (
                                <motion.div 
                                    key={trip.id} 
                                    className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                                                {trip.destination}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                                                {new Date(trip.date).toLocaleDateString('pt-BR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                                Código: {trip.bookingCode}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                {trip.status}
                                            </span>
                                            {!trip.rated ? (
                                                <motion.button 
                                                    onClick={() => onRateTrip(trip)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl text-sm font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Star size={14}/> Avaliar
                                                </motion.button>
                                            ) : (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-semibold">
                                                    <Star size={14} className="fill-current"/> Avaliado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm text-center">
                            <Star size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Nenhuma viagem no seu histórico
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                Suas aventuras passadas aparecerão aqui
                            </p>
                        </div>
                    )}
                </section>
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
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
        >
            <IconButton 
                onClick={onClose} 
                className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-700" 
                title="Fechar"
            >
                <X size={20} className="text-gray-500 dark:text-gray-400"/>
            </IconButton>
            {children}
        </motion.div>
    </motion.div>
);

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (email: string, password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const handleLogin = (method: string) => {
        // Simulação de login bem-sucedido
        onLoginSuccess('usuario@email.com', 'password123');
    };

    return (
        <Modal onClose={onClose}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bem-vindo!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Entre para reservar sua próxima aventura
                </p>
            </div>
            
            <div className="space-y-4">
                <motion.button
                    onClick={() => handleLogin('google')}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white font-semibold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5"/>
                    Continuar com Google
                </motion.button>
                
                <motion.button
                    onClick={() => handleLogin('email')}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Continuar com E-mail
                </motion.button>
            </div>
            
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                Ao continuar, você concorda com nossos Termos de Serviço
            </p>
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
        alert("Reserva confirmada!");
    }, [isLoggedIn]);

    const handleBack = useCallback(() => {
        handleNavigate(activeNav);
        setSelectedExcursion(null);
    }, [activeNav]);

    const handleLoginSuccess = useCallback((email: string, password: string) => {
        login({
            name: email.split('@')[0],
            email: email,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            bookedTrips: []
        });
        setLoginModalOpen(false);
        if (!selectedExcursion) {
            handleNavigate('list');
        }
    }, [login, selectedExcursion]);
    
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
                return userData && <ProfileScreen 
                    user={userData} 
                    onLogout={handleLogout} 
                    onRateTrip={handleRateTrip} 
                />;
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
                        <main className="bg-gray-50 dark:bg-gray-900">
                            <ExcursionList excursions={excursions} onParticipate={handleParticipate} />
                        </main>
                    </>
                );
        }
    };

    return (
        <div className="font-sans antialiased bg-gray-50 dark:bg-gray-900 min-h-screen" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
            
            {(currentView === 'list' || currentView === 'profile') && (
                <BottomNav activeView={activeNav} setActiveView={handleNavigate} />
            )}
            
            <AnimatePresence>
                {isLoginModalOpen && (
                    <LoginModal 
                        onClose={() => setLoginModalOpen(false)} 
                        onLoginSuccess={handleLoginSuccess} 
                    />
                )}
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