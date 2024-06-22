import { StyleSheet, View, Image, Text } from "react-native";
import { useTheme } from "../../constants/temas/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomThemeButton from "@/components/MyComponents/CustomButton.tsx/CustomThemeButton";
import CustomButton from "../../components/MyComponents/CustomButton.tsx/CustomButton";
import { useUser } from "../../contexts/UserContext";

export default function TabTwoScreen() {
  const { theme, themeName } = useTheme();
  const { livrosLidos, biblioteca, updateLivroReview, clearAll } = useUser();

  //   <SafeAreaView
  //   edges={["top"]}
  //   style={[
  //     styles.view,
  //     { backgroundColor: theme.background, paddingVertical: 10 },
  //   ]}
  // >
  //   <View style={[styles.container, { backgroundColor: theme.background }]}>
  //     <View style={styles.header}>
  //       <Image
  //         source={require("../../assets/images/logo3.png")}
  //         style={styles.logo}
  //       />
  //     </View>

  //  </View>
  // </SafeAreaView>

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.view,
        { backgroundColor: theme.background, paddingVertical: 10 },
      ]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo3.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

          <View style={styles.buttonsContainer}>
            <CustomThemeButton />
            <CustomButton
              onPress={clearAll}
              placeholder={"Resetar Conta"}
              styleType={1}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    alignItems: "center",
    zIndex: 9999,
  },
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    position: "absolute",
    top: 30,
  },
  logo: {
    marginVertical: 5,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    margin: "auto",
  },
  buttonsContainer:{
    width: '70%'
  }
});
