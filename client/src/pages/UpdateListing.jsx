import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sell",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //   console.log("Files inside CreateListing.jsx : ", files);
  //   console.log("formData inside CreateListing.jsx : ", formData);

  useEffect(() => {
    const fetchListing = async () => {
      const listingID = params.listingId;
      console.log(
        "Listing id inside fetchlisting handler inside UpdateListing.jsx",
        listingID
      );
      const response = await fetch(`/api/listing/get/${listingID}`);
      const responseData = await response.json();
      console.log(
        "Response Data inside useEffect fetchListing handler : ",
        responseData
      );
      if (responseData.success === false) {
        console.log("responseData.success === false ", error.message);
        setError(error.message);
        return;
      }
      setFormData(responseData.listing);
    };
    fetchListing();
  }, []);

  function imageSubmitHandler(event) {
    // event.preventDefault();

    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImageFunction(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          /* console.log(
            "Image upload error (inside imageSubmitHandler) : ",
            err.message
          ); */
          setImageUploadError("Image upload failed. (Max 2 MB per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images ");
      setUploading(false);
    }
    // console.log("imageSubmitHandler function completed successfully : ");
  }

  async function storeImageFunction(file) {
    // console.log("Welcome to storeImageFunction handler");

    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image Uploaded is : ${progress}% done`);
        },
        (error) => {
          /* console.error(
            "Error during upload (We are inside storeImageFunction function ): ",
            error.message
          ); */
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            /* console.log(
              "Image successfully uploaded (We are inside storeImageFunction function ) :",
              downloadURL
            ); */
            resolve(downloadURL);
          });
        }
      );
      console.log("Image successfully uploaded");
    });
  }

  function deleteImageHandler(index) {
    // console.log("dlete image function is called");
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }

  function onChangeHandler(event) {
    if (event.target.name === "sale" || event.target.name === "rent") {
      setFormData({
        ...formData,
        type: event.target.name,
      });
    }

    if (
      event.target.name === "parking" ||
      event.target.name === "furnished" ||
      event.target.name === "offer"
    ) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.checked,
      });
    }

    if (
      event.target.type === "number" ||
      event.target.type === "text" ||
      event.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    // console.log("submitHandler function is called");
    try {
      console.log("We are inside submitHandler function try block");
      if (formData.imageUrls.length < 1)
        return setError("You must upload atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount Price must be lesser than Regular Price");
      setLoading(true);
      setError(false);
      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.rest._id,
        }),
      });
      // console.log("Current User hain : ", currentUser.rest);
      console.log("Response is : ", response);
      const responseData = await response.json();
      setLoading(false);
      /* console.log(
        "ResponseData inside (createListing.jsx for submitHandler) is : ",
        responseData
      ); */
      if (responseData.success === false) {
        // console.log("responseData.success === false hain");
        // setError("responseData.success === false hain " + responseData.message);
        setError(responseData.message);
      }
      navigate(`/listing/${currentUser.rest._id}`);
    } catch (error) {
      // setError("Error message hain " + error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-4"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            name="name"
            maxLength={64}
            min={10}
            required
            onChange={onChangeHandler}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            name="description"
            required
            onChange={onChangeHandler}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            name="address"
            required
            onChange={onChangeHandler}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sell"
                id="sell"
                className="w-5"
                onChange={onChangeHandler}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5"
                onChange={onChangeHandler}
                checked={formData.type === "rent"}
              />

              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
                onChange={onChangeHandler}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
                onChange={onChangeHandler}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                onChange={onChangeHandler}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={onChangeHandler}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={onChangeHandler}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                min="50"
                max="1000000  "
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={onChangeHandler}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs ">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="discountPrice"
                id="discountPrice"
                min="50"
                max="100000"
                className="p-3 border border-gray-300 rounded-lg"
                required
                onChange={onChangeHandler}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs ">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be cover image. (Max 6 images are allowed)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              name="images"
              id="image/*"
              className="p-3 border border-gray-400 rounded w-full"
              onChange={(event) => {
                setFiles(event.target.files);
              }}
              multiple
              accept="image/*"
            />
            <button
              type="button"
              className=" p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
              onClick={imageSubmitHandler}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => deleteImageHandler(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          <p className="text-red-700 text-sm ">{error ? error : ""}</p>
        </div>
      </form>
    </div>
  );
}

export default UpdateListing;
