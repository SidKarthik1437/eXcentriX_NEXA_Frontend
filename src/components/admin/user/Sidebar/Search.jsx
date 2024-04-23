import * as React from "react";

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
