export const AUTH0_DOMAIN =
  process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? "dev-5b80gjqzo7hfo4d4.us.auth0.com";

export const AUTH0_CLIENT_ID =
  process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? "JMRmvWOiRdCxLHHFQPvAcZ4VRiFaQP4Z";

export const AUTH0_AUDIENCE =
  process.env.EXPO_PUBLIC_AUTH0_AUDIENCE ??
  "https://dev-5b80gjqzo7hfo4d4.us.auth0.com/api/v2/";

/** The scheme registered in app.json for deep linking */
export const AUTH0_CUSTOM_SCHEME = "vanguardapp";
