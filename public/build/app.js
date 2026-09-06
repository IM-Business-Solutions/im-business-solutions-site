//#region node_modules/@hotwired/stimulus/dist/stimulus.js
var e = class {
	constructor(e, t, n) {
		this.eventTarget = e, this.eventName = t, this.eventOptions = n, this.unorderedBindings = /* @__PURE__ */ new Set();
	}
	connect() {
		this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
	}
	disconnect() {
		this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
	}
	bindingConnected(e) {
		this.unorderedBindings.add(e);
	}
	bindingDisconnected(e) {
		this.unorderedBindings.delete(e);
	}
	handleEvent(e) {
		let n = t(e);
		for (let e of this.bindings) if (n.immediatePropagationStopped) break;
		else e.handleEvent(n);
	}
	hasBindings() {
		return this.unorderedBindings.size > 0;
	}
	get bindings() {
		return Array.from(this.unorderedBindings).sort((e, t) => {
			let n = e.index, r = t.index;
			return n < r ? -1 : +(n > r);
		});
	}
};
function t(e) {
	if ("immediatePropagationStopped" in e) return e;
	{
		let { stopImmediatePropagation: t } = e;
		return Object.assign(e, {
			immediatePropagationStopped: !1,
			stopImmediatePropagation() {
				this.immediatePropagationStopped = !0, t.call(this);
			}
		});
	}
}
var n = class {
	constructor(e) {
		this.application = e, this.eventListenerMaps = /* @__PURE__ */ new Map(), this.started = !1;
	}
	start() {
		this.started || (this.started = !0, this.eventListeners.forEach((e) => e.connect()));
	}
	stop() {
		this.started && (this.started = !1, this.eventListeners.forEach((e) => e.disconnect()));
	}
	get eventListeners() {
		return Array.from(this.eventListenerMaps.values()).reduce((e, t) => e.concat(Array.from(t.values())), []);
	}
	bindingConnected(e) {
		this.fetchEventListenerForBinding(e).bindingConnected(e);
	}
	bindingDisconnected(e, t = !1) {
		this.fetchEventListenerForBinding(e).bindingDisconnected(e), t && this.clearEventListenersForBinding(e);
	}
	handleError(e, t, n = {}) {
		this.application.handleError(e, `Error ${t}`, n);
	}
	clearEventListenersForBinding(e) {
		let t = this.fetchEventListenerForBinding(e);
		t.hasBindings() || (t.disconnect(), this.removeMappedEventListenerFor(e));
	}
	removeMappedEventListenerFor(e) {
		let { eventTarget: t, eventName: n, eventOptions: r } = e, i = this.fetchEventListenerMapForEventTarget(t), a = this.cacheKey(n, r);
		i.delete(a), i.size == 0 && this.eventListenerMaps.delete(t);
	}
	fetchEventListenerForBinding(e) {
		let { eventTarget: t, eventName: n, eventOptions: r } = e;
		return this.fetchEventListener(t, n, r);
	}
	fetchEventListener(e, t, n) {
		let r = this.fetchEventListenerMapForEventTarget(e), i = this.cacheKey(t, n), a = r.get(i);
		return a || (a = this.createEventListener(e, t, n), r.set(i, a)), a;
	}
	createEventListener(t, n, r) {
		let i = new e(t, n, r);
		return this.started && i.connect(), i;
	}
	fetchEventListenerMapForEventTarget(e) {
		let t = this.eventListenerMaps.get(e);
		return t || (t = /* @__PURE__ */ new Map(), this.eventListenerMaps.set(e, t)), t;
	}
	cacheKey(e, t) {
		let n = [e];
		return Object.keys(t).sort().forEach((e) => {
			n.push(`${t[e] ? "" : "!"}${e}`);
		}), n.join(":");
	}
}, r = {
	stop({ event: e, value: t }) {
		return t && e.stopPropagation(), !0;
	},
	prevent({ event: e, value: t }) {
		return t && e.preventDefault(), !0;
	},
	self({ event: e, value: t, element: n }) {
		return !t || n === e.target;
	}
}, i = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
function a(e) {
	let t = e.trim().match(i) || [], n = t[2], r = t[3];
	return r && ![
		"keydown",
		"keyup",
		"keypress"
	].includes(n) && (n += `.${r}`, r = ""), {
		eventTarget: o(t[4]),
		eventName: n,
		eventOptions: t[7] ? s(t[7]) : {},
		identifier: t[5],
		methodName: t[6],
		keyFilter: t[1] || r
	};
}
function o(e) {
	if (e == "window") return window;
	if (e == "document") return document;
}
function s(e) {
	return e.split(":").reduce((e, t) => Object.assign(e, { [t.replace(/^!/, "")]: !/^!/.test(t) }), {});
}
function c(e) {
	if (e == window) return "window";
	if (e == document) return "document";
}
function l(e) {
	return e.replace(/(?:[_-])([a-z0-9])/g, (e, t) => t.toUpperCase());
}
function u(e) {
	return l(e.replace(/--/g, "-").replace(/__/g, "_"));
}
function d(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
function f(e) {
	return e.replace(/([A-Z])/g, (e, t) => `-${t.toLowerCase()}`);
}
function ee(e) {
	return e.match(/[^\s]+/g) || [];
}
function te(e) {
	return e != null;
}
function p(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var m = [
	"meta",
	"ctrl",
	"alt",
	"shift"
], ne = class {
	constructor(e, t, n, r) {
		this.element = e, this.index = t, this.eventTarget = n.eventTarget || e, this.eventName = n.eventName || ie(e) || h("missing event name"), this.eventOptions = n.eventOptions || {}, this.identifier = n.identifier || h("missing identifier"), this.methodName = n.methodName || h("missing method name"), this.keyFilter = n.keyFilter || "", this.schema = r;
	}
	static forToken(e, t) {
		return new this(e.element, e.index, a(e.content), t);
	}
	toString() {
		let e = this.keyFilter ? `.${this.keyFilter}` : "", t = this.eventTargetName ? `@${this.eventTargetName}` : "";
		return `${this.eventName}${e}${t}->${this.identifier}#${this.methodName}`;
	}
	shouldIgnoreKeyboardEvent(e) {
		if (!this.keyFilter) return !1;
		let t = this.keyFilter.split("+");
		if (this.keyFilterDissatisfied(e, t)) return !0;
		let n = t.filter((e) => !m.includes(e))[0];
		return n ? (p(this.keyMappings, n) || h(`contains unknown key filter: ${this.keyFilter}`), this.keyMappings[n].toLowerCase() !== e.key.toLowerCase()) : !1;
	}
	shouldIgnoreMouseEvent(e) {
		if (!this.keyFilter) return !1;
		let t = [this.keyFilter];
		return !!this.keyFilterDissatisfied(e, t);
	}
	get params() {
		let e = {}, t = RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
		for (let { name: n, value: r } of Array.from(this.element.attributes)) {
			let i = n.match(t), a = i && i[1];
			a && (e[l(a)] = ae(r));
		}
		return e;
	}
	get eventTargetName() {
		return c(this.eventTarget);
	}
	get keyMappings() {
		return this.schema.keyMappings;
	}
	keyFilterDissatisfied(e, t) {
		let [n, r, i, a] = m.map((e) => t.includes(e));
		return e.metaKey !== n || e.ctrlKey !== r || e.altKey !== i || e.shiftKey !== a;
	}
}, re = {
	a: () => "click",
	button: () => "click",
	form: () => "submit",
	details: () => "toggle",
	input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
	select: () => "change",
	textarea: () => "input"
};
function ie(e) {
	let t = e.tagName.toLowerCase();
	if (t in re) return re[t](e);
}
function h(e) {
	throw Error(e);
}
function ae(e) {
	try {
		return JSON.parse(e);
	} catch {
		return e;
	}
}
var oe = class {
	constructor(e, t) {
		this.context = e, this.action = t;
	}
	get index() {
		return this.action.index;
	}
	get eventTarget() {
		return this.action.eventTarget;
	}
	get eventOptions() {
		return this.action.eventOptions;
	}
	get identifier() {
		return this.context.identifier;
	}
	handleEvent(e) {
		let t = this.prepareActionEvent(e);
		this.willBeInvokedByEvent(e) && this.applyEventModifiers(t) && this.invokeWithEvent(t);
	}
	get eventName() {
		return this.action.eventName;
	}
	get method() {
		let e = this.controller[this.methodName];
		if (typeof e == "function") return e;
		throw Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
	}
	applyEventModifiers(e) {
		let { element: t } = this.action, { actionDescriptorFilters: n } = this.context.application, { controller: r } = this.context, i = !0;
		for (let [a, o] of Object.entries(this.eventOptions)) if (a in n) {
			let s = n[a];
			i &&= s({
				name: a,
				value: o,
				event: e,
				element: t,
				controller: r
			});
		} else continue;
		return i;
	}
	prepareActionEvent(e) {
		return Object.assign(e, { params: this.action.params });
	}
	invokeWithEvent(e) {
		let { target: t, currentTarget: n } = e;
		try {
			this.method.call(this.controller, e), this.context.logDebugActivity(this.methodName, {
				event: e,
				target: t,
				currentTarget: n,
				action: this.methodName
			});
		} catch (t) {
			let { identifier: n, controller: r, element: i, index: a } = this, o = {
				identifier: n,
				controller: r,
				element: i,
				index: a,
				event: e
			};
			this.context.handleError(t, `invoking action "${this.action}"`, o);
		}
	}
	willBeInvokedByEvent(e) {
		let t = e.target;
		return e instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(e) || e instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(e) ? !1 : this.element === t ? !0 : t instanceof Element && this.element.contains(t) ? this.scope.containsElement(t) : this.scope.containsElement(this.action.element);
	}
	get controller() {
		return this.context.controller;
	}
	get methodName() {
		return this.action.methodName;
	}
	get element() {
		return this.scope.element;
	}
	get scope() {
		return this.context.scope;
	}
}, se = class {
	constructor(e, t) {
		this.mutationObserverInit = {
			attributes: !0,
			childList: !0,
			subtree: !0
		}, this.element = e, this.started = !1, this.delegate = t, this.elements = /* @__PURE__ */ new Set(), this.mutationObserver = new MutationObserver((e) => this.processMutations(e));
	}
	start() {
		this.started || (this.started = !0, this.mutationObserver.observe(this.element, this.mutationObserverInit), this.refresh());
	}
	pause(e) {
		this.started &&= (this.mutationObserver.disconnect(), !1), e(), this.started ||= (this.mutationObserver.observe(this.element, this.mutationObserverInit), !0);
	}
	stop() {
		this.started &&= (this.mutationObserver.takeRecords(), this.mutationObserver.disconnect(), !1);
	}
	refresh() {
		if (this.started) {
			let e = new Set(this.matchElementsInTree());
			for (let t of Array.from(this.elements)) e.has(t) || this.removeElement(t);
			for (let t of Array.from(e)) this.addElement(t);
		}
	}
	processMutations(e) {
		if (this.started) for (let t of e) this.processMutation(t);
	}
	processMutation(e) {
		e.type == "attributes" ? this.processAttributeChange(e.target, e.attributeName) : e.type == "childList" && (this.processRemovedNodes(e.removedNodes), this.processAddedNodes(e.addedNodes));
	}
	processAttributeChange(e, t) {
		this.elements.has(e) ? this.delegate.elementAttributeChanged && this.matchElement(e) ? this.delegate.elementAttributeChanged(e, t) : this.removeElement(e) : this.matchElement(e) && this.addElement(e);
	}
	processRemovedNodes(e) {
		for (let t of Array.from(e)) {
			let e = this.elementFromNode(t);
			e && this.processTree(e, this.removeElement);
		}
	}
	processAddedNodes(e) {
		for (let t of Array.from(e)) {
			let e = this.elementFromNode(t);
			e && this.elementIsActive(e) && this.processTree(e, this.addElement);
		}
	}
	matchElement(e) {
		return this.delegate.matchElement(e);
	}
	matchElementsInTree(e = this.element) {
		return this.delegate.matchElementsInTree(e);
	}
	processTree(e, t) {
		for (let n of this.matchElementsInTree(e)) t.call(this, n);
	}
	elementFromNode(e) {
		if (e.nodeType == Node.ELEMENT_NODE) return e;
	}
	elementIsActive(e) {
		return e.isConnected == this.element.isConnected && this.element.contains(e);
	}
	addElement(e) {
		this.elements.has(e) || this.elementIsActive(e) && (this.elements.add(e), this.delegate.elementMatched && this.delegate.elementMatched(e));
	}
	removeElement(e) {
		this.elements.has(e) && (this.elements.delete(e), this.delegate.elementUnmatched && this.delegate.elementUnmatched(e));
	}
}, ce = class {
	constructor(e, t, n) {
		this.attributeName = t, this.delegate = n, this.elementObserver = new se(e, this);
	}
	get element() {
		return this.elementObserver.element;
	}
	get selector() {
		return `[${this.attributeName}]`;
	}
	start() {
		this.elementObserver.start();
	}
	pause(e) {
		this.elementObserver.pause(e);
	}
	stop() {
		this.elementObserver.stop();
	}
	refresh() {
		this.elementObserver.refresh();
	}
	get started() {
		return this.elementObserver.started;
	}
	matchElement(e) {
		return e.hasAttribute(this.attributeName);
	}
	matchElementsInTree(e) {
		let t = this.matchElement(e) ? [e] : [], n = Array.from(e.querySelectorAll(this.selector));
		return t.concat(n);
	}
	elementMatched(e) {
		this.delegate.elementMatchedAttribute && this.delegate.elementMatchedAttribute(e, this.attributeName);
	}
	elementUnmatched(e) {
		this.delegate.elementUnmatchedAttribute && this.delegate.elementUnmatchedAttribute(e, this.attributeName);
	}
	elementAttributeChanged(e, t) {
		this.delegate.elementAttributeValueChanged && this.attributeName == t && this.delegate.elementAttributeValueChanged(e, t);
	}
};
function le(e, t, n) {
	de(e, t).add(n);
}
function ue(e, t, n) {
	de(e, t).delete(n), fe(e, t);
}
function de(e, t) {
	let n = e.get(t);
	return n || (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
}
function fe(e, t) {
	let n = e.get(t);
	n != null && n.size == 0 && e.delete(t);
}
var g = class {
	constructor() {
		this.valuesByKey = /* @__PURE__ */ new Map();
	}
	get keys() {
		return Array.from(this.valuesByKey.keys());
	}
	get values() {
		return Array.from(this.valuesByKey.values()).reduce((e, t) => e.concat(Array.from(t)), []);
	}
	get size() {
		return Array.from(this.valuesByKey.values()).reduce((e, t) => e + t.size, 0);
	}
	add(e, t) {
		le(this.valuesByKey, e, t);
	}
	delete(e, t) {
		ue(this.valuesByKey, e, t);
	}
	has(e, t) {
		let n = this.valuesByKey.get(e);
		return n != null && n.has(t);
	}
	hasKey(e) {
		return this.valuesByKey.has(e);
	}
	hasValue(e) {
		return Array.from(this.valuesByKey.values()).some((t) => t.has(e));
	}
	getValuesForKey(e) {
		let t = this.valuesByKey.get(e);
		return t ? Array.from(t) : [];
	}
	getKeysForValue(e) {
		return Array.from(this.valuesByKey).filter(([t, n]) => n.has(e)).map(([e, t]) => e);
	}
}, pe = class {
	constructor(e, t, n, r) {
		this._selector = t, this.details = r, this.elementObserver = new se(e, this), this.delegate = n, this.matchesByElement = new g();
	}
	get started() {
		return this.elementObserver.started;
	}
	get selector() {
		return this._selector;
	}
	set selector(e) {
		this._selector = e, this.refresh();
	}
	start() {
		this.elementObserver.start();
	}
	pause(e) {
		this.elementObserver.pause(e);
	}
	stop() {
		this.elementObserver.stop();
	}
	refresh() {
		this.elementObserver.refresh();
	}
	get element() {
		return this.elementObserver.element;
	}
	matchElement(e) {
		let { selector: t } = this;
		if (t) {
			let n = e.matches(t);
			return this.delegate.selectorMatchElement ? n && this.delegate.selectorMatchElement(e, this.details) : n;
		}
		return !1;
	}
	matchElementsInTree(e) {
		let { selector: t } = this;
		if (t) {
			let n = this.matchElement(e) ? [e] : [], r = Array.from(e.querySelectorAll(t)).filter((e) => this.matchElement(e));
			return n.concat(r);
		}
		return [];
	}
	elementMatched(e) {
		let { selector: t } = this;
		t && this.selectorMatched(e, t);
	}
	elementUnmatched(e) {
		let t = this.matchesByElement.getKeysForValue(e);
		for (let n of t) this.selectorUnmatched(e, n);
	}
	elementAttributeChanged(e, t) {
		let { selector: n } = this;
		if (n) {
			let t = this.matchElement(e), r = this.matchesByElement.has(n, e);
			t && !r ? this.selectorMatched(e, n) : !t && r && this.selectorUnmatched(e, n);
		}
	}
	selectorMatched(e, t) {
		this.delegate.selectorMatched(e, t, this.details), this.matchesByElement.add(t, e);
	}
	selectorUnmatched(e, t) {
		this.delegate.selectorUnmatched(e, t, this.details), this.matchesByElement.delete(t, e);
	}
}, me = class {
	constructor(e, t) {
		this.element = e, this.delegate = t, this.started = !1, this.stringMap = /* @__PURE__ */ new Map(), this.mutationObserver = new MutationObserver((e) => this.processMutations(e));
	}
	start() {
		this.started || (this.started = !0, this.mutationObserver.observe(this.element, {
			attributes: !0,
			attributeOldValue: !0
		}), this.refresh());
	}
	stop() {
		this.started &&= (this.mutationObserver.takeRecords(), this.mutationObserver.disconnect(), !1);
	}
	refresh() {
		if (this.started) for (let e of this.knownAttributeNames) this.refreshAttribute(e, null);
	}
	processMutations(e) {
		if (this.started) for (let t of e) this.processMutation(t);
	}
	processMutation(e) {
		let t = e.attributeName;
		t && this.refreshAttribute(t, e.oldValue);
	}
	refreshAttribute(e, t) {
		let n = this.delegate.getStringMapKeyForAttribute(e);
		if (n != null) {
			this.stringMap.has(e) || this.stringMapKeyAdded(n, e);
			let r = this.element.getAttribute(e);
			if (this.stringMap.get(e) != r && this.stringMapValueChanged(r, n, t), r == null) {
				let t = this.stringMap.get(e);
				this.stringMap.delete(e), t && this.stringMapKeyRemoved(n, e, t);
			} else this.stringMap.set(e, r);
		}
	}
	stringMapKeyAdded(e, t) {
		this.delegate.stringMapKeyAdded && this.delegate.stringMapKeyAdded(e, t);
	}
	stringMapValueChanged(e, t, n) {
		this.delegate.stringMapValueChanged && this.delegate.stringMapValueChanged(e, t, n);
	}
	stringMapKeyRemoved(e, t, n) {
		this.delegate.stringMapKeyRemoved && this.delegate.stringMapKeyRemoved(e, t, n);
	}
	get knownAttributeNames() {
		return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
	}
	get currentAttributeNames() {
		return Array.from(this.element.attributes).map((e) => e.name);
	}
	get recordedAttributeNames() {
		return Array.from(this.stringMap.keys());
	}
}, he = class {
	constructor(e, t, n) {
		this.attributeObserver = new ce(e, t, this), this.delegate = n, this.tokensByElement = new g();
	}
	get started() {
		return this.attributeObserver.started;
	}
	start() {
		this.attributeObserver.start();
	}
	pause(e) {
		this.attributeObserver.pause(e);
	}
	stop() {
		this.attributeObserver.stop();
	}
	refresh() {
		this.attributeObserver.refresh();
	}
	get element() {
		return this.attributeObserver.element;
	}
	get attributeName() {
		return this.attributeObserver.attributeName;
	}
	elementMatchedAttribute(e) {
		this.tokensMatched(this.readTokensForElement(e));
	}
	elementAttributeValueChanged(e) {
		let [t, n] = this.refreshTokensForElement(e);
		this.tokensUnmatched(t), this.tokensMatched(n);
	}
	elementUnmatchedAttribute(e) {
		this.tokensUnmatched(this.tokensByElement.getValuesForKey(e));
	}
	tokensMatched(e) {
		e.forEach((e) => this.tokenMatched(e));
	}
	tokensUnmatched(e) {
		e.forEach((e) => this.tokenUnmatched(e));
	}
	tokenMatched(e) {
		this.delegate.tokenMatched(e), this.tokensByElement.add(e.element, e);
	}
	tokenUnmatched(e) {
		this.delegate.tokenUnmatched(e), this.tokensByElement.delete(e.element, e);
	}
	refreshTokensForElement(e) {
		let t = this.tokensByElement.getValuesForKey(e), n = this.readTokensForElement(e), r = _e(t, n).findIndex(([e, t]) => !ve(e, t));
		return r == -1 ? [[], []] : [t.slice(r), n.slice(r)];
	}
	readTokensForElement(e) {
		let t = this.attributeName;
		return ge(e.getAttribute(t) || "", e, t);
	}
};
function ge(e, t, n) {
	return e.trim().split(/\s+/).filter((e) => e.length).map((e, r) => ({
		element: t,
		attributeName: n,
		content: e,
		index: r
	}));
}
function _e(e, t) {
	let n = Math.max(e.length, t.length);
	return Array.from({ length: n }, (n, r) => [e[r], t[r]]);
}
function ve(e, t) {
	return e && t && e.index == t.index && e.content == t.content;
}
var ye = class {
	constructor(e, t, n) {
		this.tokenListObserver = new he(e, t, this), this.delegate = n, this.parseResultsByToken = /* @__PURE__ */ new WeakMap(), this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
	}
	get started() {
		return this.tokenListObserver.started;
	}
	start() {
		this.tokenListObserver.start();
	}
	stop() {
		this.tokenListObserver.stop();
	}
	refresh() {
		this.tokenListObserver.refresh();
	}
	get element() {
		return this.tokenListObserver.element;
	}
	get attributeName() {
		return this.tokenListObserver.attributeName;
	}
	tokenMatched(e) {
		let { element: t } = e, { value: n } = this.fetchParseResultForToken(e);
		n && (this.fetchValuesByTokenForElement(t).set(e, n), this.delegate.elementMatchedValue(t, n));
	}
	tokenUnmatched(e) {
		let { element: t } = e, { value: n } = this.fetchParseResultForToken(e);
		n && (this.fetchValuesByTokenForElement(t).delete(e), this.delegate.elementUnmatchedValue(t, n));
	}
	fetchParseResultForToken(e) {
		let t = this.parseResultsByToken.get(e);
		return t || (t = this.parseToken(e), this.parseResultsByToken.set(e, t)), t;
	}
	fetchValuesByTokenForElement(e) {
		let t = this.valuesByTokenByElement.get(e);
		return t || (t = /* @__PURE__ */ new Map(), this.valuesByTokenByElement.set(e, t)), t;
	}
	parseToken(e) {
		try {
			return { value: this.delegate.parseValueForToken(e) };
		} catch (e) {
			return { error: e };
		}
	}
}, be = class {
	constructor(e, t) {
		this.context = e, this.delegate = t, this.bindingsByAction = /* @__PURE__ */ new Map();
	}
	start() {
		this.valueListObserver || (this.valueListObserver = new ye(this.element, this.actionAttribute, this), this.valueListObserver.start());
	}
	stop() {
		this.valueListObserver && (this.valueListObserver.stop(), delete this.valueListObserver, this.disconnectAllActions());
	}
	get element() {
		return this.context.element;
	}
	get identifier() {
		return this.context.identifier;
	}
	get actionAttribute() {
		return this.schema.actionAttribute;
	}
	get schema() {
		return this.context.schema;
	}
	get bindings() {
		return Array.from(this.bindingsByAction.values());
	}
	connectAction(e) {
		let t = new oe(this.context, e);
		this.bindingsByAction.set(e, t), this.delegate.bindingConnected(t);
	}
	disconnectAction(e) {
		let t = this.bindingsByAction.get(e);
		t && (this.bindingsByAction.delete(e), this.delegate.bindingDisconnected(t));
	}
	disconnectAllActions() {
		this.bindings.forEach((e) => this.delegate.bindingDisconnected(e, !0)), this.bindingsByAction.clear();
	}
	parseValueForToken(e) {
		let t = ne.forToken(e, this.schema);
		if (t.identifier == this.identifier) return t;
	}
	elementMatchedValue(e, t) {
		this.connectAction(t);
	}
	elementUnmatchedValue(e, t) {
		this.disconnectAction(t);
	}
}, xe = class {
	constructor(e, t) {
		this.context = e, this.receiver = t, this.stringMapObserver = new me(this.element, this), this.valueDescriptorMap = this.controller.valueDescriptorMap;
	}
	start() {
		this.stringMapObserver.start(), this.invokeChangedCallbacksForDefaultValues();
	}
	stop() {
		this.stringMapObserver.stop();
	}
	get element() {
		return this.context.element;
	}
	get controller() {
		return this.context.controller;
	}
	getStringMapKeyForAttribute(e) {
		if (e in this.valueDescriptorMap) return this.valueDescriptorMap[e].name;
	}
	stringMapKeyAdded(e, t) {
		let n = this.valueDescriptorMap[t];
		this.hasValue(e) || this.invokeChangedCallback(e, n.writer(this.receiver[e]), n.writer(n.defaultValue));
	}
	stringMapValueChanged(e, t, n) {
		let r = this.valueDescriptorNameMap[t];
		e !== null && (n === null && (n = r.writer(r.defaultValue)), this.invokeChangedCallback(t, e, n));
	}
	stringMapKeyRemoved(e, t, n) {
		let r = this.valueDescriptorNameMap[e];
		this.hasValue(e) ? this.invokeChangedCallback(e, r.writer(this.receiver[e]), n) : this.invokeChangedCallback(e, r.writer(r.defaultValue), n);
	}
	invokeChangedCallbacksForDefaultValues() {
		for (let { key: e, name: t, defaultValue: n, writer: r } of this.valueDescriptors) n != null && !this.controller.data.has(e) && this.invokeChangedCallback(t, r(n), void 0);
	}
	invokeChangedCallback(e, t, n) {
		let r = `${e}Changed`, i = this.receiver[r];
		if (typeof i == "function") {
			let r = this.valueDescriptorNameMap[e];
			try {
				let e = r.reader(t), a = n;
				n && (a = r.reader(n)), i.call(this.receiver, e, a);
			} catch (e) {
				throw e instanceof TypeError && (e.message = `Stimulus Value "${this.context.identifier}.${r.name}" - ${e.message}`), e;
			}
		}
	}
	get valueDescriptors() {
		let { valueDescriptorMap: e } = this;
		return Object.keys(e).map((t) => e[t]);
	}
	get valueDescriptorNameMap() {
		let e = {};
		return Object.keys(this.valueDescriptorMap).forEach((t) => {
			let n = this.valueDescriptorMap[t];
			e[n.name] = n;
		}), e;
	}
	hasValue(e) {
		let t = this.valueDescriptorNameMap[e], n = `has${d(t.name)}`;
		return this.receiver[n];
	}
}, Se = class {
	constructor(e, t) {
		this.context = e, this.delegate = t, this.targetsByName = new g();
	}
	start() {
		this.tokenListObserver || (this.tokenListObserver = new he(this.element, this.attributeName, this), this.tokenListObserver.start());
	}
	stop() {
		this.tokenListObserver && (this.disconnectAllTargets(), this.tokenListObserver.stop(), delete this.tokenListObserver);
	}
	tokenMatched({ element: e, content: t }) {
		this.scope.containsElement(e) && this.connectTarget(e, t);
	}
	tokenUnmatched({ element: e, content: t }) {
		this.disconnectTarget(e, t);
	}
	connectTarget(e, t) {
		var n;
		this.targetsByName.has(t, e) || (this.targetsByName.add(t, e), (n = this.tokenListObserver) == null || n.pause(() => this.delegate.targetConnected(e, t)));
	}
	disconnectTarget(e, t) {
		var n;
		this.targetsByName.has(t, e) && (this.targetsByName.delete(t, e), (n = this.tokenListObserver) == null || n.pause(() => this.delegate.targetDisconnected(e, t)));
	}
	disconnectAllTargets() {
		for (let e of this.targetsByName.keys) for (let t of this.targetsByName.getValuesForKey(e)) this.disconnectTarget(t, e);
	}
	get attributeName() {
		return `data-${this.context.identifier}-target`;
	}
	get element() {
		return this.context.element;
	}
	get scope() {
		return this.context.scope;
	}
};
function _(e, t) {
	let n = we(e);
	return Array.from(n.reduce((e, n) => (Te(n, t).forEach((t) => e.add(t)), e), /* @__PURE__ */ new Set()));
}
function Ce(e, t) {
	return we(e).reduce((e, n) => (e.push(...Ee(n, t)), e), []);
}
function we(e) {
	let t = [];
	for (; e;) t.push(e), e = Object.getPrototypeOf(e);
	return t.reverse();
}
function Te(e, t) {
	let n = e[t];
	return Array.isArray(n) ? n : [];
}
function Ee(e, t) {
	let n = e[t];
	return n ? Object.keys(n).map((e) => [e, n[e]]) : [];
}
var De = class {
	constructor(e, t) {
		this.started = !1, this.context = e, this.delegate = t, this.outletsByName = new g(), this.outletElementsByName = new g(), this.selectorObserverMap = /* @__PURE__ */ new Map(), this.attributeObserverMap = /* @__PURE__ */ new Map();
	}
	start() {
		this.started || (this.outletDefinitions.forEach((e) => {
			this.setupSelectorObserverForOutlet(e), this.setupAttributeObserverForOutlet(e);
		}), this.started = !0, this.dependentContexts.forEach((e) => e.refresh()));
	}
	refresh() {
		this.selectorObserverMap.forEach((e) => e.refresh()), this.attributeObserverMap.forEach((e) => e.refresh());
	}
	stop() {
		this.started && (this.started = !1, this.disconnectAllOutlets(), this.stopSelectorObservers(), this.stopAttributeObservers());
	}
	stopSelectorObservers() {
		this.selectorObserverMap.size > 0 && (this.selectorObserverMap.forEach((e) => e.stop()), this.selectorObserverMap.clear());
	}
	stopAttributeObservers() {
		this.attributeObserverMap.size > 0 && (this.attributeObserverMap.forEach((e) => e.stop()), this.attributeObserverMap.clear());
	}
	selectorMatched(e, t, { outletName: n }) {
		let r = this.getOutlet(e, n);
		r && this.connectOutlet(r, e, n);
	}
	selectorUnmatched(e, t, { outletName: n }) {
		let r = this.getOutletFromMap(e, n);
		r && this.disconnectOutlet(r, e, n);
	}
	selectorMatchElement(e, { outletName: t }) {
		let n = this.selector(t), r = this.hasOutlet(e, t), i = e.matches(`[${this.schema.controllerAttribute}~=${t}]`);
		return n ? r && i && e.matches(n) : !1;
	}
	elementMatchedAttribute(e, t) {
		let n = this.getOutletNameFromOutletAttributeName(t);
		n && this.updateSelectorObserverForOutlet(n);
	}
	elementAttributeValueChanged(e, t) {
		let n = this.getOutletNameFromOutletAttributeName(t);
		n && this.updateSelectorObserverForOutlet(n);
	}
	elementUnmatchedAttribute(e, t) {
		let n = this.getOutletNameFromOutletAttributeName(t);
		n && this.updateSelectorObserverForOutlet(n);
	}
	connectOutlet(e, t, n) {
		var r;
		this.outletElementsByName.has(n, t) || (this.outletsByName.add(n, e), this.outletElementsByName.add(n, t), (r = this.selectorObserverMap.get(n)) == null || r.pause(() => this.delegate.outletConnected(e, t, n)));
	}
	disconnectOutlet(e, t, n) {
		var r;
		this.outletElementsByName.has(n, t) && (this.outletsByName.delete(n, e), this.outletElementsByName.delete(n, t), (r = this.selectorObserverMap.get(n)) == null || r.pause(() => this.delegate.outletDisconnected(e, t, n)));
	}
	disconnectAllOutlets() {
		for (let e of this.outletElementsByName.keys) for (let t of this.outletElementsByName.getValuesForKey(e)) for (let n of this.outletsByName.getValuesForKey(e)) this.disconnectOutlet(n, t, e);
	}
	updateSelectorObserverForOutlet(e) {
		let t = this.selectorObserverMap.get(e);
		t && (t.selector = this.selector(e));
	}
	setupSelectorObserverForOutlet(e) {
		let t = this.selector(e), n = new pe(document.body, t, this, { outletName: e });
		this.selectorObserverMap.set(e, n), n.start();
	}
	setupAttributeObserverForOutlet(e) {
		let t = this.attributeNameForOutletName(e), n = new ce(this.scope.element, t, this);
		this.attributeObserverMap.set(e, n), n.start();
	}
	selector(e) {
		return this.scope.outlets.getSelectorForOutletName(e);
	}
	attributeNameForOutletName(e) {
		return this.scope.schema.outletAttributeForScope(this.identifier, e);
	}
	getOutletNameFromOutletAttributeName(e) {
		return this.outletDefinitions.find((t) => this.attributeNameForOutletName(t) === e);
	}
	get outletDependencies() {
		let e = new g();
		return this.router.modules.forEach((t) => {
			let n = t.definition.controllerConstructor;
			_(n, "outlets").forEach((n) => e.add(n, t.identifier));
		}), e;
	}
	get outletDefinitions() {
		return this.outletDependencies.getKeysForValue(this.identifier);
	}
	get dependentControllerIdentifiers() {
		return this.outletDependencies.getValuesForKey(this.identifier);
	}
	get dependentContexts() {
		let e = this.dependentControllerIdentifiers;
		return this.router.contexts.filter((t) => e.includes(t.identifier));
	}
	hasOutlet(e, t) {
		return !!this.getOutlet(e, t) || !!this.getOutletFromMap(e, t);
	}
	getOutlet(e, t) {
		return this.application.getControllerForElementAndIdentifier(e, t);
	}
	getOutletFromMap(e, t) {
		return this.outletsByName.getValuesForKey(t).find((t) => t.element === e);
	}
	get scope() {
		return this.context.scope;
	}
	get schema() {
		return this.context.schema;
	}
	get identifier() {
		return this.context.identifier;
	}
	get application() {
		return this.context.application;
	}
	get router() {
		return this.application.router;
	}
}, Oe = class {
	constructor(e, t) {
		this.logDebugActivity = (e, t = {}) => {
			let { identifier: n, controller: r, element: i } = this;
			t = Object.assign({
				identifier: n,
				controller: r,
				element: i
			}, t), this.application.logDebugActivity(this.identifier, e, t);
		}, this.module = e, this.scope = t, this.controller = new e.controllerConstructor(this), this.bindingObserver = new be(this, this.dispatcher), this.valueObserver = new xe(this, this.controller), this.targetObserver = new Se(this, this), this.outletObserver = new De(this, this);
		try {
			this.controller.initialize(), this.logDebugActivity("initialize");
		} catch (e) {
			this.handleError(e, "initializing controller");
		}
	}
	connect() {
		this.bindingObserver.start(), this.valueObserver.start(), this.targetObserver.start(), this.outletObserver.start();
		try {
			this.controller.connect(), this.logDebugActivity("connect");
		} catch (e) {
			this.handleError(e, "connecting controller");
		}
	}
	refresh() {
		this.outletObserver.refresh();
	}
	disconnect() {
		try {
			this.controller.disconnect(), this.logDebugActivity("disconnect");
		} catch (e) {
			this.handleError(e, "disconnecting controller");
		}
		this.outletObserver.stop(), this.targetObserver.stop(), this.valueObserver.stop(), this.bindingObserver.stop();
	}
	get application() {
		return this.module.application;
	}
	get identifier() {
		return this.module.identifier;
	}
	get schema() {
		return this.application.schema;
	}
	get dispatcher() {
		return this.application.dispatcher;
	}
	get element() {
		return this.scope.element;
	}
	get parentElement() {
		return this.element.parentElement;
	}
	handleError(e, t, n = {}) {
		let { identifier: r, controller: i, element: a } = this;
		n = Object.assign({
			identifier: r,
			controller: i,
			element: a
		}, n), this.application.handleError(e, `Error ${t}`, n);
	}
	targetConnected(e, t) {
		this.invokeControllerMethod(`${t}TargetConnected`, e);
	}
	targetDisconnected(e, t) {
		this.invokeControllerMethod(`${t}TargetDisconnected`, e);
	}
	outletConnected(e, t, n) {
		this.invokeControllerMethod(`${u(n)}OutletConnected`, e, t);
	}
	outletDisconnected(e, t, n) {
		this.invokeControllerMethod(`${u(n)}OutletDisconnected`, e, t);
	}
	invokeControllerMethod(e, ...t) {
		let n = this.controller;
		typeof n[e] == "function" && n[e](...t);
	}
};
function ke(e) {
	return Ae(e, je(e));
}
function Ae(e, t) {
	let n = Fe(e), r = Me(e.prototype, t);
	return Object.defineProperties(n.prototype, r), n;
}
function je(e) {
	return _(e, "blessings").reduce((t, n) => {
		let r = n(e);
		for (let e in r) {
			let n = t[e] || {};
			t[e] = Object.assign(n, r[e]);
		}
		return t;
	}, {});
}
function Me(e, t) {
	return Pe(t).reduce((n, r) => {
		let i = Ne(e, t, r);
		return i && Object.assign(n, { [r]: i }), n;
	}, {});
}
function Ne(e, t, n) {
	let r = Object.getOwnPropertyDescriptor(e, n);
	if (!(r && "value" in r)) {
		let e = Object.getOwnPropertyDescriptor(t, n).value;
		return r && (e.get = r.get || e.get, e.set = r.set || e.set), e;
	}
}
var Pe = typeof Object.getOwnPropertySymbols == "function" ? (e) => [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)] : Object.getOwnPropertyNames, Fe = (() => {
	function e(e) {
		function t() {
			return Reflect.construct(e, arguments, new.target);
		}
		return t.prototype = Object.create(e.prototype, { constructor: { value: t } }), Reflect.setPrototypeOf(t, e), t;
	}
	function t() {
		let t = e(function() {
			this.a.call(this);
		});
		return t.prototype.a = function() {}, new t();
	}
	try {
		return t(), e;
	} catch {
		return (e) => class extends e {};
	}
})();
function Ie(e) {
	return {
		identifier: e.identifier,
		controllerConstructor: ke(e.controllerConstructor)
	};
}
var Le = class {
	constructor(e, t) {
		this.application = e, this.definition = Ie(t), this.contextsByScope = /* @__PURE__ */ new WeakMap(), this.connectedContexts = /* @__PURE__ */ new Set();
	}
	get identifier() {
		return this.definition.identifier;
	}
	get controllerConstructor() {
		return this.definition.controllerConstructor;
	}
	get contexts() {
		return Array.from(this.connectedContexts);
	}
	connectContextForScope(e) {
		let t = this.fetchContextForScope(e);
		this.connectedContexts.add(t), t.connect();
	}
	disconnectContextForScope(e) {
		let t = this.contextsByScope.get(e);
		t && (this.connectedContexts.delete(t), t.disconnect());
	}
	fetchContextForScope(e) {
		let t = this.contextsByScope.get(e);
		return t || (t = new Oe(this, e), this.contextsByScope.set(e, t)), t;
	}
}, Re = class {
	constructor(e) {
		this.scope = e;
	}
	has(e) {
		return this.data.has(this.getDataKey(e));
	}
	get(e) {
		return this.getAll(e)[0];
	}
	getAll(e) {
		return ee(this.data.get(this.getDataKey(e)) || "");
	}
	getAttributeName(e) {
		return this.data.getAttributeNameForKey(this.getDataKey(e));
	}
	getDataKey(e) {
		return `${e}-class`;
	}
	get data() {
		return this.scope.data;
	}
}, ze = class {
	constructor(e) {
		this.scope = e;
	}
	get element() {
		return this.scope.element;
	}
	get identifier() {
		return this.scope.identifier;
	}
	get(e) {
		let t = this.getAttributeNameForKey(e);
		return this.element.getAttribute(t);
	}
	set(e, t) {
		let n = this.getAttributeNameForKey(e);
		return this.element.setAttribute(n, t), this.get(e);
	}
	has(e) {
		let t = this.getAttributeNameForKey(e);
		return this.element.hasAttribute(t);
	}
	delete(e) {
		if (this.has(e)) {
			let t = this.getAttributeNameForKey(e);
			return this.element.removeAttribute(t), !0;
		}
		return !1;
	}
	getAttributeNameForKey(e) {
		return `data-${this.identifier}-${f(e)}`;
	}
}, Be = class {
	constructor(e) {
		this.warnedKeysByObject = /* @__PURE__ */ new WeakMap(), this.logger = e;
	}
	warn(e, t, n) {
		let r = this.warnedKeysByObject.get(e);
		r || (r = /* @__PURE__ */ new Set(), this.warnedKeysByObject.set(e, r)), r.has(t) || (r.add(t), this.logger.warn(n, e));
	}
};
function v(e, t) {
	return `[${e}~="${t}"]`;
}
var Ve = class {
	constructor(e) {
		this.scope = e;
	}
	get element() {
		return this.scope.element;
	}
	get identifier() {
		return this.scope.identifier;
	}
	get schema() {
		return this.scope.schema;
	}
	has(e) {
		return this.find(e) != null;
	}
	find(...e) {
		return e.reduce((e, t) => e || this.findTarget(t) || this.findLegacyTarget(t), void 0);
	}
	findAll(...e) {
		return e.reduce((e, t) => [
			...e,
			...this.findAllTargets(t),
			...this.findAllLegacyTargets(t)
		], []);
	}
	findTarget(e) {
		let t = this.getSelectorForTargetName(e);
		return this.scope.findElement(t);
	}
	findAllTargets(e) {
		let t = this.getSelectorForTargetName(e);
		return this.scope.findAllElements(t);
	}
	getSelectorForTargetName(e) {
		return v(this.schema.targetAttributeForScope(this.identifier), e);
	}
	findLegacyTarget(e) {
		let t = this.getLegacySelectorForTargetName(e);
		return this.deprecate(this.scope.findElement(t), e);
	}
	findAllLegacyTargets(e) {
		let t = this.getLegacySelectorForTargetName(e);
		return this.scope.findAllElements(t).map((t) => this.deprecate(t, e));
	}
	getLegacySelectorForTargetName(e) {
		let t = `${this.identifier}.${e}`;
		return v(this.schema.targetAttribute, t);
	}
	deprecate(e, t) {
		if (e) {
			let { identifier: n } = this, r = this.schema.targetAttribute, i = this.schema.targetAttributeForScope(n);
			this.guide.warn(e, `target:${t}`, `Please replace ${r}="${n}.${t}" with ${i}="${t}". The ${r} attribute is deprecated and will be removed in a future version of Stimulus.`);
		}
		return e;
	}
	get guide() {
		return this.scope.guide;
	}
}, He = class {
	constructor(e, t) {
		this.scope = e, this.controllerElement = t;
	}
	get element() {
		return this.scope.element;
	}
	get identifier() {
		return this.scope.identifier;
	}
	get schema() {
		return this.scope.schema;
	}
	has(e) {
		return this.find(e) != null;
	}
	find(...e) {
		return e.reduce((e, t) => e || this.findOutlet(t), void 0);
	}
	findAll(...e) {
		return e.reduce((e, t) => [...e, ...this.findAllOutlets(t)], []);
	}
	getSelectorForOutletName(e) {
		let t = this.schema.outletAttributeForScope(this.identifier, e);
		return this.controllerElement.getAttribute(t);
	}
	findOutlet(e) {
		let t = this.getSelectorForOutletName(e);
		if (t) return this.findElement(t, e);
	}
	findAllOutlets(e) {
		let t = this.getSelectorForOutletName(e);
		return t ? this.findAllElements(t, e) : [];
	}
	findElement(e, t) {
		return this.scope.queryElements(e).filter((n) => this.matchesElement(n, e, t))[0];
	}
	findAllElements(e, t) {
		return this.scope.queryElements(e).filter((n) => this.matchesElement(n, e, t));
	}
	matchesElement(e, t, n) {
		let r = e.getAttribute(this.scope.schema.controllerAttribute) || "";
		return e.matches(t) && r.split(" ").includes(n);
	}
}, Ue = class e {
	constructor(e, t, n, r) {
		this.targets = new Ve(this), this.classes = new Re(this), this.data = new ze(this), this.containsElement = (e) => e.closest(this.controllerSelector) === this.element, this.schema = e, this.element = t, this.identifier = n, this.guide = new Be(r), this.outlets = new He(this.documentScope, t);
	}
	findElement(e) {
		return this.element.matches(e) ? this.element : this.queryElements(e).find(this.containsElement);
	}
	findAllElements(e) {
		return [...this.element.matches(e) ? [this.element] : [], ...this.queryElements(e).filter(this.containsElement)];
	}
	queryElements(e) {
		return Array.from(this.element.querySelectorAll(e));
	}
	get controllerSelector() {
		return v(this.schema.controllerAttribute, this.identifier);
	}
	get isDocumentScope() {
		return this.element === document.documentElement;
	}
	get documentScope() {
		return this.isDocumentScope ? this : new e(this.schema, document.documentElement, this.identifier, this.guide.logger);
	}
}, We = class {
	constructor(e, t, n) {
		this.element = e, this.schema = t, this.delegate = n, this.valueListObserver = new ye(this.element, this.controllerAttribute, this), this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap(), this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
	}
	start() {
		this.valueListObserver.start();
	}
	stop() {
		this.valueListObserver.stop();
	}
	get controllerAttribute() {
		return this.schema.controllerAttribute;
	}
	parseValueForToken(e) {
		let { element: t, content: n } = e;
		return this.parseValueForElementAndIdentifier(t, n);
	}
	parseValueForElementAndIdentifier(e, t) {
		let n = this.fetchScopesByIdentifierForElement(e), r = n.get(t);
		return r || (r = this.delegate.createScopeForElementAndIdentifier(e, t), n.set(t, r)), r;
	}
	elementMatchedValue(e, t) {
		let n = (this.scopeReferenceCounts.get(t) || 0) + 1;
		this.scopeReferenceCounts.set(t, n), n == 1 && this.delegate.scopeConnected(t);
	}
	elementUnmatchedValue(e, t) {
		let n = this.scopeReferenceCounts.get(t);
		n && (this.scopeReferenceCounts.set(t, n - 1), n == 1 && this.delegate.scopeDisconnected(t));
	}
	fetchScopesByIdentifierForElement(e) {
		let t = this.scopesByIdentifierByElement.get(e);
		return t || (t = /* @__PURE__ */ new Map(), this.scopesByIdentifierByElement.set(e, t)), t;
	}
}, Ge = class {
	constructor(e) {
		this.application = e, this.scopeObserver = new We(this.element, this.schema, this), this.scopesByIdentifier = new g(), this.modulesByIdentifier = /* @__PURE__ */ new Map();
	}
	get element() {
		return this.application.element;
	}
	get schema() {
		return this.application.schema;
	}
	get logger() {
		return this.application.logger;
	}
	get controllerAttribute() {
		return this.schema.controllerAttribute;
	}
	get modules() {
		return Array.from(this.modulesByIdentifier.values());
	}
	get contexts() {
		return this.modules.reduce((e, t) => e.concat(t.contexts), []);
	}
	start() {
		this.scopeObserver.start();
	}
	stop() {
		this.scopeObserver.stop();
	}
	loadDefinition(e) {
		this.unloadIdentifier(e.identifier);
		let t = new Le(this.application, e);
		this.connectModule(t);
		let n = e.controllerConstructor.afterLoad;
		n && n.call(e.controllerConstructor, e.identifier, this.application);
	}
	unloadIdentifier(e) {
		let t = this.modulesByIdentifier.get(e);
		t && this.disconnectModule(t);
	}
	getContextForElementAndIdentifier(e, t) {
		let n = this.modulesByIdentifier.get(t);
		if (n) return n.contexts.find((t) => t.element == e);
	}
	proposeToConnectScopeForElementAndIdentifier(e, t) {
		let n = this.scopeObserver.parseValueForElementAndIdentifier(e, t);
		n ? this.scopeObserver.elementMatchedValue(n.element, n) : console.error(`Couldn't find or create scope for identifier: "${t}" and element:`, e);
	}
	handleError(e, t, n) {
		this.application.handleError(e, t, n);
	}
	createScopeForElementAndIdentifier(e, t) {
		return new Ue(this.schema, e, t, this.logger);
	}
	scopeConnected(e) {
		this.scopesByIdentifier.add(e.identifier, e);
		let t = this.modulesByIdentifier.get(e.identifier);
		t && t.connectContextForScope(e);
	}
	scopeDisconnected(e) {
		this.scopesByIdentifier.delete(e.identifier, e);
		let t = this.modulesByIdentifier.get(e.identifier);
		t && t.disconnectContextForScope(e);
	}
	connectModule(e) {
		this.modulesByIdentifier.set(e.identifier, e), this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((t) => e.connectContextForScope(t));
	}
	disconnectModule(e) {
		this.modulesByIdentifier.delete(e.identifier), this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((t) => e.disconnectContextForScope(t));
	}
}, Ke = {
	controllerAttribute: "data-controller",
	actionAttribute: "data-action",
	targetAttribute: "data-target",
	targetAttributeForScope: (e) => `data-${e}-target`,
	outletAttributeForScope: (e, t) => `data-${e}-${t}-outlet`,
	keyMappings: Object.assign(Object.assign({
		enter: "Enter",
		tab: "Tab",
		esc: "Escape",
		space: " ",
		up: "ArrowUp",
		down: "ArrowDown",
		left: "ArrowLeft",
		right: "ArrowRight",
		home: "Home",
		end: "End",
		page_up: "PageUp",
		page_down: "PageDown"
	}, qe("abcdefghijklmnopqrstuvwxyz".split("").map((e) => [e, e]))), qe("0123456789".split("").map((e) => [e, e])))
};
function qe(e) {
	return e.reduce((e, [t, n]) => Object.assign(Object.assign({}, e), { [t]: n }), {});
}
var Je = class {
	constructor(e = document.documentElement, t = Ke) {
		this.logger = console, this.debug = !1, this.logDebugActivity = (e, t, n = {}) => {
			this.debug && this.logFormattedMessage(e, t, n);
		}, this.element = e, this.schema = t, this.dispatcher = new n(this), this.router = new Ge(this), this.actionDescriptorFilters = Object.assign({}, r);
	}
	static start(e, t) {
		let n = new this(e, t);
		return n.start(), n;
	}
	async start() {
		await Ye(), this.logDebugActivity("application", "starting"), this.dispatcher.start(), this.router.start(), this.logDebugActivity("application", "start");
	}
	stop() {
		this.logDebugActivity("application", "stopping"), this.dispatcher.stop(), this.router.stop(), this.logDebugActivity("application", "stop");
	}
	register(e, t) {
		this.load({
			identifier: e,
			controllerConstructor: t
		});
	}
	registerActionOption(e, t) {
		this.actionDescriptorFilters[e] = t;
	}
	load(e, ...t) {
		(Array.isArray(e) ? e : [e, ...t]).forEach((e) => {
			e.controllerConstructor.shouldLoad && this.router.loadDefinition(e);
		});
	}
	unload(e, ...t) {
		(Array.isArray(e) ? e : [e, ...t]).forEach((e) => this.router.unloadIdentifier(e));
	}
	get controllers() {
		return this.router.contexts.map((e) => e.controller);
	}
	getControllerForElementAndIdentifier(e, t) {
		let n = this.router.getContextForElementAndIdentifier(e, t);
		return n ? n.controller : null;
	}
	handleError(e, t, n) {
		var r;
		this.logger.error("%s\n\n%o\n\n%o", t, e, n), (r = window.onerror) == null || r.call(window, t, "", 0, 0, e);
	}
	logFormattedMessage(e, t, n = {}) {
		n = Object.assign({ application: this }, n), this.logger.groupCollapsed(`${e} #${t}`), this.logger.log("details:", Object.assign({}, n)), this.logger.groupEnd();
	}
};
function Ye() {
	return new Promise((e) => {
		document.readyState == "loading" ? document.addEventListener("DOMContentLoaded", () => e()) : e();
	});
}
function Xe(e) {
	return _(e, "classes").reduce((e, t) => Object.assign(e, Ze(t)), {});
}
function Ze(e) {
	return {
		[`${e}Class`]: { get() {
			let { classes: t } = this;
			if (t.has(e)) return t.get(e);
			{
				let n = t.getAttributeName(e);
				throw Error(`Missing attribute "${n}"`);
			}
		} },
		[`${e}Classes`]: { get() {
			return this.classes.getAll(e);
		} },
		[`has${d(e)}Class`]: { get() {
			return this.classes.has(e);
		} }
	};
}
function Qe(e) {
	return _(e, "outlets").reduce((e, t) => Object.assign(e, tt(t)), {});
}
function $e(e, t, n) {
	return e.application.getControllerForElementAndIdentifier(t, n);
}
function et(e, t, n) {
	let r = $e(e, t, n);
	if (r || (e.application.router.proposeToConnectScopeForElementAndIdentifier(t, n), r = $e(e, t, n), r)) return r;
}
function tt(e) {
	let t = u(e);
	return {
		[`${t}Outlet`]: { get() {
			let t = this.outlets.find(e), n = this.outlets.getSelectorForOutletName(e);
			if (t) {
				let n = et(this, t, e);
				if (n) return n;
				throw Error(`The provided outlet element is missing an outlet controller "${e}" instance for host controller "${this.identifier}"`);
			}
			throw Error(`Missing outlet element "${e}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${n}".`);
		} },
		[`${t}Outlets`]: { get() {
			let t = this.outlets.findAll(e);
			return t.length > 0 ? t.map((t) => {
				let n = et(this, t, e);
				if (n) return n;
				console.warn(`The provided outlet element is missing an outlet controller "${e}" instance for host controller "${this.identifier}"`, t);
			}).filter((e) => e) : [];
		} },
		[`${t}OutletElement`]: { get() {
			let t = this.outlets.find(e), n = this.outlets.getSelectorForOutletName(e);
			if (t) return t;
			throw Error(`Missing outlet element "${e}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${n}".`);
		} },
		[`${t}OutletElements`]: { get() {
			return this.outlets.findAll(e);
		} },
		[`has${d(t)}Outlet`]: { get() {
			return this.outlets.has(e);
		} }
	};
}
function nt(e) {
	return _(e, "targets").reduce((e, t) => Object.assign(e, rt(t)), {});
}
function rt(e) {
	return {
		[`${e}Target`]: { get() {
			let t = this.targets.find(e);
			if (t) return t;
			throw Error(`Missing target element "${e}" for "${this.identifier}" controller`);
		} },
		[`${e}Targets`]: { get() {
			return this.targets.findAll(e);
		} },
		[`has${d(e)}Target`]: { get() {
			return this.targets.has(e);
		} }
	};
}
function it(e) {
	let t = Ce(e, "values");
	return t.reduce((e, t) => Object.assign(e, at(t)), { valueDescriptorMap: { get() {
		return t.reduce((e, t) => {
			let n = ot(t, this.identifier), r = this.data.getAttributeNameForKey(n.key);
			return Object.assign(e, { [r]: n });
		}, {});
	} } });
}
function at(e, t) {
	let n = ot(e, t), { key: r, name: i, reader: a, writer: o } = n;
	return {
		[i]: {
			get() {
				let e = this.data.get(r);
				return e === null ? n.defaultValue : a(e);
			},
			set(e) {
				e === void 0 ? this.data.delete(r) : this.data.set(r, o(e));
			}
		},
		[`has${d(i)}`]: { get() {
			return this.data.has(r) || n.hasCustomDefaultValue;
		} }
	};
}
function ot([e, t], n) {
	return ut({
		controller: n,
		token: e,
		typeDefinition: t
	});
}
function y(e) {
	switch (e) {
		case Array: return "array";
		case Boolean: return "boolean";
		case Number: return "number";
		case Object: return "object";
		case String: return "string";
	}
}
function b(e) {
	switch (typeof e) {
		case "boolean": return "boolean";
		case "number": return "number";
		case "string": return "string";
	}
	if (Array.isArray(e)) return "array";
	if (Object.prototype.toString.call(e) === "[object Object]") return "object";
}
function st(e) {
	let { controller: t, token: n, typeObject: r } = e, i = te(r.type), a = te(r.default), o = i && a, s = i && !a, c = !i && a, l = y(r.type), u = b(e.typeObject.default);
	if (s) return l;
	if (c) return u;
	if (l !== u) {
		let e = t ? `${t}.${n}` : n;
		throw Error(`The specified default value for the Stimulus Value "${e}" must match the defined type "${l}". The provided default value of "${r.default}" is of type "${u}".`);
	}
	if (o) return l;
}
function ct(e) {
	let { controller: t, token: n, typeDefinition: r } = e, i = st({
		controller: t,
		token: n,
		typeObject: r
	}), a = b(r), o = y(r), s = i || a || o;
	if (s) return s;
	let c = t ? `${t}.${r}` : n;
	throw Error(`Unknown value type "${c}" for "${n}" value`);
}
function lt(e) {
	let t = y(e);
	if (t) return dt[t];
	let n = p(e, "default"), r = p(e, "type"), i = e;
	if (n) return i.default;
	if (r) {
		let { type: e } = i, t = y(e);
		if (t) return dt[t];
	}
	return e;
}
function ut(e) {
	let { token: t, typeDefinition: n } = e, r = `${f(t)}-value`, i = ct(e);
	return {
		type: i,
		key: r,
		name: l(r),
		get defaultValue() {
			return lt(n);
		},
		get hasCustomDefaultValue() {
			return b(n) !== void 0;
		},
		reader: ft[i],
		writer: pt[i] || pt.default
	};
}
var dt = {
	get array() {
		return [];
	},
	boolean: !1,
	number: 0,
	get object() {
		return {};
	},
	string: ""
}, ft = {
	array(e) {
		let t = JSON.parse(e);
		if (!Array.isArray(t)) throw TypeError(`expected value of type "array" but instead got value "${e}" of type "${b(t)}"`);
		return t;
	},
	boolean(e) {
		return e != "0" && String(e).toLowerCase() != "false";
	},
	number(e) {
		return Number(e.replace(/_/g, ""));
	},
	object(e) {
		let t = JSON.parse(e);
		if (typeof t != "object" || !t || Array.isArray(t)) throw TypeError(`expected value of type "object" but instead got value "${e}" of type "${b(t)}"`);
		return t;
	},
	string(e) {
		return e;
	}
}, pt = {
	default: ht,
	array: mt,
	object: mt
};
function mt(e) {
	return JSON.stringify(e);
}
function ht(e) {
	return `${e}`;
}
var x = class {
	constructor(e) {
		this.context = e;
	}
	static get shouldLoad() {
		return !0;
	}
	static afterLoad(e, t) {}
	get application() {
		return this.context.application;
	}
	get scope() {
		return this.context.scope;
	}
	get element() {
		return this.scope.element;
	}
	get identifier() {
		return this.scope.identifier;
	}
	get targets() {
		return this.scope.targets;
	}
	get outlets() {
		return this.scope.outlets;
	}
	get classes() {
		return this.scope.classes;
	}
	get data() {
		return this.scope.data;
	}
	initialize() {}
	connect() {}
	disconnect() {}
	dispatch(e, { target: t = this.element, detail: n = {}, prefix: r = this.identifier, bubbles: i = !0, cancelable: a = !0 } = {}) {
		let o = r ? `${r}:${e}` : e, s = new CustomEvent(o, {
			detail: n,
			bubbles: i,
			cancelable: a
		});
		return t.dispatchEvent(s), s;
	}
};
x.blessings = [
	Xe,
	nt,
	it,
	Qe
], x.targets = [], x.outlets = [], x.values = {};
//#endregion
//#region assets/controllers/hello_controller.js
var gt = class extends x {
	connect() {
		this.element.textContent = "Hello Stimulus! Edit me in assets/controllers/hello_controller.js";
	}
}, S = /^[-_a-zA-Z0-9]{4,22}$/, _t = /^[-_/+a-zA-Z0-9]{24,}$/;
document.addEventListener("submit", function(e) {
	vt(e.target);
}, !0), document.addEventListener("turbo:submit-start", function(e) {
	let t = yt(e.detail.formSubmission.formElement);
	Object.keys(t).map(function(n) {
		e.detail.formSubmission.fetchRequest.headers[n] = t[n];
	});
}), document.addEventListener("turbo:submit-end", function(e) {
	bt(e.detail.formSubmission.formElement);
});
function vt(e) {
	let t = e.querySelector("input[data-controller=\"csrf-protection\"], input[name=\"_csrf_token\"]");
	if (!t) return;
	let n = t.getAttribute("data-csrf-protection-cookie-value"), r = t.value;
	if (!n && S.test(r) && (t.setAttribute("data-csrf-protection-cookie-value", n = r), t.defaultValue = r = btoa(String.fromCharCode.apply(null, (window.crypto || window.msCrypto).getRandomValues(/* @__PURE__ */ new Uint8Array(18))))), t.dispatchEvent(new Event("change", { bubbles: !0 })), n && _t.test(r)) {
		let e = n + "_" + r + "=" + n + "; path=/; samesite=strict";
		document.cookie = window.location.protocol === "https:" ? "__Host-" + e + "; secure" : e;
	}
}
function yt(e) {
	let t = {}, n = e.querySelector("input[data-controller=\"csrf-protection\"], input[name=\"_csrf_token\"]");
	if (!n) return t;
	let r = n.getAttribute("data-csrf-protection-cookie-value");
	return _t.test(n.value) && S.test(r) && (t[r] = n.value), t;
}
function bt(e) {
	let t = e.querySelector("input[data-controller=\"csrf-protection\"], input[name=\"_csrf_token\"]");
	if (!t) return;
	let n = t.getAttribute("data-csrf-protection-cookie-value");
	if (_t.test(t.value) && S.test(n)) {
		let e = n + "_" + t.value + "=0; path=/; samesite=strict; max-age=0";
		document.cookie = window.location.protocol === "https:" ? "__Host-" + e + "; secure" : e;
	}
}
Je.start().register("hello", gt), document.addEventListener("submit", function(e) {
	vt(e.target);
}, !0), document.addEventListener("turbo:submit-start", function(e) {
	let t = yt(e.detail.formSubmission.formElement);
	Object.keys(t).forEach(function(n) {
		e.detail.formSubmission.fetchRequest.headers[n] = t[n];
	});
}), document.addEventListener("turbo:submit-end", function(e) {
	bt(e.detail.formSubmission.formElement);
});
//#endregion
//#region node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
var C = {
	eager: "eager",
	lazy: "lazy"
}, w = class e extends HTMLElement {
	static delegateConstructor = void 0;
	loaded = Promise.resolve();
	static get observedAttributes() {
		return [
			"disabled",
			"loading",
			"src"
		];
	}
	constructor() {
		super(), this.delegate = new e.delegateConstructor(this);
	}
	connectedCallback() {
		this.delegate.connect();
	}
	disconnectedCallback() {
		this.delegate.disconnect();
	}
	reload() {
		return this.delegate.sourceURLReloaded();
	}
	attributeChangedCallback(e) {
		e == "loading" ? this.delegate.loadingStyleChanged() : e == "src" ? this.delegate.sourceURLChanged() : e == "disabled" && this.delegate.disabledChanged();
	}
	get src() {
		return this.getAttribute("src");
	}
	set src(e) {
		e ? this.setAttribute("src", e) : this.removeAttribute("src");
	}
	get refresh() {
		return this.getAttribute("refresh");
	}
	set refresh(e) {
		e ? this.setAttribute("refresh", e) : this.removeAttribute("refresh");
	}
	get shouldReloadWithMorph() {
		return this.src && this.refresh === "morph";
	}
	get loading() {
		return xt(this.getAttribute("loading") || "");
	}
	set loading(e) {
		e ? this.setAttribute("loading", e) : this.removeAttribute("loading");
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		e ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
	}
	get autoscroll() {
		return this.hasAttribute("autoscroll");
	}
	set autoscroll(e) {
		e ? this.setAttribute("autoscroll", "") : this.removeAttribute("autoscroll");
	}
	get complete() {
		return !this.delegate.isLoading;
	}
	get isActive() {
		return this.ownerDocument === document && !this.isPreview;
	}
	get isPreview() {
		return this.ownerDocument?.documentElement?.hasAttribute("data-turbo-preview");
	}
};
function xt(e) {
	switch (e.toLowerCase()) {
		case "lazy": return C.lazy;
		default: return C.eager;
	}
}
var St = {
	enabled: !0,
	progressBarDelay: 500,
	unvisitableExtensions: /* @__PURE__ */ new Set(/* @__PURE__ */ ".7z,.aac,.apk,.avi,.bmp,.bz2,.css,.csv,.deb,.dmg,.doc,.docx,.exe,.gif,.gz,.heic,.heif,.ico,.iso,.jpeg,.jpg,.js,.json,.m4a,.mkv,.mov,.mp3,.mp4,.mpeg,.mpg,.msi,.ogg,.ogv,.pdf,.pkg,.png,.ppt,.pptx,.rar,.rtf,.svg,.tar,.tif,.tiff,.txt,.wav,.webm,.webp,.wma,.wmv,.xls,.xlsx,.xml,.zip".split(","))
};
function T(e) {
	if (e.getAttribute("data-turbo-eval") == "false") return e;
	{
		let t = document.createElement("script"), n = It();
		return n && (t.nonce = n), t.textContent = e.textContent, t.async = !1, Ct(t, e), t;
	}
}
function Ct(e, t) {
	for (let { name: n, value: r } of t.attributes) e.setAttribute(n, r);
}
function wt(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content;
}
function E(e, { target: t, cancelable: n, detail: r } = {}) {
	let i = new CustomEvent(e, {
		cancelable: n,
		bubbles: !0,
		composed: !0,
		detail: r
	});
	return t && t.isConnected ? t.dispatchEvent(i) : document.documentElement.dispatchEvent(i), i;
}
function Tt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
function D() {
	return document.visibilityState === "hidden" ? Dt() : Et();
}
function Et() {
	return new Promise((e) => requestAnimationFrame(() => e()));
}
function Dt() {
	return new Promise((e) => setTimeout(() => e(), 0));
}
function Ot(e = "") {
	return new DOMParser().parseFromString(e, "text/html");
}
function kt(e, ...t) {
	let n = At(e, t).replace(/^\n/, "").split("\n"), r = n[0].match(/^\s+/), i = r ? r[0].length : 0;
	return n.map((e) => e.slice(i)).join("\n");
}
function At(e, t) {
	return e.reduce((e, n, r) => {
		let i = t[r] == null ? "" : t[r];
		return e + n + i;
	}, "");
}
function O() {
	return Array.from({ length: 36 }).map((e, t) => t == 8 || t == 13 || t == 18 || t == 23 ? "-" : t == 14 ? "4" : t == 19 ? (Math.floor(Math.random() * 4) + 8).toString(16) : Math.floor(Math.random() * 16).toString(16)).join("");
}
function k(e, ...t) {
	for (let n of t.map((t) => t?.getAttribute(e))) if (typeof n == "string") return n;
	return null;
}
function jt(e, ...t) {
	return t.some((t) => t && t.hasAttribute(e));
}
function A(...e) {
	for (let t of e) t.localName == "turbo-frame" && t.setAttribute("busy", ""), t.setAttribute("aria-busy", "true");
}
function j(...e) {
	for (let t of e) t.localName == "turbo-frame" && t.removeAttribute("busy"), t.removeAttribute("aria-busy");
}
function Mt(e, t = 2e3) {
	return new Promise((n) => {
		let r = () => {
			e.removeEventListener("error", r), e.removeEventListener("load", r), n();
		};
		e.addEventListener("load", r, { once: !0 }), e.addEventListener("error", r, { once: !0 }), setTimeout(n, t);
	});
}
function Nt(e) {
	switch (e) {
		case "replace": return history.replaceState;
		case "advance":
		case "restore": return history.pushState;
	}
}
function Pt(e) {
	return e == "advance" || e == "replace" || e == "restore";
}
function M(...e) {
	let t = k("data-turbo-action", ...e);
	return Pt(t) ? t : null;
}
function Ft(e) {
	return document.querySelector(`meta[name="${e}"]`);
}
function N(e) {
	let t = Ft(e);
	return t && t.content;
}
function It() {
	let e = Ft("csp-nonce");
	if (e) {
		let { nonce: t, content: n } = e;
		return t == "" ? n : t;
	}
}
function Lt(e, t) {
	let n = Ft(e);
	return n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t), n;
}
function P(e, t) {
	if (e instanceof Element) return e.closest(t) || P(e.assignedSlot || e.getRootNode()?.host, t);
}
function Rt(e) {
	return !!e && e.closest("[inert], :disabled, [hidden], details:not([open]), dialog:not([open])") == null && typeof e.focus == "function";
}
function zt(e) {
	return Array.from(e.querySelectorAll("[autofocus]")).find(Rt);
}
async function Bt(e, t) {
	let n = t();
	return e(), await Et(), [n, t()];
}
function Vt(e) {
	if (e === "_blank") return !1;
	if (e) {
		for (let t of document.getElementsByName(e)) if (t instanceof HTMLIFrameElement) return !1;
		return !0;
	}
	return !0;
}
function Ht(e) {
	let t = P(e, "a[href], a[xlink\\:href]");
	if (!t || t.href.startsWith("#") || t.hasAttribute("download")) return null;
	let n = t.getAttribute("target");
	return n && n !== "_self" ? null : t;
}
function Ut(e, t) {
	let n = null;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e.apply(this, r), t);
	};
}
var Wt = {
	"aria-disabled": {
		beforeSubmit: (e) => {
			e.setAttribute("aria-disabled", "true"), e.addEventListener("click", Tt);
		},
		afterSubmit: (e) => {
			e.removeAttribute("aria-disabled"), e.removeEventListener("click", Tt);
		}
	},
	disabled: {
		beforeSubmit: (e) => e.disabled = !0,
		afterSubmit: (e) => e.disabled = !1
	}
}, F = {
	drive: St,
	forms: new class {
		#e = null;
		constructor(e) {
			Object.assign(this, e);
		}
		get submitter() {
			return this.#e;
		}
		set submitter(e) {
			this.#e = Wt[e] || e;
		}
	}({
		mode: "on",
		submitter: "disabled"
	})
};
function I(e) {
	return new URL(e.toString(), document.baseURI);
}
function L(e) {
	let t;
	if (e.hash) return e.hash.slice(1);
	if (t = e.href.match(/#(.*)$/)) return t[1];
}
function Gt(e, t) {
	return I(t?.getAttribute("formaction") || e.getAttribute("action") || e.action);
}
function Kt(e) {
	return (Qt(e).match(/\.[^.]*$/) || [])[0] || "";
}
function qt(e, t) {
	let n = $t(t.origin + t.pathname);
	return $t(e.href) === n || e.href.startsWith(n);
}
function R(e, t) {
	return qt(e, t) && !F.drive.unvisitableExtensions.has(Kt(e));
}
function Jt(e) {
	return I(e.getAttribute("href") || "");
}
function Yt(e) {
	let t = L(e);
	return t == null ? e.href : e.href.slice(0, -(t.length + 1));
}
function z(e) {
	return Yt(e);
}
function Xt(e, t) {
	return I(e).href == I(t).href;
}
function Zt(e) {
	return e.pathname.split("/").slice(1);
}
function Qt(e) {
	return Zt(e).slice(-1)[0];
}
function $t(e) {
	return e.endsWith("/") ? e : e + "/";
}
var en = class {
	constructor(e) {
		this.response = e;
	}
	get succeeded() {
		return this.response.ok;
	}
	get failed() {
		return !this.succeeded;
	}
	get clientError() {
		return this.statusCode >= 400 && this.statusCode <= 499;
	}
	get serverError() {
		return this.statusCode >= 500 && this.statusCode <= 599;
	}
	get redirected() {
		return this.response.redirected;
	}
	get location() {
		return I(this.response.url);
	}
	get isHTML() {
		return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
	}
	get statusCode() {
		return this.response.status;
	}
	get contentType() {
		return this.header("Content-Type");
	}
	get responseText() {
		return this.response.clone().text();
	}
	get responseHTML() {
		return this.isHTML ? this.response.clone().text() : Promise.resolve(void 0);
	}
	header(e) {
		return this.response.headers.get(e);
	}
}, tn = new class extends Set {
	constructor(e) {
		super(), this.maxSize = e;
	}
	add(e) {
		if (this.size >= this.maxSize) {
			let e = this.values().next().value;
			this.delete(e);
		}
		super.add(e);
	}
}(20);
function nn(e, t = {}) {
	let n = new Headers(t.headers || {}), r = O();
	return tn.add(r), n.append("X-Turbo-Request-Id", r), window.fetch(e, {
		...t,
		headers: n
	});
}
function rn(e) {
	switch (e.toLowerCase()) {
		case "get": return B.get;
		case "post": return B.post;
		case "put": return B.put;
		case "patch": return B.patch;
		case "delete": return B.delete;
	}
}
var B = {
	get: "get",
	post: "post",
	put: "put",
	patch: "patch",
	delete: "delete"
};
function an(e) {
	switch (e.toLowerCase()) {
		case V.multipart: return V.multipart;
		case V.plain: return V.plain;
		default: return V.urlEncoded;
	}
}
var V = {
	urlEncoded: "application/x-www-form-urlencoded",
	multipart: "multipart/form-data",
	plain: "text/plain"
}, H = class {
	abortController = new AbortController();
	#e = (e) => {};
	constructor(e, t, n, r = new URLSearchParams(), i = null, a = V.urlEncoded) {
		let [o, s] = sn(I(n), t, r, a);
		this.delegate = e, this.url = o, this.target = i, this.fetchOptions = {
			credentials: "same-origin",
			redirect: "follow",
			method: t.toUpperCase(),
			headers: { ...this.defaultHeaders },
			body: s,
			signal: this.abortSignal,
			referrer: this.delegate.referrer?.href
		}, this.enctype = a;
	}
	get method() {
		return this.fetchOptions.method;
	}
	set method(e) {
		let t = this.isSafe ? this.url.searchParams : this.fetchOptions.body || new FormData(), n = rn(e) || B.get;
		this.url.search = "";
		let [r, i] = sn(this.url, n, t, this.enctype);
		this.url = r, this.fetchOptions.body = i, this.fetchOptions.method = n.toUpperCase();
	}
	get headers() {
		return this.fetchOptions.headers;
	}
	set headers(e) {
		this.fetchOptions.headers = e;
	}
	get body() {
		return this.isSafe ? this.url.searchParams : this.fetchOptions.body;
	}
	set body(e) {
		this.fetchOptions.body = e;
	}
	get location() {
		return this.url;
	}
	get params() {
		return this.url.searchParams;
	}
	get entries() {
		return this.body ? Array.from(this.body.entries()) : [];
	}
	cancel() {
		this.abortController.abort();
	}
	async perform() {
		let { fetchOptions: e } = this;
		this.delegate.prepareRequest(this);
		let t = await this.#t(e);
		try {
			this.delegate.requestStarted(this), this.response = t.detail.fetchRequest ? t.detail.fetchRequest.response : nn(this.url.href, e);
			let n = await this.response;
			return await this.receive(n);
		} catch (e) {
			if (e.name !== "AbortError") throw this.#n(e) && this.delegate.requestErrored(this, e), e;
		} finally {
			this.delegate.requestFinished(this);
		}
	}
	async receive(e) {
		let t = new en(e);
		return E("turbo:before-fetch-response", {
			cancelable: !0,
			detail: { fetchResponse: t },
			target: this.target
		}).defaultPrevented ? this.delegate.requestPreventedHandlingResponse(this, t) : t.succeeded ? this.delegate.requestSucceededWithResponse(this, t) : this.delegate.requestFailedWithResponse(this, t), t;
	}
	get defaultHeaders() {
		return { Accept: "text/html, application/xhtml+xml" };
	}
	get isSafe() {
		return on(this.method);
	}
	get abortSignal() {
		return this.abortController.signal;
	}
	acceptResponseType(e) {
		this.headers.Accept = [e, this.headers.Accept].join(", ");
	}
	async #t(e) {
		let t = new Promise((e) => this.#e = e), n = E("turbo:before-fetch-request", {
			cancelable: !0,
			detail: {
				fetchOptions: e,
				url: this.url,
				resume: this.#e
			},
			target: this.target
		});
		return this.url = n.detail.url, n.defaultPrevented && await t, n;
	}
	#n(e) {
		return !E("turbo:fetch-request-error", {
			target: this.target,
			cancelable: !0,
			detail: {
				request: this,
				error: e
			}
		}).defaultPrevented;
	}
};
function on(e) {
	return rn(e) == B.get;
}
function sn(e, t, n, r) {
	let i = Array.from(n).length > 0 ? new URLSearchParams(cn(n)) : e.searchParams;
	return on(t) ? [ln(e, i), null] : r == V.urlEncoded ? [e, i] : [e, n];
}
function cn(e) {
	let t = [];
	for (let [n, r] of e) if (r instanceof File) continue;
	else t.push([n, r]);
	return t;
}
function ln(e, t) {
	return e.search = new URLSearchParams(cn(t)).toString(), e;
}
var un = class {
	started = !1;
	constructor(e, t) {
		this.delegate = e, this.element = t, this.intersectionObserver = new IntersectionObserver(this.intersect);
	}
	start() {
		this.started || (this.started = !0, this.intersectionObserver.observe(this.element));
	}
	stop() {
		this.started && (this.started = !1, this.intersectionObserver.unobserve(this.element));
	}
	intersect = (e) => {
		e.slice(-1)[0]?.isIntersecting && this.delegate.elementAppearedInViewport(this.element);
	};
}, U = class {
	static contentType = "text/vnd.turbo-stream.html";
	static wrap(e) {
		return typeof e == "string" ? new this(wt(e)) : e;
	}
	constructor(e) {
		this.fragment = dn(e);
	}
};
function dn(e) {
	for (let t of e.querySelectorAll("turbo-stream")) {
		let e = document.importNode(t, !0);
		for (let t of e.templateElement.content.querySelectorAll("script")) t.replaceWith(T(t));
		t.replaceWith(e);
	}
	return e;
}
var fn = (e) => e, pn = class {
	keys = [];
	entries = {};
	#e;
	constructor(e, t = fn) {
		this.size = e, this.#e = t;
	}
	has(e) {
		return this.#e(e) in this.entries;
	}
	get(e) {
		if (this.has(e)) {
			let t = this.read(e);
			return this.touch(e), t;
		}
	}
	put(e, t) {
		return this.write(e, t), this.touch(e), t;
	}
	clear() {
		for (let e of Object.keys(this.entries)) this.evict(e);
	}
	read(e) {
		return this.entries[this.#e(e)];
	}
	write(e, t) {
		this.entries[this.#e(e)] = t;
	}
	touch(e) {
		e = this.#e(e);
		let t = this.keys.indexOf(e);
		t > -1 && this.keys.splice(t, 1), this.keys.unshift(e), this.trim();
	}
	trim() {
		for (let e of this.keys.splice(this.size)) this.evict(e);
	}
	evict(e) {
		delete this.entries[e];
	}
}, mn = 100, hn = class extends pn {
	#e = null;
	#t = {};
	constructor(e = 1, t = mn) {
		super(e, z), this.prefetchDelay = t;
	}
	putLater(e, t, n) {
		this.#e = setTimeout(() => {
			t.perform(), this.put(e, t, n), this.#e = null;
		}, this.prefetchDelay);
	}
	put(e, t, n = gn) {
		super.put(e, t), this.#t[z(e)] = new Date((/* @__PURE__ */ new Date()).getTime() + n);
	}
	clear() {
		super.clear(), this.#e && clearTimeout(this.#e);
	}
	evict(e) {
		super.evict(e), delete this.#t[e];
	}
	has(e) {
		if (super.has(e)) {
			let t = this.#t[z(e)];
			return t && t > Date.now();
		}
		return !1;
	}
}, gn = 1e4, W = new hn(), G = {
	initialized: "initialized",
	requesting: "requesting",
	waiting: "waiting",
	receiving: "receiving",
	stopping: "stopping",
	stopped: "stopped"
}, _n = class e {
	state = G.initialized;
	static confirmMethod(e) {
		return Promise.resolve(confirm(e));
	}
	constructor(e, t, n, r = !1) {
		let i = Cn(t, n), a = Sn(xn(t, n), i), o = vn(t, n), s = wn(t, n);
		this.delegate = e, this.formElement = t, this.submitter = n, this.fetchRequest = new H(this, i, a, o, t, s), this.mustRedirect = r;
	}
	get method() {
		return this.fetchRequest.method;
	}
	set method(e) {
		this.fetchRequest.method = e;
	}
	get action() {
		return this.fetchRequest.url.toString();
	}
	set action(e) {
		this.fetchRequest.url = I(e);
	}
	get body() {
		return this.fetchRequest.body;
	}
	get enctype() {
		return this.fetchRequest.enctype;
	}
	get isSafe() {
		return this.fetchRequest.isSafe;
	}
	get location() {
		return this.fetchRequest.url;
	}
	async start() {
		let { initialized: t, requesting: n } = G, r = k("data-turbo-confirm", this.submitter, this.formElement);
		if ((typeof r != "string" || await (typeof F.forms.confirm == "function" ? F.forms.confirm : e.confirmMethod)(r, this.formElement, this.submitter)) && this.state == t) return this.state = n, this.fetchRequest.perform();
	}
	stop() {
		let { stopping: e, stopped: t } = G;
		if (this.state != e && this.state != t) return this.state = e, this.fetchRequest.cancel(), !0;
	}
	prepareRequest(e) {
		if (!e.isSafe) {
			let t = yn(N("csrf-param")) || N("csrf-token");
			t && (e.headers["X-CSRF-Token"] = t);
		}
		this.requestAcceptsTurboStreamResponse(e) && e.acceptResponseType(U.contentType);
	}
	requestStarted(e) {
		this.state = G.waiting, this.submitter && F.forms.submitter.beforeSubmit(this.submitter), this.setSubmitsWith(), A(this.formElement), E("turbo:submit-start", {
			target: this.formElement,
			detail: { formSubmission: this }
		}), this.delegate.formSubmissionStarted(this);
	}
	requestPreventedHandlingResponse(e, t) {
		W.clear(), this.result = {
			success: t.succeeded,
			fetchResponse: t
		};
	}
	requestSucceededWithResponse(e, t) {
		if (t.clientError || t.serverError) {
			this.delegate.formSubmissionFailedWithResponse(this, t);
			return;
		}
		if (W.clear(), this.requestMustRedirect(e) && bn(t)) {
			let e = /* @__PURE__ */ Error("Form responses must redirect to another location");
			this.delegate.formSubmissionErrored(this, e);
		} else this.state = G.receiving, this.result = {
			success: !0,
			fetchResponse: t
		}, this.delegate.formSubmissionSucceededWithResponse(this, t);
	}
	requestFailedWithResponse(e, t) {
		this.result = {
			success: !1,
			fetchResponse: t
		}, this.delegate.formSubmissionFailedWithResponse(this, t);
	}
	requestErrored(e, t) {
		this.result = {
			success: !1,
			error: t
		}, this.delegate.formSubmissionErrored(this, t);
	}
	requestFinished(e) {
		this.state = G.stopped, this.submitter && F.forms.submitter.afterSubmit(this.submitter), this.resetSubmitterText(), j(this.formElement), E("turbo:submit-end", {
			target: this.formElement,
			detail: {
				formSubmission: this,
				...this.result
			}
		}), this.delegate.formSubmissionFinished(this);
	}
	setSubmitsWith() {
		if (this.submitter && this.submitsWith) {
			if (this.submitter.matches("button")) this.originalSubmitText = this.submitter.innerHTML, this.submitter.innerHTML = this.submitsWith;
			else if (this.submitter.matches("input")) {
				let e = this.submitter;
				this.originalSubmitText = e.value, e.value = this.submitsWith;
			}
		}
	}
	resetSubmitterText() {
		if (this.submitter && this.originalSubmitText) {
			if (this.submitter.matches("button")) this.submitter.innerHTML = this.originalSubmitText;
			else if (this.submitter.matches("input")) {
				let e = this.submitter;
				e.value = this.originalSubmitText;
			}
		}
	}
	requestMustRedirect(e) {
		return !e.isSafe && this.mustRedirect;
	}
	requestAcceptsTurboStreamResponse(e) {
		return !e.isSafe || jt("data-turbo-stream", this.submitter, this.formElement);
	}
	get submitsWith() {
		return this.submitter?.getAttribute("data-turbo-submits-with");
	}
};
function vn(e, t) {
	let n = new FormData(e), r = t?.getAttribute("name"), i = t?.getAttribute("value");
	return r && n.append(r, i || ""), n;
}
function yn(e) {
	if (e != null) {
		let t = (document.cookie ? document.cookie.split("; ") : []).find((t) => t.startsWith(e));
		if (t) {
			let e = t.split("=").slice(1).join("=");
			return e ? decodeURIComponent(e) : void 0;
		}
	}
}
function bn(e) {
	return e.statusCode == 200 && !e.redirected;
}
function xn(e, t) {
	let n = typeof e.action == "string" ? e.action : null;
	return t?.hasAttribute("formaction") ? t.getAttribute("formaction") || "" : e.getAttribute("action") || n || "";
}
function Sn(e, t) {
	let n = I(e);
	return on(t) && (n.search = ""), n;
}
function Cn(e, t) {
	return rn((t?.getAttribute("formmethod") || e.getAttribute("method") || "").toLowerCase()) || B.get;
}
function wn(e, t) {
	return an(t?.getAttribute("formenctype") || e.enctype);
}
var K = class {
	constructor(e) {
		this.element = e;
	}
	get activeElement() {
		return this.element.ownerDocument.activeElement;
	}
	get children() {
		return [...this.element.children];
	}
	hasAnchor(e) {
		return this.getElementForAnchor(e) != null;
	}
	getElementForAnchor(e) {
		return e ? this.element.querySelector(`[id='${e}'], a[name='${e}']`) : null;
	}
	get isConnected() {
		return this.element.isConnected;
	}
	get firstAutofocusableElement() {
		return zt(this.element);
	}
	get permanentElements() {
		return En(this.element);
	}
	getPermanentElementById(e) {
		return Tn(this.element, e);
	}
	getPermanentElementMapForSnapshot(e) {
		let t = {};
		for (let n of this.permanentElements) {
			let { id: r } = n, i = e.getPermanentElementById(r);
			i && (t[r] = [n, i]);
		}
		return t;
	}
};
function Tn(e, t) {
	return e.querySelector(`#${t}[data-turbo-permanent]`);
}
function En(e) {
	return e.querySelectorAll("[id][data-turbo-permanent]");
}
var Dn = class {
	started = !1;
	constructor(e, t) {
		this.delegate = e, this.eventTarget = t;
	}
	start() {
		this.started ||= (this.eventTarget.addEventListener("submit", this.submitCaptured, !0), !0);
	}
	stop() {
		this.started &&= (this.eventTarget.removeEventListener("submit", this.submitCaptured, !0), !1);
	}
	submitCaptured = () => {
		this.eventTarget.removeEventListener("submit", this.submitBubbled, !1), this.eventTarget.addEventListener("submit", this.submitBubbled, !1);
	};
	submitBubbled = (e) => {
		if (!e.defaultPrevented) {
			let t = e.target instanceof HTMLFormElement ? e.target : void 0, n = e.submitter || void 0;
			t && On(t, n) && kn(t, n) && this.delegate.willSubmitForm(t, n) && (e.preventDefault(), e.stopImmediatePropagation(), this.delegate.formSubmitted(t, n));
		}
	};
};
function On(e, t) {
	return (t?.getAttribute("formmethod") || e.getAttribute("method")) != "dialog";
}
function kn(e, t) {
	return Vt(t?.getAttribute("formtarget") || e.getAttribute("target"));
}
var An = class {
	#e = (e) => {};
	#t = (e) => {};
	constructor(e, t) {
		this.delegate = e, this.element = t;
	}
	scrollToAnchor(e) {
		let t = this.snapshot.getElementForAnchor(e);
		t ? (this.focusElement(t), this.scrollToElement(t)) : this.scrollToPosition({
			x: 0,
			y: 0
		});
	}
	scrollToAnchorFromLocation(e) {
		this.scrollToAnchor(L(e));
	}
	scrollToElement(e) {
		e.scrollIntoView();
	}
	focusElement(e) {
		e instanceof HTMLElement && (e.hasAttribute("tabindex") ? e.focus() : (e.setAttribute("tabindex", "-1"), e.focus(), e.removeAttribute("tabindex")));
	}
	scrollToPosition({ x: e, y: t }) {
		this.scrollRoot.scrollTo(e, t);
	}
	scrollToTop() {
		this.scrollToPosition({
			x: 0,
			y: 0
		});
	}
	get scrollRoot() {
		return window;
	}
	async render(e) {
		let { isPreview: t, shouldRender: n, willRender: r, newSnapshot: i } = e, a = r;
		if (n) try {
			this.renderPromise = new Promise((e) => this.#e = e), this.renderer = e, await this.prepareToRenderSnapshot(e);
			let n = new Promise((e) => this.#t = e), r = {
				resume: this.#t,
				render: this.renderer.renderElement,
				renderMethod: this.renderer.renderMethod
			};
			this.delegate.allowsImmediateRender(i, r) || await n, await this.renderSnapshot(e), this.delegate.viewRenderedSnapshot(i, t, this.renderer.renderMethod), this.delegate.preloadOnLoadLinksForView(this.element), this.finishRenderingSnapshot(e);
		} finally {
			delete this.renderer, this.#e(void 0), delete this.renderPromise;
		}
		else a && this.invalidate(e.reloadReason);
	}
	invalidate(e) {
		this.delegate.viewInvalidated(e);
	}
	async prepareToRenderSnapshot(e) {
		this.markAsPreview(e.isPreview), await e.prepareToRender();
	}
	markAsPreview(e) {
		e ? this.element.setAttribute("data-turbo-preview", "") : this.element.removeAttribute("data-turbo-preview");
	}
	markVisitDirection(e) {
		this.element.setAttribute("data-turbo-visit-direction", e);
	}
	unmarkVisitDirection() {
		this.element.removeAttribute("data-turbo-visit-direction");
	}
	async renderSnapshot(e) {
		await e.render();
	}
	finishRenderingSnapshot(e) {
		e.finishRendering();
	}
}, jn = class extends An {
	missing() {
		this.element.innerHTML = "<strong class=\"turbo-frame-error\">Content missing</strong>";
	}
	get snapshot() {
		return new K(this.element);
	}
}, Mn = class {
	constructor(e, t) {
		this.delegate = e, this.element = t;
	}
	start() {
		this.element.addEventListener("click", this.clickBubbled), document.addEventListener("turbo:click", this.linkClicked), document.addEventListener("turbo:before-visit", this.willVisit);
	}
	stop() {
		this.element.removeEventListener("click", this.clickBubbled), document.removeEventListener("turbo:click", this.linkClicked), document.removeEventListener("turbo:before-visit", this.willVisit);
	}
	clickBubbled = (e) => {
		this.clickEventIsSignificant(e) ? this.clickEvent = e : delete this.clickEvent;
	};
	linkClicked = (e) => {
		this.clickEvent && this.clickEventIsSignificant(e) && this.delegate.shouldInterceptLinkClick(e.target, e.detail.url, e.detail.originalEvent) && (this.clickEvent.preventDefault(), e.preventDefault(), this.delegate.linkClickIntercepted(e.target, e.detail.url, e.detail.originalEvent)), delete this.clickEvent;
	};
	willVisit = (e) => {
		delete this.clickEvent;
	};
	clickEventIsSignificant(e) {
		let t = e.composed ? e.target?.parentElement : e.target, n = Ht(t) || t;
		return n instanceof Element && n.closest("turbo-frame, html") == this.element;
	}
}, Nn = class {
	started = !1;
	constructor(e, t) {
		this.delegate = e, this.eventTarget = t;
	}
	start() {
		this.started ||= (this.eventTarget.addEventListener("click", this.clickCaptured, !0), !0);
	}
	stop() {
		this.started &&= (this.eventTarget.removeEventListener("click", this.clickCaptured, !0), !1);
	}
	clickCaptured = () => {
		this.eventTarget.removeEventListener("click", this.clickBubbled, !1), this.eventTarget.addEventListener("click", this.clickBubbled, !1);
	};
	clickBubbled = (e) => {
		if (e instanceof MouseEvent && this.clickEventIsSignificant(e)) {
			let t = Ht(e.composedPath && e.composedPath()[0] || e.target);
			if (t && Vt(t.target)) {
				let n = Jt(t);
				this.delegate.willFollowLinkToLocation(t, n, e) && (e.preventDefault(), this.delegate.followedLinkToLocation(t, n));
			}
		}
	};
	clickEventIsSignificant(e) {
		return !(e.target && e.target.isContentEditable || e.defaultPrevented || e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
	}
}, Pn = class {
	constructor(e, t) {
		this.delegate = e, this.linkInterceptor = new Nn(this, t);
	}
	start() {
		this.linkInterceptor.start();
	}
	stop() {
		this.linkInterceptor.stop();
	}
	canPrefetchRequestToLocation(e, t) {
		return !1;
	}
	prefetchAndCacheRequestToLocation(e, t) {}
	willFollowLinkToLocation(e, t, n) {
		return this.delegate.willSubmitFormLinkToLocation(e, t, n) && (e.hasAttribute("data-turbo-method") || e.hasAttribute("data-turbo-stream"));
	}
	followedLinkToLocation(e, t) {
		let n = document.createElement("form");
		for (let [e, r] of t.searchParams) n.append(Object.assign(document.createElement("input"), {
			type: "hidden",
			name: e,
			value: r
		}));
		let r = Object.assign(t, { search: "" });
		n.setAttribute("data-turbo", "true"), n.setAttribute("action", r.href), n.setAttribute("hidden", "");
		let i = e.getAttribute("data-turbo-method");
		i && n.setAttribute("method", i);
		let a = e.getAttribute("data-turbo-frame");
		a && n.setAttribute("data-turbo-frame", a);
		let o = M(e);
		o && n.setAttribute("data-turbo-action", o);
		let s = e.getAttribute("data-turbo-confirm");
		s && n.setAttribute("data-turbo-confirm", s), e.hasAttribute("data-turbo-stream") && n.setAttribute("data-turbo-stream", ""), this.delegate.submittedFormLinkToLocation(e, t, n), document.body.appendChild(n), n.addEventListener("turbo:submit-end", () => n.remove(), { once: !0 }), requestAnimationFrame(() => n.requestSubmit());
	}
}, Fn = class {
	static async preservingPermanentElements(e, t, n) {
		let r = new this(e, t);
		r.enter(), await n(), r.leave();
	}
	constructor(e, t) {
		this.delegate = e, this.permanentElementMap = t;
	}
	enter() {
		for (let e in this.permanentElementMap) {
			let [t, n] = this.permanentElementMap[e];
			this.delegate.enteringBardo(t, n), this.replaceNewPermanentElementWithPlaceholder(n);
		}
	}
	leave() {
		for (let e in this.permanentElementMap) {
			let [t] = this.permanentElementMap[e];
			this.replaceCurrentPermanentElementWithClone(t), this.replacePlaceholderWithPermanentElement(t), this.delegate.leavingBardo(t);
		}
	}
	replaceNewPermanentElementWithPlaceholder(e) {
		let t = In(e);
		e.replaceWith(t);
	}
	replaceCurrentPermanentElementWithClone(e) {
		let t = e.cloneNode(!0);
		e.replaceWith(t);
	}
	replacePlaceholderWithPermanentElement(e) {
		this.getPlaceholderById(e.id)?.replaceWith(e);
	}
	getPlaceholderById(e) {
		return this.placeholders.find((t) => t.content == e);
	}
	get placeholders() {
		return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
	}
};
function In(e) {
	let t = document.createElement("meta");
	return t.setAttribute("name", "turbo-permanent-placeholder"), t.setAttribute("content", e.id), t;
}
var Ln = class {
	#e = null;
	static renderElement(e, t) {}
	constructor(e, t, n, r = !0) {
		this.currentSnapshot = e, this.newSnapshot = t, this.isPreview = n, this.willRender = r, this.renderElement = this.constructor.renderElement, this.promise = new Promise((e, t) => this.resolvingFunctions = {
			resolve: e,
			reject: t
		});
	}
	get shouldRender() {
		return !0;
	}
	get shouldAutofocus() {
		return !0;
	}
	get reloadReason() {}
	prepareToRender() {}
	render() {}
	finishRendering() {
		this.resolvingFunctions && (this.resolvingFunctions.resolve(), delete this.resolvingFunctions);
	}
	async preservingPermanentElements(e) {
		await Fn.preservingPermanentElements(this, this.permanentElementMap, e);
	}
	focusFirstAutofocusableElement() {
		if (this.shouldAutofocus) {
			let e = this.connectedSnapshot.firstAutofocusableElement;
			e && e.focus();
		}
	}
	enteringBardo(e) {
		this.#e || e.contains(this.currentSnapshot.activeElement) && (this.#e = this.currentSnapshot.activeElement);
	}
	leavingBardo(e) {
		e.contains(this.#e) && this.#e instanceof HTMLElement && (this.#e.focus(), this.#e = null);
	}
	get connectedSnapshot() {
		return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
	}
	get currentElement() {
		return this.currentSnapshot.element;
	}
	get newElement() {
		return this.newSnapshot.element;
	}
	get permanentElementMap() {
		return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
	}
	get renderMethod() {
		return "replace";
	}
}, Rn = class extends Ln {
	static renderElement(e, t) {
		let n = document.createRange();
		n.selectNodeContents(e), n.deleteContents();
		let r = t, i = r.ownerDocument?.createRange();
		i && (i.selectNodeContents(r), e.appendChild(i.extractContents()));
	}
	constructor(e, t, n, r, i, a = !0) {
		super(t, n, r, i, a), this.delegate = e;
	}
	get shouldRender() {
		return !0;
	}
	async render() {
		await D(), this.preservingPermanentElements(() => {
			this.loadFrameElement();
		}), this.scrollFrameIntoView(), await D(), this.focusFirstAutofocusableElement(), await D(), this.activateScriptElements();
	}
	loadFrameElement() {
		this.delegate.willRenderFrame(this.currentElement, this.newElement), this.renderElement(this.currentElement, this.newElement);
	}
	scrollFrameIntoView() {
		if (this.currentElement.autoscroll || this.newElement.autoscroll) {
			let e = this.currentElement.firstElementChild, t = zn(this.currentElement.getAttribute("data-autoscroll-block"), "end"), n = Bn(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
			if (e) return e.scrollIntoView({
				block: t,
				behavior: n
			}), !0;
		}
		return !1;
	}
	activateScriptElements() {
		for (let e of this.newScriptElements) {
			let t = T(e);
			e.replaceWith(t);
		}
	}
	get newScriptElements() {
		return this.currentElement.querySelectorAll("script");
	}
};
function zn(e, t) {
	return e == "end" || e == "start" || e == "center" || e == "nearest" ? e : t;
}
function Bn(e, t) {
	return e == "auto" || e == "smooth" ? e : t;
}
var Vn = (function() {
	let e = () => {}, t = {
		morphStyle: "outerHTML",
		callbacks: {
			beforeNodeAdded: e,
			afterNodeAdded: e,
			beforeNodeMorphed: e,
			afterNodeMorphed: e,
			beforeNodeRemoved: e,
			afterNodeRemoved: e,
			beforeAttributeUpdated: e
		},
		head: {
			style: "merge",
			shouldPreserve: (e) => e.getAttribute("im-preserve") === "true",
			shouldReAppend: (e) => e.getAttribute("im-re-append") === "true",
			shouldRemove: e,
			afterHeadMorphed: e
		},
		restoreFocus: !0
	};
	function n(e, t, n = {}) {
		e = u(e);
		let o = d(t), c = l(e, o, n), f = i(c, () => s(c, e, o, (t) => t.morphStyle === "innerHTML" ? (a(t, e, o), Array.from(e.childNodes)) : r(t, e, o)));
		return c.pantry.remove(), f;
	}
	function r(e, t, n) {
		let r = d(t);
		return a(e, r, n, t, t.nextSibling), Array.from(r.childNodes);
	}
	function i(e, t) {
		if (!e.config.restoreFocus) return t();
		let n = document.activeElement;
		if (!(n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement)) return t();
		let { id: r, selectionStart: i, selectionEnd: a } = n, o = t();
		return r && r !== document.activeElement?.getAttribute("id") && (n = e.target.querySelector(`[id="${r}"]`), n?.focus()), n && !n.selectionEnd && a && n.setSelectionRange(i, a), o;
	}
	let a = (function() {
		function e(e, s, c, l = null, u = null) {
			s instanceof HTMLTemplateElement && c instanceof HTMLTemplateElement && (s = s.content, c = c.content), l ||= s.firstChild;
			for (let r of c.childNodes) {
				if (l && l != u) {
					let t = n(e, r, l, u);
					if (t) {
						t !== l && i(e, l, t), o(t, r, e), l = t.nextSibling;
						continue;
					}
				}
				if (r instanceof Element) {
					let t = r.getAttribute("id");
					if (e.persistentIds.has(t)) {
						let n = a(s, t, l, e);
						o(n, r, e), l = n.nextSibling;
						continue;
					}
				}
				let c = t(s, r, l, e);
				c && (l = c.nextSibling);
			}
			for (; l && l != u;) {
				let t = l;
				l = l.nextSibling, r(e, t);
			}
		}
		function t(e, t, n, r) {
			if (r.callbacks.beforeNodeAdded(t) === !1) return null;
			if (r.idMap.has(t)) {
				let i = document.createElement(t.tagName);
				return e.insertBefore(i, n), o(i, t, r), r.callbacks.afterNodeAdded(i), i;
			}
			{
				let i = document.importNode(t, !0);
				return e.insertBefore(i, n), r.callbacks.afterNodeAdded(i), i;
			}
		}
		let n = (function() {
			function e(e, r, i, a) {
				let o = null, s = r.nextSibling, c = 0, l = i;
				for (; l && l != a;) {
					if (n(l, r)) {
						if (t(e, l, r)) return l;
						o === null && (e.idMap.has(l) || (o = l));
					}
					if (o === null && s && n(l, s) && (c++, s = s.nextSibling, c >= 2 && (o = void 0)), e.activeElementAndParents.includes(l)) break;
					l = l.nextSibling;
				}
				return o || null;
			}
			function t(e, t, n) {
				let r = e.idMap.get(t), i = e.idMap.get(n);
				if (!i || !r) return !1;
				for (let e of r) if (i.has(e)) return !0;
				return !1;
			}
			function n(e, t) {
				let n = e, r = t;
				return n.nodeType === r.nodeType && n.tagName === r.tagName && (!n.getAttribute?.("id") || n.getAttribute?.("id") === r.getAttribute?.("id"));
			}
			return e;
		})();
		function r(e, t) {
			if (e.idMap.has(t)) c(e.pantry, t, null);
			else {
				if (e.callbacks.beforeNodeRemoved(t) === !1) return;
				t.parentNode?.removeChild(t), e.callbacks.afterNodeRemoved(t);
			}
		}
		function i(e, t, n) {
			let i = t;
			for (; i && i !== n;) {
				let t = i;
				i = i.nextSibling, r(e, t);
			}
			return i;
		}
		function a(e, t, n, r) {
			let i = r.target.getAttribute?.("id") === t && r.target || r.target.querySelector(`[id="${t}"]`) || r.pantry.querySelector(`[id="${t}"]`);
			return s(i, r), c(e, i, n), i;
		}
		function s(e, t) {
			let n = e.getAttribute("id");
			for (; e = e.parentNode;) {
				let r = t.idMap.get(e);
				r && (r.delete(n), r.size || t.idMap.delete(e));
			}
		}
		function c(e, t, n) {
			if (e.moveBefore) try {
				e.moveBefore(t, n);
			} catch {
				e.insertBefore(t, n);
			}
			else e.insertBefore(t, n);
		}
		return e;
	})(), o = (function() {
		function e(e, n, r) {
			return r.ignoreActive && e === document.activeElement ? null : r.callbacks.beforeNodeMorphed(e, n) === !1 ? e : (e instanceof HTMLHeadElement && r.head.ignore || (e instanceof HTMLHeadElement && r.head.style !== "morph" ? c(e, n, r) : (t(e, n, r), o(e, r) || a(r, e, n))), r.callbacks.afterNodeMorphed(e, n), e);
		}
		function t(e, t, r) {
			let a = t.nodeType;
			if (a === 1) {
				let a = e, s = t, c = a.attributes, l = s.attributes;
				for (let e of l) i(e.name, a, "update", r) || a.getAttribute(e.name) !== e.value && a.setAttribute(e.name, e.value);
				for (let e = c.length - 1; 0 <= e; e--) {
					let t = c[e];
					if (t && !s.hasAttribute(t.name)) {
						if (i(t.name, a, "remove", r)) continue;
						a.removeAttribute(t.name);
					}
				}
				o(a, r) || n(a, s, r);
			}
			(a === 8 || a === 3) && e.nodeValue !== t.nodeValue && (e.nodeValue = t.nodeValue);
		}
		function n(e, t, n) {
			if (e instanceof HTMLInputElement && t instanceof HTMLInputElement && t.type !== "file") {
				let a = t.value, o = e.value;
				r(e, t, "checked", n), r(e, t, "disabled", n), t.hasAttribute("value") ? o !== a && (i("value", e, "update", n) || (e.setAttribute("value", a), e.value = a)) : i("value", e, "remove", n) || (e.value = "", e.removeAttribute("value"));
			} else if (e instanceof HTMLOptionElement && t instanceof HTMLOptionElement) r(e, t, "selected", n);
			else if (e instanceof HTMLTextAreaElement && t instanceof HTMLTextAreaElement) {
				let r = t.value, a = e.value;
				if (i("value", e, "update", n)) return;
				r !== a && (e.value = r), e.firstChild && e.firstChild.nodeValue !== r && (e.firstChild.nodeValue = r);
			}
		}
		function r(e, t, n, r) {
			let a = t[n];
			if (a !== e[n]) {
				let o = i(n, e, "update", r);
				o || (e[n] = t[n]), a ? o || e.setAttribute(n, "") : i(n, e, "remove", r) || e.removeAttribute(n);
			}
		}
		function i(e, t, n, r) {
			return e === "value" && r.ignoreActiveValue && t === document.activeElement ? !0 : r.callbacks.beforeAttributeUpdated(e, t, n) === !1;
		}
		function o(e, t) {
			return !!t.ignoreActiveValue && e === document.activeElement && e !== document.body;
		}
		return e;
	})();
	function s(e, t, n, r) {
		if (e.head.block) {
			let i = t.querySelector("head"), a = n.querySelector("head");
			if (i && a) {
				let t = c(i, a, e);
				return Promise.all(t).then(() => r(Object.assign(e, { head: {
					block: !1,
					ignore: !0
				} })));
			}
		}
		return r(e);
	}
	function c(e, t, n) {
		let r = [], i = [], a = [], o = [], s = /* @__PURE__ */ new Map();
		for (let e of t.children) s.set(e.outerHTML, e);
		for (let t of e.children) {
			let e = s.has(t.outerHTML), r = n.head.shouldReAppend(t), c = n.head.shouldPreserve(t);
			e || c ? r ? i.push(t) : (s.delete(t.outerHTML), a.push(t)) : n.head.style === "append" ? r && (i.push(t), o.push(t)) : n.head.shouldRemove(t) !== !1 && i.push(t);
		}
		o.push(...s.values());
		let c = [];
		for (let t of o) {
			let i = document.createRange().createContextualFragment(t.outerHTML).firstChild;
			if (n.callbacks.beforeNodeAdded(i) !== !1) {
				if ("href" in i && i.href || "src" in i && i.src) {
					let e, t = new Promise(function(t) {
						e = t;
					});
					i.addEventListener("load", function() {
						e();
					}), c.push(t);
				}
				e.appendChild(i), n.callbacks.afterNodeAdded(i), r.push(i);
			}
		}
		for (let t of i) n.callbacks.beforeNodeRemoved(t) !== !1 && (e.removeChild(t), n.callbacks.afterNodeRemoved(t));
		return n.head.afterHeadMorphed(e, {
			added: r,
			kept: a,
			removed: i
		}), c;
	}
	let l = (function() {
		function e(e, t, a) {
			let { persistentIds: o, idMap: c } = s(e, t), l = n(a), u = l.morphStyle || "outerHTML";
			if (!["innerHTML", "outerHTML"].includes(u)) throw `Do not understand how to morph style ${u}`;
			return {
				target: e,
				newContent: t,
				config: l,
				morphStyle: u,
				ignoreActive: l.ignoreActive,
				ignoreActiveValue: l.ignoreActiveValue,
				restoreFocus: l.restoreFocus,
				idMap: c,
				persistentIds: o,
				pantry: r(),
				activeElementAndParents: i(e),
				callbacks: l.callbacks,
				head: l.head
			};
		}
		function n(e) {
			let n = Object.assign({}, t);
			return Object.assign(n, e), n.callbacks = Object.assign({}, t.callbacks, e.callbacks), n.head = Object.assign({}, t.head, e.head), n;
		}
		function r() {
			let e = document.createElement("div");
			return e.hidden = !0, document.body.insertAdjacentElement("afterend", e), e;
		}
		function i(e) {
			let t = [], n = document.activeElement;
			if (n?.tagName !== "BODY" && e.contains(n)) for (; n && (t.push(n), n !== e);) n = n.parentElement;
			return t;
		}
		function a(e) {
			let t = Array.from(e.querySelectorAll("[id]"));
			return e.getAttribute?.("id") && t.push(e), t;
		}
		function o(e, t, n, r) {
			for (let i of r) {
				let r = i.getAttribute("id");
				if (t.has(r)) {
					let t = i;
					for (; t;) {
						let i = e.get(t);
						if (i ?? (i = /* @__PURE__ */ new Set(), e.set(t, i)), i.add(r), t === n) break;
						t = t.parentElement;
					}
				}
			}
		}
		function s(e, t) {
			let n = a(e), r = a(t), i = c(n, r), s = /* @__PURE__ */ new Map();
			return o(s, i, e, n), o(s, i, t.__idiomorphRoot || t, r), {
				persistentIds: i,
				idMap: s
			};
		}
		function c(e, t) {
			let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map();
			for (let { id: t, tagName: i } of e) r.has(t) ? n.add(t) : r.set(t, i);
			let i = /* @__PURE__ */ new Set();
			for (let { id: e, tagName: a } of t) i.has(e) ? n.add(e) : r.get(e) === a && i.add(e);
			for (let e of n) i.delete(e);
			return i;
		}
		return e;
	})(), { normalizeElement: u, normalizeParent: d } = (function() {
		let e = /* @__PURE__ */ new WeakSet();
		function t(e) {
			return e instanceof Document ? e.documentElement : e;
		}
		function n(t) {
			if (t == null) return document.createElement("div");
			if (typeof t == "string") return n(i(t));
			if (e.has(t)) return t;
			if (t instanceof Node) {
				if (t.parentNode) return new r(t);
				{
					let e = document.createElement("div");
					return e.append(t), e;
				}
			}
			{
				let e = document.createElement("div");
				for (let n of [...t]) e.append(n);
				return e;
			}
		}
		class r {
			constructor(e) {
				this.originalNode = e, this.realParentNode = e.parentNode, this.previousSibling = e.previousSibling, this.nextSibling = e.nextSibling;
			}
			get childNodes() {
				let e = [], t = this.previousSibling ? this.previousSibling.nextSibling : this.realParentNode.firstChild;
				for (; t && t != this.nextSibling;) e.push(t), t = t.nextSibling;
				return e;
			}
			querySelectorAll(e) {
				return this.childNodes.reduce((t, n) => {
					if (n instanceof Element) {
						n.matches(e) && t.push(n);
						let r = n.querySelectorAll(e);
						for (let e = 0; e < r.length; e++) t.push(r[e]);
					}
					return t;
				}, []);
			}
			insertBefore(e, t) {
				return this.realParentNode.insertBefore(e, t);
			}
			moveBefore(e, t) {
				return this.realParentNode.moveBefore(e, t);
			}
			get __idiomorphRoot() {
				return this.originalNode;
			}
		}
		function i(t) {
			let n = new DOMParser(), r = t.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
			if (r.match(/<\/html>/) || r.match(/<\/head>/) || r.match(/<\/body>/)) {
				let i = n.parseFromString(t, "text/html");
				if (r.match(/<\/html>/)) return e.add(i), i;
				{
					let t = i.firstChild;
					return t && e.add(t), t;
				}
			}
			{
				let r = n.parseFromString("<body><template>" + t + "</template></body>", "text/html").body.querySelector("template").content;
				return e.add(r), r;
			}
		}
		return {
			normalizeElement: t,
			normalizeParent: n
		};
	})();
	return {
		morph: n,
		defaults: t
	};
})();
function q(e, t, { callbacks: n, ...r } = {}) {
	Vn.morph(e, t, {
		...r,
		callbacks: new Kn(n)
	});
}
function Hn(e, t, n = {}) {
	q(e, t.childNodes, {
		...n,
		morphStyle: "innerHTML"
	});
}
function Un(e, t) {
	return e instanceof w && e.shouldReloadWithMorph && (!t || Wn(e, t)) && !e.closest("[data-turbo-permanent]");
}
function Wn(e, t) {
	return t instanceof Element && t.nodeName === "TURBO-FRAME" && e.id === t.id && (!t.getAttribute("src") || Xt(e.src, t.getAttribute("src")));
}
function Gn(e) {
	return e.parentElement.closest("turbo-frame[src][refresh=morph]");
}
var Kn = class {
	#e;
	constructor({ beforeNodeMorphed: e } = {}) {
		this.#e = e || (() => !0);
	}
	beforeNodeAdded = (e) => !(e.id && e.hasAttribute("data-turbo-permanent") && document.getElementById(e.id));
	beforeNodeMorphed = (e, t) => {
		if (e instanceof Element) return !e.hasAttribute("data-turbo-permanent") && this.#e(e, t) ? !E("turbo:before-morph-element", {
			cancelable: !0,
			target: e,
			detail: {
				currentElement: e,
				newElement: t
			}
		}).defaultPrevented : !1;
	};
	beforeAttributeUpdated = (e, t, n) => !E("turbo:before-morph-attribute", {
		cancelable: !0,
		target: t,
		detail: {
			attributeName: e,
			mutationType: n
		}
	}).defaultPrevented;
	beforeNodeRemoved = (e) => this.beforeNodeMorphed(e);
	afterNodeMorphed = (e, t) => {
		e instanceof Element && E("turbo:morph-element", {
			target: e,
			detail: {
				currentElement: e,
				newElement: t
			}
		});
	};
}, qn = class extends Rn {
	static renderElement(e, t) {
		E("turbo:before-frame-morph", {
			target: e,
			detail: {
				currentElement: e,
				newElement: t
			}
		}), Hn(e, t, { callbacks: { beforeNodeMorphed: (t, n) => Un(t, n) && Gn(t) === e ? (t.reload(), !1) : !0 } });
	}
	async preservingPermanentElements(e) {
		return await e();
	}
}, Jn = class e {
	static animationDuration = 300;
	static get defaultCSS() {
		return kt`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${e.animationDuration}ms ease-out,
          opacity ${e.animationDuration / 2}ms ${e.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
	}
	hiding = !1;
	value = 0;
	visible = !1;
	constructor() {
		this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement(), this.installStylesheetElement(), this.setValue(0);
	}
	show() {
		this.visible || (this.visible = !0, this.installProgressElement(), this.startTrickling());
	}
	hide() {
		this.visible && !this.hiding && (this.hiding = !0, this.fadeProgressElement(() => {
			this.uninstallProgressElement(), this.stopTrickling(), this.visible = !1, this.hiding = !1;
		}));
	}
	setValue(e) {
		this.value = e, this.refresh();
	}
	installStylesheetElement() {
		document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
	}
	installProgressElement() {
		this.progressElement.style.width = "0", this.progressElement.style.opacity = "1", document.documentElement.insertBefore(this.progressElement, document.body), this.refresh();
	}
	fadeProgressElement(t) {
		this.progressElement.style.opacity = "0", setTimeout(t, e.animationDuration * 1.5);
	}
	uninstallProgressElement() {
		this.progressElement.parentNode && document.documentElement.removeChild(this.progressElement);
	}
	startTrickling() {
		this.trickleInterval ||= window.setInterval(this.trickle, e.animationDuration);
	}
	stopTrickling() {
		window.clearInterval(this.trickleInterval), delete this.trickleInterval;
	}
	trickle = () => {
		this.setValue(this.value + Math.random() / 100);
	};
	refresh() {
		requestAnimationFrame(() => {
			this.progressElement.style.width = `${10 + this.value * 90}%`;
		});
	}
	createStylesheetElement() {
		let t = document.createElement("style");
		t.type = "text/css", t.textContent = e.defaultCSS;
		let n = It();
		return n && (t.nonce = n), t;
	}
	createProgressElement() {
		let e = document.createElement("div");
		return e.className = "turbo-progress-bar", e;
	}
}, Yn = class extends K {
	detailsByOuterHTML = this.children.filter((e) => !$n(e)).map((e) => nr(e)).reduce((e, t) => {
		let { outerHTML: n } = t, r = n in e ? e[n] : {
			type: Xn(t),
			tracked: Zn(t),
			elements: []
		};
		return {
			...e,
			[n]: {
				...r,
				elements: [...r.elements, t]
			}
		};
	}, {});
	get trackedElementSignature() {
		return Object.keys(this.detailsByOuterHTML).filter((e) => this.detailsByOuterHTML[e].tracked).join("");
	}
	getScriptElementsNotInSnapshot(e) {
		return this.getElementsMatchingTypeNotInSnapshot("script", e);
	}
	getStylesheetElementsNotInSnapshot(e) {
		return this.getElementsMatchingTypeNotInSnapshot("stylesheet", e);
	}
	getElementsMatchingTypeNotInSnapshot(e, t) {
		return Object.keys(this.detailsByOuterHTML).filter((e) => !(e in t.detailsByOuterHTML)).map((e) => this.detailsByOuterHTML[e]).filter(({ type: t }) => t == e).map(({ elements: [e] }) => e);
	}
	get provisionalElements() {
		return Object.keys(this.detailsByOuterHTML).reduce((e, t) => {
			let { type: n, tracked: r, elements: i } = this.detailsByOuterHTML[t];
			return n == null && !r ? [...e, ...i] : i.length > 1 ? [...e, ...i.slice(1)] : e;
		}, []);
	}
	getMetaValue(e) {
		let t = this.findMetaElementByName(e);
		return t ? t.getAttribute("content") : null;
	}
	findMetaElementByName(e) {
		return Object.keys(this.detailsByOuterHTML).reduce((t, n) => {
			let { elements: [r] } = this.detailsByOuterHTML[n];
			return tr(r, e) ? r : t;
		}, 0);
	}
};
function Xn(e) {
	if (Qn(e)) return "script";
	if (er(e)) return "stylesheet";
}
function Zn(e) {
	return e.getAttribute("data-turbo-track") == "reload";
}
function Qn(e) {
	return e.localName == "script";
}
function $n(e) {
	return e.localName == "noscript";
}
function er(e) {
	let t = e.localName;
	return t == "style" || t == "link" && e.getAttribute("rel") == "stylesheet";
}
function tr(e, t) {
	return e.localName == "meta" && e.getAttribute("name") == t;
}
function nr(e) {
	return e.hasAttribute("nonce") && e.setAttribute("nonce", ""), e;
}
var J = class e extends K {
	static fromHTMLString(e = "") {
		return this.fromDocument(Ot(e));
	}
	static fromElement(e) {
		return this.fromDocument(e.ownerDocument);
	}
	static fromDocument({ documentElement: e, body: t, head: n }) {
		return new this(e, t, new Yn(n));
	}
	constructor(e, t, n) {
		super(t), this.documentElement = e, this.headSnapshot = n;
	}
	clone() {
		let t = this.element.cloneNode(!0), n = this.element.querySelectorAll("select"), r = t.querySelectorAll("select");
		for (let [e, t] of n.entries()) {
			let n = r[e];
			for (let e of n.selectedOptions) e.selected = !1;
			for (let e of t.selectedOptions) n.options[e.index].selected = !0;
		}
		for (let e of t.querySelectorAll("input[type=\"password\"]")) e.value = "";
		for (let e of t.querySelectorAll("noscript")) e.remove();
		return new e(this.documentElement, t, this.headSnapshot);
	}
	get lang() {
		return this.documentElement.getAttribute("lang");
	}
	get dir() {
		return this.documentElement.getAttribute("dir");
	}
	get headElement() {
		return this.headSnapshot.element;
	}
	get rootLocation() {
		return I(this.getSetting("root") ?? "/");
	}
	get cacheControlValue() {
		return this.getSetting("cache-control");
	}
	get isPreviewable() {
		return this.cacheControlValue != "no-preview";
	}
	get isCacheable() {
		return this.cacheControlValue != "no-cache";
	}
	get isVisitable() {
		return this.getSetting("visit-control") != "reload";
	}
	get prefersViewTransitions() {
		return (this.getSetting("view-transition") === "true" || this.headSnapshot.getMetaValue("view-transition") === "same-origin") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	get refreshMethod() {
		return this.getSetting("refresh-method");
	}
	get refreshScroll() {
		return this.getSetting("refresh-scroll");
	}
	getSetting(e) {
		return this.headSnapshot.getMetaValue(`turbo-${e}`);
	}
}, rr = class {
	#e = !1;
	#t = Promise.resolve();
	renderChange(e, t) {
		return e && this.viewTransitionsAvailable && !this.#e ? (this.#e = !0, this.#t = this.#t.then(async () => {
			await document.startViewTransition(t).finished;
		})) : this.#t = this.#t.then(t), this.#t;
	}
	get viewTransitionsAvailable() {
		return document.startViewTransition;
	}
}, ir = {
	action: "advance",
	historyChanged: !1,
	visitCachedSnapshot: () => {},
	willRender: !0,
	updateHistory: !0,
	shouldCacheSnapshot: !0,
	acceptsStreamResponse: !1,
	refresh: {}
}, Y = {
	visitStart: "visitStart",
	requestStart: "requestStart",
	requestEnd: "requestEnd",
	visitEnd: "visitEnd"
}, X = {
	initialized: "initialized",
	started: "started",
	canceled: "canceled",
	failed: "failed",
	completed: "completed"
}, Z = {
	networkFailure: 0,
	timeoutFailure: -1,
	contentTypeMismatch: -2
}, ar = {
	advance: "forward",
	restore: "back",
	replace: "none"
}, or = class {
	identifier = O();
	timingMetrics = {};
	followedRedirect = !1;
	historyChanged = !1;
	scrolled = !1;
	shouldCacheSnapshot = !0;
	acceptsStreamResponse = !1;
	snapshotCached = !1;
	state = X.initialized;
	viewTransitioner = new rr();
	constructor(e, t, n, r = {}) {
		this.delegate = e, this.location = t, this.restorationIdentifier = n || O();
		let { action: i, historyChanged: a, referrer: o, snapshot: s, snapshotHTML: c, response: l, visitCachedSnapshot: u, willRender: d, updateHistory: f, shouldCacheSnapshot: ee, acceptsStreamResponse: te, direction: p, refresh: m } = {
			...ir,
			...r
		};
		this.action = i, this.historyChanged = a, this.referrer = o, this.snapshot = s, this.snapshotHTML = c, this.response = l, this.isPageRefresh = this.view.isPageRefresh(this), this.visitCachedSnapshot = u, this.willRender = d, this.updateHistory = f, this.scrolled = !d, this.shouldCacheSnapshot = ee, this.acceptsStreamResponse = te, this.direction = p || ar[i], this.refresh = m;
	}
	get adapter() {
		return this.delegate.adapter;
	}
	get view() {
		return this.delegate.view;
	}
	get history() {
		return this.delegate.history;
	}
	get restorationData() {
		return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
	}
	start() {
		this.state == X.initialized && (this.recordTimingMetric(Y.visitStart), this.state = X.started, this.adapter.visitStarted(this), this.delegate.visitStarted(this));
	}
	cancel() {
		this.state == X.started && (this.request && this.request.cancel(), this.cancelRender(), this.state = X.canceled);
	}
	complete() {
		this.state == X.started && (this.recordTimingMetric(Y.visitEnd), this.adapter.visitCompleted(this), this.state = X.completed, this.followRedirect(), this.followedRedirect || this.delegate.visitCompleted(this));
	}
	fail() {
		this.state == X.started && (this.state = X.failed, this.adapter.visitFailed(this), this.delegate.visitCompleted(this));
	}
	changeHistory() {
		if (!this.historyChanged && this.updateHistory) {
			let e = Nt(this.location.href === this.referrer?.href ? "replace" : this.action);
			this.history.update(e, this.location, this.restorationIdentifier), this.historyChanged = !0;
		}
	}
	issueRequest() {
		this.hasPreloadedResponse() ? this.simulateRequest() : this.shouldIssueRequest() && !this.request && (this.request = new H(this, B.get, this.location), this.request.perform());
	}
	simulateRequest() {
		this.response && (this.startRequest(), this.recordResponse(), this.finishRequest());
	}
	startRequest() {
		this.recordTimingMetric(Y.requestStart), this.adapter.visitRequestStarted(this);
	}
	recordResponse(e = this.response) {
		if (this.response = e, e) {
			let { statusCode: t } = e;
			sr(t) ? this.adapter.visitRequestCompleted(this) : this.adapter.visitRequestFailedWithStatusCode(this, t);
		}
	}
	finishRequest() {
		this.recordTimingMetric(Y.requestEnd), this.adapter.visitRequestFinished(this);
	}
	loadResponse() {
		if (this.response) {
			let { statusCode: e, responseHTML: t } = this.response;
			this.render(async () => {
				if (this.shouldCacheSnapshot && this.cacheSnapshot(), this.view.renderPromise && await this.view.renderPromise, sr(e) && t != null) {
					let e = J.fromHTMLString(t);
					await this.renderPageSnapshot(e, !1), this.adapter.visitRendered(this), this.complete();
				} else await this.view.renderError(J.fromHTMLString(t), this), this.adapter.visitRendered(this), this.fail();
			});
		}
	}
	getCachedSnapshot() {
		let e = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
		if (e && (!L(this.location) || e.hasAnchor(L(this.location))) && (this.action == "restore" || e.isPreviewable)) return e;
	}
	getPreloadedSnapshot() {
		if (this.snapshotHTML) return J.fromHTMLString(this.snapshotHTML);
	}
	hasCachedSnapshot() {
		return this.getCachedSnapshot() != null;
	}
	loadCachedSnapshot() {
		let e = this.getCachedSnapshot();
		if (e) {
			let t = this.shouldIssueRequest();
			this.render(async () => {
				this.cacheSnapshot(), this.isPageRefresh ? this.adapter.visitRendered(this) : (this.view.renderPromise && await this.view.renderPromise, await this.renderPageSnapshot(e, t), this.adapter.visitRendered(this), t || this.complete());
			});
		}
	}
	followRedirect() {
		this.redirectedToLocation && !this.followedRedirect && this.response?.redirected && (this.adapter.visitProposedToLocation(this.redirectedToLocation, {
			action: "replace",
			response: this.response,
			shouldCacheSnapshot: !1,
			willRender: !1
		}), this.followedRedirect = !0);
	}
	prepareRequest(e) {
		this.acceptsStreamResponse && e.acceptResponseType(U.contentType);
	}
	requestStarted() {
		this.startRequest();
	}
	requestPreventedHandlingResponse(e, t) {}
	async requestSucceededWithResponse(e, t) {
		let n = await t.responseHTML, { redirected: r, statusCode: i } = t;
		n == null ? this.recordResponse({
			statusCode: Z.contentTypeMismatch,
			redirected: r
		}) : (this.redirectedToLocation = t.redirected ? t.location : void 0, this.recordResponse({
			statusCode: i,
			responseHTML: n,
			redirected: r
		}));
	}
	async requestFailedWithResponse(e, t) {
		let n = await t.responseHTML, { redirected: r, statusCode: i } = t;
		n == null ? this.recordResponse({
			statusCode: Z.contentTypeMismatch,
			redirected: r
		}) : this.recordResponse({
			statusCode: i,
			responseHTML: n,
			redirected: r
		});
	}
	requestErrored(e, t) {
		this.recordResponse({
			statusCode: Z.networkFailure,
			redirected: !1
		});
	}
	requestFinished() {
		this.finishRequest();
	}
	performScroll() {
		!this.scrolled && !this.view.forceReloaded && !this.view.shouldPreserveScrollPosition(this) && (this.action == "restore" ? this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop() : this.scrollToAnchor() || this.view.scrollToTop(), this.scrolled = !0);
	}
	scrollToRestoredPosition() {
		let { scrollPosition: e } = this.restorationData;
		if (e) return this.view.scrollToPosition(e), !0;
	}
	scrollToAnchor() {
		let e = L(this.location);
		if (e != null) return this.view.scrollToAnchor(e), !0;
	}
	recordTimingMetric(e) {
		this.timingMetrics[e] = (/* @__PURE__ */ new Date()).getTime();
	}
	getTimingMetrics() {
		return { ...this.timingMetrics };
	}
	hasPreloadedResponse() {
		return typeof this.response == "object";
	}
	shouldIssueRequest() {
		return this.action == "restore" ? !this.hasCachedSnapshot() : this.willRender;
	}
	cacheSnapshot() {
		this.snapshotCached ||= (this.view.cacheSnapshot(this.snapshot).then((e) => e && this.visitCachedSnapshot(e)), !0);
	}
	async render(e) {
		this.cancelRender(), await new Promise((e) => {
			this.frame = document.visibilityState === "hidden" ? setTimeout(() => e(), 0) : requestAnimationFrame(() => e());
		}), await e(), delete this.frame;
	}
	async renderPageSnapshot(e, t) {
		await this.viewTransitioner.renderChange(this.view.shouldTransitionTo(e), async () => {
			await this.view.renderPage(e, t, this.willRender, this), this.performScroll();
		});
	}
	cancelRender() {
		this.frame && (cancelAnimationFrame(this.frame), delete this.frame);
	}
};
function sr(e) {
	return e >= 200 && e < 300;
}
var cr = class {
	progressBar = new Jn();
	constructor(e) {
		this.session = e;
	}
	visitProposedToLocation(e, t) {
		R(e, this.navigator.rootLocation) ? this.navigator.startVisit(e, t?.restorationIdentifier || O(), t) : window.location.href = e.toString();
	}
	visitStarted(e) {
		this.location = e.location, this.redirectedToLocation = null, e.loadCachedSnapshot(), e.issueRequest();
	}
	visitRequestStarted(e) {
		this.progressBar.setValue(0), e.hasCachedSnapshot() || e.action != "restore" ? this.showVisitProgressBarAfterDelay() : this.showProgressBar();
	}
	visitRequestCompleted(e) {
		e.loadResponse(), e.response.redirected && (this.redirectedToLocation = e.redirectedToLocation);
	}
	visitRequestFailedWithStatusCode(e, t) {
		switch (t) {
			case Z.networkFailure:
			case Z.timeoutFailure:
			case Z.contentTypeMismatch: return this.reload({
				reason: "request_failed",
				context: { statusCode: t }
			});
			default: return e.loadResponse();
		}
	}
	visitRequestFinished(e) {}
	visitCompleted(e) {
		this.progressBar.setValue(1), this.hideVisitProgressBar();
	}
	pageInvalidated(e) {
		this.reload(e);
	}
	visitFailed(e) {
		this.progressBar.setValue(1), this.hideVisitProgressBar();
	}
	visitRendered(e) {}
	linkPrefetchingIsEnabledForLocation(e) {
		return !0;
	}
	formSubmissionStarted(e) {
		this.progressBar.setValue(0), this.showFormProgressBarAfterDelay();
	}
	formSubmissionFinished(e) {
		this.progressBar.setValue(1), this.hideFormProgressBar();
	}
	showVisitProgressBarAfterDelay() {
		this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
	}
	hideVisitProgressBar() {
		this.progressBar.hide(), this.visitProgressBarTimeout != null && (window.clearTimeout(this.visitProgressBarTimeout), delete this.visitProgressBarTimeout);
	}
	showFormProgressBarAfterDelay() {
		this.formProgressBarTimeout ??= window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
	}
	hideFormProgressBar() {
		this.progressBar.hide(), this.formProgressBarTimeout != null && (window.clearTimeout(this.formProgressBarTimeout), delete this.formProgressBarTimeout);
	}
	showProgressBar = () => {
		this.progressBar.show();
	};
	reload(e) {
		E("turbo:reload", { detail: e }), window.location.href = (this.redirectedToLocation || this.location)?.toString() || window.location.href;
	}
	get navigator() {
		return this.session.navigator;
	}
}, lr = class {
	selector = "[data-turbo-temporary]";
	started = !1;
	start() {
		this.started || (this.started = !0, addEventListener("turbo:before-cache", this.removeTemporaryElements, !1));
	}
	stop() {
		this.started && (this.started = !1, removeEventListener("turbo:before-cache", this.removeTemporaryElements, !1));
	}
	removeTemporaryElements = (e) => {
		for (let e of this.temporaryElements) e.remove();
	};
	get temporaryElements() {
		return [...document.querySelectorAll(this.selector)];
	}
}, ur = class {
	constructor(e, t) {
		this.session = e, this.element = t, this.linkInterceptor = new Mn(this, t), this.formSubmitObserver = new Dn(this, t);
	}
	start() {
		this.linkInterceptor.start(), this.formSubmitObserver.start();
	}
	stop() {
		this.linkInterceptor.stop(), this.formSubmitObserver.stop();
	}
	shouldInterceptLinkClick(e, t, n) {
		return this.#t(e);
	}
	linkClickIntercepted(e, t, n) {
		let r = this.#n(e);
		r && r.delegate.linkClickIntercepted(e, t, n);
	}
	willSubmitForm(e, t) {
		return e.closest("turbo-frame") == null && this.#e(e, t) && this.#t(e, t);
	}
	formSubmitted(e, t) {
		let n = this.#n(e, t);
		n && n.delegate.formSubmitted(e, t);
	}
	#e(e, t) {
		let n = Gt(e, t), r = I(this.element.ownerDocument.querySelector("meta[name=\"turbo-root\"]")?.content ?? "/");
		return this.#t(e, t) && R(n, r);
	}
	#t(e, t) {
		if (e instanceof HTMLFormElement ? this.session.submissionIsNavigatable(e, t) : this.session.elementIsNavigatable(e)) {
			let n = this.#n(e, t);
			return n ? n != e.closest("turbo-frame") : !1;
		}
		return !1;
	}
	#n(e, t) {
		let n = t?.getAttribute("data-turbo-frame") || e.getAttribute("data-turbo-frame");
		if (n && n != "_top") {
			let e = this.element.querySelector(`#${n}:not([disabled])`);
			if (e instanceof w) return e;
		}
	}
}, dr = class {
	location;
	restorationIdentifier = O();
	restorationData = {};
	started = !1;
	currentIndex = 0;
	constructor(e) {
		this.delegate = e;
	}
	start() {
		this.started || (addEventListener("popstate", this.onPopState, !1), this.currentIndex = history.state?.turbo?.restorationIndex || 0, this.started = !0, this.replace(new URL(window.location.href)));
	}
	stop() {
		this.started &&= (removeEventListener("popstate", this.onPopState, !1), !1);
	}
	push(e, t) {
		this.update(history.pushState, e, t);
	}
	replace(e, t) {
		this.update(history.replaceState, e, t);
	}
	update(e, t, n = O()) {
		e === history.pushState && ++this.currentIndex;
		let r = { turbo: {
			restorationIdentifier: n,
			restorationIndex: this.currentIndex
		} };
		e.call(history, r, "", t.href), this.location = t, this.restorationIdentifier = n;
	}
	getRestorationDataForIdentifier(e) {
		return this.restorationData[e] || {};
	}
	updateRestorationData(e) {
		let { restorationIdentifier: t } = this, n = this.restorationData[t];
		this.restorationData[t] = {
			...n,
			...e
		};
	}
	assumeControlOfScrollRestoration() {
		this.previousScrollRestoration || (this.previousScrollRestoration = history.scrollRestoration ?? "auto", history.scrollRestoration = "manual");
	}
	relinquishControlOfScrollRestoration() {
		this.previousScrollRestoration && (history.scrollRestoration = this.previousScrollRestoration, delete this.previousScrollRestoration);
	}
	onPopState = (e) => {
		let { turbo: t } = e.state || {};
		if (this.location = new URL(window.location.href), t) {
			let { restorationIdentifier: e, restorationIndex: n } = t;
			this.restorationIdentifier = e;
			let r = n > this.currentIndex ? "forward" : "back";
			this.delegate.historyPoppedToLocationWithRestorationIdentifierAndDirection(this.location, e, r), this.currentIndex = n;
		} else this.currentIndex++, this.delegate.historyPoppedWithEmptyState(this.location);
	};
}, fr = class {
	started = !1;
	#e = null;
	constructor(e, t) {
		this.delegate = e, this.eventTarget = t;
	}
	start() {
		this.started || (this.eventTarget.readyState === "loading" ? this.eventTarget.addEventListener("DOMContentLoaded", this.#t, { once: !0 }) : this.#t());
	}
	stop() {
		this.started &&= (this.eventTarget.removeEventListener("mouseenter", this.#n, {
			capture: !0,
			passive: !0
		}), this.eventTarget.removeEventListener("mouseleave", this.#r, {
			capture: !0,
			passive: !0
		}), this.eventTarget.removeEventListener("turbo:before-fetch-request", this.#a, !0), !1);
	}
	#t = () => {
		this.eventTarget.addEventListener("mouseenter", this.#n, {
			capture: !0,
			passive: !0
		}), this.eventTarget.addEventListener("mouseleave", this.#r, {
			capture: !0,
			passive: !0
		}), this.eventTarget.addEventListener("turbo:before-fetch-request", this.#a, !0), this.started = !0;
	};
	#n = (e) => {
		if (N("turbo-prefetch") === "false") return;
		let t = e.target;
		if (t.matches && t.matches("a[href]:not([target^=_]):not([download])") && this.#s(t)) {
			let e = t, n = Jt(e);
			if (this.delegate.canPrefetchRequestToLocation(e, n)) {
				this.#e = e;
				let r = new H(this, B.get, n, new URLSearchParams(), t);
				r.fetchOptions.priority = "low", W.putLater(n, r, this.#o);
			}
		}
	};
	#r = (e) => {
		e.target === this.#e && this.#i();
	};
	#i = () => {
		W.clear(), this.#e = null;
	};
	#a = (e) => {
		if (e.target.tagName !== "FORM" && e.detail.fetchOptions.method === "GET") {
			let t = W.get(e.detail.url);
			t && (e.detail.fetchRequest = t), W.clear();
		}
	};
	prepareRequest(e) {
		let t = e.target;
		e.headers["X-Sec-Purpose"] = "prefetch";
		let n = t.closest("turbo-frame"), r = t.getAttribute("data-turbo-frame") || n?.getAttribute("target") || n?.id;
		r && r !== "_top" && (e.headers["Turbo-Frame"] = r);
	}
	requestSucceededWithResponse() {}
	requestStarted(e) {}
	requestErrored(e) {}
	requestFinished(e) {}
	requestPreventedHandlingResponse(e, t) {}
	requestFailedWithResponse(e, t) {}
	get #o() {
		return Number(N("turbo-prefetch-cache-time")) || gn;
	}
	#s(e) {
		return !(!e.getAttribute("href") || pr(e) || mr(e) || hr(e) || gr(e) || vr(e));
	}
}, pr = (e) => e.origin !== document.location.origin || !["http:", "https:"].includes(e.protocol) || e.hasAttribute("target"), mr = (e) => e.pathname + e.search === document.location.pathname + document.location.search || e.href.startsWith("#"), hr = (e) => {
	if (e.getAttribute("data-turbo-prefetch") === "false" || e.getAttribute("data-turbo") === "false") return !0;
	let t = P(e, "[data-turbo-prefetch]");
	return !!(t && t.getAttribute("data-turbo-prefetch") === "false");
}, gr = (e) => {
	let t = e.getAttribute("data-turbo-method");
	return !!(t && t.toLowerCase() !== "get" || _r(e) || e.hasAttribute("data-turbo-confirm") || e.hasAttribute("data-turbo-stream"));
}, _r = (e) => e.hasAttribute("data-remote") || e.hasAttribute("data-behavior") || e.hasAttribute("data-confirm") || e.hasAttribute("data-method"), vr = (e) => E("turbo:before-prefetch", {
	target: e,
	cancelable: !0
}).defaultPrevented, yr = class {
	constructor(e) {
		this.delegate = e;
	}
	proposeVisit(e, t = {}) {
		this.delegate.allowsVisitingLocationWithAction(e, t.action) && this.delegate.visitProposedToLocation(e, t);
	}
	startVisit(e, t, n = {}) {
		this.stop(), this.currentVisit = new or(this, I(e), t, {
			referrer: this.location,
			...n
		}), this.currentVisit.start();
	}
	submitForm(e, t) {
		this.stop(), this.formSubmission = new _n(this, e, t, !0), this.formSubmission.start();
	}
	stop() {
		this.formSubmission && (this.formSubmission.stop(), delete this.formSubmission), this.currentVisit && (this.currentVisit.cancel(), delete this.currentVisit);
	}
	get adapter() {
		return this.delegate.adapter;
	}
	get view() {
		return this.delegate.view;
	}
	get rootLocation() {
		return this.view.snapshot.rootLocation;
	}
	get history() {
		return this.delegate.history;
	}
	formSubmissionStarted(e) {
		typeof this.adapter.formSubmissionStarted == "function" && this.adapter.formSubmissionStarted(e);
	}
	async formSubmissionSucceededWithResponse(e, t) {
		if (e == this.formSubmission) {
			let n = await t.responseHTML;
			if (n) {
				let r = e.isSafe;
				r || this.view.clearSnapshotCache();
				let { statusCode: i, redirected: a } = t, o = {
					action: this.#e(e, t),
					shouldCacheSnapshot: r,
					response: {
						statusCode: i,
						responseHTML: n,
						redirected: a
					}
				};
				this.proposeVisit(t.location, o);
			}
		}
	}
	async formSubmissionFailedWithResponse(e, t) {
		let n = await t.responseHTML;
		if (n) {
			let e = J.fromHTMLString(n);
			t.serverError ? await this.view.renderError(e, this.currentVisit) : await this.view.renderPage(e, !1, !0, this.currentVisit), e.refreshScroll !== "preserve" && this.view.scrollToTop(), this.view.clearSnapshotCache();
		}
	}
	formSubmissionErrored(e, t) {
		console.error(t);
	}
	formSubmissionFinished(e) {
		typeof this.adapter.formSubmissionFinished == "function" && this.adapter.formSubmissionFinished(e);
	}
	linkPrefetchingIsEnabledForLocation(e) {
		return typeof this.adapter.linkPrefetchingIsEnabledForLocation != "function" || this.adapter.linkPrefetchingIsEnabledForLocation(e);
	}
	visitStarted(e) {
		this.delegate.visitStarted(e);
	}
	visitCompleted(e) {
		this.delegate.visitCompleted(e), delete this.currentVisit;
	}
	locationWithActionIsSamePage(e, t) {
		return !1;
	}
	get location() {
		return this.history.location;
	}
	get restorationIdentifier() {
		return this.history.restorationIdentifier;
	}
	#e(e, t) {
		let { submitter: n, formElement: r } = e;
		return M(n, r) || this.#t(t);
	}
	#t(e) {
		return e.redirected && e.location.href === this.location?.href ? "replace" : "advance";
	}
}, Q = {
	initial: 0,
	loading: 1,
	interactive: 2,
	complete: 3
}, br = class {
	stage = Q.initial;
	started = !1;
	constructor(e) {
		this.delegate = e;
	}
	start() {
		this.started ||= (this.stage == Q.initial && (this.stage = Q.loading), document.addEventListener("readystatechange", this.interpretReadyState, !1), addEventListener("pagehide", this.pageWillUnload, !1), !0);
	}
	stop() {
		this.started &&= (document.removeEventListener("readystatechange", this.interpretReadyState, !1), removeEventListener("pagehide", this.pageWillUnload, !1), !1);
	}
	interpretReadyState = () => {
		let { readyState: e } = this;
		e == "interactive" ? this.pageIsInteractive() : e == "complete" && this.pageIsComplete();
	};
	pageIsInteractive() {
		this.stage == Q.loading && (this.stage = Q.interactive, this.delegate.pageBecameInteractive());
	}
	pageIsComplete() {
		this.pageIsInteractive(), this.stage == Q.interactive && (this.stage = Q.complete, this.delegate.pageLoaded());
	}
	pageWillUnload = () => {
		this.delegate.pageWillUnload();
	};
	get readyState() {
		return document.readyState;
	}
}, xr = class {
	started = !1;
	constructor(e) {
		this.delegate = e;
	}
	start() {
		this.started ||= (addEventListener("scroll", this.onScroll, !1), this.onScroll(), !0);
	}
	stop() {
		this.started &&= (removeEventListener("scroll", this.onScroll, !1), !1);
	}
	onScroll = () => {
		this.updatePosition({
			x: window.pageXOffset,
			y: window.pageYOffset
		});
	};
	updatePosition(e) {
		this.delegate.scrollPositionChanged(e);
	}
}, Sr = class {
	render({ fragment: e }) {
		Fn.preservingPermanentElements(this, Cr(e), () => {
			wr(e, () => {
				Tr(() => {
					document.documentElement.appendChild(e);
				});
			});
		});
	}
	enteringBardo(e, t) {
		t.replaceWith(e.cloneNode(!0));
	}
	leavingBardo() {}
};
function Cr(e) {
	let t = En(document.documentElement), n = {};
	for (let r of t) {
		let { id: t } = r;
		for (let i of e.querySelectorAll("turbo-stream")) {
			let e = Tn(i.templateElement.content, t);
			e && (n[t] = [r, e]);
		}
	}
	return n;
}
async function wr(e, t) {
	let n = `turbo-stream-autofocus-${O()}`, r = Er(e.querySelectorAll("turbo-stream")), i = null;
	if (r && (i = r.id ? r.id : n, r.id = i), t(), await D(), (document.activeElement == null || document.activeElement == document.body) && i) {
		let e = document.getElementById(i);
		Rt(e) && e.focus(), e && e.id == n && e.removeAttribute("id");
	}
}
async function Tr(e) {
	let [t, n] = await Bt(e, () => document.activeElement), r = t && t.id;
	if (r) {
		let e = document.getElementById(r);
		Rt(e) && e != n && e.focus();
	}
}
function Er(e) {
	for (let t of e) {
		let e = zt(t.templateElement.content);
		if (e) return e;
	}
	return null;
}
var Dr = class {
	sources = /* @__PURE__ */ new Set();
	#e = !1;
	constructor(e) {
		this.delegate = e;
	}
	start() {
		this.#e || (this.#e = !0, addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, !1));
	}
	stop() {
		this.#e && (this.#e = !1, removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, !1));
	}
	connectStreamSource(e) {
		this.streamSourceIsConnected(e) || (this.sources.add(e), e.addEventListener("message", this.receiveMessageEvent, !1));
	}
	disconnectStreamSource(e) {
		this.streamSourceIsConnected(e) && (this.sources.delete(e), e.removeEventListener("message", this.receiveMessageEvent, !1));
	}
	streamSourceIsConnected(e) {
		return this.sources.has(e);
	}
	inspectFetchResponse = (e) => {
		let t = Or(e);
		t && kr(t) && (e.preventDefault(), this.receiveMessageResponse(t));
	};
	receiveMessageEvent = (e) => {
		this.#e && typeof e.data == "string" && this.receiveMessageHTML(e.data);
	};
	async receiveMessageResponse(e) {
		let t = await e.responseHTML;
		t && this.receiveMessageHTML(t);
	}
	receiveMessageHTML(e) {
		this.delegate.receivedMessageFromStream(U.wrap(e));
	}
};
function Or(e) {
	let t = e.detail?.fetchResponse;
	if (t instanceof en) return t;
}
function kr(e) {
	return (e.contentType ?? "").startsWith(U.contentType);
}
var Ar = class extends Ln {
	static renderElement(e, t) {
		let { documentElement: n, body: r } = document;
		n.replaceChild(t, r);
	}
	async render() {
		this.replaceHeadAndBody(), this.activateScriptElements();
	}
	replaceHeadAndBody() {
		let { documentElement: e, head: t } = document;
		e.replaceChild(this.newHead, t), this.renderElement(this.currentElement, this.newElement);
	}
	activateScriptElements() {
		for (let e of this.scriptElements) {
			let t = e.parentNode;
			if (t) {
				let n = T(e);
				t.replaceChild(n, e);
			}
		}
	}
	get newHead() {
		return this.newSnapshot.headSnapshot.element;
	}
	get scriptElements() {
		return document.documentElement.querySelectorAll("script");
	}
}, jr = class extends Ln {
	static renderElement(e, t) {
		document.body && t instanceof HTMLBodyElement ? document.body.replaceWith(t) : document.documentElement.appendChild(t);
	}
	get shouldRender() {
		return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
	}
	get reloadReason() {
		if (!this.newSnapshot.isVisitable) return { reason: "turbo_visit_control_is_reload" };
		if (!this.trackedElementsAreIdentical) return { reason: "tracked_element_mismatch" };
	}
	async prepareToRender() {
		this.#e(), await this.mergeHead();
	}
	async render() {
		this.willRender && await this.replaceBody();
	}
	finishRendering() {
		super.finishRendering(), this.isPreview || this.focusFirstAutofocusableElement();
	}
	get currentHeadSnapshot() {
		return this.currentSnapshot.headSnapshot;
	}
	get newHeadSnapshot() {
		return this.newSnapshot.headSnapshot;
	}
	get newElement() {
		return this.newSnapshot.element;
	}
	#e() {
		let { documentElement: e } = this.currentSnapshot, { dir: t, lang: n } = this.newSnapshot;
		n ? e.setAttribute("lang", n) : e.removeAttribute("lang"), t ? e.setAttribute("dir", t) : e.removeAttribute("dir");
	}
	async mergeHead() {
		let e = this.mergeProvisionalElements(), t = this.copyNewHeadStylesheetElements();
		this.copyNewHeadScriptElements(), await e, await t, this.willRender && this.removeUnusedDynamicStylesheetElements();
	}
	async replaceBody() {
		await this.preservingPermanentElements(async () => {
			this.activateNewBody(), await this.assignNewBody();
		});
	}
	get trackedElementsAreIdentical() {
		return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
	}
	async copyNewHeadStylesheetElements() {
		let e = [];
		for (let t of this.newHeadStylesheetElements) e.push(Mt(t)), document.head.appendChild(t);
		await Promise.all(e);
	}
	copyNewHeadScriptElements() {
		for (let e of this.newHeadScriptElements) document.head.appendChild(T(e));
	}
	removeUnusedDynamicStylesheetElements() {
		for (let e of this.unusedDynamicStylesheetElements) document.head.removeChild(e);
	}
	async mergeProvisionalElements() {
		let e = [...this.newHeadProvisionalElements];
		for (let t of this.currentHeadProvisionalElements) this.isCurrentElementInElementList(t, e) || document.head.removeChild(t);
		for (let t of e) document.head.appendChild(t);
	}
	isCurrentElementInElementList(e, t) {
		for (let [n, r] of t.entries()) {
			if (e.tagName == "TITLE") {
				if (r.tagName != "TITLE") continue;
				if (e.innerHTML == r.innerHTML) return t.splice(n, 1), !0;
			}
			if (r.isEqualNode(e)) return t.splice(n, 1), !0;
		}
		return !1;
	}
	removeCurrentHeadProvisionalElements() {
		for (let e of this.currentHeadProvisionalElements) document.head.removeChild(e);
	}
	copyNewHeadProvisionalElements() {
		for (let e of this.newHeadProvisionalElements) document.head.appendChild(e);
	}
	activateNewBody() {
		document.adoptNode(this.newElement), this.removeNoscriptElements(), this.activateNewBodyScriptElements();
	}
	removeNoscriptElements() {
		for (let e of this.newElement.querySelectorAll("noscript")) e.remove();
	}
	activateNewBodyScriptElements() {
		for (let e of this.newBodyScriptElements) {
			let t = T(e);
			e.replaceWith(t);
		}
	}
	async assignNewBody() {
		await this.renderElement(this.currentElement, this.newElement);
	}
	get unusedDynamicStylesheetElements() {
		return this.oldHeadStylesheetElements.filter((e) => e.getAttribute("data-turbo-track") === "dynamic");
	}
	get oldHeadStylesheetElements() {
		return this.currentHeadSnapshot.getStylesheetElementsNotInSnapshot(this.newHeadSnapshot);
	}
	get newHeadStylesheetElements() {
		return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
	}
	get newHeadScriptElements() {
		return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
	}
	get currentHeadProvisionalElements() {
		return this.currentHeadSnapshot.provisionalElements;
	}
	get newHeadProvisionalElements() {
		return this.newHeadSnapshot.provisionalElements;
	}
	get newBodyScriptElements() {
		return this.newElement.querySelectorAll("script");
	}
}, Mr = class extends jr {
	static renderElement(e, t) {
		q(e, t, { callbacks: { beforeNodeMorphed: (e, t) => Un(e, t) && !Gn(e) ? (e.reload(), !1) : !0 } }), E("turbo:morph", { detail: {
			currentElement: e,
			newElement: t
		} });
	}
	async preservingPermanentElements(e) {
		return await e();
	}
	get renderMethod() {
		return "morph";
	}
	get shouldAutofocus() {
		return !1;
	}
}, Nr = class extends pn {
	constructor(e) {
		super(e, z);
	}
	get snapshots() {
		return this.entries;
	}
}, Pr = class extends An {
	snapshotCache = new Nr(10);
	lastRenderedLocation = new URL(location.href);
	forceReloaded = !1;
	shouldTransitionTo(e) {
		return this.snapshot.prefersViewTransitions && e.prefersViewTransitions;
	}
	renderPage(e, t = !1, n = !0, r) {
		let i = new (this.isPageRefresh(r) && (r?.refresh?.method || this.snapshot.refreshMethod) === "morph" ? Mr : jr)(this.snapshot, e, t, n);
		return i.shouldRender ? r?.changeHistory() : this.forceReloaded = !0, this.render(i);
	}
	renderError(e, t) {
		t?.changeHistory();
		let n = new Ar(this.snapshot, e, !1);
		return this.render(n);
	}
	clearSnapshotCache() {
		this.snapshotCache.clear();
	}
	async cacheSnapshot(e = this.snapshot) {
		if (e.isCacheable) {
			this.delegate.viewWillCacheSnapshot();
			let { lastRenderedLocation: t } = this;
			await Dt();
			let n = e.clone();
			return this.snapshotCache.put(t, n), n;
		}
	}
	getCachedSnapshotForLocation(e) {
		return this.snapshotCache.get(e);
	}
	isPageRefresh(e) {
		return !e || this.lastRenderedLocation.pathname === e.location.pathname && e.action === "replace";
	}
	shouldPreserveScrollPosition(e) {
		return this.isPageRefresh(e) && (e?.refresh?.scroll || this.snapshot.refreshScroll) === "preserve";
	}
	get snapshot() {
		return J.fromElement(this.element);
	}
}, Fr = class {
	selector = "a[data-turbo-preload]";
	constructor(e, t) {
		this.delegate = e, this.snapshotCache = t;
	}
	start() {
		document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", this.#e) : this.preloadOnLoadLinksForView(document.body);
	}
	stop() {
		document.removeEventListener("DOMContentLoaded", this.#e);
	}
	preloadOnLoadLinksForView(e) {
		for (let t of e.querySelectorAll(this.selector)) this.delegate.shouldPreloadLink(t) && this.preloadURL(t);
	}
	async preloadURL(e) {
		let t = new URL(e.href);
		this.snapshotCache.has(t) || await new H(this, B.get, t, new URLSearchParams(), e).perform();
	}
	prepareRequest(e) {
		e.headers["X-Sec-Purpose"] = "prefetch";
	}
	async requestSucceededWithResponse(e, t) {
		try {
			let n = await t.responseHTML, r = J.fromHTMLString(n);
			this.snapshotCache.put(e.url, r);
		} catch {}
	}
	requestStarted(e) {}
	requestErrored(e) {}
	requestFinished(e) {}
	requestPreventedHandlingResponse(e, t) {}
	requestFailedWithResponse(e, t) {}
	#e = () => {
		this.preloadOnLoadLinksForView(document.body);
	};
}, Ir = class {
	constructor(e) {
		this.session = e;
	}
	clear() {
		this.session.clearCache();
	}
	resetCacheControl() {
		this.#e("");
	}
	exemptPageFromCache() {
		this.#e("no-cache");
	}
	exemptPageFromPreview() {
		this.#e("no-preview");
	}
	#e(e) {
		Lt("turbo-cache-control", e);
	}
}, Lr = class {
	navigator = new yr(this);
	history = new dr(this);
	view = new Pr(this, document.documentElement);
	adapter = new cr(this);
	pageObserver = new br(this);
	cacheObserver = new lr();
	linkPrefetchObserver = new fr(this, document);
	linkClickObserver = new Nn(this, window);
	formSubmitObserver = new Dn(this, document);
	scrollObserver = new xr(this);
	streamObserver = new Dr(this);
	formLinkClickObserver = new Pn(this, document.documentElement);
	frameRedirector = new ur(this, document.documentElement);
	streamMessageRenderer = new Sr();
	cache = new Ir(this);
	enabled = !0;
	started = !1;
	#e = 150;
	constructor(e) {
		this.recentRequests = e, this.preloader = new Fr(this, this.view.snapshotCache), this.debouncedRefresh = this.refresh, this.pageRefreshDebouncePeriod = this.pageRefreshDebouncePeriod;
	}
	start() {
		this.started || (this.pageObserver.start(), this.cacheObserver.start(), this.linkPrefetchObserver.start(), this.formLinkClickObserver.start(), this.linkClickObserver.start(), this.formSubmitObserver.start(), this.scrollObserver.start(), this.streamObserver.start(), this.frameRedirector.start(), this.history.start(), this.preloader.start(), this.started = !0, this.enabled = !0);
	}
	disable() {
		this.enabled = !1;
	}
	stop() {
		this.started &&= (this.pageObserver.stop(), this.cacheObserver.stop(), this.linkPrefetchObserver.stop(), this.formLinkClickObserver.stop(), this.linkClickObserver.stop(), this.formSubmitObserver.stop(), this.scrollObserver.stop(), this.streamObserver.stop(), this.frameRedirector.stop(), this.history.stop(), this.preloader.stop(), !1);
	}
	registerAdapter(e) {
		this.adapter = e;
	}
	visit(e, t = {}) {
		let n = t.frame ? document.getElementById(t.frame) : null;
		if (n instanceof w) {
			let r = t.action || M(n);
			n.delegate.proposeVisitIfNavigatedWithAction(n, r), n.src = e.toString();
		} else this.navigator.proposeVisit(I(e), t);
	}
	refresh(e, t = {}) {
		t = typeof t == "string" ? { requestId: t } : t;
		let { method: n, requestId: r, scroll: i } = t, a = r && this.recentRequests.has(r), o = e === document.baseURI;
		!a && !this.navigator.currentVisit && o && this.visit(e, {
			action: "replace",
			shouldCacheSnapshot: !1,
			refresh: {
				method: n,
				scroll: i
			}
		});
	}
	connectStreamSource(e) {
		this.streamObserver.connectStreamSource(e);
	}
	disconnectStreamSource(e) {
		this.streamObserver.disconnectStreamSource(e);
	}
	renderStreamMessage(e) {
		this.streamMessageRenderer.render(U.wrap(e));
	}
	clearCache() {
		this.view.clearSnapshotCache();
	}
	setProgressBarDelay(e) {
		console.warn("Please replace `session.setProgressBarDelay(delay)` with `session.progressBarDelay = delay`. The function is deprecated and will be removed in a future version of Turbo.`"), this.progressBarDelay = e;
	}
	set progressBarDelay(e) {
		F.drive.progressBarDelay = e;
	}
	get progressBarDelay() {
		return F.drive.progressBarDelay;
	}
	set drive(e) {
		F.drive.enabled = e;
	}
	get drive() {
		return F.drive.enabled;
	}
	set formMode(e) {
		F.forms.mode = e;
	}
	get formMode() {
		return F.forms.mode;
	}
	get location() {
		return this.history.location;
	}
	get restorationIdentifier() {
		return this.history.restorationIdentifier;
	}
	get pageRefreshDebouncePeriod() {
		return this.#e;
	}
	set pageRefreshDebouncePeriod(e) {
		this.refresh = Ut(this.debouncedRefresh.bind(this), e), this.#e = e;
	}
	shouldPreloadLink(e) {
		let t = e.hasAttribute("data-turbo-method"), n = e.hasAttribute("data-turbo-stream"), r = e.getAttribute("data-turbo-frame"), i = r == "_top" ? null : document.getElementById(r) || P(e, "turbo-frame:not([disabled])");
		if (t || n || i instanceof w) return !1;
		{
			let t = new URL(e.href);
			return this.elementIsNavigatable(e) && R(t, this.snapshot.rootLocation);
		}
	}
	historyPoppedToLocationWithRestorationIdentifierAndDirection(e, t, n) {
		this.enabled ? this.navigator.startVisit(e, t, {
			action: "restore",
			historyChanged: !0,
			direction: n
		}) : this.adapter.pageInvalidated({ reason: "turbo_disabled" });
	}
	historyPoppedWithEmptyState(e) {
		this.history.replace(e), this.view.lastRenderedLocation = e, this.view.cacheSnapshot();
	}
	scrollPositionChanged(e) {
		this.history.updateRestorationData({ scrollPosition: e });
	}
	willSubmitFormLinkToLocation(e, t) {
		return this.elementIsNavigatable(e) && R(t, this.snapshot.rootLocation);
	}
	submittedFormLinkToLocation() {}
	canPrefetchRequestToLocation(e, t) {
		return this.elementIsNavigatable(e) && R(t, this.snapshot.rootLocation) && this.navigator.linkPrefetchingIsEnabledForLocation(t);
	}
	willFollowLinkToLocation(e, t, n) {
		return this.elementIsNavigatable(e) && R(t, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(e, t, n);
	}
	followedLinkToLocation(e, t) {
		let n = this.getActionForLink(e), r = e.hasAttribute("data-turbo-stream");
		this.visit(t.href, {
			action: n,
			acceptsStreamResponse: r
		});
	}
	allowsVisitingLocationWithAction(e, t) {
		return this.applicationAllowsVisitingLocation(e);
	}
	visitProposedToLocation(e, t) {
		Rr(e), this.adapter.visitProposedToLocation(e, t);
	}
	visitStarted(e) {
		e.acceptsStreamResponse || (A(document.documentElement), this.view.markVisitDirection(e.direction)), Rr(e.location), this.notifyApplicationAfterVisitingLocation(e.location, e.action);
	}
	visitCompleted(e) {
		this.view.unmarkVisitDirection(), j(document.documentElement), this.notifyApplicationAfterPageLoad(e.getTimingMetrics());
	}
	willSubmitForm(e, t) {
		let n = Gt(e, t);
		return this.submissionIsNavigatable(e, t) && R(I(n), this.snapshot.rootLocation);
	}
	formSubmitted(e, t) {
		this.navigator.submitForm(e, t);
	}
	pageBecameInteractive() {
		this.view.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad();
	}
	pageLoaded() {
		this.history.assumeControlOfScrollRestoration();
	}
	pageWillUnload() {
		this.history.relinquishControlOfScrollRestoration();
	}
	receivedMessageFromStream(e) {
		this.renderStreamMessage(e);
	}
	viewWillCacheSnapshot() {
		this.notifyApplicationBeforeCachingSnapshot();
	}
	allowsImmediateRender({ element: e }, t) {
		let { defaultPrevented: n, detail: { render: r } } = this.notifyApplicationBeforeRender(e, t);
		return this.view.renderer && r && (this.view.renderer.renderElement = r), !n;
	}
	viewRenderedSnapshot(e, t, n) {
		this.view.lastRenderedLocation = this.history.location, this.notifyApplicationAfterRender(n);
	}
	preloadOnLoadLinksForView(e) {
		this.preloader.preloadOnLoadLinksForView(e);
	}
	viewInvalidated(e) {
		this.adapter.pageInvalidated(e);
	}
	frameLoaded(e) {
		this.notifyApplicationAfterFrameLoad(e);
	}
	frameRendered(e, t) {
		this.notifyApplicationAfterFrameRender(e, t);
	}
	applicationAllowsFollowingLinkToLocation(e, t, n) {
		return !this.notifyApplicationAfterClickingLinkToLocation(e, t, n).defaultPrevented;
	}
	applicationAllowsVisitingLocation(e) {
		return !this.notifyApplicationBeforeVisitingLocation(e).defaultPrevented;
	}
	notifyApplicationAfterClickingLinkToLocation(e, t, n) {
		return E("turbo:click", {
			target: e,
			detail: {
				url: t.href,
				originalEvent: n
			},
			cancelable: !0
		});
	}
	notifyApplicationBeforeVisitingLocation(e) {
		return E("turbo:before-visit", {
			detail: { url: e.href },
			cancelable: !0
		});
	}
	notifyApplicationAfterVisitingLocation(e, t) {
		return E("turbo:visit", { detail: {
			url: e.href,
			action: t
		} });
	}
	notifyApplicationBeforeCachingSnapshot() {
		return E("turbo:before-cache");
	}
	notifyApplicationBeforeRender(e, t) {
		return E("turbo:before-render", {
			detail: {
				newBody: e,
				...t
			},
			cancelable: !0
		});
	}
	notifyApplicationAfterRender(e) {
		return E("turbo:render", { detail: { renderMethod: e } });
	}
	notifyApplicationAfterPageLoad(e = {}) {
		return E("turbo:load", { detail: {
			url: this.location.href,
			timing: e
		} });
	}
	notifyApplicationAfterFrameLoad(e) {
		return E("turbo:frame-load", { target: e });
	}
	notifyApplicationAfterFrameRender(e, t) {
		return E("turbo:frame-render", {
			detail: { fetchResponse: e },
			target: t,
			cancelable: !0
		});
	}
	submissionIsNavigatable(e, t) {
		if (F.forms.mode == "off") return !1;
		{
			let n = !t || this.elementIsNavigatable(t);
			return F.forms.mode == "optin" ? n && e.closest("[data-turbo=\"true\"]") != null : n && this.elementIsNavigatable(e);
		}
	}
	elementIsNavigatable(e) {
		let t = P(e, "[data-turbo]"), n = P(e, "turbo-frame");
		return F.drive.enabled || n ? !t || t.getAttribute("data-turbo") != "false" : t ? t.getAttribute("data-turbo") == "true" : !1;
	}
	getActionForLink(e) {
		return M(e) || "advance";
	}
	get snapshot() {
		return this.view.snapshot;
	}
};
function Rr(e) {
	Object.defineProperties(e, zr);
}
var zr = { absoluteURL: { get() {
	return this.toString();
} } }, $ = new Lr(tn), { cache: Br, navigator: Vr } = $;
function Hr() {
	$.start();
}
function Ur(e) {
	$.registerAdapter(e);
}
function Wr(e, t) {
	$.visit(e, t);
}
function Gr(e) {
	$.connectStreamSource(e);
}
function Kr(e) {
	$.disconnectStreamSource(e);
}
function qr(e) {
	$.renderStreamMessage(e);
}
function Jr(e) {
	console.warn("Please replace `Turbo.setProgressBarDelay(delay)` with `Turbo.config.drive.progressBarDelay = delay`. The top-level function is deprecated and will be removed in a future version of Turbo.`"), F.drive.progressBarDelay = e;
}
function Yr(e) {
	console.warn("Please replace `Turbo.setConfirmMethod(confirmMethod)` with `Turbo.config.forms.confirm = confirmMethod`. The top-level function is deprecated and will be removed in a future version of Turbo.`"), F.forms.confirm = e;
}
function Xr(e) {
	console.warn("Please replace `Turbo.setFormMode(mode)` with `Turbo.config.forms.mode = mode`. The top-level function is deprecated and will be removed in a future version of Turbo.`"), F.forms.mode = e;
}
function Zr(e, t) {
	Mr.renderElement(e, t);
}
function Qr(e, t) {
	qn.renderElement(e, t);
}
var $r = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	PageRenderer: jr,
	PageSnapshot: J,
	FrameRenderer: Rn,
	fetch: nn,
	config: F,
	session: $,
	cache: Br,
	navigator: Vr,
	start: Hr,
	registerAdapter: Ur,
	visit: Wr,
	connectStreamSource: Gr,
	disconnectStreamSource: Kr,
	renderStreamMessage: qr,
	setProgressBarDelay: Jr,
	setConfirmMethod: Yr,
	setFormMode: Xr,
	morphBodyElements: Zr,
	morphTurboFrameElements: Qr,
	morphChildren: Hn,
	morphElements: q
}), ei = class extends Error {}, ti = class {
	fetchResponseLoaded = (e) => Promise.resolve();
	#e = null;
	#t = () => {};
	#n = !1;
	#r = !1;
	#i = /* @__PURE__ */ new Set();
	#a = !1;
	action = null;
	constructor(e) {
		this.element = e, this.view = new jn(this, this.element), this.appearanceObserver = new un(this, this.element), this.formLinkClickObserver = new Pn(this, this.element), this.linkInterceptor = new Mn(this, this.element), this.restorationIdentifier = O(), this.formSubmitObserver = new Dn(this, this.element);
	}
	connect() {
		this.#n || (this.#n = !0, this.loadingStyle == C.lazy ? this.appearanceObserver.start() : this.#o(), this.formLinkClickObserver.start(), this.linkInterceptor.start(), this.formSubmitObserver.start());
	}
	disconnect() {
		this.#n && (this.#n = !1, this.appearanceObserver.stop(), this.formLinkClickObserver.stop(), this.linkInterceptor.stop(), this.formSubmitObserver.stop(), this.element.hasAttribute("recurse") || this.#e?.cancel());
	}
	disabledChanged() {
		this.disabled ? this.#e?.cancel() : this.loadingStyle == C.eager && this.#o();
	}
	sourceURLChanged() {
		this.#v("src") || (this.sourceURL || this.#e?.cancel(), this.element.isConnected && (this.complete = !1), (this.loadingStyle == C.eager || this.#r) && this.#o());
	}
	sourceURLReloaded() {
		let { refresh: e, src: t } = this.element;
		return this.#a = t && e === "morph", this.element.removeAttribute("complete"), this.element.src = null, this.element.src = t, this.element.loaded;
	}
	loadingStyleChanged() {
		this.loadingStyle == C.lazy ? this.appearanceObserver.start() : (this.appearanceObserver.stop(), this.#o());
	}
	async #o() {
		this.enabled && this.isActive && !this.complete && this.sourceURL && (this.element.loaded = this.#c(I(this.sourceURL)), this.appearanceObserver.stop(), await this.element.loaded, this.#r = !0);
	}
	async loadResponse(e) {
		(e.redirected || e.succeeded && e.isHTML) && (this.sourceURL = e.response.url);
		try {
			let t = await e.responseHTML;
			if (t) {
				let n = Ot(t);
				J.fromDocument(n).isVisitable ? await this.#s(e, n) : await this.#u(e);
			}
		} finally {
			this.#a = !1, this.fetchResponseLoaded = () => Promise.resolve();
		}
	}
	elementAppearedInViewport(e) {
		this.proposeVisitIfNavigatedWithAction(e, M(e)), this.#o();
	}
	willSubmitFormLinkToLocation(e) {
		return this.#_(e);
	}
	submittedFormLinkToLocation(e, t, n) {
		let r = this.#h(e);
		r && n.setAttribute("data-turbo-frame", r.id);
	}
	shouldInterceptLinkClick(e, t, n) {
		return this.#_(e);
	}
	linkClickIntercepted(e, t) {
		this.#l(e, t);
	}
	willSubmitForm(e, t) {
		return e.closest("turbo-frame") == this.element && this.#_(e, t);
	}
	formSubmitted(e, t) {
		this.formSubmission && this.formSubmission.stop(), this.formSubmission = new _n(this, e, t);
		let { fetchRequest: n } = this.formSubmission, r = this.#h(e, t);
		this.prepareRequest(n, r), this.formSubmission.start();
	}
	prepareRequest(e, t = this) {
		e.headers["Turbo-Frame"] = t.id, this.currentNavigationElement?.hasAttribute("data-turbo-stream") && e.acceptResponseType(U.contentType);
	}
	requestStarted(e) {
		A(this.element);
	}
	requestPreventedHandlingResponse(e, t) {
		this.#t();
	}
	async requestSucceededWithResponse(e, t) {
		await this.loadResponse(t), this.#t();
	}
	async requestFailedWithResponse(e, t) {
		await this.loadResponse(t), this.#t();
	}
	requestErrored(e, t) {
		console.error(t), this.#t();
	}
	requestFinished(e) {
		j(this.element);
	}
	formSubmissionStarted({ formElement: e }) {
		A(e, this.#h(e));
	}
	formSubmissionSucceededWithResponse(e, t) {
		let n = this.#h(e.formElement, e.submitter);
		n.delegate.proposeVisitIfNavigatedWithAction(n, M(e.submitter, e.formElement, n)), n.delegate.loadResponse(t), e.isSafe || $.clearCache();
	}
	formSubmissionFailedWithResponse(e, t) {
		this.element.delegate.loadResponse(t), $.clearCache();
	}
	formSubmissionErrored(e, t) {
		console.error(t);
	}
	formSubmissionFinished({ formElement: e }) {
		j(e, this.#h(e));
	}
	allowsImmediateRender({ element: e }, t) {
		let { defaultPrevented: n, detail: { render: r } } = E("turbo:before-frame-render", {
			target: this.element,
			detail: {
				newFrame: e,
				...t
			},
			cancelable: !0
		});
		return this.view.renderer && r && (this.view.renderer.renderElement = r), !n;
	}
	viewRenderedSnapshot(e, t, n) {}
	preloadOnLoadLinksForView(e) {
		$.preloadOnLoadLinksForView(e);
	}
	viewInvalidated() {}
	willRenderFrame(e, t) {
		this.previousFrameElement = e.cloneNode(!0);
	}
	visitCachedSnapshot = ({ element: e }) => {
		let t = e.querySelector("#" + this.element.id);
		t && this.previousFrameElement && t.replaceChildren(...this.previousFrameElement.children), delete this.previousFrameElement;
	};
	async #s(e, t) {
		let n = await this.extractForeignFrameElement(t.body), r = this.#a ? qn : Rn;
		if (n) {
			let t = new K(n), i = new r(this, this.view.snapshot, t, !1, !1);
			this.view.renderPromise && await this.view.renderPromise, this.changeHistory(), await this.view.render(i), this.complete = !0, $.frameRendered(e, this.element), $.frameLoaded(this.element), await this.fetchResponseLoaded(e);
		} else this.#d(e) && this.#f(e);
	}
	async #c(e) {
		let t = new H(this, B.get, e, new URLSearchParams(), this.element);
		return this.#e?.cancel(), this.#e = t, new Promise((e) => {
			this.#t = () => {
				this.#t = () => {}, this.#e = null, e();
			}, t.perform();
		});
	}
	#l(e, t, n) {
		let r = this.#h(e, n);
		r.delegate.proposeVisitIfNavigatedWithAction(r, M(n, e, r)), this.#b(e, () => {
			r.src = t;
		});
	}
	proposeVisitIfNavigatedWithAction(e, t = null) {
		if (this.action = t, this.action) {
			let t = J.fromElement(e).clone(), { visitCachedSnapshot: n } = e.delegate;
			e.delegate.fetchResponseLoaded = async (r) => {
				if (e.src) {
					let { statusCode: i, redirected: a } = r, o = {
						response: {
							statusCode: i,
							redirected: a,
							responseHTML: await r.responseHTML
						},
						visitCachedSnapshot: n,
						willRender: !1,
						updateHistory: !1,
						restorationIdentifier: this.restorationIdentifier,
						snapshot: t
					};
					this.action && (o.action = this.action), $.visit(e.src, o);
				}
			};
		}
	}
	changeHistory() {
		if (this.action) {
			let e = Nt(this.action);
			$.history.update(e, I(this.element.src || ""), this.restorationIdentifier);
		}
	}
	async #u(e) {
		console.warn(`The response (${e.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`), await this.#m(e.response);
	}
	#d(e) {
		this.element.setAttribute("complete", "");
		let t = e.response;
		return !E("turbo:frame-missing", {
			target: this.element,
			detail: {
				response: t,
				visit: async (e, t) => {
					e instanceof Response ? this.#m(e) : $.visit(e, t);
				}
			},
			cancelable: !0
		}).defaultPrevented;
	}
	#f(e) {
		this.view.missing(), this.#p(e);
	}
	#p(e) {
		throw new ei(`The response (${e.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`);
	}
	async #m(e) {
		let t = new en(e), n = await t.responseHTML, { location: r, redirected: i, statusCode: a } = t;
		return $.visit(r, { response: {
			redirected: i,
			statusCode: a,
			responseHTML: n
		} });
	}
	#h(e, t) {
		let n = k("data-turbo-frame", t, e) || this.element.getAttribute("target"), r = this.#x(n);
		return r instanceof w ? r : this.element;
	}
	async extractForeignFrameElement(e) {
		let t, n = CSS.escape(this.id);
		try {
			if (t = ni(e.querySelector(`turbo-frame#${n}`), this.sourceURL), t) return t;
			if (t = ni(e.querySelector(`turbo-frame[src][recurse~=${n}]`), this.sourceURL), t) return await t.loaded, await this.extractForeignFrameElement(t);
		} catch (e) {
			return console.error(e), new w();
		}
		return null;
	}
	#g(e, t) {
		return R(I(Gt(e, t)), this.rootLocation);
	}
	#_(e, t) {
		let n = k("data-turbo-frame", t, e) || this.element.getAttribute("target");
		if (e instanceof HTMLFormElement && !this.#g(e, t) || !this.enabled || n == "_top") return !1;
		if (n) {
			let e = this.#x(n);
			if (e) return !e.disabled;
			if (n == "_parent") return !1;
		}
		return !(!$.elementIsNavigatable(e) || t && !$.elementIsNavigatable(t));
	}
	get id() {
		return this.element.id;
	}
	get disabled() {
		return this.element.disabled;
	}
	get enabled() {
		return !this.disabled;
	}
	get sourceURL() {
		if (this.element.src) return this.element.src;
	}
	set sourceURL(e) {
		this.#y("src", () => {
			this.element.src = e ?? null;
		});
	}
	get loadingStyle() {
		return this.element.loading;
	}
	get isLoading() {
		return this.formSubmission !== void 0 || this.#t() !== void 0;
	}
	get complete() {
		return this.element.hasAttribute("complete");
	}
	set complete(e) {
		e ? this.element.setAttribute("complete", "") : this.element.removeAttribute("complete");
	}
	get isActive() {
		return this.element.isActive && this.#n;
	}
	get rootLocation() {
		return I(this.element.ownerDocument.querySelector("meta[name=\"turbo-root\"]")?.content ?? "/");
	}
	#v(e) {
		return this.#i.has(e);
	}
	#y(e, t) {
		this.#i.add(e), t(), this.#i.delete(e);
	}
	#b(e, t) {
		this.currentNavigationElement = e, t(), delete this.currentNavigationElement;
	}
	#x(e) {
		if (e != null) {
			let t = e === "_parent" ? this.element.parentElement.closest("turbo-frame") : document.getElementById(e);
			if (t instanceof w) return t;
		}
	}
};
function ni(e, t) {
	if (e) {
		let n = e.getAttribute("src");
		if (n != null && t != null && Xt(n, t)) throw Error(`Matching <turbo-frame id="${e.id}"> element has a source URL which references itself`);
		if (e.ownerDocument !== document && (e = document.importNode(e, !0)), e instanceof w) return e.connectedCallback(), e.disconnectedCallback(), e;
	}
}
var ri = {
	after() {
		this.removeDuplicateTargetSiblings(), this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e.nextSibling));
	},
	append() {
		this.removeDuplicateTargetChildren(), this.targetElements.forEach((e) => e.append(this.templateContent));
	},
	before() {
		this.removeDuplicateTargetSiblings(), this.targetElements.forEach((e) => e.parentElement?.insertBefore(this.templateContent, e));
	},
	prepend() {
		this.removeDuplicateTargetChildren(), this.targetElements.forEach((e) => e.prepend(this.templateContent));
	},
	remove() {
		this.targetElements.forEach((e) => e.remove());
	},
	replace() {
		let e = this.getAttribute("method");
		this.targetElements.forEach((t) => {
			e === "morph" ? q(t, this.templateContent) : t.replaceWith(this.templateContent);
		});
	},
	update() {
		let e = this.getAttribute("method");
		this.targetElements.forEach((t) => {
			e === "morph" ? Hn(t, this.templateContent) : (t.innerHTML = "", t.append(this.templateContent));
		});
	},
	refresh() {
		let e = this.getAttribute("method"), t = this.requestId, n = this.getAttribute("scroll");
		$.refresh(this.baseURI, {
			method: e,
			requestId: t,
			scroll: n
		});
	}
}, ii = class e extends HTMLElement {
	static async renderElement(e) {
		await e.performAction();
	}
	async connectedCallback() {
		try {
			await this.render();
		} catch (e) {
			console.error(e);
		} finally {
			this.disconnect();
		}
	}
	async render() {
		return this.renderPromise ??= (async () => {
			let e = this.beforeRenderEvent;
			this.dispatchEvent(e) && (await D(), await e.detail.render(this));
		})();
	}
	disconnect() {
		try {
			this.remove();
		} catch {}
	}
	removeDuplicateTargetChildren() {
		this.duplicateChildren.forEach((e) => e.remove());
	}
	get duplicateChildren() {
		let e = this.targetElements.flatMap((e) => [...e.children]).filter((e) => !!e.getAttribute("id")), t = [...this.templateContent?.children || []].filter((e) => !!e.getAttribute("id")).map((e) => e.getAttribute("id"));
		return e.filter((e) => t.includes(e.getAttribute("id")));
	}
	removeDuplicateTargetSiblings() {
		this.duplicateSiblings.forEach((e) => e.remove());
	}
	get duplicateSiblings() {
		let e = this.targetElements.flatMap((e) => [...e.parentElement.children]).filter((e) => !!e.id), t = [...this.templateContent?.children || []].filter((e) => !!e.id).map((e) => e.id);
		return e.filter((e) => t.includes(e.id));
	}
	get performAction() {
		if (this.action) {
			let e = ri[this.action];
			if (e) return e;
			this.#e("unknown action");
		}
		this.#e("action attribute is missing");
	}
	get targetElements() {
		if (this.target) return this.targetElementsById;
		if (this.targets) return this.targetElementsByQuery;
		this.#e("target or targets attribute is missing");
	}
	get templateContent() {
		return this.templateElement.content.cloneNode(!0);
	}
	get templateElement() {
		if (this.firstElementChild === null) {
			let e = this.ownerDocument.createElement("template");
			return this.appendChild(e), e;
		}
		if (this.firstElementChild instanceof HTMLTemplateElement) return this.firstElementChild;
		this.#e("first child element must be a <template> element");
	}
	get action() {
		return this.getAttribute("action");
	}
	get target() {
		return this.getAttribute("target");
	}
	get targets() {
		return this.getAttribute("targets");
	}
	get requestId() {
		return this.getAttribute("request-id");
	}
	#e(e) {
		throw Error(`${this.description}: ${e}`);
	}
	get description() {
		return (this.outerHTML.match(/<[^>]+>/) ?? [])[0] ?? "<turbo-stream>";
	}
	get beforeRenderEvent() {
		return new CustomEvent("turbo:before-stream-render", {
			bubbles: !0,
			cancelable: !0,
			detail: {
				newStream: this,
				render: e.renderElement
			}
		});
	}
	get targetElementsById() {
		let e = this.ownerDocument?.getElementById(this.target);
		return e === null ? [] : [e];
	}
	get targetElementsByQuery() {
		let e = this.ownerDocument?.querySelectorAll(this.targets);
		return e.length === 0 ? [] : Array.prototype.slice.call(e);
	}
}, ai = class extends HTMLElement {
	streamSource = null;
	connectedCallback() {
		this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src), Gr(this.streamSource);
	}
	disconnectedCallback() {
		this.streamSource && (this.streamSource.close(), Kr(this.streamSource));
	}
	get src() {
		return this.getAttribute("src") || "";
	}
};
//#endregion
//#region assets/app.js
w.delegateConstructor = ti, customElements.get("turbo-frame") === void 0 && customElements.define("turbo-frame", w), customElements.get("turbo-stream") === void 0 && customElements.define("turbo-stream", ii), customElements.get("turbo-stream-source") === void 0 && customElements.define("turbo-stream-source", ai), (() => {
	let e = document.currentScript;
	if (!e || e.hasAttribute("data-turbo-suppress-warning")) return;
	let t = e.parentElement;
	for (; t;) {
		if (t == document.body) return console.warn(kt`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, e.outerHTML);
		t = t.parentElement;
	}
})(), window.Turbo = {
	...$r,
	StreamActions: ri
}, Hr(), console.log("This log comes from assets/app.js - welcome to AssetMapper! 🎉");
//#endregion
