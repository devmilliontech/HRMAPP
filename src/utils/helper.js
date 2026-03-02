import moment from "moment";

/**
 * Converts 12-hour time (e.g. "12:51 PM") + date into ISO string
 * WITHOUT converting local time to UTC offset.
 *
 * @param {string} date 
 * @param {string} time 
 * @returns {string} 
 */

export const timeToISOString = (date, time) => {
    return moment.utc(
        `${date} ${time}`,
        "YYYY-MM-DD hh:mm A"
    ).toISOString();
};


export const getRowBgColor = (item) => {
    if (!item.present) {
        return "#FEE2E2";
    }

    if (item.lateArrival || item.earlyExit) {
        return "#FEF3C7";
    }

    return "#DCFCE7";
};

export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
}


export const getSessionDurationLocal = (loginISO, currentISO) => {
    const loginLocal = moment(loginISO).local();
    const currentLocal = moment(currentISO).local();

    let loginTime = moment().set({
        hour: loginLocal.hour(),
        minute: loginLocal.minute(),
        second: loginLocal.second(),
    });

    if (currentLocal.isBefore(loginTime)) {
        loginTime.subtract(1, "day");
    }

    const d = moment.duration(currentLocal.diff(loginTime));

    return {
        formatted: `${String(Math.floor(d.asHours())).padStart(2, "0")}:${String(
            d.minutes()
        ).padStart(2, "0")}:${String(d.seconds()).padStart(2, "0")}`,
        ampm: currentLocal.format("A"),
    };
};

export const jsonToCSV = (jsonData) => {
    if (!jsonData || jsonData.length === 0) return "";

    jsonData = jsonData.map((data) => {
        return {
            ...data,
            checkInTime: data?.checkInTime
                ? moment(data.checkInTime).utc().format("hh:mm A")
                : null,

            checkOutTime: data?.checkOutTime
                ? moment(data.checkOutTime).utc().format("hh:mm A")
                : null,

        }
    })

    const headers = Object.keys(jsonData[0]).join(",");

    const rows = jsonData.map(obj =>
        Object.values(obj)
            .map(value => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
    );

    return `${headers}\n${rows.join("\n")}`;
};


export const getPreviousMonthYear = (date = new Date()) => {
    const month = date.getMonth() + 1; // 1–12
    const year = date.getFullYear();

    if (month === 1) {
        return {
            month: 12,
            year: year - 1,
        };
    }

    return {
        month: month - 1,
        year,
    };
};

