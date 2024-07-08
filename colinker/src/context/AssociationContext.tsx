import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserAssociation } from '../service/associationService';

interface AssociationContextType {
  associations: { id: string; name: string }[];
  selectedAssociationId: string | null;
  setSelectedAssociationId: (id: string | null) => void;
}

const AssociationContext = createContext<AssociationContextType | undefined>(undefined);

export const AssociationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [associations, setAssociations] = useState<{ id: string; name: string }[]>([]);
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociations = async () => {
      if(localStorage.getItem('username')){
        try {
          //const response = await getUserAssociation(localStorage.getItem('username'));
          // const formattedResponse = response.map(assoc => ({
          //   id: assoc._id,
          //   name: assoc.name
          // }));
          //setAssociations(formattedResponse);
        } catch (error) {
          console.error("Erreur lors de la récupération des associations:", error);
          setAssociations([]);
        }
      }
    };
    fetchAssociations();
  }, []);

  return (
    <AssociationContext.Provider value={{ associations, selectedAssociationId, setSelectedAssociationId }}>
      {children}
    </AssociationContext.Provider>
  );
};

export const useAssociation = () => {
  const context = useContext(AssociationContext);
  if (!context) {
    throw new Error('useAssociation must be used within an AssociationProvider');
  }
  return context;
};
