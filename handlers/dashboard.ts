import type { RequestHandler } from "express";


export const handler: RequestHandler = async (_req, res) => {
  res.render("dashboard");
};


export default handler;
