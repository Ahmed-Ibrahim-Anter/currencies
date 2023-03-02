import { extendTheme, theme as nbTheme } from "native-base";

const color = {
  50: "#ffdbe1",
  100: "#febcc7",
  200: "#fa9ead",
  300: "#f68195",
  400: "#f3647b",
  500: "#ed556e",
  600: "#e64863",
  700: "#de3d58",
  800: "#d5324d",
  900: "#c43048",
};

const secondary = {
  50: "#ebf8ff",
  100: "#c9edff",
  200: "#a8e2ff",
  300: "#87d7ff",
  400: "#66ccff",
  500: "#57c4fb",
  600: "#48bcf5",
  700: "#3bb3ef",
  800: "#2faae8",
  900: "#23a1e0",
};

const theme = extendTheme({
  fontConfig: {
    Almarai: {
      300: {
        normal: "Almarai_300Light",
        italic: "Almarai_300Light",
      },
      400: {
        normal: "Almarai_400Regular",
        italic: "Almarai_400Regular",
      },
      700: {
        normal: "Almarai_700Bold",
      },
      800: {
        normal: "Almarai_800ExtraBold",
        italic: "Almarai_800ExtraBold",
      },
    },
  },
  fonts: {
    heading: "Almarai",
    body: "Almarai",
    mono: "Almarai",
  },
  colors: {
    // primary: nbTheme.colors.blueGray,
    primary: color,
    secondary: nbTheme.colors.blueGray,
    accent: secondary,
  },
  components: {
    HStack: {
      // Can pass also function, giving you access theming tools
      baseStyle: () => {
        return {
          flexDirection: Localization.isRTL ? "row" : "row-reverse",
          fontWeight: "normal",
        };
      },
    },
  },
  useSystemColorMode: true,
  initialColorMode: "dark",
});

export default theme;
