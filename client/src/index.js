import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, metamaskWallet, walletConnect } from "@thirdweb-dev/react";
import './index.css';
import { Sepolia } from "@thirdweb-dev/chains";
import { BrowserRouter } from 'react-router-dom';

const activeChain = "ethereum";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ThirdwebProvider activeChain={activeChain}  supportedWallets={[metamaskWallet(), walletConnect()]}>
      <App />
    </ThirdwebProvider>
  </BrowserRouter>
);

