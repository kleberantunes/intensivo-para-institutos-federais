// Configuração do Firebase para autenticação com Google e salvamento de progresso no Firestore
// Para ativar:
// 1. Crie um projeto gratuito em https://console.firebase.google.com
// 2. Ative Authentication -> Google
// 3. Ative Firestore Database (com as regras de firestore.rules)
// 4. Copie as credenciais da sua Web App abaixo e salve como dist/firebase-config.js

window.FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

window.ADMIN_EMAILS = [
  "seu-email@gmail.com"
];
