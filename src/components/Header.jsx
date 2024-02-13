import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="flex px-4 py-2  border-b-2 justify-between items-center">
      <Link to={"/"} className="text-4xl font-bold tracking-wider">
        <span className="">N</span>
        <span className="text-purple-700">E</span>
        <span className="">X</span>
        <span className="text-purple-700">A</span>
      </Link>
      <div>
        <button
          className=" h-8 bg-purple-00 text-white font-semibold px-2 rounded bg-purple-600"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
