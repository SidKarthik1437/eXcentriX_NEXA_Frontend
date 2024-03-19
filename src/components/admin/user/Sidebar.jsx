import { useEffect, useState } from "react";
import { userServices } from "@/api/services";
import Search from "./Sidebar/Search";
import UserTabs from "./Sidebar/UserTabs";

function Sidebar({ onUserSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userServices.fetchUsers().then((res) => {
      setUsers([...res]);
    });
  }, []);
  return (
    <div className="flex flex-col w-full items-center justify-center p-2 space-y-2">
      <div className="w-full">
        <Search />
      </div>
      <div className="w-full">
        <UserTabs users={users} onUserSelect={onUserSelect} />
      </div>
    </div>
  );
}

export default Sidebar;
