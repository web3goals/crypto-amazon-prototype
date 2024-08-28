"use client";

import { addressToShortAddress } from "@/lib/converters";
import { LogOutIcon, NetworkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { switchChain } from "wagmi/actions";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { supportedChains, wagmiConfig } from "./web3-provider";

export function SiteHeaderConnectButton() {
  const [domLoaded, setDomLoaded] = useState(false);
  const { address, chain, isConnected, isDisconnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (domLoaded && isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-sm font-medium text-muted-foreground"
          asChild
        >
          <Button variant="outline">
            ({addressToShortAddress(address)},{" "}
            {chain?.name || "Unsupported chain"})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Chains</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedChains.map((chain, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => switchChain(wagmiConfig, { chainId: chain.id })}
            >
              <NetworkIcon className="mr-2 h-4 w-4" />
              {chain.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (domLoaded && isDisconnected) {
    return (
      <Button onClick={() => connect({ connector: connectors[0] })}>
        Login
      </Button>
    );
  }

  return <></>;
}
