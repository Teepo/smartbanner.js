import OptionParser from './optionparser.js';
import Detector     from './detector.js';
import Bakery       from './bakery.js';

const DEFAULT_PLATFORMS = 'android,ios';

let datas = {
    originalTop: 'data-smartbanner-original-top',
    originalMarginTop: 'data-smartbanner-original-margin-top'
};

function handleExitClick(event, self) {
    self.exit();
    event.preventDefault();
}

function handleJQueryMobilePageLoad(event) {

    if (!this.positioningDisabled)
        setContentPosition(event.data.height);
}

function addEventListeners(self) {

    let closeIcon = document.querySelector('.js_smartbanner__exit');

    closeIcon.addEventListener('click', (event) => handleExitClick(event, self));

    if (Detector.jQueryMobilePage())
        $(document).on('pagebeforeshow', self, handleJQueryMobilePageLoad);

}

function removeEventListeners() {

    if (Detector.jQueryMobilePage())
        $(document).off('pagebeforeshow', handleJQueryMobilePageLoad);
}

function setContentPosition(value) {

    let wrappers = Detector.wrapperElement();

    for (let i = 0, l = wrappers.length, wrapper; i < l; i++)
    {
        wrapper = wrappers[i];

        if (Detector.jQueryMobilePage())
        {

            if (wrapper.getAttribute(datas.originalTop))
                continue;

            let top = parseFloat(getComputedStyle(wrapper).top);
            wrapper.setAttribute(datas.originalTop, isNaN(top) ? 0 : top);
            wrapper.style.top = value + 'px';

        } else {

            if (wrapper.getAttribute(datas.originalMarginTop))
                continue;

            let margin = parseFloat(getComputedStyle(wrapper).marginTop);

            wrapper.setAttribute(datas.originalMarginTop, isNaN(margin) ? 0 : margin);
            wrapper.style.marginTop = value + 'px';
        }
    }
}

function restoreContentPosition() {

    let wrappers = Detector.wrapperElement();

    for (let i = 0, l = wrappers.length, wrapper; i < l; i++)
    {
        wrapper = wrappers[i];

        if (Detector.jQueryMobilePage() && wrapper.getAttribute(datas.originalTop))
            wrapper.style.top = wrapper.getAttribute(datas.originalTop) + 'px';
        else if (wrapper.getAttribute(datas.originalMarginTop))
            wrapper.style.marginTop = wrapper.getAttribute(datas.originalMarginTop) + 'px';
    }
}

export default class SmartBanner {

    /**
     * @param {Object} options
     *
     */
    constructor(options) {

        if (!options)
        {
            let parser = new OptionParser();
            this.options = parser.parse();
        }
        else
        {
            this.options = options;
        }

        this.platform = Detector.platform();
    }


    /**
     * @static
     * @deprecated
     *
     * @returns {Number}
     */
    get originalTop() {
        const wrapper = Detector.wrapperElement()[0];
        return parseFloat(wrapper.getAttribute(datas.originalTop));
    }

  /**
   * @static
   * @deprecated
   *
   * @returns {Number}
   */
    get originalTopMargin() {
        const wrapper = Detector.wrapperElement()[0];
        return parseFloat(wrapper.getAttribute(datas.originalMarginTop));
    }

    /**
     * @static
     *
     * @returns {String}
     */
    get priceSuffix() {
        if (this.platform === 'ios')
            return this.options.priceSuffixApple;
        else if (this.platform === 'android')
            return this.options.priceSuffixGoogle;
        return '';
    }

    /**
     * @static
     *
     * @returns {String}
     */
    get icon() {
        if (this.platform === 'android')
            return this.options.iconGoogle;
        else
            return this.options.iconApple;
    }

    /**
     * @static
     *
     * @returns {String}
     */
    get buttonUrl() {
        if (this.platform === 'android')
            return this.options.buttonUrlGoogle;
        else if (this.platform === 'ios')
            return this.options.buttonUrlApple;
        return '#';
    }

    /**
     * @static
     *
     * @returns {String}
     */
    get html() {
        return `<div class="smartbanner smartbanner--${this.platform} js_smartbanner">
      <a href="javascript:void();" class="smartbanner__exit js_smartbanner__exit"></a>
      <div class="smartbanner__icon" style="background-image: url(${this.icon});"></div>
      <div class="smartbanner__info">
        <div>
          <div class="smartbanner__info__title">${this.options.title}</div>
          <div class="smartbanner__info__author">${this.options.author}</div>
          <div class="smartbanner__info__price">${this.options.price}${this.priceSuffix}</div>
        </div>
      </div>
      <a href="${this.buttonUrl}" target="_blank" class="smartbanner__button"><span class="smartbanner__button__label">${this.options.button}</span></a>
    </div>`;
    }

    /**
     * @static
     *
     * @returns {Number}
     */
    get height() {
        const height = document.querySelector('.js_smartbanner').offsetHeight;
        return height !== undefined ? height : 0;
    }

    /**
     * @static
     *
     * @returns {Boolean}
     */
    get platformEnabled() {
        let enabledPlatforms = this.options.enabledPlatforms || DEFAULT_PLATFORMS;
        return enabledPlatforms && enabledPlatforms.replace(/\s+/g, '').split(',').indexOf(this.platform) !== -1;
    }

    /**
     * @static
     *
     * @returns {Boolean}
     */
    get positioningDisabled() {
        return this.options.disablePositioning === 'true';
    }

    /**
     * @static
     *
     * @returns {Boolean}
     */
    get userAgentExcluded() {

        if (!this.options.excludeUserAgentRegex)
            return false;

        return Detector.userAgentMatchesRegex(this.options.excludeUserAgentRegex);
    }

    /**
     * @static
     *
     * @returns {Boolean}
     */
    get userAgentIncluded() {

        if (!this.options.includeUserAgentRegex)
            return false;

        return Detector.userAgentMatchesRegex(this.options.includeUserAgentRegex);
    }

    /**
     * @static
     *
     * @returns {Boolean}
     */
    get disabledAtDisplay() {

        if (this.options.disabledAtDisplay)
            return this.options.disabledAtDisplay;

        return false;
    }


    /**
     * @static
     *
     * @returns {Number}
     */
    get expirationDay() {

        if (!this.options.expirationDay)
            return false;

        return this.options.expirationDay;
    }

    publish() {

        if (Object.keys(this.options).length === 0)
            throw new Error('No options detected. Please consult documentation.');


        if (Bakery.baked)
            return false;

        // User Agent was explicetely excluded by defined excludeUserAgentRegex
        if (this.userAgentExcluded)
            return false;


        // User agent was neither included by platformEnabled,
        // nor by defined includeUserAgentRegex
        if (!(this.platformEnabled || this.userAgentIncluded))
            return false;

        const bannerDiv = document.createElement('div');
        document.querySelector('body').appendChild(bannerDiv);
        bannerDiv.outerHTML = this.html;

        if (this.options.disabledAtDisplay)
            Bakery.bake(this.options.days);

        if (!this.positioningDisabled)
            setContentPosition(this.height);

        addEventListeners(this);
    }

    exit() {
        removeEventListeners();

        if (!this.positioningDisabled)
            restoreContentPosition();

        const banner = document.querySelector('.js_smartbanner');

        document.querySelector('body').removeChild(banner);

        Bakery.bake(this.options.expirationDay);
    }
}
