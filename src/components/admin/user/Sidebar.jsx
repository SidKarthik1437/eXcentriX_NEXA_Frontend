import { useEffect, useState } from "react";
import { userServices } from "@/api/services";
import Search from "./Sidebar/Search";
import UserTabs from "./Sidebar/UserTabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Sidebar({ onUserSelect, mode }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userServices.fetchUsers().then((res) => {
      setUsers([...res]);
    });
  }, []);
  return (
    <div className="flex flex-col w-full h-full p-2 space-y-2">
      <div className="w-full">
        <Search />
      </div>
      <div className="flex-grow w-full">
        <UserTabs users={users} onUserSelect={onUserSelect} />
      </div>
      {mode ? (
        <Link
          to="/create-user"
          className="flex items-center justify-center rounded text-center font-semibold tracking-wider text-white bg-purple-700 h-10 cursor-pointer "
        >
          Create User
        </Link>
      ) : (
        <Link
          to="/userAdmin"
          className="flex items-center justify-center rounded text-center font-semibold tracking-wider text-white bg-purple-700 h-10 cursor-pointer "
        >
          User Details
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
