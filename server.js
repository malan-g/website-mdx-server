const express = require("express");
const cors = require("cors");
const { bundleMDX } = require("mdx-bundler");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;
const client = process.env.CLIENT || 5173;

const app = express();
app.use(
  cors({
    origin: client,
    methods: ["GET"],
    credentials: true,
  })
);

app.get("/api/mdx-server/:project", async (req, res) => {
  try {
    const filename = req.params.project;
    const filepath = path.join(__dirname, "/mdx", `${filename}.mdx`);
    const mdx = fs.readFileSync(filepath, "utf-8");
    const { code } = await bundleMDX({
      source: mdx,
      globals: {
        "@react-three/fiber": {
          varName: "reactThreeFiber",
          namedExports: ["Canvas", "useFrame", "useLoader"],
          defaultExport: false,
        },
        "@react-three/drei": {
          varName: "reactThreeDrei",
          namedExports: ["OrbitControls"],
          defaultExport: false,
        },
        three: {
          varName: "three",
        },
      },
    });
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(
    `MDX server is running on port ${port} in ${process.env.NODE_ENV}`
  );
});
