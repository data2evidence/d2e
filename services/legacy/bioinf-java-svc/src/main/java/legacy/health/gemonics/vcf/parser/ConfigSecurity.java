/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package legacy.health.genomics.vcf.parser;

import legacy.health.genomics.vcf.environment.EnvironmentDetails;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
// TODO: fix this after adding the dependancy
// import com.sap.xs.audit.api.exception.AuditLogException;
// import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
// import com.sap.xs.audit.client.impl.v2.AuditLogMessageFactoryImpl;
import com.sap.xs.env.Service;
import com.sap.xs.env.VcapServices;
// import com.sap.xs2.security.commons.SAPOfflineTokenServices;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

/**
 *
 * @author i311215
 */
@Configuration
@EnableWebSecurity
@EnableResourceServer
public class ConfigSecurity extends ResourceServerConfigurerAdapter {
	private static final Logger LOGGER = LoggerFactory.getLogger(EnvironmentDetails.class);
    
    @Autowired
    private VcapServices env;
    
    @Value("${vcf.service.scope}")
    String scopeName;
    
    @Value("${vcf.service.scope.enabled}")
    boolean enablelocalRunScope;    //disable this for local run/debug scenarios
    
    // @Bean
    // public SAPOfflineTokenServices offlineTokenServices(){
    //     SAPOfflineTokenServices tokenServices = new SAPOfflineTokenServices();
    //     Service xsuaa = env.findService("xsuaa", "", "");
    //     tokenServices.setTrustedClientId(xsuaa.getCredentials().get("clientid").toString());
    //     tokenServices.setVerificationKey(xsuaa.getCredentials().get("verificationkey").toString());
    //     tokenServices.setTrustedIdentityZone(xsuaa.getCredentials().get("identityzone").toString());
    //     return tokenServices;
    // }
    
    @Bean
    public VcapServices getEnvServices() throws EnvironmentException{
        LOGGER.info("Loading xs environment...");
        VcapServices services = VcapServices.fromEnvironment();
        EnvironmentDetails envDetails = new EnvironmentDetails();
        Service service = services.findService("hana", "", "");
        if (service == null) {
            LOGGER.info("Loading xs local environment...");
            String json = envDetails.localEnv();
            return VcapServices.from(json);
        }
        return services;
    }
    
    // @Bean(name = "auditLogMessageFactory")
    // public AuditLogMessageFactory auditLogMessageFactory() {
    //     try {
    //         return new AuditLogMessageFactoryImpl();
    //     } catch (Exception ex) {
    //         throw new AssertionError("Error occured initializing audit log",ex);
    //     }
    // }
    
    @Override
    public void configure(HttpSecurity http) throws Exception {
        if(enablelocalRunScope){
            Service xsuaa = env.findService("xsuaa", "", "");
            String scope = xsuaa.getCredentials().get("xsappname").toString() + "." + scopeName;
            String scopeadmin =  "#oauth2.hasScopeMatching('" + scope + "')";
            http.headers().cacheControl();
            http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                    .csrf().disable()
                    .anonymous().disable()
                    .authorizeRequests()
                    .antMatchers("/**").access(scopeadmin);
        }else{
            http.headers().cacheControl();
            http.authorizeRequests().antMatchers("/**").permitAll();
            http.csrf().disable();
        } 
    }
}
