import CompanyService from "./services/CompanyService.js";

const companyService = new CompanyService();

export default async function routes(fastify, options) {
  fastify.get("/search", (request, reply) => {
    const { q } = request.query;

    if (q) {
      return companyService.search(q);
    }

    reply.code(400).send({ error: "Bad Request" });
  });

  fastify.get("/:slug", (request, reply) => {
    const { slug } = request.params;

    return companyService.getCompany(slug).catch((e) => {
      if (e.response && e.response.status === 404) {
        return reply.code(404).send({ error: "Not found" });
      }

      reply.code(400).send({ error: "Bad Request" });
    });
  });
}
