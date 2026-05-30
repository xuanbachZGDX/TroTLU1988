import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import initRoutes from "./src/routes";
import connectDb from "./src/config/connectDatabase";
import seedAdmin from "./src/utils/seedAdmin";
import seedPackages from "./src/utils/seedPackages";
import setupSwagger from "./src/config/swagger";
import { startScheduler } from "./src/utils/postScheduler";

dotenv.config();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

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

const startServer = async () => {
  try {
    await connectDb();
    await seedAdmin();
    await seedPackages();
    startScheduler();

    const port = process.env.PORT || 8888;
    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("Lỗi khi khởi động server:", error);
  }
};

startServer();

export default app;
