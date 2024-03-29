import { Request, NextFunction, Response } from "express";
import * as config from "../utils/config";
import jwt from "jsonwebtoken";
import { ITokenUser } from "../utils/types";
import { TEST_USER } from "../utils/const";
import { getUserIdByIdpUserId } from "../utils/UserMgmtUtils";

const properties = config.getProperties();
const subProp = properties.sub_prop;
const skipAuth = properties.skip_auth;
const logger = config.getLogger();

export default async (req: Request, res: Response, next: NextFunction) => {
  logger.debug("Add user obj to req");

  try {
    if (skipAuth) {
      req.user = TEST_USER;
      return next();
    }

    const bearerToken = req.headers.authorization as string;
    if (!bearerToken) {
      logger.error(`"Token is not found in req.headers.authorization`);
      return next();
    }

    const token = jwt.decode(
      bearerToken.replace(/bearer /i, "")
    ) as jwt.JwtPayload;
    if (!(subProp in token)) {
      logger.error(`"${subProp}" is not found in token`);
      return res.status(400).send();
    }

    const { oid, email } = token;
    const sub = token[subProp];
    const idpUserId = oid! || sub!;
    const userId = await getUserIdByIdpUserId(bearerToken, idpUserId);

    const user: ITokenUser = {
      userId: userId,
      idpUserId,
      email,
    };

    req.user = user;

    return next();
  } catch (err) {
    logger.error(`Error when adding user obj to req: ${err}`);
    return res.status(500).send();
  }
};
