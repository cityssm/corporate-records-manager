export const handler = async (_request, response) => {
    response.render("admin", {
        headTitle: "Administration"
    });
};
export default handler;
