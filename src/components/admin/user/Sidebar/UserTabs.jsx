import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Faculties from "./Faculties";

function UserTabs({ users, onUserSelect }) {
  let faculty = users.filter((user) => user.role === "ADMIN");
  let students = users.filter((user) => user.role === "STUDENT");

  return (
    <Tabs defaultValue="Faculty" className="w-full p-2">
      <TabsList className="w-full  bg-purple-100 ">
        <TabsTrigger
          className="w-1/2 rounded"
          value="Faculty"
          onClick={(e) => console.log(e.target.innerText)}
        >
          Faculty
        </TabsTrigger>
        <TabsTrigger
          className="w-1/2 rounded"
          value="Students"
          onClick={(e) => console.log(e.target.innerText)}
        >
          Students
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Faculty">
        <Faculties faculties={faculty} onUserSelect={onUserSelect} />
      </TabsContent>
      <TabsContent value="Students">
        <Students students={students} onUserSelect={onUserSelect} />
      </TabsContent>
    </Tabs>
  );
}

export default UserTabs;

import PropTypes from "prop-types";
import Students from "./Students";

UserTabs.propTypes = {
  users: PropTypes.array,
};
