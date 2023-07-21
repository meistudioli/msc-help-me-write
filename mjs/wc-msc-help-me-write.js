import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import {
  colorPalette as _fujiColorPalette,
  buttons as _fujiButtons
} from './fuji-css.js';
import Mustache from './mustache.js';

const defaults = {
  l10n: {
    title: 'Assistant',
    apply: 'Apply',
    applied: 'Applied',
    applyAll: 'Apply All'
  },
  webservice: {
    url: '/',
    params: {},
    headers: {},
    method: 'POST',
    withCredentials: false,
    timeout: 30 * 1000 // ms
  }
};

const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = ['l10n', 'webservice'];
const custumEvents = {
  apply: 'msc-help-me-write-apply',
  error: 'msc-help-me-write-error',
  cancel: 'msc-help-me-write-cancel'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}
${_fujiColorPalette}
${_fujiButtons}

:host{position:relative;inline-size:fit-content;block-size:fit-content;display:block;outline:0 none;}
.main {
  --inline-size-normal: var(--msc-help-me-write-trigger-size, 48px);
  --inline-size-active: var(--msc-help-me-write-window-inline-size, 360px);
  --inlne-size: var(--inline-size-normal);

  --block-size-normal: var(--inline-size-normal);
  --block-size-active: var(--msc-help-me-write-window-block-size, 50dvh);
  --block-size: var(--block-size-normal);

  --border-radius-normal: var(--inline-size-normal);
  --border-radius-active: var(--msc-help-me-write-window-border-radius, 1em);
  --border-radius: var(--border-radius-normal);

  --opacity-normal: 0;
  --opacity-active: 1;
  --opacity: var(--opacity-normal);

  --duration: var(--msc-help-me-write-transition-duration, 450ms);
  --shadow-color: var(--msc-help-me-write-shadow-color-rgb, 0 0 0);
  --shadow: 0 0 1px rgba(var(--shadow-color) / .1), 0 2px 4px rgba(var(--shadow-color) / .08);

  /* trigger */
  --trigger-opacity-normal: 1;
  --trigger-opacity-active: 0;
  --trigger-opacity: var(--trigger-opacity-normal);
  --trigger-pointer-events: auto;
  --trigger-icon: path('M7.2,13.2c0-1.5-0.5-2.8-1.6-3.8C4.6,8.3,3.3,7.8,1.8,7.8c1.5,0,2.8-0.5,3.8-1.6c1.1-1.1,1.6-2.3,1.6-3.8 c0,1.5,0.5,2.8,1.6,3.8c1.1,1.1,2.3,1.6,3.8,1.6c-1.5,0-2.8,0.5-3.8,1.6C7.7,10.4,7.2,11.7,7.2,13.2z M7.2,19.8h1.3l9.4-9.4 l-0.7-0.7l-0.6-0.6l-9.4,9.4V19.8z M5.4,21.6v-3.8L17.9,5.3c0.4-0.4,0.8-0.5,1.3-0.5s0.9,0.2,1.3,0.5l1.3,1.3 c0.4,0.4,0.5,0.8,0.5,1.3s-0.2,0.9-0.5,1.3L9.2,21.6H5.4z M20.4,7.8l-1.3-1.2L20.4,7.8z M17.9,10.4l-0.7-0.7l-0.6-0.6L17.9,10.4z');
  --scale-ratio: var(--msc-help-me-write-trigger-icon-scale, 1);

  /* win */
  --win-sbuject-bgc: var(--msc-help-me-write-window-subject-bgc, rgba(var(--grey-hair)));
  --win-sbuject-color: var(--msc-help-me-write-window-subject-color, rgba(var(--batcave)));
  --win-header-block-size: 48px;
  --win-padding: var(--msc-help-me-write-window-padding, 12px);
  --win-background-color: var(--msc-help-me-write-window-bgc, rgba(255 255 255));
  --win-content-block-size: calc(100% - var(--win-header-block-size));
  --mask-size: 1em;
  --win-content-mask: linear-gradient(to bottom,transparent 0%,black calc(0% + var(--mask-size)),black calc(100% - var(--mask-size)),transparent 100%);
  --win-pointer-events: none;
  --cancel-size: 36px;
  --cancel-display: none;
  --cancel-color: var(--msc-help-me-write-window-cancel-color, #5f6368);
  --cancel-overlay: var(--msc-help-me-write-window-cancel-overlay-color-rgb, 224 228 233);
  --win-last-child-gap: calc(var(--mask-size) / 2);
  --win-border-color: var(--msc-help-me-write-window-border-color, transparent);

  /* scroll */
  --scrollbar-inline-size: 2px;
  --scrollbar-block-size: 2px;
  --scrollbar-background: transparent;
  --scrollbar-thumb-color: var(--msc-help-me-write-scrollbar-thumb-color, rgba(0 0 0/.2));

  /* result-set */
  --result-set--padding-inline-end: calc(var(--scrollbar-inline-size) + 8px);
  --result-set--padding-inline: calc(28px + 4px) var(--result-set--padding-inline-end);
  --icon-support-agent: path('M11,21v-2h8v-7.1c0-1-0.2-1.9-0.6-2.7C18.1,8.4,17.6,7.6,17,7c-0.6-0.6-1.4-1.1-2.2-1.5C13.9,5.1,13,4.9,12,4.9 s-1.9,0.2-2.7,0.5S7.7,6.3,7.1,7S5.9,8.4,5.6,9.2C5.2,10.1,5,11,5,11.9V18H4c-0.5,0-1-0.2-1.4-0.6S2,16.6,2,16v-2 c0-0.4,0.1-0.7,0.3-1c0.2-0.3,0.4-0.5,0.7-0.7L3.1,11c0.1-1.2,0.5-2.3,1-3.3s1.2-1.8,2-2.5C7,4.5,7.9,4,8.9,3.6S10.9,3,12,3 c1.1,0,2.2,0.2,3.2,0.6s1.9,0.9,2.7,1.6c0.8,0.7,1.5,1.5,2,2.5c0.5,1,0.9,2.1,1,3.3l0.1,1.3c0.3,0.1,0.5,0.4,0.7,0.7 c0.2,0.3,0.3,0.6,0.3,1v2.3c0,0.4-0.1,0.7-0.3,1c-0.2,0.3-0.4,0.5-0.7,0.6V19c0,0.5-0.2,1-0.6,1.4C20,20.8,19.6,21,19,21H11z M9,14 c-0.3,0-0.5-0.1-0.7-0.3C8.1,13.6,8,13.3,8,13s0.1-0.5,0.3-0.7C8.5,12.1,8.7,12,9,12c0.3,0,0.5,0.1,0.7,0.3C9.9,12.5,10,12.7,10,13 s-0.1,0.5-0.3,0.7C9.5,13.9,9.3,14,9,14z M15,14c-0.3,0-0.5-0.1-0.7-0.3C14.1,13.6,14,13.3,14,13s0.1-0.5,0.3-0.7 c0.2-0.2,0.4-0.3,0.7-0.3s0.5,0.1,0.7,0.3c0.2,0.2,0.3,0.4,0.3,0.7s-0.1,0.5-0.3,0.7C15.5,13.9,15.3,14,15,14z M6,12.5 c-0.1-1,0.1-1.9,0.4-2.7c0.3-0.8,0.8-1.5,1.4-2s1.2-1,2-1.3C10.6,6.2,11.3,6,12.1,6c1.5,0,2.8,0.5,3.9,1.4s1.8,2.2,2,3.6 c-1.6,0-3-0.4-4.2-1.3s-2.2-1.9-2.9-3.2c-0.3,1.3-0.8,2.5-1.7,3.6S7.3,12,6,12.5z');
  --result-set-gap: 4em;
  --result-set-line-color: var(--msc-help-me-write-divide-line-color, rgba(0 0 0/.15));
  --result-set-title-color: var(--msc-help-me-write-result-title-color, rgba(var(--batcave)));
  --result-set-content-color: var(--msc-help-me-write-result-content-color, rgba(var(--battleship)));
  --result-set-content-bgc: var(--msc-help-me-write-result-content-bgc, rgba(var(--marshmallow)));
  --result-set-apply-color: var(--msc-help-me-write-result-apply-color, rgba(var(--dory)));
  --result-set-agent-color: var(--msc-help-me-write-result-agent-color, rgba(var(--cheetos)));
  --result-set-border-color: var(--msc-help-me-write-result-content-border-color, rgba(0 0 0/.1));

  /* apply-all */
  --apply-all-gap: 1em;
  --apply-all-inline-size: calc(100% - var(--result-set--padding-inline-end) * 2 - var(--win-padding) * 2);
  --apply-all-inset-inline-start: calc(var(--win-padding) + var(--win-padding));
  --apply-all-display: none;
}
.main{position:relative;outline:0 none;}
.main[data-mode='process'] .trigger::before{animation:smart-draft-gradient 2100ms infinite linear;}
.main[data-mode='process'] {
  --trigger-pointer-events: none;
}

.main[data-mode='active'] {
  --inlne-size: var(--inline-size-active);
  --block-size: var(--block-size-active);
  --border-radius: var(--border-radius-active);
  --opacity: var(--opacity-active);

  --trigger-opacity: var(--trigger-opacity-active);
  --win-pointer-events: auto;
  --cancel-display: block;
}

.trigger{position:absolute;font-size:inherit;inline-size:var(--inline-size-normal);block-size:var(--block-size-normal);border-radius:var(--border-radius-normal);background-color:rgba(255 255 255);appearance:none;border:0 none;overflow:hidden;color:transparent;display:block;padding:0;margin:0;box-shadow:none;transition:opacity 300ms var(--transition-timing-function);opacity:var(--trigger-opacity);pointer-events:var(--trigger-pointer-events);outline:0 none;box-shadow:var(--shadow);}
.trigger::before{position:absolute;inset-inline-start:0;inset-block-start:0;content:'';inline-size:100%;aspect-ratio:1/1;background:linear-gradient(135deg,#d3e3fd,#d0f8ff,#a8c7fa,#99f0ff,#d3e3fd,#d3e3fd,#d0f8ff,#a8c7fa,#99f0ff,#d3e3fd);background-size:800% 800%;display:block;}
.trigger::after{position:absolute;inset-inline-start:50%;inset-block-start:50%;content:'';inline-size:1.5em;aspect-ratio:1/1;clip-path:var(--trigger-icon);background-color:rgba(0 0 0);display:block;transform:translate(-50%,-50%) scale(var(--scale-ratio));}
.trigger:active{scale:.9;}
.trigger[data-quadrant='1']{inset-inline-end:0;inset-block-start:0;}
.trigger[data-quadrant='2']{inset-inline-start:0;inset-block-start:0;}
.trigger[data-quadrant='3']{inset-inline-start:0;inset-block-end:0;}
.trigger[data-quadrant='4']{inset-inline-end:0;inset-block-end:0;}

.win{border:1px solid var(--win-border-color);background-color:var(--win-background-color);inline-size:var(--inlne-size);block-size:var(--block-size);border-radius:var(--border-radius);opacity:var(--opacity);will-change:inline-size,block-size,border-radius,opacity;transition:inline-size var(--duration) var(--transition-timing-function),block-size var(--duration) var(--transition-timing-function),border-radius var(--duration) var(--transition-timing-function),opacity var(--duration) var(--transition-timing-function);overflow:hidden;pointer-events:var(--win-pointer-events);box-shadow:var(--shadow);}
.win__subject{font-size:1.125em;color:var(--win-sbuject-color);block-size:var(--win-header-block-size);line-height:var(--win-header-block-size);background-color:var(--win-sbuject-bgc);padding-inline:var(--win-padding);letter-spacing:1px;}
.win__content{inline-size:calc(100% - var(--win-padding) * 2);block-size:calc(var(--win-content-block-size) - var(--win-padding) * 2);margin:var(--win-padding);mask-image:var(--win-content-mask);-webkit-mask-image:var(--win-content-mask);}

.win__content{--scrollbar-thumb:var(--scrollbar-thumb-color);}
.win__content::-webkit-scrollbar{inline-size:var(--scrollbar-inline-size);block-size:var(--scrollbar-block-size);}
.win__content::-webkit-scrollbar-track{background:var(--scrollbar-background);}
.win__content::-webkit-scrollbar-thumb{border-radius:var(--scrollbar-block-size);background:var(--scrollbar-thumb);}

.win__cancel {
  --background-opacity-normal: 0;
  --background-opacity-active: 1;
  --background-opacity: var(--background-opacity-normal);
  --background: rgba(var(--cancel-overlay)/var(--background-opacity));
  --close-color: var(--cancel-color);
  --close-mask: path('M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
}
.win__cancel{position:absolute;inset-inline-end:12px;inset-block-start:6px;font-size:0;color:transparent;inline-size:var(--cancel-size);aspect-ratio:1/1;border-radius:var(--cancel-size);background-color:var(--background);appearance:none;border:0 none;outline:0 none;transition:background-color 200ms ease;will-change:background-color;z-index:1;display:var(--cancel-display);}
.win__cancel::before{position:absolute;inset-inline:0 0;inset-block:0 0;margin:auto;inline-size:24px;block-size:24px;content:'';background-color:var(--close-color);clip-path:var(--close-mask);}
.win__cancel:active{scale:.8;}
.win__cancel:focus {
  --background-opacity: var(--background-opacity-active);
}

.result-set{position:relative;padding-inline:var(--result-set--padding-inline);}
.result-set::before{position:absolute;inset-inline-start:0;inset-block-start:0;inline-size:1.5em;aspect-ratio:1/1;content:'';display:block;clip-path:var(--icon-support-agent);background-color:var(--result-set-agent-color);scale:1.167;}
.result-set>*+*{margin-block-start:.75em;}
.result-set__head{color:var(--result-set-title-color);line-height:1.3;letter-spacing:1px;padding-block-start:.1625em;}
.result-set__body{color:var(--result-set-content-color);background-color:var(--result-set-content-bgc);border-radius:.5em;border:1px solid var(--result-set-border-color);padding:.75em;letter-spacing:.5px;}
.result-set__func{display:flex;flex-direction:row-reverse;margin-block-start:1em;padding-inline-end:4px;}
.result-set__func .buttons[data-type='secondary1'] {
  --default-text-color: var(--result-set-apply-color);
}

:nth-child(1 of .result-set){margin-block-start:calc(var(--mask-size) / 2);}
:nth-last-child(1 of .result-set){margin-block-end:var(--win-last-child-gap);}
:nth-child(n+2 of .result-set){margin-block-start:var(--result-set-gap);}
:nth-child(n+2 of .result-set)::after{position:absolute;inset-inline-start:.5em;inset-block-start:calc(var(--result-set-gap)/2 * -1);background-color:var(--result-set-line-color);content:'';inline-size:calc(100% - 1em);block-size:1px;display:block;}

/* win__apply-all */
.win__apply-all{position:sticky;inset-inline-start:var(--apply-all-inset-inline-start);inset-block-end:var(--win-padding);inline-size:var(--apply-all-inline-size);padding-block:var(--apply-all-gap);display:var(--apply-all-display);}
.win__apply-all{backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border-block-start:1px solid var(--result-set-line-color);z-index:1;}
.win__apply-all .buttons[data-type='primary'] {
  --default-background-color: var(--result-set-apply-color);
  inline-size: 100%;
}
.win:has(:nth-child(2 of .result-set)) {
  --win-last-child-gap: calc(70px + var(--mask-size));
  --apply-all-display: block;
}

@keyframes smart-draft-gradient {
  0% { background-position:bottom right; }
  to { background-position:top 37.5% left 37.5%; }
}

@media (hover: hover) {
  .trigger:hover::before {
    animation: smart-draft-gradient 2100ms infinite linear;
  }

  .win__cancel:hover {
    --background-opacity: var(--background-opacity-active);
  }
}
</style>

<div class="main" data-mode="normal" ontouchstart="">
  <button type="button" class="trigger" data-quadrant="4" title="help me write">trigger</button>
  <div class="win">
    <button type="button" class="win__cancel">cancel</button>
    <p class="win__subject"></p>
    <div class="win__content overscrolling"></div>

    <div class="win__apply-all">
      <button
        type="button"
        class="buttons"
        data-type="primary"
        data-size="large"
      >
        ${defaults.l10n.applyAll}
      </button>
    </div>
  </div>
</div>
`;

const templateUnit = document.createElement('template');
templateUnit.innerHTML = `
{{#units}}
<div class="result-set" data-order="{{help-me-write-serial-no}}">
  <p class="result-set__head">{{title}}</p>
  <div class="result-set__body">{{{content}}}</div>
  <div class="result-set__func">
    <button
      type="button"
      class="buttons"
      data-type="secondary1"
      data-size="small"
    >
      {{apply}}
    </button> 
  </div>
</div>
{{/units}}
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-help-me-write-trigger-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '48px'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-inline-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '360px'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-block-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '50dvh'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-border-radius',
      syntax: '<length>',
      inherits: true,
      initialValue: '16px'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-transition-duration',
      syntax: '<time>',
      inherits: true,
      initialValue: '450ms'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-padding',
      syntax: '<length>',
      inherits: true,
      initialValue: '12px'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-bgc',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-scrollbar-thumb-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 0 0/.2)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-divide-line-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 0 0/.15)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-title-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-content-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(91 99 106)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-content-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 0 0/.1)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-apply-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(15 105 255)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-agent-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(253 97 0)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-subject-bgc',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(240 243 245)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-subject-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-cancel-color',
      syntax: '<color>',
      inherits: true,
      initialValue: '#5f6368'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-window-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'transparent'
    });

    CSS.registerProperty({
      name: '--msc-help-me-write-result-content-bgc',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(245 248 250)'
    });
    
  } catch(err) {
    console.warn(`msc-help-me-write: ${err.message}`);
  }
}

export class MscHelpMeWrite extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      previousParams: {},
      units: []
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      subject: this.shadowRoot.querySelector('.win__subject'),
      trigger: this.shadowRoot.querySelector('.trigger'),
      win: this.shadowRoot.querySelector('.win__content'),
      btnApplyAll: this.shadowRoot.querySelector('.win__apply-all .buttons'),
      btnCancel: this.shadowRoot.querySelector('.win__cancel')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscHelpMeWrite(config)
    };

    // evts
    this._onQuery = this._onQuery.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onApply = this._onApply.bind(this);
    this._onApplyAll = this._onApplyAll.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.trigger.addEventListener('click', this._onQuery, { signal });
    this.#nodes.btnCancel.addEventListener('click', this._onCancel, { signal });
    this.#nodes.btnApplyAll.addEventListener('click', this._onApplyAll, { signal });
    this.#nodes.win.addEventListener('click', this._onApply, { signal });
    window.addEventListener('resize', this._onResize, { signal });

    this.refresh();
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'l10n':
          this.#config[attrName] = {
            ...defaults[attrName],
            ...JSON.parse(newValue)
          };
          break;

        case 'webservice': {
          let values;
          
          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = { ...defaults[attrName] };
          }

          // webservice.timeout
          if (attrName === 'webservice') {
            let timeout = +values.timeout;
            if (isNaN(timeout) || timeout <= 0) {
              timeout = defaults.webservice.timeout;
            }
            values.timeout = timeout;
          }

          this.#config[attrName] = values;
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscHelpMeWrite.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'l10n':
        this.#nodes.subject.textContent = this.l10n.title;
        this.#nodes.btnApplyAll.textContent = this.l10n.applyAll; 
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscHelpMeWrite.observedAttributes
  }

  #upgradeProperty(prop) {
    let value;

    if (MscHelpMeWrite.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set webservice(value) {
    if (value) {
      const newValue = {
        ...defaults.webservice,
        ...this.webservice,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('webservice', JSON.stringify(newValue));
    } else {
      this.removeAttribute('webservice');
    }
  }

  get webservice() {
    return this.#config.webservice;
  }

  set l10n(value) {
    if (value) {
      const newValue = {
        ...this.l10n,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('l10n', JSON.stringify(newValue));
    } else {
      this.removeAttribute('l10n');
    }
  }

  get l10n() {
    return this.#config.l10n;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  #render() {
    const { main, win } = this.#nodes;

    win.replaceChildren();

    const applyText = this.l10n.apply;
    const units = this.#data.units.map(
      (unit, idx) => {
        return {
          ...unit,
          apply: applyText,
          'help-me-write-serial-no': idx
        };
      }
    );

    const templateString = Mustache.render(templateUnit.innerHTML, { units });
    win.insertAdjacentHTML('beforeend', templateString);

    this.refresh();
    main.dataset.mode = this.#data.units.length ? 'active' : 'normal';
  }

  async #fetch(params = { ...this.webservice.params }) {
    let data = [];

    if (Object.keys(params).length > 0 && _wcl.isObjectsEqual(params, this.#data.previousParams)) {
      return [ ...this.#data.units ];
    }

    try {
      const { url, headers, method, withCredentials, timeout } = this.webservice;
      const signal = _wcl.prepareFetch(timeout);
      const base = !/^http(s)?:\/\/.*/.test(url) ? window.location.origin : undefined;

      const fetchUrl = new URL(url, base);
      const options = {
        ...(Object.keys(headers) > 0 && { headers:{ ...headers } }),
        credentials: withCredentials ? 'include' : 'same-origin',
        method: method.toUpperCase(),
        mode: 'cors',
        signal
      };

      // params
      if (/post/i.test(method)) {
        const formData = new FormData();

        Object.keys(params).forEach(
          (key) => {
            formData.set(key, params[key]);
          }
        );
        options.body = formData;
      } else {
        Object.keys(params).forEach(
          (key) => {
            fetchUrl.searchParams.set(key, params[key]);
          }
        );
      }

      /*
       * api response format, each unit should have "title" and "content".
       * --------------------
       * {
       *   "units": [
       *     {
       * 
       *       "title": "xxxxx",
       *       "content": "xxxxx"
       *       ...
       *     },
       *     {
       *       "title": "xxxxx",
       *       "content": "xxxxx"
       *       ...
       *     },
       *     ...
       *   ]
       * }
       }
       */

      const response = await fetch(
        fetchUrl.toString(),
        options
      )
        .then(
          async (response) => {
            if (!response.ok) {
              throw new Error('Network response was not OK.', {
                cause: await response.json()
              });
            }

            return response.json();
          }
        );

      const { units = [] } = response;
      data = units.filter(
        ({ title, content }) => {
          return title && content;
        }
      );

      this.#data.previousParams = { ...params };
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
      const cause = (typeof err.cause !== 'undefined') ? err.cause : undefined;

      this.#fireEvent(custumEvents.error, {
        message:err.message,
        ...(cause && { cause })
      });
    }

    return data;
  }

  _onCancel() {
    this.#nodes.main.dataset.mode = 'normal';
    this.#fireEvent(custumEvents.cancel);
  }

  _onQuery() {
    this.query(this.webservice.params);
  }

  _onApplyAll() {
    Array.from(this.#nodes.win.querySelectorAll('.buttons')).forEach(
      (button) => {
        button.click();
      }
    );
  }

  _onApply(evt) {
    const button = evt.target.closest('button');

    if (!button) {
      return;
    }

    const resultSet = evt.target.closest('.result-set');
    const order = +resultSet.dataset.order;

    button.textContent = this.l10n.applied;
    button.inert = true;
    this.#fireEvent(custumEvents.apply, { ...this.#data.units[order] });

    if (Array.from(this.#nodes.win.querySelectorAll('button[inert]')).length === this.#data.units.length) {
      this.#nodes.btnCancel.click();
    }
  }

  _onResize() {
    this.refresh();
  }

  async query(params = {}) {
    const { main } = this.#nodes;

    main.dataset.mode = 'process';

    this.#data.units = await this.#fetch(params);
    this.#render();
  }

  refresh() {
    const { trigger } = this.#nodes;
    const { x, y } = trigger.getBoundingClientRect();
    const { width:vw, height:vh } = _wcl.getViewportSize();

    if (x >= (vw/2)) {
      trigger.dataset.quadrant = (y >= (vh/2)) ? 4 : 1;
    } else {
      trigger.dataset.quadrant = (y >= (vh/2)) ? 3 : 2;
    }
  }

  dismiss() {
    this.#nodes.btnCancel.click();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscHelpMeWrite');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscHelpMeWrite'), MscHelpMeWrite);
}