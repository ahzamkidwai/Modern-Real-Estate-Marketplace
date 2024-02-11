//import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log("Data is : ", data);
        const responseData = data.listing;
        console.log("Response Data is : ", responseData);
        setListing(responseData);
        console.log("Listing is : ", listing);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <div>
      <div>
        {loading && (
          <p className="text-center my-7 text-2xl font-semibold">Loading... </p>
        )}
        {error && (
          <p className="text-center my-7 text-2xl font-semibold">
            Something went wrong{" "}
          </p>
        )}
        {listing && !loading && !error && (
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="h-[500px] " style={{background:`url(${url}) center no-repeat`}}></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default Listing;
