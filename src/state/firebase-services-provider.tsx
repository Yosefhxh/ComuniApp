import { createContext, useContext, type ReactNode } from 'react';

import { firebaseServices, type FirebaseServices } from '@/services/firebase';

const FirebaseServicesContext = createContext<FirebaseServices>(firebaseServices);

export function FirebaseServicesProvider({ children, value = firebaseServices }: { children: ReactNode; value?: FirebaseServices }) {
  return <FirebaseServicesContext.Provider value={value}>{children}</FirebaseServicesContext.Provider>;
}

export function useFirebaseServices(): FirebaseServices {
  return useContext(FirebaseServicesContext);
}
