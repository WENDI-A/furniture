const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // <-- Needed for serving images

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve product images from the Assets folder
app.use("/images", express.static(path.join(__dirname, "Assets")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
