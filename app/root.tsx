import { useEffect, useState } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import type { ColorScheme } from "@mantine/core";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

import { SocketProvider } from "~/contexts/socket";
import mainStylesUrl from "~/styles/main.css";

export const meta: MetaFunction = () => {
  return { title: "Remix App" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: mainStylesUrl }];
};

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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SocketProvider socket={socket}>
          <MantineTheme>
            <Outlet />
          </MantineTheme>
        </SocketProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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
