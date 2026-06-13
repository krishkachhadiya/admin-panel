import {
  readData,
} from "@/lib/filehandler";

export function getSettings() {

  return readData(
    "settings.json"
  );

}