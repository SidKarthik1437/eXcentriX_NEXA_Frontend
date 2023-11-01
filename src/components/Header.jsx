function Header() {
  return (
    <div className="flex px-4 py-2  border-b-2 justify-between items-center">
      <div className="text-4xl font-bold tracking-wider">
        <span className="">N</span>
        <span className="text-purple-700">E</span>
        <span className="">X</span>
        <span className="text-purple-700">A</span>
      </div>
      <div>
        <button
          className=" h-8 bg-purple-00 text-white font-semibold px-2 rounded"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
