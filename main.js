import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import _fastify from "fastify";
import CompanyService from "./src/services/CompanyService.js";

dotenv.config();

const fastify = _fastify({ logger: true });
fastify.register(fastifyCors);

const companyService = new CompanyService();

fastify.get("/search", (request, reply) => {
  const { q } = request.query;

  if (q) {
    return companyService.search(q);
  }

  reply.code(400).send({ error: "Bad Request" });
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3001, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
