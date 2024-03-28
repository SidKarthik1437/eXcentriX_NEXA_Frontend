import Sidebar from "@/components/admin/user/Sidebar";
import Header from "../components/Header";
import UserDetails from "@/components/admin/user/UserDetails";
import CreateUser from "@/components/admin/user/CreateUser";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function UserAdmin() {
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();

  const isUserAdminRoute = location.pathname.endsWith("/userAdmin");
  // This assumes your path is exactly '/userAdmin' or '/create-user'
  // Adjust based on your application's routing needs

  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2 relative ">
        <div className="flex w-full h-full justify-between items-center gap-2">
          <section className="flex flex-col w-1/2 h-full  gap-y-4 justify-between border border-primary rounded">
            <Sidebar onUserSelect={setSelectedUser} mode={isUserAdminRoute} />
          </section>
          {isUserAdminRoute ? (
            <section className="h-full w-1/2">
              {selectedUser ? (
                <UserDetails user={selectedUser} />
              ) : (
                "Select a user to see their details."
              )}
            </section>
          ) : (
            <section className="h-full w-3/5">
              <CreateUser />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default UserAdmin;
