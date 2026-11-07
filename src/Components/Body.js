import ResturantCard from "./ResturantCard.js";
import { useState, useEffect } from "react";
import Shimmer from "./shimmer";

const Body = () => {
  // State variables
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Body Rendered");

  const fetchData = async () => {
    console.log("Fetching Swiggy API via CORS Proxy...");
    try {
      setLoading(true);
      setError(null);

      // Swiggy API URL wrapped in CORS Proxy to fix production/incognito access issues
      const proxyUrl = "https://api.allorigins.win/raw?url=";
      const swiggyApi =
        "https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.6006363&lng=88.3840919&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

      const response = await fetch(proxyUrl + encodeURIComponent(swiggyApi));

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const json = await response.json();
      console.log("Swiggy API Response:", json);

      // Safely find the restaurant card from the response cards array
      const cards = json?.data?.cards || [];
      let restaurants = [];

      for (const card of cards) {
        const foundRestaurants =
          card?.card?.card?.gridElements?.infoWithStyle?.restaurants;

        if (foundRestaurants?.length) {
          restaurants = foundRestaurants;
          break;
        }
      }

      if (!restaurants.length) {
        throw new Error("Restaurant data not found in API response");
      }

      setListOfRestaurants(restaurants);
      setFilteredRestaurants(restaurants);
    } catch (err) {
      console.log("FULL ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering for Loading (Shimmer)
  if (loading) {
    return <Shimmer />;
  }

  // Conditional rendering for Error screen
  if (error) {
    return (
      <div className="error">
        <h2>Something went wrong!</h2>
        <p>{error}</p>
        <button onClick={fetchData}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="filter">
        <div className="search">
          <input
            type="text"
            className="searchbox"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            onClick={() => {
              // Filter restaurant cards and update UI based on search text
              const filteredResturant = listOfRestaurants.filter((res) =>
                res?.info?.name
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
              );
              setFilteredRestaurants(filteredResturant);
            }}
          >
            Search
          </button>
        </div>
        <button
          className="filter-btn"
          onClick={() => {
            // Filter logic for top-rated restaurants
            const filteredList = listOfRestaurants.filter(
              (res) => res?.info?.avgRating > 4
            );
            setFilteredRestaurants(filteredList);
          }}
        >
          Top-Rated Resturant
        </button>
      </div>
      <div className="res-container">
        {filteredRestaurants.map((restaurants) => (
          <ResturantCard key={restaurants?.info?.id} resData={restaurants} />
        ))}
      </div>
    </div>
  );
};

export default Body;