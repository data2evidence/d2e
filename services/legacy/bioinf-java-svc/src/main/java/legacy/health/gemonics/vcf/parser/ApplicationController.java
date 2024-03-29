package legacy.health.genomics.vcf.parser;

import legacy.health.genomics.vcf.parser.InputParameter;
import legacy.health.genomics.vcf.parser.datamodel.VCFStructureDefinition;
import legacy.health.genomics.vcf.parser.exceptions.BodyParseException;
import legacy.health.genomics.vcf.parser.exceptions.DIJobStatusException;
import legacy.health.genomics.vcf.parser.exceptions.EnvironmentException;
import legacy.health.genomics.vcf.parser.exceptions.UnAuthorizedAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;


/**
 * Created by D058991 on 27.02.2018.
 */

@RestController
public class ApplicationController {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationController.class);
	@PostMapping(consumes = "application/json", produces = "application/json")
	public void importVCFFiles(@RequestBody InputParameter input) throws BodyParseException, EnvironmentException, UnAuthorizedAccessException {
	LOGGER.info("Class:" + this.getClass().getName() + " Method: importVCFFile");
		SecurityHelper securityHelper =  new SecurityHelper();
		securityHelper.validateUser();
		ImportHandler importHandler = new ImportHandler(input);
		importHandler.handleVCFImport();
	}
	
	@RequestMapping(value = "/v1/parseHeaders", method = RequestMethod.POST)
	public Map<String, VCFStructureDefinition> parseHeaders(@RequestBody InputParameter input) throws BodyParseException, EnvironmentException, UnAuthorizedAccessException, DIJobStatusException {
	LOGGER.info("Class:" + this.getClass().getName() + " Method: importVCFFile");
		SecurityHelper securityHelper =  new SecurityHelper();
		securityHelper.validateUser();
		ImportHandler importHandler = new ImportHandler(input);
		Map<String, VCFStructureDefinition> vcfHeaders = importHandler.extractHeaders();
		return vcfHeaders;
	}
 	public static String sanitizeSQLExpression(String str) {
    		 return ((!str.isEmpty() && str!=null) ? str : null);
        }
}
