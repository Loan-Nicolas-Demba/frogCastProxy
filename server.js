require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


const apiKey = process.env.FROGCAST_API_KEY;
app.get("/forecast", async (req, res) => {
  try {
    const { latitude, longitude, fields } = req.query;

    const apiUrl =
      `https://api.frogcast.com/api/v1/forecast/?latitude=${encodeURIComponent(latitude)}` +
      `&longitude=${encodeURIComponent(longitude)}` +
      `&fields=${encodeURIComponent(fields)}`+
      `&time_step=${60}&horizon${7200}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.FROGCAST_API_KEY}`
      }
    });
    console.log(apiUrl);
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).send(text);
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});