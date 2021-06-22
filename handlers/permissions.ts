import { RequestHandler } from "express";


export const canUpdate: RequestHandler = (req, res, next) => {

  if (req.session.user.canUpdate) {
    return next();
  }

  res.status(403);

  return res.json({
    success: false
  });
};


export const isAdmin: RequestHandler = (req, res, next) => {

  if (req.session.user.isAdmin) {
    return next();
  }

  res.status(403);

  return res.json({
    success: false
  });
};
