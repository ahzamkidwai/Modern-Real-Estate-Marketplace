import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function GoogleClickHandler() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      console.log("Response is (inside OAuth.jsx) : ", response);
      const responseData = await response.json();
      console.log("Response Data is (inside OAuth.jsx) : ", responseData.rest);

      dispatch(signInSuccess(responseData));
      console.log("OAuth.jsx mei responseData hain : ", responseData);
      navigate("/");

      // console.log("Result in OAuth.jsx : ", result);
    } catch (error) {
      console.log("Could not sign in with Google ", error.message);
    }
  }

  return (
    <button
      onClick={GoogleClickHandler}
      type="button"
      className="bg-red-700 text-white p-3 uppercase rounded-lg hover:opacity-95"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
