import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
