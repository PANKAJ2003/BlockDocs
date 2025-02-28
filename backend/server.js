import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileRouter } from "./routes/file.routes.js";
import connectToDb from "./utils/connectToDb.js";

dotenv.config();

connectToDb();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running" });
})

app.use("/", fileRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
