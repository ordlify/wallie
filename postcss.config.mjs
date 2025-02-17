import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";

export default {
  plugins: [
    autoprefixer(),
    tailwindcss(),
    cssnano({
      preset: "default",
    }),
  ],
};
