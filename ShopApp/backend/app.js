import express from "express";
import connectToDb from "./db.js";
import categoriesRouter from "./routes/categoriesRoutes.js";
import statusesRouter from "./routes/StatusesRoutes.js";
import ordersRouter from "./routes/OrdersRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import productsRouter from "./routes/productsRoutes.js";

//init app & middleware
const app = express();
app.use(express.json());

// connection to database
connectToDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database: ", error);
    process.exit(1);
  });

// routes

// region products routes

app.use("/products", productsRouter)

app.use("/status", statusesRouter);

app.use("/users", usersRouter);

app.use("/orders", ordersRouter);

app.use("/categories", categoriesRouter);
