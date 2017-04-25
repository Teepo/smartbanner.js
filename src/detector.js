export default class Detector {

    /**
     *
     * @returns {String}
     */
    static platform() {
        if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
            return 'ios';
        } else if (/Android/i.test(window.navigator.userAgent)) {
            return 'android';
        }
    }

    /**
     * @param {String} regexString
     *
     * @returns {Boolean}
     */
    static userAgentMatchesRegex(regexString) {
        return new RegExp(regexString).test(window.navigator.userAgent);
    }

    /**
     *
     * @returns {Boolean}
     */
    static jQueryMobilePage() {
        return typeof global.$ !== 'undefined' && global.$.mobile !== 'undefined' && document.querySelector('.ui-page') !== null;
    }

    /**
     *
     * @returns {HTMLElement}
     */
    static wrapperElement() {
        let selector = Detector.jQueryMobilePage() ? '.ui-page' : 'html';
        return document.querySelectorAll(selector);
    }

}
