"use client";

import { siteConfig } from "@/config/site";
import {
  CoinsIcon,
  CompassIcon,
  GithubIcon,
  HandshakeIcon,
  MenuIcon,
  MessagesSquareIcon,
  SearchIcon,
  ShoppingBasketIcon,
  StoreIcon,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeaderConnectButton } from "./site-header-connect-button";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/icon.png" alt="Icon" width="24" height="24" />
            <p className="text-primary font-bold hidden md:inline-block">
              {siteConfig.name}
            </p>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <SiteHeaderConnectButton />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-sm font-medium text-muted-foreground"
              asChild
            >
              <Button variant="outline" size="icon">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Seller</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/seller">
                <DropdownMenuItem>
                  <StoreIcon className="mr-2 h-4 w-4" />
                  <span>Seller</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/seller/sales">
                <DropdownMenuItem>
                  <HandshakeIcon className="mr-2 h-4 w-4" />
                  <span>Sales</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/seller/balance">
                <DropdownMenuItem>
                  <WalletIcon className="mr-2 h-4 w-4" />
                  <span>Balance</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Buyer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/products">
                <DropdownMenuItem>
                  <CompassIcon className="mr-2 h-4 w-4" />
                  <span>Explore</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/products/search">
                <DropdownMenuItem>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/buyer/purchases">
                <DropdownMenuItem>
                  <ShoppingBasketIcon className="mr-2 h-4 w-4" />
                  <span>Purchases</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/faucet">
                <DropdownMenuItem>
                  <CoinsIcon className="mr-2 h-4 w-4" />
                  <span>Faucet</span>
                </DropdownMenuItem>
              </Link>
              <Link href="https://app.converse.xyz/" target="_blank">
                <DropdownMenuItem>
                  <MessagesSquareIcon className="mr-2 h-4 w-4" />
                  <span>Converse</span>
                </DropdownMenuItem>
              </Link>
              <Link href={siteConfig.links.github} target="_blank">
                <DropdownMenuItem>
                  <GithubIcon className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
