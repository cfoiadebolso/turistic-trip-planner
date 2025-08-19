import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar nosso valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obter do localStorage local
      const item = window.localStorage.getItem(key);
      // Parse do JSON armazenado ou retorna initialValue se não existir
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro também retorna initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma versão wrapped da função setter do useState que...
  // ...persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que value seja uma função para que tenhamos a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva no estado
      setStoredValue(valueToStore);
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Uma implementação mais avançada lidaria com o caso de erro
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}