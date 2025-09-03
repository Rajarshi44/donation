import React, { createContext, ReactNode, useContext, useState } from 'react';

export type DonationStatus = 'LISTED' | 'RESERVED' | 'ASSIGNED' | 'PICKED UP' | 'DELIVERED';

export interface Donation {
  id: string;
  title: string;
  quantity: string;
  address: string;
  timeWindow: string;
  notes: string;
  status: DonationStatus;
  ngo?: string;
  driver?: string;
  image: string;
}

interface DonationsContextProps {
  donations: Donation[];
  createDonation: (donation: Omit<Donation, 'id' | 'status' | 'image'>) => void;
  updateDonationStatus: (id: string, status: DonationStatus, ngo?: string, driver?: string) => void;
}

const initialDonations: Donation[] = [
  {
    id: '1',
    title: '🍕 Pizza Boxes',
    quantity: '10',
    address: '123 Main St',
    timeWindow: '12-2pm',
    notes: 'Fresh, vegetarian',
    status: 'LISTED',
    image: 'https://picsum.photos/200?1',
  },
  {
    id: '2',
    title: '🥗 Salad Bowls',
    quantity: '15',
    address: '456 Oak Ave',
    timeWindow: '2-4pm',
    notes: 'Mixed greens',
    status: 'RESERVED',
    ngo: 'GreenHearts',
    image: 'https://picsum.photos/200?2',
  },
  {
    id: '3',
    title: '🍞 Bread Loaves',
    quantity: '20',
    address: '789 Pine Rd',
    timeWindow: '4-6pm',
    notes: 'Whole wheat',
    status: 'ASSIGNED',
    ngo: 'FoodAngels',
    driver: 'Alex',
    image: 'https://picsum.photos/200?3',
  },
  {
    id: '4',
    title: '🍎 Fruit Packs',
    quantity: '30',
    address: '321 Maple St',
    timeWindow: '10-12am',
    notes: 'Assorted apples',
    status: 'PICKED UP',
    ngo: 'Fruit4All',
    driver: 'Jamie',
    image: 'https://picsum.photos/200?4',
  },
];

const DonationsContext = createContext<DonationsContextProps | undefined>(undefined);

export const DonationsProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<Donation[]>(initialDonations);

  const createDonation = (donation: Omit<Donation, 'id' | 'status' | 'image'>) => {
    setDonations(prev => [
      {
        ...donation,
        id: (Math.random() * 100000).toFixed(0),
        status: 'LISTED',
        image: `https://picsum.photos/200?${Math.floor(Math.random()*1000)}`,
      },
      ...prev,
    ]);
  };

  const updateDonationStatus = (id: string, status: DonationStatus, ngo?: string, driver?: string) => {
    setDonations(prev => prev.map(d =>
      d.id === id ? { ...d, status, ngo: ngo ?? d.ngo, driver: driver ?? d.driver } : d
    ));
  };

  return (
    <DonationsContext.Provider value={{ donations, createDonation, updateDonationStatus }}>
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationsContext);
  if (!context) throw new Error('useDonations must be used within DonationsProvider');
  return context;
}
