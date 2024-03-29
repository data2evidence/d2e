// tslint:disable:max-classes-per-file
/**
 * @file Patient Summary Configuration Custom Validation Rules
 */

import {ruleValidator as rulesLib} from "@alp/alp-config-utils";
import RuleValidatorBase = rulesLib.RuleValidatorBase;

/**
 * Create a new RuleValidator for checking if a path exists in the given Config object.
 * @class
 * @param {object} dataSource Source config used to check paths
 * @param {string} [prefix]   Prefix to be added before the checked path
 */
export class PathExistsInConfig extends RuleValidatorBase {

    constructor(dataSource, public prefix = "") {
        super(dataSource);
        this.prefix = prefix || "";
    }

    /**
     * Check if the path is valid for the source config.
     * @param   {string} path Path
     * @returns {Array}  Array with true|false as only element describing the validity.
     */
    public selectObjects (path) {
        let cdwConfig = this.dataSource;
        let fullPath = this.prefix + path;
        let pathParts = fullPath.split(".");
        let valid = true;

        let obj = JSON.parse(JSON.stringify(cdwConfig));
        let i;
        for (i = 0; i < pathParts.length; i++) {
            if (obj.hasOwnProperty(pathParts[i])) {
                obj = obj[pathParts[i]];
            } else {
                valid = false;
                break;
            }
        }
        return [valid];
    }
}
/**
 * Create a new RuleValidator for checking if a value exists in a given list of values.
 * @class
 * @param {Array} dataSource List of values
 */
export class ValueIncludedInArray extends RuleValidatorBase {
    constructor (dataSource) {
        super(dataSource);
    }

    /**
     * Check if the value is included in the array.
     * @param   {string} value Value
     * @returns {Array}  Array with true|false as only element describing the validity.
     */
    public selectObjects(value) {
        return [this.dataSource.indexOf(value) !== -1];
    }
}

/**
 * Create a new RuleValidator for checking if a list of numbers is a sequential series.
 * @class
 * @param {Array} dataSource List of values
 * @param {string} startingValue starting value of the series
 */
export class NumbersAreSequential extends RuleValidatorBase {

    constructor (dataSource, public startingValue) {
        super(dataSource);
        this.startingValue = startingValue || 0;
    };

    /**
     * Check if a list of numbers is a sequential series.
     * @param   {string} listOfNumbers List of numbers to be checked.
     * @returns {Array}  Array with true|false as only element describing the validity.
     */
    public selectObjects (listOfNumbers) {
        if (!Array.isArray(listOfNumbers)) {
            return [false];
        }
        let valid = true;
        for (let i = this.startingValue; i < listOfNumbers.length + this.startingValue; i++) {
            if (listOfNumbers.indexOf(i) === -1) {
                valid = false;
            }
        }

        return [valid];
    }

}

export class AtLeastOneChild extends RuleValidatorBase {
    constructor (dataSource) {
        super(dataSource);
    }

    public selectObjects (parentObj) {
        // Test whether the parent object is not empty
        for (var key in parentObj) {
            // test for defined key (keys are always strings, for array and object)
            if (key) {
                return [true];
            }
        }
        return [false];
    }
}

export class PatternPlaceholderExistsInConfig extends RuleValidatorBase {
    public checker;
    constructor (dataSource, public prefix) {
        super(dataSource);
        this.prefix = prefix || "";
        this.checker = new PathExistsInConfig(dataSource, prefix);
    };

    public selectObjects(config) {
        let valid = true;
        if (!config || !config.pattern) {
            return [valid];
        }
        let placeholderList = config.pattern.match(/[^{\}]+(?=})/g);
        let that = this;
        if (!placeholderList) {
            // no placeholders in pattern
            return [valid];
        }
        for (let i = 0; i < placeholderList.length; i++) {
            if (!that.checker.selectObjects(placeholderList[i])[0]) {
                valid = false;
                break;
            }
        }

        return [valid];
    }

}

export class ValidAttributeFormatter extends RuleValidatorBase {

    constructor (dataSource) {
        super(dataSource);
    }

    public selectObjects (oAttribute) {
        let valid = true;

        if (oAttribute.source && oAttribute.formatter && oAttribute.formatter.pattern) {
            let prefix = oAttribute.source.split(".attributes.")[0] + ".attributes.";
            let checker = new PatternPlaceholderExistsInConfig(this.dataSource, prefix);
            return checker.selectObjects(oAttribute.formatter);
        }

        return [valid];
    }
}
