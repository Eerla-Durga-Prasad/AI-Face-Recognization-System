import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "@next/next/no-img-element": "off",
    },
  },
];
