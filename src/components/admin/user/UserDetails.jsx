import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// UserDetails component
function UserDetails({ user }) {
  return (
    <div className="flex flex-col w-full border border-primary h-full rounded space-y-2">
      <div className="text-xl font-semibold tracking-wider shadow-sm shadow-b shadow-primary p-2">
        User Details
      </div>
      <div className="grid grid-cols-2 w-full gap-4 px-4">
        <div className="">
          <Label htmlFor="usn">USN</Label>
          <Input
            type="text"
            id="usn"
            placeholder="USN"
            value={user.usn}
            disabled
            className="disabled:opacity-90 shadow"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            type="text"
            id="department"
            placeholder="Department"
            value={user.department.name}
            disabled
            className="disabled:opacity-90 shadow sow"
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            value={user.name}
            disabled
            className="disabled:opacity-90 shadow"
          />
        </div>
        {user.semester && (
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input
              type="text"
              id="semester"
              placeholder="Semester"
              value={user.semester}
              disabled
              className="disabled:opacity-90 shadow"
            />
          </div>
        )}
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            type="text"
            id="role"
            placeholder="Role"
            value={user.role}
            disabled
            className="disabled:opacity-90 shadow"
          />
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            type="date"
            id="dob"
            // placeholder="dob"
            value={user.dob}
            disabled
            className="disabled:opacity-90 shadow"
          />
        </div>
      </div>
    </div>
  );
}
export default UserDetails;
