import { getRecords } from "../../helpers/recordsDB/getRecords.js";
export const handler = async (request, response) => {
    const results = await getRecords({
        recordTypeKey: request.body.recordTypeKey,
        searchString: request.body.searchString,
        recordNumber: request.body.recordNumber,
        recordTag: request.body.recordTag,
        recordDateStringGTE: request.body["recordDateString-gte"],
        recordDateStringLTE: request.body["recordDateString-lte"]
    }, {
        limit: Number.parseInt(request.body.limit, 10),
        offset: Number.parseInt(request.body.offset, 10)
    }, request.session);
    return results
        ? response.json({
            success: true,
            count: results.count,
            records: results.records
        })
        : response.json({
            success: false,
            message: "An unknown error occurred.  Please try again."
        });
};
export default handler;
