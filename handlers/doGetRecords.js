import getRecords from "../helpers/recordsDB/getRecords.js";
export const handler = async (req, res) => {
    const results = await getRecords({
        recordTypeKey: req.body.recordTypeKey,
        searchString: req.body.searchString
    }, {
        limit: parseInt(req.body.limit, 10),
        offset: parseInt(req.body.offset, 10)
    });
    if (results) {
        return res.json({
            success: true,
            count: results.count,
            records: results.records
        });
    }
    else {
        return res.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
    }
};
export default handler;