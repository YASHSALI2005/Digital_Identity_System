const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const identityRoutes = require("./routes/identityRoutes");
app.use("/api/identity", identityRoutes);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digital_identity";

mongoose.connect(DB_URI).then(() => {
    console.log("Connected to MongoDB local database");
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
