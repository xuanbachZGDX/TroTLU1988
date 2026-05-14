import authRouter     from "./auth";
import seedRouter     from "./insert";
import categoryRouter from "./category";
import postRouter     from "./post";
import priceRouter    from "./price";
import areaRouter     from "./area";
import provinceRouter from "./province";
import userRouter     from "./user";
import featureRouter  from "./feature";
import districtRouter from "./district";
import adminRouter    from "./admin";
import paymentRouter  from "./payment";
import appRouter      from "./app";

const initRoutes = (app) => {
  app.use("/api/v1/auth",       authRouter);
  app.use("/api/v1/seed",       seedRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/posts",      postRouter);
  app.use("/api/v1/prices",     priceRouter);
  app.use("/api/v1/areas",      areaRouter);
  app.use("/api/v1/provinces",  provinceRouter);
  app.use("/api/v1/districts",  districtRouter);
  app.use("/api/v1/users",      userRouter);
  app.use("/api/v1/features",   featureRouter);
  app.use("/api/v1/admin",      adminRouter);
  app.use("/api/v1/payment",    paymentRouter);
  app.use("/api/v1/app",        appRouter);

  return app.use("/", (req, res) => {
    res.send("Server on ...");
  });
};

export default initRoutes;
