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
        this.parseCompany(node).toJson()
      );

      return companies;
    }

    return [];
  }

  parseCompany(node) {
    const anchor = node.querySelector(".ResultBloc__link__content");
    const companyName = anchor.querySelector(".deno").innerHTML.trim();

    const nodesInfo = anchor.querySelectorAll(".txt");
    const description = nodesInfo[0].innerHTML.trim();
    const siren = nodesInfo[1].innerHTML
      .trim()
      .split(":")[1]
      .slice("&nbsp;".length);
    const address = nodesInfo[2].innerHTML.trim();

    return new Company(companyName, description, siren, address);
  }
}
