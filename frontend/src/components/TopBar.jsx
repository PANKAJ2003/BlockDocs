import React from "react";
import BlockDocsLogo from "../assets/BlockDocsLogo.svg";
import ConnectWalletButton from "./ConnectWalletButton";

const TopBar = () => {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-1">
        <div className="logo-container">
          <img src={BlockDocsLogo} alt="BlockDocs Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
