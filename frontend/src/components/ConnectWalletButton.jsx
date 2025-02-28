import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

const ConnectWalletButton = () => {
  return <ConnectButton accountStatus="full" showBalance={true} />;
};

export default ConnectWalletButton;
