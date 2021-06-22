export const handler = async (_req, res) => {
    res.render("admin", {
        headTitle: "Administration"
    });
};
export default handler;
