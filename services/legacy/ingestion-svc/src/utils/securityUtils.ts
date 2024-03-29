import { BearerStrategy, ITokenPayload, IBearerStrategyOptionWithRequest } from "passport-azure-ad";
import { NextFunction } from "express";
import * as utils from "./baseUtils";
import winston from "winston";
import { Role } from "./httpUtils";
const Passport = require('passport').Passport

export class Security {

	private passportAzureClientCredentials: any;
	private SKIP_AUTH = utils.getBoolean(process.env.SKIP_AUTH);
	private logger: winston.Logger;
	private baseOptionsAzureIDP : {
		clientID: string;
		validateIssuer: boolean;
		audience: string | string[];
		loggingLevel?: "info" | "warn" | "error";
		passReqToCallback: boolean;
	} = {
		clientID: process.env.OAUTH_CLIENT_ID!,
		validateIssuer: true,
		audience: process.env.OAUTH_CLIENT_ID!,
		loggingLevel: "error",
		passReqToCallback: false
	}

	constructor(logger: winston.Logger) {
		this.logger = logger;
		
		// For Client credentials (Micro service, technical users)
		this.passportAzureClientCredentials = this.initializeAzureIDP({
			identityMetadata: process.env.OAUTH_AD_META!,
			isB2C: false,
		});
	}

	initializeAzureIDP = (IDPSpecific: any) => {
		const optionsAzureIDP: IBearerStrategyOptionWithRequest = {
			...IDPSpecific,
			...this.baseOptionsAzureIDP
		}
		const logger = this.logger;

		const bearerStrategyAzureIDP = new BearerStrategy(optionsAzureIDP, function (token: ITokenPayload, done: CallableFunction) {
			logger.debug(`Successfully Authenticated ${token.sub}`)
			done(null, {}, token);
		});
		const passportInstance = new Passport();
		passportInstance.use(bearerStrategyAzureIDP);
		passportInstance.initialize();
		return passportInstance
	}

	ensureAuthenticated = (req: any, res: any, next: NextFunction) => {
		if (this.SKIP_AUTH) {
			this.logger.debug(`Skipping Authentication..`)
			return next();
		}
		const passport = this.passportAzureClientCredentials;

		(passport.authenticate(
			'oauth-bearer',
			{ session: false }
		))(req, res, next);
	}

	hasClientCredentialsRoles = (requiredRoles: Array<Role>, jwtRolesClaim: Array<string> = []) => {
		return requiredRoles.some(elem => {
			return (jwtRolesClaim.indexOf(elem.NAME) >= 0)
		})
	}

	ensureAuthorized = async (req: any, res: any, next: NextFunction) => {

		if (this.SKIP_AUTH) {
			this.logger.debug(`Skipping Authorization..`)
			return next();
		} else {
			if (this.hasClientCredentialsRoles((<any>req)._requiredRoles, req.authInfo.roles)) {
				this.logger.debug(`Successfully Authorized ${req.authInfo.sub}`)
				return next();
			}
		}

		this.logger.error(`Unauthorized access: ${req.authInfo.sub}`);
		return res.sendStatus(403);
	}
}