export type ReportBodySchema = {
    endDate: string;
    startDate: string;
    name?: string;
    configuration: {
        adProduct: "SPONSORED_PRODUCTS" | "SPONSORED_BRANDS";
        columns: string[];
        reportTypeId: string;
        format: "GZIP_JSON";
        groupBy: string[];
        timeUnit: "SUMMARY" | "DAILY";
        filters?: any[];
    };
};
