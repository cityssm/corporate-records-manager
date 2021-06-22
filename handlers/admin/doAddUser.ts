import type { RequestHandler } from "express";

import getUser from "../../helpers/recordsDB/getUser.js";
import addUser from "../../helpers/recordsDB/addUser.js";


export const handler: RequestHandler = async (req, res) => {

  const userName: string = req.body.userName;

  const existingUser = await getUser(userName, false);

  if (existingUser) {

    return res.json({
      success: false,
      message: "A user already exists with the same user name."
    });
  }

  const newUser = await addUser(userName);

  if (newUser) {

    return res.json({
      success: true,
      user: newUser
    });

  } else {
    return res.json({
      success: false,
      message: "An unknown error occurred."
    });
  }
};


export default handler;
