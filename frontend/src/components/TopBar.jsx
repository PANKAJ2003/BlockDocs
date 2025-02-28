import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const TopBar = () => {
  return (
    <div className="h-14  flex items-center justify-between px-15">
      <div className="font-bold">BlockDocs</div>
      <ConnectWalletButton />
    </div>
  );
};

export default TopBar;
