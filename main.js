import _fastify from "fastify";
import CompanyService from "./CompanyService.js";

const fastify = _fastify({ logger: true });
const companyService = new CompanyService();

fastify.get("/search", (request) => {
  const { q } = request.query;

  return companyService.search(q);
});

const start = async () => {
  try {
    await fastify.listen(3001);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
