export const handler = async (_request, response) => {
    response.render("reports", {
        headTitle: "Reports"
    });
};
export default handler;
