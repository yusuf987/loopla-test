import "@/styles/globals.css";
// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Loopla Event Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Component {...pageProps} />
      </Container>
    </>
  );
}
