<template>
  <div class="svg-container" id="svgContainer" ref="svgContainer">
    <SfLoader v-if="loading" loading="loading" class="loading-container" />
    <div v-show="!loading && !loadingFailed" :id="`svgTemplate_${domId}`" />
    <SfImage v-show="!loading && loadingFailed" src="/assets/placeholder.jpg" />
  </div>
</template>
<script>
import Vue from 'vue/dist/vue.esm.js';
import { SfLoader, SfImage } from '@storefront-ui/vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import materialColors from 'theme/resource/material-colors.json'
const xmlserializer = require('xmlserializer');

const HIGHLIGHT_COLOR = 'var(--c-primary)';

const svgImageHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" contentScriptType="text/ecmascript" zoomAndPan="magnify" contentStyleType="text/css" id="Capa_1" enable-background="new 0 0 1841.891 1595.279" version="1.1" xml:space="preserve" width="1841.891px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1841.891 1595.279" height="1595.279px" x="0px" y="0px">`

const fillColorToSvgPart = (source = [], color = '', isOutline = true) => {
  for (let i = 0; i < source.length; i++) {
    const outlineElement = source[i].getAttribute('outline-element')
    if (isOutline) {
      outlineElement && source[i].setAttribute('fill', color);
    } else {
      source[i].setAttribute('fill', color);
    }
  }
}

export default {
  name: 'SvgViewer',
  components: {
    SfLoader,
    SfImage
  },
  props: {
    imageCode: { // if current page is not full, will render this image url. if not, it will be part svg ID.
      type: [Number, String],
      default: ''
    },
    imageId: {
      type: [Number, String],
      default: ''
    },
    // hoveredImageCode: {
    //   type: [Number, String],
    //   default: ''
    // },
    // clickedImageCode: {
    //   type: [Number, String],
    //   default: ''
    // },
    width: {
      type: Number,
      default: 700
    },
    height: {
      type: Number,
      default: 700
    },
    isFullImage: {
      type: Boolean,
      default: false
    },
    domId: { // when rendering many svg-viewers in a page
      type: [Number, String],
      default: 1
    },
    loadedSvgData: {
      type: String,
      default: null,
      required: false
    },
    partSvgClickable: {
      type: Boolean,
      default: true
    },
    hasColor: {
      type: Boolean,
      default: true
    }
  },
  emit: ['loadSvg', 'clickPartSvg'],
  data () {
    return {
      svgDom: null, // obtained SVG element,
      loading: false,
      loadingMessage: 'Loading image...',
      clickedImageId: '', // client part image ID, will make emit for setting
      hoveredImageId: '',
      loadingFailed: false
    };
  },
  computed: {
    compoundWatchProperty () {
      return [this.imageCode, this.imageId, this.isFullImage].join();
    },
    ...mapGetters({
      tooltips: 'vehicles/tooltips'
    })
  },
  watch: {
    loadingFailed (value) {
      if (value) {
        let SvgDom = Vue.extend({
          // template: `<div v-show="!loading && !loadingFailed" id='svgTemplate_${this.domId}>${sXML}</div>`
          template: `<div id='svgTemplate_${this.domId}'></div>`
        });
        new SvgDom().$mount('#svgTemplate_' + this.domId);
      }
    },
    compoundWatchProperty: {
      immediate: true,
      async handler () {
        await this.$nextTick(async () => {
          await this.fetchSvg();
        })
      }
    },
    imageId () {
      if (this.isFullImage) this.$emit('loadSvg', null);
    }
  },
  async mounted () {
    if (this.partSvgClickable) {
      window[`handleClick_${this.domId}`] = id => {
        this.onClickSvg(id);
      };
    }
    // window[`handleHover_${this.domId}`] = id => {
    //   this.onHoverSvg(id);
    // };
  },
  methods: {
    onClickSvg (id) {
      if (this.partSvgClickable && this.isFullImage) {
        this.clickedImageId = id;
        this.setStrokeSvg(id, 'click');
        const tooltip = this.tooltips.find(tooltip => +tooltip.calloutNumber === +id)
        if (this.isFullImage) {
          if (tooltip) {
            this.$emit('clickPartSvg', tooltip) // calloutnumber of toolitp is part svg ID
          } else {
            this.$emit('clickPartSvg', {})
          }
        }
      }
    },
    // onHoverSvg (id) {
    //   this.hoveredImageId = id;
    // },
    setStrokeSvg (objectId, eventName) { // eventName = click/hover
      const svgDomContainer = document.getElementById(`svgTemplate_${this.domId}`);
      let g_container = svgDomContainer.firstChild.getElementById(this.imageId);

      // reset imageCode color

      for (let i = 0; i < g_container.childNodes.length; i++) {
        let g = g_container.childNodes[i];

        if (g.nodeName === 'g') {
          const id = Number(g.getAttribute('id'));
          const all_path = g.querySelectorAll('path');
          const currentTooltip = this.tooltips.find(({ calloutNumber }) => +calloutNumber === +id)

          const changeColor = (source, mode) => {
            for (let i = 0; i < source.length; i++) {
              const outlineElement = source[i].getAttribute('outline-element')
              if (this.partSvgClickable) {
                if (mode === 'set') {
                  if (eventName === 'hover') {
                    if (id !== objectId) {
                      source[i].setAttribute('stroke', '#565bff');
                      // const orgfill = source[i].getAttribute('orgfill')
                      // source[i].setAttribute('fill', orgfill);
                    }
                  } else {
                    source[i].setAttribute('fill', HIGHLIGHT_COLOR);
                  }
                } else if (mode === 'revert') {
                  if (id !== objectId) {
                    // const orgstroke = source[i].getAttribute('orgstroke')
                    // source[i].setAttribute('stroke', orgstroke);
                    if (currentTooltip && currentTooltip.imgShow === '0' && outlineElement && this.hasColor) {
                      source[i].setAttribute('fill', materialColors[currentTooltip['materialCode']]);
                    } else {
                      const orgfill = source[i].getAttribute('orgfill')
                      source[i].setAttribute('fill', orgfill);
                    }
                  }
                }
              }
            }
          };

          all_path && changeColor(all_path, 'revert');

          if (+objectId === +id) {
            // all_path.style.fill = '#DDE8F9'
            all_path && changeColor(all_path, 'set');
          }
        }
      }
    },
    // Initialize svg
    async fetchSvg () {
      /* Create XHR object */
      let url;
      this.loading = true;
      this.loadingFailed = false;
      if (this.isFullImage) {
        if (!this.imageId) {
          this.loading = false;
          // this.loadingFailed = true;
          return;
        } else {
          url = `https://feb-epc.s3.eu-west-1.amazonaws.com/svg20220124/${this.imageId}.svg`;
        }
      } else {
        if (!this.imageCode || !this.imageId) {
          this.loading = false;
          return;
          // this.loadingFailed = true;
        } else {
          url = `https://feb-epc.s3.eu-west-1.amazonaws.com/${this.imageCode}.xml`;
        }
      }

      if (this.loadedSvgData && this.isFullImage) {
        if (this.$refs.svgContainer) {
          this.loading = false;
          this.loadingFailed = false;

          await this.svgOperation(this.loadedSvgData, this.imageId);
        } else {
          this.loading = false;
          this.loadingFailed = true;
        }
      } else {
        try {
          const { data } = await axios.get(url);

          if (data) {
            if (this.$refs.svgContainer) {
              this.loading = false;

              const svgContent = this.isFullImage ? data : svgImageHeader + data + '</svg>';
              if (this.isFullImage) {
                this.$emit('loadSvg', svgContent)
              }
              await this.svgOperation(svgContent, this.imageId);
            }
          } else {
            this.loading = false;
            this.loadingFailed = true;
          }
        } catch (e) {
          this.loading = false;
          this.loadingFailed = true;
        }
      }
    },
    async svgOperation (svgText) {
      /** Get SVG DOM */
      const parser = new DOMParser();
      const resXML = parser.parseFromString(svgText, 'application/xml');
      this.svgDom = resXML.documentElement.cloneNode(true);

      /** Modify SVG DOM */
      if (!this.svgDom) {
        this.loading = false;
        // this.loadingFailed = true;
        // this.loadingMessage = 'Loading image failed.';
        return;
      }

      let gContainerId = null;
      if (this.isFullImage) {
        gContainerId = this.imageId;
      } else {
        gContainerId = this.imageCode.split('_')[1]
      }
      let g_container = this.svgDom.getElementById(gContainerId);

      if (this.isFullImage) {
        let allObjectIds = [];
        for (let i = 0; i < g_container.childNodes.length; i++) {
          let child = g_container.childNodes[i];
          if (child.nodeName === 'g') {
            allObjectIds = [...allObjectIds, Number(child.getAttribute('id'))];
          }
        }

        for (let i = 0; i < g_container.childNodes.length; i++) {
          let g = g_container.childNodes[i];

          if (g.nodeName === 'g') {
            const id = Number(g.getAttribute('id'));
            const currentTooltip = this.tooltips.find(({ calloutNumber }) => +calloutNumber === +id)
            const all_path = g.querySelectorAll('path');

            if (currentTooltip && currentTooltip.imgShow === '0' && this.hasColor) {
              all_path && fillColorToSvgPart(all_path, materialColors[currentTooltip['materialCode']], true);
            }
            if (this.isFullImage && this.imageId && +id === +this.imageCode) {
              all_path && fillColorToSvgPart(all_path, HIGHLIGHT_COLOR, false);
            }

            for (let j = 0; j < g.childNodes.length; j++) {
              if (g.childNodes[j].nodeName === 'g') {
                // let title = document.createElement('title');
                // title.innerText = currentTooltip && currentTooltip.tooltip ? currentTooltip.tooltip : '';
                // g.childNodes[j].appendChild(title)

                g.childNodes[j].removeAttribute('onclick');
                g.childNodes[j].removeAttribute('onmouseover');
                g.childNodes[j].removeAttribute('onmouseout');

                g.childNodes[j].setAttribute(
                  'v-on:click',
                  `this.handleClick_${this.domId}(${id})`
                );
                // g.childNodes[j].setAttribute(
                //   'v-on:mouseover',
                //   `this.handleHover_${this.domId}(${id})`
                // );
                if (currentTooltip && currentTooltip.imgShow !== '0' && id !== this.imageCode) {
                  g.childNodes[j].setAttribute('v-if', `false`);
                }
              }
            }
          }
        }
      } else {
        for (let i = 0; i < g_container.childNodes.length; i++) {
          let g = g_container.childNodes[i];

          if (g.nodeName === 'g') {
            g.removeAttribute('onclick');
            g.removeAttribute('onmouseover');
            g.removeAttribute('onmouseout');
            // g.removeAttribute('transform');
          }
        }
      }
      this.scaleSvgToCenter(g_container);
      this.renderSvgToDom();
      this.loading = false;
    },
    scaleSvgToCenter (container) {
      this.renderSvgToDom();
      /** Apply scale to svg */
      let svg_container = document
        .querySelector('#svgTemplate_' + this.domId + ' svg')
        .getBBox();

      this.svgDom.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      this.svgDom.setAttribute('width', 'auto');
      this.svgDom.setAttribute('height', this.height + 'px');
      let scaleTransform = 1;

      if (svg_container.width > svg_container.height) {
        scaleTransform = this.width / svg_container.width;
      } else {
        scaleTransform = this.height / svg_container.height;
      }
      container.setAttribute('transform', `scale(` + scaleTransform + ')');
      this.renderSvgToDom();

      /** Apply scale & translate to svg */
      svg_container = document
        .querySelector('#svgTemplate_' + this.domId + ' svg')
        .getBBox();
      let new_x = this.width / 2 - svg_container.x - svg_container.width / 2;
      let new_y = this.height / 2 - svg_container.y - svg_container.height / 2;

      container.setAttribute(
        'transform',
        'translate(' + new_x + ', ' + new_y + ') scale(' + scaleTransform + ')'
      );
    },
    renderSvgToDom () {
      let sXML = xmlserializer.serializeToString(this.svgDom);
      let SvgDom = Vue.extend({
        // template: `<div v-show="!loading && !loadingFailed" id='svgTemplate_${this.domId}>${sXML}</div>`
        template: `<div id='svgTemplate_${this.domId}'>${sXML}</div>`
      });
      new SvgDom().$mount('#svgTemplate_' + this.domId);
    }
  },
  beforeDestroy () {
    this.svgDom = null;
  }
};
</script>
<style lang="scss">
.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  position: relative;
  min-height: 300px;

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // span {
      // min-width: 200px;
      // min-height: 100px;
    // }
  }

  #svgTemplate {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
