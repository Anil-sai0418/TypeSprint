import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// For simplicity in this implementation we include initial bundles here. 
// In a large application, you would use i18next-http-backend to lazy-load these from JSON files (e.g., /locales/{{lng}}/translation.json)
const resources = {
  en: {
    translation: {
      footer: {
        about: "ABOUT",
        sitemap: "SITEMAP",
        contact: "CONTACT",
        status: "STATUS",
        language: "LANGUAGE",
        home: "Home",
        type: "Type",
        leaderboard: "Leaderboard",
        developed_by: "Developed by"
      },
      nav: {
        login: "Login",
        user_details: "User Details",
        notifications: "Notifications",
        share_app: "Share this app",
        connected_via: "Connected via",
        logout: "Log out",
        logout_confirm_title: "Are you sure you want to logout?",
        logout_confirm_desc: "You are about to logout from the account. You will need to login again to access your profile.",
        cancel: "Cancel"
      },
      leaderboard: {
        title: "Leaderboard",
        subtitle: "Ranked by performance · {{count}} players",
        search_placeholder: "Search player...",
        rank: "Rank",
        player: "Player",
        peak_wpm: "Peak WPM",
        avg_wpm: "Avg WPM",
        accuracy: "Accuracy",
        streak: "Streak",
        tests: "Tests"
      },
      home: {
        time: "Time",
        words: "Words",
        restart_test: "Restart Test",
        click_to_focus: "Click or Press any key to focus",
        tab_enter_restart: "TAB + ENTER to restart",
        seconds: "s",
        words_count: "words"
      }
    }
  },
  es: {
    translation: {
      footer: {
        about: "ACERCA DE",
        sitemap: "MAPA DEL SITIO",
        contact: "CONTACTO",
        status: "ESTADO",
        language: "IDIOMA",
        home: "Inicio",
        type: "Escribir",
        leaderboard: "Clasificación",
        developed_by: "Desarrollado por"
      },
      nav: {
        login: "Iniciar sesión",
        user_details: "Detalles del usuario",
        notifications: "Notificaciones",
        share_app: "Compartir esta aplicación",
        connected_via: "Conectado a través de",
        logout: "Cerrar sesión",
        logout_confirm_title: "¿Estás seguro de que quieres cerrar sesión?",
        logout_confirm_desc: "Estás a punto de cerrar sesión. Necesitarás iniciar sesión nuevamente para acceder a tu perfil.",
        cancel: "Cancelar"
      },
      leaderboard: {
        title: "Clasificación",
        subtitle: "Clasificado por rendimiento · {{count}} jugadores",
        search_placeholder: "Buscar jugador...",
        rank: "Rango",
        player: "Jugador",
        peak_wpm: "Pico de PPM",
        avg_wpm: "PPM Promedio",
        accuracy: "Precisión",
        streak: "Racha",
        tests: "Pruebas"
      },
      home: {
        time: "Tiempo",
        words: "Palabras",
        restart_test: "Reiniciar prueba",
        click_to_focus: "Haz clic o presiona cualquier tecla",
        tab_enter_restart: "TAB + ENTER para reiniciar",
        seconds: "s",
        words_count: "palabras"
      }
    }
  },
  fr: {
    translation: {
      footer: {
        about: "À PROPOS",
        sitemap: "PLAN DU SITE",
        contact: "CONTACT",
        status: "STATUT",
        language: "LANGUE",
        home: "Accueil",
        type: "Taper",
        leaderboard: "Classement",
        developed_by: "Développé par"
      },
      nav: {
        login: "Connexion",
        user_details: "Détails de l'utilisateur",
        notifications: "Notifications",
        share_app: "Partager cette application",
        connected_via: "Connecté via",
        logout: "Se déconnecter",
        logout_confirm_title: "Êtes-vous sûr de vouloir vous déconnecter?",
        logout_confirm_desc: "Vous êtes sur le point de vous déconnecter du compte. Vous devrez vous reconnecter pour accéder à votre profil.",
        cancel: "Annuler"
      },
      leaderboard: {
        title: "Classement",
        subtitle: "Classé par performance · {{count}} joueurs",
        search_placeholder: "Rechercher un joueur...",
        rank: "Rang",
        player: "Joueur",
        peak_wpm: "Pic MPM",
        avg_wpm: "Moy MPM",
        accuracy: "Précision",
        streak: "Série",
        tests: "Tests"
      },
      home: {
        time: "Temps",
        words: "Mots",
        restart_test: "Recommencer le test",
        click_to_focus: "Cliquez ou appuyez sur une touche",
        tab_enter_restart: "TAB + ENTRÉE pour recommencer",
        seconds: "s",
        words_count: "mots"
      }
    }
  },
  hi: {
    translation: {
      footer: {
        about: "के बारे में",
        sitemap: "साइटमैप",
        contact: "संपर्क",
        status: "स्थिति",
        language: "भाषा",
        home: "मुख्य पृष्ठ",
        type: "कक्षा",
        leaderboard: "लीडरबोर्ड",
        developed_by: "द्वारा विकसित"
      },
      nav: {
        login: "लॉग इन",
        user_details: "उपयोगकर्ता विवरण",
        notifications: "सूचनाएँ",
        share_app: "इस ऐप को साझा करें",
        connected_via: "के माध्यम से जुड़ा",
        logout: "लॉग आउट",
        logout_confirm_title: "क्या आप निश्चित रूप से लॉग आउट करना चाहते हैं?",
        logout_confirm_desc: "आप खाते से लॉग आउट करने वाले हैं। अपनी प्रोफ़ाइल तक पहुँचने के लिए आपको फिर से लॉग इन करना होगा।",
        cancel: "रद्द करें"
      },
      leaderboard: {
        title: "लीडरबोर्ड",
        subtitle: "प्रदर्शन के आधार पर रैंकिंग · {{count}} खिलाड़ी",
        search_placeholder: "खिलाड़ी खोजें...",
        rank: "रैंक",
        player: "खिलाड़ी",
        peak_wpm: "शीर्ष WPM",
        avg_wpm: "औसत WPM",
        accuracy: "सटीकता",
        streak: "लगातार",
        tests: "परीक्षण"
      },
      home: {
        time: "समय",
        words: "शब्द",
        restart_test: "परीक्षण पुनः आरंभ करें",
        click_to_focus: "ध्यान केंद्रित करने के लिए क्लिक करें",
        tab_enter_restart: "पुनः आरंभ करने के लिए TAB + ENTER",
        seconds: "सेकंड",
        words_count: "शब्द"
      }
    }
  },
  ar: {
    translation: {
      footer: {
        about: "حول",
        sitemap: "خريطة الموقع",
        contact: "اتصل بنا",
        status: "الحالة",
        language: "لغة",
        home: "الرئيسية",
        type: "اكتب",
        leaderboard: "المتصدرين",
        developed_by: "طورت بواسطة"
      },
      nav: {
        login: "تسجيل الدخول",
        user_details: "تفاصيل المستخدم",
        notifications: "إشعار",
        share_app: "شارك هذا التطبيق",
        connected_via: "متصل عبر",
        logout: "تسجيل خروج",
        logout_confirm_title: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
        logout_confirm_desc: "أنت على وشك تسجيل الخروج من الحساب. ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى ملفك الشخصي.",
        cancel: "إلغاء"
      },
      leaderboard: {
        title: "المتصدرين",
        subtitle: "مرتبة حسب الأداء · {{count}} اللاعبين",
        search_placeholder: "ابحث عن لاعب...",
        rank: "مرتبة",
        player: "لاعب",
        peak_wpm: "الذروة في الدقيقة",
        avg_wpm: "متوسط الكلمات في الدقيقة",
        accuracy: "دقة",
        streak: "خط",
        tests: "الاختبارات"
      },
      home: {
        time: "الوقت",
        words: "كلمات",
        restart_test: "إعادة الاختبار",
        click_to_focus: "انقر أو اضغط على أي مفتاح",
        tab_enter_restart: "اضغط TAB + ENTER لإعادة التشغيل",
        seconds: "ثانية",
        words_count: "كلمات"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'hi', 'ar'],
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
