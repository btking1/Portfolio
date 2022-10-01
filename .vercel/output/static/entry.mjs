import React, { createElement, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                           *//* empty css                           */import { jsxs, jsx } from 'react/jsx-runtime';
import { IoSunny, IoMoon } from 'react-icons/io5/index.js';
import * as $$module1$1 from 'react-icons/.js';
import * as $$module1$2 from 'react-icons/fa';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
/* empty css                        *//* empty css                                 *//* empty css                           *//* empty css                           *//* empty css                        *//* empty css                      */
/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.4.0";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
  }
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = [];
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts.push(part);
    } else {
      this.parts.push(stringifyChunk(result, part));
    }
  }
  toString() {
    let html = "";
    for (const part of this.parts) {
      if (ArrayBuffer.isView(part)) {
        html += decoder.decode(part);
      } else {
        html += part;
      }
    }
    return html;
  }
  toArrayBuffer() {
    this.parts.forEach((part, i) => {
      if (typeof part === "string") {
        this.parts[i] = encoder.encode(String(part));
      }
    });
    return concatUint8Arrays(this.parts);
  }
}
function concatUint8Arrays(arrays) {
  let len = 0;
  arrays.forEach((arr) => len += arr.length);
  let merged = new Uint8Array(len);
  let offset = 0;
  arrays.forEach((arr) => {
    merged.set(arr, offset);
    offset += arr.length;
  });
  return merged;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue (jsx)"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$d = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/MainHead.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$e = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/MainHead.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$MainHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$MainHead;
  const {
    title = "Booker King: Web Developer",
    description = "The personal site of Booker King"
  } = Astro2.props;
  return renderTemplate`<meta charset="UTF-8">
<meta name="description" property="og:description"${addAttribute(description, "content")}>
<meta name="viewport" content="width=device-width">
<meta name="generator"${addAttribute(Astro2.generator, "content")}>
<title>${title}</title>

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<!-- <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;700;900&display=swap"
	rel="stylesheet"
/> -->
`;
});

const $$file$d = "C:/Users/16233/Desktop/projects/Portfolio/src/components/MainHead.astro";
const $$url$d = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$d,
	default: $$MainHead,
	file: $$file$d,
	url: $$url$d
}, Symbol.toStringTag, { value: 'Module' }));

function MemoryChip() {
  return /* @__PURE__ */ jsxs("svg", {
    class: "transisition-transform duration-300 ease-in-out",
    viewBox: "0 0 24 24",
    fill: "none",
    height: 28,
    width: 28,
    stroke: "currentColor",
    "stroke-width": ".85",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    children: [/* @__PURE__ */ jsx("path", {
      d: "M18.5,16V8c0-1.378-1.122-2.5-2.5-2.5H8C6.622,5.5,5.5,6.622,5.5,8v8c0,1.379,1.122,2.5,2.5,2.5h8  C17.378,18.5,18.5,17.379,18.5,16z M6.5,16V8c0-0.827,0.673-1.5,1.5-1.5h8c0.827,0,1.5,0.673,1.5,1.5v8c0,0.827-0.673,1.5-1.5,1.5H8  C7.173,17.5,6.5,16.827,6.5,16z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M14.25,8.25h-4.5c-0.827,0-1.5,0.673-1.5,1.5v4.5c0,0.827,0.673,1.5,1.5,1.5h4.5c0.827,0,1.5-0.673,1.5-1.5v-4.5  C15.75,8.923,15.077,8.25,14.25,8.25z M14.75,14.25c0,0.275-0.224,0.5-0.5,0.5h-4.5c-0.276,0-0.5-0.225-0.5-0.5v-4.5  c0-0.276,0.224-0.5,0.5-0.5h4.5c0.276,0,0.5,0.224,0.5,0.5V14.25z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M9.375,4.583V3.5c0-0.276-0.224-0.5-0.5-0.5s-0.5,0.224-0.5,0.5v1.083c0,0.276,0.224,0.5,0.5,0.5S9.375,4.86,9.375,4.583z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M12.5,4.583V3.5C12.5,3.224,12.276,3,12,3s-0.5,0.224-0.5,0.5v1.083c0,0.276,0.224,0.5,0.5,0.5S12.5,4.86,12.5,4.583z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M15.625,4.583V3.5c0-0.276-0.224-0.5-0.5-0.5s-0.5,0.224-0.5,0.5v1.083c0,0.276,0.224,0.5,0.5,0.5S15.625,4.86,15.625,4.583  z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M8.375,19.417V20.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5v-1.083c0-0.276-0.224-0.5-0.5-0.5  S8.375,19.141,8.375,19.417z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M11.5,19.417V20.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5v-1.083c0-0.276-0.224-0.5-0.5-0.5S11.5,19.141,11.5,19.417z  "
    }), /* @__PURE__ */ jsx("path", {
      d: "M14.625,19.417V20.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5v-1.083c0-0.276-0.224-0.5-0.5-0.5  S14.625,19.141,14.625,19.417z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M20.5,8.375h-1.083c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5H20.5c0.276,0,0.5-0.224,0.5-0.5S20.776,8.375,20.5,8.375z  "
    }), /* @__PURE__ */ jsx("path", {
      d: "M20.5,11.5h-1.083c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5H20.5c0.276,0,0.5-0.224,0.5-0.5S20.776,11.5,20.5,11.5z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M20.5,14.625h-1.083c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5H20.5c0.276,0,0.5-0.224,0.5-0.5  S20.776,14.625,20.5,14.625z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M3.5,9.375h1.083c0.276,0,0.5-0.224,0.5-0.5s-0.224-0.5-0.5-0.5H3.5c-0.276,0-0.5,0.224-0.5,0.5S3.224,9.375,3.5,9.375z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M3.5,12.5h1.083c0.276,0,0.5-0.224,0.5-0.5s-0.224-0.5-0.5-0.5H3.5C3.224,11.5,3,11.724,3,12S3.224,12.5,3.5,12.5z"
    }), /* @__PURE__ */ jsx("path", {
      d: "M5.083,15.125c0-0.276-0.224-0.5-0.5-0.5H3.5c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5h1.083  C4.86,15.625,5.083,15.401,5.083,15.125z"
    })]
  });
}
__astro_tag_component__(MemoryChip, "@astrojs/react");

const $$module2$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: MemoryChip
}, Symbol.toStringTag, { value: 'Module' }));

const themes = ["light", "dark"];
function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState(() => {
    {
      return void 0;
    }
  });
  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", t);
    setTheme(t);
  };
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? /* @__PURE__ */ jsx("div", {
    className: "inline-flex items-center p-[1px] rounded-3xl bg-orange-300 dark:bg-zinc-600",
    children: themes.map((t) => {
      const checked = t === theme;
      return /* @__PURE__ */ jsx("button", {
        className: `${checked ? "bg-white text-black" : ""} cursor-pointer rounded-3xl p-2`,
        onClick: toggleTheme,
        "aria-label": "Toggle theme",
        children: t === "light" ? /* @__PURE__ */ jsx(IoSunny, {}) : /* @__PURE__ */ jsx(IoMoon, {})
      }, t);
    })
  }) : /* @__PURE__ */ jsx("div", {});
}
__astro_tag_component__(ThemeToggle, "@astrojs/react");

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: ThemeToggle
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$c = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Nav.astro", { modules: [{ module: $$module1$1, specifier: "react-icons/", assert: {} }, { module: $$module2$2, specifier: "./icons/memoryChip.jsx", assert: {} }, { module: $$module3$1, specifier: "./themeToggleButton.jsx", assert: {} }], hydratedComponents: [ThemeToggle], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["load"]), hoisted: [] });
const $$Astro$d = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Nav.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Nav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Nav;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<header class="fixed w-full p-2 z-20 backdrop-blur-md astro-FYFEV65I">
  <div class="mx-auto max-w-3xl astro-FYFEV65I">
    <nav id="nav" class="flex items-center gap-3 text-base astro-FYFEV65I">
      <a class="link astro-FYFEV65I" href="/">
        <h2 class="flex font-bold -tracking-tighter p-2 font-jetbrains text-lg items-center content-center gap-1 astro-FYFEV65I">
          ${renderComponent($$result, "MemoryChip", MemoryChip, { "class": "astro-FYFEV65I" })}
          BK:DEV
        </h2>
      </a>
      <div id="links" class="items-center gap-6 hidden md:flex astro-FYFEV65I">
        <a class="link astro-FYFEV65I" href="/projects/">Portfolio</a>
        <a class="link astro-FYFEV65I" href="/about/">About</a>
        <a class="link astro-FYFEV65I" href="/contact/">Contact</a>
        <a class="link astro-FYFEV65I" href="/resume/">Resume</a>

        <div class="flex-1 astro-FYFEV65I"></div>
        ${renderComponent($$result, "ThemeToggle", ThemeToggle, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/themeToggleButton", "client:component-export": "default", "class": "astro-FYFEV65I" })}
      </div>
    </nav>
  </div>
  <div class="flex-1 astro-FYFEV65I"></div>
</header>

`;
});

const $$file$c = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Nav.astro";
const $$url$c = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$c,
	default: $$Nav,
	file: $$file$c,
	url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$b = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Footer.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [{ type: "inline", value: `
  const sendEmail = document.querySelector(".send-email");

  sendEmail.addEventListener("click", (event) => {
    event.preventDefault();
    const email = "mailto:	btking1@my.waketech.edu";
    window.location.href = email;
  });
` }] });
const $$Astro$c = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Footer.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Footer;
  new Date().getFullYear();
  return renderTemplate`${maybeRenderHead($$result)}<footer class=" p-4 text-center ">
  
    <button type="submit" class="send-email text-zinc-500 hover:text-orange-300 cursor-pointer"> Get in touch</button>
  
</footer>
`;
});

const $$file$b = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Footer.astro";
const $$url$b = undefined;

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$b,
	default: $$Footer,
	file: $$file$b,
	url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$metadata$a = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Hero.astro", { modules: [{ module: $$module1$2, specifier: "react-icons/fa", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Hero.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Hero;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<header class="pt-20 astro-P6N2V6TL">
  <div id="hero" class="flex flex-col justify-center items-center p-10 my-6 astro-P6N2V6TL">
    <h1 class="font-kosugi ml-5 sm:text-3xl md:text-5xl py-2 font-medium astro-P6N2V6TL">
      Hello, I'm Booker King
    </h1>
    <h3 class="font-kosugi sm:text-xl md:text-5xl lg:text-5xl py-2 text-center astro-P6N2V6TL">
      Creative-Thinker + Full-Stack Developer
    </h3>
    <p class="font-kosugi text-sm lg:text-lg py-5 text-center leading-8 astro-P6N2V6TL">
      programmer with a passion for learning new things and developing software.
    </p>
    <div class="font-kosugi text-sm lg:text-lg text-end p-3 mt-1 astro-P6N2V6TL">
      <span class="role astro-P6N2V6TL">\u{1F469}\u200D\u{1F4BB} Developer</span>
      <span class="role astro-P6N2V6TL">\u{1F3A4} Creator</span>
      <span class="role text-center justify-center astro-P6N2V6TL">\u270F\uFE0F Problem-Solver</span>
    </div>
    <div class="flex gap-4 items-center h-full text-3xl p-5 justify-center astro-P6N2V6TL">
      <a href="https://github.com/btking1" class="astro-P6N2V6TL">
        `, '\n      </a>\n      <a href="https://www.linkedin.com/in/booker-king-42493a247/" class="astro-P6N2V6TL">\n        ', '\n      </a>\n    </div>\n  </div>\n  <section class="w-full flex justify-center items-center mx-auto astro-P6N2V6TL">\n    <div id="dynamic-card" class="p-2.5 my-2 md:my-4 shadow-up dark:shadow-box-dark dark:bg-box-dark w-full 2xl:mx-auto rounded-lg flex justify-center items-center astro-P6N2V6TL">\n      <div class="flex flex-col items-center justify-center astro-P6N2V6TL">\n        <div class="atropos py-4 px-6 2xl:px-10 shadow-down dark:shadow-box-dark dark:bg-box-dark w-full m-auto astro-P6N2V6TL">\n          <div class="atropos-scale astro-P6N2V6TL">\n            <div class="atropos-rotate astro-P6N2V6TL">\n              <div class="atropos-inner transition-all duration-700 relative p-2 border-2 rounded-md shadow-2xl border-light-blue-dark dark:border-gray-dark bg-gray-light-4 dark:bg-transparent md:backdrop-blur-sm flex flex-col astro-P6N2V6TL">\n                <div class="atropos-inner transition-all duration-700 relative py-4 px-2 md:px-8 2xl:px-15 border-4 rounded-md shadow-2xl border-light-blue-dark bg-gray-light-4 md:backdrop-blur-sm flex flex-col dark:border-gray-dark dark:bg-transparent dark:shadow-orange-dark astro-P6N2V6TL">\n                  <div class="flex items-center justify-center pt-2 astro-P6N2V6TL" data-atropos-offset="5">\n                    <img src="../../public/assets/nyskyline.jpg" alt="NY Skyline" class="astro-P6N2V6TL">\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n  \n\n  <script type="module">\n    // @ts-nocheck\n    /* eslint-disable */\n    !(function (t, e) {\n      "object" == typeof exports && "undefined" != typeof module\n        ? (module.exports = e())\n        : "function" == typeof define && define.amd\n        ? define(e)\n        : ((t =\n            "undefined" != typeof globalThis ? globalThis : t || self).Atropos =\n            e());\n    })(this, function () {\n      "use strict";\n      function t() {\n        return (t =\n          Object.assign ||\n          function (t) {\n            for (var e = 1; e < arguments.length; e++) {\n              var o = arguments[e];\n              for (var a in o)\n                Object.prototype.hasOwnProperty.call(o, a) && (t[a] = o[a]);\n            }\n            return t;\n          }).apply(this, arguments);\n      }\n      var e = function (t, e) {\n          return t.querySelector(e);\n        },\n        o = function (t) {\n          void 0 === t && (t = {});\n          var e = {};\n          return (\n            Object.keys(t).forEach(function (o) {\n              void 0 !== t[o] && (e[o] = t[o]);\n            }),\n            e\n          );\n        };\n      return function (a) {\n        void 0 === a && (a = {});\n        var n,\n          r,\n          i,\n          s,\n          c,\n          u,\n          p,\n          l,\n          d,\n          f,\n          v,\n          h = a,\n          m = h.el,\n          y = h.eventsEl,\n          g = {\n            __atropos__: !0,\n            params: t(\n              {\n                alwaysActive: !1,\n                activeOffset: 50,\n                shadowOffset: 50,\n                shadowScale: 1,\n                duration: 300,\n                rotate: !0,\n                rotateTouch: !0,\n                rotateXMax: 15,\n                rotateYMax: 15,\n                rotateXInvert: !1,\n                rotateYInvert: !1,\n                stretchX: 0,\n                stretchY: 0,\n                stretchZ: 0,\n                commonOrigin: !0,\n                shadow: !0,\n                highlight: !0,\n                onEnter: null,\n                onLeave: null,\n                onRotate: null,\n              },\n              o(a || {})\n            ),\n            destroyed: !1,\n            isActive: !1,\n          },\n          M = g.params,\n          x = [];\n        !(function t() {\n          v = requestAnimationFrame(function () {\n            x.forEach(function (t) {\n              if ("function" == typeof t) t();\n              else {\n                var e = t.element,\n                  o = t.prop,\n                  a = t.value;\n                e.style[o] = a;\n              }\n            }),\n              x.splice(0, x.length),\n              t();\n          });\n        })();\n        var w,\n          O = function (t, e) {\n            x.push({ element: t, prop: "transitionDuration", value: e });\n          },\n          b = function (t, e) {\n            x.push({ element: t, prop: "transitionTimingFunction", value: e });\n          },\n          T = function (t, e) {\n            x.push({ element: t, prop: "transform", value: e });\n          },\n          X = function (t, e) {\n            x.push({ element: t, prop: "opacity", value: e });\n          },\n          Y = function (t, e, o, a) {\n            return t.addEventListener(e, o, a);\n          },\n          _ = function (t, e, o, a) {\n            return t.removeEventListener(e, o, a);\n          },\n          L = function (t) {\n            var e = t.rotateXPercentage,\n              o = void 0 === e ? 0 : e,\n              a = t.rotateYPercentage,\n              n = void 0 === a ? 0 : a,\n              r = t.duration,\n              i = t.opacityOnly,\n              s = t.easeOut;\n            (function (t, e) {\n              return t.querySelectorAll(e);\n            })(m, "[data-atropos-offset], [data-atropos-opacity]").forEach(\n              function (t) {\n                O(t, r), b(t, s ? "ease-out" : "");\n                var e = (function (t) {\n                  if (\n                    t.dataset.atroposOpacity &&\n                    "string" == typeof t.dataset.atroposOpacity\n                  )\n                    return t.dataset.atroposOpacity\n                      .split(";")\n                      .map(function (t) {\n                        return parseFloat(t);\n                      });\n                })(t);\n                if (0 === o && 0 === n)\n                  i || T(t, "translate3d(0, 0, 0)"), e && X(t, e[0]);\n                else {\n                  var a = parseFloat(t.dataset.atroposOffset) / 100;\n                  if (\n                    (Number.isNaN(a) ||\n                      i ||\n                      T(t, "translate3d(" + -n * -a + "%, " + o * -a + "%, 0)"),\n                    e)\n                  ) {\n                    var c = e[0],\n                      u = e[1],\n                      p = Math.max(Math.abs(o), Math.abs(n));\n                    X(t, c + ((u - c) * p) / 100);\n                  }\n                }\n              }\n            );\n          },\n          A = function (t, e) {\n            var o = m !== y;\n            if (\n              (s || (s = m.getBoundingClientRect()),\n              o && !c && (c = y.getBoundingClientRect()),\n              void 0 === t && void 0 === e)\n            ) {\n              var a = o ? c : s;\n              (t = a.left + a.width / 2), (e = a.top + a.height / 2);\n            }\n            var r,\n              i = 0,\n              u = 0,\n              l = s,\n              d = l.top,\n              f = l.left,\n              v = l.width,\n              h = l.height;\n            if (o) {\n              var g = c,\n                w = g.top,\n                Y = g.left,\n                _ = g.width,\n                A = g.height,\n                E = v / 2 + (f - Y),\n                R = h / 2 + (d - w),\n                I = t - Y,\n                P = e - w;\n              (u = ((M.rotateYMax * (I - E)) / (_ - v / 2)) * -1),\n                (i = (M.rotateXMax * (P - R)) / (A - h / 2)),\n                (r = t - f + "px " + (e - d) + "px");\n            } else {\n              var j = v / 2,\n                D = h / 2,\n                F = t - f,\n                C = e - d;\n              (u = ((M.rotateYMax * (F - j)) / (v / 2)) * -1),\n                (i = (M.rotateXMax * (C - D)) / (h / 2));\n            }\n            (i = Math.min(Math.max(-i, -M.rotateXMax), M.rotateXMax)),\n              M.rotateXInvert && (i = -i),\n              (u = Math.min(Math.max(-u, -M.rotateYMax), M.rotateYMax)),\n              M.rotateYInvert && (u = -u);\n            var S,\n              k,\n              q = (i / M.rotateXMax) * 100,\n              N = (u / M.rotateYMax) * 100,\n              B = (o ? (N / 100) * M.stretchX : 0) * (M.rotateYInvert ? -1 : 1),\n              Z = (o ? (q / 100) * M.stretchY : 0) * (M.rotateXInvert ? -1 : 1),\n              z = o\n                ? (Math.max(Math.abs(q), Math.abs(N)) / 100) * M.stretchZ\n                : 0;\n            T(\n              n,\n              "translate3d(" +\n                B +\n                "%, " +\n                -Z +\n                "%, " +\n                -z +\n                "px) rotateX(" +\n                i +\n                "deg) rotateY(" +\n                u +\n                "deg)"\n            ),\n              r &&\n                M.commonOrigin &&\n                ((S = n),\n                (k = r),\n                x.push({ element: S, prop: "transformOrigin", value: k })),\n              p &&\n                (O(p, M.duration + "ms"),\n                b(p, "ease-out"),\n                T(p, "translate3d(" + 0.25 * -N + "%, " + 0.25 * q + "%, 0)"),\n                X(p, Math.max(Math.abs(q), Math.abs(N)) / 100)),\n              L({\n                rotateXPercentage: q,\n                rotateYPercentage: N,\n                duration: M.duration + "ms",\n                easeOut: !0,\n              }),\n              "function" == typeof M.onRotate && M.onRotate(i, u);\n          },\n          E = function () {\n            x.push(function () {\n              return m.classList.add("atropos-active");\n            }),\n              O(n, M.duration + "ms"),\n              b(n, "ease-out"),\n              T(r, "translate3d(0,0, " + M.activeOffset + "px)"),\n              O(r, M.duration + "ms"),\n              b(r, "ease-out"),\n              u && (O(u, M.duration + "ms"), b(u, "ease-out")),\n              (g.isActive = !0);\n          },\n          R = function (t) {\n            if (\n              ((l = void 0),\n              !(\n                ("pointerdown" === t.type && "mouse" === t.pointerType) ||\n                ("pointerenter" === t.type && "mouse" !== t.pointerType)\n              ))\n            ) {\n              if (\n                ("pointerdown" === t.type && t.preventDefault(),\n                (d = t.clientX),\n                (f = t.clientY),\n                M.alwaysActive)\n              )\n                return (s = void 0), void (c = void 0);\n              E(), "function" == typeof M.onEnter && M.onEnter();\n            }\n          },\n          I = function (t) {\n            !1 === l && t.cancelable && t.preventDefault();\n          },\n          P = function (t) {\n            if (M.rotate && g.isActive) {\n              if ("mouse" !== t.pointerType) {\n                if (!M.rotateTouch) return;\n                t.preventDefault();\n              }\n              var e = t.clientX,\n                o = t.clientY,\n                a = e - d,\n                n = o - f;\n              if (\n                "string" == typeof M.rotateTouch &&\n                (0 !== a || 0 !== n) &&\n                void 0 === l\n              ) {\n                if (a * a + n * n >= 25) {\n                  var r =\n                    (180 * Math.atan2(Math.abs(n), Math.abs(a))) / Math.PI;\n                  l = "scroll-y" === M.rotateTouch ? r > 45 : 90 - r > 45;\n                }\n                !1 === l &&\n                  (m.classList.add("atropos-rotate-touch"),\n                  t.cancelable && t.preventDefault());\n              }\n              ("mouse" !== t.pointerType && l) || A(e, o);\n            }\n          },\n          j = function (t) {\n            if (\n              ((s = void 0),\n              (c = void 0),\n              g.isActive &&\n                !(\n                  (t && "pointerup" === t.type && "mouse" === t.pointerType) ||\n                  (t && "pointerleave" === t.type && "mouse" !== t.pointerType)\n                ))\n            ) {\n              if (\n                ("string" == typeof M.rotateTouch &&\n                  l &&\n                  m.classList.remove("atropos-rotate-touch"),\n                M.alwaysActive)\n              )\n                return (\n                  A(),\n                  "function" == typeof M.onRotate && M.onRotate(0, 0),\n                  void ("function" == typeof M.onLeave && M.onLeave())\n                );\n              x.push(function () {\n                return m.classList.remove("atropos-active");\n              }),\n                O(r, M.duration + "ms"),\n                b(r, ""),\n                T(r, "translate3d(0,0, 0px)"),\n                u && (O(u, M.duration + "ms"), b(u, "")),\n                p &&\n                  (O(p, M.duration + "ms"),\n                  b(p, ""),\n                  T(p, "translate3d(0, 0, 0)"),\n                  X(p, 0)),\n                O(n, M.duration + "ms"),\n                b(n, ""),\n                T(n, "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)"),\n                L({ duration: M.duration + "ms" }),\n                (g.isActive = !1),\n                "function" == typeof M.onRotate && M.onRotate(0, 0),\n                "function" == typeof M.onLeave && M.onLeave();\n            }\n          },\n          D = function (t) {\n            var e = t.target;\n            !y.contains(e) && e !== y && g.isActive && j();\n          };\n        return (\n          (g.destroy = function () {\n            (g.destroyed = !0),\n              cancelAnimationFrame(v),\n              _(document, "click", D),\n              _(y, "pointerdown", R),\n              _(y, "pointerenter", R),\n              _(y, "pointermove", P),\n              _(y, "touchmove", I),\n              _(y, "pointerleave", j),\n              _(y, "pointerup", j),\n              _(y, "lostpointercapture", j),\n              delete m.__atropos__;\n          }),\n          "string" == typeof m && (m = e(document, m)),\n          m &&\n            (m.__atropos__ ||\n              (void 0 !== y\n                ? "string" == typeof y && (y = e(document, y))\n                : (y = m),\n              Object.assign(g, { el: m }),\n              (n = e(m, ".atropos-rotate")),\n              (r = e(m, ".atropos-scale")),\n              (i = e(m, ".atropos-inner")),\n              (m.__atropos__ = g))),\n          m &&\n            y &&\n            (M.shadow &&\n              ((u = e(m, ".atropos-shadow")) ||\n                ((u = document.createElement("span")).classList.add(\n                  "atropos-shadow"\n                ),\n                (w = !0)),\n              T(\n                u,\n                "translate3d(0,0,-" +\n                  M.shadowOffset +\n                  "px) scale(" +\n                  M.shadowScale +\n                  ")"\n              ),\n              w && n.appendChild(u)),\n            M.highlight &&\n              (function () {\n                var t;\n                (p = e(m, ".atropos-highlight")) ||\n                  ((p = document.createElement("span")).classList.add(\n                    "atropos-highlight"\n                  ),\n                  (t = !0)),\n                  T(p, "translate3d(0,0,0)"),\n                  t && i.appendChild(p);\n              })(),\n            M.rotateTouch &&\n              ("string" == typeof M.rotateTouch\n                ? m.classList.add("atropos-rotate-touch-" + M.rotateTouch)\n                : m.classList.add("atropos-rotate-touch")),\n            e(m, "[data-atropos-opacity]") && L({ opacityOnly: !0 }),\n            Y(document, "click", D),\n            Y(y, "pointerdown", R),\n            Y(y, "pointerenter", R),\n            Y(y, "pointermove", P),\n            Y(y, "touchmove", I),\n            Y(y, "pointerleave", j),\n            Y(y, "pointerup", j),\n            Y(y, "lostpointercapture", j),\n            M.alwaysActive && (E(), A())),\n          g\n        );\n      };\n    }); /* eslint-enable */\n    /* eslint-enable */\n    window.Atropos({\n      el: ".atropos",\n      activeOffset: 120,\n      shadowScale: 5,\n    });\n  <\/script>\n</header>'])), maybeRenderHead($$result), renderComponent($$result, "FaGithub", FaGithub, { "class": "astro-P6N2V6TL" }), renderComponent($$result, "FaLinkedin", FaLinkedin, { "class": "astro-P6N2V6TL" }));
});

const $$file$a = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Hero.astro";
const $$url$a = undefined;

const $$module4$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$Hero,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/PortfolioPreview.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/PortfolioPreview.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$PortfolioPreview = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$PortfolioPreview;
  const { frontmatter, url } = Astro2.props.project;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="card astro-OWRC7WMI">
	<div class="titleCard astro-OWRC7WMI"${addAttribute(`background-image:url(${frontmatter.img})`, "style")}>
		<h1 class="title astro-OWRC7WMI">${frontmatter.title}</h1>
	</div>
	<div class="descCard astro-OWRC7WMI">
		<p class="desc astro-OWRC7WMI">${frontmatter.description}</p>
		<div class="tags astro-OWRC7WMI">
			Tagged:
			${frontmatter.tags.map((t) => renderTemplate`<div class="tag astro-OWRC7WMI"${addAttribute(t, "data-tag")}>
					${t}
				</div>`)}
		</div>
		<a class="link astro-OWRC7WMI"${addAttribute(url, "href")}>
			<span class="linkInner astro-OWRC7WMI">View</span>
		</a>
	</div>
</div>

`;
});

const $$file$9 = "C:/Users/16233/Desktop/projects/Portfolio/src/components/PortfolioPreview.astro";
const $$url$9 = undefined;

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$PortfolioPreview,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Featured.astro", { modules: [{ module: $$module4, specifier: "../components/PortfolioPreview.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Featured.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Featured = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Featured;
  const projects = await Astro2.glob(
    /* #__PURE__ */ Object.assign({"../pages/project/imagineai.md": () => Promise.resolve().then(() => _page5),"../pages/project/investmentdash.md": () => Promise.resolve().then(() => _page3),"../pages/project/nested/notesonline.md": () => Promise.resolve().then(() => _page8),"../pages/project/resumebuilder.md": () => Promise.resolve().then(() => _page4),"../pages/project/teamdash.md": () => Promise.resolve().then(() => _page6),"../pages/project/techblog.md": () => Promise.resolve().then(() => _page7)}),
    () => "../pages/project/**/*.md"
  );
  const featuredProject = projects[0];
  return renderTemplate`${maybeRenderHead($$result)}<div class="py-10">
  <div class="section">
    <h3 class="text-center font-mplus text-xl md:text-xl lg:text-2xl p-4 font-semibold">Featured Project</h3>
    ${renderComponent($$result, "PortfolioPreview", $$PortfolioPreview, { "project": featuredProject })}
    <div class="flex justify-end p-4">
      <a href="/projects/" class="font-kosugi">View All</a>
    </div>
  </div>
</div>`;
});

const $$file$8 = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Featured.astro";
const $$url$8 = undefined;

const $$module5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Featured,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Body.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Body.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Body = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Body;
  return renderTemplate`${maybeRenderHead($$result)}<body class="bg-white dark:bg-slate-900 text-zinc-900 dark:text-zinc-300 break-words leading-6 transition-colors duration-500">${renderSlot($$result, $$slots["default"])}</body>`;
});

const $$file$7 = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Body.astro";
const $$url$7 = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$Body,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Aboutme.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/components/Aboutme.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Aboutme = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Aboutme;
  return renderTemplate`${maybeRenderHead($$result)}<div class="section">
    <h3 class="sectionTitle">About me</h3>
    <p class="font-mplus">
      <span>Hello!</span> I’m Jeanine, and this is my website. It was made using${" "}
      <a href="https://github.com/withastro/astro" target="_blank" rel="nofollow">
        Astro</a>, a new way to build static sites. This is just an example template
      for you to modify.
    </p>
    <p>
      <a href="/about">Read more</a>
    </p>
  </div>`;
});

const $$file$6 = "C:/Users/16233/Desktop/projects/Portfolio/src/components/Aboutme.astro";
const $$url$6 = undefined;

const $$module6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$Aboutme,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/index.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4$1, specifier: "../components/Hero.astro", assert: {} }, { module: $$module5, specifier: "../components/Featured.astro", assert: {} }, { module: $$module6, specifier: "../components/Aboutme.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/index.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "MainHead", $$MainHead, { "title": "Booker King | Portfolio", "description": "Booker King: Developer, Creative-Thinker, and Problem-Solver" })}
  ${renderHead($$result)}</head>
  ${renderComponent($$result, "Body", $$Body, {}, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, {})}<main class="mx-auto">
      ${renderComponent($$result, "Hero", $$Hero, {})}
      ${renderComponent($$result, "Featured", $$Featured, {})}
	  <!-- <Aboutme /> -->
    </main>${renderComponent($$result, "Footer", $$Footer, {})}` })}
</html>`;
});

const $$file$5 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/index.astro";
const $$url$5 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$Index,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/projects.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }, { module: $$module4, specifier: "../components/PortfolioPreview.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/projects.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Projects;
  const projects = (await Astro2.glob(/* #__PURE__ */ Object.assign({"./project/imagineai.md": () => Promise.resolve().then(() => _page5),"./project/investmentdash.md": () => Promise.resolve().then(() => _page3),"./project/nested/notesonline.md": () => Promise.resolve().then(() => _page8),"./project/resumebuilder.md": () => Promise.resolve().then(() => _page4),"./project/teamdash.md": () => Promise.resolve().then(() => _page6),"./project/techblog.md": () => Promise.resolve().then(() => _page7)}), () => "./project/**/*.md")).filter(({ frontmatter }) => !!frontmatter.publishDate).sort(
    (a, b) => new Date(b.frontmatter.publishDate).valueOf() - new Date(a.frontmatter.publishDate).valueOf()
  );
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-5LH2ILPV">
  <head>
    ${renderComponent($$result, "MainHead", $$MainHead, { "title": "All Projects | Booker", "description": "Learn about Booker King most recent projects", "class": "astro-5LH2ILPV" })}
  ${renderHead($$result)}</head>
  ${renderComponent($$result, "Body", $$Body, { "class": "astro-5LH2ILPV" }, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "class": "astro-5LH2ILPV" })}<div class="flex 1 astro-5LH2ILPV"></div><h1 class="mt-20 pt-[56px] mb-5 text-center font-mplus text-xl md:text-xl lg:text-2xl p-2 font-semibold astro-5LH2ILPV">
      All Projects
    </h1><div class="grid mb-5 astro-5LH2ILPV">
      ${projects.map((project) => renderTemplate`${renderComponent($$result, "PortfolioPreview", $$PortfolioPreview, { "project": project, "class": "astro-5LH2ILPV" })}`)}
    </div>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-5LH2ILPV" })}` })}
  

</html>`;
});

const $$file$4 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/projects.astro";
const $$url$4 = "/projects";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Projects,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/contact.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/contact.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "MainHead", $$MainHead, { "title": "Contact | Jeanine White", "description": "Contact Booker King, a web developer and designer based in North Carolina." })}
  ${renderHead($$result)}</head>
  ${renderComponent($$result, "Body", $$Body, {}, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, {})}<h1>Contact</h1>${renderComponent($$result, "Footer", $$Footer, {})}` })}
</html>`;
});

const $$file$3 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/contact.astro";
const $$url$3 = "/contact";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Contact,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/layouts/project.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/layouts/project.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Project = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Project;
  const { content } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html${addAttribute(content.lang || "en", "lang")} class="astro-LBTXFUTP">
  <head>
    ${renderComponent($$result, "MainHead", $$MainHead, { "title": content.title, "description": content.description, "class": "astro-LBTXFUTP" })}
    
  ${renderHead($$result)}</head>
  ${renderComponent($$result, "Body", $$Body, { "class": "astro-LBTXFUTP" }, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "class": "astro-LBTXFUTP" })}<div class="flex-1 w-full pt-[64px] astro-LBTXFUTP"></div><header${addAttribute(`background-image:url(${content.img})`, "style")} class="hero pt-[56px] astro-LBTXFUTP">
      <h1 class="title astro-LBTXFUTP">${content.title}</h1>
    </header><div class="leadIn astro-LBTXFUTP">
      <div class="wrapper astro-LBTXFUTP">
        ${content.tags.map((t) => renderTemplate`<span class="tag astro-LBTXFUTP">${t}</span>`)}
        <h3 class="tagline astro-LBTXFUTP">${content.description}</h3>
      </div>
    </div><div class="wrapper astro-LBTXFUTP">
      <div class="content astro-LBTXFUTP">${renderSlot($$result, $$slots["default"])}</div>
      <div class="flex justify-center items center gap-5 astro-LBTXFUTP">
        <a${addAttribute(content.appLink, "href")} class="astro-LBTXFUTP">
          <button id="link" type="submit" class="hover:text-orange-300 astro-LBTXFUTP">App Link</button>
        </a>
        <a${addAttribute(content.github, "href")} class="astro-LBTXFUTP">
          <button id="github" class="hover:text-orange-300 astro-LBTXFUTP">GitHub</button>
        </a>
      </div>
    </div><footer class="astro-LBTXFUTP">
      <a href="/projects" class="button astro-LBTXFUTP">View More</a>
    </footer>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-LBTXFUTP" })}` })}

</html>`;
});

const html$5 = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter$5 = {"layout":"../../layouts/project.astro","title":"Investment Dashboard","client":"Self","publishDate":"2020-03-02T00:00:00.000Z","img":"../../../public/assets/ipd.svg","description":"Online investment dashboard that allows users to manage their stock portfolios.\n","appLink":"https://cpm-128.github.io/investment-portfolio-dashboard/","github":"https://github.com/cpm-128/investment-portfolio-dashboard","tags":["HTML","CSS","JS"]};
				const file$5 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/investmentdash.md";
				const url$5 = "/project/investmentdash";
				function rawContent$5() {
					return "\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\n\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\n\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\n\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\n\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.\n";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [];
				}
				function getHeaders$5() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$5();
				}				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.file = file$5;
					content.url = url$5;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return createVNode($$Project, {
									file: file$5,
									url: url$5,
									content,
									frontmatter: content,
									headings: getHeadings$5(),
									rawContent: rawContent$5,
									compiledContent: compiledContent$5,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$5[Symbol.for('astro.needsHeadRendering')] = false;

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$5,
	file: file$5,
	url: url$5,
	rawContent: rawContent$5,
	compiledContent: compiledContent$5,
	getHeadings: getHeadings$5,
	getHeaders: getHeaders$5,
	Content: Content$5,
	default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter$4 = {"layout":"../../layouts/project.astro","title":"Resume Builder","client":"Self","publishDate":"2022-09-22T00:00:00.000Z","img":"../../../public/assets/resumeBuilder.jpg","description":"We built a web application that uses machine learning to generate images based on a prompt you provide.\n","github":"https://github.com/chrisdhodges12/resume-builder","appLink":"https://salty-wildwood-94158.herokuapp.com/","tags":["JS","React","Node","Express","MySQL"]};
				const file$4 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/resumebuilder.md";
				const url$4 = "/project/resumebuilder";
				function rawContent$4() {
					return "\r\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\r\n\r\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\r\n\r\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\r\n\r\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\r\n\r\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.\r\n";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [];
				}
				function getHeaders$4() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return createVNode($$Project, {
									file: file$4,
									url: url$4,
									content,
									frontmatter: content,
									headings: getHeadings$4(),
									rawContent: rawContent$4,
									compiledContent: compiledContent$4,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = false;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$4,
	file: file$4,
	url: url$4,
	rawContent: rawContent$4,
	compiledContent: compiledContent$4,
	getHeadings: getHeadings$4,
	getHeaders: getHeaders$4,
	Content: Content$4,
	default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter$3 = {"layout":"../../layouts/project.astro","title":"Image AI","client":"Self","publishDate":"2022-09-22T00:00:00.000Z","img":"../../../public/assets/imagineai.svg","description":"Image AI is a web application that uses machine learning to classify images of animals and objects.\n","appLink":"https://project2-app-btking.herokuapp.com/","github":"https://github.com/btking1/project-2","tags":["JS","React","Node","Express","MySQL"]};
				const file$3 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/imagineai.md";
				const url$3 = "/project/imagineai";
				function rawContent$3() {
					return "\r\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\r\n\r\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\r\n\r\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\r\n\r\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\r\n\r\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.\r\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return createVNode($$Project, {
									file: file$3,
									url: url$3,
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$3,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter$2 = {"layout":"../../layouts/project.astro","title":"Team Dashboard","client":"Self","publishDate":"2020-03-04T00:00:00.000Z","img":"../../../public/assets/teamdash.svg","description":"Command line team management tool.\n","github":"https://github.com/btking1/Eng-Team-Profile-Generator","appLink":"https://github.com/btking1/Eng-Team-Profile-Generator","tags":["HTML","CSS","JS","Node","Markdown"]};
				const file$2 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/teamdash.md";
				const url$2 = "/project/teamdash";
				function rawContent$2() {
					return "\r\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\r\n\r\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\r\n\r\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\r\n\r\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\r\n\r\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$Project, {
									file: file$2,
									url: url$2,
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$2,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter$1 = {"layout":"../../layouts/project.astro","title":"Tech Blog","client":"Self","publishDate":"2020-03-04T00:00:00.000Z","img":"../../../public/assets/techblog.svg","description":"Blog based app that allows for creation of users and posts through RESTful API.\n","appLink":"https://tech-talk-mvc.herokuapp.com/login","github":"https://github.com/btking1/Tech-Talk-blog","tags":["HTML","CSS","JS","Node","SQL"]};
				const file$1 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/techblog.md";
				const url$1 = "/project/techblog";
				function rawContent$1() {
					return "\r\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\r\n\r\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\r\n\r\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\r\n\r\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\r\n\r\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.\r\n";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$Project, {
									file: file$1,
									url: url$1,
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders: getHeaders$1,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>Rubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody’s happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.</p>\n<p>Smelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody’s happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.</p>\n<p>Fromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody’s happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody’s happy pecorino cottage cheese.</p>\n<p>Caerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody’s happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody’s happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.</p>\n<p>Cheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody’s happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.</p>";

				const frontmatter = {"layout":"../../../layouts/project.astro","title":"Note Taker","client":"Self","publishDate":"2020-03-04T00:00:00.000Z","img":"../../../public/assets/notesonline.svg","description":"A web application that allows users to create, edit, and delete notes.\n","appLink":"https://notesmonline.herokuapp.com/","github":"https://github.com/btking1/notesOnline","tags":["HTML","CSS","JS","Node","Express"]};
				const file = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/project/nested/notesonline.md";
				const url = "/project/nested/notesonline";
				function rawContent() {
					return "\nRubber cheese mascarpone cut the cheese. Jarlsberg parmesan cheesy grin cream cheese port-salut stinking bishop ricotta brie. Roquefort when the cheese comes out everybody's happy goat cheese triangles stilton cheese and biscuits goat babybel. Bocconcini roquefort queso danish fontina pecorino.\n\nSmelly cheese stinking bishop roquefort. Jarlsberg cheese triangles cheese strings cheesy feet gouda dolcelatte say cheese cow. Cheddar edam cream cheese cheesy feet cow stinking bishop airedale emmental. Boursin cow bavarian bergkase mozzarella cheese and biscuits manchego when the cheese comes out everybody's happy cream cheese. Cheese on toast st. agur blue cheese croque monsieur halloumi.\n\nFromage frais jarlsberg st. agur blue cheese. Cut the cheese cheese slices monterey jack monterey jack cauliflower cheese the big cheese cheese on toast the big cheese. Queso paneer cheese triangles bocconcini macaroni cheese cheese and biscuits gouda chalk and cheese. Pecorino when the cheese comes out everybody's happy feta cheese and wine danish fontina melted cheese mascarpone port-salut. When the cheese comes out everybody's happy pecorino cottage cheese.\n\nCaerphilly parmesan manchego. Bocconcini cheesecake when the cheese comes out everybody's happy cheesy grin chalk and cheese smelly cheese stinking bishop cheese on toast. Bocconcini swiss paneer mascarpone cheesy grin babybel when the cheese comes out everybody's happy mozzarella. Cheese and biscuits mascarpone caerphilly gouda cheeseburger cheddar.\n\nCheese and biscuits cheesy grin roquefort. Ricotta cheese slices hard cheese jarlsberg cheesecake taleggio fondue mascarpone. Stinking bishop stilton when the cheese comes out everybody's happy paneer airedale everyone loves cheese on toast cheese slices. Ricotta cut the cheese cheese triangles babybel cream cheese ricotta.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$Project, {
									file,
									url,
									content,
									frontmatter: content,
									headings: getHeadings(),
									rawContent,
									compiledContent,
									'server:root': true,
									children: contentFragment
								});
				}
				Content[Symbol.for('astro.needsHeadRendering')] = false;

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/resume.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/resume.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$Resume = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Resume;
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "MainHead", $$MainHead, { "title": "Resume | Booker King", "description": "Resume page" })}
  ${renderHead($$result)}</head>
  ${renderComponent($$result, "Body", $$Body, {}, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, {})}<h1>Resume</h1>${renderComponent($$result, "Footer", $$Footer, {})}` })}
</html>`;
});

const $$file$2 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/resume.astro";
const $$url$2 = "/resume";

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$Resume,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$metadata$1 = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/about.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2, specifier: "../components/Body.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/about.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$About;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="astro-NBG3H6NB">\n  <head>\n    ', "\n    \n  ", "</head>\n</html>\n", '\n<script type="module">\n  // @ts-nocheck\n  /* eslint-disable */\n  !(function (t, e) {\n    "object" == typeof exports && "undefined" != typeof module\n      ? (module.exports = e())\n      : "function" == typeof define && define.amd\n      ? define(e)\n      : ((t =\n          "undefined" != typeof globalThis ? globalThis : t || self).Atropos =\n          e());\n  })(this, function () {\n    "use strict";\n    function t() {\n      return (t =\n        Object.assign ||\n        function (t) {\n          for (var e = 1; e < arguments.length; e++) {\n            var o = arguments[e];\n            for (var a in o)\n              Object.prototype.hasOwnProperty.call(o, a) && (t[a] = o[a]);\n          }\n          return t;\n        }).apply(this, arguments);\n    }\n    var e = function (t, e) {\n        return t.querySelector(e);\n      },\n      o = function (t) {\n        void 0 === t && (t = {});\n        var e = {};\n        return (\n          Object.keys(t).forEach(function (o) {\n            void 0 !== t[o] && (e[o] = t[o]);\n          }),\n          e\n        );\n      };\n    return function (a) {\n      void 0 === a && (a = {});\n      var n,\n        r,\n        i,\n        s,\n        c,\n        u,\n        p,\n        l,\n        d,\n        f,\n        v,\n        h = a,\n        m = h.el,\n        y = h.eventsEl,\n        g = {\n          __atropos__: !0,\n          params: t(\n            {\n              alwaysActive: !1,\n              activeOffset: 50,\n              shadowOffset: 50,\n              shadowScale: 1,\n              duration: 300,\n              rotate: !0,\n              rotateTouch: !0,\n              rotateXMax: 15,\n              rotateYMax: 15,\n              rotateXInvert: !1,\n              rotateYInvert: !1,\n              stretchX: 0,\n              stretchY: 0,\n              stretchZ: 0,\n              commonOrigin: !0,\n              shadow: !0,\n              highlight: !0,\n              onEnter: null,\n              onLeave: null,\n              onRotate: null,\n            },\n            o(a || {})\n          ),\n          destroyed: !1,\n          isActive: !1,\n        },\n        M = g.params,\n        x = [];\n      !(function t() {\n        v = requestAnimationFrame(function () {\n          x.forEach(function (t) {\n            if ("function" == typeof t) t();\n            else {\n              var e = t.element,\n                o = t.prop,\n                a = t.value;\n              e.style[o] = a;\n            }\n          }),\n            x.splice(0, x.length),\n            t();\n        });\n      })();\n      var w,\n        O = function (t, e) {\n          x.push({ element: t, prop: "transitionDuration", value: e });\n        },\n        b = function (t, e) {\n          x.push({ element: t, prop: "transitionTimingFunction", value: e });\n        },\n        T = function (t, e) {\n          x.push({ element: t, prop: "transform", value: e });\n        },\n        X = function (t, e) {\n          x.push({ element: t, prop: "opacity", value: e });\n        },\n        Y = function (t, e, o, a) {\n          return t.addEventListener(e, o, a);\n        },\n        _ = function (t, e, o, a) {\n          return t.removeEventListener(e, o, a);\n        },\n        L = function (t) {\n          var e = t.rotateXPercentage,\n            o = void 0 === e ? 0 : e,\n            a = t.rotateYPercentage,\n            n = void 0 === a ? 0 : a,\n            r = t.duration,\n            i = t.opacityOnly,\n            s = t.easeOut;\n          (function (t, e) {\n            return t.querySelectorAll(e);\n          })(m, "[data-atropos-offset], [data-atropos-opacity]").forEach(\n            function (t) {\n              O(t, r), b(t, s ? "ease-out" : "");\n              var e = (function (t) {\n                if (\n                  t.dataset.atroposOpacity &&\n                  "string" == typeof t.dataset.atroposOpacity\n                )\n                  return t.dataset.atroposOpacity.split(";").map(function (t) {\n                    return parseFloat(t);\n                  });\n              })(t);\n              if (0 === o && 0 === n)\n                i || T(t, "translate3d(0, 0, 0)"), e && X(t, e[0]);\n              else {\n                var a = parseFloat(t.dataset.atroposOffset) / 100;\n                if (\n                  (Number.isNaN(a) ||\n                    i ||\n                    T(t, "translate3d(" + -n * -a + "%, " + o * -a + "%, 0)"),\n                  e)\n                ) {\n                  var c = e[0],\n                    u = e[1],\n                    p = Math.max(Math.abs(o), Math.abs(n));\n                  X(t, c + ((u - c) * p) / 100);\n                }\n              }\n            }\n          );\n        },\n        A = function (t, e) {\n          var o = m !== y;\n          if (\n            (s || (s = m.getBoundingClientRect()),\n            o && !c && (c = y.getBoundingClientRect()),\n            void 0 === t && void 0 === e)\n          ) {\n            var a = o ? c : s;\n            (t = a.left + a.width / 2), (e = a.top + a.height / 2);\n          }\n          var r,\n            i = 0,\n            u = 0,\n            l = s,\n            d = l.top,\n            f = l.left,\n            v = l.width,\n            h = l.height;\n          if (o) {\n            var g = c,\n              w = g.top,\n              Y = g.left,\n              _ = g.width,\n              A = g.height,\n              E = v / 2 + (f - Y),\n              R = h / 2 + (d - w),\n              I = t - Y,\n              P = e - w;\n            (u = ((M.rotateYMax * (I - E)) / (_ - v / 2)) * -1),\n              (i = (M.rotateXMax * (P - R)) / (A - h / 2)),\n              (r = t - f + "px " + (e - d) + "px");\n          } else {\n            var j = v / 2,\n              D = h / 2,\n              F = t - f,\n              C = e - d;\n            (u = ((M.rotateYMax * (F - j)) / (v / 2)) * -1),\n              (i = (M.rotateXMax * (C - D)) / (h / 2));\n          }\n          (i = Math.min(Math.max(-i, -M.rotateXMax), M.rotateXMax)),\n            M.rotateXInvert && (i = -i),\n            (u = Math.min(Math.max(-u, -M.rotateYMax), M.rotateYMax)),\n            M.rotateYInvert && (u = -u);\n          var S,\n            k,\n            q = (i / M.rotateXMax) * 100,\n            N = (u / M.rotateYMax) * 100,\n            B = (o ? (N / 100) * M.stretchX : 0) * (M.rotateYInvert ? -1 : 1),\n            Z = (o ? (q / 100) * M.stretchY : 0) * (M.rotateXInvert ? -1 : 1),\n            z = o ? (Math.max(Math.abs(q), Math.abs(N)) / 100) * M.stretchZ : 0;\n          T(\n            n,\n            "translate3d(" +\n              B +\n              "%, " +\n              -Z +\n              "%, " +\n              -z +\n              "px) rotateX(" +\n              i +\n              "deg) rotateY(" +\n              u +\n              "deg)"\n          ),\n            r &&\n              M.commonOrigin &&\n              ((S = n),\n              (k = r),\n              x.push({ element: S, prop: "transformOrigin", value: k })),\n            p &&\n              (O(p, M.duration + "ms"),\n              b(p, "ease-out"),\n              T(p, "translate3d(" + 0.25 * -N + "%, " + 0.25 * q + "%, 0)"),\n              X(p, Math.max(Math.abs(q), Math.abs(N)) / 100)),\n            L({\n              rotateXPercentage: q,\n              rotateYPercentage: N,\n              duration: M.duration + "ms",\n              easeOut: !0,\n            }),\n            "function" == typeof M.onRotate && M.onRotate(i, u);\n        },\n        E = function () {\n          x.push(function () {\n            return m.classList.add("atropos-active");\n          }),\n            O(n, M.duration + "ms"),\n            b(n, "ease-out"),\n            T(r, "translate3d(0,0, " + M.activeOffset + "px)"),\n            O(r, M.duration + "ms"),\n            b(r, "ease-out"),\n            u && (O(u, M.duration + "ms"), b(u, "ease-out")),\n            (g.isActive = !0);\n        },\n        R = function (t) {\n          if (\n            ((l = void 0),\n            !(\n              ("pointerdown" === t.type && "mouse" === t.pointerType) ||\n              ("pointerenter" === t.type && "mouse" !== t.pointerType)\n            ))\n          ) {\n            if (\n              ("pointerdown" === t.type && t.preventDefault(),\n              (d = t.clientX),\n              (f = t.clientY),\n              M.alwaysActive)\n            )\n              return (s = void 0), void (c = void 0);\n            E(), "function" == typeof M.onEnter && M.onEnter();\n          }\n        },\n        I = function (t) {\n          !1 === l && t.cancelable && t.preventDefault();\n        },\n        P = function (t) {\n          if (M.rotate && g.isActive) {\n            if ("mouse" !== t.pointerType) {\n              if (!M.rotateTouch) return;\n              t.preventDefault();\n            }\n            var e = t.clientX,\n              o = t.clientY,\n              a = e - d,\n              n = o - f;\n            if (\n              "string" == typeof M.rotateTouch &&\n              (0 !== a || 0 !== n) &&\n              void 0 === l\n            ) {\n              if (a * a + n * n >= 25) {\n                var r = (180 * Math.atan2(Math.abs(n), Math.abs(a))) / Math.PI;\n                l = "scroll-y" === M.rotateTouch ? r > 45 : 90 - r > 45;\n              }\n              !1 === l &&\n                (m.classList.add("atropos-rotate-touch"),\n                t.cancelable && t.preventDefault());\n            }\n            ("mouse" !== t.pointerType && l) || A(e, o);\n          }\n        },\n        j = function (t) {\n          if (\n            ((s = void 0),\n            (c = void 0),\n            g.isActive &&\n              !(\n                (t && "pointerup" === t.type && "mouse" === t.pointerType) ||\n                (t && "pointerleave" === t.type && "mouse" !== t.pointerType)\n              ))\n          ) {\n            if (\n              ("string" == typeof M.rotateTouch &&\n                l &&\n                m.classList.remove("atropos-rotate-touch"),\n              M.alwaysActive)\n            )\n              return (\n                A(),\n                "function" == typeof M.onRotate && M.onRotate(0, 0),\n                void ("function" == typeof M.onLeave && M.onLeave())\n              );\n            x.push(function () {\n              return m.classList.remove("atropos-active");\n            }),\n              O(r, M.duration + "ms"),\n              b(r, ""),\n              T(r, "translate3d(0,0, 0px)"),\n              u && (O(u, M.duration + "ms"), b(u, "")),\n              p &&\n                (O(p, M.duration + "ms"),\n                b(p, ""),\n                T(p, "translate3d(0, 0, 0)"),\n                X(p, 0)),\n              O(n, M.duration + "ms"),\n              b(n, ""),\n              T(n, "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)"),\n              L({ duration: M.duration + "ms" }),\n              (g.isActive = !1),\n              "function" == typeof M.onRotate && M.onRotate(0, 0),\n              "function" == typeof M.onLeave && M.onLeave();\n          }\n        },\n        D = function (t) {\n          var e = t.target;\n          !y.contains(e) && e !== y && g.isActive && j();\n        };\n      return (\n        (g.destroy = function () {\n          (g.destroyed = !0),\n            cancelAnimationFrame(v),\n            _(document, "click", D),\n            _(y, "pointerdown", R),\n            _(y, "pointerenter", R),\n            _(y, "pointermove", P),\n            _(y, "touchmove", I),\n            _(y, "pointerleave", j),\n            _(y, "pointerup", j),\n            _(y, "lostpointercapture", j),\n            delete m.__atropos__;\n        }),\n        "string" == typeof m && (m = e(document, m)),\n        m &&\n          (m.__atropos__ ||\n            (void 0 !== y\n              ? "string" == typeof y && (y = e(document, y))\n              : (y = m),\n            Object.assign(g, { el: m }),\n            (n = e(m, ".atropos-rotate")),\n            (r = e(m, ".atropos-scale")),\n            (i = e(m, ".atropos-inner")),\n            (m.__atropos__ = g))),\n        m &&\n          y &&\n          (M.shadow &&\n            ((u = e(m, ".atropos-shadow")) ||\n              ((u = document.createElement("span")).classList.add(\n                "atropos-shadow"\n              ),\n              (w = !0)),\n            T(\n              u,\n              "translate3d(0,0,-" +\n                M.shadowOffset +\n                "px) scale(" +\n                M.shadowScale +\n                ")"\n            ),\n            w && n.appendChild(u)),\n          M.highlight &&\n            (function () {\n              var t;\n              (p = e(m, ".atropos-highlight")) ||\n                ((p = document.createElement("span")).classList.add(\n                  "atropos-highlight"\n                ),\n                (t = !0)),\n                T(p, "translate3d(0,0,0)"),\n                t && i.appendChild(p);\n            })(),\n          M.rotateTouch &&\n            ("string" == typeof M.rotateTouch\n              ? m.classList.add("atropos-rotate-touch-" + M.rotateTouch)\n              : m.classList.add("atropos-rotate-touch")),\n          e(m, "[data-atropos-opacity]") && L({ opacityOnly: !0 }),\n          Y(document, "click", D),\n          Y(y, "pointerdown", R),\n          Y(y, "pointerenter", R),\n          Y(y, "pointermove", P),\n          Y(y, "touchmove", I),\n          Y(y, "pointerleave", j),\n          Y(y, "pointerup", j),\n          Y(y, "lostpointercapture", j),\n          M.alwaysActive && (E(), A())),\n        g\n      );\n    };\n  }); /* eslint-enable */\n  /* eslint-enable */\n  window.Atropos({\n    el: ".atropos",\n    activeOffset: 120,\n    shadowScale: 5,\n  });\n<\/script>\n'])), renderComponent($$result, "MainHead", $$MainHead, { "title": "About | Jeanine White", "description": "About Jeanine White Lorem Ipsum", "class": "astro-NBG3H6NB" }), renderHead($$result), renderComponent($$result, "Body", $$Body, { "class": "astro-NBG3H6NB" }, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "class": "astro-NBG3H6NB" })}<div class="pt-[56px] flex flex-col max-w-full sm:max-w-[600px] mx-auto astro-NBG3H6NB">
    <h1 class="text-xl font-kosugi font-medium mt-10 content-center text-center astro-NBG3H6NB">
      About Booker King
    </h1>
    <div class="max-h-lg overflow-hidden flex justify-center astro-NBG3H6NB">
      <div id="dynamic-card" class="p-2.5 my-2 md:my-4 shadow-up dark:shadow-box-dark dark:bg-box-dark w-full 2xl:mx-auto rounded-lg flex justify-center items-center astro-NBG3H6NB">
        <div class="flex flex-col items-center justify-center astro-NBG3H6NB">
          <div class="atropos py-4 px-6 2xl:px-10 shadow-down dark:shadow-box-dark dark:bg-box-dark w-full m-auto astro-NBG3H6NB">
            <div class="atropos-scale astro-NBG3H6NB">
              <div class="atropos-rotate astro-NBG3H6NB">
                <div class="atropos-inner transition-all duration-700 relative p-2 border-2 rounded-md shadow-2xl border-light-blue-dark dark:border-gray-dark bg-gray-light-4 dark:bg-transparent md:backdrop-blur-sm flex flex-col astro-NBG3H6NB">
                  <div class="atropos-inner transition-all duration-700 relative py-4 px-2 md:px-8 2xl:px-15 border-4 rounded-md shadow-2xl border-light-blue-dark bg-gray-light-4 md:backdrop-blur-sm flex flex-col dark:border-gray-dark dark:bg-transparent dark:shadow-orange-dark astro-NBG3H6NB">
                    <div class="flex items-center justify-center pt-2 astro-NBG3H6NB" data-atropos-offset="5">
                      <img class="p-4 mx-auto astro-NBG3H6NB" width="100%" src="../../public/assets/avatar.png">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bio wrapper astro-NBG3H6NB">
      <p class="text-lg leading-10 font-architects p-4 astro-NBG3H6NB">
        Developer based in North Carolina with expertise in building full-stack
        applications. In my work, I combine compelling design with creative
        problem-solving. My goal is to provide an easy-to-use, intuitive, and
        user-friendly application.
      </p>
    </div>
  </div>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-NBG3H6NB" })}` }));
});

const $$file$1 = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/about.astro";
const $$url$1 = "/about";

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$About,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/404.astro", { modules: [{ module: $$module1, specifier: "../components/MainHead.astro", assert: {} }, { module: $$module2$1, specifier: "../components/Footer.astro", assert: {} }, { module: $$module3, specifier: "../components/Nav.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/C:/Users/16233/Desktop/projects/Portfolio/src/pages/404.astro", "", "file:///C:/Users/16233/Desktop/projects/Portfolio/");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-3YLR36TQ">
	<head>
		${renderComponent($$result, "MainHead", $$MainHead, { "title": "Not Found", "class": "astro-3YLR36TQ" })}
		
	${renderHead($$result)}</head>
	<body class="astro-3YLR36TQ">
		${renderComponent($$result, "Nav", $$Nav, { "class": "astro-3YLR36TQ" })}
		<div class="wrapper astro-3YLR36TQ">
			<h1 class="astro-3YLR36TQ">Page Not Found</h1>
			<p class="astro-3YLR36TQ">Not found</p>
		</div>
		${renderComponent($$result, "Footer", $$Footer, { "class": "astro-3YLR36TQ" })}
	</body></html>`;
});

const $$file = "C:/Users/16233/Desktop/projects/Portfolio/src/pages/404.astro";
const $$url = "/404";

const _page11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$404,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/projects.astro', _page1],['src/pages/contact.astro', _page2],['src/pages/project/investmentdash.md', _page3],['src/pages/project/resumebuilder.md', _page4],['src/pages/project/imagineai.md', _page5],['src/pages/project/teamdash.md', _page6],['src/pages/project/techblog.md', _page7],['src/pages/project/nested/notesonline.md', _page8],['src/pages/resume.astro', _page9],['src/pages/about.astro', _page10],['src/pages/404.astro', _page11],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

export { pageMap, renderers };
