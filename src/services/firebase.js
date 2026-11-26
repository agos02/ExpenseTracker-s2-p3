import {
  initializeApp,
  getApp,
  getApps,
} from 'firebase/app'

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

// Configuración del mismo proyecto Firebase
// que utiliza React Native.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Evitamos inicializar Firebase más de una vez.
const appYaInicializada = getApps().length > 0

const app = appYaInicializada
  ? getApp()
  : initializeApp(firebaseConfig)

// En la PWA usamos caché persistente de Firestore.
// Esto permite guardar datos localmente en IndexedDB,
// incluso si cerramos y volvemos a abrir la página.
export const db = appYaInicializada
  ? getFirestore(app)
  : initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    })
