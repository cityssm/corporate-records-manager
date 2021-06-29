export const handler = async (_request, response) => {
    response.render("dashboard", {
        headTitle: "Dashboard"
    });
};
export default handler;
