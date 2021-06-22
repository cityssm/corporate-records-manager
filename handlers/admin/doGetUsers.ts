import type { RequestHandler } from "express";

import getUsers from "../../helpers/recordsDB/getUsers.js";


export const handler: RequestHandler = async (_req, res) => {

  const users = await getUsers();

  return res.json({
    success: true,
    users
  });

};


export default handler;
