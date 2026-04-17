module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        1100: "1100px",
      },
      backgroundColor: {
        primary: "#F5F5F5",
        secondary1: "#1266dd",
        secondary2: "#f73859",
        "overlay-30": "rgba(0, 0, 0, 0.3)",
        "overlay-70": "rgba(0, 0, 0, 0.7)",
      },
      maxWidth: {
        600: "600px",
        1200: "1200",
      },
      minWidth: {
        300: "300",
        200: "200",
      },
      cursor: {
        pointer: "pointer",
      },
      flex: {
        3: "3 3 0%",
      },
    },
  },
  plugins: [],
};
