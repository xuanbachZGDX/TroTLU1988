import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./src/routes";
import connectDb from "./src/config/connectDatabase";
import seedAdmin from "./src/utils/seedAdmin";
import setupSwagger from "./src/config/swagger";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);
initRoutes(app);
connectDb();
seedAdmin();

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});