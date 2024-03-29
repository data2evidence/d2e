<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />

    <xsl:template match="/">
        <Bundle>
        	<type value="batch"/>
        	<xsl:apply-templates select="hix_clinical_document"/>
        </Bundle>
    </xsl:template>
    
     <xsl:template match="hix_clinical_document">
     	<xsl:apply-templates select="patient"/>
    </xsl:template>
    
    <xsl:template match="patient">
    	<entry>
    		<Patient>
    			<id value="{@pid}"></id>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="184099003"]]'/>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="391746016"]]'/>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="729536019"]]'/>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="286004017"]]'/>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="265558016"]]'/>
    			<name>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="2164240014"]]'/>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="184096005"]]'/>
    			</name>
    			<address>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="284402010"]]'/>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="2770657016"]]'/>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="398070004"]]'/>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="2766668013"]]'/>
    				<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="184102003"]]'/>
    			</address>
    			<xsl:apply-templates select='patient_details/patient_detail[key[@code_value="429697006"]]'/>
    		</Patient>
    	</entry>
     	<xsl:apply-templates select="interaction"/>
    </xsl:template>
    
    <xsl:template match="patient_details/patient_detail">
    </xsl:template>
   <!-- Patient birthdate -->
    <xsl:template match='patient_details/patient_detail[key[@code_value="184099003"]]'>
    	<birthDate value="{value}"/>
    </xsl:template>
   
   <!-- US Core Profile -->
    <xsl:template match='patient_details/patient_detail[key[@code_value="286004017"]]'>
     	<extension url="http://hl7.org/fhir/StructureDefinition/us-core-ethnicity">
     		<valueCodeableConcept>
     			<!-- Missing coding - uses only text-->
     			<!-- Coding -->
     			<text value="{value}"/>
     		</valueCodeableConcept>
     	</extension>
    </xsl:template>  
    
    <xsl:template match='patient_details/patient_detail[key[@code_value="265558016"]]'>
     	<extension url="http://hl7.org/fhir/StructureDefinition/us-core-race">
     		<valueCodeableConcept>
     			<!-- Missing coding - uses only text-->
     			<coding/>
     			<text value="{value}"/>
     		</valueCodeableConcept>
     	</extension>
    </xsl:template>  
    
   <!-- Patient.gender -->
    <xsl:template match='patient_details/patient_detail[key[@code_value="391746016"]]'>
     	<xsl:if test="value = 'F'"><gender value='female'/></xsl:if>
    	<xsl:if test="value = 'M'"><gender value='male'/></xsl:if>
    </xsl:template> 
   <!-- Patient.martialStatus -->
    <xsl:template match='patient_details/patient_detail[key[@code_value="729536019"]]'>
    	<maritalStatus>
     			<coding>
     				<system value="http://hl7.org/fhir/v3/MaritalStatus"/>
     				<code value="{value}"/>
     			</coding>
     	</maritalStatus>
    </xsl:template>  
   <!-- Patient.name -->  
     <xsl:template match='patient_details/patient_detail[key[@code_value="2164240014"]]'>
    	<given value="{value}"></given>
    </xsl:template>
    
     <xsl:template match='patient_details/patient_detail[key[@code_value="184096005"]]'>
    	<family value="{value}"></family>
    </xsl:template>
    <!-- Patient.address -->
     <xsl:template match='patient_details/patient_detail[key[@code_value="284402010"]]'>
    	<street value="{value}"></street>
    </xsl:template>
    <xsl:template match='patient_details/patient_detail[key[@code_value="2770657016"]]'>
    	<city value="{value}"></city>
    </xsl:template>
    <xsl:template match='patient_details/patient_detail[key[@code_value="398070004"]]'>
    	<state value ="{value}"></state>
    </xsl:template>
    <xsl:template match='patient_details/patient_detail[key[@code_value="2766668013"]]'>
    	<country value ="{value}"></country>
    </xsl:template>
    <xsl:template match='patient_details/patient_detail[key[@code_value="184102003"]]'>
    	<postalCode value ="{value}"></postalCode>
    </xsl:template>
    
    <!-- Patient telecom -->
    <xsl:template match='patient_details/patient_detail[key[@code_value="429697006"]]'>
    	<telecom>
    		<system value="phone"/>
    		<value><xsl:value-of select="value"/></value>
    	</telecom>
    </xsl:template>
    
    <!-- Interactions-->
    <xsl:template match="interaction">
    	<entry>
    	</entry>
    </xsl:template>

	<!-- Procedure -->
	<xsl:template match='interaction[@code_value="Procedure, Performed"]'>
    	<entry>
    		<Procedure>
    			<id value="{@src_pkid}"/>
    			<status value="completed"/>
    			<subject>
    				<reference value="{/hix_clinical_document/patient/@pid}"/>
    			</subject>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="439272007"]]'/>
    			<xsl:apply-templates select='interaction_detail[key="Procedure Type"]'/>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="260878002"]]'/>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="277206009"]]'/>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="277208005"]]'/>
    		</Procedure>
    	</entry>
    </xsl:template>
    <!-- Procedure.performedDateTime -->
    <xsl:template match='interaction_detail[key[@code_value="439272007"]]'>
    	<performedDateTime value ="{value}"></performedDateTime>
    </xsl:template>
     <xsl:template match='interaction_detail[key="Procedure Type"]'>
    	<category>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</category>
    </xsl:template>
    
      <xsl:template match='interaction_detail[key[@code_value="260878002"]]'>
    	<reasonCode>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</reasonCode>
    </xsl:template>
    
    <xsl:template match='interaction_detail[key[@code_value="277206009"]]'>
    	<reasonCode>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</reasonCode>
    </xsl:template>
    
    <xsl:template match='interaction_detail[key[@code_value="277208005"]]'>
    	<reasonCode>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</reasonCode>
    </xsl:template>
    
    <xsl:template match='interaction[@code_value="Medication, Administered"]'>
    	<entry>
    		<MedicationAdministration>
    			<id value="{@src_pkid}"/>
    			<status value="completed"/>
    			<subject>
    				<reference value="{/hix_clinical_document/patient/@pid}"/>
    			</subject>
    			<xsl:apply-templates select='interaction_detail[key="Medication Start Date"]'/>
    			<xsl:apply-templates select='interaction_detail[key="Drug Administered"]'/>
    		</MedicationAdministration>
    	</entry>
    </xsl:template>
    
    <xsl:template match='interaction_detail[key="Drug Administered"]'>
    	<medicationCodeableConcept>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<xsl:if test="value/@code_system = 'RXNORM'"><system value="http://www.nlm.nih.gov/research/umls/rxnorm"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</medicationCodeableConcept>
    </xsl:template>
    
    
    <xsl:template match='interaction_detail[key="Medication Start Date"]'>
    <!-- If there is also a Medication End date - a period would be a better choice-->
    	<effectiveDateTime value="{value}"/>
    </xsl:template>
    
     <xsl:template match='interaction[@code_value="Diagnosis, Active"]'>
    	<entry>
    		<Condition>
    			<id value="{@src_pkid}"/>
    			<subject>
    				<reference value="{/hix_clinical_document/patient/@pid}"/>
    			</subject>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="33999-4"]]'/>
    			<xsl:apply-templates select='interaction_detail[key[@code_value="8319008"]]'/>
    			<xsl:apply-templates select='interaction_detail[key="Diagnosis Date"]'/>
    		</Condition>
    	</entry>
    </xsl:template>
    
     <xsl:template match='interaction_detail[key[@code_value="33999-4"]]'>
    	<clinicalStatus value="{translate(value,$uppercase,$smallcase)}"/>
    </xsl:template>
    
     <xsl:template match='interaction_detail[key[@code_value="8319008"]]'>
    	<code>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     	</code>
    </xsl:template>
    
    <xsl:template match='interaction_detail[key="Diagnosis Date"]'>
    	<onsetDateTime value="{value}"/>
    </xsl:template>
    
    <!-- Encounter handling -->
     <xsl:template match='interaction[@code_value="Encounter, Performed"]'>
    	<entry>
    		<Encounter>
    			<id value="{@src_pkid}"/>
    			<status value="finished"/>
    			<subject>
    				<reference value="{/hix_clinical_document/patient/@pid}"/>
    			</subject>
    			<xsl:apply-templates select='interaction_detail[key="Encounter Date"]'/>
    			<xsl:apply-templates select='interaction_detail[key="Encounter Type"]'/>
    		</Encounter>
    	</entry>
    </xsl:template>
    
    <xsl:template match='interaction_detail[key="Encounter Date"]'>
    	<period>
    		<start value="{value}"/>
    		<end value="{value}"/>
    	</period>
    </xsl:template>
    <xsl:template match='interaction_detail[key="Encounter Type"]'>
    	<type>
     		<coding>
     			<xsl:if test="value/@code_system = 'CPT'"><system value="http://www.ama-assn.org/go/cpt"/></xsl:if>
     			<xsl:if test="value/@code_system = 'SNOMEDCT_US'"><system value="http://snomed.info/sct"/></xsl:if>	
     			<version value="{value/@code_system_version}"/>
     			<code value="{value/@code_value}"/>
     		</coding>
     		<text value="{value}"/>
     	</type>
    </xsl:template>
    
</xsl:stylesheet>