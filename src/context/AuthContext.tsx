import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserPersona, UserRole } from '../types';
import { USER_PERSONAS } from '../mockData/initialData';

interface AuthContextType {
  currentUser: UserPersona;
  switchRole: (role: UserRole) => void;
  selectedChildId: string;
  setSelectedChildId: (childId: string) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [selectedChildId, setSelectedChildId] = useState<string>('stud_101'); // Maya Lin

  const currentUser = USER_PERSONAS[currentRole] || USER_PERSONAS.admin;

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'parent') {
      setSelectedChildId('stud_101'); // Default to Maya
    } else if (role === 'student') {
      setSelectedChildId('stud_101');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (currentUser.permissions.includes('*')) return true;
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        selectedChildId,
        setSelectedChildId,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
