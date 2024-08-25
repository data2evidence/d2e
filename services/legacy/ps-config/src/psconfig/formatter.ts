/**
 * @file Patient Summary Configuration Formatter
 */

import { utils } from "@alp/alp-base-utils";
import { getPlaceholderPatternRegex } from "./config";

const BACKEND_ONLY_ANNOTATIONS = [
  "interaction_attribute_name",
  "interaction_attribute_value",
  "interaction_grouping_attribute",
];

// ToDo: Add the list to the Patient Summary config
const STANDARD_ANNOTATIONS = [
  "patient_id",
  "interaction_start",
  "interaction_end",
  "date_of_birth",
  "date_of_death",
  // TODO: Workaround for FP02 due to time constraints and UI-Freeze
  "interaction_attribute_name",
  "interaction_attribute_value",
  "interaction_grouping_attribute",
];

/*
        Workaround for FP02 due to missing annotation support in CDW.
        TODO: Remove as soon as annotations are supported
    */
const ATTR_ID_2_ANNOTATION = {
  pid: "patient_id",
  start: "interaction_start",
  end: "interaction_end",
  dateOfBirth: "date_of_birth",
  dateOfDeath: "date_of_death",
};

const GEN_VARIANT_ANNOTATION = "genomics_variant_location";

export class Formatter {
  constructor() {}

  private aAvailableAnnotations;

  public isUIAnnotation(sAnnotation) {
    return BACKEND_ONLY_ANNOTATIONS.indexOf(sAnnotation) === -1;
  }

  public _getNameFromNameObj(nameObj, requestedLanguage) {
    let val = "";
    nameObj.some((name) => {
      if (name.lang === requestedLanguage) {
        val = name.value;
        return true;
      } else if (name.lang === "") {
        val = name.value;
      }
      return false;
    });
    return val;
  }

  public _getAttributesInHeader(patientConfig) {
    let iRow;
    let aConfiguredTimelineAttributes = [];
    let configRegex = getPlaceholderPatternRegex();

    // the placeholder format has changed to {<attributeId>} and the VALUES array will no longer be used
    // for compatibility, a check will be made to make sure that the old config will still work
    let placeholderList =
      patientConfig.masterdata.title[0].pattern.match(configRegex);

    if (
      placeholderList &&
      patientConfig.masterdata.title[0].values.length === 0
    ) {
      if (patientConfig.masterdata.title[0]) {
        aConfiguredTimelineAttributes =
          aConfiguredTimelineAttributes.concat(placeholderList);
      }

      for (iRow = 0; iRow < patientConfig.masterdata.details.length; iRow++) {
        aConfiguredTimelineAttributes = aConfiguredTimelineAttributes.concat(
          patientConfig.masterdata.details[iRow].pattern.match(configRegex)
        );
      }
    } else {
      // get all masterdata attributes that are configured for the patient service

      if (patientConfig.masterdata.title[0]) {
        aConfiguredTimelineAttributes = aConfiguredTimelineAttributes.concat(
          patientConfig.masterdata.title[0].values
        );
      }

      for (iRow = 0; iRow < patientConfig.masterdata.details.length; iRow++) {
        aConfiguredTimelineAttributes = aConfiguredTimelineAttributes.concat(
          patientConfig.masterdata.details[iRow].values
        );
      }
    }
    return aConfiguredTimelineAttributes;
  }

  /**
   * Adds and removes values in order to provide backwards compatibility.
   * @private
   * @param   {Object} piConfig       Patient Summary Config Object
   * @param   {object} cdmConfig      cdw config object in backend format
   */
  public _achieveBackwardsCompatibility(piConfig, cdmConfig) {
    let configWalkFunction = utils.getJsonWalkFunction(piConfig);
    let cdmConfigWalkFunction = utils.getJsonWalkFunction(cdmConfig);
    let aExistingLaneIds = piConfig.lanes
      .filter((oLane) => {
        return oLane.hasOwnProperty("laneId");
      })
      .map((oLane) => {
        return oLane.laneId;
      });
    let nLaneId = 0;

    // remove interactions that can no longer be added to a lane
    configWalkFunction("lanes.*").forEach((lane) => {
      lane.obj.interactions = lane.obj.interactions.filter((inter) => {
        // explicitly disable the CDM interaction "Genetic Variant". Not working/meaningful.
        return !this.interactionHasAnnotation(inter, GEN_VARIANT_ANNOTATION);
      });
    });

    // remove attributes that can no longer be added to a lane
    configWalkFunction("lanes.*.interactions.*").forEach((psInter) => {
      psInter.obj.attributes = psInter.obj.attributes.filter((psAttr) => {
        let cdmAttrPath = psAttr.source;
        // The attribute source can only link to at max one cdm entry.
        // There are two cases to consider here:
        // 1) Loading a saved configuration
        //   - cdmConfigWalkFunction(cdmAttrPath) always returns exactly one match.
        //   - the configuration validation made sure, that a match exists in the cdm configuration.
        //     -> array has exactly one element and `every()` just checks this element.
        // 2) Validating a new incoming configuration
        //   - cdmConfigWalkFunction(cdmAttrPath) returns either no or one match.
        //   - since `every()` always returns true for empty arrays, we ensure that PS attributes
        //     with no match in the cdm configuration are kept for configuration validation.
        return cdmConfigWalkFunction(cdmAttrPath).every((cdmAttr) => {
          // don't include measure attributes. Not working/meaningful.
          let isAggrAttr =
            typeof cdmAttr.obj.measureExpression === "string" &&
            cdmAttr.obj.measureExpression !== "";

          return !isAggrAttr;
        });
      });
    });

    configWalkFunction("lanes.*").forEach((lane, index) => {
      if (!lane.obj.hasOwnProperty("tilesHidden")) {
        lane.obj.tilesHidden = false;
      }
      // assign a laneId that stays the same for each request (contrary to the random ID that is used when a new lane is added in the frontend)
      if (!lane.obj.hasOwnProperty("laneId") || lane.obj.laneId === "") {
        // find lowest index that has not been used as laneId
        while (aExistingLaneIds.indexOf(nLaneId.toString()) > -1) {
          nLaneId++;
        }
        // assign lane index as laneId and mark it used by increasing the counter
        lane.obj.laneId = nLaneId.toString();
        nLaneId++;
      }
    });
    configWalkFunction("lanes.*.interactions.*").forEach((interaction) => {
      if (!(typeof interaction.obj.plotGeneratedAttr === "boolean")) {
        interaction.obj.plotGeneratedAttr = false;
      }
    });
    configWalkFunction("lanes.*.interactions.*").forEach((interaction) => {
      if (!Array.isArray(interaction.obj.allowedPlottableAttr)) {
        interaction.obj.allowedPlottableAttr = [];
      }
    });
    configWalkFunction("lanes.*.interactions.*.attributes.*").forEach(
      (attribute) => {
        // add the formatter property to the attributes
        if (!attribute.obj.hasOwnProperty("formatter")) {
          attribute.obj.formatter = {
            pattern: "{" + attribute.obj.source.split(".attributes.")[1] + "}",
            values: [],
          };
        }
        // add the plottable property to the attributes
        if (!attribute.obj.hasOwnProperty("plottable")) {
          attribute.obj.plottable = false;
        }
      }
    );

    // Ensure that the inspectorOptions exist
    if (!piConfig.hasOwnProperty("inspectorOptions")) {
      piConfig.inspectorOptions = {};
    }

    // Ensure that the timeline field exists
    if (!piConfig.inspectorOptions.timeline) {
      piConfig.inspectorOptions.timeline = {};
    }

    // Ensure that the zoom options exist
    if (!piConfig.inspectorOptions.timeline.zoom) {
      piConfig.inspectorOptions.timeline.zoom = {
        initialZoom: "rightZoom",
        leftZoom: "1y",
        middleZoom: "3y",
        rightZoom: "lifespan",
      };
    }

    // Add section for tab extension configuration
    if (!Array.isArray(piConfig.inspectorOptions.tabExtensions)) {
      piConfig.inspectorOptions.tabExtensions = [];
    }

    // Add section for widget extension configuration
    if (!Array.isArray(piConfig.inspectorOptions.widgetExtensions)) {
      piConfig.inspectorOptions.widgetExtensions = [];
    }

    // If inspectorOptions.overview entry exists, we have a FP05 config
    //
    // Steps for migration:
    // 1. Upsert an overview entry in tab extension list and migrate overview visibility
    // 2. Upsert a timeline entry in tab extension list
    // 3. Upsert a master data entry in widget extension list
    //
    if (piConfig.inspectorOptions.overview) {
      // Add overview tab entry in front (if there is none yet)
      let sOverviewId = "sap.hc.hph.patient.plugins.tabs.overview";
      let oOverviewConfig = piConfig.inspectorOptions.tabExtensions.find(
        (oExtension) => {
          return oExtension.extensionId === sOverviewId;
        }
      );
      if (!oOverviewConfig) {
        piConfig.inspectorOptions.tabExtensions.splice(0, 0, {
          extensionId: sOverviewId,
          visible: piConfig.inspectorOptions.overview.visible,
        });
      }
      delete piConfig.inspectorOptions.overview;

      // Add timeline tab entry in front (if there is none yet)
      let sTimelineId = "sap.hc.hph.patient.plugins.tabs.timeline";
      let oTimelineConfig = piConfig.inspectorOptions.tabExtensions.find(
        (oExtension) => {
          return oExtension.extensionId === sTimelineId;
        }
      );
      if (!oTimelineConfig) {
        piConfig.inspectorOptions.tabExtensions.splice(0, 0, {
          extensionId: sTimelineId,
          visible: true,
        });
      }

      // Add master data widget entry in front (if there is none yet)
      let sMasterDataId = "sap.hc.hph.patient.plugins.widgets.masterdata";
      let oMasterDataConfig = piConfig.inspectorOptions.widgetExtensions.find(
        (oExtension) => {
          return oExtension.extensionId === sMasterDataId;
        }
      );
      if (!oMasterDataConfig) {
        piConfig.inspectorOptions.widgetExtensions.splice(0, 0, {
          extensionId: sMasterDataId,
          visible: true,
        });
      }
    }

    // Remove related documents section, as it has been moved to a separate extension
    // and is no longer part of the main codeline
    delete piConfig.inspectorOptions.relatedDocuments;
  }

  /**
   * Filters values in an array by a given set of values and returns the distinct list
   * @private
   * @param   {array} aObj    List of values to be filtered
   * @param   {array} aFilter List of values to pass the filter
   * @returns {array} Distinct and filtered list
   */
  private _filterElements(aObj, aFilter) {
    return aObj.filter((obj, ind, self) => {
      if (aFilter.indexOf(obj) >= 0) {
        return self.indexOf(obj) === ind;
      }
      return false;
    });
  }

  /**
   * Gets a list of available annotations based on Patient Summary annotations and active extensions
   * @param   {object} extensions Patient Summary Extensions
   * @returns {array} List of attribute annotations
   */
  public getAvailableAnnotations(extensions) {
    if (!this.aAvailableAnnotations) {
      this.aAvailableAnnotations = JSON.parse(
        JSON.stringify(STANDARD_ANNOTATIONS)
      );
      const aExtensionsWithAnnotations = ["interaction", "tab"];
      if (extensions) {
        aExtensionsWithAnnotations.forEach((sExtensionType) => {
          if (
            extensions[sExtensionType] &&
            Array.isArray(extensions[sExtensionType])
          ) {
            extensions[sExtensionType].forEach((oExtension) => {
              if (oExtension && Array.isArray(oExtension.annotations)) {
                oExtension.annotations.forEach((sAnnotation) => {
                  this.aAvailableAnnotations.push(sAnnotation);
                });
              }
            });
          }
        }, this);
      }
    }
    return this.aAvailableAnnotations;
  }

  /**
   * Gets a list of available annotations for the attribute based on CDM Annotations and special CDM attribute ids
   * @param   {string} sAttributeId Attribute Identifier
   * @param   {object} oCdwAttribute Clinical Data Model Config for this attribute
   * @param   {object} extensions Patient Summary Extensions
   * @returns {array} List of attribute annotations
   */
  public getAnnotationsForAttribute(sAttributeId, oCdwAttribute, extensions) {
    let aAnnotationPool = this.getAvailableAnnotations(extensions);
    let annotations = [];

    // add configured annotations available for patient summary
    if (Array.isArray(oCdwAttribute.annotations)) {
      annotations = oCdwAttribute.annotations;
    }

    /*
            Workaround for FP02/FP03 due to missing annotation support in CDW.
            TODO: Remove as soon as annotations are supported
        */
    if (
      ATTR_ID_2_ANNOTATION.hasOwnProperty(sAttributeId) &&
      annotations.indexOf(ATTR_ID_2_ANNOTATION[sAttributeId]) === -1
    ) {
      annotations.push(ATTR_ID_2_ANNOTATION[sAttributeId]);
    }

    return this._filterElements(annotations, aAnnotationPool);
  }
  /**
   * Gets a list of attributes used in the formatter
   * @param   {object} oFormatter Patient Summary formatter
   * @returns {array} List of attribute identifiers
   */
  public getAttributesInFormatter(oFormatter) {
    if (!oFormatter || !oFormatter.hasOwnProperty("pattern")) {
      return [];
    }
    let sFormatter = oFormatter.pattern;
    let match = sFormatter.match(/{\w+}/g);
    if (!match) {
      return [];
    }
    return match.map((sMatch) => {
      return sMatch.substr(1, sMatch.length - 2);
    });
  }

  /**
   * Return the annotations of an attribute.
   * @param   {object} cdwAttrConfig  CDW config object of an attribute
   * @returns {string[]}          Annotation IDs
   */
  public getAnnotationsOfObjectInCdwConfig(cdwAttrConfig) {
    if (
      typeof cdwAttrConfig === "object" &&
      Array.isArray(cdwAttrConfig.annotations)
    ) {
      return cdwAttrConfig.annotations;
    }
    return [];
  }

  /*
   * Checks for the existence of an annotation in the attributes of an interaction
   * @param   {object} cdmInteraction  CDM config object of an interaction
   * @param   {string} sAnnotation     Annotation to check for
   * @returns {boolean}                Annotation exists in interaction
   */
  public interactionHasAnnotation(cdmInteraction, sAnnotation) {
    let cdmConfigWalkFunction = utils.getJsonWalkFunction(cdmInteraction);
    return cdmConfigWalkFunction("attributes.*").some(
      (cdwInteractionAttribute) => {
        let attrAnnotations = this.getAnnotationsOfObjectInCdwConfig(
          cdwInteractionAttribute.obj
        );
        if (attrAnnotations.indexOf(sAnnotation) !== -1) {
          return true;
        }
        return false;
      }
    );
  }

  /**
   * Format the config for backend use:
   * <p>- set of interactions used
   * <p>- relevant attributes per interaction
   * <p>- get master data attributes used in the header
   * <p>- add available annotations on an attribute level
   * @param   {object} patientConfig Raw config object as taken from DB
   * @param   {object} cdwConfig     cdw config object in backend format
   * @param   {object} extensions     Active extensions for patient summary
   * @returns {object} Formatted config object
   */
  public formatBackendConfig(req, patientConfig, cdwConfig, extensions) {
    let backendConfig = {
      patient: {},
    };
    this._achieveBackwardsCompatibility(patientConfig, cdwConfig);
    let aTimelineAttributes = this._getAttributesInHeader(patientConfig);
    let cdwAttributes = cdwConfig.patient.attributes;

    for (let sAttributeKey in cdwAttributes) {
      let bVisible = aTimelineAttributes.indexOf(sAttributeKey) >= 0;
      let attr = this.getAnnotationsForAttribute(
        sAttributeKey,
        cdwAttributes[sAttributeKey],
        extensions
      );
      if (attr.length > 0 || bVisible) {
        backendConfig.patient[sAttributeKey] = attr;
      }
    }
    patientConfig.lanes.forEach((lane) => {
      lane.interactions.forEach((interaction) => {
        if (interaction.visible) {
          if (!backendConfig.hasOwnProperty(interaction.source)) {
            backendConfig[interaction.source] = {};
          }
          interaction.attributes.forEach((attribute) => {
            let sAttrSourceBase =
              attribute.source.split(".attributes.")[0] + ".attributes.";
            let sAttrId = attribute.source.split(".attributes.")[1];
            let oCdwAttrConfig = utils.getObjectByPath(
              cdwConfig,
              sAttrSourceBase + sAttrId
            );

            let aAttrAnnotations = this.getAnnotationsForAttribute(
              sAttrId,
              oCdwAttrConfig,
              extensions
            );
            let bAttrVisible = attribute.visible;

            if (aAttrAnnotations.length > 0 || bAttrVisible) {
              let formatterAttrIds = this.getAttributesInFormatter(
                attribute.formatter
              );
              formatterAttrIds.push(sAttrId); // Always add the attribute itself
              formatterAttrIds.forEach((sFormatterAttrId) => {
                if (
                  !Array.isArray(
                    backendConfig[interaction.source][sFormatterAttrId]
                  )
                ) {
                  // Attribute has not been added before
                  let cdwAttrConfig = utils.getObjectByPath(
                    cdwConfig,
                    sAttrSourceBase + sFormatterAttrId
                  );
                  let annotations = this.getAnnotationsForAttribute(
                    sFormatterAttrId,
                    cdwAttrConfig,
                    extensions
                  );
                  backendConfig[interaction.source][sFormatterAttrId] =
                    annotations;
                }
              });
            }
          });
        }
      });
    });
    return backendConfig;
  }

  private _isGroupedInteraction(oInteractionConfig) {
    if (oInteractionConfig.attributes) {
      return Object.keys(oInteractionConfig.attributes).some((attrId) => {
        let attrConfig = oInteractionConfig.attributes[attrId];
        let isGroupedInteraction = false;
        if (Array.isArray(attrConfig.annotations)) {
          isGroupedInteraction =
            attrConfig.annotations.indexOf("interaction_grouping_attribute") !==
            -1;
        }
        return isGroupedInteraction;
      });
    }
  }

  /**
   * Format the config for frontend use:
   * <p>- resolve the language of strings
   * <p>- shorten the ids of relative attributes
   * <p>- remove lanes that are marked not to be used (visible: false)
   * <p>- from lanes remove interactions that are marked not to be used
   * (visible: false)
   * <p>- from an interaction, remove attributes that are marked not to be
   * used (visible: false)
   * @param   {object} patientConfig Raw config object as taken from DB
   * @param   {object} cdwConfig     CDW config in backend format
   * @param   {object} extensions     Active extensions for patient summary
   * @returns {object} Formatted config object
   */
  public formatFrontendConfig(req, patientConfig, cdwConfig, extensions, lang) {
    let config = JSON.parse(JSON.stringify(patientConfig));
    this._achieveBackwardsCompatibility(config, cdwConfig);
    this._prepareExtensions(config, extensions);

    let isVisible = (object) => {
      return object.visible;
    };

    config.lanes = config.lanes.filter(isVisible);

    config.lanes.forEach((lane) => {
      lane.title = this._getNameFromNameObj(lane.title, lang);
      lane.interactions = lane.interactions.filter(isVisible);
      lane.interactions.forEach((interaction) => {
        let interactionConfig = utils.getObjectByPath(
          cdwConfig,
          interaction.source
        );
        interaction.name = interactionConfig.name;
        interaction.allowUndefinedAttributes =
          this._isGroupedInteraction(interactionConfig);

        let attributes = {};
        let attributeOrder = {};
        let annotations = {};

        interaction.attributes.forEach((oAttr, iAttrOrder) => {
          let sAttrSourceBase =
            oAttr.source.split(".attributes.")[0] + ".attributes.";
          let sAttrId = oAttr.source.split(".attributes.")[1];
          let oCdwAttrConfig = utils.getObjectByPath(
            cdwConfig,
            sAttrSourceBase + sAttrId
          );

          let aAttrAnnotations = this.getAnnotationsForAttribute(
            sAttrId,
            oCdwAttrConfig,
            extensions
          ).filter(this.isUIAnnotation);
          let bAttrVisible = oAttr.visible;

          if (aAttrAnnotations.length > 0 || bAttrVisible) {
            let aFormatterAttrIds = this.getAttributesInFormatter(
              oAttr.formatter
            );
            aFormatterAttrIds.push(sAttrId); // Always add the attribute itself
            aFormatterAttrIds.forEach((sFormatterAttrId) => {
              if (!attributes.hasOwnProperty(sFormatterAttrId)) {
                // Attribute has not been added before
                let attributeConfig = utils.getObjectByPath(
                  cdwConfig,
                  sAttrSourceBase + sFormatterAttrId
                );

                let sFormatterAttrConfig = interaction.attributes.find(
                  (oAttribute) => {
                    return (
                      oAttribute.source === sAttrSourceBase + sFormatterAttrId
                    );
                  }
                );
                if (!sFormatterAttrConfig) {
                  return;
                }

                // Add Attribute
                attributes[sFormatterAttrId] = JSON.parse(
                  JSON.stringify(sFormatterAttrConfig)
                );
                attributes[sFormatterAttrId].source = sFormatterAttrId;
                attributes[sFormatterAttrId].id = sFormatterAttrId; // Added to keep in line with the cloud PS format
                attributes[sFormatterAttrId].name = attributeConfig.name;
                attributes[sFormatterAttrId].type = attributeConfig.type;

                // Add annotations
                let attrAnnotations = this.getAnnotationsForAttribute(
                  sFormatterAttrId,
                  attributeConfig,
                  extensions
                ).filter(this.isUIAnnotation);
                attrAnnotations.forEach((annotation) => {
                  if (!annotations.hasOwnProperty(annotation)) {
                    annotations[annotation] = [];
                  }
                  annotations[annotation].push(sFormatterAttrId);
                });
              }
              if (sAttrId === sFormatterAttrId) {
                attributeOrder[sFormatterAttrId] = iAttrOrder;
              }
            });
          }
        });

        interaction.annotations = annotations;
        interaction.attributes = Object.keys(attributes)
          .map((sAttrId) => {
            return attributes[sAttrId];
          })
          .sort((a, b) => {
            if (!attributeOrder.hasOwnProperty(a.id)) {
              if (!attributeOrder.hasOwnProperty(b.id)) {
                return 0; // both attributes don't have an order
              } else {
                return 1; // a doesn't have an order
              }
            } else if (!attributeOrder.hasOwnProperty(b.id)) {
              return -1; // b doesn't have an order
            }
            return attributeOrder[a.id] - attributeOrder[b.id];
          });
      });
    });

    config.masterdata.types = {};
    config.masterdata.annotations = {};
    let aTimelineAttributes = this._getAttributesInHeader(patientConfig);
    let attrKeys = Object.keys(cdwConfig.patient.attributes);

    attrKeys.forEach((attrKey) => {
      let attrConfig = cdwConfig.patient.attributes[attrKey];
      let bVisible = aTimelineAttributes.indexOf(attrKey) >= 0;
      let aAnnotations = this.getAnnotationsForAttribute(
        attrKey,
        attrConfig,
        extensions
      );

      if (aAnnotations.length > 0 || bVisible) {
        // is either visible or has a valid annotation
        config.masterdata.types[attrKey] = attrConfig.type;
        aAnnotations.forEach((sAnnotation) => {
          if (!config.masterdata.annotations.hasOwnProperty(sAnnotation)) {
            config.masterdata.annotations[sAnnotation] = [];
          }
          config.masterdata.annotations[sAnnotation].push(attrKey);
        });
      }
    });

    this.formatPatientHeaderDetails(config);
    return config;
  }

  /**
   * Format the list of assigned configs for a user. Removes the actual config
   * object so the list is limited to metadata.
   * @param   {Array} configList List of complete config objects with config and meta data
   * @param   {Array} defaultConfig Default config meta data
   * @returns {Array} List of config meta objects.
   */
  public formatUserList(configList, defaultConfig) {
    function isDefault(config) {
      return (
        config.configId === defaultConfig.configId &&
        config.configVersion === defaultConfig.configVersion
      );
    }
    return configList.map((config) => {
      return {
        meta: {
          assignmentId: config.assignmentId,
          assignmentName: config.assignmentName,
          configId: config.configId,
          configName: config.configName,
          configStatus: config.configStatus,
          configVersion: config.configVersion,
          created: config.created,
          creator: config.creator,
          dependentConfig: config.dependentConfig,
          modified: config.modified,
          modifier: config.modifier,
          default: isDefault(config),
        },
      };
    });
  }

  /**
   * Create the list of all available cdwConfigs with their versions, and then
   * add the Patient Summary configs to their respective CDW configurations
   * @param   {Array} configList    List of PI configurations
   * @param   {Array} cdwConfigList List of CDW configurations
   * @returns {Array} List of CDW configurations with depending PI configurations
   */
  public formatList(configList, cdwConfigList) {
    let cdwConfigs = {};

    // create the list of all available cdwConfigs with their versions
    cdwConfigList.forEach((cdwConfig) => {
      if (!cdwConfigs.hasOwnProperty(cdwConfig.configId)) {
        cdwConfigs[cdwConfig.configId] = {
          configId: cdwConfig.configId,
          configName: cdwConfig.configName,
          versions: {},
          configs: [],
        };
      }
      cdwConfigs[cdwConfig.configId].versions[cdwConfig.configVersion] = {
        version: cdwConfig.configVersion,
        status: cdwConfig.configStatus,
      };
    });

    // add the Patient Summary configs to their respective cdwConfigs
    configList.forEach((config) => {
      if (!cdwConfigs.hasOwnProperty(config.dependentConfig.configId)) {
        throw new Error("CONFIG_ERROR_CDW_DOES_NOT_EXIST");
      }
      cdwConfigs[config.dependentConfig.configId].configs.push({
        meta: {
          configId: config.configId,
          configName: config.configName,
          configVersion: config.configVersion,
          creator: config.creator,
          created: config.created,
          modifier: config.modifier,
          modified: config.modified,
          dependentConfig: {
            configId: config.dependentConfig.configId,
            configVersion: config.dependentConfig.configVersion,
          },
        },
      });
    });

    // convert the object storing the cdwConfigs to an array
    return Object.keys(cdwConfigs).map((key) => {
      return cdwConfigs[key];
    });
  }

  /**
   * Return the name property of an object given by a path.
   * @param   {object} cdwConfig CDW config object
   * @param   {string} path      Dot separated path to the object
   * @returns {string} Name of the object
   */
  public getNameOfObjectInCdwConfig(cdwConfig, path) {
    return utils.getObjectByPath(cdwConfig, path + ".name");
  }

  /**
   * Given a raw Patient Summary configuration, add the 'visible' property
   * to all lanes, interactions and attributes that don't yet have it. The
   * property will be set to the status passed in the parameter
   * 'visibleStatus'.
   * @param   {object}  piConfig      PI config object
   * @param   {boolean} visibleStatus New visibility status
   */
  public addVisiblePropertyToConfig(piConfig, visibleStatus) {
    let configWalkFunction = utils.getJsonWalkFunction(piConfig);
    configWalkFunction("lanes.*").forEach((lane) => {
      // add the visible property to the lane
      if (!lane.obj.hasOwnProperty("visible")) {
        lane.obj.visible = visibleStatus;
      }
    });
    configWalkFunction("lanes.*.interactions.*").forEach((interaction) => {
      // add the visible property to the interaction
      if (!interaction.obj.hasOwnProperty("visible")) {
        interaction.obj.visible = visibleStatus;
      }
    });
    configWalkFunction("lanes.*.interactions.*.attributes.*").forEach(
      (attribute) => {
        // add the visible property to the attribute
        if (!attribute.obj.hasOwnProperty("visible")) {
          attribute.obj.visible = visibleStatus;
        }
      }
    );
  }

  /**
   * Given a raw Patient Summary configuration, add the 'isGrouped' property and
   * updates the attributes for all grouped interactions
   * @param   {object}  piConfig      PI config object
   * @param   {object}  oCDMConfig    CDM config object
   * @param   {string}  sBasePath     Where to find the interactions
   * @param   {boolean} [bPlottable=false]  Whether to enable plotting if not defined
   */
  public formatGroupedInteractions(
    piConfig,
    oCDMConfig,
    sBasePath,
    bPlottable
  ) {
    let fnPIConfigWalkFunction = utils.getJsonWalkFunction(piConfig);
    let fnCDMConfigWalkFunction = utils.getJsonWalkFunction(oCDMConfig);
    fnPIConfigWalkFunction(sBasePath + ".interactions.*").forEach(
      (interaction) => {
        let cdwSource = interaction.obj.source;
        let bGrouped = fnCDMConfigWalkFunction(
          cdwSource + ".attributes.*"
        ).some((attribute) => {
          if (Array.isArray(attribute.obj.annotations)) {
            return (
              attribute.obj.annotations.indexOf(
                "interaction_grouping_attribute"
              ) >= 0
            );
          }
          return false;
        });
        if (bGrouped) {
          interaction.obj.isGrouped = true;
          if (!interaction.obj.hasOwnProperty("plotGeneratedAttr")) {
            interaction.obj.plotGeneratedAttr = bPlottable || false;
          }
          if (!interaction.obj.hasOwnProperty("allowedPlottableAttr")) {
            interaction.obj.allowedPlottableAttr = [];
          }
          if (
            interaction.obj.hasOwnProperty("allowedPlottableAttr") &&
            Array.isArray(interaction.obj.allowedPlottableAttr)
          ) {
            let aFormattedAllowedPlottableAttr = [];
            interaction.obj.allowedPlottableAttr.forEach((attribute) => {
              if (
                typeof attribute === "string" ||
                attribute instanceof String
              ) {
                let oAttribute = {
                  name: attribute,
                  selected: false,
                };
                aFormattedAllowedPlottableAttr.push(oAttribute);
              } else if (
                typeof attribute === "object" &&
                attribute !== null &&
                (typeof attribute.name === "string" ||
                  attribute.name instanceof String) &&
                typeof attribute.selected === "boolean"
              ) {
                aFormattedAllowedPlottableAttr.push(attribute);
              }
            });
            interaction.obj.allowedPlottableAttr =
              aFormattedAllowedPlottableAttr;
          }
          fnCDMConfigWalkFunction(cdwSource + ".attributes.*").forEach(
            (attribute) => {
              attribute.obj.visible = false;
              attribute.obj.plottable = false;
            }
          );
        }
      }
    );
  }

  public addPlottablePropertyToConfig(piConfig, cdwConfig) {
    let configWalkFunction = utils.getJsonWalkFunction(piConfig);
    configWalkFunction("lanes.*.interactions.*.attributes.*").forEach(
      (attribute) => {
        let cdwSource = attribute.obj.source;
        let cdwAttribute = utils.getObjectByPath(cdwConfig, cdwSource);
        let isNumerical = cdwAttribute.type === "num";
        attribute.obj.numerical = isNumerical;
        attribute.obj.plottable = isNumerical && attribute.obj.plottable;
      }
    );
  }

  /**
   * Given a Patient Summary configuration, add all the supported languages to the names of the lanes.
   * For every name, the languages that are supported but not present in the config will be added with an empty string
   * @param   {object} piConfig PI config object
   * @param   {object} cdwConfig CDW config object
   */
  public addSupportedLanguages(piConfig, cdwConfig) {
    // add the develop language on top of the supported ones
    let aSupportedLanguages = [""];
    if (
      cdwConfig.advancedSettings &&
      Array.isArray(cdwConfig.advancedSettings.language)
    ) {
      aSupportedLanguages =
        cdwConfig.advancedSettings.language.concat(aSupportedLanguages);
    }

    let configWalkFunction = utils.getJsonWalkFunction(piConfig);
    configWalkFunction("lanes.*").forEach((lane) => {
      aSupportedLanguages.forEach((sLang) => {
        if (!lane.obj.hasOwnProperty("title")) {
          lane.obj.title = [];
        }
        let bLangExists = lane.obj.title.some((name) => {
          return name.lang === sLang;
        });
        if (!bLangExists) {
          lane.obj.title.push({
            lang: sLang,
            value: "",
          });
        }
      });
    });
  }

  /**
   * Given a Patient Summary configuration and a CDW configuration, add the
   * names to interactions and attributes.
   * @param   {object} piConfig  PI config object
   * @param   {object} cdwConfig CDW config object
   */
  public addNamesToConfig(piConfig, cdwConfig) {
    let configWalkFunction = utils.getJsonWalkFunction(piConfig);
    configWalkFunction("lanes.*.interactions.*").forEach((interaction) => {
      // add a name to the interaction (tile)
      if (interaction.obj.hasOwnProperty("source")) {
        interaction.obj.modelName = this.getNameOfObjectInCdwConfig(
          cdwConfig,
          interaction.obj.source
        );
      }
    });
    configWalkFunction("lanes.*.interactions.*.attributes.*").forEach(
      (attribute) => {
        // add a name to the attribute
        if (attribute.obj.hasOwnProperty("source")) {
          attribute.obj.modelName = this.getNameOfObjectInCdwConfig(
            cdwConfig,
            attribute.obj.source
          );
          attribute.obj.annotations =
            utils.getObjectByPath(cdwConfig, attribute.obj.source)
              .annotations || [];
        }
      }
    );
  }

  /**
   * Take each lane and expand it to contain all the interactions and
   * attributes available in the associated CDW config.
   * @param   {object} piConfig  PI config object
   * @param   {object} cdwConfig CDW config object
   */
  public expandConfig(piConfig, cdwConfig) {
    let completeLaneInteraction = (laneInteraction, cdwInteraction) => {
      // iterate over all cdwInteraction's attributes and add them to the
      // laneInteraction as not visible if they are not there
      Object.keys(cdwInteraction.obj.attributes).forEach(
        (cdwInterAttribKey) => {
          // don't add measure attributes, they don't make sense for patients
          if (
            !cdwInteraction.obj.attributes[cdwInterAttribKey].measureExpression
          ) {
            let attr = laneInteraction.attributes.find((laneAttrib) => {
              return (
                laneAttrib.source ===
                cdwInteraction.path + ".attributes." + cdwInterAttribKey
              );
            });
            let isNumerical =
              cdwInteraction.obj.attributes[cdwInterAttribKey].type === "num";
            if (!attr) {
              laneInteraction.attributes.push({
                source:
                  cdwInteraction.path + ".attributes." + cdwInterAttribKey,
                visible: false,
                numerical: isNumerical,
                plottable: isNumerical,
                firstTileAttribute: false,
                secondTileAttribute: false,
              });
            } else {
              // Make sure the values are set properly
              attr.firstTileAttribute = Boolean(attr.firstTileAttribute);
              attr.secondTileAttribute = Boolean(attr.secondTileAttribute);
              attr.visible = Boolean(attr.visible);
              attr.numerical = isNumerical;
              attr.plottable = Boolean(attr.plottable);
            }
          }
        }
      );
    };

    // retrieve all the interactions from the cdw config into an
    // array
    let configWalkFunction = utils.getJsonWalkFunction(cdwConfig);
    let configInteractions = configWalkFunction("patient.interactions.*")
      .concat(configWalkFunction("patient.conditions.*.interactions.*"))
      .filter((inter) => {
        // skip the CDM interaction "Genetic Variant". Not working/meaningful.
        return !this.interactionHasAnnotation(
          inter.obj,
          GEN_VARIANT_ANNOTATION
        );
      });

    // iterate over all lanes
    piConfig.lanes = piConfig.lanes.map((lane) => {
      // for each interaction, see if the lane has it, and if it is not there, add it:
      configInteractions.forEach((cdwInteraction) => {
        let existingLaneInteraction = lane.interactions.find((element) => {
          return element.source === cdwInteraction.path;
        });

        if (!existingLaneInteraction) {
          // the lane doesn't have this interaction,
          // so add it
          let newLaneInteraction = {
            source: cdwInteraction.path,
            visible: false,
            attributes: [],
          };
          completeLaneInteraction(newLaneInteraction, cdwInteraction);
          lane.interactions.push(newLaneInteraction);
        } else {
          // the lane already has an interaction with
          // this source, so check its completeness
          completeLaneInteraction(existingLaneInteraction, cdwInteraction);
        }
      });
      return lane;
    });
  }

  /**
   * Updates the state of the tab extensions. I.e.:
   * 1) Adds tab extensions unknown to the configuration
   * 2) Disables inactive tab extensions
   * 3) Removes plugins removed from the system
   * @param   {object} piConfig PI config object
   * @param   {object} aActiveExtensions Patient Summary Extensions
   */
  public async updateConfigExtensions(req, piConfig, aActiveExtensions) {
    // Fill tab extension information
    let aPRTabExtensions = aActiveExtensions.tab;
    let aTabExtensions = aPRTabExtensions.map((oExtension) => {
      if (oExtension != undefined) {
        let oCurExtConf = piConfig.inspectorOptions.tabExtensions.find(
          (oConfigExtension) => {
            return oConfigExtension.extensionId === oExtension.id;
          }
        );
        return {
          extensionId: oExtension.id,
          name: oExtension.name,
          alias: oExtension.alias,
          visible: oCurExtConf
            ? oCurExtConf.visible && oExtension.status === "ACTIVE"
            : false,
          enabled: oExtension.status === "ACTIVE",
        };
      }
    });
    piConfig.inspectorOptions.tabExtensions = aTabExtensions;

    // Fill widget extension information
    let aPRWidgetExtensions = aActiveExtensions.widget;
    let aWidgetExtensions = aPRWidgetExtensions.map((oExtension) => {
      if (oExtension != undefined) {
        let oCurExtConf = piConfig.inspectorOptions.widgetExtensions.find(
          (oConfigExtension) => {
            return oConfigExtension.extensionId === oExtension.id;
          }
        );
        return {
          extensionId: oExtension.id,
          name: oExtension.name,
          alias: oExtension.alias,
          visible: oCurExtConf
            ? oCurExtConf.visible && oExtension.status === "ACTIVE"
            : false,
          enabled: oExtension.status === "ACTIVE",
        };
      }
    });
    piConfig.inspectorOptions.widgetExtensions = aWidgetExtensions;
  }

  /**
   * Filters by active and visible tab extensions and creates the format expected by the
   * Patient Summary application.
   * @param  {object} piConfig             Patient Summary Configuration
   * @param  {array}  aActiveTabExtensions Active Tab Extensions
   */
  private _prepareExtensions(piConfig, aActiveExtensions) {
    // Extend tab extensions
    // let aActiveTabExtensions = aActiveExtensions.tab || [];
    // let aVisibleTabExtensions = piConfig.inspectorOptions.tabExtensions.filter((oConfigExtension) => {
    //     if (oConfigExtension) {
    //         let bActive = aActiveTabExtensions.some((oExtension) => {
    //             if (oExtension) {
    //                 return oConfigExtension.extensionId === oExtension.id;
    //             };
    //         });
    //         return oConfigExtension.visible && Boolean(bActive);
    //     };
    // });
    // piConfig.inspectorOptions.tabExtensions = aVisibleTabExtensions.map((oVisibleExtension) => {
    //     return aActiveTabExtensions.find((oExtension) => {
    //         return oVisibleExtension.extensionId === oExtension.id;
    //     });
    // });
    // Extend widget extensions
    // let aActiveWidgetExtensions = aActiveExtensions.widget || [];
    // let aVisibleWidgetExtensions =
    //   piConfig.inspectorOptions.widgetExtensions.filter((oConfigExtension) => {
    //     if (oConfigExtension) {
    //       let bActive = aActiveWidgetExtensions.some(function (oExtension) {
    //         if (oExtension) {
    //           return oConfigExtension.extensionId === oExtension.id;
    //         }
    //       });
    //       return oConfigExtension.visible && Boolean(bActive);
    //     }
    //   });
    // piConfig.inspectorOptions.widgetExtensions = aVisibleWidgetExtensions.map(
    //   (oVisibleExtension) => {
    //     return aActiveWidgetExtensions.find(function (oExtension) {
    //       return oVisibleExtension.extensionId === oExtension.id;
    //     });
    //   }
    // );
  }

  /**
   * Given a Patient Summary configuration, add the order property
   * @param   {object} piConfig PI config object
   */
  public addOrderToLanes(piConfig) {
    piConfig.lanes = piConfig.lanes.map((oLane, iLaneIndex) => {
      oLane.order = iLaneIndex;
      return oLane;
    });
  }

  /**
   * Given a Patient Summary configuration, add the order property to interactions' attributes
   * @param   {object} piConfig PI config object
   */
  public addOrderToInteractionAttributes(piConfig) {
    piConfig.lanes.forEach((lane) => {
      lane.interactions.forEach((interaction) => {
        interaction.attributes.forEach((attribute, index) => {
          // add the order property to the attributes
          if (!attribute.hasOwnProperty("order")) {
            attribute.order = index;
          }
        });
      });
    });
  }

  /**
   * formats old patient header (header and subheader) to the new format. This is to ensure old configs will still work
   * @param   {object} piConfig PV config to format
   */
  public formatPatientHeaderDetails(piConfig) {
    let converter = (header) => {
      // add a name to the interaction (tile)
      if (header.hasOwnProperty("pattern") && header.hasOwnProperty("values")) {
        if (
          header.pattern.match(/[{][0-9]*[}]+/g) &&
          header.values.length > 0
        ) {
          for (let i = 0; i < header.values.length; i++) {
            header.pattern = header.pattern.replace(
              "{" + i + "}",
              "{" + header.values[i] + "}"
            );
          }

          header.values = [];
        }
      }

      return header;
    };

    piConfig.masterdata.title = piConfig.masterdata.title.map(converter);
    piConfig.masterdata.details = piConfig.masterdata.details.map(converter);
  }

  /**
   * Formats a bare Patient Summary configuration with the necessary information for the admin UI.
   * @param   {object} oPSConfig  PI config object
   * @param   {object} oCDMConfig CDW config object
   * @param   {object} aExtensions Patient Summary Extensions
   * @returns {object} The modified input config object
   */
  public async formatAdminConfig(
    req,
    oPSConfig,
    oCDMConfig,
    aExtensions,
    lang
  ) {
    let oAdminPSConfig = JSON.parse(JSON.stringify(oPSConfig));
    this._achieveBackwardsCompatibility(oAdminPSConfig, oCDMConfig);
    this.addVisiblePropertyToConfig(oAdminPSConfig, true);
    this.addPlottablePropertyToConfig(oAdminPSConfig, oCDMConfig);
    this.expandConfig(oAdminPSConfig, oCDMConfig);
    // annotates grouped interactions and sets all attributes to not plottable and invisible
    this.formatGroupedInteractions(oAdminPSConfig, oCDMConfig, "lanes.*", lang);

    // TODO: Commented out due to PluginHandler being unavailable
    // this.updateConfigExtensions(req, oAdminPSConfig, aExtensions);

    // add names from cdw to pa
    this.addNamesToConfig(oAdminPSConfig, oCDMConfig);

    this.addOrderToLanes(oAdminPSConfig);
    this.addOrderToInteractionAttributes(oAdminPSConfig);
    this.addSupportedLanguages(oAdminPSConfig, oCDMConfig);
    this.formatPatientHeaderDetails(oAdminPSConfig);
    return oAdminPSConfig;
  }

  /**
   * Takes a cdwConfig and returns reformats it into master data and lane
   * data, to be used by the admin ui
   * @param   {object} cdwConfig the CDW configuration object to scan for interactions and attributes
   * @returns {object} new lane to be used as template.
   */
  public formatTemplateData(cdwConfig) {
    let masterdataAttributes = {};
    let aTitle = [
      {
        lang: "",
        value: "New Lane",
      },
    ];
    if (
      cdwConfig.advancedSettings &&
      Array.isArray(cdwConfig.advancedSettings.language)
    ) {
      let aLangTitles = cdwConfig.advancedSettings.language.map((sLang) => {
        return {
          lang: sLang,
          value: "",
        };
      });
      aTitle = aTitle.concat(aLangTitles);
    }

    let emptyLane = {
      laneId: "",
      title: aTitle,
      color: "LightOrange",
      visible: true,
      order: 0,
      initiallyFiltered: true,
      laneType: "InteractionLane",
      interactions: [],
    };

    let createInteraction = (cdwInteraction) => {
      // explicitly disable the CDM interaction "Genetic Variant". Not working/meaningful.
      if (
        this.interactionHasAnnotation(cdwInteraction, GEN_VARIANT_ANNOTATION)
      ) {
        return;
      }

      let piLaneInteraction = {
        source: cdwInteraction.path,
        modelName: this.getNameOfObjectInCdwConfig(
          cdwConfig,
          cdwInteraction.path
        ),
        visible: false,
        attributes: [],
      };

      let innerConfigWalkFunction = utils.getJsonWalkFunction(cdwConfig);
      let order = 0;
      innerConfigWalkFunction(cdwInteraction.path + ".attributes.*").forEach(
        (cdwInteractionAttribute, index) => {
          let oCDMAttrConfig = cdwInteractionAttribute.obj;
          // don't include measure attributes to the template. Not working/meaningful.
          let isAggrAttr =
            typeof oCDMAttrConfig.measureExpression === "string" &&
            oCDMAttrConfig.measureExpression !== "";
          if (isAggrAttr) {
            return;
          }

          let isNumerical = oCDMAttrConfig.type === "num";
          piLaneInteraction.attributes.push({
            source: cdwInteractionAttribute.path,
            modelName: this.getNameOfObjectInCdwConfig(
              cdwConfig,
              cdwInteractionAttribute.path
            ),
            formatter: {
              pattern:
                "{" +
                cdwInteractionAttribute.path.split(".attributes.")[1] +
                "}",
              values: [],
            },
            visible: false,
            numerical: isNumerical,
            plottable: isNumerical,
            order: order,
          });
          order += 1;
        }
      );
      emptyLane.interactions.push(piLaneInteraction);
    };

    let configWalkFunction = utils.getJsonWalkFunction(cdwConfig);
    let cdwInteractions = configWalkFunction("patient.interactions.*").concat(
      configWalkFunction("patient.conditions.*.interactions.*")
    );
    cdwInteractions.map(createInteraction);
    let cdwMasterPatientAttributes = configWalkFunction("patient.attributes.*");
    let filteredCDWMasterPatientAttributes = cdwMasterPatientAttributes.filter(
      (el) => {
        return !el.obj.hasOwnProperty("measureExpression");
      }
    );
    masterdataAttributes = filteredCDWMasterPatientAttributes.reduce(
      (oPrevious, cdwMasterAttribute) => {
        let key = cdwMasterAttribute.path.substring(
          cdwMasterAttribute.path.lastIndexOf(".") + 1
        );
        oPrevious[key] = {
          source: cdwMasterAttribute.path,
          key,
          modelName: this.getNameOfObjectInCdwConfig(
            cdwConfig,
            cdwMasterAttribute.path
          ),
        };
        return oPrevious;
      },
      {}
    );
    let oLaneTemplate = {
      masterdataAttributes,
      laneTemplate: emptyLane,
    };
    // annotates grouped interactions and sets all attributes to not plottable and invisible
    this.formatGroupedInteractions(
      oLaneTemplate,
      cdwConfig,
      "laneTemplate",
      true
    );
    return oLaneTemplate;
  }

  /**
   * Removes unnecessary parts of the configuration
   * @param   {object} config  PI config object
   * @param   {object} cdmConfig CDW config object
   * @returns {object} The modified input config object
   */
  public trimConfigForSaving(config, cdmConfig) {
    let piConfig = JSON.parse(JSON.stringify(config));
    let configWalkFunction = utils.getJsonWalkFunction(piConfig);

    configWalkFunction("lanes.*.interactions.*.modelName").forEach(
      (modelName) => {
        utils.deleteObjectByPath(piConfig, modelName.path);
      }
    );
    configWalkFunction("lanes.*.interactions.*.isGrouped").forEach(
      (isGroupedProperty) => {
        utils.deleteObjectByPath(piConfig, isGroupedProperty.path);
      }
    );

    configWalkFunction(
      "lanes.*.interactions.*.plottableAttrInputValue"
    ).forEach((plottableAttrInputValue) => {
      utils.deleteObjectByPath(piConfig, plottableAttrInputValue.path);
    });

    configWalkFunction(
      "lanes.*.interactions.*.allowedPlottableAttrDeleteButtonEnabled"
    ).forEach((allowedPlottableAttrDeleteButtonEnabled) => {
      utils.deleteObjectByPath(
        piConfig,
        allowedPlottableAttrDeleteButtonEnabled.path
      );
    });

    // format allowed plottable attributes, cleaned as list of strings
    piConfig.lanes.forEach(function (lane) {
      lane.interactions.forEach(function (interaction) {
        if (interaction.allowedPlottableAttr) {
          interaction.allowedPlottableAttr =
            interaction.allowedPlottableAttr.map((attribute) => {
              return attribute.hasOwnProperty("name")
                ? attribute.name
                : attribute;
            });
        }
      });
    });

    configWalkFunction("lanes.*.interactions.*.attributes.*.modelName").forEach(
      (modelName) => {
        utils.deleteObjectByPath(piConfig, modelName.path);
      }
    );

    configWalkFunction("lanes.*.interactions.*.attributes.*.numerical").forEach(
      (numerical) => {
        utils.deleteObjectByPath(piConfig, numerical.path);
      }
    );
    configWalkFunction("inspectorOptions.tabExtensions.*").forEach(
      (oTabExtension) => {
        utils.deleteObjectByPath(piConfig, oTabExtension.path + ".alias");
        utils.deleteObjectByPath(piConfig, oTabExtension.path + ".name");
      }
    );
    configWalkFunction("inspectorOptions.widgetExtensions.*").forEach(function (
      oWidgetExtension
    ) {
      utils.deleteObjectByPath(piConfig, oWidgetExtension.path + ".alias");
      utils.deleteObjectByPath(piConfig, oWidgetExtension.path + ".name");
    });

    // sort list by order property
    piConfig.lanes.sort((a, b) => {
      return a.order - b.order;
    });

    // remove order property from lanes
    configWalkFunction("lanes.*.order").forEach((orderProperty) => {
      utils.deleteObjectByPath(piConfig, orderProperty.path);
    });

    // sort interaction attributes by order property
    piConfig.lanes.forEach((lane) => {
      lane.interactions.forEach((interaction) => {
        interaction.attributes.sort((a, b) => {
          return a.order - b.order;
        });
      });
    });

    // remove order property from interaction attributes
    configWalkFunction("lanes.*.interactions.*.attributes.*.order").forEach(
      (orderProperty) => {
        utils.deleteObjectByPath(piConfig, orderProperty.path);
      }
    );

    // remove the title of the lane in the language for which the string is empty
    piConfig.lanes.forEach((oLane) => {
      let aNewTitle = [];
      for (let i = 0; i < oLane.title.length; i++) {
        // if it's the develop language or the string is not empty copy the value
        if (oLane.title[i].lang === "" || oLane.title[i].value) {
          aNewTitle.push(oLane.title[i]);
        }
      }
      oLane.title = aNewTitle;
    });

    this._achieveBackwardsCompatibility(piConfig, cdmConfig);
    return piConfig;
  }

  public loadFromFileResult(config) {
    let configResult = "";
    if (config.activated) {
      configResult += "Config successfully activated. \n\n";
      configResult += "ConfigDetails:\n";
      configResult += "\tConfig Id: " + config.meta.configId + "\n";
      configResult += "\tConfig Version: " + config.meta.configVersion + "\n";
    } else {
      configResult += "Failed to save the configuration. \n\n";
      config.errors.forEach((error) => {
        configResult +=
          "Error while validating path: " +
          (error.path || "configuration") +
          "\n";
        configResult +=
          "\t" +
          /*utils.formatErrorMessage(*/ error.messageDefault /*, error.values)*/ +
          "\n";
      });
    }

    return configResult;
  }
}
