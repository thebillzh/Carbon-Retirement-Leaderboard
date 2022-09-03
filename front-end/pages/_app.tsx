import { CommonContextProvider } from "@contexts/commonContextProvider";
import { LoadingProvider } from "@contexts/loadingProvider";
import { ModalProvider } from "@contexts/modalProvider";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { AppProps } from "next/app";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import "../styles/globals.css";

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, metaMaskHooks]];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CommonContextProvider>
      <Web3ReactProvider connectors={connectors}>
        <LoadingProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </LoadingProvider>
      </Web3ReactProvider>
    </CommonContextProvider>
  );
}

export default MyApp;
