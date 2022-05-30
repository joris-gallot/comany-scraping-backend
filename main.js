import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import _fastify from "fastify";
import routes from "./src/routes.js";

dotenv.config();

const fastify = _fastify();

fastify.register(fastifyCors);
fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3001, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
