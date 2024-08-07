import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { createRequire } from "module";
 
const require = createRequire(import.meta.url);
 
const bundled = await bundle({
  entryPoint: require.resolve("./src/index.ts"),
  // If you have a Webpack override, make sure to add it here
  webpackOverride: (config) => config,
});
 
const compositions = await getCompositions(bundled);
 
for (const composition of compositions) {
  console.log(`Rendering ${composition.id}...`);
  // await renderStill({
  //   composition,
  //   serveUrl: bundled,
  //   output: 'out/thumbnail.png',
  //   frame: 100,
  // });
  await renderMedia({
    codec: "h264",
    composition,
    serveUrl: bundled,
    outputLocation: `out/${composition.id}.mp4`,
  });
}