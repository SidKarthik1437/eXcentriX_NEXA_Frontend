import Sidebar from "@/components/admin/user/Sidebar";
import Header from "../components/Header";
import UserDetails from "@/components/admin/user/UserDetails";
import { useState } from "react";

function UserAdmin() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2 relative ">
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col w-2/5 h-full  gap-y-4 justify-between border border-primary rounded">
            <Sidebar onUserSelect={setSelectedUser} />
          </section>
          <section className="h-full w-3/5">
            {selectedUser && <UserDetails user={selectedUser} />}
            {!selectedUser && "Select a user to see their details."}
          </section>
        </div>
      </div>
    </main>
  );
}

export default UserAdmin;
