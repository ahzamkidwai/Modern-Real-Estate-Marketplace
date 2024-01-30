import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submitHandler(event) {
    event.preventDefault();
    try {
      setLoading(true);
      console.log("Form Submitted");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      //console.log("Response is : ", response);
      const data = await response.json();
      console.log("Response is (inside signup.jsx) : ", response);
      console.log("Data is (inside signup.jsx) : ", data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => {
        navigate("/sign-in");
      }, 1000);
      console.log("Submit Handler mei data hain : ", data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
  }

  function changeHandler(event) {
    console.log("onchangeHandler call ho raha");
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your username"
          className="border p-3 rounded-lg"
          name="username"
          id="username"
          value={formData.username}
          onChange={changeHandler}
        />
        <input
          type="email"
          placeholder="Enter you Email"
          className="border p-3 rounded-lg"
          name="email"
          id="email"
          value={formData.email}
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="Enter your Password"
          className="border p-3 rounded-lg"
          name="password"
          id="password"
          value={formData.password}
          onChange={changeHandler}
          autoComplete="off"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}{" "}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Have an Account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700"> Login</span>
        </Link>
      </div>
      <div>
        {error ? <p className="text-red-500 mt-5"> {error}</p> : <p></p>}
      </div>
    </div>
  );
}

export default SignUp;
