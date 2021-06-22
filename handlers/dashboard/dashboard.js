export const handler = async (_req, res) => {
    res.render("dashboard", {
        headTitle: "Dashboard"
    });
};
export default handler;
