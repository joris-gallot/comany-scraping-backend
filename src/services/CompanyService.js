import axios from "axios";
import { JSDOM } from "jsdom";
import UserAgent from "user-agents";
import Company from "../models/Company.js";

const userAgent = new UserAgent();

export default class CompanyService {
  async search(name) {
    const res = await axios.get("https://www.societe.com/cgi-bin/liste", {
      responseType: "arraybuffer",
      params: {
        ori: "avance",
        nom: name,
      },
      headers: {
        Accept: "text/html",
        "User-Agent": userAgent.toString(),
      },
    });

    const dom = new JSDOM(res.data);
    const doc = dom.window.document;

    const nodeList = doc.querySelector("#search_details");

    if (nodeList) {
      const nodesCompanies = Array.from(nodeList.children);

      // remove last paragraph
      nodesCompanies.pop();

      const companies = nodesCompanies.map((node) =>
        this.parseNodeCompany(node).toJson()
      );

      return companies;
    }

    return [];
  }

  parseNodeCompany(node) {
    const anchor = node.querySelector(".ResultBloc__link__content");
    const companyName = anchor.querySelector(".deno").innerHTML.trim();

    const slug = anchor
      .getAttribute("href")
      .replace("/societe/", "")
      .split(".")[0];

    const nodesInfo = anchor.querySelectorAll(".txt");
    const description = nodesInfo[0].innerHTML.trim();
    const siren = nodesInfo[1].innerHTML
      .trim()
      .split(":")[1]
      .slice("&nbsp;".length);
    const address = nodesInfo[2].innerHTML.trim();

    return new Company(companyName, description, siren, address, slug);
  }

  async getCompany(slug) {
    const res = await axios.get(
      `https://www.societe.com/societe/${slug}.html`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "text/html",
          "User-Agent": userAgent.toString(),
        },
      }
    );

    if (res) {
      const dom = new JSDOM(res.data);
      const doc = dom.window.document;

      let createdAt,
        categorie,
        rcsNum = "unknow";

      const tableNode = doc.querySelector("table#rensjur");
      const rows = Array.from(tableNode.querySelectorAll("tr"));

      for (const row of rows) {
        const td = row.querySelectorAll("td");

        if (td && td.length >= 2) {
          const label = td[0].innerHTML.trim();

          switch (label) {
            case "Date création entreprise":
              createdAt = td[1].textContent.trim().slice(0, 10);
              break;

            case "Catégorie":
              categorie = td[1].textContent.trim();
              break;

            case "Numéro RCS":
              rcsNum = td[1].textContent.trim();
              break;
          }
        }
      }

      return {
        createdAt,
        categorie,
        rcsNum,
      };
    }

    throw new Error();
  }
}
