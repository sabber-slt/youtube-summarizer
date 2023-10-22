import { unlink } from "fs";

export async function removeFile(path: string) {
  try {
    unlink(path, () => {});
  } catch (e) {
    console.log("Error while removing file", e.message);
  }
}
