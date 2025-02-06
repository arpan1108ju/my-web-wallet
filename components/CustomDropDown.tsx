"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BlockChainType } from "@/lib/types"

interface CustomDropdownMenuProps {
  blockchains: BlockChainType[];
  setNetwork: (network: BlockChainType) => void;
  network : BlockChainType;
}

export function CustomDropdownMenu({ blockchains, setNetwork,network }: CustomDropdownMenuProps) {

  const handleChange = (ntk: string) => {
    const ntk_enum = BlockChainType[ntk as keyof typeof BlockChainType];
    setNetwork(ntk_enum);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{network}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={network} onValueChange={handleChange}>
          {blockchains.map((bc) => (
            <DropdownMenuRadioItem key={bc} value={bc}>
              {bc}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
