export const handler = async (_req, res) => {
    res.render("reports", {
        headTitle: "Reports"
    });
};
export default handler;
