import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function submitHandler(event) {
    event.preventDefault();

    try {
      dispatch(signInStart());

      /* console.log(
        "Loadin (inside signin.jsx) from userSlice : ",
        loading,
        " error (inside signin.jsx) : ",
        error
      ); */

      console.log("Form Submitted");

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      //console.log("Response is : ", response);
      const data = await response.json();

      if (data.success === false) {
        dispatch(signInFailure(error.message));
        return;
      }

      dispatch(signInSuccess(data));
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 1000);

      console.log("Submit Handler mei data hain : ", data);
    } catch (error) {
      dispatch(signInFailure(error.message));
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
      <h1 className="text-3xl text-center font-semibold my-7">SignIn</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
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
          {loading ? "Loading..." : "SignIn"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Doesn't have an Account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700"> Sign Up</span>
        </Link>
      </div>
      <div>
        {error ? <p className="text-red-500 mt-5"> {error}</p> : <p></p>}
      </div>
    </div>
  );
}

export default SignIn;
