import './polyfills/array/from.js';
import './polyfills/array/includes.js';

/**
 * @param {String} name
 *
 * @returns {Boolean}
 */
function valid(name) {
  // TODO: validate against options dictionary
    return name.indexOf('smartbanner:') !== -1 && name.split(':')[1].length > 0;
}

/**
 * @param {String} name
 *
 * @returns {String}
 */
function convertToCamelCase(name) {
    let parts = name.split('-');
    parts.map(function(part, index) {
        if (index > 0) {
            parts[index] = part.charAt(0).toUpperCase() + part.substring(1);
        }
    });
    return parts.join('');
}

export default class OptionParser {

    /**
     *
     * @returns {Object}
     */
    parse() {
        let metas = document.getElementsByTagName('meta');
        let options = {};
        let optionName = null;
        Array.from(metas).forEach(function(meta) {
            let name = meta.getAttribute('name');
            let content = meta.getAttribute('content');
            if (name && content && valid(name)) {
                optionName = name.split(':')[1];
                if (Array.from(optionName).includes('-')) {
                    optionName = convertToCamelCase(optionName);
                }
                options[optionName] = content;
            }
        });
        return options;
    }

}
