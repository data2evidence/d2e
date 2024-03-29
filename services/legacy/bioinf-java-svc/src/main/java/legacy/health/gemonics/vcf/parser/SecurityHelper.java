package legacy.health.genomics.vcf.parser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import legacy.health.genomics.vcf.parser.exceptions.UnAuthorizedAccessException;
// TODO: fix this after adding the dependancy
// import com.sap.xs.audit.api.exception.AuditLogException;
// import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
// import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;
// import com.sap.xs.audit.client.impl.v2.AuditLogMessageFactoryImpl;
import com.sap.xs2.security.container.SecurityContext;
import com.sap.xsa.security.container.XSUserInfo;
import com.sap.xsa.security.container.XSUserInfoException;

@Service
public class SecurityHelper {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityHelper.class);
	// protected AuditLogMessageFactory auditLogMessageFactory;
	// SecurityEventAuditMessage message;
	public String validateUser() throws UnAuthorizedAccessException {
		String appUser = null;
		try {
			XSUserInfo userInfo = SecurityContext.getUserInfo();
			appUser = userInfo.getLogonName();
			// auditLogMessageFactory = new AuditLogMessageFactoryImpl();
			// message = auditLogMessageFactory.createSecurityEventAuditMessage();
			// message.setUser(appUser);
			// message.setTenant(SecurityContext.getUserInfo().getIdentityZone());
	        // message.setUser(SecurityContext.getUserInfo().getLogonName());
			if (!userInfo.checkLocalScope("sap.chp.diplugin.VCF.svc")) {
				// message.setData("User :"+appUser + "does not have the required permissions");
				// message.log();
				throw new UnAuthorizedAccessException("User :"+appUser + "does not have the required permissions");
			}
			
			else {
				LOGGER.info("Authenticated and authorized User :"+appUser);
				// message.setData("Successful logon");
				// message.log();
			}
			
		} catch (XSUserInfoException e) {
			LOGGER.error("Unauthorized Access ");
			throw new UnAuthorizedAccessException("",e);
		} catch (Exception e) {
			LOGGER.error("An error occured during audit logging ");
		}
		
		return appUser;
	}
	
	void logUnAuthoizedAccess () {
		
	}

}

