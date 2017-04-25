export default class Bakery {

    /**
     * @param {Number} days
     *
     */
    static bake(days = 30) {
        document.cookie = 'smartbanner_exited=1; expires=' + Bakery.getExpireDate(days) + ';';
    }

    static unbake() {
        document.cookie = 'smartbanner_exited=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    /**
     *
     * @returns {Boolean}
     */
    static get baked() {
        let value = document.cookie.replace(/(?:(?:^|.*;\s*)smartbanner_exited\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        return value === '1';
    }

    /**
     * @params {Number} days
     *
     * @returns {Date}
     */
    static getExpireDate(days) {

        const date = new Date();

        // convert days to miliseconds.
        let ms = days * 24 * 60 * 60 *1000;

        date.setTime(date.getTime() + ms);

        return date;
    }
}
