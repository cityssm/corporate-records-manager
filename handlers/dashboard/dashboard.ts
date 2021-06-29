import type { RequestHandler } from "express";


export const handler: RequestHandler = async (_request, response) => {

  response.render("dashboard", {
    headTitle: "Dashboard"
  });
};


export default handler;
