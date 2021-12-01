import data from "../public/data.json";
import { promisify } from "node:util";
import stream from "node:stream";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";
import Keyv from "keyv";
import _got from "got";

const pipeline = promisify(stream.pipeline);

const ROOT_DIR = path.join(__dirname, "../public/emoticon");
const CACHE_DIR = path.join(__dirname, ".cache");

async function cacheGot() {
  await fsp.mkdir(CACHE_DIR, { recursive: true });
  const keyv = new Keyv(
    "sqlite://" +
      path.posix.relative(".", path.posix.join(CACHE_DIR, "got.sqlite"))
  );

  return _got.extend({ cache: keyv });
}

interface Emoticon {
  value: string;
  url: string;
}

class EmoticonSyncError extends Error {
  constructor(public emoticon: Emoticon, public reason: unknown) {
    super(
      `Failed to sync ${emoticon.value} from ${emoticon.url} :\n${
        reason && (reason as Error).message
      }\n${reason && (reason as Error).stack}`
    );
  }
}

async function main() {
  const got = await cacheGot();
  const categories = data.emoticon_format;

  const emoticons = categories.flatMap((cate) => cate.value);

  await fsp.rm(ROOT_DIR, { recursive: true, force: true });
  await fsp.mkdir(ROOT_DIR, { recursive: true });

  const results = await Promise.allSettled(
    emoticons.map(async (emo) => {
      try {
        const ext = emo.url.slice(emo.url.lastIndexOf(".") + 1);
        const name = emo.value;

        const file = path.join(ROOT_DIR, `${name}.${ext}`);

        await pipeline(got.stream(emo.url), fs.createWriteStream(file));

        // TODO: convert gif to apng
        // if (ext === "gif") {
        // }
      } catch (err) {
        throw new EmoticonSyncError(emo, err);
      }
    })
  );

  const failed = results.filter(
    (res): res is PromiseRejectedResult => res.status === "rejected"
  );

  if (failed.length > 0) {
    throw new Error(
      `${failed.length} emoticons failed to sync:\n${failed
        .map((err) => err.reason.message)
        .join("\n")}`
    );
  }
}

main().catch((err) => {
  process.exitCode = 1;
  console.error(err);
});
