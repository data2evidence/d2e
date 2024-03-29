import { User } from "./User";
import { Constants } from "./Constants";
import { IMRIDBRequest } from "./types";
import { Logger } from "./index";
import { decodeString } from "./utils";
const log = Logger.CreateLogger("mri-util-log");
export const getUser = (req: Pick<IMRIDBRequest, "headers">): User => {
  try {
    const lang = (req.headers["x-language"] as string) || "en";
    const userToken: string = decodeString(
      req.headers[Constants.SESSION_CLAIMS_PROP] as string,
    );
    return new User(JSON.parse(userToken), lang);
  } catch (err) {
    throw err;
  }
};
