import React from "react";

function StudentDetails({ user }) {
  return (
    <div className="flex flex-col h-2/6 w-full gap-y-1 justify-evenly">
      <div className="flex space-x-2">
        <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit  bg-white-500 text-gray-600 font-medium">
          {/* <span className="text-sm font-sm px-1">Answered</span> */}
          <span>Name</span>
          <hr className="text-white w-full h-[2px]" />
          <span>{user?.name}</span>
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
          {/* <span className="text-sm font-sm px-1">Answered</span> */}
          <span>USN</span>
          <hr className="text-white w-full h-[2px]" />
          <span>{user?.usn.toUpperCase()}</span>
        </div>

        <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
          {/* <span className="text-sm font-sm px-1">Answered</span> */}
          <span>Semester</span>
          <hr className="text-white w-full h-[2px]" />
          <span>{user?.semester}</span>
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
          {/* <span className="text-sm font-sm px-1">Answered</span> */}
          <span>Branch</span>
          <hr className="text-white w-full h-[2px]" />
          <span>{user?.department?.name}</span>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
