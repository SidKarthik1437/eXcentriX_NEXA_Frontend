import CreateMany from "./CreateUser/CreateMany";
import CreateOne from "./CreateUser/CreateOne";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreateUser() {
  return (
    <div className="flex flex-col w-full h-full border border-primary rounded">
      <div className="px-4 py-2 text-xl font-semibold tracking-wider shadow">
        Create User
      </div>

      <Tabs defaultValue="one" className="w-full">
        <TabsList className="w-full border">
          <TabsTrigger value="one" className="w-full rounded m-2">
            Create One
          </TabsTrigger>
          <TabsTrigger value="many" className="w-full rounded m-2">
            Create Batch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <CreateOne />
        </TabsContent>
        <TabsContent value="many">
          <CreateMany />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateUser;
