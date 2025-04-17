module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Bright blue
        secondary: "#2563EB", // Slightly darker blue
        accent: "#FACC15", // Vibrant yellow
        highlight: "#10B981", // Green
        background: "#F9FAFB", // Light gray
        cardBackground: "#FFFFFF", // White
        textLight: "#FFFFFF", // White
        textMuted: "#6B7280", // Gray
        textPrimary: "#111827", // Dark gray for primary text
        textSecondary: "#374151", // Medium gray for secondary text
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};