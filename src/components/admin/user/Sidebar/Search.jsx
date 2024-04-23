"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export default function Search({ users, setUsers }) {
  const [value, setValue] = React.useState("");

  const handleFilter = (e) => {
    setValue(e.target.value);
    setUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    console.log(users);
  };

  return (
    <Input
      value={value}
      onChange={(e) => handleFilter(e)}
      placeholder="Search users"
      className="w-full"
    />
  );
}
