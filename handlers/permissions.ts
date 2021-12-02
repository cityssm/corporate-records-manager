import type { RequestHandler } from "express";


export const canViewAll: RequestHandler = (request, response, next) => {

  if (request.session.user.canViewAll) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};


export const canUpdate: RequestHandler = (request, response, next) => {

  if (request.session.user.canUpdate) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};


export const isAdmin: RequestHandler = (request, response, next) => {

  if (request.session.user.isAdmin) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};
