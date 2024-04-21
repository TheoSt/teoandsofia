// src/utils/minor/getDrawOrigin.ts
function getDrawOrigin(options) {
  let drawOrigin;
  if (options.draw_origin === "top") {
    drawOrigin = 0.25;
  } else if (options.draw_origin === "center") {
    drawOrigin = 0.5;
  } else if (options.draw_origin === "bottom") {
    drawOrigin = 0.75;
  } else {
    drawOrigin = options.draw_origin;
  }
  return drawOrigin;
}

// src/utils/calcPercentToDraw.ts
function calcPercentToDraw(svgPath, options) {
  const height = window.innerHeight;
  const svgTop = svgPath.getBoundingClientRect().top - options.offset;
  const svgHeight = svgPath.getBoundingClientRect().height;
  let screenOffset = height * getDrawOrigin(options);
  let percentToDraw = (-svgTop + screenOffset) / svgHeight * options.speed;
  if (percentToDraw > 1) {
    percentToDraw = 1;
  } else if (percentToDraw < 0) {
    percentToDraw = 0;
  }
  return percentToDraw;
}

// src/utils/minor/percentToPixelOffset.ts
function percentToPixelOffset(percent, svgPath, options) {
  const adjustedPercent = 1 - percent;
  const svgPathLength = svgPath.getTotalLength();
  if (options.undraw) {
    return -(percent * svgPathLength);
  } else {
    return adjustedPercent * svgPathLength;
  }
}

// src/utils/calcAndDrawScrollLine.ts
function calcAndDrawScrollLine(svgPath, options) {
  const percentToDraw = calcPercentToDraw(svgPath, options);
  let pixelOffset = percentToPixelOffset(percentToDraw, svgPath, options);
  if (options.invert) {
    pixelOffset = -pixelOffset;
  }
  svgPath.style.strokeDashoffset = pixelOffset + "";
}

// src/utils/inputValidation.ts
function validSvgPath(svgPath) {
  if (svgPath === null || svgPath === void 0) {
    console.error(`SVG Path not found ~ Check id or class name`);
    return false;
  } else if (svgPath.tagName !== "path") {
    console.error(`${svgPath.outerHTML} is not a path`);
    return false;
  } else if (svgPath.getTotalLength() <= 0) {
    console.error(`${svgPath.outerHTML} has no length`);
    return false;
  }
  return true;
}
function validateOptions(options, userOptions) {
  let errors = 0;
  try {
    Object.keys(options).map((key) => {
      switch (key) {
        case "invert":
        case "draw_origin":
        case "offset":
        case "speed":
        case "undraw":
          break;
        default:
          console.error(`Invalid option ~ '${key}'`);
          errors++;
      }
    });
    if (typeof options.invert !== "boolean") {
      console.error(`Invalid invert option. Must be a boolean. Is currently ~ ${options.invert}`);
      errors++;
    }
    if (options.draw_origin !== "top" && options.draw_origin !== "center" && options.draw_origin !== "bottom" && (typeof options.draw_origin !== "number" || Number.isNaN(options.draw_origin))) {
      console.error(
        `Invalid draw_origin option. Must be 'center', 'top', or 'bottom' or a number. Is currently ~ ${options.draw_origin}`
      );
      errors++;
    }
    if (typeof options.draw_origin === "number" && options.draw_origin < 0) {
      console.error(
        `Invalid draw_origin option. Must be a number greater than or equal to 0. Is currently ~ ${options.draw_origin}`
      );
      errors++;
    } else if (typeof options.draw_origin === "number" && options.draw_origin > 1) {
      console.error(
        `Invalid draw_origin option. Must be a number less than or equal to 1. Is currently ~ ${options.draw_origin}`
      );
      errors++;
    }
    if (typeof options.offset !== "number" || Number.isNaN(options.offset)) {
      console.error(`Invalid offset option. Must be a number. Is currently ~ ${options.offset}`);
      errors++;
    }
    if (typeof options.speed !== "number" || options.speed <= 0 || Number.isNaN(options.speed)) {
      console.error(`Invalid speed option. Must be a number greater than 0. Is currently ~ ${options.speed}`);
      errors++;
    }
    if (typeof options.undraw !== "boolean") {
      console.error(`Invalid undraw option. Must be a boolean. Is currently ~ ${options.undraw}`);
      errors++;
    }
    if (errors > 0) {
      console.error(`Found ${errors} errors in animation options ~ ${JSON.stringify(userOptions)}`);
    }
  } catch (error) {
    console.error(`Error validating options ~ ${error}`);
    errors++;
  }
  return errors;
}

// src/utils/minor/setupSvgPath.ts
function setupSvgPath(svgPath) {
  const svgPathLength = svgPath.getTotalLength();
  svgPath.style.strokeDasharray = svgPathLength + " " + svgPathLength;
  svgPath.style.strokeDashoffset = svgPathLength + "";
}

// src/scrollSvgClass.ts
var scrollSvgClass = class {
  svgPath;
  options;
  animationFrame = 0;
  prevBoundingRectTop;
  isActive = true;
  isObservable = true;
  // observer: IntersectionObserver
  constructor(svgPath, options) {
    this.svgPath = svgPath;
    this.options = options;
    this.prevBoundingRectTop = svgPath.getBoundingClientRect().top;
    setupSvgPath(svgPath);
    calcAndDrawScrollLine(svgPath, options);
    animationFrameFunc(this);
  }
  animate() {
    if (this.isActive)
      return;
    this.isActive = true;
    animationFrameFunc(this);
  }
  stopAnimating() {
    this.isActive = false;
    this.animationFrame = 0;
  }
  redraw() {
    calcAndDrawScrollLine(this.svgPath, this.options);
  }
  changeOptions(userOptions) {
    const options = { ...this.options, ...userOptions };
    if (validateOptions(options, userOptions) > 0)
      return false;
    this.options = options;
    return true;
  }
  getOptions() {
    return this.options;
  }
  getSvgPath() {
    return this.svgPath;
  }
  getPercentageDrawn() {
    if (this.options.undraw)
      return 100 * (1 - calcPercentToDraw(this.svgPath, this.options));
    return 100 * calcPercentToDraw(this.svgPath, this.options);
  }
  clear() {
    this.svgPath.style.strokeDashoffset = `${this.svgPath.getTotalLength()}`;
  }
  fill() {
    this.svgPath.style.strokeDashoffset = "0";
  }
  remove() {
    this.stopAnimating();
  }
};
var animationFrameFunc = (scrollSvgObj) => {
  if (scrollSvgObj.prevBoundingRectTop !== scrollSvgObj.svgPath.getBoundingClientRect().top) {
    calcAndDrawScrollLine(scrollSvgObj.svgPath, scrollSvgObj.options);
    scrollSvgObj.prevBoundingRectTop = scrollSvgObj.svgPath.getBoundingClientRect().top;
  }
  if (scrollSvgObj.isActive && scrollSvgObj.isObservable) {
    scrollSvgObj.animationFrame = requestAnimationFrame(function() {
      animationFrameFunc(scrollSvgObj);
    });
  } else {
    cancelAnimationFrame(scrollSvgObj.animationFrame);
  }
};
var scrollSvgEmptyClass = class {
  svgPath;
  options = defaultOptions;
  animationFrame = 0;
  prevBoundingRectTop = 0;
  isActive = true;
  isObservable = true;
  // observer: IntersectionObserver
  constructor() {
    console.error("Scroll Svg Class Empty ~ Seems to be an error with your input.");
    this.svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  }
  animate() {
  }
  stopAnimating() {
  }
  redraw() {
  }
  changeOptions() {
    return false;
  }
  getOptions() {
    return defaultOptions;
  }
  getSvgPath() {
    console.error("Invalid input to scrollSvg. Returning an empty SVGPathElement.");
    return this.svgPath;
  }
  getPercentageDrawn() {
    return 0;
  }
  clear() {
  }
  fill() {
  }
  remove() {
  }
};

// src/index.ts
var defaultOptions = {
  invert: false,
  draw_origin: "center",
  offset: 0,
  speed: 1,
  undraw: false
};
function scrollSvg(svgPath, userOptions = defaultOptions) {
  if (!validSvgPath(svgPath))
    return new scrollSvgEmptyClass();
  const options = { ...defaultOptions, ...userOptions };
  Object.freeze(options);
  if (validateOptions(options, userOptions) > 0)
    return new scrollSvgEmptyClass();
  return new scrollSvgClass(svgPath, options);
}
function scrollSvgNullable(svgPath, userOptions = defaultOptions) {
  if (!validSvgPath(svgPath))
    return null;
  const options = { ...defaultOptions, ...userOptions };
  Object.freeze(options);
  if (validateOptions(options, userOptions) > 0)
    return null;
  return new scrollSvgClass(svgPath, options);
}
export {
  scrollSvg as default,
  defaultOptions,
  scrollSvgNullable
};
