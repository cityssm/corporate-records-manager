export const canUpdate = (request, response, next) => {
    if (request.session.user.canUpdate) {
        return next();
    }
    response.status(403);
    return response.json({
        success: false
    });
};
export const isAdmin = (request, response, next) => {
    if (request.session.user.isAdmin) {
        return next();
    }
    response.status(403);
    return response.json({
        success: false
    });
};
