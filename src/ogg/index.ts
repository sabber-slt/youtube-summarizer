import axios from "axios";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { removeFile } from "../utils";

ffmpeg.setFfmpegPath(installer.path);

const toMp3 = async (input: string, output: number) => {
  try {
    const outputPath = resolve(dirname(input), `${output}.mp3`);
    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .inputOption("-t 30")
        .output(outputPath)
        .on("end", () => {
          removeFile(input);
          resolve(outputPath);
        })
        .on("error", (err) => reject(err.message))
        .run();
    });
  } catch (e) {
    console.log("Error while creating mp3", e.message);
  }
};

const createOgg = async (url: string, filename: string) => {
  try {
    const oggPath = resolve(__dirname, "../../voices", `${filename}.ogg`);
    const response = await axios({
      method: "get",
      url,
      responseType: "stream",
    });

    return new Promise((resolve) => {
      const stream = createWriteStream(oggPath);
      response.data.pipe(stream);
      stream.on("finish", () => resolve(oggPath));
    });
  } catch (e) {
    console.log("Error while creating ogg", e.message);
  }
};

export const ogg = {
  toMp3,
  create: createOgg,
};
