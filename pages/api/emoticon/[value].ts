import { NextApiHandler } from "next";
import { getByValue } from "../../../src/data";
import svgPlaceholder from "../../../src/svg-placeholder";

const handler: NextApiHandler = (req, resp) => {
  const value = req.query["value"];

  if (!value) return resp.status(400).send("subpath [value] required");

  if (typeof value !== "string")
    return resp.status(400).send("subpath [value] should a string");

  const emo = getByValue(value);
  if (emo) {
    resp.redirect(encodeURI(emo.url));
  } else {
    const svg = svgPlaceholder(value);
    resp
      .setHeader("Content-Type", "image/svg+xml")
      .setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(value)}.svg"`
      )
      .send(svg);
  }
};

export default handler;
