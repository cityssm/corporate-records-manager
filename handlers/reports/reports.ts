import type { RequestHandler } from "express";


export const handler: RequestHandler = async (_request, response) => {
  response.render("reports", {
    headTitle: "Reports"
  });
};


export default handler;
