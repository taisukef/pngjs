import * as t from "https://deno.land/std/testing/asserts.ts";
import { decodePNG } from "../decodePNG.js";

Deno.test("decodePNG", async () => {
  const __dirname = ".";
  const file = __dirname + "/../html/ubuntu-screenshot.png";
  const bytes = await Deno.readFile(file);
  const imgd = decodePNG(bytes);
  t.assertEquals(imgd.width, 1575);
  t.assertEquals(imgd.data.length, 6237000);
  t.assertEquals(imgd.data[0], 76);
});
