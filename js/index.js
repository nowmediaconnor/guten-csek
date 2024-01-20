"use strict";
(() => {
  // src/js/scripts/math.ts
  var randomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var randomPartOfOne = () => {
    return Math.random() * 2 - 1;
  };

  // src/js/dom-controller.ts
  var _DOMController = class _DOMController {
    constructor(...blockControllers) {
      this.loadingInterval = -1;
      this.isLetsTalkOpen = false;
      this.usingEditor = false;
      this.taglineScroll = true;
      this.scrollActions = [];
      this.id = randomIntInRange(0, 1e6);
      this.name = "DOMController";
      this.blockControllers = blockControllers;
      this.debug = true;
      this.isInitialized = false;
      this.isStarted = false;
      this.url = new URL(window.location.href);
      this.basePath = this.url.pathname.split("/").slice(0, -1).join("/");
      const searchParams = new URLSearchParams(this.url.search);
      const isAdmin = this.basePath === "/wp-admin";
      const isEdit = searchParams.get("action") === "edit";
      this.usingEditor = isAdmin && isEdit;
      this.scrollActions = [];
      console.log(`Instantiated DOMController ${this.id}`);
    }
    addControllerAfterSetup(controller) {
      this.blockControllers.push(controller);
      if (this.isInitialized) {
        controller.setup();
      }
      this.addEventListeners();
    }
    addControllerBeforeSetup(controller, index) {
      if (index && index >= 0 && index < this.blockControllers.length) {
        this.blockControllers.splice(index, 0, controller);
      } else {
        this.blockControllers.push(controller);
      }
    }
    addControllerAndReset(controller, index) {
      this.addControllerBeforeSetup(controller, index);
      this.setup();
    }
    prepareLoadingPanel() {
      const existingPanel = document.getElementById("loading");
      if (existingPanel) {
        this.loadingPanel = existingPanel;
      } else if (!existingPanel) {
        this.loadingPanel = document.createElement("div");
        this.loadingPanel.id = "loading";
        document.body.prepend(this.loadingPanel);
      }
      window.addEventListener("beforeunload", () => {
        this.log("unload dom controller...");
      });
    }
    checkIfLetsTalkRequested() {
      const hash = window.location.hash;
      if (hash === "#contact") {
        this.openLetsTalk();
        return true;
      }
      return false;
    }
    prepareLetsTalkScreen() {
      const letsTalk = document.getElementById("lets-talk");
      if (!letsTalk) {
        this.err("Lets talk screen not found.");
        return false;
      }
      const letsTalkButtons = document.querySelectorAll(".lets-talk-open");
      if (!letsTalkButtons || letsTalkButtons.length === 0) {
        this.err("Lets talk buttons not found.");
        return false;
      }
      const letsTalkCloseButton = document.getElementById("lets-talk-close");
      if (!letsTalkCloseButton) {
        this.err("Lets talk close button not found.");
        return false;
      }
      this.letsTalkScreen = letsTalk;
      this.letsTalkOpenButtons = letsTalkButtons;
      this.letsTalkCloseButton = letsTalkCloseButton;
      this.checkIfLetsTalkRequested();
      return true;
    }
    hideLoadingPanel() {
      var _a;
      (_a = this.loadingPanel) == null ? void 0 : _a.classList.add("complete");
    }
    setup() {
      if (this.isStarted === false)
        this.isStarted = true;
      this.prepareLoadingPanel();
      this.prepareExpandingVideoBlocks();
      for (const controller of this.blockControllers) {
        try {
          controller.setup();
          this.log("Set up", controller.name);
        } catch (err) {
          this.err("Error setting up:", controller.name, err);
          controller.isInitialized = true;
        }
      }
      this.addEventListeners();
      if (this.usingEditor) {
        this.log("Using editor, not showing loading panel.");
        this.hideLoadingPanel();
      } else if (!this.usingEditor) {
        this.loadingInterval = window.setInterval(() => {
          if (this.finished()) {
            window.clearInterval(this.loadingInterval);
            this.hideLoadingPanel();
            this.log("Finished loading");
          }
        }, 1e3);
      }
      this.isInitialized = true;
    }
    addEventListeners() {
      var _a, _b;
      for (const controller of this.blockControllers) {
        try {
          window.addEventListener("beforeunload", (e) => {
            this.beforeReload();
            if (controller.beforeReload) {
              controller.beforeReload();
            }
          });
          window.addEventListener("scroll", (e) => {
            const scrollY = window.scrollY;
            if (controller.scroll) {
              controller.scroll(scrollY);
            }
          });
          if (controller.blocks) {
            controller.blocks.forEach((block, index) => {
              if (GutenCsek.isMobile)
                return;
              if (controller.onMouseMove) {
                block.addEventListener("mousemove", (e) => {
                  if (controller.onMouseMove)
                    controller.onMouseMove(e, index);
                });
                block.addEventListener("mouseenter", (e) => {
                  if (controller.onMouseMove)
                    controller.onMouseMove(e, index);
                });
              }
            });
          }
        } catch (err) {
          this.err(`Error in ${controller.name} adding event listeners:`, err);
        }
      }
      for (const action of this.scrollActions) {
        window.addEventListener("scroll", action);
      }
      if (this.prepareLetsTalkScreen()) {
        (_a = this.letsTalkOpenButtons) == null ? void 0 : _a.forEach((btn) => {
          btn.addEventListener("click", () => {
            this.openLetsTalk();
          });
        });
        (_b = this.letsTalkCloseButton) == null ? void 0 : _b.addEventListener("click", () => {
          this.closeLetsTalk();
        });
      }
      window.addEventListener("keydown", (e) => {
        this.log("Key pressed:", e.key);
        if (e.key === "Escape" && this.isLetsTalkOpen) {
          this.log("Closing let's talk...");
          this.closeLetsTalk();
          e.preventDefault();
        }
        if (e.ctrlKey) {
          console.info("[CsekCreative] (Press Ctrl + D to toggle debug mode)");
        }
        if (e.ctrlKey && e.key === "d") {
          const newMode = !this.debug;
          this.debugMode = newMode;
          console.info("[CsekCreative] Debug mode:", this.debug ? "ON" : "OFF");
          e.preventDefault();
        }
      });
    }
    finished() {
      for (const controller of this.blockControllers) {
        if (!controller.isInitialized) {
          this.log(controller.name, "not yet initialized...");
          return false;
        }
      }
      return this.isInitialized;
    }
    openLetsTalk() {
      if (!this.letsTalkScreen)
        return;
      this.letsTalkScreen.classList.add("open");
      this.isLetsTalkOpen = true;
    }
    closeLetsTalk() {
      if (!this.letsTalkScreen)
        return;
      this.letsTalkScreen.classList.remove("open");
      this.isLetsTalkOpen = false;
    }
    beforeReload() {
      var _a;
      if (this.usingEditor)
        return;
      (_a = this.loadingPanel) == null ? void 0 : _a.classList.remove("complete");
    }
    overrideAllDebug(state) {
      this.debug = state;
      this.overrideDebug(state, void 0);
    }
    overrideDebug(state, controllerName) {
      for (const controller of this.blockControllers) {
        if (!controllerName || controller.name === controllerName)
          controller.debug = state;
      }
    }
    onMouseMove(e, blockIndex) {
    }
    set debugMode(state) {
      _DOMController.siteDebug = state;
      this.debug = state;
    }
    prepareExpandingVideoBlocks() {
      const expandingVideoBlocks = document.querySelectorAll(".wp-block-guten-csek-expanding-video-block");
      const elementsToFadeOnScroll = document.querySelectorAll(".scroll-fade-away");
      for (const videoBlock of expandingVideoBlocks) {
        const threshold = videoBlock.querySelector(".threshold");
        const video = videoBlock.querySelector(".expanding-video-container");
        if (!threshold || !video)
          continue;
        this.scrollActions.push(() => {
          const blockRect = videoBlock.getBoundingClientRect();
          const thresholdRect = threshold.getBoundingClientRect();
          const thresholdTop = thresholdRect.top;
          if (parseInt(thresholdTop.toString()) <= 0 && this.taglineScroll && blockRect.bottom > 0) {
            video.classList.add("expanded");
            for (const element of elementsToFadeOnScroll) {
              element.classList.add("hide");
            }
            document.body.style.backgroundColor = "#131313";
            this.taglineScroll = false;
            log("Expansion threshold reached");
          } else if (parseInt(thresholdTop.toString()) > 0 && !this.taglineScroll) {
            video.classList.remove("expanded");
            for (const element of elementsToFadeOnScroll) {
              element.classList.remove("hide");
            }
            document.body.style.backgroundColor = "transparent";
            this.taglineScroll = true;
          }
        });
        const floatingImages = videoBlock.querySelectorAll(".floating-image");
        for (const image of floatingImages) {
          const imageElement = image;
          const randomDelay = randomIntInRange(0, 1e3);
          const randomDuration = randomIntInRange(1e3, 3e3);
          const randomXDisplacement = randomPartOfOne();
          imageElement.style.animationDelay = `${-randomDelay}ms`;
          imageElement.style.animationDuration = `${randomDuration}ms`;
          if (Math.random() > 0.5) {
            imageElement.style.left = `${randomXDisplacement}rem`;
          } else {
            imageElement.style.right = `${randomXDisplacement}rem`;
          }
          log({ randomDelay, randomDuration, randomXDisplacement });
        }
      }
    }
    log(...args) {
      if (this.debug)
        log("[DOMController]", ...args);
    }
    err(...args) {
      if (this.debug)
        error("[DOMController]", ...args);
    }
  };
  _DOMController.siteDebug = false;
  var DOMController = _DOMController;

  // src/js/guten-csek.ts
  var GutenCsek = class {
    static get isMobile() {
      return window.innerWidth <= 768;
    }
    static enqueueController(blockController) {
      this.log(`Enqueueing ${blockController.name}...`);
      this.domController.addControllerBeforeSetup(blockController);
    }
    static setupDOMController() {
      this.log("Setting up DOM Controller...");
      this.domController.debug = this.siteDebug;
      this.domController.setup();
    }
    static log(...msg) {
      if (this.siteDebug) {
        console.log(`[${this.siteName}]`, ...msg);
      }
    }
    static err(...msg) {
      if (this.siteDebug) {
        console.error(`[${this.siteName}]`, ...msg);
      }
    }
  };
  GutenCsek.siteDebug = true;
  GutenCsek.siteName = "Csek Creative";
  GutenCsek.domController = new DOMController();
  var log = (...args) => {
    GutenCsek.log(...args);
  };
  var error = (...args) => {
    GutenCsek.err(...args);
  };

  // src/js/scripts/accumulators.ts
  var wrapNumbersInSpans = (inputString, className = "js-accumulator-number") => {
    const regex = /\d+/g;
    return inputString.replace(regex, (match) => `<span class="${className}">${match}</span>`);
  };
  var runAccumulators = () => {
    log("Accumulators...");
    const allAccumulators = document.querySelectorAll(".js-accumulator");
    allAccumulators.forEach((accumulator) => {
      const stringValue = accumulator.innerText;
      const wrappedNumbers = wrapNumbersInSpans(stringValue);
      accumulator.innerHTML = wrappedNumbers;
    });
    const accumulatorNumbers = document.querySelectorAll(".js-accumulator-number");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          log("Number is visible...");
          setTimeout(() => {
            const number = entry.target;
            const numberValue = parseInt(number.innerText, 10);
            const increment = Math.ceil(numberValue / 33.333);
            let counter = 0;
            const interval = setInterval(() => {
              counter += increment;
              number.innerText = counter.toString();
              if (counter >= numberValue) {
                clearInterval(interval);
                number.innerText = numberValue.toString();
              }
            }, 32);
            observer.unobserve(number);
          }, 100);
        }
      });
    });
    accumulatorNumbers.forEach((number) => {
      observer.observe(number);
    });
  };

  // src/js/index.js
  window.addEventListener("load", (e) => {
    log("[Csek Creative] Window loaded.");
    runAccumulators();
    window["domController"] = new DOMController();
  });
})();
