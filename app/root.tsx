import { useEffect, useState } from "react";
import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import type { ColorScheme } from "@mantine/core";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { Outlet } from "react-router-dom";

import { SocketProvider } from "~/contexts/socket";
import mainStylesUrl from "~/styles/main.css";
import Layout from "~/components/Layout";

export const meta: MetaFunction = () => {
  return { title: "Remix App" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: mainStylesUrl }];
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const [socket, setSocket] = useState<Socket>();

  // useEffect(() => {
  //   const socket = io();
  //   setSocket(socket);
  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("confirmation", (data) => {
  //     console.log(data);
  //   });
  // }, [socket]);

  return (
    <Document>
      <SocketProvider socket={socket}>
        <MantineTheme>
          <Layout>
            <Outlet />
          </Layout>
        </MantineTheme>
      </SocketProvider>
    </Document>
  );
}

function MantineTheme({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withNormalizeCSS
        withGlobalStyles
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
