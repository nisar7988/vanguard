import { useAlertStore } from "@/src/store/use-alert-store";
import { useAuthStore } from "@/src/store/use-auth-store";
import { useCallback, useState } from "react";
import { useAuth0 } from "react-native-auth0";

export function useAuth0Login() {
  const { signIn, signOut: storeSignOut } = useAuthStore();
  const { showAlert } = useAlertStore();
  const {
    authorize,
    clearSession,
    user,
    getCredentials,
    isLoading: auth0Loading,
  } = useAuth0();
  const [internalLoading, setInternalLoading] = useState(false);

  const login = useCallback(async () => {
    setInternalLoading(true);
    try {
      await authorize(
        {
          scope: "openid profile email offline_access",
          audience: "https://vanguard-api",
        },
        {
          customScheme: "vanguardapp",
        },
      );

      const credentials = await getCredentials();
      if (credentials) {
        signIn(
          credentials.accessToken,
          {
            email: user?.email ?? "user@example.com",
            name: user?.name ?? user?.nickname ?? "Vanguard User",
          },
          credentials.idToken ?? null,
        );
      }
    } catch (e: any) {
      if (
        e?.message !== "User cancelled login" &&
        e?.name !== "UserCancelledError"
      ) {
        console.error("Auth0 Login Error:", e);
        showAlert(
          "Login Error",
          e?.message ?? "Could not complete sign in. Please try again.",
          [{ text: "OK" }],
        );
      }
    } finally {
      setInternalLoading(false);
    }
  }, [authorize, getCredentials, signIn, showAlert, user]);

  const logout = useCallback(async () => {
    setInternalLoading(true);
    try {
      // For v5, customScheme is passed as an option in the second argument
      await clearSession({}, { customScheme: "vanguardapp" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      storeSignOut();
      setInternalLoading(false);
    }
  }, [clearSession, storeSignOut]);

  const isLoading = auth0Loading || internalLoading;

  return { login, logout, isLoading, isReady: true };
}
