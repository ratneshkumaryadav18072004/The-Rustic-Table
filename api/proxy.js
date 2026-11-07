export default async function handler(req, res) {
  const swiggyUrl = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.6006363&lng=88.3840919&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";
  
  try {
    const response = await fetch(swiggyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    // CORS headers allow karne ke liye
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch from Swiggy API", details: error.message });
  }
}