import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const BackButton = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16, marginRight: 8 }}>
        <FontAwesome6
            name="arrow-left"
            size={20}
        />
    </TouchableOpacity>
);

export default BackButton