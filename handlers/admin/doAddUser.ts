import type { RequestHandler } from "express";

import { getUser } from "../../helpers/recordsDB/getUser.js";
import { addUser } from "../../helpers/recordsDB/addUser.js";


export const handler: RequestHandler = async (request, response) => {

  const userName: string = request.body.userName;

  const existingUser = await getUser(userName, false);

  if (existingUser) {

    return response.json({
      success: false,
      message: "A user already exists with the same user name."
    });
  }

  const newUser = await addUser(userName);

  return newUser
    ? response.json({
      success: true,
      user: newUser
    })
    : response.json({
      success: false,
      message: "An unknown error occurred."
    });
};


export default handler;
