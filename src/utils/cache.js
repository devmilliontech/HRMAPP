import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const EXPIRY_MINUTES = 1;

const isExpired = (item) => {
    const now = moment();
    const storedTime = moment(item.timestamp);
    return now.diff(storedTime, "minutes") > EXPIRY_MINUTES;
};

const store = async (key, value) => {
    try {
        const item = {
            value,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error("Error storing item:", error);
    }
};

const get = async (key) => {
    try {
        const item = JSON.parse(await AsyncStorage.getItem(key))
        if (!item) return null;
        if (isExpired(item)) {
            await AsyncStorage.removeItem(key);
            return null;
        }

        return item.value
    } catch (error) {
        console.error("Error getting item:", error);
        return null;
    }
};

const remove = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

export default {
    store,
    get,
    remove,
};
