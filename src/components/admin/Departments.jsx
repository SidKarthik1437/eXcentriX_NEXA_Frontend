const DepartmentsSection = ({ departments, setDepOpen }) => {
  return (
    <div className="flex flex-col w-1/2 p-3 border-2 border-purple-200 shadow shadow-purple-20 rounded">
      <div className="flex items-center justify-between text-xl font-semibold tracking-wide">
        <span>Departments</span>
        <NewDepartmentButton setDepOpen={setDepOpen} />
      </div>
      <div className="flex flex-col items-center gap-y-2 pt-2 overflow-y-auto scrollbar-thin scrollbar-thin-purple-500">
        {departments.map((department) => (
          <DepartmentItem key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
};

const NewDepartmentButton = ({ setDepOpen }) => {
  return (
    <button
      onClick={() => setDepOpen(true)}
      className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
    >
      New Department +
    </button>
  );
};

const DepartmentItem = ({ department }) => {
  return (
    <div className="w-full font-medium p-2 border-2 border-purple-200 shadow shadow-purple-200 rounded">
      {department.id} - {department.name}
    </div>
  );
};

export default DepartmentsSection;
