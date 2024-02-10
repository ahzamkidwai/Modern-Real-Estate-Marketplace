import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileReference = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [usersListings, setUsersListings] = useState([]);
  const dispatch = useDispatch();

  // console.log("File is inside (Profile.jsx) : ", file);
  // console.log("File Percentage uploaded is : ", filePercentage);
  console.log("FormData is (inside Profile.jsx) : ", formData);
  console.log("currentUser is (inside Profile.jsx) : ", currentUser);
  console.log("UserListings are : ", usersListings);

  useEffect(() => {
    if (file) {
      uploadFileHandler(file);
    }
  }, [file]);

  async function showListingsHandler() {
    console.log("showListingsHandler function call hua hain");
    console.log("Current USER HAIn  : ", currentUser.rest);
    try {
      setShowListingError(false);
      const response = await fetch(
        `/api/user/listings/${currentUser.rest._id}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      console.log("showListingsHandler mei responseData hain : ", responseData);
      if (responseData.success === false) {
        setShowListingError(true);
        return;
      }
      setUsersListings(responseData.listings);
      console.log("UsersLISTINGS : ", usersListings);
    } catch (error) {
      setShowListingError(true);
    }
  }

  function uploadFileHandler(file) {
    const storage = getStorage(app);
    console.log("File Details inside uploadFileHandler function : ", file);
    const fileName = new Date().getTime() + file.name; //Create Unique Name
    const storageReference = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageReference, file); //Gives the percentage of file uploaded

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is ", progress, " % done");
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  }

  function changeHandler(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log("FormData inside changeHandler : ", formData);
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log("SubmitHandler inside Profile.jsx : ", currentUser);
      const response = await fetch(`/api/user/update/${currentUser.rest._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData.success === false) {
        dispatch(updateUserFailure(responseData.message));
        return;
      }
      dispatch(updateUserSuccess(responseData));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function deleteUserHandler() {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser.rest._id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.success === false) {
        dispatch(deleteUserFailure(responseData.message));
        return;
      }
      dispatch(deleteUserSuccess(responseData));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function signOutHandler() {
    try {
      dispatch(signoutUserStart());
      const response = await fetch("/api/auth/signout", {
        method: "GET",
      });
      const responseData = await response.json();
      if (responseData === false) {
        dispatch(signoutUserFailure(responseData.message));
        return;
      }
      dispatch(signoutUserSuccess(responseData));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  }

  async function deleteListingHandler(listingId) {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.success === false) {
        console.log(responseData.message);
        return;
      }
      setUsersListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {}
  }

  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="file"
          ref={fileReference}
          hidden
          accept="image/*"
          onClick={(event) => {
            setFile(event.target.files[0]);
          }}
        />
        <img
          src={formData.avatar || currentUser.rest.avatar}
          alt="User Profile Picture"
          className="rounded-full h-24 w-24 cursor-pointer object-cover self-center mt-2"
          onClick={() => fileReference.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              {" "}
              Error Image Uplaod (Image must be less than 10 MB){" "}
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg font-semibold"
          id="username"
          name="username"
          defaultValue={currentUser.rest.username}
          onChange={changeHandler}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg font-semibold"
          id="email"
          name="email"
          defaultValue={currentUser.rest.email}
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          name="password"
          onChange={changeHandler}
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 text-white rounded-lg hover:opacity-95 p-3 disabled:opacity-80 font-semibold"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <button className="uppercase bg-green-700 text-white rounded-lg hover:opacity-95 p-3 disabled:opacity-80 font-semibold">
          <Link to="/create-listing">Create Listing</Link>
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 font-semibold cursor-pointer"
          onClick={deleteUserHandler}
        >
          Delete Account
        </span>
        <span
          className="text-red-700 font-semibold cursor-pointer"
          onClick={signOutHandler}
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 font-semibold mt-5 text-center">
        {error ? error.message : ""}
      </p>
      <p className="text-green-700 font-semibold mt-5 text-center">
        {updateSuccess ? "User updated Successfully." : ""}
      </p>
      <div
        onClick={showListingsHandler}
        className="text-green-700 w-full text-center"
      >
        Show Listings
        <p className="text-red-700 mt-5">
          {showListingError ? showListingError : ""}
        </p>
        {usersListings && usersListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Listings
            </h1>
            {usersListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => deleteListingHandler(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <button className="text-green-700 uppercase">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
