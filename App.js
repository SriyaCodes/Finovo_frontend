import { useState, useEffect, useCallback } from 'react';
import { BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenCapture from 'expo-screen-capture';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import TransactionSuccessScreen from './src/screens/TransactionSuccessScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import SetBudgetScreen from './src/screens/SetBudgetScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ReportPreviewScreen from './src/screens/ReportPreviewScreen';
import EditTransactionScreen from './src/screens/EditTransactionScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import TransactionInfoScreen from './src/screens/TransactionInfoScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import DataExportScreen from './src/screens/DataExportScreen';
import { setAuthToken } from './src/services/apiClient';
import transactionService from './src/services/transactionService';
import { ThemeProvider, useTheme } from './src/styles/theme';

function ThemedStatusBar() {
  const { isDark, colors } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.backgroundPrimary} />;
}


const SCREENS = {
  SPLASH: 'splash',
  ONBOARDING: 'onboarding',
  WELCOME: 'welcome',
  LOGIN: 'login',
  REGISTER: 'register',
  HOME: 'home',
  ADD_TRANSACTION: 'add_transaction',
  TRANSACTION_SUCCESS: 'transaction_success',
  PROFILE: 'profile',
  ACCOUNT_SETTINGS: 'account_settings',
  SET_BUDGET: 'set_budget',
  ANALYTICS: 'analytics',
  REPORT_PREVIEW: 'report_preview',
  EDIT_TRANSACTION: 'edit_transaction',
  NOTIFICATIONS: 'notifications',
  TRANSACTION_INFO: 'transaction_info',
  NOTIFICATION_SETTINGS: 'notification_settings',
  PRIVACY_POLICY: 'privacy_policy',
  DATA: 'data',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [history, setHistory] = useState([]);
  const [authData, setAuthData] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);  // passed to success screen
  const [transactionToEdit, setTransactionToEdit] = useState(null); // passed to edit screen
  const [reportData, setReportData] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Allow screenshots globally for all screens (including password fields on Android)
    let subscription;
    const enableCapture = async () => {
      await ScreenCapture.allowScreenCaptureAsync();
      // Also use the subscription-based approach so it persists
      subscription = ScreenCapture.addScreenshotListener(() => {});
    };
    enableCapture();
    return () => subscription?.remove?.();
  }, []);

  const navigate = useCallback((target, clearHistory = false) => {
    setScreen((prevScreen) => {
      // Prevent duplicate consecutive entries
      if (prevScreen !== target) {
        if (clearHistory) {
          setHistory([]);
        } else {
          setHistory((prev) => [...prev, prevScreen]);
        }
      }
      return target;
    });
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const onBackPress = () => {
      // If we are at root-level screens, let it exit
      if ([SCREENS.HOME, SCREENS.WELCOME, SCREENS.ONBOARDING, SCREENS.SPLASH].includes(screen)) {
        return false;
      }
      // If we are on login/register, go to welcome
      if (screen === SCREENS.LOGIN || screen === SCREENS.REGISTER) {
        navigate(SCREENS.WELCOME);
        return true;
      }
      // If we have history, pop to previous
      if (history.length > 0) {
        setHistory((prev) => {
          const newHist = [...prev];
          const prevScreen = newHist.pop();
          setScreen(prevScreen);
          return newHist;
        });
        return true; // We handled it
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [screen, history]);

  /** Shared BottomNav / tab router */
  const handleTabNav = (tab) => {
    switch (tab) {
      case 'home': navigate(SCREENS.HOME); break;
      case 'analytics': navigate(SCREENS.ANALYTICS); break;
      case 'add': navigate(SCREENS.ADD_TRANSACTION); break;
      case 'profile': navigate(SCREENS.PROFILE); break;
      case 'notifications': navigate(SCREENS.NOTIFICATIONS); break;
      case 'set_budget': navigate(SCREENS.SET_BUDGET); break;
      case 'account_settings': navigate(SCREENS.ACCOUNT_SETTINGS); break;
      case 'data': navigate(SCREENS.DATA); break;
      default: break;
    }
  };

  const handleAuthSuccess = (data) => {
    setAuthData(data);
    setAuthToken(data.access);
    navigate(SCREENS.HOME, true); // true = clear history
  };

  const handleLogout = () => {
    setAuthData(null);
    setAuthToken(null);
    navigate(SCREENS.WELCOME, true); // true = clear history
  };

  /** Called by AddTransactionScreen after a successful save */
  const handleSaveSuccess = (transaction) => {
    setLastTransaction(transaction);
    navigate(SCREENS.TRANSACTION_SUCCESS);
  };

  /** Called by HomeScreen when a transaction is pressed */
  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    navigate(SCREENS.EDIT_TRANSACTION);
  };

  const handleUndoTransaction = async (txnData) => {
    try {
      const payload = {
        amount: txnData.amount,
        description: txnData.description,
        date: txnData.date,
        category_id: txnData.category ? txnData.category.id : null,
      };
      if (!payload.category_id) delete payload.category_id;

      const res = await transactionService.createTransaction(payload);
      setLastTransaction(res);
      navigate(SCREENS.TRANSACTION_SUCCESS);
    } catch (e) {
      console.warn("Failed to undo transaction", e);
    }
  };

  const goBack = useCallback(() => {
    if (history.length > 0) {
      setHistory((prev) => {
        const newHist = [...prev];
        const prevScreen = newHist.pop();
        setScreen(prevScreen);
        return newHist;
      });
    } else {
      navigate(SCREENS.HOME, true);
    }
  }, [history, navigate]);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemedStatusBar />

      {screen === SCREENS.SPLASH && (
        <SplashScreen onComplete={() => navigate(SCREENS.ONBOARDING)} />
      )}

      {screen === SCREENS.ONBOARDING && (
        <OnboardingScreen onComplete={() => navigate(SCREENS.WELCOME)} />
      )}

      {screen === SCREENS.WELCOME && (
        <WelcomeScreen
          onCreateAccount={() => navigate(SCREENS.REGISTER)}
          onSignIn={() => navigate(SCREENS.LOGIN)}
        />
      )}

      {screen === SCREENS.LOGIN && (
        <LoginScreen
          onBack={() => navigate(SCREENS.WELCOME)}
          onLoginSuccess={handleAuthSuccess}
          onSignUpPress={() => navigate(SCREENS.REGISTER)}
        />
      )}

      {screen === SCREENS.REGISTER && (
        <RegisterScreen
          onBack={() => navigate(SCREENS.WELCOME)}
          onSignInPress={() => navigate(SCREENS.LOGIN)}
          onRegisterSuccess={handleAuthSuccess}
        />
      )}

      {screen === SCREENS.HOME && (
        <HomeScreen
          onNavigate={handleTabNav}
          onEditTransaction={handleEditTransaction}
        />
      )}

      {screen === SCREENS.ANALYTICS && (
        <AnalyticsScreen
          onBack={() => navigate(SCREENS.HOME)}
          onNavigate={handleTabNav}
          onReportPreview={(params) => {
            setReportData(params);
            navigate(SCREENS.REPORT_PREVIEW);
          }}
          onTransactionInfo={(txn) => {
            setSelectedNotification({
              notification_type: 'VIEW',
              transaction_data: txn
            });
            navigate(SCREENS.TRANSACTION_INFO);
          }}
        />
      )}

      {screen === SCREENS.REPORT_PREVIEW && (
        <ReportPreviewScreen
          onBack={() => navigate(SCREENS.ANALYTICS)}
          reportData={reportData}
        />
      )}

      {screen === SCREENS.NOTIFICATIONS && (
        <NotificationsScreen
          onBack={() => navigate(SCREENS.HOME)}
          onNavigate={handleTabNav}
          onNotificationPress={(notif) => {
            if (notif.transaction_data) {
              setSelectedNotification(notif);
              navigate(SCREENS.TRANSACTION_INFO);
            }
          }}
        />
      )}

      {screen === SCREENS.TRANSACTION_INFO && (
        <TransactionInfoScreen
          notif={selectedNotification}
          onBack={goBack}
          onEdit={(txn) => handleEditTransaction(txn)}
          onUndo={(txn) => handleUndoTransaction(txn)}
          onDownload={() => console.warn("Feature not fully implemented: Download Receipt")}
        />
      )}

      {screen === SCREENS.ADD_TRANSACTION && (
        <AddTransactionScreen
          onCancel={() => navigate(SCREENS.HOME)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      {screen === SCREENS.TRANSACTION_SUCCESS && (
        <TransactionSuccessScreen
          transaction={lastTransaction}
          onViewDashboard={() => navigate(SCREENS.HOME)}
          onAddAnother={() => navigate(SCREENS.ADD_TRANSACTION)}
          onClose={() => navigate(SCREENS.HOME)}
        />
      )}

      {screen === SCREENS.PROFILE && (
        <ProfileScreen
          onBack={() => navigate(SCREENS.HOME)}
          onNavigate={handleTabNav}
          onLogout={handleLogout}
          onAccountSettings={() => navigate(SCREENS.ACCOUNT_SETTINGS)}
          onSetBudget={() => navigate(SCREENS.SET_BUDGET)}
          onNotificationSettings={() => navigate(SCREENS.NOTIFICATION_SETTINGS)}
          onPrivacyPolicy={() => navigate(SCREENS.PRIVACY_POLICY)}
        />
      )}

      {screen === SCREENS.ACCOUNT_SETTINGS && (
        <AccountSettingsScreen
          onBack={() => navigate(SCREENS.PROFILE)}
          onNavigate={handleTabNav}
        />
      )}

      {screen === SCREENS.SET_BUDGET && (
        <SetBudgetScreen
          onBack={() => navigate(SCREENS.PROFILE)}
          onNavigate={handleTabNav}
        />
      )}

      {screen === SCREENS.NOTIFICATION_SETTINGS && (
        <NotificationSettingsScreen
          onBack={() => navigate(SCREENS.PROFILE)}
          onNavigate={handleTabNav}
        />
      )}

      {screen === SCREENS.PRIVACY_POLICY && (
        <PrivacyPolicyScreen
          onBack={() => navigate(SCREENS.PROFILE)}
        />
      )}

      {screen === SCREENS.DATA && (
        <DataExportScreen
          onBack={() => navigate(SCREENS.HOME)}
          onNavigate={handleTabNav}
        />
      )}

      {screen === SCREENS.EDIT_TRANSACTION && (
        <EditTransactionScreen
          transaction={transactionToEdit}
          onCancel={() => navigate(SCREENS.HOME)}
          onSaveSuccess={() => navigate(SCREENS.HOME)}
          onDeleteSuccess={() => navigate(SCREENS.HOME)}
        />
      )}
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
