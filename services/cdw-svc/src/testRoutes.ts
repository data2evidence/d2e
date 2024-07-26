import express from "express";
const router = express.Router();
// USED BY HTTP TESTS
router.get("/hc/hph/core/services/getSessionTimeout.xsjs", (req, res) => {
  res.json({ sessionTimeout: 80000000, warningTime: 60000 });
});

router.use("/hc/hph/patient/app/services/taresults.xsjs", (req, res) => {
  if (req.method === "GET") {
    return res.status(200).json({ authorized: false });
  }
});

router.use("/hc/hph/core/tableP13n/odata/P13n.xsodata", (req, res) => {
  if (req.path === "/$metadata") {
    return res
      .set("Content-Type", "application/xml")
      .status(200)
      .send(
        `<?xml version="1.0" encoding="utf-8" standalone="yes" ?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0"><Schema Namespace="legacy.core.tableP13n.odata.P13n" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="PersonalizationType"><Key><PropertyRef Name="Id" /><PropertyRef Name="TableId" /></Key><Property Name="Id" Type="Edm.String" Nullable="false" MaxLength="1024" /><Property Name="HANAUserName" Type="Edm.String" MaxLength="1024" /><Property Name="ColumnOrder" Type="Edm.Int32" /><Property Name="Text" Type="Edm.String" DefaultValue="" MaxLength="1024" /><Property Name="Visible" Type="Edm.String" MaxLength="1" /><Property Name="TableId" Type="Edm.String" Nullable="false" MaxLength="1024" /><Property Name="ColumnId" Type="Edm.String" DefaultValue="" MaxLength="1024" /><Property Name="Sortable" Type="Edm.String" MaxLength="1" /><Property Name="Filterable" Type="Edm.String" MaxLength="1" /><Property Name="Personalizable" Type="Edm.String" MaxLength="1" /><Property Name="Type" Type="Edm.String" MaxLength="100" /></EntityType><EntityContainer Name="P13n" m:IsDefaultEntityContainer="true"><EntitySet Name="Personalization" EntityType="legacy.core.tableP13n.odata.P13n.PersonalizationType" /></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>`
      );
  }
  if (req.path === "/$batch") {
    return res.status(200).set("Content-Type", "multipart/mixed").send("");
  }

  return res.status(200).json({ d: { EntitySets: ["Personalization"] } });
});

router.use("/hc/hph/cdw/services/DocumentType.xsodata", (req, res) => {
  if (req.path === "/$metadata") {
    return res
      .set("Content-Type", "application/xml")
      .status(200)
      .send(
        `<?xml version="1.0" encoding="utf-8" standalone="yes" ?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0"><Schema Namespace="legacy.cdw.services.DocumentType" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="DocumentTypeType"><Key><PropertyRef Name="DWDocumentType" /></Key><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="DocTypeCount" Type="Edm.Int64" Nullable="false" /><NavigationProperty Name="DocumentTypeDescription" Relationship="legacy.cdw.services.DocumentType.DocumentTypeToDocumentTypeDescriptionType" FromRole="DocumentTypePrincipal" ToRole="DocumentTypeDescriptionDependent" /><NavigationProperty Name="DocumentPipelineMapping" Relationship="legacy.cdw.services.DocumentType.DocumentTypeToPipelineType" FromRole="DocumentTypePrincipal" ToRole="DocumentPipelineMappingDependent" /></EntityType><EntityType Name="LanguagesType"><Key><PropertyRef Name="LANGUAGE_CODE" /></Key><Property Name="LANGUAGE_NAME" Type="Edm.String" MaxLength="256" /><Property Name="LANGUAGE_CODE" Type="Edm.String" Nullable="false" MaxLength="2" /></EntityType><EntityType Name="DocumentPipelineMappingType"><Key><PropertyRef Name="PipelineID" /><PropertyRef Name="DWDocumentType" /></Key><Property Name="PipelineID" Type="Edm.String" Nullable="false" MaxLength="256" /><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="TAConfiguration" Type="Edm.String" MaxLength="2048" /></EntityType><EntityType Name="DocumentTypeDescriptionType"><Key><PropertyRef Name="DWDocumentType" /><PropertyRef Name="LanguageCode" /></Key><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="LanguageCode" Type="Edm.String" Nullable="false" MaxLength="2" /><Property Name="LanguageName" Type="Edm.String" MaxLength="256" /><Property Name="ShortText" Type="Edm.String" MaxLength="128" /></EntityType><Association Name="DocumentTypeToDocumentTypeDescriptionType"><End Type="legacy.cdw.services.DocumentType.DocumentTypeType" Role="DocumentTypePrincipal" Multiplicity="1"/><End Type="legacy.cdw.services.DocumentType.DocumentTypeDescriptionType" Role="DocumentTypeDescriptionDependent" Multiplicity="*"/></Association><Association Name="DocumentTypeToPipelineType"><End Type="legacy.cdw.services.DocumentType.DocumentTypeType" Role="DocumentTypePrincipal" Multiplicity="1"/><End Type="legacy.cdw.services.DocumentType.DocumentPipelineMappingType" Role="DocumentPipelineMappingDependent" Multiplicity="*"/></Association><EntityContainer Name="DocumentType" m:IsDefaultEntityContainer="true"><EntitySet Name="DocumentType" EntityType="legacy.cdw.services.DocumentType.DocumentTypeType" /><EntitySet Name="Languages" EntityType="legacy.cdw.services.DocumentType.LanguagesType" /><EntitySet Name="DocumentPipelineMapping" EntityType="legacy.cdw.services.DocumentType.DocumentPipelineMappingType" /><EntitySet Name="DocumentTypeDescription" EntityType="legacy.cdw.services.DocumentType.DocumentTypeDescriptionType" /><AssociationSet Name="DocumentTypeToDocumentTypeDescription" Association="legacy.cdw.services.DocumentType.DocumentTypeToDocumentTypeDescriptionType"><End Role="DocumentTypePrincipal" EntitySet="DocumentType"/><End Role="DocumentTypeDescriptionDependent" EntitySet="DocumentTypeDescription"/></AssociationSet><AssociationSet Name="DocumentTypeToPipeline" Association="legacy.cdw.services.DocumentType.DocumentTypeToPipelineType"><End Role="DocumentTypePrincipal" EntitySet="DocumentType"/><End Role="DocumentPipelineMappingDependent" EntitySet="DocumentPipelineMapping"/></AssociationSet></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>`
      );
  }
  if (req.path === "/$batch") {
    return res.status(200).set("Content-Type", "multipart/mixed")
      .send(`--943C86EE87D6E76496A680D90AC367E00
            Content-Type: application/http
            Content-Length: 467
            content-transfer-encoding: binary
            
            HTTP/1.1 200 OK
            Content-Type: application/json
            content-language: en-US
            Content-Length: 370
            
            {"d":{"results":[{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='SHANKARNLP',LanguageCode='en')"},"DWDocumentType":"SHANKARNLP","LanguageCode":"en","LanguageName":"English","ShortText":"NLPTA"}]}}
            --943C86EE87D6E76496A680D90AC367E00
            Content-Type: application/http
            Content-Length: 464
            content-transfer-encoding: binary
            
            HTTP/1.1 200 OK
            Content-Type: application/json
            content-language: en-US
            Content-Length: 367
            
            {"d":{"results":[{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='TADemo',LanguageCode='en')"},"DWDocumentType":"TADemo","LanguageCode":"en","LanguageName":"English","ShortText":"MED & PATH"}]}}
            --943C86EE87D6E76496A680D90AC367E00
            Content-Type: application/http
            Content-Length: 1287
            content-transfer-encoding: binary
            
            HTTP/1.1 200 OK
            Content-Type: application/json
            content-language: en-US
            Content-Length: 1189
            
            {"d":{"results":[{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.ClinicalTrial',LanguageCode='de')"},"DWDocumentType":"legacy.tax.ClinicalTrial","LanguageCode":"de","LanguageName":"German","ShortText":"Klinische Studie"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.ClinicalTrial',LanguageCode='en')"},"DWDocumentType":"legacy.tax.ClinicalTrial","LanguageCode":"en","LanguageName":"English","ShortText":"Clinical Trial"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.ClinicalTrial',LanguageCode='fr')"},"DWDocumentType":"legacy.tax.ClinicalTrial","LanguageCode":"fr","LanguageName":"French","ShortText":"Essai clinique"}]}}
            --943C86EE87D6E76496A680D90AC367E00
            Content-Type: application/http
            Content-Length: 1277
            content-transfer-encoding: binary
            
            HTTP/1.1 200 OK
            Content-Type: application/json
            content-language: en-US
            Content-Length: 1179
            
            {"d":{"results":[{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.DoctorLetter',LanguageCode='de')"},"DWDocumentType":"legacy.tax.DoctorLetter","LanguageCode":"de","LanguageName":"German","ShortText":"Arztbrief"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.DoctorLetter',LanguageCode='en')"},"DWDocumentType":"legacy.tax.DoctorLetter","LanguageCode":"en","LanguageName":"English","ShortText":"Doctor's Letter"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.DoctorLetter',LanguageCode='fr')"},"DWDocumentType":"legacy.tax.DoctorLetter","LanguageCode":"fr","LanguageName":"French","ShortText":"Lettre mÃ©dicale"}]}}
            --943C86EE87D6E76496A680D90AC367E00
            Content-Type: application/http
            Content-Length: 1226
            content-transfer-encoding: binary
            
            HTTP/1.1 200 OK
            Content-Type: application/json
            content-language: en-US
            Content-Length: 1128
            
            {"d":{"results":[{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.SOP',LanguageCode='de')"},"DWDocumentType":"legacy.tax.SOP","LanguageCode":"de","LanguageName":"German","ShortText":"SOP"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.SOP',LanguageCode='en')"},"DWDocumentType":"legacy.tax.SOP","LanguageCode":"en","LanguageName":"English","ShortText":"SOP"},{"__metadata": {"type":"legacy.cdw.services.DocumentType.DocumentTypeDescriptionType","uri":"http://mri-demo-latest.mo.sap.corp:8000/hc/hph/cdw/services/DocumentType.xsodata/DocumentTypeDescription(DWDocumentType='legacy.tax.SOP',LanguageCode='fr')"},"DWDocumentType":"legacy.tax.SOP","LanguageCode":"fr","LanguageName":"French","ShortText":"ProcÃ©dure opÃ©rationnelle permanente"}]}}
            --943C86EE87D6E76496A680D90AC367E00--
            `);
  }

  return res.status(200).json({
    d: {
      EntitySets: [
        "DocumentType",
        "Languages",
        "DocumentPipelineMapping",
        "DocumentTypeDescription",
      ],
    },
  });
  // .set("Content-Type", "application/xml")
  // .send(
  //     `<?xml version="1.0" encoding="utf-8" standalone="yes" ?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0"><Schema Namespace="legacy.cdw.services.DocumentType" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="DocumentTypeType"><Key><PropertyRef Name="DWDocumentType" /></Key><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="DocTypeCount" Type="Edm.Int64" Nullable="false" /><NavigationProperty Name="DocumentTypeDescription" Relationship="legacy.cdw.services.DocumentType.DocumentTypeToDocumentTypeDescriptionType" FromRole="DocumentTypePrincipal" ToRole="DocumentTypeDescriptionDependent" /><NavigationProperty Name="DocumentPipelineMapping" Relationship="legacy.cdw.services.DocumentType.DocumentTypeToPipelineType" FromRole="DocumentTypePrincipal" ToRole="DocumentPipelineMappingDependent" /></EntityType><EntityType Name="LanguagesType"><Key><PropertyRef Name="LANGUAGE_CODE" /></Key><Property Name="LANGUAGE_NAME" Type="Edm.String" MaxLength="256" /><Property Name="LANGUAGE_CODE" Type="Edm.String" Nullable="false" MaxLength="2" /></EntityType><EntityType Name="DocumentPipelineMappingType"><Key><PropertyRef Name="PipelineID" /><PropertyRef Name="DWDocumentType" /></Key><Property Name="PipelineID" Type="Edm.String" Nullable="false" MaxLength="256" /><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="TAConfiguration" Type="Edm.String" MaxLength="2048" /></EntityType><EntityType Name="DocumentTypeDescriptionType"><Key><PropertyRef Name="DWDocumentType" /><PropertyRef Name="LanguageCode" /></Key><Property Name="DWDocumentType" Type="Edm.String" Nullable="false" MaxLength="128" /><Property Name="LanguageCode" Type="Edm.String" Nullable="false" MaxLength="2" /><Property Name="LanguageName" Type="Edm.String" MaxLength="256" /><Property Name="ShortText" Type="Edm.String" MaxLength="128" /></EntityType><Association Name="DocumentTypeToDocumentTypeDescriptionType"><End Type="legacy.cdw.services.DocumentType.DocumentTypeType" Role="DocumentTypePrincipal" Multiplicity="1"/><End Type="legacy.cdw.services.DocumentType.DocumentTypeDescriptionType" Role="DocumentTypeDescriptionDependent" Multiplicity="*"/></Association><Association Name="DocumentTypeToPipelineType"><End Type="legacy.cdw.services.DocumentType.DocumentTypeType" Role="DocumentTypePrincipal" Multiplicity="1"/><End Type="legacy.cdw.services.DocumentType.DocumentPipelineMappingType" Role="DocumentPipelineMappingDependent" Multiplicity="*"/></Association><EntityContainer Name="DocumentType" m:IsDefaultEntityContainer="true"><EntitySet Name="DocumentType" EntityType="legacy.cdw.services.DocumentType.DocumentTypeType" /><EntitySet Name="Languages" EntityType="legacy.cdw.services.DocumentType.LanguagesType" /><EntitySet Name="DocumentPipelineMapping" EntityType="legacy.cdw.services.DocumentType.DocumentPipelineMappingType" /><EntitySet Name="DocumentTypeDescription" EntityType="legacy.cdw.services.DocumentType.DocumentTypeDescriptionType" /><AssociationSet Name="DocumentTypeToDocumentTypeDescription" Association="legacy.cdw.services.DocumentType.DocumentTypeToDocumentTypeDescriptionType"><End Role="DocumentTypePrincipal" EntitySet="DocumentType"/><End Role="DocumentTypeDescriptionDependent" EntitySet="DocumentTypeDescription"/></AssociationSet><AssociationSet Name="DocumentTypeToPipeline" Association="legacy.cdw.services.DocumentType.DocumentTypeToPipelineType"><End Role="DocumentTypePrincipal" EntitySet="DocumentType"/><End Role="DocumentPipelineMappingDependent" EntitySet="DocumentPipelineMapping"/></AssociationSet></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>`);
});

router.use("/hc/hph/search/services/documents.xsjs?", (req, res) => {
  if (req.method === "GET") {
    return res.status(200).json({
      value: [
        {
          DocumentID: "6932623220693262325F30303030303030303638",
          Author: "i2b2 load",
          FileName: "227.xml.txt",
          LanguageCode: "en",
          MIMEType: "text/plain",
          Title: "227.xml.txt",
          DocumentType: "legacy.tax.DoctorLetter",
          CreatedAt: "",
          CreatedBy: "",
          ChangedAt: "",
          ChangedBy: "",
          DocumentTypeName: "Doctor's Letter",
          URLToOriginal:
            "/hc/hph/cdw/services/originalDocument.xsjs?DocumentID=6932623220693262325F30303030303030303638",
          PatientID: "495348303170694A644C397458547769444E72364470634334676D",
          SourcePatientID: "piJdL9tXTwiDNr6DpcC4gm",
          FamilyName: "vant Morgan",
          GivenName: "Augustus",
        },
        {
          DocumentID: "6932623220693262325F30303030303030323133",
          Author: "i2b2 load",
          FileName: "76031DR.txt",
          LanguageCode: "en",
          MIMEType: "text/plain",
          Title: "76031DR.txt",
          DocumentType: "legacy.tax.DoctorLetter",
          CreatedAt: "",
          CreatedBy: "",
          ChangedAt: "",
          ChangedBy: "",
          DocumentTypeName: "Doctor's Letter",
          URLToOriginal:
            "/hc/hph/cdw/services/originalDocument.xsjs?DocumentID=6932623220693262325F30303030303030323133",
          PatientID: "495348303170694A644C397458547769444E72364470634334676D",
          SourcePatientID: "piJdL9tXTwiDNr6DpcC4gm",
          FamilyName: "vant Morgan",
          GivenName: "Augustus",
        },
        {
          DocumentID: "67656E202067656E5F30303030303030313033",
          Author: "gen load",
          FileName: "DoctorLetter_AICHBAUERAgafia_20140813_041846.pdf",
          LanguageCode: "en",
          MIMEType: "application/pdf",
          Title: "DoctorLetter_AICHBAUERAgafia_20140813_041846.pdf",
          DocumentType: "legacy.tax.DoctorLetter",
          CreatedAt: "",
          CreatedBy: "",
          ChangedAt: "",
          ChangedBy: "",
          DocumentTypeName: "Doctor's Letter",
          URLToOriginal:
            "/hc/hph/cdw/services/originalDocument.xsjs?DocumentID=67656E202067656E5F30303030303030313033",
          PatientID: "495348303170694A644C397458547769444E72364470634334676D",
          SourcePatientID: "piJdL9tXTwiDNr6DpcC4gm",
          FamilyName: "vant Morgan",
          GivenName: "Augustus",
        },
        {
          DocumentID: "67656E202067656E5F30303030303030313236",
          Author: "gen load",
          FileName: "DoctorLetter_AICHBAUERBorghildur_20140731_003836.pdf",
          LanguageCode: "en",
          MIMEType: "application/pdf",
          Title: "DoctorLetter_AICHBAUERBorghildur_20140731_003836.pdf",
          DocumentType: "legacy.tax.DoctorLetter",
          CreatedAt: "",
          CreatedBy: "",
          ChangedAt: "",
          ChangedBy: "",
          DocumentTypeName: "Doctor's Letter",
          URLToOriginal:
            "/hc/hph/cdw/services/originalDocument.xsjs?DocumentID=67656E202067656E5F30303030303030313236",
          PatientID: "495348303170694A644C397458547769444E72364470634334676D",
          SourcePatientID: "piJdL9tXTwiDNr6DpcC4gm",
          FamilyName: "vant Morgan",
          GivenName: "Augustus",
        },
        {
          DocumentID: "6932623220693262325F30303030303030323936",
          Author: "i2b2 load",
          FileName: "clinical-127.txt",
          LanguageCode: "en",
          MIMEType: "text/plain",
          Title: "clinical-127.txt",
          DocumentType: "legacy.tax.DoctorLetter",
          CreatedAt: "",
          CreatedBy: "",
          ChangedAt: "",
          ChangedBy: "",
          DocumentTypeName: "Doctor's Letter",
          URLToOriginal:
            "/hc/hph/cdw/services/originalDocument.xsjs?DocumentID=6932623220693262325F30303030303030323936",
          PatientID: "495348303170694A644C397458547769444E72364470634334676D",
          SourcePatientID: "piJdL9tXTwiDNr6DpcC4gm",
          FamilyName: "vant Morgan",
          GivenName: "Augustus",
        },
      ],
      DocumentCnt: 5,
      "@odata.count": 5,
    });
  }
});

router.use("/hc/hph/eula/services/Eula.xsodata", (req, res) => {
  if (req.method === "GET") {
    switch (req.path) {
      case "/OpenEulas":
        return res.status(200).json({ d: { results: [] } });
      case "/$metadata":
        return res
          .set("Content-Type", "application/xml")
          .status(200)
          .send(
            `<?xml version="1.0" encoding="utf-8" standalone="yes" ?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0"><Schema Namespace="legacy.eula.services.Eula" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="OpenEulasType"><Key><PropertyRef Name="ID" /></Key><Property Name="EulaName" Type="Edm.String" MaxLength="256" /><Property Name="Name" Type="Edm.String" MaxLength="100" /><Property Name="Label" Type="Edm.String" MaxLength="100" /><Property Name="Description" Type="Edm.String" MaxLength="5000" /><Property Name="ID" Type="Edm.String" Nullable="false" MaxLength="1024" /><Property Name="Text" Type="Edm.String" MaxLength="2147483647" /><Property Name="Language" Type="Edm.String" Nullable="false" MaxLength="2" /><Property Name="VersionNo" Type="Edm.Int32" Nullable="false" /></EntityType><EntityType Name="EulaAgreementType"><Key><PropertyRef Name="ID" /></Key><Property Name="ID" Type="Edm.String" Nullable="false" MaxLength="1024" /><Property Name="VersionNo" Type="Edm.Int32" Nullable="false" DefaultValue="1" /></EntityType><EntityContainer Name="Eula" m:IsDefaultEntityContainer="true"><EntitySet Name="OpenEulas" EntityType="legacy.eula.services.Eula.OpenEulasType" /><EntitySet Name="EulaAgreement" EntityType="legacy.eula.services.Eula.EulaAgreementType" /></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>`
          );
      default:
        return res.status(404).send("");
    }
  }
  res.json({ d: { results: [] } });
});

router.get("/hana/xs/formLogin/token.xsjs", (req, res) => {
  res.json("");
});

router.get("/hc/hph/core/services/ping.xsjs", (req, res) => {
  res.status(200).send("pong");
});

// fake responses (for now) for config assignment screen
router.get("/hc/hph/um/org/services/OrgManager.xsjs", (req, res) => {
  if (req.query.function_name === "getOrgId_Name") {
    res.status(200)
      .send(`%7B%22ORGDET%22:%7B%220%22:%7B%22ORGID%22:%22001%22,%22ORGNAME%22:%22ACME%22,%22STATUS%22:%22Active%22,
        %22EXTERNAL_ORGID%22:null%7D,%221%22:%7B%22ORGID%22:%22100%22,%22ORGNAME%22:%22ONCOLOGY%22,%22STATUS%22:%22Active%22,%22EXTERNAL_ORGID%22:null%7D,
        %222%22:%7B%22ORGID%22:%22200%22,%22ORGNAME%22:%22CLINIC%22,%22STATUS%22:%22Active%22,%22EXTERNAL_ORGID%22:null%7D,%223%22:%7B%22ORGID%22:%22300%22,
        %22ORGNAME%22:%22CHEMO%22,%22STATUS%22:%22Active%22,%22EXTERNAL_ORGID%22:null%7D,%224%22:%7B%22ORGID%22:%22400%22,%22ORGNAME%22:%22RADIO%22,
        %22STATUS%22:%22Active%22,%22EXTERNAL_ORGID%22:null%7D,%225%22:%7B%22ORGID%22:%22500%22,%22ORGNAME%22:%22SURGEON%22,%22STATUS%22:%22Active%22,
        %22EXTERNAL_ORGID%22:null%7D,%226%22:%7B%22ORGID%22:%22600%22,%22ORGNAME%22:%22LABORATORY%22,%22STATUS%22:%22Active%22,%22EXTERNAL_ORGID%22:null%7D%7D,
        %22O_MESSAGE%22:%7B%220%22:%7B%22Status%22:%22S%22,%22Code%22:null,%22Message%22:%22Success%22%7D%7D%7D`);
  } else {
    res.sendStatus(500);
  }
});

router.get("/hc/hph/um/user/services/userManager.xsjs", (req, res) => {
  if (req.query.op === "getAllUsers") {
    res.status(200)
      .send(`%7B%22USERS%22:%7B%220%22:%7B%22USERNAME%22:%22SYSTEM%22,%22EMAIL%22:null,%22TIMEZONE%22:null,%22FIRSTNAME%22:null,
    %22LASTNAME%22:null,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:21:55.863Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %221%22:%7B%22USERNAME%22:%22ALICE%22,%22EMAIL%22:%22ALICE@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22Alice%22,%22LASTNAME%22:%22Wonderland%22
    %22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:25.566Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %222%22:%7B%22USERNAME%22:%22BOB%22,%22EMAIL%22:%22BOB@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22Robert%20Underdunk%22,
    %22LASTNAME%22:%22Terwilliger%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:25.742Z%22,%22VALID_TO%22:null,
    %22STATUS%22:%22ACTIVE%22%7D,%223%22:%7B%22USERNAME%22:%22CHAD%22,%22EMAIL%22:%22chad.mosca@sap.com%22,%22TIMEZONE%22:null,
    %22FIRSTNAME%22:%22Chad%20Mosca%22,%22LASTNAME%22:null,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:25.912Z%22,%22VALID_TO%22:null,
    %22STATUS%22:%22ACTIVE%22%7D,%224%22:%7B%22USERNAME%22:%22CHESTER%22,%22EMAIL%22:%22CHESTER@sap.com%22,%22TIMEZONE%22:null,
    %22FIRSTNAME%22:%22Chester%20A.%22,%22LASTNAME%22:%22Arthur%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:26.079Z%22,
    %22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,%225%22:%7B%22USERNAME%22:%22JAMES%22,%22EMAIL%22:%22JAMES@sap.com%22,%22TIMEZONE%22:null,
    %22FIRSTNAME%22:%22James%22,%22LASTNAME%22:%22Dean%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:26.245Z%22,%22VALID_TO%22:null,
    %22STATUS%22:%22ACTIVE%22%7D,%226%22:%7B%22USERNAME%22:%22HPH_ADMIN%22,%22EMAIL%22:%22HPH_ADMIN@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22HPH%22,
    %22LASTNAME%22:%22Admin%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:26.661Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %227%22:%7B%22USERNAME%22:%22MRI_ADMIN%22,%22EMAIL%22:%22MRI_ADMIN@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22MRI%22,%22LASTNAME%22:%22Admin%22,
    %22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:27.153Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %228%22:%7B%22USERNAME%22:%22PD_ADMIN%22,%22EMAIL%22:%22PD_ADMIN@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22PD%22,%22LASTNAME%22:%22Admin%22,
    %22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:27.417Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %229%22:%7B%22USERNAME%22:%22MRI_TEST_USER%22,%22EMAIL%22:%22MRI_TEST_USER@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22MRI%22,
    %22LASTNAME%22:%22TestUser%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:27.849Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %2210%22:%7B%22USERNAME%22:%22FRENCH_USER%22,%22EMAIL%22:%22french.user@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22Coco%22,
    %22LASTNAME%22:%22Chanel%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:30.775Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %2211%22:%7B%22USERNAME%22:%22GERMAN_USER%22,%22EMAIL%22:%22german.user@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22Alfred%22,
    %22LASTNAME%22:%22Nobel%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:31.105Z%22,%22VALID_TO%22:null,%22STATUS%22:%22ACTIVE%22%7D,
    %2212%22:%7B%22USERNAME%22:%22ENGLISH_USER%22,%22EMAIL%22:%22english.user@sap.com%22,%22TIMEZONE%22:null,%22FIRSTNAME%22:%22John%22,
    %22LASTNAME%22:%22Lennon%22,%22EXTERNAL_SOURCE%22:null,%22VALID_FROM%22:%222016-12-29T07:54:31.397Z%22,%22VALID_TO%22:null,
    %22STATUS%22:%22ACTIVE%22%7D%7D,%22OS_MESSAGE%22:%7B%220%22:%7B%22STATUS%22:%22S%22,%22ERROR_CODE%22:0,%22ERROR_MESSAGE%22:%22Success%22%7D%7D%7D`);
  } else {
    res.sendStatus(500);
  }
});

export const testRouter = router;
