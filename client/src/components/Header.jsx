import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // console.log("Current User hain inside Header.jsx : ", currentUser);

  function submitHandler(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams is : ", urlParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    console.log("Search Query is : ", searchQuery);
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  //console.log("Header mei currUser hain : ", currUser.currentUser.rest);
  return (
    <header className="bg-slate-300">
      <div className=" flex flex-row justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500"> Sahand </span>
            <span className="text-slate-700"> Estate </span>
          </h1>
        </Link>
        <form
          className="bg-slate-100 p-3 rounded-lg flex flex-row items-center"
          onSubmit={submitHandler}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button>
            <FaSearch className="text-slate-700" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser.currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.currentUser.rest.avatar}
                alt="User Profile Picture"
              />
            ) : (
              <li className="sm:inline text-slate-700 hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
