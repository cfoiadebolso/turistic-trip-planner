import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

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
  isLoggedIn: boolean;
}

const defaultUserData: UserData = {
  name: '',
  phone: '',
  photo: '',
  bookedTrips: [],
  isLoggedIn: false
};

export function useUserData() {
  const [userData, setUserData] = useLocalStorage<UserData>('user_data', defaultUserData);

  const login = useCallback((userInfo: { name: string; email?: string; avatar?: string; bookedTrips?: BookedTrip[] }) => {
    const newUserData = {
      ...userData,
      name: userInfo.name,
      phone: userInfo.email || '',
      photo: userInfo.avatar || `https://i.pravatar.cc/100?u=${encodeURIComponent(userInfo.name)}`,
      bookedTrips: userInfo.bookedTrips || userData.bookedTrips,
      isLoggedIn: true
    };
    setUserData(newUserData);
    return newUserData;
  }, [userData, setUserData]);

  const logout = useCallback(() => {
    setUserData(defaultUserData);
  }, [setUserData]);

  const addBooking = useCallback((booking: BookedTrip) => {
    const newTrip: BookedTrip = {
      ...booking,
      bookingCode: booking.bookingCode || `${booking.destination.substring(0, 5).toUpperCase()}-${userData.name.substring(0, 2).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      isPast: new Date(booking.date) < new Date(),
      rated: booking.rated || false
    };

    const updatedUserData = {
      ...userData,
      bookedTrips: [...userData.bookedTrips, newTrip]
    };
    
    setUserData(updatedUserData);
    return newTrip;
  }, [userData, setUserData]);

  const rateTrip = useCallback((tripId: number, rating: number, comment: string) => {
    const updatedTrips = userData.bookedTrips.map(trip => 
      trip.id === tripId ? { ...trip, rated: true } : trip
    );
    
    const updatedUserData = {
      ...userData,
      bookedTrips: updatedTrips
    };
    
    setUserData(updatedUserData);
    
    // Salvar avaliação separadamente
    const ratings = JSON.parse(localStorage.getItem('trip_ratings') || '[]');
    ratings.push({
      tripId,
      userId: userData.name,
      rating,
      comment,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trip_ratings', JSON.stringify(ratings));
  }, [userData, setUserData]);

  const updateTripStatus = useCallback((tripId: number, status: string) => {
    const updatedTrips = userData.bookedTrips.map(trip => 
      trip.id === tripId ? { ...trip, status } : trip
    );
    
    const updatedUserData = {
      ...userData,
      bookedTrips: updatedTrips
    };
    
    setUserData(updatedUserData);
  }, [userData, setUserData]);

  return {
    userData,
    login,
    logout,
    addBooking,
    rateTrip,
    updateTripStatus,
    isLoggedIn: userData.isLoggedIn
  };
}