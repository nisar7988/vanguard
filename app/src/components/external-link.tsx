import { Href, Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { type ComponentProps } from "react";
import { Linking } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
};

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          try {
            await openBrowserAsync(href, {
              presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
            });
          } catch (error: any) {
            console.error("Failed to open browser:", error);
            // Fallback for Android emulators/devices without specialized browser activities
            if (error?.message?.includes("No matching browser activity")) {
              try {
                await Linking.openURL(href);
              } catch (linkError) {
                console.error("Linking fallback failed:", linkError);
              }
            }
          }
        }
      }}
    />
  );
}
