import moment from "moment";

export const months = moment.months().map((m, i) => ({ label: m, value: i + 1 }))

const currentYear = moment().year();

export const years = Array.from({ length: 6 }, (_, i) => ({
    label: currentYear + i,
    value: currentYear + i,
}));

export const teams = [
    { label: "SEO", value: "seo" },
    { label: "Development", value: "development" },
    { label: "Sales", value: "sales" },
    { label: "Digital Market", value: "digital market" },
    { label: "Design", value: "design" },
    { label: "HR and ADMIN", value: "hrandadmin" },
];

export const statusList = [
    { label: "PERMANENT", value: "PERMANENT" },
    { label: "PROBATION", value: "PROBATION" },
    { label: "INTERN", value: "INTERN" },
];