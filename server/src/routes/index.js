import authRouter     from "./auth";
import seedRouter     from "./insert";
import categoryRouter from "./category";
import postRouter     from "./post";
import priceRouter    from "./price";
import areaRouter     from "./area";
import provinceRouter from "./province";
import userRouter     from "./user";
import featureRouter  from "./feature";

const initRoutes = (app) => {
  app.use("/api/v1/auth",       authRouter);
  app.use("/api/v1/seed",       seedRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/posts",      postRouter);
  app.use("/api/v1/prices",     priceRouter);
  app.use("/api/v1/areas",      areaRouter);
  app.use("/api/v1/provinces",  provinceRouter);
  app.use("/api/v1/users",      userRouter);
  app.use("/api/v1/features",   featureRouter);

  return app.use("/", (req, res) => {
    res.send("Server on ...");
  });
};

export default initRoutes;
