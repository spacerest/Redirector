var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
    return void 0 !== a
};
goog.exportPath_ = function(a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    a[0] in c || !c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
};
goog.define = function(a, b) {
    var c = b;
    COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
    goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a;
            (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
};
COMPILED || (goog.isProvided_ = function(a) {
    return !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a))
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
    for (var c = a.split("."), d = b || goog.global, e; e = c.shift();)
        if (goog.isDefAndNotNull(d[e])) d = d[e];
        else return null;
    return d
};
goog.globalize = function(a, b) {
    var c = b || goog.global,
        d;
    for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
    if (goog.DEPENDENCIES_ENABLED) {
        var d;
        a = a.replace(/\\/g, "/");
        for (var e = goog.dependencies_, f = 0; d = b[f]; f++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
        for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        if (goog.useStrictRequires) throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a, b) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
            var c = a[b].src,
                d = c.lastIndexOf("?"),
                d = -1 == d ? c.length :
                d;
            if ("base.js" == c.substr(d - 7, 7)) {
                goog.basePath = c.substr(0, d - 7);
                break
            }
        }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in d.written)) {
            if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires))
                for (var g in d.requires[e])
                    if (!goog.isProvided_(g))
                        if (g in d.nameToPath) a(d.nameToPath[g]);
                        else throw Error("Undefined nameToPath for " + g);
            e in c || (c[e] = !0, b.push(e))
        }
    }
    var b = [],
        c = {},
        d = goog.dependencies_,
        e;
    for (e in goog.included_) d.written[e] || a(e);
    for (e = 0; e < b.length; e++)
        if (b[e]) goog.importScript_(goog.basePath + b[e]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
    var b = typeof a;
    if ("object" == b)
        if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isNull = function(a) {
    return null === a
};
goog.isDefAndNotNull = function(a) {
    return null != a
};
goog.isArray = function(a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
    return "string" == typeof a
};
goog.isBoolean = function(a) {
    return "boolean" == typeof a
};
goog.isNumber = function(a) {
    return "number" == typeof a
};
goog.isFunction = function(a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
    return !!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function(a, b, c) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};
goog.bind = function(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
        var b = c.slice();
        b.push.apply(b, arguments);
        return a.apply(this, b)
    }
};
goog.mixin = function(a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval)
        if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                c = b.createElement("script");
            c.type = "text/javascript";
            c.defer = !1;
            c.appendChild(b.createTextNode(a));
            b.body.appendChild(c);
            b.body.removeChild(c)
        } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
    var c = function(a) {
            return goog.cssNameMapping_[a] || a
        },
        d = function(a) {
            a = a.split("-");
            for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
            return b.join("-")
        },
        d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
            return a
        };
    return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
    b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
        return d in b ? b[d] : a
    }));
    return a
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
    a[b] = c
};
goog.inherits = function(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.base = function(a, c, f) {
        var g = Array.prototype.slice.call(arguments, 2);
        return b.prototype[c].apply(a, g)
    }
};
goog.base = function(a, b, c) {
    var d = arguments.callee.caller;
    if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (d.superClass_) return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
        if (g.prototype[b] === d) f = !0;
        else if (f) return g.prototype[b].apply(a,
        e);
    if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(a, b) {
    if (1 < arguments.length) {
        var c = Array.prototype.slice.call(arguments, 1);
        c.unshift(this, a);
        return goog.bind.apply(null, c)
    }
    return goog.bind(this, a)
}, Function.prototype.partial = function(a) {
    var b = Array.prototype.slice.call(arguments);
    b.unshift(this, null);
    return goog.bind.apply(null, b)
}, Function.prototype.inherits = function(a) {
    goog.inherits(this, a)
}, Function.prototype.mixin = function(a) {
    goog.mixin(this.prototype,
        a)
});
goog.defineClass = function(a, b) {
    var c = b.constructor,
        d = b.statics;
    c && c != Object.prototype.constructor || (c = function() {
        throw Error("cannot instantiate an interface (no constructor defined).");
    });
    c = goog.defineClass.createSealingConstructor_(c);
    a && goog.inherits(c, a);
    delete b.constructor;
    delete b.statics;
    goog.defineClass.applyProperties_(c.prototype, b);
    null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
    return c
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a) {
    if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        var b = function() {
            var c = a.apply(this, arguments) || this;
            this.constructor === b && Object.seal(c);
            return c
        };
        return b
    }
    return a
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
    for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
    for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
};
var picker = {
    api: {}
};
picker.api.Action = {
    CANCEL: "cancel",
    PICKED: "picked",
    UPLOAD_PROGRESS: "uploadProgress",
    UPLOAD_SCHEDULED: "uploadScheduled",
    UPLOAD_STATE_CHANGE: "uploadStateChange",
    LOADED: "loaded",
    VIEW_CHANGED: "viewChanged",
    VIEW_UPDATED: "viewUpdated",
    VIEW_CONTENT_RENDERED: "viewContentRendered",
    RECEIVED: "received"
};
goog.debug = {};
goog.debug.Error = function(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);
    else {
        var b = Error().stack;
        b && (this.stack = b)
    }
    a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
    return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
    return " " == a
};
goog.string.isUnicodeChar = function(a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
    var c = String(a).toLowerCase(),
        d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
        var g = c[f],
            h = d[f];
        if (g != h) return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
    return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
    return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
    if (b) a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
    else {
        if (!goog.string.ALL_RE_.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_,
            "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;")); - 1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;")); - 1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
        goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"))
    }
    return a
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
    return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
    return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
    var c = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"'
        },
        d;
    d = b ? b.createElement("div") : goog.global.document.createElement("div");
    return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
        var g = c[a];
        if (g) return g;
        if ("#" == b.charAt(0)) {
            var h = Number("0" + b.substr(1));
            isNaN(h) || (g = String.fromCharCode(h))
        }
        g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
        return c[a] = g
    })
};
goog.string.unescapePureXmlEntities_ = function(a) {
    return a.replace(/&([^;]+);/g, function(a, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if ("#" == c.charAt(0)) {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return a
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.preserveSpaces = function(a) {
    return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = 1 == c ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
};
goog.string.truncate = function(a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d && a.length > b) {
        d > b && (d = b);
        var e = a.length - d;
        a = a.substring(0, b - d) + "..." + a.substring(e)
    } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function(a) {
    a = String(a);
    if (a.quote) return a.quote();
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var d = a.charAt(c),
            e = d.charCodeAt(0);
        b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
};
goog.string.escapeString = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
    return b.join("")
};
goog.string.escapeChar = function(a) {
    if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
    if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
    var b = a,
        c = a.charCodeAt(0);
    if (31 < c && 127 > c) b = a;
    else {
        if (256 > c) {
            if (b = "\\x", 16 > c || 256 < c) b += "0"
        } else b = "\\u", 4096 > c && (b += "0");
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
    for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
    return b
};
goog.string.contains = function(a, b) {
    return -1 != a.indexOf(b)
};
goog.string.caseInsensitiveContains = function(a, b) {
    return goog.string.contains(a.toLowerCase(), b.toLowerCase())
};
goog.string.countOf = function(a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf("."); - 1 == c && (c = a.length);
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
    return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
        var h = d[g] || "",
            k = e[g] || "",
            l = RegExp("(\\d*)(\\D*)", "g"),
            m = RegExp("(\\d*)(\\D*)", "g");
        do {
            var n = l.exec(h) || ["", "", ""],
                p = m.exec(k) || ["", "", ""];
            if (0 == n[0].length && 0 == p[0].length) break;
            var c = 0 == n[1].length ? 0 : parseInt(n[1], 10),
                q = 0 == p[1].length ? 0 : parseInt(p[1], 10),
                c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 ==
                    n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2])
        } while (0 == c)
    }
    return c
};
goog.string.compareElements_ = function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
    return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
    var b = Number(a);
    return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
    return String(a).replace(/\-([a-z])/g, function(a, c) {
        return c.toUpperCase()
    })
};
goog.string.toSelectorCase = function(a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
    var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
    return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
        return b + c.toUpperCase()
    })
};
goog.string.parseInt = function(a) {
    isFinite(a) && (a = String(a));
    return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
    a.length && d.push(a.join(b));
    return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
    throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) var e = e + (": " + c),
        f = d;
    else a && (e += ": " + a, f = b);
    a = new goog.asserts.AssertionError("" + e, f || []);
    goog.asserts.errorHandler_(a)
};
goog.asserts.setErrorHandler = function(a) {
    goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a)
};
goog.asserts.assert = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
};
goog.asserts.assertNumber = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertElement = function(a, b, c) {
    !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
    !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
    return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
};
picker.api.DocsSortKey = {
    IMPORTANCE: 1,
    LAST_VIEWED_DATE: 2,
    MODIFICATION_DATE: 3,
    RELEVANCE: 5,
    STARRED: 6,
    TITLE: 7,
    FOLDER_TITLE: 8,
    SHARE_DATE: 9,
    USER_MODIFICATION_DATE: 10,
    QUOTA_BYTES_USED: 11
};
picker.api.DocsViewMode = {
    GRID: "grid",
    LIST: "list"
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
    return a[a.length - 1]
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
    for (; c < a.length; c++)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
    c = null == c ? a.length - 1 : c;
    0 > c && (c = Math.max(0, a.length + c));
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
    for (; 0 <= c; c--)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
};
goog.array.forEachRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) d in e && b.call(c, e[d], d, a)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++)
        if (h in g) {
            var k = g[h];
            b.call(c, k, h, a) && (e[f++] = k)
        }
    return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
    return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEach(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEachRight(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return !0;
    return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && !b.call(c, e[f], f, a)) return !1;
    return !0
};
goog.array.count = function(a, b, c) {
    var d = 0;
    goog.array.forEach(a, function(a, f, g) {
        b.call(c, a, f, g) && ++d
    }, c);
    return d
};
goog.array.find = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return f;
    return -1
};
goog.array.findRight = function(a, b, c) {
    b = goog.array.findIndexRight(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--)
        if (d in e && b.call(c, e[d], d, a)) return d;
    return -1
};
goog.array.contains = function(a, b) {
    return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
    return 0 == a.length
};
goog.array.clear = function(a) {
    if (!goog.isArray(a))
        for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
};
goog.array.insert = function(a, b) {
    goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
    goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
    goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
    var d;
    2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
    var c = goog.array.indexOf(a, b),
        d;
    (d = 0 <= c) && goog.array.removeAt(a, c);
    return d
};
goog.array.removeAt = function(a, b) {
    goog.asserts.assert(null != a.length);
    return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.join = function(a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
        return c
    }
    return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d = arguments[c],
            e;
        if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) a.push.apply(a, d);
        else if (e)
            for (var f = a.length, g = d.length, h = 0; h < g; h++) a[f + h] = d[h];
        else a.push(d)
    }
};
goog.array.splice = function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b, c) {
    b = b || a;
    var d = function(a) {
        return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g
    };
    c = c || d;
    for (var d = {}, e = 0, f = 0; f < a.length;) {
        var g = a[f++],
            h = c(g);
        Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
    }
    b.length = e
};
goog.array.binarySearch = function(a, b, c) {
    return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
    return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
    for (var f = 0, g = a.length, h; f < g;) {
        var k = f + g >> 1,
            l;
        l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
        0 < l ? f = k + 1 : (g = k, h = !l)
    }
    return h ? f : ~f
};
goog.array.sort = function(a, b) {
    a.sort(b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
    for (var c = 0; c < a.length; c++) a[c] = {
        index: c,
        value: a[c]
    };
    var d = b || goog.array.defaultCompare;
    goog.array.sort(a, function(a, b) {
        return d(a.value, b.value) || a.index - b.index
    });
    for (c = 0; c < a.length; c++) a[c] = a[c].value
};
goog.array.sortObjectsByKey = function(a, b, c) {
    var d = c || goog.array.defaultCompare;
    goog.array.sort(a, function(a, c) {
        return d(a[b], c[b])
    })
};
goog.array.isSorted = function(a, b, c) {
    b = b || goog.array.defaultCompare;
    for (var d = 1; d < a.length; d++) {
        var e = b(a[d - 1], a[d]);
        if (0 < e || 0 == e && c) return !1
    }
    return !0
};
goog.array.equals = function(a, b, c) {
    if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;
    var d = a.length;
    c = c || goog.array.defaultCompareEquality;
    for (var e = 0; e < d; e++)
        if (!c(a[e], b[e])) return !1;
    return !0
};
goog.array.compare3 = function(a, b, c) {
    c = c || goog.array.defaultCompare;
    for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
        var f = c(a[e], b[e]);
        if (0 != f) return f
    }
    return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
    return a === b
};
goog.array.binaryInsert = function(a, b, c) {
    c = goog.array.binarySearch(a, b, c);
    return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
    b = goog.array.binarySearch(a, b, c);
    return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
    for (var d = {}, e = 0; e < a.length; e++) {
        var f = a[e],
            g = b.call(c, f, e, a);
        goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
    }
    return d
};
goog.array.toObject = function(a, b, c) {
    var d = {};
    goog.array.forEach(a, function(e, f) {
        d[b.call(c, e, f, a)] = e
    });
    return d
};
goog.array.range = function(a, b, c) {
    var d = [],
        e = 0,
        f = a;
    c = c || 1;
    void 0 !== b && (e = a, f = b);
    if (0 > c * (f - e)) return [];
    if (0 < c)
        for (a = e; a < f; a += c) d.push(a);
    else
        for (a = e; a > f; a += c) d.push(a);
    return d
};
goog.array.repeat = function(a, b) {
    for (var c = [], d = 0; d < b; d++) c[d] = a;
    return c
};
goog.array.flatten = function(a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
        var d = arguments[c];
        goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
    }
    return b
};
goog.array.rotate = function(a, b) {
    goog.asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
    return a
};
goog.array.moveItem = function(a, b, c) {
    goog.asserts.assert(0 <= b && b < a.length);
    goog.asserts.assert(0 <= c && c < a.length);
    b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
    if (!arguments.length) return [];
    for (var b = [], c = 0;; c++) {
        for (var d = [], e = 0; e < arguments.length; e++) {
            var f = arguments[e];
            if (c >= f.length) return b;
            d.push(f[c])
        }
        b.push(d)
    }
};
goog.array.shuffle = function(a, b) {
    for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
        var e = Math.floor(c() * (d + 1)),
            f = a[d];
        a[d] = a[e];
        a[e] = f
    }
};
goog.functions = {};
goog.functions.constant = function(a) {
    return function() {
        return a
    }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
    return a
};
goog.functions.error = function(a) {
    return function() {
        throw Error(a);
    }
};
goog.functions.fail = function(a) {
    return function() {
        throw a;
    }
};
goog.functions.lock = function(a, b) {
    b = b || 0;
    return function() {
        return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
    }
};
goog.functions.nth = function(a) {
    return function() {
        return arguments[a]
    }
};
goog.functions.withReturnValue = function(a, b) {
    return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function(a, b) {
    var c = arguments,
        d = c.length;
    return function() {
        var a;
        d && (a = c[d - 1].apply(this, arguments));
        for (var b = d - 2; 0 <= b; b--) a = c[b].call(this, a);
        return a
    }
};
goog.functions.sequence = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a, e = 0; e < c; e++) a = b[e].apply(this, arguments);
        return a
    }
};
goog.functions.and = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a = 0; a < c; a++)
            if (!b[a].apply(this, arguments)) return !1;
        return !0
    }
};
goog.functions.or = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a = 0; a < c; a++)
            if (b[a].apply(this, arguments)) return !0;
        return !1
    }
};
goog.functions.not = function(a) {
    return function() {
        return !a.apply(this, arguments)
    }
};
goog.functions.create = function(a, b) {
    var c = function() {};
    c.prototype = a.prototype;
    c = new c;
    a.apply(c, Array.prototype.slice.call(arguments, 1));
    return c
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
    var b = !1,
        c;
    return function() {
        if (!goog.functions.CACHE_RETURN_VALUE) return a();
        b || (c = a(), b = !0);
        return c
    }
};
goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.isValid_ = function(a) {
    return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
    a = String(a);
    if (goog.json.isValid_(a)) try {
        return eval("(" + a + ")")
    } catch (b) {}
    throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
    return eval("(" + a + ")")
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(a, b) {
    return (new goog.json.Serializer(b)).serialize(a)
};
goog.json.Serializer = function(a) {
    this.replacer_ = a
};
goog.json.Serializer.prototype.serialize = function(a) {
    var b = [];
    this.serializeInternal(a, b);
    return b.join("")
};
goog.json.Serializer.prototype.serializeInternal = function(a, b) {
    switch (typeof a) {
        case "string":
            this.serializeString_(a, b);
            break;
        case "number":
            this.serializeNumber_(a, b);
            break;
        case "boolean":
            b.push(a);
            break;
        case "undefined":
            b.push("null");
            break;
        case "object":
            if (null == a) {
                b.push("null");
                break
            }
            if (goog.isArray(a)) {
                this.serializeArray(a, b);
                break
            }
            this.serializeObject_(a, b);
            break;
        case "function":
            break;
        default:
            throw Error("Unknown type: " + typeof a);
    }
};
goog.json.Serializer.charToJsonCharCache_ = {
    '"': '\\"',
    "\\": "\\\\",
    "/": "\\/",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\u000b"
};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
    b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(a) {
        if (a in goog.json.Serializer.charToJsonCharCache_) return goog.json.Serializer.charToJsonCharCache_[a];
        var b = a.charCodeAt(0),
            e = "\\u";
        16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
        return goog.json.Serializer.charToJsonCharCache_[a] = e + b.toString(16)
    }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
    b.push(isFinite(a) && !isNaN(a) ? a : "null")
};
goog.json.Serializer.prototype.serializeArray = function(a, b) {
    var c = a.length;
    b.push("[");
    for (var d = "", e = 0; e < c; e++) b.push(d), d = a[e], this.serializeInternal(this.replacer_ ? this.replacer_.call(a, String(e), d) : d, b), d = ",";
    b.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
    b.push("{");
    var c = "",
        d;
    for (d in a)
        if (Object.prototype.hasOwnProperty.call(a, d)) {
            var e = a[d];
            "function" != typeof e && (b.push(c), this.serializeString_(d, b), b.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(a, d, e) : e, b), c = ",")
        }
    b.push("}")
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
    for (var d in a) b.call(c, a[d], d, a)
};
goog.object.filter = function(a, b, c) {
    var d = {},
        e;
    for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
    return d
};
goog.object.map = function(a, b, c) {
    var d = {},
        e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d
};
goog.object.some = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return !0;
    return !1
};
goog.object.every = function(a, b, c) {
    for (var d in a)
        if (!b.call(c, a[d], d, a)) return !1;
    return !0
};
goog.object.getCount = function(a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b
};
goog.object.getAnyKey = function(a) {
    for (var b in a) return b
};
goog.object.getAnyValue = function(a) {
    for (var b in a) return a[b]
};
goog.object.contains = function(a, b) {
    return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = a[d];
    return b
};
goog.object.getKeys = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = d;
    return b
};
goog.object.getValueByKeys = function(a, b) {
    for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++);
    return a
};
goog.object.containsKey = function(a, b) {
    return b in a
};
goog.object.containsValue = function(a, b) {
    for (var c in a)
        if (a[c] == b) return !0;
    return !1
};
goog.object.findKey = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return d
};
goog.object.findValue = function(a, b, c) {
    return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
    for (var b in a) return !1;
    return !0
};
goog.object.clear = function(a) {
    for (var b in a) delete a[b]
};
goog.object.remove = function(a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
goog.object.add = function(a, b, c) {
    if (b in a) throw Error('The object already contains the key "' + b + '"');
    goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
    return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
    a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
    return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b
};
goog.object.unsafeClone = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.object.unsafeClone(a[c]);
        return b
    }
    return a
};
goog.object.transpose = function(a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
};
goog.object.create = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
    if (b % 2) throw Error("Uneven number of arguments");
    for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];
    return c
};
goog.object.createSet = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
    for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;
    return c
};
goog.object.createImmutableView = function(a) {
    var b = a;
    Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
    return b
};
goog.object.isImmutableView = function(a) {
    return !!Object.isFrozen && Object.isFrozen(a)
};
picker.api.CompilerFlags = {};
var PICKER_THIRD_PARTY_API = !1,
    PICKER_THIRD_PARTY_LEGACY_API = !1;
picker.api.ContainerRenameType = {
    PICASA_NAME: "pname",
    PICASA_NEW_NAME: "pnew"
};
picker.api.PhotosMode = {
    BLOGGER: "blogger",
    EDIT: "edit",
    PALETTE: "palette",
    ROLLUP_ALBUM: "rollupAlbum"
};
picker.api.ViewId = {
    DOCS: "all",
    DOCS_IMAGES: "docs-images",
    DOCS_IMAGES_AND_VIDEOS: "docs-images-and-videos",
    DOCS_VIDEOS: "docs-videos",
    DOCUMENTS: "documents",
    DRAWINGS: "drawings",
    FOLDERS: "folders",
    FORMS: "forms",
    PDFS: "pdfs",
    PRESENTATIONS: "presentations",
    SCRIPTS: "scripts",
    SITES: "sites",
    SPREADSHEETS: "spreadsheets",
    TABLES: "tables",
    CROP: "crop",
    IMAGE_SEARCH: "image-search",
    ORKUT: "orkut",
    PHOTO_ALBUMS: "photo-albums",
    PHOTO_CAPTION: "photo-caption",
    PHOTO_CURATION: "photo-curation",
    PHOTO_UPLOAD: "photo-upload",
    PHOTO_TAGGING: "photo-tagging",
    PHOTOS: "photos",
    WEBCAM: "webcam",
    YOUTUBE_BANNER_PREVIEW: "youtube-banner-preview",
    VIDEO_SEARCH: "video-search",
    VIDEOS: "videos",
    YOUTUBE: "youtube",
    MAPS: "maps",
    MAPS_PRO: "maps-pro",
    MY_MAPS: "my-maps",
    CIRCLE: "circle",
    CONTACTS: "contacts",
    PEOPLE: "people",
    EVENTS: "events",
    EVENT_THEME: "et",
    ATTACHMENTS: "attachments",
    BLOG_SEARCH: "blog-search",
    BOOK_SEARCH: "book-search",
    CALENDARS: "calendars",
    FONTS: "fonts",
    ICON: "icon",
    PROFILE: "profile",
    RECENTLY_PICKED: "recently-picked",
    UPLOAD: "upload",
    URL: "url",
    WEB_SEARCH: "web",
    CREATE_EVENT: "create-event",
    QUOTA: "quota"
};
picker.api.ViewId.isDocsView = function(a) {
    switch (a) {
        case picker.api.ViewId.DOCS:
        case picker.api.ViewId.DOCS_IMAGES:
        case picker.api.ViewId.DOCS_IMAGES_AND_VIDEOS:
        case picker.api.ViewId.DOCS_VIDEOS:
        case picker.api.ViewId.DOCUMENTS:
        case picker.api.ViewId.DRAWINGS:
        case picker.api.ViewId.FOLDERS:
        case picker.api.ViewId.FORMS:
        case picker.api.ViewId.PDFS:
        case picker.api.ViewId.PRESENTATIONS:
        case picker.api.ViewId.SITES:
        case picker.api.ViewId.SPREADSHEETS:
        case picker.api.ViewId.TABLES:
            return !0
    }
    return !1
};
picker.api.View = function(a) {
    this.id_ = a;
    this.opts = {}
};
picker.api.View.Option = {
    ALBUM_TITLE: "albumTitle",
    ALLOW_NEW_ALBUM: "allowNewAlbum",
    ALLOWED_ITEM_TYPES: "allowedItemTypes",
    CATEGORY: "category",
    COMBO_TYPES: "comboTypes",
    COORDINATES: "coords",
    CONTACT_ID: "contactId",
    CONTAINER_RENAMEABLE: "cRename",
    COSMO_ID: "containingCosmoId",
    COVER_PHOTO_ID: "coverPhotoId",
    CREATE_FOLDER: "createFolder",
    CSE: "cse",
    CURATION_HIDE_EXISTING: "che",
    DATA: "data",
    DOC_TYPES_DROP_DOWN: "docTypesDropDown",
    ENABLE_ADD_PEOPLE: "eap",
    ENABLE_ADD_TO_ALBUM: "eata",
    ENABLE_ALBUM_NAVAGATION: "enableAlbumNavigation",
    ENABLE_CONVERSION_TO_DOCS: "enableUploadConversion",
    ENABLE_LOCAL_PROFILE_PHOTO: "enableLocalProfilePhoto",
    ENABLE_ROOT_SELECTION: "ers",
    EVENT_ID: "eid",
    EXCLUDE_EVENT_ALBUMS: "excludeEvAlbums",
    EXCLUDE_LABELS: "excludeLabels",
    FACE_RECOGNITION_PROMO_NEEDED: "frpn",
    FOLDERS_FIRST: "ff",
    HIDE_ALBUM_AUDIENCE: "hideAa",
    HIDE_BREADCRUMBS: "hideBc",
    HIDE_CONVERSION_CHECKBOX: "hideConvert",
    HIDE_EXISTING_MEMBERS: "hem",
    HIDE_FREQUENT_PEOPLE_LIST: "hfpl",
    HIDE_IMAGE_TRANSFORMATION_OPTIONS: "hito",
    ID: "id",
    IDS: "ids",
    IMAGE_SEARCH_COLOR: "imgcolor",
    IMAGE_SEARCH_COLORIZATION: "imgc",
    IMAGE_SEARCH_SIZE: "imgsz",
    IMAGE_SEARCH_TYPE: "imgtype",
    IN_URL: "inUrl",
    INCLUDE_FOLDERS: "includeFolders",
    INITIAL_FOCUS_PHOTO: "ifp",
    LICENSE: "license",
    LOCAL_ALBUM: "localalbum",
    LOCAL_USER: "localuser",
    MAP_CENTER: "center",
    MAP_PLACEMARK: "placemark",
    MAP_ZOOM: "zoom",
    MAX_COLLECTIONS_TO_PREFETCH: "maxPrefetchCollections",
    MIME_TYPES: "mimeTypes",
    MODE: "mode",
    MORE_ALBUMS: "moreAlbums",
    MOVE_TO_PARENT: "mtp",
    NO_EMAIL_INPUT: "noEmailInput",
    OWNED_BY_ME: "ownedByMe",
    PARENT: "parent",
    PARENT_NAME: "parentName",
    PEOPLE_FILTER: "peopleFilter",
    PERMANENTLY_DELETE: "pd",
    QUERY: "query",
    RECIPIENTS_LABEL: "recipientsLabel",
    SEARCH_LABEL: "cseLabel",
    SEARCH_SAFE: "safe",
    SEEDED_LOCAL_PHOTOS: "seededLocalPhotos",
    SELECT_ALBUM_ENABLED: "selectAlbum",
    SELECT_ALBUM_LABEL: "selectAlbumLabel",
    SELECT_FOLDER_ENABLED: "selectFolder",
    SELECT_NONE_ENABLED: "selectNone",
    SERVICE: "service",
    SHAPE_SUGGESTIONS: "shapeSuggestions",
    SHAPE_TYPE: "shapeType",
    SHOW_VIDEO_METADATA: "svm",
    SITE: "site",
    THUMBNAIL_SIZE: "thumbnailSize",
    SORT_KEY: "sortKey",
    SORT_ORDER: "sortOrder",
    STARRED: "starred",
    TYPE: "type",
    UPLOAD: "upload",
    UPLOAD_NOTIFICATIONS: "notifications",
    UPLOAD_POSITION: "uploadpos",
    URL: "url",
    USERNAME: "username",
    USER_ID: "userId",
    VIEW_INFO: "viewInfo",
    VIEW_TITLE: "viewTitle",
    VISIBILITY_FILTER: "visibilityFilter",
    WEBCAM_FPS: "vFps",
    WEBCAM_HEIGHT: "vHeight",
    WEBCAM_KEYFRAME: "vKeyFrame",
    WEBCAM_MAX_BYTES: "vMaxBytes",
    WEBCAM_WIDTH: "vWidth",
    YOUTUBE_BANNER_MAX_FILE_SIZE: "ytMaxFileSize",
    YOUTUBE_BANNER_RECOMMENDED_WIDTH: "ytRecWidth",
    YOUTUBE_BANNER_RECOMMENDED_HEIGHT: "ytRecHeight"
};
picker.api.View.prototype.setLabel = function(a) {
    this.label_ = a || void 0;
    return this
};
picker.api.View.prototype.setQuery = function(a) {
    this.opts[picker.api.View.Option.QUERY] = a;
    return this
};
picker.api.View.prototype.setMimeTypes = function(a) {
    this.opts[picker.api.View.Option.MIME_TYPES] = a;
    return this
};
picker.api.View.prototype.setBreadcrumbsBarHidden = function(a) {
    this.opts[picker.api.View.Option.HIDE_BREADCRUMBS] = a ? "true" : null;
    return this
};
picker.api.View.prototype.addUploadMetadata = function(a, b) {
    var c = this.opts[picker.api.View.Option.DATA] || {};
    c[a] = b;
    this.opts[picker.api.View.Option.DATA] = c;
    return this
};
picker.api.View.prototype.setParent = function(a) {
    this.opts[picker.api.View.Option.PARENT] = a;
    return this
};
picker.api.View.prototype.setContainerRenameableType = function(a) {
    this.opts[picker.api.View.Option.CONTAINER_RENAMEABLE] = a;
    return this
};
picker.api.View.prototype.toArray = function() {
    var a = goog.object.filter(this.opts, function(a) {
            return null !== a
        }),
        a = goog.object.isEmpty(a) ? null : a,
        a = [this.id_, this.label_, a],
        b = goog.array.findIndexRight(a, goog.functions.identity);
    return a = a.slice(0, b + 1)
};
picker.api.View.prototype.toString = function() {
    var a = this.toArray();
    return "(" + goog.array.map(a, function(a) {
        return goog.json.serialize(a)
    }).join(",") + ")"
};
picker.api.View.prototype.getId = function() {
    return this.id_
};
picker.api.View.prototype.getLabel = function() {
    return this.label_
};
picker.api.View.prototype.getOptions = function() {
    return goog.object.clone(this.opts)
};
picker.api.View.prototype.getQuery = function() {
    return this.opts[picker.api.View.Option.QUERY]
};
picker.api.DocsView = function(a) {
    a && goog.asserts.assert(picker.api.ViewId.isDocsView(a), "opt_viewId must be a docs view type");
    picker.api.View.call(this, a || picker.api.ViewId.DOCS)
};
goog.inherits(picker.api.DocsView, picker.api.View);
picker.api.DocsView.prototype.setSortKey = function(a, b) {
    this.opts[picker.api.View.Option.SORT_KEY] = a;
    b && (this.opts[picker.api.View.Option.FOLDERS_FIRST] = b);
    return this
};
picker.api.DocsView.prototype.setMode = function(a) {
    this.opts[picker.api.View.Option.MODE] = a;
    return this
};
picker.api.DocsView.prototype.setOwnedByMe = function(a) {
    goog.isDef(a) ? this.opts[picker.api.View.Option.OWNED_BY_ME] = a : delete this.opts[picker.api.View.Option.OWNED_BY_ME];
    return this
};
picker.api.DocsView.prototype.setStarred = function(a) {
    this.opts[picker.api.View.Option.STARRED] = a;
    return this
};
picker.api.DocsView.prototype.setIncludeFolders = function(a) {
    this.opts[picker.api.View.Option.INCLUDE_FOLDERS] = a;
    return this
};
picker.api.DocsView.prototype.setSelectFolderEnabled = function(a) {
    this.opts[picker.api.View.Option.SELECT_FOLDER_ENABLED] = a;
    return this
};
picker.api.DocsView.prototype.setRootSelectionEnabled = function(a) {
    this.opts[picker.api.View.Option.ENABLE_ROOT_SELECTION] = a;
    return this
};
picker.api.DocsView.prototype.setDocTypesDropDownEnabled = function(a) {
    this.opts[picker.api.View.Option.DOC_TYPES_DROP_DOWN] = a;
    return this
};
picker.api.DocsView.prototype.setUploadEnabled = function(a) {
    this.opts[picker.api.View.Option.UPLOAD] = a;
    return this
};
picker.api.DocsView.prototype.setContainingCosmoId = function(a) {
    this.opts[picker.api.View.Option.COSMO_ID] = a;
    return this
};
picker.api.DocsView.prototype.setCreateFolderEnabled = function(a) {
    this.opts[picker.api.View.Option.CREATE_FOLDER] = a;
    return this
};
picker.api.DocsView.prototype.setMaxCollectionsToPrefetch = function(a) {
    this.opts[picker.api.View.Option.MAX_COLLECTIONS_TO_PREFETCH] = a;
    return this
};
picker.api.Feature = {
    DRIVE_GRID_VIEW_SWITCHER_HIDDEN: "driveGridViewSwitcherHidden",
    DRIVE_SORT_HIDDEN: "driveSortHidden",
    ENABLE_ATTACHMENT_TYPE_INPUT: "showAttach",
    ENABLE_SIZE_ESTIMATION: "enableSizeEstimation",
    ES_USERS_ONLY: "esUsersOnly",
    FACE_RECO_PROMO: "faceRecoPromo",
    FORMS_ENABLED: "formsEnabled",
    HORIZONTAL_NAV_PANE: "horizNav",
    MINE_ONLY: "mineOnly",
    MINIMAL_MODE: "minimal",
    MINIMAL_MODE_NEW: "minew",
    MULTISELECT_ENABLED: "multiselectEnabled",
    NAV_HIDDEN: "navHidden",
    NEW_DRIVE_VIEW: "newDriveView",
    NEW_HORIZONTAL_NAV_PANE: "newHorizNav",
    NEW_PHOTO_GRID_VIEW: "newPhotoGridView",
    NEW_PHOTO_UPLOAD_VIEW: "npuv",
    PHOTOS_COLOR_PROFILE_FIX_ENABLED: "pcpfe",
    PROFILE_PHOTO: "profilePhoto",
    SELECT_WHILE_UPLOADING_ENABLED: "swue",
    SHADE_DIALOG: "shadeDialog",
    SHAPE_SUGGESTIONS: "shapeSuggestions",
    SHOWROOM_NAV: "showroomNav",
    SIMPLE_UPLOAD_ENABLED: "simpleUploadEnabled",
    URL_INPUT_VISIBLE: "urlInputVisible",
    WHITE_STYLE: "white"
};
goog.math = {};
goog.math.randomInt = function(a) {
    return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
    return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
    return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
    var c = a % b;
    return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
    return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
    return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
    return goog.math.modulo(a, 360)
};
goog.math.standardAngleInRadians = function(a) {
    return goog.math.modulo(a, 2 * Math.PI)
};
goog.math.toRadians = function(a) {
    return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
    return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
    return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
    return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
    return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
    var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
    180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
    return c
};
goog.math.sign = function(a) {
    return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
    c = c || function(a, b) {
        return a == b
    };
    d = d || function(b, c) {
        return a[b]
    };
    for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) g[h] = [], g[h][0] = 0;
    for (var k = 0; k < f + 1; k++) g[0][k] = 0;
    for (h = 1; h <= e; h++)
        for (k = 1; k <= f; k++) c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
    for (var l = [], h = e, k = f; 0 < h && 0 < k;) c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
    return l
};
goog.math.sum = function(a) {
    return goog.array.reduce(arguments, function(a, c) {
        return a + c
    }, 0)
};
goog.math.average = function(a) {
    return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.sampleVariance = function(a) {
    var b = arguments.length;
    if (2 > b) return 0;
    var c = goog.math.average.apply(null, arguments);
    return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
        return Math.pow(a - c, 2)
    })) / (b - 1)
};
goog.math.standardDeviation = function(a) {
    return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
};
goog.math.isInt = function(a) {
    return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
    return isFinite(a) && !isNaN(a)
};
goog.math.log10Floor = function(a) {
    if (0 < a) {
        var b = Math.round(Math.log(a) * Math.LOG10E);
        return b - (parseFloat("1e" + b) > a)
    }
    return 0 == a ? -Infinity : NaN
};
goog.math.safeFloor = function(a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.ceil(a - (b || 2E-15))
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {};
goog.iter.Iterator.prototype.next = function() {
    throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
    return this
};
goog.iter.toIterator = function(a) {
    if (a instanceof goog.iter.Iterator) return a;
    if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
    if (goog.isArrayLike(a)) {
        var b = 0,
            c = new goog.iter.Iterator;
        c.next = function() {
            for (;;) {
                if (b >= a.length) throw goog.iter.StopIteration;
                if (b in a) return a[b++];
                b++
            }
        };
        return c
    }
    throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
    if (goog.isArrayLike(a)) try {
        goog.array.forEach(a, b, c)
    } catch (d) {
        if (d !== goog.iter.StopIteration) throw d;
    } else {
        a = goog.iter.toIterator(a);
        try {
            for (;;) b.call(c, a.next(), void 0, a)
        } catch (e) {
            if (e !== goog.iter.StopIteration) throw e;
        }
    }
};
goog.iter.filter = function(a, b, c) {
    var d = goog.iter.toIterator(a);
    a = new goog.iter.Iterator;
    a.next = function() {
        for (;;) {
            var a = d.next();
            if (b.call(c, a, void 0, d)) return a
        }
    };
    return a
};
goog.iter.filterFalse = function(a, b, c) {
    return goog.iter.filter(a, goog.functions.not(b), c)
};
goog.iter.range = function(a, b, c) {
    var d = 0,
        e = a,
        f = c || 1;
    1 < arguments.length && (d = a, e = b);
    if (0 == f) throw Error("Range step argument must not be zero");
    var g = new goog.iter.Iterator;
    g.next = function() {
        if (0 < f && d >= e || 0 > f && d <= e) throw goog.iter.StopIteration;
        var a = d;
        d += f;
        return a
    };
    return g
};
goog.iter.join = function(a, b) {
    return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
    var d = goog.iter.toIterator(a);
    a = new goog.iter.Iterator;
    a.next = function() {
        var a = d.next();
        return b.call(c, a, void 0, d)
    };
    return a
};
goog.iter.reduce = function(a, b, c, d) {
    var e = c;
    goog.iter.forEach(a, function(a) {
        e = b.call(d, e, a)
    });
    return e
};
goog.iter.some = function(a, b, c) {
    a = goog.iter.toIterator(a);
    try {
        for (;;)
            if (b.call(c, a.next(), void 0, a)) return !0
    } catch (d) {
        if (d !== goog.iter.StopIteration) throw d;
    }
    return !1
};
goog.iter.every = function(a, b, c) {
    a = goog.iter.toIterator(a);
    try {
        for (;;)
            if (!b.call(c, a.next(), void 0, a)) return !1
    } catch (d) {
        if (d !== goog.iter.StopIteration) throw d;
    }
    return !0
};
goog.iter.chain = function(a) {
    var b = goog.iter.toIterator(arguments),
        c = new goog.iter.Iterator,
        d = null;
    c.next = function() {
        for (;;) {
            if (null == d) {
                var a = b.next();
                d = goog.iter.toIterator(a)
            }
            try {
                return d.next()
            } catch (c) {
                if (c !== goog.iter.StopIteration) throw c;
                d = null
            }
        }
    };
    return c
};
goog.iter.chainFromIterable = function(a) {
    return goog.iter.chain.apply(void 0, a)
};
goog.iter.dropWhile = function(a, b, c) {
    var d = goog.iter.toIterator(a);
    a = new goog.iter.Iterator;
    var e = !0;
    a.next = function() {
        for (;;) {
            var a = d.next();
            if (!e || !b.call(c, a, void 0, d)) return e = !1, a
        }
    };
    return a
};
goog.iter.takeWhile = function(a, b, c) {
    var d = goog.iter.toIterator(a);
    a = new goog.iter.Iterator;
    var e = !0;
    a.next = function() {
        for (;;)
            if (e) {
                var a = d.next();
                if (b.call(c, a, void 0, d)) return a;
                e = !1
            } else throw goog.iter.StopIteration;
    };
    return a
};
goog.iter.toArray = function(a) {
    if (goog.isArrayLike(a)) return goog.array.toArray(a);
    a = goog.iter.toIterator(a);
    var b = [];
    goog.iter.forEach(a, function(a) {
        b.push(a)
    });
    return b
};
goog.iter.equals = function(a, b) {
    var c = goog.iter.zipLongest({}, a, b);
    return goog.iter.every(c, function(a) {
        return a[0] == a[1]
    })
};
goog.iter.nextOrValue = function(a, b) {
    try {
        return goog.iter.toIterator(a).next()
    } catch (c) {
        if (c != goog.iter.StopIteration) throw c;
        return b
    }
};
goog.iter.product = function(a) {
    if (goog.array.some(arguments, function(a) {
            return !a.length
        }) || !arguments.length) return new goog.iter.Iterator;
    var b = new goog.iter.Iterator,
        c = arguments,
        d = goog.array.repeat(0, c.length);
    b.next = function() {
        if (d) {
            for (var a = goog.array.map(d, function(a, b) {
                    return c[b][a]
                }), b = d.length - 1; 0 <= b; b--) {
                goog.asserts.assert(d);
                if (d[b] < c[b].length - 1) {
                    d[b]++;
                    break
                }
                if (0 == b) {
                    d = null;
                    break
                }
                d[b] = 0
            }
            return a
        }
        throw goog.iter.StopIteration;
    };
    return b
};
goog.iter.cycle = function(a) {
    var b = goog.iter.toIterator(a),
        c = [],
        d = 0;
    a = new goog.iter.Iterator;
    var e = !1;
    a.next = function() {
        var a = null;
        if (!e) try {
            return a = b.next(), c.push(a), a
        } catch (g) {
            if (g != goog.iter.StopIteration || goog.array.isEmpty(c)) throw g;
            e = !0
        }
        a = c[d];
        d = (d + 1) % c.length;
        return a
    };
    return a
};
goog.iter.count = function(a, b) {
    var c = a || 0,
        d = goog.isDef(b) ? b : 1,
        e = new goog.iter.Iterator;
    e.next = function() {
        var a = c;
        c += d;
        return a
    };
    return e
};
goog.iter.repeat = function(a) {
    var b = new goog.iter.Iterator;
    b.next = goog.functions.constant(a);
    return b
};
goog.iter.accumulate = function(a) {
    var b = goog.iter.toIterator(a),
        c = 0;
    a = new goog.iter.Iterator;
    a.next = function() {
        return c += b.next()
    };
    return a
};
goog.iter.zip = function(a) {
    var b = arguments,
        c = new goog.iter.Iterator;
    if (0 < b.length) {
        var d = goog.array.map(b, goog.iter.toIterator);
        c.next = function() {
            return goog.array.map(d, function(a) {
                return a.next()
            })
        }
    }
    return c
};
goog.iter.zipLongest = function(a, b) {
    var c = goog.array.slice(arguments, 1),
        d = new goog.iter.Iterator;
    if (0 < c.length) {
        var e = goog.array.map(c, goog.iter.toIterator);
        d.next = function() {
            var b = !1,
                c = goog.array.map(e, function(c) {
                    var d;
                    try {
                        d = c.next(), b = !0
                    } catch (e) {
                        if (e !== goog.iter.StopIteration) throw e;
                        d = a
                    }
                    return d
                });
            if (!b) throw goog.iter.StopIteration;
            return c
        }
    }
    return d
};
goog.iter.compress = function(a, b) {
    var c = goog.iter.toIterator(b);
    return goog.iter.filter(a, function() {
        return !!c.next()
    })
};
goog.iter.GroupByIterator_ = function(a, b) {
    this.iterator = goog.iter.toIterator(a);
    this.keyFunc = b || goog.functions.identity
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
    for (; this.currentKey == this.targetKey;) this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
    this.targetKey = this.currentKey;
    return [this.currentKey, this.groupItems_(this.targetKey)]
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
    for (var b = []; this.currentKey == a;) {
        b.push(this.currentValue);
        try {
            this.currentValue = this.iterator.next()
        } catch (c) {
            if (c !== goog.iter.StopIteration) throw c;
            break
        }
        this.currentKey = this.keyFunc(this.currentValue)
    }
    return b
};
goog.iter.groupBy = function(a, b) {
    return new goog.iter.GroupByIterator_(a, b)
};
goog.iter.starMap = function(a, b, c) {
    var d = goog.iter.toIterator(a);
    a = new goog.iter.Iterator;
    a.next = function() {
        var a = goog.iter.toArray(d.next());
        return b.apply(c, goog.array.concat(a, void 0, d))
    };
    return a
};
goog.iter.tee = function(a, b) {
    var c = goog.iter.toIterator(a),
        d = goog.isNumber(b) ? b : 2,
        e = goog.array.map(goog.array.range(d), function() {
            return []
        }),
        f = function() {
            var a = c.next();
            goog.array.forEach(e, function(b) {
                b.push(a)
            })
        };
    return goog.array.map(e, function(a) {
        var b = new goog.iter.Iterator;
        b.next = function() {
            goog.array.isEmpty(a) && f();
            goog.asserts.assert(!goog.array.isEmpty(a));
            return a.shift()
        };
        return b
    })
};
goog.iter.enumerate = function(a, b) {
    return goog.iter.zip(goog.iter.count(b), a)
};
goog.iter.limit = function(a, b) {
    goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
    var c = goog.iter.toIterator(a),
        d = new goog.iter.Iterator,
        e = b;
    d.next = function() {
        if (0 < e--) return c.next();
        throw goog.iter.StopIteration;
    };
    return d
};
goog.iter.consume = function(a, b) {
    goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
    for (var c = goog.iter.toIterator(a); 0 < b--;) goog.iter.nextOrValue(c, null);
    return c
};
goog.iter.slice = function(a, b, c) {
    goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
    a = goog.iter.consume(a, b);
    goog.isNumber(c) && (goog.asserts.assert(goog.math.isInt(c) && c >= b), a = goog.iter.limit(a, c - b));
    return a
};
goog.iter.hasDuplicates_ = function(a) {
    var b = [];
    goog.array.removeDuplicates(a, b);
    return a.length != b.length
};
goog.iter.permutations = function(a, b) {
    var c = goog.iter.toArray(a),
        d = goog.isNumber(b) ? b : c.length,
        c = goog.array.repeat(c, d),
        c = goog.iter.product.apply(void 0, c);
    return goog.iter.filter(c, function(a) {
        return !goog.iter.hasDuplicates_(a)
    })
};
goog.iter.combinations = function(a, b) {
    function c(a) {
        return d[a]
    }
    var d = goog.iter.toArray(a),
        e = goog.iter.range(d.length),
        e = goog.iter.permutations(e, b),
        f = goog.iter.filter(e, function(a) {
            return goog.array.isSorted(a)
        }),
        e = new goog.iter.Iterator;
    e.next = function() {
        return goog.array.map(f.next(), c)
    };
    return e
};
goog.iter.combinationsWithReplacement = function(a, b) {
    function c(a) {
        return d[a]
    }
    var d = goog.iter.toArray(a),
        e = goog.array.range(d.length),
        e = goog.array.repeat(e, b),
        e = goog.iter.product.apply(void 0, e),
        f = goog.iter.filter(e, function(a) {
            return goog.array.isSorted(a)
        }),
        e = new goog.iter.Iterator;
    e.next = function() {
        return goog.array.map(f.next(), c)
    };
    return e
};
goog.structs = {};
goog.structs.Map = function(a, b) {
    this.map_ = {};
    this.keys_ = [];
    this.version_ = this.count_ = 0;
    var c = arguments.length;
    if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");
        for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
    } else a && this.addAll(a)
};
goog.structs.Map.prototype.getCount = function() {
    return this.count_
};
goog.structs.Map.prototype.getValues = function() {
    this.cleanupKeysArray_();
    for (var a = [], b = 0; b < this.keys_.length; b++) a.push(this.map_[this.keys_[b]]);
    return a
};
goog.structs.Map.prototype.getKeys = function() {
    this.cleanupKeysArray_();
    return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
    return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
    for (var b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        if (goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) return !0
    }
    return !1
};
goog.structs.Map.prototype.equals = function(a, b) {
    if (this === a) return !0;
    if (this.count_ != a.getCount()) return !1;
    var c = b || goog.structs.Map.defaultEquals;
    this.cleanupKeysArray_();
    for (var d, e = 0; d = this.keys_[e]; e++)
        if (!c(this.get(d), a.get(d))) return !1;
    return !0
};
goog.structs.Map.defaultEquals = function(a, b) {
    return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
    return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
    this.map_ = {};
    this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
    return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
    if (this.count_ != this.keys_.length) {
        for (var a = 0, b = 0; a < this.keys_.length;) {
            var c = this.keys_[a];
            goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
            a++
        }
        this.keys_.length = b
    }
    if (this.count_ != this.keys_.length) {
        for (var d = {}, b = a = 0; a < this.keys_.length;) c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++;
        this.keys_.length = b
    }
};
goog.structs.Map.prototype.get = function(a, b) {
    return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b
};
goog.structs.Map.prototype.set = function(a, b) {
    goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
    this.map_[a] = b
};
goog.structs.Map.prototype.addAll = function(a) {
    var b;
    a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
    for (var c = 0; c < b.length; c++) this.set(b[c], a[c])
};
goog.structs.Map.prototype.forEach = function(a, b) {
    for (var c = this.getKeys(), d = 0; d < c.length; d++) {
        var e = c[d],
            f = this.get(e);
        a.call(b, f, e, this)
    }
};
goog.structs.Map.prototype.clone = function() {
    return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
    for (var a = new goog.structs.Map, b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        a.set(this.map_[c], c)
    }
    return a
};
goog.structs.Map.prototype.toObject = function() {
    this.cleanupKeysArray_();
    for (var a = {}, b = 0; b < this.keys_.length; b++) {
        var c = this.keys_[b];
        a[c] = this.map_[c]
    }
    return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
    return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
    return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
    this.cleanupKeysArray_();
    var b = 0,
        c = this.keys_,
        d = this.map_,
        e = this.version_,
        f = this,
        g = new goog.iter.Iterator;
    g.next = function() {
        for (;;) {
            if (e != f.version_) throw Error("The map has changed since the iterator was created");
            if (b >= c.length) throw goog.iter.StopIteration;
            var g = c[b++];
            return a ? g : d[g]
        }
    };
    return g
};
goog.structs.Map.hasKey_ = function(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
};
goog.structs.getCount = function(a) {
    return "function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
    if ("function" == typeof a.getValues) return a.getValues();
    if (goog.isString(a)) return a.split("");
    if (goog.isArrayLike(a)) {
        for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
        return b
    }
    return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
    if ("function" == typeof a.getKeys) return a.getKeys();
    if ("function" != typeof a.getValues) {
        if (goog.isArrayLike(a) || goog.isString(a)) {
            var b = [];
            a = a.length;
            for (var c = 0; c < a; c++) b.push(c);
            return b
        }
        return goog.object.getKeys(a)
    }
};
goog.structs.contains = function(a, b) {
    return "function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
    return "function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
    "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
    if ("function" == typeof a.forEach) a.forEach(b, c);
    else if (goog.isArrayLike(a) || goog.isString(a)) goog.array.forEach(a, b, c);
    else
        for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) b.call(c, e[g], d && d[g], a)
};
goog.structs.filter = function(a, b, c) {
    if ("function" == typeof a.filter) return a.filter(b, c);
    if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.filter(a, b, c);
    var d, e = goog.structs.getKeys(a),
        f = goog.structs.getValues(a),
        g = f.length;
    if (e) {
        d = {};
        for (var h = 0; h < g; h++) b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    } else
        for (d = [], h = 0; h < g; h++) b.call(c, f[h], void 0, a) && d.push(f[h]);
    return d
};
goog.structs.map = function(a, b, c) {
    if ("function" == typeof a.map) return a.map(b, c);
    if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.map(a, b, c);
    var d, e = goog.structs.getKeys(a),
        f = goog.structs.getValues(a),
        g = f.length;
    if (e) {
        d = {};
        for (var h = 0; h < g; h++) d[e[h]] = b.call(c, f[h], e[h], a)
    } else
        for (d = [], h = 0; h < g; h++) d[h] = b.call(c, f[h], void 0, a);
    return d
};
goog.structs.some = function(a, b, c) {
    if ("function" == typeof a.some) return a.some(b, c);
    if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.some(a, b, c);
    for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++)
        if (b.call(c, e[g], d && d[g], a)) return !0;
    return !1
};
goog.structs.every = function(a, b, c) {
    if ("function" == typeof a.every) return a.every(b, c);
    if (goog.isArrayLike(a) || goog.isString(a)) return goog.array.every(a, b, c);
    for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++)
        if (!b.call(c, e[g], d && d[g], a)) return !1;
    return !0
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
    var a = goog.labs.userAgent.util.getNavigator_();
    return a && (a = a.userAgent) ? a : ""
};
goog.labs.userAgent.util.getNavigator_ = function() {
    return goog.global.navigator
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
    goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_()
};
goog.labs.userAgent.util.getUserAgent = function() {
    return goog.labs.userAgent.util.userAgent_
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
    var b = goog.labs.userAgent.util.getUserAgent();
    return goog.string.contains(b, a)
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
    var b = goog.labs.userAgent.util.getUserAgent();
    return goog.string.caseInsensitiveContains(b, a)
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
    for (var b = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), c = [], d; d = b.exec(a);) c.push([d[1], d[2], d[3] || void 0]);
    return c
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
};
goog.labs.userAgent.browser.matchIE_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Firefox")
};
goog.labs.userAgent.browser.matchSafari_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android")
};
goog.labs.userAgent.browser.matchChrome_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
    return goog.labs.userAgent.util.matchUserAgent("Silk")
};
goog.labs.userAgent.browser.getVersion = function() {
    var a = goog.labs.userAgent.util.getUserAgent();
    if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(a);
    if (goog.labs.userAgent.browser.isOpera()) return goog.labs.userAgent.browser.getOperaVersion_(a);
    a = goog.labs.userAgent.util.extractVersionTuples(a);
    return goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a)
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
    var b = /rv: *([\d\.]*)/.exec(a);
    if (b && b[1]) return b[1];
    var b = "",
        c = /MSIE +([\d\.]+)/.exec(a);
    if (c && c[1])
        if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1])
            if (a && a[1]) switch (a[1]) {
                case "4.0":
                    b = "8.0";
                    break;
                case "5.0":
                    b = "9.0";
                    break;
                case "6.0":
                    b = "10.0";
                    break;
                case "7.0":
                    b = "11.0"
            } else b = "7.0";
            else b = c[1];
    return b
};
goog.labs.userAgent.browser.getOperaVersion_ = function(a) {
    a = goog.labs.userAgent.util.extractVersionTuples(a);
    var b = goog.array.peek(a);
    return "OPR" == b[0] && b[1] ? b[1] : goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(a) {
    goog.asserts.assert(2 < a.length, "Couldn't extract version tuple from user agent string");
    return a[2] && a[2][1] ? a[2][1] : ""
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
    return goog.labs.userAgent.util.matchUserAgent("Presto")
};
goog.labs.userAgent.engine.isTrident = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.engine.isWebKit = function() {
    return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")
};
goog.labs.userAgent.engine.isGecko = function() {
    return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident()
};
goog.labs.userAgent.engine.getVersion = function() {
    var a = goog.labs.userAgent.util.getUserAgent();
    if (a) {
        var a = goog.labs.userAgent.util.extractVersionTuples(a),
            b = a[1];
        if (b) return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
        var a = a[0],
            c;
        if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) return c[1]
    }
    return ""
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a)
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
    var c = goog.array.find(a, function(a) {
        return b == a[0]
    });
    return c && c[1] || ""
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
    return goog.labs.userAgent.util.getUserAgent()
};
goog.userAgent.getNavigator = function() {
    return goog.global.navigator || null
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
    return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
    var a = goog.userAgent.getNavigator();
    return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
    goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
    goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
    goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
    goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
    var a = goog.userAgent.getUserAgentString();
    goog.userAgent.detectedAndroid_ = !!a &&
        goog.string.contains(a, "Android");
    goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
    goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
    var a = "",
        b;
    if (goog.userAgent.OPERA && goog.global.opera) return a = goog.global.opera.version, goog.isFunction(a) ? a() : a;
    goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/);
    b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : "");
    return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
    var a = goog.global.document;
    return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
    return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
    return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
    return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
    var a = goog.global.document;
    return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {
    AMPERSAND: 38,
    EQUAL: 61,
    HASH: 35,
    QUESTION: 63
};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
    var h = "";
    a && (h += a + ":");
    c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
    e && (h += e);
    f && (h += "?" + f);
    g && (h += "#" + g);
    return h
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
};
goog.uri.utils.split = function(a) {
    goog.uri.utils.phishingProtection_();
    return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
    if (goog.uri.utils.needsPhishingProtection_) {
        goog.uri.utils.needsPhishingProtection_ = !1;
        var a = goog.global.location;
        if (a) {
            var b = a.href;
            if (b && (b = goog.uri.utils.getDomain(b)) && b != a.hostname) throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
        }
    }
};
goog.uri.utils.decodeIfPossible_ = function(a) {
    return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
    return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getEffectiveScheme = function(a) {
    a = goog.uri.utils.getScheme(a);
    !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
    return a ? a.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
    return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
    var b = a.indexOf("#");
    return 0 > b ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
    return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
    a = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
    a = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
    var b = a.indexOf("#");
    return 0 > b ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
    var c = goog.uri.utils.split(a),
        d = goog.uri.utils.split(b);
    return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
    if (goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
};
goog.uri.utils.appendQueryData_ = function(a) {
    if (a[1]) {
        var b = a[0],
            c = b.indexOf("#");
        0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
        c = b.indexOf("?");
        0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
    }
    return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
    if (goog.isArray(b)) {
        goog.asserts.assertArray(b);
        for (var d = 0; d < b.length; d++) goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c)
    } else null != b && c.push("&", a, "" === b ? "" : "=", goog.string.urlEncode(b))
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
    goog.asserts.assert(0 == Math.max(b.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
    for (c = c || 0; c < b.length; c += 2) goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a);
    return a
};
goog.uri.utils.buildQueryData = function(a, b) {
    var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
    c[0] = "";
    return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
    for (var c in b) goog.uri.utils.appendKeyValuePairs_(c, b[c], a);
    return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
    a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
    a[0] = "";
    return a.join("")
};
goog.uri.utils.appendParams = function(a, b) {
    return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
    return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
    a = [a, "&", b];
    goog.isDefAndNotNull(c) && a.push("=", goog.string.urlEncode(c));
    return goog.uri.utils.appendQueryData_(a)
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
    for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
        var f = a.charCodeAt(b - 1);
        if (f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION)
            if (f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) return b;
        b += e + 1
    }
    return -1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
    return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_))
};
goog.uri.utils.getParamValue = function(a, b) {
    var c = a.search(goog.uri.utils.hashOrEndRe_),
        d = goog.uri.utils.findParam_(a, 0, b, c);
    if (0 > d) return null;
    var e = a.indexOf("&", d);
    if (0 > e || e > c) e = c;
    d += b.length + 1;
    return goog.string.urlDecode(a.substr(d, e - d))
};
goog.uri.utils.getParamValues = function(a, b) {
    for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
        d = a.indexOf("&", e);
        if (0 > d || d > c) d = c;
        e += b.length + 1;
        f.push(goog.string.urlDecode(a.substr(e, d - e)))
    }
    return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
    for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c);
    f.push(a.substr(d));
    return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
    return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
    goog.uri.utils.assertNoFragmentsOrQueries_(a);
    goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
    goog.string.startsWith(b, "/") && (b = b.substr(1));
    return goog.string.buildString(a, "/", b)
};
goog.uri.utils.setPath = function(a, b) {
    goog.string.startsWith(b, "/") || (b = "/" + b);
    var c = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(c[goog.uri.utils.ComponentIndex.SCHEME], c[goog.uri.utils.ComponentIndex.USER_INFO], c[goog.uri.utils.ComponentIndex.DOMAIN], c[goog.uri.utils.ComponentIndex.PORT], b, c[goog.uri.utils.ComponentIndex.QUERY_DATA], c[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.StandardQueryParam = {
    RANDOM: "zx"
};
goog.uri.utils.makeUnique = function(a) {
    return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.Uri = function(a, b) {
    var c;
    a instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(b) ? b : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.ignoreCase_ = !!b, this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] ||
        "", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!b, this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_))
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
    var a = [],
        b = this.getScheme();
    b && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
    if (b = this.getDomain()) {
        a.push("//");
        var c = this.getUserInfo();
        c && a.push(goog.Uri.encodeSpecialChars_(c, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
        a.push(goog.string.urlEncode(b));
        b = this.getPort();
        null != b && a.push(":", String(b))
    }
    if (b = this.getPath()) this.hasDomain() && "/" != b.charAt(0) && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(b, "/" == b.charAt(0) ?
        goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_));
    (b = this.getEncodedQuery()) && a.push("?", b);
    (b = this.getFragment()) && a.push("#", goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInFragment_));
    return a.join("")
};
goog.Uri.prototype.resolve = function(a) {
    var b = this.clone(),
        c = a.hasScheme();
    c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
    c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
    c ? b.setDomain(a.getDomain()) : c = a.hasPort();
    var d = a.getPath();
    if (c) b.setPort(a.getPort());
    else if (c = a.hasPath()) {
        if ("/" != d.charAt(0))
            if (this.hasDomain() && !this.hasPath()) d = "/" + d;
            else {
                var e = b.getPath().lastIndexOf("/"); - 1 != e && (d = b.getPath().substr(0, e + 1) + d)
            }
        d = goog.Uri.removeDotSegments(d)
    }
    c ? b.setPath(d) : c = a.hasQuery();
    c ? b.setQueryData(a.getDecodedQuery()) :
        c = a.hasFragment();
    c && b.setFragment(a.getFragment());
    return b
};
goog.Uri.prototype.clone = function() {
    return new goog.Uri(this)
};
goog.Uri.prototype.getScheme = function() {
    return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
    this.enforceReadOnly();
    if (this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) this.scheme_ = this.scheme_.replace(/:$/, "");
    return this
};
goog.Uri.prototype.hasScheme = function() {
    return !!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
    return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
    this.enforceReadOnly();
    this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
    return this
};
goog.Uri.prototype.hasUserInfo = function() {
    return !!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
    return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
    this.enforceReadOnly();
    this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
    return this
};
goog.Uri.prototype.hasDomain = function() {
    return !!this.domain_
};
goog.Uri.prototype.getPort = function() {
    return this.port_
};
goog.Uri.prototype.setPort = function(a) {
    this.enforceReadOnly();
    if (a) {
        a = Number(a);
        if (isNaN(a) || 0 > a) throw Error("Bad port number " + a);
        this.port_ = a
    } else this.port_ = null;
    return this
};
goog.Uri.prototype.hasPort = function() {
    return null != this.port_
};
goog.Uri.prototype.getPath = function() {
    return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
    this.enforceReadOnly();
    this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
    return this
};
goog.Uri.prototype.hasPath = function() {
    return !!this.path_
};
goog.Uri.prototype.hasQuery = function() {
    return "" !== this.queryData_.toString()
};
goog.Uri.prototype.setQueryData = function(a, b) {
    this.enforceReadOnly();
    a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, null, this.ignoreCase_));
    return this
};
goog.Uri.prototype.setQuery = function(a, b) {
    return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
    return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
    return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
    return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
    return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
    this.enforceReadOnly();
    this.queryData_.set(a, b);
    return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
    this.enforceReadOnly();
    goog.isArray(b) || (b = [String(b)]);
    this.queryData_.setValues(a, b);
    return this
};
goog.Uri.prototype.getParameterValues = function(a) {
    return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
    return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
    return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
    this.enforceReadOnly();
    this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
    return this
};
goog.Uri.prototype.hasFragment = function() {
    return !!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
    return (!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
    this.enforceReadOnly();
    this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
    return this
};
goog.Uri.prototype.removeParameter = function(a) {
    this.enforceReadOnly();
    this.queryData_.remove(a);
    return this
};
goog.Uri.prototype.setReadOnly = function(a) {
    this.isReadOnly_ = a;
    return this
};
goog.Uri.prototype.isReadOnly = function() {
    return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
    if (this.isReadOnly_) throw Error("Tried to modify a read-only Uri");
};
goog.Uri.prototype.setIgnoreCase = function(a) {
    this.ignoreCase_ = a;
    this.queryData_ && this.queryData_.setIgnoreCase(a);
    return this
};
goog.Uri.prototype.getIgnoreCase = function() {
    return this.ignoreCase_
};
goog.Uri.parse = function(a, b) {
    return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
    h = new goog.Uri(null, h);
    a && h.setScheme(a);
    b && h.setUserInfo(b);
    c && h.setDomain(c);
    d && h.setPort(d);
    e && h.setPath(e);
    f && h.setQueryData(f);
    g && h.setFragment(g);
    return h
};
goog.Uri.resolve = function(a, b) {
    a instanceof goog.Uri || (a = goog.Uri.parse(a));
    b instanceof goog.Uri || (b = goog.Uri.parse(b));
    return a.resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
    if (".." == a || "." == a) return "";
    if (goog.string.contains(a, "./") || goog.string.contains(a, "/.")) {
        var b = goog.string.startsWith(a, "/");
        a = a.split("/");
        for (var c = [], d = 0; d < a.length;) {
            var e = a[d++];
            "." == e ? b && d == a.length && c.push("") : ".." == e ? ((1 < c.length || 1 == c.length && "" != c[0]) && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0)
        }
        return c.join("/")
    }
    return a
};
goog.Uri.decodeOrEmpty_ = function(a) {
    return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeSpecialChars_ = function(a, b) {
    return goog.isString(a) ? encodeURI(a).replace(b, goog.Uri.encodeChar_) : null
};
goog.Uri.encodeChar_ = function(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
    var c = goog.uri.utils.split(a),
        d = goog.uri.utils.split(b);
    return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
    this.encodedQuery_ = a || null;
    this.ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
    if (!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_))
        for (var a = this.encodedQuery_.split("&"), b = 0; b < a.length; b++) {
            var c = a[b].indexOf("="),
                d = null,
                e = null;
            0 <= c ? (d = a[b].substring(0, c), e = a[b].substring(c + 1)) : d = a[b];
            d = goog.string.urlDecode(d);
            d = this.getKeyName_(d);
            this.add(d, e ? goog.string.urlDecode(e) : "")
        }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
    b = goog.structs.getKeys(a);
    if ("undefined" == typeof b) throw Error("Keys are undefined");
    c = new goog.Uri.QueryData(null, null, c);
    a = goog.structs.getValues(a);
    for (var d = 0; d < b.length; d++) {
        var e = b[d],
            f = a[d];
        goog.isArray(f) ? c.setValues(e, f) : c.add(e, f)
    }
    return c
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
    if (a.length != b.length) throw Error("Mismatched lengths for keys/values");
    c = new goog.Uri.QueryData(null, null, d);
    for (d = 0; d < a.length; d++) c.add(a[d], b[d]);
    return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
    this.ensureKeyMapInitialized_();
    return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    a = this.getKeyName_(a);
    var c = this.keyMap_.get(a);
    c || this.keyMap_.set(a, c = []);
    c.push(b);
    this.count_++;
    return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
    this.ensureKeyMapInitialized_();
    a = this.getKeyName_(a);
    return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1
};
goog.Uri.QueryData.prototype.clear = function() {
    this.invalidateCache_();
    this.keyMap_ = null;
    this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
    this.ensureKeyMapInitialized_();
    return 0 == this.count_
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
    this.ensureKeyMapInitialized_();
    a = this.getKeyName_(a);
    return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
    var b = this.getValues();
    return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
    this.ensureKeyMapInitialized_();
    for (var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0; d < b.length; d++)
        for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
    return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
    this.ensureKeyMapInitialized_();
    var b = [];
    if (goog.isString(a)) this.containsKey(a) && (b = goog.array.concat(b, this.keyMap_.get(this.getKeyName_(a))));
    else {
        a = this.keyMap_.getValues();
        for (var c = 0; c < a.length; c++) b = goog.array.concat(b, a[c])
    }
    return b
};
goog.Uri.QueryData.prototype.set = function(a, b) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    a = this.getKeyName_(a);
    this.containsKey(a) && (this.count_ -= this.keyMap_.get(a).length);
    this.keyMap_.set(a, [b]);
    this.count_++;
    return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
    var c = a ? this.getValues(a) : [];
    return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < c.length ? c[0] : b : 0 < c.length ? String(c[0]) : b
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
    this.remove(a);
    0 < b.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), goog.array.clone(b)), this.count_ += b.length)
};
goog.Uri.QueryData.prototype.toString = function() {
    if (this.encodedQuery_) return this.encodedQuery_;
    if (!this.keyMap_) return "";
    for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++)
        for (var d = b[c], e = goog.string.urlEncode(d), d = this.getValues(d), f = 0; f < d.length; f++) {
            var g = e;
            "" !== d[f] && (g += "=" + goog.string.urlEncode(d[f]));
            a.push(g)
        }
    return this.encodedQuery_ = a.join("&")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
    return goog.Uri.decodeOrEmpty_(this.toString())
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
    this.encodedQuery_ = null
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
    this.ensureKeyMapInitialized_();
    this.keyMap_.forEach(function(b, c) {
        goog.array.contains(a, c) || this.remove(c)
    }, this);
    return this
};
goog.Uri.QueryData.prototype.clone = function() {
    var a = new goog.Uri.QueryData;
    a.encodedQuery_ = this.encodedQuery_;
    this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this.count_);
    return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
    a = String(a);
    this.ignoreCase_ && (a = a.toLowerCase());
    return a
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
    a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(a, c) {
        var d = c.toLowerCase();
        c != d && (this.remove(c), this.setValues(d, a))
    }, this));
    this.ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function(a) {
    for (var b = 0; b < arguments.length; b++) goog.structs.forEach(arguments[b], function(a, b) {
        this.add(b, a)
    }, this)
};
goog.math.Coordinate = function(a, b) {
    this.x = goog.isDef(a) ? a : 0;
    this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
    return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
    return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
    return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
    return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this
};
goog.math.Coordinate.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this
};
goog.math.Coordinate.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
    return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.x *= a;
    this.y *= c;
    return this
};
goog.math.Coordinate.prototype.rotateRadians = function(a, b) {
    var c = b || new goog.math.Coordinate(0, 0),
        d = this.x,
        e = this.y,
        f = Math.cos(a),
        g = Math.sin(a);
    this.x = (d - c.x) * f - (e - c.y) * g + c.x;
    this.y = (d - c.x) * g + (e - c.y) * f + c.y
};
goog.math.Coordinate.prototype.rotateDegrees = function(a, b) {
    this.rotateRadians(goog.math.toRadians(a), b)
};
goog.math.Size = function(a, b) {
    this.width = a;
    this.height = b
};
goog.math.Size.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
    return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
    return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
};
goog.math.Size.prototype.ceil = function() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Size.prototype.fitsInside = function(a) {
    return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Size.prototype.round = function() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Size.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.width *= a;
    this.height *= c;
    return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
    a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
    return this.scale(a)
};
goog.dom.BrowserFeature = {
    CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"),
    CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    CAN_USE_PARENT_ELEMENT_PROPERTY: goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT,
    INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE
};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
    a.className = b
};
goog.dom.classes.get = function(a) {
    a = a.className;
    return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
    var c = goog.dom.classes.get(a),
        d = goog.array.slice(arguments, 1),
        e = c.length + d.length;
    goog.dom.classes.add_(c, d);
    goog.dom.classes.set(a, c.join(" "));
    return c.length == e
};
goog.dom.classes.remove = function(a, b) {
    var c = goog.dom.classes.get(a),
        d = goog.array.slice(arguments, 1),
        e = goog.dom.classes.getDifference_(c, d);
    goog.dom.classes.set(a, e.join(" "));
    return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
    for (var c = 0; c < b.length; c++) goog.array.contains(a, b[c]) || a.push(b[c])
};
goog.dom.classes.getDifference_ = function(a, b) {
    return goog.array.filter(a, function(a) {
        return !goog.array.contains(b, a)
    })
};
goog.dom.classes.swap = function(a, b, c) {
    for (var d = goog.dom.classes.get(a), e = !1, f = 0; f < d.length; f++) d[f] == b && (goog.array.splice(d, f--, 1), e = !0);
    e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
    return e
};
goog.dom.classes.addRemove = function(a, b, c) {
    var d = goog.dom.classes.get(a);
    goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
    goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
    goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
    return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
    c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
    var c = !goog.dom.classes.has(a, b);
    goog.dom.classes.enable(a, b, c);
    return c
};
goog.dom.TagName = {
    A: "A",
    ABBR: "ABBR",
    ACRONYM: "ACRONYM",
    ADDRESS: "ADDRESS",
    APPLET: "APPLET",
    AREA: "AREA",
    ARTICLE: "ARTICLE",
    ASIDE: "ASIDE",
    AUDIO: "AUDIO",
    B: "B",
    BASE: "BASE",
    BASEFONT: "BASEFONT",
    BDI: "BDI",
    BDO: "BDO",
    BIG: "BIG",
    BLOCKQUOTE: "BLOCKQUOTE",
    BODY: "BODY",
    BR: "BR",
    BUTTON: "BUTTON",
    CANVAS: "CANVAS",
    CAPTION: "CAPTION",
    CENTER: "CENTER",
    CITE: "CITE",
    CODE: "CODE",
    COL: "COL",
    COLGROUP: "COLGROUP",
    COMMAND: "COMMAND",
    DATA: "DATA",
    DATALIST: "DATALIST",
    DD: "DD",
    DEL: "DEL",
    DETAILS: "DETAILS",
    DFN: "DFN",
    DIALOG: "DIALOG",
    DIR: "DIR",
    DIV: "DIV",
    DL: "DL",
    DT: "DT",
    EM: "EM",
    EMBED: "EMBED",
    FIELDSET: "FIELDSET",
    FIGCAPTION: "FIGCAPTION",
    FIGURE: "FIGURE",
    FONT: "FONT",
    FOOTER: "FOOTER",
    FORM: "FORM",
    FRAME: "FRAME",
    FRAMESET: "FRAMESET",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    HEAD: "HEAD",
    HEADER: "HEADER",
    HGROUP: "HGROUP",
    HR: "HR",
    HTML: "HTML",
    I: "I",
    IFRAME: "IFRAME",
    IMG: "IMG",
    INPUT: "INPUT",
    INS: "INS",
    ISINDEX: "ISINDEX",
    KBD: "KBD",
    KEYGEN: "KEYGEN",
    LABEL: "LABEL",
    LEGEND: "LEGEND",
    LI: "LI",
    LINK: "LINK",
    MAP: "MAP",
    MARK: "MARK",
    MATH: "MATH",
    MENU: "MENU",
    META: "META",
    METER: "METER",
    NAV: "NAV",
    NOFRAMES: "NOFRAMES",
    NOSCRIPT: "NOSCRIPT",
    OBJECT: "OBJECT",
    OL: "OL",
    OPTGROUP: "OPTGROUP",
    OPTION: "OPTION",
    OUTPUT: "OUTPUT",
    P: "P",
    PARAM: "PARAM",
    PRE: "PRE",
    PROGRESS: "PROGRESS",
    Q: "Q",
    RP: "RP",
    RT: "RT",
    RUBY: "RUBY",
    S: "S",
    SAMP: "SAMP",
    SCRIPT: "SCRIPT",
    SECTION: "SECTION",
    SELECT: "SELECT",
    SMALL: "SMALL",
    SOURCE: "SOURCE",
    SPAN: "SPAN",
    STRIKE: "STRIKE",
    STRONG: "STRONG",
    STYLE: "STYLE",
    SUB: "SUB",
    SUMMARY: "SUMMARY",
    SUP: "SUP",
    SVG: "SVG",
    TABLE: "TABLE",
    TBODY: "TBODY",
    TD: "TD",
    TEXTAREA: "TEXTAREA",
    TFOOT: "TFOOT",
    TH: "TH",
    THEAD: "THEAD",
    TIME: "TIME",
    TITLE: "TITLE",
    TR: "TR",
    TRACK: "TRACK",
    TT: "TT",
    U: "U",
    UL: "UL",
    VAR: "VAR",
    VIDEO: "VIDEO",
    WBR: "WBR"
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
    return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
    return document
};
goog.dom.getElement = function(a) {
    return goog.dom.getElementHelper_(document, a)
};
goog.dom.getElementHelper_ = function(a, b) {
    return goog.isString(b) ? a.getElementById(b) : b
};
goog.dom.getRequiredElement = function(a) {
    return goog.dom.getRequiredElementHelper_(document, a)
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
    goog.asserts.assertString(b);
    var c = goog.dom.getElementHelper_(a, b);
    return c = goog.asserts.assertElement(c, "No element found with id: " + b)
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
    var c = b || document;
    return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
    var c = b || document,
        d = null;
    return (d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)[0]) || null
};
goog.dom.getRequiredElementByClass = function(a, b) {
    var c = goog.dom.getElementByClass(a, b);
    return goog.asserts.assert(c, "No element found with className: " + a)
};
goog.dom.canUseQuerySelector_ = function(a) {
    return !(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
    a = d || a;
    b = b && "*" != b ? b.toUpperCase() : "";
    if (goog.dom.canUseQuerySelector_(a) && (b || c)) return a.querySelectorAll(b + (c ? "." + c : ""));
    if (c && a.getElementsByClassName) {
        a = a.getElementsByClassName(c);
        if (b) {
            d = {};
            for (var e = 0, f = 0, g; g = a[f]; f++) b == g.nodeName && (d[e++] = g);
            d.length = e;
            return d
        }
        return a
    }
    a = a.getElementsByTagName(b || "*");
    if (c) {
        d = {};
        for (f = e = 0; g = a[f]; f++) b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g);
        d.length =
            e;
        return d
    }
    return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
    goog.object.forEach(b, function(b, d) {
        "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
    })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    frameborder: "frameBorder",
    height: "height",
    maxlength: "maxLength",
    role: "role",
    rowspan: "rowSpan",
    type: "type",
    usemap: "useMap",
    valign: "vAlign",
    width: "width"
};
goog.dom.getViewportSize = function(a) {
    return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
    a = a.document;
    a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
    return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
    var b = a.document,
        c = 0;
    if (b) {
        var c = b.body,
            d = b.documentElement;
        if (!c && !d) return 0;
        a = goog.dom.getViewportSize_(a).height;
        if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
        else {
            var b = d.scrollHeight,
                e = d.offsetHeight;
            d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
            c = b > a ? b > e ? b : e : b < e ? b : e
        }
    }
    return c
};
goog.dom.getPageScroll = function(a) {
    return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
    var b = goog.dom.getDocumentScrollElement_(a);
    a = goog.dom.getWindow_(a);
    return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
    return !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement
};
goog.dom.getWindow = function(a) {
    return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
    return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
    return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
    var c = b[0],
        d = b[1];
    if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
        c = ["<", c];
        d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
        if (d.type) {
            c.push(' type="', goog.string.htmlEscape(d.type), '"');
            var e = {};
            goog.object.extend(e, d);
            delete e.type;
            d = e
        }
        c.push(">");
        c = c.join("")
    }
    c = a.createElement(c);
    d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? c.className = d.join(" ") : goog.dom.setProperties(c, d));
    2 < b.length && goog.dom.append_(a,
        c, b, 2);
    return c
};
goog.dom.append_ = function(a, b, c, d) {
    function e(c) {
        c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
    }
    for (; d < c.length; d++) {
        var f = c[d];
        goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
    }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
    return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
    return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
    return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
    for (var e = ["<tr>"], f = 0; f < c; f++) e.push(d ? "<td>&nbsp;</td>" : "<td></td>");
    e.push("</tr>");
    e = e.join("");
    c = ["<table>"];
    for (f = 0; f < b; f++) c.push(e);
    c.push("</table>");
    a = a.createElement(goog.dom.TagName.DIV);
    a.innerHTML = c.join("");
    return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
    var c = a.createElement("div");
    goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
    if (1 == c.childNodes.length) return c.removeChild(c.firstChild);
    for (var d = a.createDocumentFragment(); c.firstChild;) d.appendChild(c.firstChild);
    return d
};
goog.dom.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
    return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
    if (a.nodeType != goog.dom.NodeType.ELEMENT) return !1;
    switch (a.tagName) {
        case goog.dom.TagName.APPLET:
        case goog.dom.TagName.AREA:
        case goog.dom.TagName.BASE:
        case goog.dom.TagName.BR:
        case goog.dom.TagName.COL:
        case goog.dom.TagName.COMMAND:
        case goog.dom.TagName.EMBED:
        case goog.dom.TagName.FRAME:
        case goog.dom.TagName.HR:
        case goog.dom.TagName.IMG:
        case goog.dom.TagName.INPUT:
        case goog.dom.TagName.IFRAME:
        case goog.dom.TagName.ISINDEX:
        case goog.dom.TagName.KEYGEN:
        case goog.dom.TagName.LINK:
        case goog.dom.TagName.NOFRAMES:
        case goog.dom.TagName.NOSCRIPT:
        case goog.dom.TagName.META:
        case goog.dom.TagName.OBJECT:
        case goog.dom.TagName.PARAM:
        case goog.dom.TagName.SCRIPT:
        case goog.dom.TagName.SOURCE:
        case goog.dom.TagName.STYLE:
        case goog.dom.TagName.TRACK:
        case goog.dom.TagName.WBR:
            return !1
    }
    return !0
};
goog.dom.appendChild = function(a, b) {
    a.appendChild(b)
};
goog.dom.append = function(a, b) {
    goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
    for (var b; b = a.firstChild;) a.removeChild(b)
};
goog.dom.insertSiblingBefore = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
    a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
    return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
    var c = b.parentNode;
    c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
    var b, c = a.parentNode;
    if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
        if (a.removeNode) return a.removeNode(!1);
        for (; b = a.firstChild;) c.insertBefore(b, a);
        return goog.dom.removeNode(a)
    }
};
goog.dom.getChildren = function(a) {
    return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
        return a.nodeType == goog.dom.NodeType.ELEMENT
    })
};
goog.dom.getFirstElementChild = function(a) {
    return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
    return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
    return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
    return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
    for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) a = b ? a.nextSibling : a.previousSibling;
    return a
};
goog.dom.getNextNode = function(a) {
    if (!a) return null;
    if (a.firstChild) return a.firstChild;
    for (; a && !a.nextSibling;) a = a.parentNode;
    return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
    if (!a) return null;
    if (!a.previousSibling) return a.parentNode;
    for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
    return a
};
goog.dom.isNodeLike = function(a) {
    return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
    return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
    return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
    var b;
    if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement) && (b = a.parentElement)) return b;
    b = a.parentNode;
    return goog.dom.isElement(b) ? b : null
};
goog.dom.contains = function(a, b) {
    if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) return a == b || a.contains(b);
    if ("undefined" != typeof a.compareDocumentPosition) return a == b || Boolean(a.compareDocumentPosition(b) & 16);
    for (; b && a != b;) b = b.parentNode;
    return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
    if (a == b) return 0;
    if (a.compareDocumentPosition) return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        if (a.nodeType == goog.dom.NodeType.DOCUMENT) return -1;
        if (b.nodeType == goog.dom.NodeType.DOCUMENT) return 1
    }
    if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
        var c = a.nodeType == goog.dom.NodeType.ELEMENT,
            d = b.nodeType == goog.dom.NodeType.ELEMENT;
        if (c && d) return a.sourceIndex - b.sourceIndex;
        var e = a.parentNode,
            f = b.parentNode;
        return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
    }
    d = goog.dom.getOwnerDocument(a);
    c = d.createRange();
    c.selectNode(a);
    c.collapse(!0);
    d = d.createRange();
    d.selectNode(b);
    d.collapse(!0);
    return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
    var c = a.parentNode;
    if (c == b) return -1;
    for (var d = b; d.parentNode != c;) d = d.parentNode;
    return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
    for (var c = b; c = c.previousSibling;)
        if (c == a) return -1;
    return 1
};
goog.dom.findCommonAncestor = function(a) {
    var b, c = arguments.length;
    if (!c) return null;
    if (1 == c) return arguments[0];
    var d = [],
        e = Infinity;
    for (b = 0; b < c; b++) {
        for (var f = [], g = arguments[b]; g;) f.unshift(g), g = g.parentNode;
        d.push(f);
        e = Math.min(e, f.length)
    }
    f = null;
    for (b = 0; b < e; b++) {
        for (var g = d[0][b], h = 1; h < c; h++)
            if (g != d[h][b]) return f;
        f = g
    }
    return f
};
goog.dom.getOwnerDocument = function(a) {
    goog.asserts.assert(a, "Node cannot be null or undefined.");
    return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
    return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
    return a.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
    goog.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
    if ("textContent" in a) a.textContent = b;
    else if (a.nodeType == goog.dom.NodeType.TEXT) a.data = b;
    else if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
        a.firstChild.data = b
    } else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)))
    }
};
goog.dom.getOuterHtml = function(a) {
    if ("outerHTML" in a) return a.outerHTML;
    var b = goog.dom.getOwnerDocument(a).createElement("div");
    b.appendChild(a.cloneNode(!0));
    return b.innerHTML
};
goog.dom.findNode = function(a, b) {
    var c = [];
    return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
    var c = [];
    goog.dom.findNodes_(a, b, c, !1);
    return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
    if (null != a)
        for (a = a.firstChild; a;) {
            if (b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) return !0;
            a = a.nextSibling
        }
    return !1
};
goog.dom.TAGS_TO_IGNORE_ = {
    SCRIPT: 1,
    STYLE: 1,
    HEAD: 1,
    IFRAME: 1,
    OBJECT: 1
};
goog.dom.PREDEFINED_TAG_VALUES_ = {
    IMG: " ",
    BR: "\n"
};
goog.dom.isFocusableTabIndex = function(a) {
    return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a)
};
goog.dom.setFocusableTabIndex = function(a, b) {
    b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.isFocusable = function(a) {
    var b;
    return (b = goog.dom.nativelySupportsFocus_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
    a = a.getAttributeNode("tabindex");
    return goog.isDefAndNotNull(a) && a.specified
};
goog.dom.isTabIndexFocusable_ = function(a) {
    a = a.tabIndex;
    return goog.isNumber(a) && 0 <= a && 32768 > a
};
goog.dom.nativelySupportsFocus_ = function(a) {
    return a.tagName == goog.dom.TagName.A || a.tagName == goog.dom.TagName.INPUT || a.tagName == goog.dom.TagName.TEXTAREA || a.tagName == goog.dom.TagName.SELECT || a.tagName == goog.dom.TagName.BUTTON
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
    a = goog.isFunction(a.getBoundingClientRect) ? a.getBoundingClientRect() : {
        height: a.offsetHeight,
        width: a.offsetWidth
    };
    return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width
};
goog.dom.getTextContent = function(a) {
    if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) a = goog.string.canonicalizeNewlines(a.innerText);
    else {
        var b = [];
        goog.dom.getTextContent_(a, b, !0);
        a = b.join("")
    }
    a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
    a = a.replace(/\u200B/g, "");
    goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
    " " != a && (a = a.replace(/^\s*/, ""));
    return a
};
goog.dom.getRawTextContent = function(a) {
    var b = [];
    goog.dom.getTextContent_(a, b, !1);
    return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
    if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_))
        if (a.nodeType == goog.dom.NodeType.TEXT) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
        else if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
    else
        for (a = a.firstChild; a;) goog.dom.getTextContent_(a, b, c), a = a.nextSibling
};
goog.dom.getNodeTextLength = function(a) {
    return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
    for (var c = b || goog.dom.getOwnerDocument(a).body, d = []; a && a != c;) {
        for (var e = a; e = e.previousSibling;) d.unshift(goog.dom.getTextContent(e));
        a = a.parentNode
    }
    return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
    a = [a];
    for (var d = 0, e = null; 0 < a.length && d < b;)
        if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_))
            if (e.nodeType == goog.dom.NodeType.TEXT) var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "),
                d = d + f.length;
            else if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
    else
        for (f = e.childNodes.length - 1; 0 <= f; f--) a.push(e.childNodes[f]);
    goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
    return e
};
goog.dom.isNodeList = function(a) {
    if (a && "number" == typeof a.length) {
        if (goog.isObject(a)) return "function" == typeof a.item || "string" == typeof a.item;
        if (goog.isFunction(a)) return "function" == typeof a.item
    }
    return !1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
    if (!b && !c) return null;
    var d = b ? b.toUpperCase() : null;
    return goog.dom.getAncestor(a, function(a) {
        return (!d || a.nodeName == d) && (!c || goog.isString(a.className) && goog.array.contains(a.className.split(/\s+/), c))
    }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
    return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
    c || (a = a.parentNode);
    c = null == d;
    for (var e = 0; a && (c || e <= d);) {
        if (b(a)) return a;
        a = a.parentNode;
        e++
    }
    return null
};
goog.dom.getActiveElement = function(a) {
    try {
        return a && a.activeElement
    } catch (b) {}
    return null
};
goog.dom.getPixelRatio = goog.functions.cacheReturnValue(function() {
    var a = goog.dom.getWindow(),
        b = goog.userAgent.GECKO && goog.userAgent.MOBILE;
    return goog.isDef(a.devicePixelRatio) && !b ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1 : 1
});
goog.dom.matchesPixelRatio_ = function(a) {
    return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: " + a + "),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + a + "dppx)").matches ? a : 0
};
goog.dom.DomHelper = function(a) {
    this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
    this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
    return goog.dom.getElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
    return goog.dom.getRequiredElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
    return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
    return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(a, b) {
    return goog.dom.getRequiredElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
    return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
    return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
    return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
    return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
    return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
    return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
    return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
picker.api.ActionPaneType = {
    SCHEMER: "sc",
    SPICYBOWL: "sp"
};
picker.api.ChromeMode = {
    FULL: "full",
    INLINE: "inline",
    NONE: "none"
};
picker.api.CropMode = {
    DEFAULT: "default",
    FIXED: "f",
    GPLUS_SQUARE_PROFILE: "gpsq",
    HORIZONTAL_FIXED: "hf",
    NONE: "none",
    SQUARE: "square",
    VERTICAL_FIXED: "vf",
    YOUTUBE_CHANNEL_BANNER: "ytcb"
};
picker.api.PostProcessorId = {
    ADD_TO_EVENT_COLLECTION: "atec",
    BLOGGER: "blogger",
    CHANGE_ALBUM_ATTRIBUTES: "caa",
    CIRCLE: "circle",
    CONTACT_PHOTO: "contactPhoto",
    COPY_PHOTO: "copyphoto",
    COPY_TO_PICKED_ALBUM: "ctpa",
    COPY_TO_PICKED_FOLDER: "ctpf",
    CROP_PHOTO: "cropphoto",
    DRIVE_PRE_OPEN: "drivepreopen",
    GEOPIX: "geopix",
    IMPORT_PHOTOS_FROM_DRIVE: "ipfd",
    MOVE_TO_PARENT: "mtp",
    PHOTO_ALBUM: "album",
    PHOTO_CURATION: "photocuration",
    PHOTO_SHARING: "photosharing",
    PHOTO_TAGGING: "bulkTag",
    POLLS: "polls",
    PROFILE_BANNER: "profileBanner",
    PROFILE_PHOTO: "profile",
    SQUARE_PROFILE_PHOTO: "sqprofile"
};
picker.api.Protocol = {
    IFPC: "ifpc",
    IFRAMES: "iframes",
    INJECTED: "injected",
    GADGETS: "gadgets"
};
picker.api.Protocol.INJECTED_FUNCTION_NAME = "_pickerCallback";
picker.api.ThumbnailSize = {
    DEFAULT: "default",
    ORIGINAL: "orig"
};
picker.api.TitleBarIconId = {
    PHOTOS: 1
};
picker.api.UploadButton = function(a) {
    this.uploadConfigurationId_ = a
};
picker.api.UploadButton.Properties = {
    UPLOAD_CONFIG_ID: "ucid"
};
picker.api.UploadButton.prototype.toString = function() {
    var a = {};
    a[picker.api.UploadButton.Properties.UPLOAD_CONFIG_ID] = this.uploadConfigurationId_;
    return goog.json.serialize(a)
};
picker.api.ServiceId = {
    BOOKS: "books",
    CALENDAR: "calendar",
    CONTACTS: "contacts",
    GREADY: "gready",
    CPORTAL: "cportal",
    CULTURAL: "cultural",
    DOCS: "docs",
    DOPLAR_PHOTO: "photo",
    DRAGONFLY_PHOTOS: "dragonflyphotos",
    DRIVE: "drive",
    DRIVE_SELECT: "drive-select",
    FONTS: "fonts",
    EVENT_THEMES: "et",
    GEODISCUSSION: "geodiscussion",
    LOCAL_PHOTOS: "localphotos",
    MAPS: "maps",
    MAPSHOP: "mapshop",
    MAPSPRO: "mapspro",
    MEDIA: "media",
    ORKUT: "orkut",
    PARTY: "party",
    PHOTOS: "picasa",
    PLACES: "places",
    RELATED_CONTENT: "relatedcontent",
    STORIES: "stories",
    YOUTUBE: "youtube",
    PEOPLE: "people",
    SEARCH_API: "search-api",
    URL: "url",
    RECENT: "recent",
    COSMO: "cosmo",
    DOCLIST_BLOB: "DoclistBlob",
    DOCUMENT: "doc",
    DRAWING: "drawing",
    FORM: "form",
    KIX: "kix",
    PRESENTATION: "pres",
    PUNCH: "punch",
    SPREADSHEET: "spread"
};
picker.api.ServiceId.isDriveService = function(a) {
    switch (a) {
        case picker.api.ServiceId.DOCS:
        case picker.api.ServiceId.DOCLIST_BLOB:
        case picker.api.ServiceId.DOCUMENT:
        case picker.api.ServiceId.DRAWING:
        case picker.api.ServiceId.DRIVE:
        case picker.api.ServiceId.DRIVE_SELECT:
        case picker.api.ServiceId.FORM:
        case picker.api.ServiceId.KIX:
        case picker.api.ServiceId.PRESENTATION:
        case picker.api.ServiceId.PUNCH:
        case picker.api.ServiceId.SPREADSHEET:
            return !0;
        default:
            return !1
    }
};
picker.api.Type = {
    ALBUM: "album",
    ATTACHMENT: "attachment",
    BOOK: "book",
    CALENDAR: "calendar",
    CIRCLE: "circle",
    CONTACT: "contact",
    COLLECTION: "collection",
    DOCUMENT: "document",
    EVENT: "event",
    EVENT_THEME: "et",
    FACES: "faces",
    FONT: "font",
    LOCATION: "location",
    MAP: "map",
    PERSON: "person",
    PHOTO: "photo",
    URL: "url",
    VIDEO: "video"
};
picker.api.UploadConfiguration = function(a) {
    this.allowedTypes_ = a[picker.api.UploadConfiguration.PropertyNames.ALLOWED_TYPES];
    this.dragErrorText_ = a[picker.api.UploadConfiguration.PropertyNames.DRAG_ERROR_TEXT];
    this.dropZoneText_ = a[picker.api.UploadConfiguration.PropertyNames.DROP_ZONE_TEXT];
    this.dropZoneAltText_ = a[picker.api.UploadConfiguration.PropertyNames.DROP_ZONE_ALT_TEXT];
    this.explanatoryText_ = a[picker.api.UploadConfiguration.PropertyNames.EXPLANATORY_TEXT];
    this.mechanisms_ = a[picker.api.UploadConfiguration.PropertyNames.MECHANISMS];
    this.metadata_ = a[picker.api.UploadConfiguration.PropertyNames.METADATA];
    this.selectFilesLabel_ = a[picker.api.UploadConfiguration.PropertyNames.SELECT_FILES_LABEL];
    this.serviceId_ = a[picker.api.UploadConfiguration.PropertyNames.SERVICE_ID];
    this.uploadErrorText_ = a[picker.api.UploadConfiguration.PropertyNames.UPLOAD_ERROR_TEXT];
    this.url_ = a[picker.api.UploadConfiguration.PropertyNames.URL]
};
picker.api.UploadConfiguration.PropertyNames = {
    ALLOWED_TYPES: "at",
    DRAG_ERROR_TEXT: "det",
    DROP_ZONE_TEXT: "dzt",
    DROP_ZONE_ALT_TEXT: "dzat",
    EXPLANATORY_TEXT: "text",
    MECHANISMS: "mechanisms",
    METADATA: "metadata",
    SELECT_FILES_LABEL: "selectLabel",
    SERVICE_ID: "serviceId",
    UPLOAD_ERROR_TEXT: "uet",
    URL: "url"
};
picker.api.UploadConfiguration.prototype.getAllowedTypes = function() {
    return this.allowedTypes_
};
picker.api.UploadConfiguration.prototype.getDragErrorText = function() {
    return this.dragErrorText_
};
picker.api.UploadConfiguration.prototype.getDropZoneText = function() {
    return this.dropZoneText_
};
picker.api.UploadConfiguration.prototype.getDropZoneAltText = function() {
    return this.dropZoneAltText_
};
picker.api.UploadConfiguration.prototype.getExplanatoryText = function() {
    return this.explanatoryText_
};
picker.api.UploadConfiguration.prototype.getMechanisms = function() {
    return this.mechanisms_ || ["XHR", "HTML_FORM"]
};
picker.api.UploadConfiguration.prototype.getMetadata = function() {
    return this.metadata_
};
picker.api.UploadConfiguration.prototype.getSelectFilesLabel = function() {
    return this.selectFilesLabel_
};
picker.api.UploadConfiguration.prototype.getServiceId = function() {
    return this.serviceId_
};
picker.api.UploadConfiguration.prototype.getUploadErrorText = function() {
    return this.uploadErrorText_
};
picker.api.UploadConfiguration.prototype.getUrl = function() {
    return this.url_
};
picker.api.UploadConfigurationId = {
    BLOGGER_VIDEO: "blogger",
    BOOKS: "books",
    GREADY: "gready",
    GREADYDEV: "greadydev",
    GREADYTEST: "greadytest",
    CPANEL: "cpanel",
    CPORTAL: "cportal",
    CPORTALTEST: "cportaltest",
    CULTURAL: "cultural",
    DDM_PLANNING: "ddmplanning",
    DOC: "doc",
    DOCS: "docs",
    DRAGONFLY_PHOTOS: "dragonflyphotos",
    DRAWINGS: "drawings",
    FREEBIRD: "forms",
    GEODISCUSSION: "geodiscussion",
    GMAIL_PHOTOS: "gmailphotos",
    KIX: "document",
    LOCAL_PHOTOS: "localphotos",
    MAPSPRO: "mapspro",
    PHOTO: "photo",
    PHOTOS: "photos",
    PROFILE: "profile",
    PUNCH: "presentation",
    TRIX: "spreadsheet",
    VIDEOS: "videos",
    YOUTUBE_BANNER: "youtubebanner"
};
picker.api.SafeSearch = {
    OFF: "off",
    STRICT: "active",
    MODERATE: "moderate"
};
picker.api.BlogSearchView = function() {
    picker.api.View.call(this, picker.api.ViewId.BLOG_SEARCH)
};
goog.inherits(picker.api.BlogSearchView, picker.api.View);
picker.api.BlogSearchView.prototype.setSite = function(a) {
    this.opts[picker.api.View.Option.SITE] = a;
    return this
};
picker.api.BlogSearchView.prototype.setSafeSearch = function(a) {
    this.opts[picker.api.View.Option.SEARCH_SAFE] = a;
    return this
};
picker.api.ImageSearchView = function() {
    picker.api.View.call(this, picker.api.ViewId.IMAGE_SEARCH);
    PICKER_THIRD_PARTY_API && (this.opts[picker.api.View.Option.LICENSE] = picker.api.ImageSearchView.License.COMMERCIAL_REUSE_WITH_MODIFICATION)
};
goog.inherits(picker.api.ImageSearchView, picker.api.View);
picker.api.ImageSearchView.Type = {
    GETTY: "getty",
    GOOGLE_IMAGE_SEARCH: "gis",
    TIME_LIFE: "life"
};
picker.api.ImageSearchView.License = {
    NONE: "*",
    REUSE: "r",
    COMMERCIAL_REUSE: "cr",
    REUSE_WITH_MODIFICATION: "rwm",
    COMMERCIAL_REUSE_WITH_MODIFICATION: "crwm"
};
picker.api.ImageSearchView.Size = {
    SIZE_QSVGA: "qsvga",
    SIZE_VGA: "vga",
    SIZE_SVGA: "svga",
    SIZE_XGA: "xga",
    SIZE_WXGA: "wxga",
    SIZE_WXGA2: "wxga2",
    SIZE_2MP: "2mp",
    SIZE_4MP: "4mp",
    SIZE_6MP: "6mp",
    SIZE_8MP: "8mp",
    SIZE_10MP: "10mp",
    SIZE_12MP: "12mp",
    SIZE_15MP: "15mp",
    SIZE_20MP: "20mp",
    SIZE_40MP: "40mp",
    SIZE_70MP: "70mp",
    SIZE_140MP: "140mp"
};
picker.api.ImageSearchView.Colorization = {
    BLACK_AND_WHITE: "mono",
    GRAYSCALE: "gray",
    COLOR: "color"
};
picker.api.ImageSearchView.Color = {
    RED: "red",
    ORANGE: "orange",
    YELLOW: "yellow",
    GREEN: "green",
    TEAL: "teal",
    BLUE: "blue",
    PURPLE: "purple",
    PINK: "pink",
    WHITE: "white",
    GRAY: "gray",
    BLACK: "black",
    BROWN: "brown"
};
picker.api.ImageSearchView.ImageType = {
    ALL: "",
    FACES: "face",
    CLIPART: "clipart",
    LINEART: "lineart",
    PHOTO: "photo"
};
picker.api.ImageSearchView.prototype.setSite = function(a) {
    this.opts[picker.api.View.Option.SITE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setType = function(a) {
    this.opts[picker.api.View.Option.TYPE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setLicense = function(a) {
    a == picker.api.ImageSearchView.License.NONE ? delete this.opts[picker.api.View.Option.LICENSE] : this.opts[picker.api.View.Option.LICENSE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setSize = function(a) {
    this.opts[picker.api.View.Option.IMAGE_SEARCH_SIZE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setColor = function(a) {
    this.opts[picker.api.View.Option.IMAGE_SEARCH_COLOR] = a;
    return this
};
picker.api.ImageSearchView.prototype.setColorization = function(a) {
    this.opts[picker.api.View.Option.IMAGE_SEARCH_COLORIZATION] = a;
    return this
};
picker.api.ImageSearchView.prototype.setImageType = function(a) {
    this.opts[picker.api.View.Option.IMAGE_SEARCH_TYPE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setSafeSearch = function(a) {
    this.opts[picker.api.View.Option.SEARCH_SAFE] = a;
    return this
};
picker.api.ImageSearchView.prototype.setComboTypes = function(a) {
    this.opts[picker.api.View.Option.COMBO_TYPES] = a.join(",");
    return this
};
picker.api.ImageSearchView.prototype.setContainingCosmoId = function(a) {
    this.opts[picker.api.View.Option.COSMO_ID] = a;
    return this
};
picker.api.MapsMode = {
    ALL: "all",
    POINT: "point"
};
picker.api.MapsView = function() {
    picker.api.View.call(this, picker.api.ViewId.MAPS)
};
goog.inherits(picker.api.MapsView, picker.api.View);
picker.api.MapsView.prototype.setMode = function(a) {
    this.opts[picker.api.View.Option.MODE] = a;
    return this
};
picker.api.MapsView.prototype.setCenter = function(a, b) {
    this.opts[picker.api.View.Option.MAP_CENTER] = [a, b];
    return this
};
picker.api.MapsView.prototype.setZoom = function(a) {
    this.opts[picker.api.View.Option.MAP_ZOOM] = a;
    return this
};
picker.api.MapsView.prototype.addPlacemark = function(a, b) {
    this.opts[picker.api.View.Option.MAP_PLACEMARK] = [a, b];
    return this
};
picker.api.PhotosView = function() {
    picker.api.View.call(this, picker.api.ViewId.PHOTOS)
};
goog.inherits(picker.api.PhotosView, picker.api.View);
picker.api.PhotosView.Type = {
    BANNER: "banner",
    BANNER_GALLERY: "bannergallery",
    CAMERA_SYNC: "camerasync",
    FEATURED: "featured",
    FLAT: "flat",
    GETTY: "getty",
    HIGHLIGHTS: "highlights",
    MEDIA_COLLECTION: "mediacollection",
    MOMENT: "moment",
    OF_USER: "ofuser",
    STREAM_ID: "streamid",
    TACOTOWN_PROTO_PHOTO: "tpp",
    UPLOADED: "uploaded",
    VIDEOS_CAMERASYNC: "videos-camerasync",
    VIDEOS_UPLOADED: "videos-uploaded",
    WITH_LOCAL_ALBUM: "localalbum",
    YOUTUBE_BANNER_GALLERY: "ytbanner"
};
picker.api.PhotosView.UploadPosition = {
    FIRST: "first",
    LAST: "last"
};
picker.api.PhotosView.VisibilityFilter = {
    ALL: 0,
    PUBLIC: 1,
    PUBLIC_OR_UNLISTED: 2,
    PUBLIC_OR_DOMAIN_PUBLIC: 3
};
picker.api.PhotosView.prototype.setAllowedItemTypes = function(a) {
    this.opts[picker.api.View.Option.ALLOWED_ITEM_TYPES] = a.join(",");
    return this
};
picker.api.PhotosView.prototype.setExcludeEventAlbums = function(a) {
    this.opts[picker.api.View.Option.EXCLUDE_EVENT_ALBUMS] = a;
    return this
};
picker.api.PhotosView.prototype.setExcludeLabels = function(a) {
    this.opts[picker.api.View.Option.EXCLUDE_LABELS] = a.join(",");
    return this
};
picker.api.PhotosView.prototype.setLegacyLocalPageAlbumId = function(a) {
    this.opts[picker.api.View.Option.LOCAL_ALBUM] = a;
    return this
};
picker.api.PhotosView.prototype.setLegacyLocalPageUserEmail = function(a) {
    this.opts[picker.api.View.Option.LOCAL_USER] = a;
    return this
};
picker.api.PhotosView.prototype.setMode = function(a) {
    this.opts[picker.api.View.Option.MODE] = a;
    return this
};
picker.api.PhotosView.prototype.setSelectAlbumEnabled = function(a) {
    this.opts[picker.api.View.Option.SELECT_ALBUM_ENABLED] = a;
    return this
};
picker.api.PhotosView.prototype.setSelectAlbumLabel = function(a) {
    this.opts[picker.api.View.Option.SELECT_ALBUM_LABEL] = a;
    return this
};
picker.api.PhotosView.prototype.setShowVideoMetadata = function(a) {
    this.opts[picker.api.View.Option.SHOW_VIDEO_METADATA] = a;
    return this
};
picker.api.PhotosView.prototype.setType = function(a) {
    this.opts[picker.api.View.Option.TYPE] = a;
    return this
};
picker.api.PhotosView.prototype.setUploadEnabled = function(a) {
    this.opts[picker.api.View.Option.UPLOAD] = a ? "true" : null;
    return this
};
picker.api.PhotosView.prototype.setUploadPosition = function(a) {
    this.opts[picker.api.View.Option.UPLOAD_POSITION] = a;
    return this
};
picker.api.PhotosView.prototype.setUsername = function(a) {
    this.opts[picker.api.View.Option.USERNAME] = a;
    return this
};
picker.api.PhotosView.prototype.setVisibilityFilter = function(a) {
    this.opts[picker.api.View.Option.VISIBILITY_FILTER] = a;
    return this
};
picker.api.UrlViewType = {
    ALL: "all",
    IMAGE: "image",
    VIDEO: "video"
};
picker.api.UrlView = function() {
    picker.api.View.call(this, picker.api.ViewId.URL)
};
goog.inherits(picker.api.UrlView, picker.api.View);
picker.api.UrlView.prototype.setSite = function(a) {
    this.opts[picker.api.View.Option.SITE] = a;
    return this
};
picker.api.UrlView.prototype.setType = function(a) {
    this.opts[picker.api.View.Option.TYPE] = a;
    return this
};
picker.api.VideoSearchView = function() {
    picker.api.View.call(this, picker.api.ViewId.VIDEO_SEARCH)
};
goog.inherits(picker.api.VideoSearchView, picker.api.View);
picker.api.VideoSearchView.GOOGLE_VIDEO = "video.google.com";
picker.api.VideoSearchView.YOUTUBE = "youtube.com";
picker.api.VideoSearchView.prototype.setSite = function(a) {
    this.opts[picker.api.View.Option.SITE] = a;
    return this
};
picker.api.VideoSearchView.prototype.setSafeSearch = function(a) {
    this.opts[picker.api.View.Option.SEARCH_SAFE] = a;
    return this
};
picker.api.WebSearchView = function() {
    picker.api.View.call(this, picker.api.ViewId.WEB_SEARCH)
};
goog.inherits(picker.api.WebSearchView, picker.api.View);
picker.api.WebSearchView.prototype.setSite = function(a) {
    this.opts[picker.api.View.Option.SITE] = a;
    return this
};
picker.api.WebSearchView.prototype.setCustomSearchEngine = function(a) {
    this.opts[picker.api.View.Option.CSE] = a;
    return this
};
picker.api.WebSearchView.prototype.setSearchLabel = function(a) {
    this.opts[picker.api.View.Option.SEARCH_LABEL] = a;
    return this
};
picker.api.WebSearchView.prototype.setInUrl = function(a) {
    this.opts[picker.api.View.Option.IN_URL] = a;
    return this
};
picker.api.WebSearchView.prototype.setSafeSearch = function(a) {
    this.opts[picker.api.View.Option.SEARCH_SAFE] = a;
    return this
};
picker.api.ViewGroup = function(a) {
    this.root_ = goog.isString(a) ? new picker.api.View(a) : a;
    this.items_ = [];
    this.opts = {}
};
picker.api.ViewGroup.Option = {
    COLLAPSIBLE: "collapsible"
};
picker.api.ViewGroup.CollapsibleType = {
    COLLAPSED: "collapsed",
    EXPANDED: "expanded"
};
picker.api.ViewGroup.prototype.convertViewIdToView_ = function(a) {
    switch (a) {
        case picker.api.ViewId.BLOG_SEARCH:
            return new picker.api.BlogSearchView;
        case picker.api.ViewId.IMAGE_SEARCH:
            return new picker.api.ImageSearchView;
        case picker.api.ViewId.MAPS:
            return new picker.api.MapsView;
        case picker.api.ViewId.PHOTOS:
            return new picker.api.PhotosView;
        case picker.api.ViewId.URL:
            return new picker.api.UrlView;
        case picker.api.ViewId.VIDEO_SEARCH:
            return new picker.api.VideoSearchView;
        case picker.api.ViewId.WEB_SEARCH:
            return new picker.api.WebSearchView
    }
    return new picker.api.View(a)
};
picker.api.ViewGroup.prototype.addView = function(a) {
    this.items_.push(goog.isString(a) ? this.convertViewIdToView_(a) : a);
    return this
};
picker.api.ViewGroup.prototype.addViewAt = function(a, b) {
    goog.array.insertAt(this.items_, goog.isString(a) ? this.convertViewIdToView_(a) : a, b);
    return this
};
picker.api.ViewGroup.prototype.addLabel = function(a) {
    this.items_.push((new picker.api.View(null)).setLabel(a));
    return this
};
picker.api.ViewGroup.prototype.addLabelAt = function(a, b) {
    goog.array.insertAt(this.items_, (new picker.api.View(null)).setLabel(a), b);
    return this
};
picker.api.ViewGroup.prototype.addViewGroup = function(a) {
    this.items_.push(a);
    return this
};
picker.api.ViewGroup.prototype.addViewGroupAt = function(a, b) {
    goog.array.insertAt(this.items_, a, b);
    return this
};
picker.api.ViewGroup.prototype.getItemsString = function() {
    return "(" + goog.array.map(this.items_, function(a) {
        return a.toString()
    }).join(",") + ")"
};
picker.api.ViewGroup.prototype.getOptionsString = function() {
    var a = goog.object.filter(this.opts, function(a) {
        return null !== a
    });
    return (a = goog.object.isEmpty(a) ? null : a) ? goog.json.serialize(goog.object.map(a, function(a) {
        return a.toString()
    })) : ""
};
picker.api.ViewGroup.prototype.toString = function() {
    if (this.root_) {
        var a = ["{root:", this.root_.toString(), ",items:", this.getItemsString()],
            b = this.getOptionsString();
        b && (a.push(",options:"), a.push(b));
        a.push("}");
        return a.join("")
    }
    return this.getItemsString()
};
picker.api.ViewGroup.prototype.toObject = function() {
    var a = goog.array.map(this.items_, function(a) {
        return a instanceof picker.api.ViewGroup ? a.toObject() : a.toArray()
    });
    return this.root_ ? {
        root: this.root_.toArray(),
        items: a,
        options: this.getOptions()
    } : a
};
picker.api.ViewGroup.prototype.hasView = function(a) {
    for (var b = this.items_, c = 0; c < b.length; c++) {
        var d = b[c];
        if (d instanceof picker.api.ViewGroup && d.hasView(a) || d instanceof picker.api.View && d.getId() == a) return !0
    }
    return !1
};
picker.api.ViewGroup.prototype.getViews = function(a, b) {
    b = b || [];
    for (var c = this.items_, d = 0; d < c.length; d++) {
        var e = c[d];
        e instanceof picker.api.ViewGroup ? e.getViews(a, b) : e.getId() == a && b.push(e)
    }
    return b
};
picker.api.ViewGroup.prototype.getOptions = function() {
    return goog.object.clone(this.opts)
};
picker.api.ViewGroup.prototype.setCollapsible = function(a) {
    this.opts[picker.api.ViewGroup.Option.COLLAPSIBLE] = a;
    return this
};
picker.api.AbstractPickerBuilder = function(a) {
    this.basePickerUrl_ = a || "https://docs.google.com/picker";
    this.resetNav()
};
picker.api.AbstractPickerBuilder.prototype.nav_ = null;
picker.api.AbstractPickerBuilder.prototype.domHelper_ = null;
picker.api.AbstractPickerBuilder.prototype.addLabel = function(a) {
    if (PICKER_THIRD_PARTY_API) throw Error("picker.api.PickerBuilder#addLabel is not supported.");
    this.nav_.addLabel(a);
    return this
};
picker.api.AbstractPickerBuilder.prototype.addView = function(a) {
    this.nav_.addView(a);
    return this
};
picker.api.AbstractPickerBuilder.prototype.addViewAt = function(a, b) {
    this.nav_.addViewAt(a, b);
    return this
};
picker.api.AbstractPickerBuilder.prototype.addViewGroup = function(a) {
    this.nav_.addViewGroup(a);
    return this
};
picker.api.AbstractPickerBuilder.prototype.addViewGroupAt = function(a, b) {
    this.nav_.addViewGroupAt(a, b);
    return this
};
picker.api.AbstractPickerBuilder.prototype.getAppId = function() {
    return this.appId_
};
picker.api.AbstractPickerBuilder.prototype.getBaseUrl = function() {
    return this.basePickerUrl_
};
picker.api.AbstractPickerBuilder.prototype.getCallback = function() {
    return this.callback_
};
picker.api.AbstractPickerBuilder.prototype.getDomHelper = function() {
    return this.domHelper_
};
picker.api.AbstractPickerBuilder.prototype.getNav = function() {
    return this.nav_.getItemsString()
};
picker.api.AbstractPickerBuilder.prototype.getNavObject = function() {
    return this.nav_.toObject()
};
picker.api.AbstractPickerBuilder.prototype.getViews = function(a) {
    return this.nav_.getViews(a)
};
picker.api.AbstractPickerBuilder.prototype.hasView = function(a) {
    return this.nav_.hasView(a)
};
picker.api.AbstractPickerBuilder.prototype.hideTitleBar = function() {
    return this.setTitle("")
};
picker.api.AbstractPickerBuilder.prototype.resetNav = function() {
    this.nav_ = new picker.api.ViewGroup;
    return this
};
picker.api.AbstractPickerBuilder.prototype.setAppId = function(a) {
    this.appId_ = a;
    return this
};
picker.api.AbstractPickerBuilder.prototype.setCallback = function(a) {
    this.callback_ = a;
    return this
};
picker.api.AbstractPickerBuilder.prototype.setDocument = function(a) {
    this.domHelper_ = new goog.dom.DomHelper(a);
    return this
};
picker.api.AbstractPickerBuilder.prototype.setDomHelper = function(a) {
    this.domHelper_ = a;
    return this
};
picker.api.AbstractPickerBuilder.prototype.addUploader = function(a, b) {
    return this
};
picker.api.commands = {};
picker.api.commands.Field = {
    ACTION: "action",
    ALBUM_ID: "albumId",
    APP_ID: "appId",
    APP_ORIGIN: "appOrigin",
    CIRCLES: "circles",
    CONTACTS: "contacts",
    FONTS: "fonts",
    FONT_NAME: "fontName",
    ID: "id",
    MAX_SIZE_BYTES: "maxSizeBytes",
    MAX_ITEMS: "maxItems",
    PEOPLE: "people",
    PHOTO_IDS: "photoIds",
    TITLE: "title",
    WAIT_FOR_VIEW: "wfv",
    VIEW: "view",
    VIEW_OPTIONS: "viewOptions",
    VISIBLE: "visible"
};
picker.api.commands.Command = function(a) {
    this[picker.api.commands.Field.ACTION] = a;
    this[picker.api.commands.Field.WAIT_FOR_VIEW] = !1
};
picker.api.commands.Command.Action = {
    CANCEL: "cancel",
    CANCEL_UPLOAD: "cancel-upload",
    REFRESH: "refresh",
    SELECT_CONTACTS: "select-contacts",
    SELECT_FONTS: "select-fonts",
    SELECT_PEOPLE: "select-people",
    SET_ALBUM_SORT_ORDER: "set-album-sort-order",
    SET_DRIVE_OPTIONS: "set-drive-options",
    SET_MAX_ITEMS: "set-max-items",
    SET_MAX_SIZE_BYTES: "set-max-size-bytes",
    SET_TITLE: "set-title",
    SET_UPLOAD_ALBUM_ID: "set-upload-album-id",
    SET_VIEW: "set-view",
    SET_VIEW_OPTIONS: "set-view-options",
    VISIBILITY: "visibility"
};
picker.api.commands.SetDriveOptionsCommand = function(a, b) {
    picker.api.commands.Command.call(this, picker.api.commands.Command.Action.SET_DRIVE_OPTIONS);
    this[picker.api.commands.Field.APP_ID] = a;
    this[picker.api.commands.Field.APP_ORIGIN] = b
};
goog.inherits(picker.api.commands.SetDriveOptionsCommand, picker.api.commands.Command);
picker.api.commands.VisibilityCommand = function(a) {
    picker.api.commands.Command.call(this, picker.api.commands.Command.Action.VISIBILITY);
    this[picker.api.commands.Field.VISIBLE] = a
};
goog.inherits(picker.api.commands.VisibilityCommand, picker.api.commands.Command);
goog.a11y = {};
goog.a11y.aria = {};
goog.a11y.aria.State = {
    ACTIVEDESCENDANT: "activedescendant",
    ATOMIC: "atomic",
    AUTOCOMPLETE: "autocomplete",
    BUSY: "busy",
    CHECKED: "checked",
    CONTROLS: "controls",
    DESCRIBEDBY: "describedby",
    DISABLED: "disabled",
    DROPEFFECT: "dropeffect",
    EXPANDED: "expanded",
    FLOWTO: "flowto",
    GRABBED: "grabbed",
    HASPOPUP: "haspopup",
    HIDDEN: "hidden",
    INVALID: "invalid",
    LABEL: "label",
    LABELLEDBY: "labelledby",
    LEVEL: "level",
    LIVE: "live",
    MULTILINE: "multiline",
    MULTISELECTABLE: "multiselectable",
    ORIENTATION: "orientation",
    OWNS: "owns",
    POSINSET: "posinset",
    PRESSED: "pressed",
    READONLY: "readonly",
    RELEVANT: "relevant",
    REQUIRED: "required",
    SELECTED: "selected",
    SETSIZE: "setsize",
    SORT: "sort",
    VALUEMAX: "valuemax",
    VALUEMIN: "valuemin",
    VALUENOW: "valuenow",
    VALUETEXT: "valuetext"
};
goog.a11y.aria.AutoCompleteValues = {
    INLINE: "inline",
    LIST: "list",
    BOTH: "both",
    NONE: "none"
};
goog.a11y.aria.DropEffectValues = {
    COPY: "copy",
    MOVE: "move",
    LINK: "link",
    EXECUTE: "execute",
    POPUP: "popup",
    NONE: "none"
};
goog.a11y.aria.LivePriority = {
    OFF: "off",
    POLITE: "polite",
    ASSERTIVE: "assertive"
};
goog.a11y.aria.OrientationValues = {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal"
};
goog.a11y.aria.RelevantValues = {
    ADDITIONS: "additions",
    REMOVALS: "removals",
    TEXT: "text",
    ALL: "all"
};
goog.a11y.aria.SortValues = {
    ASCENDING: "ascending",
    DESCENDING: "descending",
    NONE: "none",
    OTHER: "other"
};
goog.a11y.aria.CheckedValues = {
    TRUE: "true",
    FALSE: "false",
    MIXED: "mixed",
    UNDEFINED: "undefined"
};
goog.a11y.aria.ExpandedValues = {
    TRUE: "true",
    FALSE: "false",
    UNDEFINED: "undefined"
};
goog.a11y.aria.GrabbedValues = {
    TRUE: "true",
    FALSE: "false",
    UNDEFINED: "undefined"
};
goog.a11y.aria.InvalidValues = {
    FALSE: "false",
    TRUE: "true",
    GRAMMAR: "grammar",
    SPELLING: "spelling"
};
goog.a11y.aria.PressedValues = {
    TRUE: "true",
    FALSE: "false",
    MIXED: "mixed",
    UNDEFINED: "undefined"
};
goog.a11y.aria.SelectedValues = {
    TRUE: "true",
    FALSE: "false",
    UNDEFINED: "undefined"
};
goog.a11y.aria.datatables = {};
goog.a11y.aria.datatables.getDefaultValuesMap = function() {
    goog.a11y.aria.DefaultStateValueMap_ || (goog.a11y.aria.DefaultStateValueMap_ = goog.object.create(goog.a11y.aria.State.ATOMIC, !1, goog.a11y.aria.State.AUTOCOMPLETE, "none", goog.a11y.aria.State.DROPEFFECT, "none", goog.a11y.aria.State.HASPOPUP, !1, goog.a11y.aria.State.LIVE, "off", goog.a11y.aria.State.MULTILINE, !1, goog.a11y.aria.State.MULTISELECTABLE, !1, goog.a11y.aria.State.ORIENTATION, "vertical", goog.a11y.aria.State.READONLY, !1, goog.a11y.aria.State.RELEVANT,
        "additions text", goog.a11y.aria.State.REQUIRED, !1, goog.a11y.aria.State.SORT, "none", goog.a11y.aria.State.BUSY, !1, goog.a11y.aria.State.DISABLED, !1, goog.a11y.aria.State.HIDDEN, !1, goog.a11y.aria.State.INVALID, "false"));
    return goog.a11y.aria.DefaultStateValueMap_
};
goog.a11y.aria.Role = {
    ALERT: "alert",
    ALERTDIALOG: "alertdialog",
    APPLICATION: "application",
    ARTICLE: "article",
    BANNER: "banner",
    BUTTON: "button",
    CHECKBOX: "checkbox",
    COLUMNHEADER: "columnheader",
    COMBOBOX: "combobox",
    COMPLEMENTARY: "complementary",
    CONTENTINFO: "contentinfo",
    DEFINITION: "definition",
    DIALOG: "dialog",
    DIRECTORY: "directory",
    DOCUMENT: "document",
    FORM: "form",
    GRID: "grid",
    GRIDCELL: "gridcell",
    GROUP: "group",
    HEADING: "heading",
    IMG: "img",
    LINK: "link",
    LIST: "list",
    LISTBOX: "listbox",
    LISTITEM: "listitem",
    LOG: "log",
    MAIN: "main",
    MARQUEE: "marquee",
    MATH: "math",
    MENU: "menu",
    MENUBAR: "menubar",
    MENU_ITEM: "menuitem",
    MENU_ITEM_CHECKBOX: "menuitemcheckbox",
    MENU_ITEM_RADIO: "menuitemradio",
    NAVIGATION: "navigation",
    NOTE: "note",
    OPTION: "option",
    PRESENTATION: "presentation",
    PROGRESSBAR: "progressbar",
    RADIO: "radio",
    RADIOGROUP: "radiogroup",
    REGION: "region",
    ROW: "row",
    ROWGROUP: "rowgroup",
    ROWHEADER: "rowheader",
    SCROLLBAR: "scrollbar",
    SEARCH: "search",
    SEPARATOR: "separator",
    SLIDER: "slider",
    SPINBUTTON: "spinbutton",
    STATUS: "status",
    TAB: "tab",
    TAB_LIST: "tablist",
    TAB_PANEL: "tabpanel",
    TEXTBOX: "textbox",
    TIMER: "timer",
    TOOLBAR: "toolbar",
    TOOLTIP: "tooltip",
    TREE: "tree",
    TREEGRID: "treegrid",
    TREEITEM: "treeitem"
};
goog.a11y.aria.ARIA_PREFIX_ = "aria-";
goog.a11y.aria.ROLE_ATTRIBUTE_ = "role";
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.HEAD, goog.dom.TagName.INPUT, goog.dom.TagName.LINK, goog.dom.TagName.MENU, goog.dom.TagName.META, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.PROGRESS, goog.dom.TagName.STYLE, goog.dom.TagName.SELECT, goog.dom.TagName.SOURCE, goog.dom.TagName.TEXTAREA, goog.dom.TagName.TITLE, goog.dom.TagName.TRACK];
goog.a11y.aria.setRole = function(a, b) {
    b ? (goog.asserts.ENABLE_ASSERTS && goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.Role, b), "No such ARIA role " + b), a.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, b)) : goog.a11y.aria.removeRole(a)
};
goog.a11y.aria.getRole = function(a) {
    return a.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_) || null
};
goog.a11y.aria.removeRole = function(a) {
    a.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_)
};
goog.a11y.aria.setState = function(a, b, c) {
    goog.isArrayLike(c) && (c = c.join(" "));
    var d = goog.a11y.aria.getAriaAttributeName_(b);
    "" === c || void 0 == c ? (c = goog.a11y.aria.datatables.getDefaultValuesMap(), b in c ? a.setAttribute(d, c[b]) : a.removeAttribute(d)) : a.setAttribute(d, c)
};
goog.a11y.aria.removeState = function(a, b) {
    a.removeAttribute(goog.a11y.aria.getAriaAttributeName_(b))
};
goog.a11y.aria.getState = function(a, b) {
    var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
    return null == c || void 0 == c ? "" : String(c)
};
goog.a11y.aria.getActiveDescendant = function(a) {
    var b = goog.a11y.aria.getState(a, goog.a11y.aria.State.ACTIVEDESCENDANT);
    return goog.dom.getOwnerDocument(a).getElementById(b)
};
goog.a11y.aria.setActiveDescendant = function(a, b) {
    var c = "";
    b && (c = b.id, goog.asserts.assert(c, "The active element should have an id."));
    goog.a11y.aria.setState(a, goog.a11y.aria.State.ACTIVEDESCENDANT, c)
};
goog.a11y.aria.getLabel = function(a) {
    return goog.a11y.aria.getState(a, goog.a11y.aria.State.LABEL)
};
goog.a11y.aria.setLabel = function(a, b) {
    goog.a11y.aria.setState(a, goog.a11y.aria.State.LABEL, b)
};
goog.a11y.aria.assertRoleIsSetInternalUtil = function(a, b) {
    if (!goog.array.contains(goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_, a.tagName)) {
        var c = goog.a11y.aria.getRole(a);
        goog.asserts.assert(null != c, "The element ARIA role cannot be null.");
        goog.asserts.assert(goog.array.contains(b, c), 'Non existing or incorrect role set for element.The role set is "' + c + '". The role should be any of "' + b + '". Check the ARIA specification for more details http://www.w3.org/TR/wai-aria/roles.')
    }
};
goog.a11y.aria.getStateBoolean = function(a, b) {
    var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
    goog.asserts.assert(goog.isBoolean(c) || null == c || "true" == c || "false" == c);
    return null == c ? c : goog.isBoolean(c) ? c : "true" == c
};
goog.a11y.aria.getStateNumber = function(a, b) {
    var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
    goog.asserts.assert((null == c || !isNaN(Number(c))) && !goog.isBoolean(c));
    return null == c ? null : Number(c)
};
goog.a11y.aria.getStateString = function(a, b) {
    var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
    goog.asserts.assert((null == c || goog.isString(c)) && isNaN(Number(c)) && "true" != c && "false" != c);
    return null == c ? null : c
};
goog.a11y.aria.getStringArrayStateInternalUtil = function(a, b) {
    var c = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
    return goog.a11y.aria.splitStringOnWhitespace_(c)
};
goog.a11y.aria.splitStringOnWhitespace_ = function(a) {
    return a ? a.split(/\s+/) : []
};
goog.a11y.aria.getAriaAttributeName_ = function(a) {
    goog.asserts.ENABLE_ASSERTS && (goog.asserts.assert(a, "ARIA attribute cannot be empty."), goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.State, a), "No such ARIA attribute " + a));
    return goog.a11y.aria.ARIA_PREFIX_ + a
};
goog.dom.classlist = {};
goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST = !1;
goog.dom.classlist.get = function(a) {
    if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) return a.classList;
    a = a.className;
    return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classlist.set = function(a, b) {
    a.className = b
};
goog.dom.classlist.contains = function(a, b) {
    return goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.contains(b) : goog.array.contains(goog.dom.classlist.get(a), b)
};
goog.dom.classlist.add = function(a, b) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.add(b) : goog.dom.classlist.contains(a, b) || (a.className += 0 < a.className.length ? " " + b : b)
};
goog.dom.classlist.addAll = function(a, b) {
    if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) goog.array.forEach(b, function(b) {
        goog.dom.classlist.add(a, b)
    });
    else {
        var c = {};
        goog.array.forEach(goog.dom.classlist.get(a), function(a) {
            c[a] = !0
        });
        goog.array.forEach(b, function(a) {
            c[a] = !0
        });
        a.className = "";
        for (var d in c) a.className += 0 < a.className.length ? " " + d : d
    }
};
goog.dom.classlist.remove = function(a, b) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.remove(b) : goog.dom.classlist.contains(a, b) && (a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
        return a != b
    }).join(" "))
};
goog.dom.classlist.removeAll = function(a, b) {
    goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? goog.array.forEach(b, function(b) {
        goog.dom.classlist.remove(a, b)
    }) : a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
        return !goog.array.contains(b, a)
    }).join(" ")
};
goog.dom.classlist.enable = function(a, b, c) {
    c ? goog.dom.classlist.add(a, b) : goog.dom.classlist.remove(a, b)
};
goog.dom.classlist.enableAll = function(a, b, c) {
    (c ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll)(a, b)
};
goog.dom.classlist.swap = function(a, b, c) {
    return goog.dom.classlist.contains(a, b) ? (goog.dom.classlist.remove(a, b), goog.dom.classlist.add(a, c), !0) : !1
};
goog.dom.classlist.toggle = function(a, b) {
    var c = !goog.dom.classlist.contains(a, b);
    goog.dom.classlist.enable(a, b, c);
    return c
};
goog.dom.classlist.addRemove = function(a, b, c) {
    goog.dom.classlist.remove(a, b);
    goog.dom.classlist.add(a, c)
};
goog.dom.iframe = {};
goog.dom.iframe.BLANK_SOURCE = 'javascript:""';
goog.dom.iframe.BLANK_SOURCE_NEW_FRAME = goog.userAgent.IE ? 'javascript:""' : "javascript:undefined";
goog.dom.iframe.STYLES_ = "border:0;vertical-align:bottom;";
goog.dom.iframe.createBlank = function(a, b) {
    return a.createDom("iframe", {
        frameborder: 0,
        style: goog.dom.iframe.STYLES_ + (b || ""),
        src: goog.dom.iframe.BLANK_SOURCE
    })
};
goog.dom.iframe.writeContent = function(a, b) {
    var c = goog.dom.getFrameContentDocument(a);
    c.open();
    c.write(b);
    c.close()
};
goog.dom.iframe.createWithContent = function(a, b, c, d, e) {
    var f = goog.dom.getDomHelper(a),
        g = [];
    e || g.push("<!DOCTYPE html>");
    g.push("<html><head>", b, "</head><body>", c, "</body></html>");
    b = goog.dom.iframe.createBlank(f, d);
    a.appendChild(b);
    goog.dom.iframe.writeContent(b, g.join(""));
    return b
};
goog.events = {};
goog.events.getVendorPrefixedName_ = function(a) {
    return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase()
};
goog.events.EventType = {
    CLICK: "click",
    RIGHTCLICK: "rightclick",
    DBLCLICK: "dblclick",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEMOVE: "mousemove",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    SELECTSTART: "selectstart",
    KEYPRESS: "keypress",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    BLUR: "blur",
    FOCUS: "focus",
    DEACTIVATE: "deactivate",
    FOCUSIN: goog.userAgent.IE ? "focusin" : "DOMFocusIn",
    FOCUSOUT: goog.userAgent.IE ? "focusout" : "DOMFocusOut",
    CHANGE: "change",
    SELECT: "select",
    SUBMIT: "submit",
    INPUT: "input",
    PROPERTYCHANGE: "propertychange",
    DRAGSTART: "dragstart",
    DRAG: "drag",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DRAGLEAVE: "dragleave",
    DROP: "drop",
    DRAGEND: "dragend",
    TOUCHSTART: "touchstart",
    TOUCHMOVE: "touchmove",
    TOUCHEND: "touchend",
    TOUCHCANCEL: "touchcancel",
    BEFOREUNLOAD: "beforeunload",
    CONSOLEMESSAGE: "consolemessage",
    CONTEXTMENU: "contextmenu",
    DOMCONTENTLOADED: "DOMContentLoaded",
    ERROR: "error",
    HELP: "help",
    LOAD: "load",
    LOSECAPTURE: "losecapture",
    ORIENTATIONCHANGE: "orientationchange",
    READYSTATECHANGE: "readystatechange",
    RESIZE: "resize",
    SCROLL: "scroll",
    UNLOAD: "unload",
    HASHCHANGE: "hashchange",
    PAGEHIDE: "pagehide",
    PAGESHOW: "pageshow",
    POPSTATE: "popstate",
    COPY: "copy",
    PASTE: "paste",
    CUT: "cut",
    BEFORECOPY: "beforecopy",
    BEFORECUT: "beforecut",
    BEFOREPASTE: "beforepaste",
    ONLINE: "online",
    OFFLINE: "offline",
    MESSAGE: "message",
    CONNECT: "connect",
    ANIMATIONSTART: goog.events.getVendorPrefixedName_("AnimationStart"),
    ANIMATIONEND: goog.events.getVendorPrefixedName_("AnimationEnd"),
    ANIMATIONITERATION: goog.events.getVendorPrefixedName_("AnimationIteration"),
    TRANSITIONEND: goog.events.getVendorPrefixedName_("TransitionEnd"),
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTERCANCEL: "pointercancel",
    POINTERMOVE: "pointermove",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    GOTPOINTERCAPTURE: "gotpointercapture",
    LOSTPOINTERCAPTURE: "lostpointercapture",
    MSGESTURECHANGE: "MSGestureChange",
    MSGESTUREEND: "MSGestureEnd",
    MSGESTUREHOLD: "MSGestureHold",
    MSGESTURESTART: "MSGestureStart",
    MSGESTURETAP: "MSGestureTap",
    MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
    MSINERTIASTART: "MSInertiaStart",
    MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
    MSPOINTERCANCEL: "MSPointerCancel",
    MSPOINTERDOWN: "MSPointerDown",
    MSPOINTERENTER: "MSPointerEnter",
    MSPOINTERHOVER: "MSPointerHover",
    MSPOINTERLEAVE: "MSPointerLeave",
    MSPOINTERMOVE: "MSPointerMove",
    MSPOINTEROUT: "MSPointerOut",
    MSPOINTEROVER: "MSPointerOver",
    MSPOINTERUP: "MSPointerUp",
    TEXTINPUT: "textinput",
    COMPOSITIONSTART: "compositionstart",
    COMPOSITIONUPDATE: "compositionupdate",
    COMPOSITIONEND: "compositionend",
    EXIT: "exit",
    LOADABORT: "loadabort",
    LOADCOMMIT: "loadcommit",
    LOADREDIRECT: "loadredirect",
    LOADSTART: "loadstart",
    LOADSTOP: "loadstop",
    RESPONSIVE: "responsive",
    SIZECHANGED: "sizechanged",
    UNRESPONSIVE: "unresponsive",
    VISIBILITYCHANGE: "visibilitychange",
    STORAGE: "storage",
    DOMSUBTREEMODIFIED: "DOMSubtreeModified",
    DOMNODEINSERTED: "DOMNodeInserted",
    DOMNODEREMOVED: "DOMNodeRemoved",
    DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
    DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
    DOMATTRMODIFIED: "DOMAttrModified",
    DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified"
};
goog.events.KeyCodes = {
    WIN_KEY_FF_LINUX: 0,
    MAC_ENTER: 3,
    BACKSPACE: 8,
    TAB: 9,
    NUM_CENTER: 12,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    FF_SEMICOLON: 59,
    FF_EQUALS: 61,
    FF_DASH: 173,
    QUESTION_MARK: 63,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    META: 91,
    WIN_KEY_RIGHT: 92,
    CONTEXT_MENU: 93,
    NUM_ZERO: 96,
    NUM_ONE: 97,
    NUM_TWO: 98,
    NUM_THREE: 99,
    NUM_FOUR: 100,
    NUM_FIVE: 101,
    NUM_SIX: 102,
    NUM_SEVEN: 103,
    NUM_EIGHT: 104,
    NUM_NINE: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_PERIOD: 110,
    NUM_DIVISION: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUMLOCK: 144,
    SCROLL_LOCK: 145,
    FIRST_MEDIA_KEY: 166,
    LAST_MEDIA_KEY: 183,
    SEMICOLON: 186,
    DASH: 189,
    EQUALS: 187,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    APOSTROPHE: 192,
    TILDE: 192,
    SINGLE_QUOTE: 222,
    OPEN_SQUARE_BRACKET: 219,
    BACKSLASH: 220,
    CLOSE_SQUARE_BRACKET: 221,
    WIN_KEY: 224,
    MAC_FF_META: 224,
    MAC_WK_CMD_LEFT: 91,
    MAC_WK_CMD_RIGHT: 93,
    WIN_IME: 229,
    PHANTOM: 255
};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
    if (a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) return !1;
    switch (a.keyCode) {
        case goog.events.KeyCodes.ALT:
        case goog.events.KeyCodes.CAPS_LOCK:
        case goog.events.KeyCodes.CONTEXT_MENU:
        case goog.events.KeyCodes.CTRL:
        case goog.events.KeyCodes.DOWN:
        case goog.events.KeyCodes.END:
        case goog.events.KeyCodes.ESC:
        case goog.events.KeyCodes.HOME:
        case goog.events.KeyCodes.INSERT:
        case goog.events.KeyCodes.LEFT:
        case goog.events.KeyCodes.MAC_FF_META:
        case goog.events.KeyCodes.META:
        case goog.events.KeyCodes.NUMLOCK:
        case goog.events.KeyCodes.NUM_CENTER:
        case goog.events.KeyCodes.PAGE_DOWN:
        case goog.events.KeyCodes.PAGE_UP:
        case goog.events.KeyCodes.PAUSE:
        case goog.events.KeyCodes.PHANTOM:
        case goog.events.KeyCodes.PRINT_SCREEN:
        case goog.events.KeyCodes.RIGHT:
        case goog.events.KeyCodes.SCROLL_LOCK:
        case goog.events.KeyCodes.SHIFT:
        case goog.events.KeyCodes.UP:
        case goog.events.KeyCodes.WIN_KEY:
        case goog.events.KeyCodes.WIN_KEY_RIGHT:
            return !1;
        case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
            return !goog.userAgent.GECKO;
        default:
            return a.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || a.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY
    }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e) {
    if (!(goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525"))) return !0;
    if (goog.userAgent.MAC && e) return goog.events.KeyCodes.isCharacterKey(a);
    if (e && !d) return !1;
    goog.isNumber(b) && (b = goog.events.KeyCodes.normalizeKeyCode(b));
    if (!c && (b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT || goog.userAgent.MAC && b == goog.events.KeyCodes.META)) return !1;
    if (goog.userAgent.WEBKIT && d && c) switch (a) {
        case goog.events.KeyCodes.BACKSLASH:
        case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
        case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
        case goog.events.KeyCodes.TILDE:
        case goog.events.KeyCodes.SEMICOLON:
        case goog.events.KeyCodes.DASH:
        case goog.events.KeyCodes.EQUALS:
        case goog.events.KeyCodes.COMMA:
        case goog.events.KeyCodes.PERIOD:
        case goog.events.KeyCodes.SLASH:
        case goog.events.KeyCodes.APOSTROPHE:
        case goog.events.KeyCodes.SINGLE_QUOTE:
            return !1
    }
    if (goog.userAgent.IE &&
        d && b == a) return !1;
    switch (a) {
        case goog.events.KeyCodes.ENTER:
            return !(goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9));
        case goog.events.KeyCodes.ESC:
            return !goog.userAgent.WEBKIT
    }
    return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
    if (a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE || a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY || a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z || goog.userAgent.WEBKIT && 0 == a) return !0;
    switch (a) {
        case goog.events.KeyCodes.SPACE:
        case goog.events.KeyCodes.QUESTION_MARK:
        case goog.events.KeyCodes.NUM_PLUS:
        case goog.events.KeyCodes.NUM_MINUS:
        case goog.events.KeyCodes.NUM_PERIOD:
        case goog.events.KeyCodes.NUM_DIVISION:
        case goog.events.KeyCodes.SEMICOLON:
        case goog.events.KeyCodes.FF_SEMICOLON:
        case goog.events.KeyCodes.DASH:
        case goog.events.KeyCodes.EQUALS:
        case goog.events.KeyCodes.FF_EQUALS:
        case goog.events.KeyCodes.COMMA:
        case goog.events.KeyCodes.PERIOD:
        case goog.events.KeyCodes.SLASH:
        case goog.events.KeyCodes.APOSTROPHE:
        case goog.events.KeyCodes.SINGLE_QUOTE:
        case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
        case goog.events.KeyCodes.BACKSLASH:
        case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
            return !0;
        default:
            return !1
    }
};
goog.events.KeyCodes.normalizeKeyCode = function(a) {
    return goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(a) : goog.userAgent.MAC && goog.userAgent.WEBKIT ? goog.events.KeyCodes.normalizeMacWebKitKeyCode(a) : a
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(a) {
    switch (a) {
        case goog.events.KeyCodes.FF_EQUALS:
            return goog.events.KeyCodes.EQUALS;
        case goog.events.KeyCodes.FF_SEMICOLON:
            return goog.events.KeyCodes.SEMICOLON;
        case goog.events.KeyCodes.FF_DASH:
            return goog.events.KeyCodes.DASH;
        case goog.events.KeyCodes.MAC_FF_META:
            return goog.events.KeyCodes.META;
        case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
            return goog.events.KeyCodes.WIN_KEY;
        default:
            return a
    }
};
goog.events.KeyCodes.normalizeMacWebKitKeyCode = function(a) {
    switch (a) {
        case goog.events.KeyCodes.MAC_WK_CMD_RIGHT:
            return goog.events.KeyCodes.META;
        default:
            return a
    }
};
goog.i18n = {};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 2).toLowerCase()) && (2 == goog.LOCALE.length ||
    "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4));
goog.i18n.bidi.Format = {
    LRE: "\u202a",
    RLE: "\u202b",
    PDF: "\u202c",
    LRM: "\u200e",
    RLM: "\u200f"
};
goog.i18n.bidi.Dir = {
    LTR: 1,
    RTL: -1,
    NEUTRAL: 0,
    UNKNOWN: 0
};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a, b) {
    return "number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : b ? null : goog.i18n.bidi.Dir.NEUTRAL : null == a ? null : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, b) {
    return b ? a.replace(goog.i18n.bidi.htmlSkipReg_, "") : a
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, b) {
    return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, b) {
    return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
    return goog.i18n.bidi.rtlRe_.test(a)
};
goog.i18n.bidi.isLtrChar = function(a) {
    return goog.i18n.bidi.ltrRe_.test(a)
};
goog.i18n.bidi.isNeutralChar = function(a) {
    return !goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a)
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, b) {
    return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, b) {
    return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, b) {
    a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b);
    return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a)
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, b) {
    return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, b) {
    return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(a) {
    return goog.i18n.bidi.rtlLocalesRe_.test(a)
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(a, b) {
    return (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>") : a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
};
goog.i18n.bidi.guardBracketInText = function(a, b) {
    var c = (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
    return a.replace(goog.i18n.bidi.bracketGuardTextRe_, c + "$&" + c)
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
    return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>"
};
goog.i18n.bidi.enforceRtlInText = function(a) {
    return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
    return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>"
};
goog.i18n.bidi.enforceLtrInText = function(a) {
    return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
    return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
    return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = .4;
goog.i18n.bidi.estimateDirection = function(a, b) {
    for (var c = 0, d = 0, e = !1, f = goog.i18n.bidi.stripHtmlIfNeeded_(a, b).split(goog.i18n.bidi.wordSeparatorRe_), g = 0; g < f.length; g++) {
        var h = f[g];
        goog.i18n.bidi.startsWithRtl(h) ? (c++, d++) : goog.i18n.bidi.isRequiredLtrRe_.test(h) ? e = !0 : goog.i18n.bidi.hasAnyLtr(h) ? d++ : goog.i18n.bidi.hasNumeralsRe_.test(h) && (e = !0)
    }
    return 0 == d ? e ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : c / d > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.detectRtlDirectionality = function(a, b) {
    return goog.i18n.bidi.estimateDirection(a, b) == goog.i18n.bidi.Dir.RTL
};
goog.i18n.bidi.setElementDirAndAlign = function(a, b) {
    a && (b = goog.i18n.bidi.toDir(b)) && (a.style.textAlign = b == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT, a.dir = b == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr")
};
goog.i18n.bidi.DirectionalString = function() {};
goog.math.Box = function(a, b, c, d) {
    this.top = a;
    this.right = b;
    this.bottom = c;
    this.left = d
};
goog.math.Box.boundingBox = function(a) {
    for (var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1; c < arguments.length; c++) {
        var d = arguments[c];
        b.top = Math.min(b.top, d.y);
        b.right = Math.max(b.right, d.x);
        b.bottom = Math.max(b.bottom, d.y);
        b.left = Math.min(b.left, d.x)
    }
    return b
};
goog.math.Box.prototype.clone = function() {
    return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
    return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
    goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
    return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.right = Math.max(this.right, a.right);
    this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
};
goog.math.Box.contains = function(a, b) {
    return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1
};
goog.math.Box.relativePositionX = function(a, b) {
    return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
    return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
    var c = goog.math.Box.relativePositionX(a, b),
        d = goog.math.Box.relativePositionY(a, b);
    return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
    return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
    return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
    this.top = Math.ceil(this.top);
    this.right = Math.ceil(this.right);
    this.bottom = Math.ceil(this.bottom);
    this.left = Math.ceil(this.left);
    return this
};
goog.math.Box.prototype.floor = function() {
    this.top = Math.floor(this.top);
    this.right = Math.floor(this.right);
    this.bottom = Math.floor(this.bottom);
    this.left = Math.floor(this.left);
    return this
};
goog.math.Box.prototype.round = function() {
    this.top = Math.round(this.top);
    this.right = Math.round(this.right);
    this.bottom = Math.round(this.bottom);
    this.left = Math.round(this.left);
    return this
};
goog.math.Box.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
    return this
};
goog.math.Box.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.left *= a;
    this.right *= a;
    this.top *= c;
    this.bottom *= c;
    return this
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
    return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
    return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
    if (b && a in b) return a;
    var c = goog.dom.vendor.getVendorJsPrefix();
    return c ? (c = c.toLowerCase(), c += goog.string.toTitleCase(a), !goog.isDef(b) || c in b ? c : null) : null
};
goog.dom.vendor.getPrefixedEventType = function(a) {
    return ((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase()
};
goog.math.Rect = function(a, b, c, d) {
    this.left = a;
    this.top = b;
    this.width = c;
    this.height = d
};
goog.math.Rect.prototype.clone = function() {
    return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
    return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
    return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1
};
goog.math.Rect.prototype.intersection = function(a) {
    var b = Math.max(this.left, a.left),
        c = Math.min(this.left + this.width, a.left + a.width);
    if (b <= c) {
        var d = Math.max(this.top, a.top);
        a = Math.min(this.top + this.height, a.top + a.height);
        if (d <= a) return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
    return !1
};
goog.math.Rect.intersection = function(a, b) {
    var c = Math.max(a.left, b.left),
        d = Math.min(a.left + a.width, b.left + b.width);
    if (c <= d) {
        var e = Math.max(a.top, b.top),
            f = Math.min(a.top + a.height, b.top + b.height);
        if (e <= f) return new goog.math.Rect(c, e, d - c, f - e)
    }
    return null
};
goog.math.Rect.intersects = function(a, b) {
    return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
    return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
    var c = goog.math.Rect.intersection(a, b);
    if (!c || !c.height || !c.width) return [a.clone()];
    var c = [],
        d = a.top,
        e = a.height,
        f = a.left + a.width,
        g = a.top + a.height,
        h = b.left + b.width,
        k = b.top + b.height;
    b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
    k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
    b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
    h < f && c.push(new goog.math.Rect(h, d, f - h, e));
    return c
};
goog.math.Rect.prototype.difference = function(a) {
    return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
    var b = Math.max(this.left + this.width, a.left + a.width),
        c = Math.max(this.top + this.height, a.top + a.height);
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.width = b - this.left;
    this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
    if (!a || !b) return null;
    var c = a.clone();
    c.boundingRect(b);
    return c
};
goog.math.Rect.prototype.contains = function(a) {
    return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
    var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
    a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
    return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
    return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
    return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
    return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
    return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
    this.left = Math.ceil(this.left);
    this.top = Math.ceil(this.top);
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Rect.prototype.floor = function() {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Rect.prototype.round = function() {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Rect.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
    return this
};
goog.math.Rect.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.left *= a;
    this.width *= a;
    this.top *= c;
    this.height *= c;
    return this
};
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
    goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
    (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
    var c = goog.string.toCamelCase(b);
    if (void 0 === a.style[c]) {
        var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c);
        if (void 0 !== a.style[d]) return d
    }
    return c
};
goog.style.getVendorStyleName_ = function(a, b) {
    var c = goog.string.toCamelCase(b);
    return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
    var c = a.style[goog.string.toCamelCase(b)];
    return "undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
    var c = goog.dom.getOwnerDocument(a);
    return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
    return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
    return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedBoxSizing = function(a) {
    return goog.style.getStyle_(a, "boxSizing") || goog.style.getStyle_(a, "MozBoxSizing") || goog.style.getStyle_(a, "WebkitBoxSizing") || null
};
goog.style.getComputedPosition = function(a) {
    return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
    return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
    return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
    return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
    return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
    return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
    return goog.style.getStyle_(a, "cursor")
};
goog.style.getComputedTransform = function(a) {
    var b = goog.style.getVendorStyleName_(a, "transform");
    return goog.style.getStyle_(a, b) || goog.style.getStyle_(a, "transform")
};
goog.style.setPosition = function(a, b, c) {
    var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
    b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
    a.style.left = goog.style.getPixelStyleValue_(d, e);
    a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
    return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
    a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
    return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body
};
goog.style.getViewportPageOffset = function(a) {
    var b = a.body;
    a = a.documentElement;
    return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
    var b;
    try {
        b = a.getBoundingClientRect()
    } catch (c) {
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    }
    goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
    return b
};
goog.style.getOffsetParent = function(a) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) return a.offsetParent;
    var b = goog.dom.getOwnerDocument(a),
        c = goog.style.getStyle_(a, "position"),
        d = "fixed" == c || "absolute" == c;
    for (a = a.parentNode; a && a != b; a = a.parentNode)
        if (c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) return a;
    return null
};
goog.style.getVisibleRectForElement = function(a) {
    for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement(); a = goog.style.getOffsetParent(a);)
        if (!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
            var g = goog.style.getPageOffset(a),
                h = goog.style.getClientLeftTop(a);
            g.x += h.x;
            g.y += h.y;
            b.top = Math.max(b.top,
                g.y);
            b.right = Math.min(b.right, g.x + a.clientWidth);
            b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
            b.left = Math.max(b.left, g.x)
        }
    d = f.scrollLeft;
    f = f.scrollTop;
    b.left = Math.max(b.left, d);
    b.top = Math.max(b.top, f);
    c = c.getViewportSize();
    b.right = Math.min(b.right, d + c.width);
    b.bottom = Math.min(b.bottom, f + c.height);
    return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
    var d = goog.style.getPageOffset(a),
        e = goog.style.getPageOffset(b),
        f = goog.style.getBorderBox(b),
        g = d.x - e.x - f.left,
        d = d.y - e.y - f.top,
        e = b.clientWidth - a.offsetWidth;
    a = b.clientHeight - a.offsetHeight;
    f = b.scrollLeft;
    b = b.scrollTop;
    c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
    return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
    a = goog.style.getContainerOffsetToScrollInto(a, b, c);
    b.scrollLeft = a.x;
    b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
    if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
        var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
        if (goog.style.isRightToLeft(a)) var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")),
            b = b + c;
        return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
    }
    return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
    var b, c = goog.dom.getOwnerDocument(a),
        d = goog.style.getStyle_(a, "position");
    goog.asserts.assertObject(a, "Parameter is required");
    var e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY),
        f = new goog.math.Coordinate(0, 0),
        g = goog.style.getClientViewportElement(c);
    if (a == g) return f;
    if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS ||
        a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y;
    else if (c.getBoxObjectFor && !e) b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
    else {
        b = a;
        do {
            f.x += b.offsetLeft;
            f.y += b.offsetTop;
            b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
            if (goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
                f.x += c.body.scrollLeft;
                f.y += c.body.scrollTop;
                break
            }
            b = b.offsetParent
        } while (b &&
            b != a);
        if (goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) f.y -= c.body.offsetTop;
        for (b = a;
            (b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) f.x -= b.scrollLeft, goog.userAgent.OPERA && "TR" == b.tagName || (f.y -= b.scrollTop)
    }
    return f
};
goog.style.getPageOffsetLeft = function(a) {
    return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
    return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
    var c = new goog.math.Coordinate(0, 0),
        d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)),
        e = a;
    do {
        var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(goog.asserts.assert(e));
        c.x += f.x;
        c.y += f.y
    } while (d && d != b && (e = d.frameElement) && (d = d.parent));
    return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
    if (b.getDocument() != c.getDocument()) {
        var d = b.getDocument().body;
        c = goog.style.getFramedPageOffset(d, c.getWindow());
        c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
        goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
        a.left += c.x;
        a.top += c.y
    }
};
goog.style.getRelativePosition = function(a, b) {
    var c = goog.style.getClientPosition(a),
        d = goog.style.getClientPosition(b);
    return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
    var b;
    if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top);
    else {
        b = goog.dom.getDomHelper(a).getDocumentScroll();
        var c = goog.style.getPageOffset(a);
        b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
    }
    return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
    goog.asserts.assert(a);
    if (a.nodeType == goog.dom.NodeType.ELEMENT) return goog.style.getClientPositionForElement_(a);
    var b = goog.isFunction(a.getBrowserEvent),
        c = a;
    a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
    return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
    var d = goog.style.getPageOffset(a);
    b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
    goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
    if (b instanceof goog.math.Size) c = b.height, b = b.width;
    else if (void 0 == c) throw Error("missing height argument");
    goog.style.setWidth(a, b);
    goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
    "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
    return a
};
goog.style.setHeight = function(a, b) {
    a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
    a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
    return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a)
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
    if ("none" != goog.style.getStyle_(b, "display")) return a(b);
    var c = b.style,
        d = c.display,
        e = c.visibility,
        f = c.position;
    c.visibility = "hidden";
    c.position = "absolute";
    c.display = "inline";
    var g = a(b);
    c.display = d;
    c.position = f;
    c.visibility = e;
    return g
};
goog.style.getSizeWithDisplay_ = function(a) {
    var b = a.offsetWidth,
        c = a.offsetHeight,
        d = goog.userAgent.WEBKIT && !b && !c;
    return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top))
};
goog.style.getTransformedSize = function(a) {
    if (!a.getBoundingClientRect) return null;
    a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
    return new goog.math.Size(a.right - a.left, a.bottom - a.top)
};
goog.style.getBounds = function(a) {
    var b = goog.style.getPageOffset(a);
    a = goog.style.getSize(a);
    return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
    return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
    return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
    var b = a.style;
    a = "";
    "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
    return "" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
    var c = a.style;
    "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
    var c = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
    a = a.style;
    "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
    goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
    a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
    return "none" != a.style.display
};
goog.style.installStyles = function(a, b) {
    var c = goog.dom.getDomHelper(b),
        d = null,
        e = c.getDocument();
    goog.userAgent.IE && e.createStyleSheet ? (d = e.createStyleSheet(), goog.style.setStyles(d, a)) : (e = c.getElementsByTagNameAndClass("head")[0], e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d)), d = c.createDom("style"), goog.style.setStyles(d, a), c.appendChild(e, d));
    return d
};
goog.style.uninstallStyles = function(a) {
    goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
    goog.userAgent.IE && goog.isDef(a.cssText) ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
    a = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
    a = a.style;
    a.position = "relative";
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
    return "rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
    return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
    c = c ? null : a.getElementsByTagName("*");
    var d = goog.style.unselectableStyle_;
    if (d) {
        if (b = b ? "none" : "", a.style[d] = b, c) {
            a = 0;
            for (var e; e = c[a]; a++) e.style[d] = b
        }
    } else if (goog.userAgent.IE || goog.userAgent.OPERA)
        if (b = b ? "on" : "", a.setAttribute("unselectable", b), c)
            for (a = 0; e = c[a]; a++) e.setAttribute("unselectable", b)
};
goog.style.getBorderBoxSize = function(a) {
    return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "border-box");
    else if (c = a.style, d) {
        var d = goog.style.getPaddingBox(a),
            e = goog.style.getBorderBox(a);
        c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
        c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    } else c.pixelWidth = b.width, c.pixelHeight = b.height
};
goog.style.getContentBoxSize = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = goog.userAgent.IE && a.currentStyle;
    if (c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a);
    c = goog.style.getBorderBoxSize(a);
    b = goog.style.getPaddingBox(a);
    a = goog.style.getBorderBox(a);
    return new goog.math.Size(c.width - a.left -
        b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "content-box");
    else if (c = a.style, d) c.pixelWidth = b.width, c.pixelHeight = b.height;
    else {
        var d = goog.style.getPaddingBox(a),
            e = goog.style.getBorderBox(a);
        c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
        c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
    a = a.style;
    goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
    a.width = Math.max(b.width, 0) + "px";
    a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
    if (/^\d+px?$/.test(b)) return parseInt(b, 10);
    var e = a.style[c],
        f = a.runtimeStyle[c];
    a.runtimeStyle[c] = a.currentStyle[c];
    a.style[c] = b;
    b = a.style[d];
    a.style[c] = e;
    a.runtimeStyle[c] = f;
    return b
};
goog.style.getIePixelDistance_ = function(a, b) {
    var c = goog.style.getCascadedStyle(a, b);
    return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
    if (goog.userAgent.IE) {
        var c = goog.style.getIePixelDistance_(a, b + "Left"),
            d = goog.style.getIePixelDistance_(a, b + "Right"),
            e = goog.style.getIePixelDistance_(a, b + "Top"),
            f = goog.style.getIePixelDistance_(a, b + "Bottom");
        return new goog.math.Box(e, d, f, c)
    }
    c = goog.style.getComputedStyle(a, b + "Left");
    d = goog.style.getComputedStyle(a, b + "Right");
    e = goog.style.getComputedStyle(a, b + "Top");
    f = goog.style.getComputedStyle(a, b + "Bottom");
    return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f),
        parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
    return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
    return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {
    thin: 2,
    medium: 4,
    thick: 6
};
goog.style.getIePixelBorder_ = function(a, b) {
    if ("none" == goog.style.getCascadedStyle(a, b + "Style")) return 0;
    var c = goog.style.getCascadedStyle(a, b + "Width");
    return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        var b = goog.style.getIePixelBorder_(a, "borderLeft"),
            c = goog.style.getIePixelBorder_(a, "borderRight"),
            d = goog.style.getIePixelBorder_(a, "borderTop");
        a = goog.style.getIePixelBorder_(a, "borderBottom");
        return new goog.math.Box(d, c, a, b)
    }
    b = goog.style.getComputedStyle(a, "borderLeftWidth");
    c = goog.style.getComputedStyle(a, "borderRightWidth");
    d = goog.style.getComputedStyle(a, "borderTopWidth");
    a = goog.style.getComputedStyle(a,
        "borderBottomWidth");
    return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = "";
    if (b.body.createTextRange && goog.dom.contains(b, a)) {
        b = b.body.createTextRange();
        b.moveToElementText(a);
        try {
            c = b.queryCommandValue("FontName")
        } catch (d) {
            c = ""
        }
    }
    c || (c = goog.style.getStyle_(a, "fontFamily"));
    a = c.split(",");
    1 < a.length && (c = a[0]);
    return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
    return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
    cm: 1,
    "in": 1,
    mm: 1,
    pc: 1,
    pt: 1
};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
    em: 1,
    ex: 1
};
goog.style.getFontSize = function(a) {
    var b = goog.style.getStyle_(a, "fontSize"),
        c = goog.style.getLengthUnits(b);
    if (b && "px" == c) return parseInt(b, 10);
    if (goog.userAgent.IE) {
        if (c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
        if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
    c =
        goog.dom.createDom("span", {
            style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
        });
    goog.dom.appendChild(a, c);
    b = c.offsetHeight;
    goog.dom.removeNode(c);
    return b
};
goog.style.parseStyleAttribute = function(a) {
    var b = {};
    goog.array.forEach(a.split(/\s*;\s*/), function(a) {
        a = a.split(/\s*:\s*/);
        2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
    });
    return b
};
goog.style.toStyleAttribute = function(a) {
    var b = [];
    goog.object.forEach(a, function(a, d) {
        b.push(goog.string.toSelectorCase(d), ":", a, ";")
    });
    return b.join("")
};
goog.style.setFloat = function(a, b) {
    a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
    return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
    var b = goog.dom.createElement("div");
    a && (b.className = a);
    b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
    a = goog.dom.createElement("div");
    goog.style.setSize(a, "200px", "200px");
    b.appendChild(a);
    goog.dom.appendChild(goog.dom.getDocument().body, b);
    a = b.offsetWidth - b.clientWidth;
    goog.dom.removeNode(b);
    return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
    a = goog.style.getComputedTransform(a);
    return a ? (a = a.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0)
};
goog.style.bidi = {};
goog.style.bidi.getScrollLeft = function(a) {
    var b = goog.style.isRightToLeft(a);
    return b && goog.userAgent.GECKO ? -a.scrollLeft : !b || goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") || "visible" == goog.style.getComputedOverflowX(a) ? a.scrollLeft : a.scrollWidth - a.clientWidth - a.scrollLeft
};
goog.style.bidi.getOffsetStart = function(a) {
    var b = a.offsetLeft,
        c = a.offsetParent;
    c || "fixed" != goog.style.getComputedPosition(a) || (c = goog.dom.getOwnerDocument(a).documentElement);
    if (!c) return b;
    if (goog.userAgent.GECKO) var d = goog.style.getBorderBox(c),
        b = b + d.left;
    else goog.userAgent.isDocumentModeOrHigher(8) && (d = goog.style.getBorderBox(c), b -= d.left);
    return goog.style.isRightToLeft(c) ? c.clientWidth - (b + a.offsetWidth) : b
};
goog.style.bidi.setScrollOffset = function(a, b) {
    b = Math.max(b, 0);
    goog.style.isRightToLeft(a) ? goog.userAgent.GECKO ? a.scrollLeft = -b : goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") ? a.scrollLeft = b : a.scrollLeft = a.scrollWidth - b - a.clientWidth : a.scrollLeft = b
};
goog.style.bidi.setPosition = function(a, b, c, d) {
    goog.isNull(c) || (a.style.top = c + "px");
    d ? (a.style.right = b + "px", a.style.left = "") : (a.style.left = b + "px", a.style.right = "")
};
goog.positioning = {};
goog.positioning.Corner = {
    TOP_LEFT: 0,
    TOP_RIGHT: 2,
    BOTTOM_LEFT: 1,
    BOTTOM_RIGHT: 3,
    TOP_START: 4,
    TOP_END: 6,
    BOTTOM_START: 5,
    BOTTOM_END: 7
};
goog.positioning.CornerBit = {
    BOTTOM: 1,
    RIGHT: 2,
    FLIP_RTL: 4
};
goog.positioning.Overflow = {
    IGNORE: 0,
    ADJUST_X: 1,
    FAIL_X: 2,
    ADJUST_Y: 4,
    FAIL_Y: 8,
    RESIZE_WIDTH: 16,
    RESIZE_HEIGHT: 32,
    ADJUST_X_EXCEPT_OFFSCREEN: 65,
    ADJUST_Y_EXCEPT_OFFSCREEN: 132
};
goog.positioning.OverflowStatus = {
    NONE: 0,
    ADJUSTED_X: 1,
    ADJUSTED_Y: 2,
    WIDTH_ADJUSTED: 4,
    HEIGHT_ADJUSTED: 8,
    FAILED_LEFT: 16,
    FAILED_RIGHT: 32,
    FAILED_TOP: 64,
    FAILED_BOTTOM: 128,
    FAILED_OUTSIDE_VIEWPORT: 256
};
goog.positioning.OverflowStatus.FAILED = goog.positioning.OverflowStatus.FAILED_LEFT | goog.positioning.OverflowStatus.FAILED_RIGHT | goog.positioning.OverflowStatus.FAILED_TOP | goog.positioning.OverflowStatus.FAILED_BOTTOM | goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT;
goog.positioning.OverflowStatus.FAILED_HORIZONTAL = goog.positioning.OverflowStatus.FAILED_LEFT | goog.positioning.OverflowStatus.FAILED_RIGHT;
goog.positioning.OverflowStatus.FAILED_VERTICAL = goog.positioning.OverflowStatus.FAILED_TOP | goog.positioning.OverflowStatus.FAILED_BOTTOM;
goog.positioning.positionAtAnchor = function(a, b, c, d, e, f, g, h, k) {
    goog.asserts.assert(c);
    var l = goog.positioning.getOffsetParentPageOffset(c),
        m = goog.positioning.getVisiblePart_(a);
    goog.style.translateRectForAnotherFrame(m, goog.dom.getDomHelper(a), goog.dom.getDomHelper(c));
    a = goog.positioning.getEffectiveCorner(a, b);
    m = new goog.math.Coordinate(a & goog.positioning.CornerBit.RIGHT ? m.left + m.width : m.left, a & goog.positioning.CornerBit.BOTTOM ? m.top + m.height : m.top);
    m = goog.math.Coordinate.difference(m, l);
    e && (m.x +=
        (a & goog.positioning.CornerBit.RIGHT ? -1 : 1) * e.x, m.y += (a & goog.positioning.CornerBit.BOTTOM ? -1 : 1) * e.y);
    var n;
    if (g)
        if (k) n = k;
        else if (n = goog.style.getVisibleRectForElement(c)) n.top -= l.y, n.right -= l.x, n.bottom -= l.y, n.left -= l.x;
    return goog.positioning.positionAtCoordinate(m, c, d, f, n, g, h)
};
goog.positioning.getOffsetParentPageOffset = function(a) {
    var b;
    if (a = a.offsetParent) {
        var c = a.tagName == goog.dom.TagName.HTML || a.tagName == goog.dom.TagName.BODY;
        c && "static" == goog.style.getComputedPosition(a) || (b = goog.style.getPageOffset(a), c || (b = goog.math.Coordinate.difference(b, new goog.math.Coordinate(goog.style.bidi.getScrollLeft(a), a.scrollTop))))
    }
    return b || new goog.math.Coordinate
};
goog.positioning.getVisiblePart_ = function(a) {
    var b = goog.style.getBounds(a);
    (a = goog.style.getVisibleRectForElement(a)) && b.intersection(goog.math.Rect.createFromBox(a));
    return b
};
goog.positioning.positionAtCoordinate = function(a, b, c, d, e, f, g) {
    a = a.clone();
    var h = goog.positioning.OverflowStatus.NONE;
    c = goog.positioning.getEffectiveCorner(b, c);
    var k = goog.style.getSize(b);
    g = g ? g.clone() : k.clone();
    if (d || c != goog.positioning.Corner.TOP_LEFT) c & goog.positioning.CornerBit.RIGHT ? a.x -= g.width + (d ? d.right : 0) : d && (a.x += d.left), c & goog.positioning.CornerBit.BOTTOM ? a.y -= g.height + (d ? d.bottom : 0) : d && (a.y += d.top);
    if (f && (h = e ? goog.positioning.adjustForViewport_(a, g, e, f) : goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT,
            h & goog.positioning.OverflowStatus.FAILED)) return h;
    goog.style.setPosition(b, a);
    goog.math.Size.equals(k, g) || goog.style.setBorderBoxSize(b, g);
    return h
};
goog.positioning.adjustForViewport_ = function(a, b, c, d) {
    var e = goog.positioning.OverflowStatus.NONE,
        f = goog.positioning.Overflow.ADJUST_X_EXCEPT_OFFSCREEN,
        g = goog.positioning.Overflow.ADJUST_Y_EXCEPT_OFFSCREEN;
    (d & f) == f && (a.x < c.left || a.x >= c.right) && (d &= ~goog.positioning.Overflow.ADJUST_X);
    (d & g) == g && (a.y < c.top || a.y >= c.bottom) && (d &= ~goog.positioning.Overflow.ADJUST_Y);
    a.x < c.left && d & goog.positioning.Overflow.ADJUST_X && (a.x = c.left, e |= goog.positioning.OverflowStatus.ADJUSTED_X);
    a.x < c.left && a.x + b.width > c.right &&
        d & goog.positioning.Overflow.RESIZE_WIDTH && (b.width = Math.max(b.width - (a.x + b.width - c.right), 0), e |= goog.positioning.OverflowStatus.WIDTH_ADJUSTED);
    a.x + b.width > c.right && d & goog.positioning.Overflow.ADJUST_X && (a.x = Math.max(c.right - b.width, c.left), e |= goog.positioning.OverflowStatus.ADJUSTED_X);
    d & goog.positioning.Overflow.FAIL_X && (e = e | (a.x < c.left ? goog.positioning.OverflowStatus.FAILED_LEFT : 0) | (a.x + b.width > c.right ? goog.positioning.OverflowStatus.FAILED_RIGHT : 0));
    a.y < c.top && d & goog.positioning.Overflow.ADJUST_Y &&
        (a.y = c.top, e |= goog.positioning.OverflowStatus.ADJUSTED_Y);
    a.y <= c.top && a.y + b.height < c.bottom && d & goog.positioning.Overflow.RESIZE_HEIGHT && (b.height = Math.max(b.height - (c.top - a.y), 0), a.y = c.top, e |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED);
    a.y >= c.top && a.y + b.height > c.bottom && d & goog.positioning.Overflow.RESIZE_HEIGHT && (b.height = Math.max(b.height - (a.y + b.height - c.bottom), 0), e |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED);
    a.y + b.height > c.bottom && d & goog.positioning.Overflow.ADJUST_Y && (a.y = Math.max(c.bottom -
        b.height, c.top), e |= goog.positioning.OverflowStatus.ADJUSTED_Y);
    d & goog.positioning.Overflow.FAIL_Y && (e = e | (a.y < c.top ? goog.positioning.OverflowStatus.FAILED_TOP : 0) | (a.y + b.height > c.bottom ? goog.positioning.OverflowStatus.FAILED_BOTTOM : 0));
    return e
};
goog.positioning.getEffectiveCorner = function(a, b) {
    return (b & goog.positioning.CornerBit.FLIP_RTL && goog.style.isRightToLeft(a) ? b ^ goog.positioning.CornerBit.RIGHT : b) & ~goog.positioning.CornerBit.FLIP_RTL
};
goog.positioning.flipCornerHorizontal = function(a) {
    return a ^ goog.positioning.CornerBit.RIGHT
};
goog.positioning.flipCornerVertical = function(a) {
    return a ^ goog.positioning.CornerBit.BOTTOM
};
goog.positioning.flipCorner = function(a) {
    return a ^ goog.positioning.CornerBit.BOTTOM ^ goog.positioning.CornerBit.RIGHT
};
goog.positioning.AbstractPosition = function() {};
goog.positioning.AbstractPosition.prototype.reposition = function(a, b, c, d) {};
goog.positioning.AnchoredPosition = function(a, b, c) {
    this.element = a;
    this.corner = b;
    this.overflow_ = c
};
goog.inherits(goog.positioning.AnchoredPosition, goog.positioning.AbstractPosition);
goog.positioning.AnchoredPosition.prototype.reposition = function(a, b, c, d) {
    goog.positioning.positionAtAnchor(this.element, this.corner, a, b, void 0, c, this.overflow_)
};
goog.disposable = {};
goog.disposable.IDisposable = function() {};
goog.Disposable = function() {
    goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {
    OFF: 0,
    PERMANENT: 1,
    INTERACTIVE: 2
};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
    var a = [],
        b;
    for (b in goog.Disposable.instances_) goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
    return a
};
goog.Disposable.clearUndisposedObjects = function() {
    goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
    return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
    if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
        var a = goog.getUid(this);
        if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
        delete goog.Disposable.instances_[a]
    }
};
goog.Disposable.prototype.registerDisposable = function(a) {
    this.addOnDisposeCallback(goog.partial(goog.dispose, a))
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
    this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
    this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a)
};
goog.Disposable.prototype.disposeInternal = function() {
    if (this.onDisposeCallbacks_)
        for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
};
goog.Disposable.isDisposed = function(a) {
    return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
    a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
    for (var b = 0, c = arguments.length; b < c; ++b) {
        var d = arguments[b];
        goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
    }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
    goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
    if (goog.debug.entryPointRegistry.monitorsMayExist_)
        for (var b = goog.debug.entryPointRegistry.monitors_, c = 0; c < b.length; c++) a(goog.bind(b[c].wrap, b[c]))
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
    goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
    for (var b = goog.bind(a.wrap, a), c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](b);
    goog.debug.entryPointRegistry.monitors_.push(a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
    var b = goog.debug.entryPointRegistry.monitors_;
    goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
    a = goog.bind(a.unwrap, a);
    for (var c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) goog.debug.entryPointRegistry.refList_[c](a);
    b.length--
};
goog.reflect = {};
goog.reflect.object = function(a, b) {
    return b
};
goog.reflect.sinkValue = function(a) {
    goog.reflect.sinkValue[" "](a);
    return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
    try {
        return goog.reflect.sinkValue(a[b]), !0
    } catch (c) {}
    return !1
};
goog.events.BrowserFeature = {
    HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"),
    HAS_HTML5_NETWORK_EVENT_SUPPORT: goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && goog.userAgent.isVersionOrHigher("8") ||
        goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"),
    HTML5_NETWORK_EVENTS_FIRE_ON_BODY: goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    TOUCH_ENABLED: "ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints)
};
goog.events.EventId = function(a) {
    this.id = a
};
goog.events.EventId.prototype.toString = function() {
    return this.id
};
goog.events.Event = function(a, b) {
    this.type = a instanceof goog.events.EventId ? String(a) : a;
    this.currentTarget = this.target = b;
    this.defaultPrevented = this.propagationStopped_ = !1;
    this.returnValue_ = !0
};
goog.events.Event.prototype.disposeInternal = function() {};
goog.events.Event.prototype.dispose = function() {};
goog.events.Event.prototype.stopPropagation = function() {
    this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
    this.defaultPrevented = !0;
    this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
    a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
    a.preventDefault()
};
goog.events.BrowserEvent = function(a, b) {
    goog.events.Event.call(this, a ? a.type : "");
    this.relatedTarget = this.currentTarget = this.target = null;
    this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
    this.state = null;
    this.platformModifierKey = !1;
    this.event_ = null;
    a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(a, b) {
    var c = this.type = a.type;
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    var d = a.relatedTarget;
    d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
    this.relatedTarget = d;
    this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
    this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
    this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
    this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
    this.screenX = a.screenX || 0;
    this.screenY = a.screenY || 0;
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
    this.state = a.state;
    this.event_ = a;
    a.defaultPrevented && this.preventDefault()
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
    return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
    return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
    goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
    this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
    goog.events.BrowserEvent.superClass_.preventDefault.call(this);
    var a = this.event_;
    if (a.preventDefault) a.preventDefault();
    else if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
    } catch (b) {}
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
    return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {};
goog.events.Listenable = function() {};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
    a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0
};
goog.events.Listenable.isImplementedBy = function(a) {
    return !(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP])
};
goog.events.ListenableKey = function() {};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
    return ++goog.events.ListenableKey.counter_
};
goog.events.Listener = function(a, b, c, d, e, f) {
    goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
    this.listener = a;
    this.proxy = b;
    this.src = c;
    this.type = d;
    this.capture = !!e;
    this.handler = f;
    this.key = goog.events.ListenableKey.reserveKey();
    this.removed = this.callOnce = !1
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
    this.removed = !0;
    this.handler = this.src = this.proxy = this.listener = null
};
goog.events.ListenerMap = function(a) {
    this.src = a;
    this.listeners = {};
    this.typeCount_ = 0
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
    return this.typeCount_
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
    var a = 0,
        b;
    for (b in this.listeners) a += this.listeners[b].length;
    return a
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
    var f = a.toString();
    a = this.listeners[f];
    a || (a = this.listeners[f] = [], this.typeCount_++);
    var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e); - 1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));
    return b
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
    a = a.toString();
    if (!(a in this.listeners)) return !1;
    var e = this.listeners[a];
    b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
    return -1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
    var b = a.type;
    if (!(b in this.listeners)) return !1;
    var c = goog.array.remove(this.listeners[b], a);
    c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
    return c
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
    a = a && a.toString();
    var b = 0,
        c;
    for (c in this.listeners)
        if (!a || c == a) {
            for (var d = this.listeners[c], e = 0; e < d.length; e++) ++b, d[e].markAsRemoved();
            delete this.listeners[c];
            this.typeCount_--
        }
    return b
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
    var c = this.listeners[a.toString()],
        d = [];
    if (c)
        for (var e = 0; e < c.length; ++e) {
            var f = c[e];
            f.capture == b && d.push(f)
        }
    return d
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
    a = this.listeners[a.toString()];
    var e = -1;
    a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
    return -1 < e ? a[e] : null
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
    var c = goog.isDef(a),
        d = c ? a.toString() : "",
        e = goog.isDef(b);
    return goog.object.some(this.listeners, function(a, g) {
        for (var h = 0; h < a.length; ++h)
            if (!(c && a[h].type != d || e && a[h].capture != b)) return !0;
        return !1
    })
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
        var f = a[e];
        if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) return e
    }
    return -1
};
goog.events.listeners_ = {};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {
    OFF_AND_FAIL: 0,
    OFF_AND_SILENT: 1,
    ON: 2
};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(a, b, c, d, e) {
    if (goog.isArray(b)) {
        for (var f = 0; f < b.length; f++) goog.events.listen(a, b[f], c, d, e);
        return null
    }
    c = goog.events.wrapListener(c);
    return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e)
};
goog.events.listen_ = function(a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");
    var g = !!e;
    if (g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
        if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) return goog.asserts.fail("Can not register capture listener in IE8-."), null;
        if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) return null
    }
    var h = goog.events.getListenerMap_(a);
    h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
    c = h.add(b, c, d, e, f);
    if (c.proxy) return c;
    d = goog.events.getProxy();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    a.addEventListener ? a.addEventListener(b.toString(), d, g) : a.attachEvent(goog.events.getOnString_(b.toString()), d);
    goog.events.listenerCountEstimate_++;
    return c
};
goog.events.getProxy = function() {
    var a = goog.events.handleBrowserEvent_,
        b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
            return a.call(b.src, b.listener, c)
        } : function(c) {
            c = a.call(b.src, b.listener, c);
            if (!c) return c
        };
    return b
};
goog.events.listenOnce = function(a, b, c, d, e) {
    if (goog.isArray(b)) {
        for (var f = 0; f < b.length; f++) goog.events.listenOnce(a, b[f], c, d, e);
        return null
    }
    c = goog.events.wrapListener(c);
    return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e)
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
    b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
    if (goog.isArray(b)) {
        for (var f = 0; f < b.length; f++) goog.events.unlisten(a, b[f], c, d, e);
        return null
    }
    c = goog.events.wrapListener(c);
    if (goog.events.Listenable.isImplementedBy(a)) return a.unlisten(b, c, d, e);
    if (!a) return !1;
    d = !!d;
    if (a = goog.events.getListenerMap_(a))
        if (b = a.getListener(b, c, d, e)) return goog.events.unlistenByKey(b);
    return !1
};
goog.events.unlistenByKey = function(a) {
    if (goog.isNumber(a) || !a || a.removed) return !1;
    var b = a.src;
    if (goog.events.Listenable.isImplementedBy(b)) return b.unlistenByKey(a);
    var c = a.type,
        d = a.proxy;
    b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);
    goog.events.listenerCountEstimate_--;
    (c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();
    return !0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
    b.unlisten(a, c, d, e)
};
goog.events.removeAll = function(a, b) {
    if (!a) return 0;
    if (goog.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(b);
    var c = goog.events.getListenerMap_(a);
    if (!c) return 0;
    var d = 0,
        e = b && b.toString(),
        f;
    for (f in c.listeners)
        if (!e || f == e)
            for (var g = c.listeners[f].concat(), h = 0; h < g.length; ++h) goog.events.unlistenByKey(g[h]) && ++d;
    return d
};
goog.events.removeAllNativeListeners = function() {
    return goog.events.listenerCountEstimate_ = 0
};
goog.events.getListeners = function(a, b, c) {
    return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : [] : []
};
goog.events.getListener = function(a, b, c, d, e) {
    c = goog.events.wrapListener(c);
    d = !!d;
    return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null : null
};
goog.events.hasListener = function(a, b, c) {
    if (goog.events.Listenable.isImplementedBy(a)) return a.hasListener(b, c);
    a = goog.events.getListenerMap_(a);
    return !!a && a.hasListener(b, c)
};
goog.events.expose = function(a) {
    var b = [],
        c;
    for (c in a) a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c]);
    return b.join("\n")
};
goog.events.getOnString_ = function(a) {
    return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
    return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d)
};
goog.events.fireListeners_ = function(a, b, c, d) {
    var e = 1;
    if (a = goog.events.getListenerMap_(a))
        if (b = a.listeners[b.toString()])
            for (b = b.concat(), a = 0; a < b.length; a++) {
                var f = b[a];
                f && f.capture == c && !f.removed && (e &= !1 !== goog.events.fireListener(f, d))
            }
        return Boolean(e)
};
goog.events.fireListener = function(a, b) {
    var c = a.listener,
        d = a.handler || a.src;
    a.callOnce && goog.events.unlistenByKey(a);
    return c.call(d, b)
};
goog.events.getTotalListenerCount = function() {
    return goog.events.listenerCountEstimate_
};
goog.events.dispatchEvent = function(a, b) {
    goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
    return a.dispatchEvent(b)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
    goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
    if (a.removed) return !0;
    if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
        var c = b || goog.getObjectByName("window.event"),
            d = new goog.events.BrowserEvent(c, this),
            e = !0;
        if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
            if (!goog.events.isMarkedIeEvent_(c)) {
                goog.events.markIeEvent_(c);
                for (var c = [], f = d.currentTarget; f; f = f.parentNode) c.push(f);
                for (var f = a.type, g = c.length - 1; !d.propagationStopped_ && 0 <= g; g--) d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g],
                    f, !0, d);
                for (g = 0; !d.propagationStopped_ && g < c.length; g++) d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !1, d)
            }
        } else e = goog.events.fireListener(a, d);
        return e
    }
    return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this))
};
goog.events.markIeEvent_ = function(a) {
    var b = !1;
    if (0 == a.keyCode) try {
        a.keyCode = -1;
        return
    } catch (c) {
        b = !0
    }
    if (b || void 0 == a.returnValue) a.returnValue = !0
};
goog.events.isMarkedIeEvent_ = function(a) {
    return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
    return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.getListenerMap_ = function(a) {
    a = a[goog.events.LISTENER_MAP_PROP_];
    return a instanceof goog.events.ListenerMap ? a : null
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(a) {
    goog.asserts.assert(a, "Listener can not be null.");
    if (goog.isFunction(a)) return a;
    goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
    return a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
        return a.handleEvent(b)
    })
};
goog.debug.entryPointRegistry.register(function(a) {
    goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_)
});
goog.events.EventHandler = function(a) {
    goog.Disposable.call(this);
    this.handler_ = a;
    this.keys_ = {}
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, b, c, d) {
    return this.listen_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenWithScope = function(a, b, c, d, e) {
    return this.listen_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listen_ = function(a, b, c, d, e) {
    goog.isArray(b) || (b && (goog.events.EventHandler.typeArray_[0] = b.toString()), b = goog.events.EventHandler.typeArray_);
    for (var f = 0; f < b.length; f++) {
        var g = goog.events.listen(a, b[f], c || this.handleEvent, d || !1, e || this.handler_ || this);
        if (!g) break;
        this.keys_[g.key] = g
    }
    return this
};
goog.events.EventHandler.prototype.listenOnce = function(a, b, c, d) {
    return this.listenOnce_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenOnceWithScope = function(a, b, c, d, e) {
    return this.listenOnce_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listenOnce_ = function(a, b, c, d, e) {
    if (goog.isArray(b))
        for (var f = 0; f < b.length; f++) this.listenOnce_(a, b[f], c, d, e);
    else {
        a = goog.events.listenOnce(a, b, c || this.handleEvent, d, e || this.handler_ || this);
        if (!a) return this;
        this.keys_[a.key] = a
    }
    return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, b, c, d) {
    return this.listenWithWrapper_(a, b, c, d)
};
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(a, b, c, d, e) {
    return this.listenWithWrapper_(a, b, c, d, e)
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(a, b, c, d, e) {
    b.listen(a, c, d, e || this.handler_ || this, this);
    return this
};
goog.events.EventHandler.prototype.getListenerCount = function() {
    var a = 0,
        b;
    for (b in this.keys_) Object.prototype.hasOwnProperty.call(this.keys_, b) && a++;
    return a
};
goog.events.EventHandler.prototype.unlisten = function(a, b, c, d, e) {
    if (goog.isArray(b))
        for (var f = 0; f < b.length; f++) this.unlisten(a, b[f], c, d, e);
    else if (a = goog.events.getListener(a, b, c || this.handleEvent, d, e || this.handler_ || this)) goog.events.unlistenByKey(a), delete this.keys_[a.key];
    return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, b, c, d, e) {
    b.unlisten(a, c, d, e || this.handler_ || this, this);
    return this
};
goog.events.EventHandler.prototype.removeAll = function() {
    goog.object.forEach(this.keys_, goog.events.unlistenByKey);
    this.keys_ = {}
};
goog.events.EventHandler.prototype.disposeInternal = function() {
    goog.events.EventHandler.superClass_.disposeInternal.call(this);
    this.removeAll()
};
goog.events.EventHandler.prototype.handleEvent = function(a) {
    throw Error("EventHandler.handleEvent not implemented");
};
goog.events.EventTarget = function() {
    goog.Disposable.call(this);
    this.eventTargetListeners_ = new goog.events.ListenerMap(this);
    this.actualEventTarget_ = this
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
    return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
    this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
    goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
    goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
    this.assertInitialized_();
    var b, c = this.getParentEventTarget();
    if (c) {
        b = [];
        for (var d = 1; c; c = c.getParentEventTarget()) b.push(c), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop")
    }
    return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
    goog.events.EventTarget.superClass_.disposeInternal.call(this);
    this.removeAllListeners();
    this.parentEventTarget_ = null
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
    this.assertInitialized_();
    return this.eventTargetListeners_.add(String(a), b, !1, c, d)
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
    return this.eventTargetListeners_.add(String(a), b, !0, c, d)
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
    return this.eventTargetListeners_.remove(String(a), b, c, d)
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
    return this.eventTargetListeners_.removeByKey(a)
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
    return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
    a = this.eventTargetListeners_.listeners[String(a)];
    if (!a) return !0;
    a = a.concat();
    for (var d = !0, e = 0; e < a.length; ++e) {
        var f = a[e];
        if (f && !f.removed && f.capture == b) {
            var g = f.listener,
                h = f.handler || f.src;
            f.callOnce && this.unlistenByKey(f);
            d = !1 !== g.call(h, c) && d
        }
    }
    return d && !1 != c.returnValue_
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
    return this.eventTargetListeners_.getListeners(String(a), b)
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
    return this.eventTargetListeners_.getListener(String(a), b, c, d)
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
    var c = goog.isDef(a) ? String(a) : void 0;
    return this.eventTargetListeners_.hasListener(c, b)
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
    this.actualEventTarget_ = a
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
    goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
    var d = b.type || b;
    if (goog.isString(b)) b = new goog.events.Event(b, a);
    else if (b instanceof goog.events.Event) b.target = b.target || a;
    else {
        var e = b;
        b = new goog.events.Event(d, a);
        goog.object.extend(b, e)
    }
    var e = !0,
        f;
    if (c)
        for (var g = c.length - 1; !b.propagationStopped_ && 0 <= g; g--) f = b.currentTarget = c[g], e = f.fireListeners(d, !0, b) && e;
    b.propagationStopped_ || (f = b.currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
    if (c)
        for (g = 0; !b.propagationStopped_ && g < c.length; g++) f = b.currentTarget = c[g], e = f.fireListeners(d, !1, b) && e;
    return e
};
goog.ui = {};
goog.ui.IdGenerator = function() {};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
    return ":" + (this.nextId_++).toString(36)
};
goog.ui.Component = function(a) {
    goog.events.EventTarget.call(this);
    this.dom_ = a || goog.dom.getDomHelper();
    this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.ALLOW_DETACHED_DECORATION = !1;
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.DEFAULT_BIDI_DIR = 0;
goog.ui.Component.defaultRightToLeft_ = 1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !1 : -1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !0 : null;
goog.ui.Component.EventType = {
    BEFORE_SHOW: "beforeshow",
    SHOW: "show",
    HIDE: "hide",
    DISABLE: "disable",
    ENABLE: "enable",
    HIGHLIGHT: "highlight",
    UNHIGHLIGHT: "unhighlight",
    ACTIVATE: "activate",
    DEACTIVATE: "deactivate",
    SELECT: "select",
    UNSELECT: "unselect",
    CHECK: "check",
    UNCHECK: "uncheck",
    FOCUS: "focus",
    BLUR: "blur",
    OPEN: "open",
    CLOSE: "close",
    ENTER: "enter",
    LEAVE: "leave",
    ACTION: "action",
    CHANGE: "change"
};
goog.ui.Component.Error = {
    NOT_SUPPORTED: "Method not supported",
    DECORATE_INVALID: "Invalid element to decorate",
    ALREADY_RENDERED: "Component already rendered",
    PARENT_UNABLE_TO_BE_SET: "Unable to set parent component",
    CHILD_INDEX_OUT_OF_BOUNDS: "Child component index out of bounds",
    NOT_OUR_CHILD: "Child is not in parent component",
    NOT_IN_DOCUMENT: "Operation not supported while component is not in document",
    STATE_INVALID: "Invalid component state"
};
goog.ui.Component.State = {
    ALL: 255,
    DISABLED: 1,
    HOVER: 2,
    ACTIVE: 4,
    SELECTED: 8,
    CHECKED: 16,
    FOCUSED: 32,
    OPENED: 64
};
goog.ui.Component.getStateTransitionEvent = function(a, b) {
    switch (a) {
        case goog.ui.Component.State.DISABLED:
            return b ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
        case goog.ui.Component.State.HOVER:
            return b ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
        case goog.ui.Component.State.ACTIVE:
            return b ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
        case goog.ui.Component.State.SELECTED:
            return b ? goog.ui.Component.EventType.SELECT :
                goog.ui.Component.EventType.UNSELECT;
        case goog.ui.Component.State.CHECKED:
            return b ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
        case goog.ui.Component.State.FOCUSED:
            return b ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
        case goog.ui.Component.State.OPENED:
            return b ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE
    }
    throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(a) {
    goog.ui.Component.defaultRightToLeft_ = a
};
goog.ui.Component.prototype.id_ = null;
goog.ui.Component.prototype.inDocument_ = !1;
goog.ui.Component.prototype.element_ = null;
goog.ui.Component.prototype.rightToLeft_ = null;
goog.ui.Component.prototype.model_ = null;
goog.ui.Component.prototype.parent_ = null;
goog.ui.Component.prototype.children_ = null;
goog.ui.Component.prototype.childIndex_ = null;
goog.ui.Component.prototype.wasDecorated_ = !1;
goog.ui.Component.prototype.getId = function() {
    return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId())
};
goog.ui.Component.prototype.setId = function(a) {
    this.parent_ && this.parent_.childIndex_ && (goog.object.remove(this.parent_.childIndex_, this.id_), goog.object.add(this.parent_.childIndex_, a, this));
    this.id_ = a
};
goog.ui.Component.prototype.getElement = function() {
    return this.element_
};
goog.ui.Component.prototype.getElementStrict = function() {
    var a = this.element_;
    goog.asserts.assert(a, "Can not call getElementStrict before rendering/decorating.");
    return a
};
goog.ui.Component.prototype.setElementInternal = function(a) {
    this.element_ = a
};
goog.ui.Component.prototype.getElementsByClass = function(a) {
    return this.element_ ? this.dom_.getElementsByClass(a, this.element_) : []
};
goog.ui.Component.prototype.getElementByClass = function(a) {
    return this.element_ ? this.dom_.getElementByClass(a, this.element_) : null
};
goog.ui.Component.prototype.getRequiredElementByClass = function(a) {
    var b = this.getElementByClass(a);
    goog.asserts.assert(b, "Expected element in component with class: %s", a);
    return b
};
goog.ui.Component.prototype.getHandler = function() {
    this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this));
    return this.googUiComponentHandler_
};
goog.ui.Component.prototype.setParent = function(a) {
    if (this == a) throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
    if (a && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != a) throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
    this.parent_ = a;
    goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getParent = function() {
    return this.parent_
};
goog.ui.Component.prototype.setParentEventTarget = function(a) {
    if (this.parent_ && this.parent_ != a) throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
    goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getDomHelper = function() {
    return this.dom_
};
goog.ui.Component.prototype.isInDocument = function() {
    return this.inDocument_
};
goog.ui.Component.prototype.createDom = function() {
    this.element_ = this.dom_.createElement("div")
};
goog.ui.Component.prototype.render = function(a) {
    this.render_(a)
};
goog.ui.Component.prototype.renderBefore = function(a) {
    this.render_(a.parentNode, a)
};
goog.ui.Component.prototype.render_ = function(a, b) {
    if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
    this.element_ || this.createDom();
    a ? a.insertBefore(this.element_, b || null) : this.dom_.getDocument().body.appendChild(this.element_);
    this.parent_ && !this.parent_.isInDocument() || this.enterDocument()
};
goog.ui.Component.prototype.decorate = function(a) {
    if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
    if (a && this.canDecorate(a)) {
        this.wasDecorated_ = !0;
        var b = goog.dom.getOwnerDocument(a);
        this.dom_ && this.dom_.getDocument() == b || (this.dom_ = goog.dom.getDomHelper(a));
        this.decorateInternal(a);
        goog.ui.Component.ALLOW_DETACHED_DECORATION && !goog.dom.contains(b, a) || this.enterDocument()
    } else throw Error(goog.ui.Component.Error.DECORATE_INVALID);
};
goog.ui.Component.prototype.canDecorate = function(a) {
    return !0
};
goog.ui.Component.prototype.wasDecorated = function() {
    return this.wasDecorated_
};
goog.ui.Component.prototype.decorateInternal = function(a) {
    this.element_ = a
};
goog.ui.Component.prototype.enterDocument = function() {
    this.inDocument_ = !0;
    this.forEachChild(function(a) {
        !a.isInDocument() && a.getElement() && a.enterDocument()
    })
};
goog.ui.Component.prototype.exitDocument = function() {
    this.forEachChild(function(a) {
        a.isInDocument() && a.exitDocument()
    });
    this.googUiComponentHandler_ && this.googUiComponentHandler_.removeAll();
    this.inDocument_ = !1
};
goog.ui.Component.prototype.disposeInternal = function() {
    this.inDocument_ && this.exitDocument();
    this.googUiComponentHandler_ && (this.googUiComponentHandler_.dispose(), delete this.googUiComponentHandler_);
    this.forEachChild(function(a) {
        a.dispose()
    });
    !this.wasDecorated_ && this.element_ && goog.dom.removeNode(this.element_);
    this.parent_ = this.model_ = this.element_ = this.childIndex_ = this.children_ = null;
    goog.ui.Component.superClass_.disposeInternal.call(this)
};
goog.ui.Component.prototype.makeId = function(a) {
    return this.getId() + "." + a
};
goog.ui.Component.prototype.makeIds = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = this.makeId(a[c]);
    return b
};
goog.ui.Component.prototype.getModel = function() {
    return this.model_
};
goog.ui.Component.prototype.setModel = function(a) {
    this.model_ = a
};
goog.ui.Component.prototype.getFragmentFromId = function(a) {
    return a.substring(this.getId().length + 1)
};
goog.ui.Component.prototype.getElementByFragment = function(a) {
    if (!this.inDocument_) throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
    return this.dom_.getElement(this.makeId(a))
};
goog.ui.Component.prototype.addChild = function(a, b) {
    this.addChildAt(a, this.getChildCount(), b)
};
goog.ui.Component.prototype.addChildAt = function(a, b, c) {
    goog.asserts.assert(!!a, "Provided element must not be null.");
    if (a.inDocument_ && (c || !this.inDocument_)) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
    if (0 > b || b > this.getChildCount()) throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
    this.childIndex_ && this.children_ || (this.childIndex_ = {}, this.children_ = []);
    a.getParent() == this ? (goog.object.set(this.childIndex_, a.getId(), a), goog.array.remove(this.children_, a)) : goog.object.add(this.childIndex_,
        a.getId(), a);
    a.setParent(this);
    goog.array.insertAt(this.children_, a, b);
    a.inDocument_ && this.inDocument_ && a.getParent() == this ? (c = this.getContentElement(), c.insertBefore(a.getElement(), c.childNodes[b] || null)) : c ? (this.element_ || this.createDom(), b = this.getChildAt(b + 1), a.render_(this.getContentElement(), b ? b.element_ : null)) : this.inDocument_ && !a.inDocument_ && a.element_ && a.element_.parentNode && a.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT && a.enterDocument()
};
goog.ui.Component.prototype.getContentElement = function() {
    return this.element_
};
goog.ui.Component.prototype.isRightToLeft = function() {
    null == this.rightToLeft_ && (this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body));
    return this.rightToLeft_
};
goog.ui.Component.prototype.setRightToLeft = function(a) {
    if (this.inDocument_) throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
    this.rightToLeft_ = a
};
goog.ui.Component.prototype.hasChildren = function() {
    return !!this.children_ && 0 != this.children_.length
};
goog.ui.Component.prototype.getChildCount = function() {
    return this.children_ ? this.children_.length : 0
};
goog.ui.Component.prototype.getChildIds = function() {
    var a = [];
    this.forEachChild(function(b) {
        a.push(b.getId())
    });
    return a
};
goog.ui.Component.prototype.getChild = function(a) {
    return this.childIndex_ && a ? goog.object.get(this.childIndex_, a) || null : null
};
goog.ui.Component.prototype.getChildAt = function(a) {
    return this.children_ ? this.children_[a] || null : null
};
goog.ui.Component.prototype.forEachChild = function(a, b) {
    this.children_ && goog.array.forEach(this.children_, a, b)
};
goog.ui.Component.prototype.indexOfChild = function(a) {
    return this.children_ && a ? goog.array.indexOf(this.children_, a) : -1
};
goog.ui.Component.prototype.removeChild = function(a, b) {
    if (a) {
        var c = goog.isString(a) ? a : a.getId();
        a = this.getChild(c);
        c && a && (goog.object.remove(this.childIndex_, c), goog.array.remove(this.children_, a), b && (a.exitDocument(), a.element_ && goog.dom.removeNode(a.element_)), a.setParent(null))
    }
    if (!a) throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
    return a
};
goog.ui.Component.prototype.removeChildAt = function(a, b) {
    return this.removeChild(this.getChildAt(a), b)
};
goog.ui.Component.prototype.removeChildren = function(a) {
    for (var b = []; this.hasChildren();) b.push(this.removeChildAt(0, a));
    return b
};
picker.api.CalloutArrow = function(a, b) {
    goog.ui.Component.call(this, b);
    this.isRtl_ = a
};
goog.inherits(picker.api.CalloutArrow, goog.ui.Component);
picker.api.CalloutArrow.prototype.createDom = function() {
    var a = this.getDomHelper(),
        b = a.createDom("div");
    this.setElementInternal(b);
    var c = a.createDom("div", "picker-min-arrow-inner"),
        d = a.createDom("div", "picker-min-arrow-border");
    a.appendChild(b, c);
    a.appendChild(b, d)
};
picker.api.CalloutArrow.prototype.updateStyles_ = function(a, b) {
    var c = this.getElement();
    goog.style.setStyle(c, "left", "");
    goog.style.setStyle(c, "right", "");
    goog.dom.classlist.remove(a, "picker-min-top");
    goog.dom.classlist.remove(a, "picker-min-bottom");
    b = goog.positioning.getEffectiveCorner(a, b);
    b & goog.positioning.CornerBit.BOTTOM ? (goog.dom.classlist.set(c, "picker-min-arrow-down"), goog.dom.classlist.add(a, "picker-min-bottom")) : (goog.dom.classlist.set(c, "picker-min-arrow-up"), goog.dom.classlist.add(a, "picker-min-top"))
};
picker.api.CalloutArrow.prototype.update = function(a, b, c) {
    this.isInDocument() && (c || (c = new goog.math.Box(0, 0, 0, 0)), this.updateStyles_(a, b), a = this.getElement(), b & goog.positioning.CornerBit.RIGHT ? goog.style.setStyle(a, "right", -c.right + "px") : goog.style.setStyle(a, "left", -c.left + "px"))
};
picker.api.CalloutArrow.prototype.centerAtElement = function(a, b, c) {
    this.isInDocument() && (this.updateStyles_(b, c), b = this.getElement(), goog.style.setStyle(b, "margin-left", "0"), goog.style.setStyle(b, "margin-right", "0"), c = goog.style.getRelativePosition(a, b), c.x += goog.style.getBorderBoxSize(a).width / 2, this.isRtl_ ? goog.style.setStyle(b, "right", -c.x + "px") : goog.style.setStyle(b, "left", c.x + "px"), goog.style.setStyle(b, "margin-left", ""), goog.style.setStyle(b, "margin-right", ""))
};
picker.api.GadgetsLoader = {};
picker.api.GadgetsLoader.URL_FOR_CONTAINERS_ = "//www-onepick-opensocial.googleusercontent.com/gadgets/js/rpc.js?c=1&container=onepick";
picker.api.GadgetsLoader.LOAD_CHECKING_POLL_RATE_ = 100;
picker.api.GadgetsLoader.load = function(a, b) {
    picker.api.GadgetsLoader.loadFromUrl(picker.api.GadgetsLoader.URL_FOR_CONTAINERS_, b)
};
picker.api.GadgetsLoader.loadFromUrl = function(a, b) {
    if (!picker.api.GadgetsLoader.hasGadgetsLoaded(b)) {
        var c = b || goog.dom.getDomHelper(document),
            d = c.createElement("script");
        d.src = a;
        d.type = "text/javascript";
        c.getDocument().body.appendChild(d)
    }
};
picker.api.GadgetsLoader.hasGadgetsLoaded = function(a) {
    a = a && a.getWindow() || window;
    return a.gadgets && a.gadgets.rpc
};
picker.api.GadgetsLoader.execOnLoadCallbacks_ = null;
picker.api.GadgetsLoader.execOnLoad = function(a, b) {
    var c = b && b.getWindow() || window;
    if (picker.api.GadgetsLoader.hasGadgetsLoaded(b)) a();
    else if (picker.api.GadgetsLoader.execOnLoadCallbacks_) picker.api.GadgetsLoader.execOnLoadCallbacks_.push(a);
    else var d = picker.api.GadgetsLoader.execOnLoadCallbacks_ = [a],
        e = c.setInterval(function() {
            if (picker.api.GadgetsLoader.hasGadgetsLoaded(b)) {
                c.clearInterval(e);
                for (var a = 0; a < d.length; a++) d[a]();
                picker.api.GadgetsLoader.execOnLoadCallbacks_ = null
            }
        }, picker.api.GadgetsLoader.LOAD_CHECKING_POLL_RATE_)
};
goog.events.FocusHandler = function(a) {
    goog.events.EventTarget.call(this);
    this.element_ = a;
    a = goog.userAgent.IE ? "focusout" : "blur";
    this.listenKeyIn_ = goog.events.listen(this.element_, goog.userAgent.IE ? "focusin" : "focus", this, !goog.userAgent.IE);
    this.listenKeyOut_ = goog.events.listen(this.element_, a, this, !goog.userAgent.IE)
};
goog.inherits(goog.events.FocusHandler, goog.events.EventTarget);
goog.events.FocusHandler.EventType = {
    FOCUSIN: "focusin",
    FOCUSOUT: "focusout"
};
goog.events.FocusHandler.prototype.handleEvent = function(a) {
    var b = a.getBrowserEvent(),
        b = new goog.events.BrowserEvent(b);
    b.type = "focusin" == a.type || "focus" == a.type ? goog.events.FocusHandler.EventType.FOCUSIN : goog.events.FocusHandler.EventType.FOCUSOUT;
    this.dispatchEvent(b)
};
goog.events.FocusHandler.prototype.disposeInternal = function() {
    goog.events.FocusHandler.superClass_.disposeInternal.call(this);
    goog.events.unlistenByKey(this.listenKeyIn_);
    goog.events.unlistenByKey(this.listenKeyOut_);
    delete this.element_
};
goog.Timer = function(a, b) {
    goog.events.EventTarget.call(this);
    this.interval_ = a || 1;
    this.timerObject_ = b || goog.Timer.defaultTimerObject;
    this.boundTick_ = goog.bind(this.tick_, this);
    this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
    return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
    this.interval_ = a;
    this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
    if (this.enabled) {
        var a = goog.now() - this.last_;
        0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()))
    }
};
goog.Timer.prototype.dispatchTick = function() {
    this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
    this.enabled = !0;
    this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now())
};
goog.Timer.prototype.stop = function() {
    this.enabled = !1;
    this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
};
goog.Timer.prototype.disposeInternal = function() {
    goog.Timer.superClass_.disposeInternal.call(this);
    this.stop();
    delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
    if (goog.isFunction(a)) c && (a = goog.bind(a, c));
    else if (a && "function" == typeof a.handleEvent) a = goog.bind(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0)
};
goog.Timer.clear = function(a) {
    goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.positioning.AbsolutePosition = function(a, b) {
    this.coordinate = a instanceof goog.math.Coordinate ? a : new goog.math.Coordinate(a, b)
};
goog.inherits(goog.positioning.AbsolutePosition, goog.positioning.AbstractPosition);
goog.positioning.AbsolutePosition.prototype.reposition = function(a, b, c, d) {
    goog.positioning.positionAtCoordinate(this.coordinate, a, b, c, null, null, d)
};
goog.positioning.AnchoredViewportPosition = function(a, b, c, d) {
    goog.positioning.AnchoredPosition.call(this, a, b);
    this.lastResortOverflow_ = c ? goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.ADJUST_Y : goog.positioning.Overflow.IGNORE;
    this.overflowConstraint_ = d || void 0
};
goog.inherits(goog.positioning.AnchoredViewportPosition, goog.positioning.AnchoredPosition);
goog.positioning.AnchoredViewportPosition.prototype.getOverflowConstraint = function() {
    return this.overflowConstraint_
};
goog.positioning.AnchoredViewportPosition.prototype.setOverflowConstraint = function(a) {
    this.overflowConstraint_ = a
};
goog.positioning.AnchoredViewportPosition.prototype.getLastResortOverflow = function() {
    return this.lastResortOverflow_
};
goog.positioning.AnchoredViewportPosition.prototype.setLastResortOverflow = function(a) {
    this.lastResortOverflow_ = a
};
goog.positioning.AnchoredViewportPosition.prototype.reposition = function(a, b, c, d) {
    var e = goog.positioning.positionAtAnchor(this.element, this.corner, a, b, null, c, goog.positioning.Overflow.FAIL_X | goog.positioning.Overflow.FAIL_Y, d, this.overflowConstraint_);
    if (e & goog.positioning.OverflowStatus.FAILED) {
        var f = this.adjustCorner(e, this.corner);
        b = this.adjustCorner(e, b);
        e = goog.positioning.positionAtAnchor(this.element, f, a, b, null, c, goog.positioning.Overflow.FAIL_X | goog.positioning.Overflow.FAIL_Y, d, this.overflowConstraint_);
        e & goog.positioning.OverflowStatus.FAILED && (f = this.adjustCorner(e, f), b = this.adjustCorner(e, b), goog.positioning.positionAtAnchor(this.element, f, a, b, null, c, this.getLastResortOverflow(), d, this.overflowConstraint_))
    }
};
goog.positioning.AnchoredViewportPosition.prototype.adjustCorner = function(a, b) {
    a & goog.positioning.OverflowStatus.FAILED_HORIZONTAL && (b = goog.positioning.flipCornerHorizontal(b));
    a & goog.positioning.OverflowStatus.FAILED_VERTICAL && (b = goog.positioning.flipCornerVertical(b));
    return b
};
goog.positioning.ClientPosition = function(a, b) {
    this.coordinate = a instanceof goog.math.Coordinate ? a : new goog.math.Coordinate(a, b)
};
goog.inherits(goog.positioning.ClientPosition, goog.positioning.AbstractPosition);
goog.positioning.ClientPosition.prototype.reposition = function(a, b, c, d) {
    goog.asserts.assert(a);
    var e = goog.style.getViewportPageOffset(goog.dom.getOwnerDocument(a)),
        f = this.coordinate.x + e.x,
        e = this.coordinate.y + e.y,
        g = goog.positioning.getOffsetParentPageOffset(a),
        f = f - g.x,
        e = e - g.y;
    goog.positioning.positionAtCoordinate(new goog.math.Coordinate(f, e), a, b, c, null, null, d)
};
goog.positioning.ViewportClientPosition = function(a, b) {
    goog.positioning.ClientPosition.call(this, a, b)
};
goog.inherits(goog.positioning.ViewportClientPosition, goog.positioning.ClientPosition);
goog.positioning.ViewportClientPosition.prototype.lastResortOverflow_ = 0;
goog.positioning.ViewportClientPosition.prototype.setLastResortOverflow = function(a) {
    this.lastResortOverflow_ = a
};
goog.positioning.ViewportClientPosition.prototype.reposition = function(a, b, c, d) {
    var e = goog.style.getClientViewportElement(a),
        e = goog.style.getVisibleRectForElement(e),
        f = goog.dom.getDomHelper(a).getDocumentScrollElement(),
        f = new goog.math.Coordinate(this.coordinate.x + f.scrollLeft, this.coordinate.y + f.scrollTop),
        g = goog.positioning.Overflow.FAIL_X | goog.positioning.Overflow.FAIL_Y,
        h = b,
        k = goog.positioning.positionAtCoordinate(f, a, h, c, e, g, d);
    if (0 != (k & goog.positioning.OverflowStatus.FAILED)) {
        if (k & goog.positioning.OverflowStatus.FAILED_LEFT ||
            k & goog.positioning.OverflowStatus.FAILED_RIGHT) h = goog.positioning.flipCornerHorizontal(h);
        if (k & goog.positioning.OverflowStatus.FAILED_TOP || k & goog.positioning.OverflowStatus.FAILED_BOTTOM) h = goog.positioning.flipCornerVertical(h);
        k = goog.positioning.positionAtCoordinate(f, a, h, c, e, g, d);
        0 != (k & goog.positioning.OverflowStatus.FAILED) && goog.positioning.positionAtCoordinate(f, a, b, c, e, this.lastResortOverflow_, d)
    }
};
goog.positioning.ViewportPosition = function(a, b) {
    this.coordinate = a instanceof goog.math.Coordinate ? a : new goog.math.Coordinate(a, b)
};
goog.inherits(goog.positioning.ViewportPosition, goog.positioning.AbstractPosition);
goog.positioning.ViewportPosition.prototype.reposition = function(a, b, c, d) {
    goog.positioning.positionAtAnchor(goog.style.getClientViewportElement(a), goog.positioning.Corner.TOP_LEFT, a, b, this.coordinate, c, null, d)
};
goog.fx = {};
goog.fx.Transition = function() {};
goog.fx.Transition.EventType = {
    PLAY: "play",
    BEGIN: "begin",
    RESUME: "resume",
    END: "end",
    STOP: "stop",
    FINISH: "finish",
    PAUSE: "pause"
};
goog.ui.PopupBase = function(a, b) {
    goog.events.EventTarget.call(this);
    this.handler_ = new goog.events.EventHandler(this);
    this.setElement(a || null);
    b && this.setType(b)
};
goog.inherits(goog.ui.PopupBase, goog.events.EventTarget);
goog.ui.PopupBase.Type = {
    TOGGLE_DISPLAY: "toggle_display",
    MOVE_OFFSCREEN: "move_offscreen"
};
goog.ui.PopupBase.prototype.element_ = null;
goog.ui.PopupBase.prototype.autoHide_ = !0;
goog.ui.PopupBase.prototype.autoHidePartners_ = null;
goog.ui.PopupBase.prototype.autoHideRegion_ = null;
goog.ui.PopupBase.prototype.isVisible_ = !1;
goog.ui.PopupBase.prototype.shouldHideAsync_ = !1;
goog.ui.PopupBase.prototype.lastShowTime_ = -1;
goog.ui.PopupBase.prototype.lastHideTime_ = -1;
goog.ui.PopupBase.prototype.hideOnEscape_ = !1;
goog.ui.PopupBase.prototype.enableCrossIframeDismissal_ = !0;
goog.ui.PopupBase.prototype.type_ = goog.ui.PopupBase.Type.TOGGLE_DISPLAY;
goog.ui.PopupBase.EventType = {
    BEFORE_SHOW: "beforeshow",
    SHOW: "show",
    BEFORE_HIDE: "beforehide",
    HIDE: "hide"
};
goog.ui.PopupBase.DEBOUNCE_DELAY_MS = 150;
goog.ui.PopupBase.prototype.getType = function() {
    return this.type_
};
goog.ui.PopupBase.prototype.setType = function(a) {
    this.type_ = a
};
goog.ui.PopupBase.prototype.shouldHideAsync = function() {
    return this.shouldHideAsync_
};
goog.ui.PopupBase.prototype.setShouldHideAsync = function(a) {
    this.shouldHideAsync_ = a
};
goog.ui.PopupBase.prototype.getElement = function() {
    return this.element_
};
goog.ui.PopupBase.prototype.setElement = function(a) {
    this.ensureNotVisible_();
    this.element_ = a
};
goog.ui.PopupBase.prototype.getAutoHide = function() {
    return this.autoHide_
};
goog.ui.PopupBase.prototype.setAutoHide = function(a) {
    this.ensureNotVisible_();
    this.autoHide_ = a
};
goog.ui.PopupBase.prototype.addAutoHidePartner = function(a) {
    this.autoHidePartners_ || (this.autoHidePartners_ = []);
    goog.array.insert(this.autoHidePartners_, a)
};
goog.ui.PopupBase.prototype.removeAutoHidePartner = function(a) {
    this.autoHidePartners_ && goog.array.remove(this.autoHidePartners_, a)
};
goog.ui.PopupBase.prototype.getHideOnEscape = function() {
    return this.hideOnEscape_
};
goog.ui.PopupBase.prototype.setHideOnEscape = function(a) {
    this.ensureNotVisible_();
    this.hideOnEscape_ = a
};
goog.ui.PopupBase.prototype.getEnableCrossIframeDismissal = function() {
    return this.enableCrossIframeDismissal_
};
goog.ui.PopupBase.prototype.setEnableCrossIframeDismissal = function(a) {
    this.enableCrossIframeDismissal_ = a
};
goog.ui.PopupBase.prototype.getAutoHideRegion = function() {
    return this.autoHideRegion_
};
goog.ui.PopupBase.prototype.setAutoHideRegion = function(a) {
    this.autoHideRegion_ = a
};
goog.ui.PopupBase.prototype.setTransition = function(a, b) {
    this.showTransition_ = a;
    this.hideTransition_ = b
};
goog.ui.PopupBase.prototype.getLastShowTime = function() {
    return this.lastShowTime_
};
goog.ui.PopupBase.prototype.getLastHideTime = function() {
    return this.lastHideTime_
};
goog.ui.PopupBase.prototype.getHandler = function() {
    return this.handler_
};
goog.ui.PopupBase.prototype.ensureNotVisible_ = function() {
    if (this.isVisible_) throw Error("Can not change this state of the popup while showing.");
};
goog.ui.PopupBase.prototype.isVisible = function() {
    return this.isVisible_
};
goog.ui.PopupBase.prototype.isOrWasRecentlyVisible = function() {
    return this.isVisible_ || goog.now() - this.lastHideTime_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS
};
goog.ui.PopupBase.prototype.setVisible = function(a) {
    this.showTransition_ && this.showTransition_.stop();
    this.hideTransition_ && this.hideTransition_.stop();
    a ? this.show_() : this.hide_()
};
goog.ui.PopupBase.prototype.reposition = goog.nullFunction;
goog.ui.PopupBase.prototype.show_ = function() {
    if (!this.isVisible_ && this.onBeforeShow()) {
        if (!this.element_) throw Error("Caller must call setElement before trying to show the popup");
        this.reposition();
        var a = goog.dom.getOwnerDocument(this.element_);
        this.hideOnEscape_ && this.handler_.listen(a, goog.events.EventType.KEYDOWN, this.onDocumentKeyDown_, !0);
        if (this.autoHide_)
            if (this.handler_.listen(a, goog.events.EventType.MOUSEDOWN, this.onDocumentMouseDown_, !0), goog.userAgent.IE) {
                var b;
                try {
                    b = a.activeElement
                } catch (c) {}
                for (; b &&
                    "IFRAME" == b.nodeName;) {
                    try {
                        var d = goog.dom.getFrameContentDocument(b)
                    } catch (e) {
                        break
                    }
                    a = d;
                    b = a.activeElement
                }
                this.handler_.listen(a, goog.events.EventType.MOUSEDOWN, this.onDocumentMouseDown_, !0);
                this.handler_.listen(a, goog.events.EventType.DEACTIVATE, this.onDocumentBlur_)
            } else this.handler_.listen(a, goog.events.EventType.BLUR, this.onDocumentBlur_);
        this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY ? this.showPopupElement() : this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN && this.reposition();
        this.isVisible_ = !0;
        this.lastShowTime_ = goog.now();
        this.lastHideTime_ = -1;
        if (this.showTransition_) goog.events.listenOnce(this.showTransition_, goog.fx.Transition.EventType.END, this.onShow_, !1, this), this.showTransition_.play();
        else this.onShow_()
    }
};
goog.ui.PopupBase.prototype.hide_ = function(a) {
    if (!this.isVisible_ || !this.onBeforeHide_(a)) return !1;
    this.handler_ && this.handler_.removeAll();
    this.isVisible_ = !1;
    this.lastHideTime_ = goog.now();
    this.hideTransition_ ? (goog.events.listenOnce(this.hideTransition_, goog.fx.Transition.EventType.END, goog.partial(this.continueHidingPopup_, a), !1, this), this.hideTransition_.play()) : this.continueHidingPopup_(a);
    return !0
};
goog.ui.PopupBase.prototype.continueHidingPopup_ = function(a) {
    this.type_ == goog.ui.PopupBase.Type.TOGGLE_DISPLAY ? this.shouldHideAsync_ ? goog.Timer.callOnce(this.hidePopupElement, 0, this) : this.hidePopupElement() : this.type_ == goog.ui.PopupBase.Type.MOVE_OFFSCREEN && this.moveOffscreen_();
    this.onHide_(a)
};
goog.ui.PopupBase.prototype.showPopupElement = function() {
    this.element_.style.visibility = "visible";
    goog.style.setElementShown(this.element_, !0)
};
goog.ui.PopupBase.prototype.hidePopupElement = function() {
    this.element_.style.visibility = "hidden";
    goog.style.setElementShown(this.element_, !1)
};
goog.ui.PopupBase.prototype.moveOffscreen_ = function() {
    this.element_.style.top = "-10000px"
};
goog.ui.PopupBase.prototype.onBeforeShow = function() {
    return this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_SHOW)
};
goog.ui.PopupBase.prototype.onShow_ = function() {
    this.dispatchEvent(goog.ui.PopupBase.EventType.SHOW)
};
goog.ui.PopupBase.prototype.onBeforeHide_ = function(a) {
    return this.dispatchEvent({
        type: goog.ui.PopupBase.EventType.BEFORE_HIDE,
        target: a
    })
};
goog.ui.PopupBase.prototype.onHide_ = function(a) {
    this.dispatchEvent({
        type: goog.ui.PopupBase.EventType.HIDE,
        target: a
    })
};
goog.ui.PopupBase.prototype.onDocumentMouseDown_ = function(a) {
    a = a.target;
    goog.dom.contains(this.element_, a) || this.isOrWithinAutoHidePartner_(a) || !this.isWithinAutoHideRegion_(a) || this.shouldDebounce_() || this.hide_(a)
};
goog.ui.PopupBase.prototype.onDocumentKeyDown_ = function(a) {
    a.keyCode == goog.events.KeyCodes.ESC && this.hide_(a.target) && (a.preventDefault(), a.stopPropagation())
};
goog.ui.PopupBase.prototype.onDocumentBlur_ = function(a) {
    if (this.enableCrossIframeDismissal_) {
        var b = goog.dom.getOwnerDocument(this.element_);
        if ("undefined" != typeof document.activeElement) {
            if (a = b.activeElement, !a || goog.dom.contains(this.element_, a) || "BODY" == a.tagName) return
        } else if (a.target != b) return;
        this.shouldDebounce_() || this.hide_()
    }
};
goog.ui.PopupBase.prototype.isOrWithinAutoHidePartner_ = function(a) {
    return goog.array.some(this.autoHidePartners_ || [], function(b) {
        return a === b || goog.dom.contains(b, a)
    })
};
goog.ui.PopupBase.prototype.isWithinAutoHideRegion_ = function(a) {
    return this.autoHideRegion_ ? goog.dom.contains(this.autoHideRegion_, a) : !0
};
goog.ui.PopupBase.prototype.shouldDebounce_ = function() {
    return goog.now() - this.lastShowTime_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS
};
goog.ui.PopupBase.prototype.disposeInternal = function() {
    goog.ui.PopupBase.superClass_.disposeInternal.call(this);
    this.handler_.dispose();
    goog.dispose(this.showTransition_);
    goog.dispose(this.hideTransition_);
    delete this.element_;
    delete this.handler_;
    delete this.autoHidePartners_
};
goog.ui.Popup = function(a, b) {
    this.popupCorner_ = goog.positioning.Corner.TOP_START;
    this.position_ = b || void 0;
    goog.ui.PopupBase.call(this, a)
};
goog.inherits(goog.ui.Popup, goog.ui.PopupBase);
goog.ui.Popup.Corner = goog.positioning.Corner;
goog.ui.Popup.Overflow = goog.positioning.Overflow;
goog.ui.Popup.prototype.getPinnedCorner = function() {
    return this.popupCorner_
};
goog.ui.Popup.prototype.setPinnedCorner = function(a) {
    this.popupCorner_ = a;
    this.isVisible() && this.reposition()
};
goog.ui.Popup.prototype.getPosition = function() {
    return this.position_ || null
};
goog.ui.Popup.prototype.setPosition = function(a) {
    this.position_ = a || void 0;
    this.isVisible() && this.reposition()
};
goog.ui.Popup.prototype.getMargin = function() {
    return this.margin_ || null
};
goog.ui.Popup.prototype.setMargin = function(a, b, c, d) {
    this.margin_ = null == a || a instanceof goog.math.Box ? a : new goog.math.Box(a, b, c, d);
    this.isVisible() && this.reposition()
};
goog.ui.Popup.prototype.reposition = function() {
    if (this.position_) {
        var a = !this.isVisible() && this.getType() != goog.ui.PopupBase.Type.MOVE_OFFSCREEN,
            b = this.getElement();
        a && (b.style.visibility = "hidden", goog.style.setElementShown(b, !0));
        this.position_.reposition(b, this.popupCorner_, this.margin_);
        a && goog.style.setElementShown(b, !1)
    }
};
goog.ui.Popup.AnchoredPosition = goog.positioning.AnchoredPosition;
goog.ui.Popup.AnchoredViewPortPosition = goog.positioning.AnchoredViewportPosition;
goog.ui.Popup.AbsolutePosition = goog.positioning.AbsolutePosition;
goog.ui.Popup.ViewPortPosition = goog.positioning.ViewportPosition;
goog.ui.Popup.ClientPosition = goog.positioning.ClientPosition;
goog.ui.Popup.ViewPortClientPosition = goog.positioning.ViewportClientPosition;
picker.api.MinimalPickerBase = function(a, b) {
    goog.ui.Popup.call(this, a);
    goog.dom.setFocusableTabIndex(a, !0);
    this.domHelper_ = b || goog.dom.getDomHelper();
    this.tabCatcherElement_ = this.domHelper_.createElement("span");
    goog.dom.setFocusableTabIndex(this.tabCatcherElement_, !0);
    this.tabCatcherElement_.style.position = "absolute";
    goog.a11y.aria.setState(this.tabCatcherElement_, goog.a11y.aria.State.HIDDEN, !0);
    this.backwardTabWrapInProgress_ = !1
};
goog.inherits(picker.api.MinimalPickerBase, goog.ui.Popup);
picker.api.MinimalPickerBase.prototype.focusHandler_ = null;
picker.api.MinimalPickerBase.prototype.getDomHelper = function() {
    return this.domHelper_
};
picker.api.MinimalPickerBase.prototype.setupBackwardTabWrap_ = function() {
    this.backwardTabWrapInProgress_ = !0;
    this.focus(this.tabCatcherElement_);
    goog.Timer.callOnce(this.resetBackwardTabWrap_, 0, this)
};
picker.api.MinimalPickerBase.prototype.resetBackwardTabWrap_ = function() {
    this.backwardTabWrapInProgress_ = !1
};
picker.api.MinimalPickerBase.prototype.onShowInternal = function() {
    goog.dom.insertSiblingAfter(this.tabCatcherElement_, this.getElement());
    this.focusHandler_ = new goog.events.FocusHandler(this.getDomHelper().getDocument());
    this.getHandler().listen(this.focusHandler_, goog.events.FocusHandler.EventType.FOCUSIN, this.onFocus_).listen(this.getElement(), goog.events.EventType.KEYDOWN, this.onKeyDown_)
};
picker.api.MinimalPickerBase.prototype.onHideInternal = function() {
    goog.dispose(this.focusHandler_);
    goog.dom.removeNode(this.tabCatcherElement_)
};
picker.api.MinimalPickerBase.prototype.onKeyDown_ = function(a) {
    a.keyCode == goog.events.KeyCodes.TAB && a.shiftKey && a.target == this.getElement() && this.setupBackwardTabWrap_()
};
picker.api.MinimalPickerBase.prototype.onFocus_ = function(a) {
    this.backwardTabWrapInProgress_ ? this.resetBackwardTabWrap_() : a.target == this.tabCatcherElement_ && goog.Timer.callOnce(goog.bind(this.focus, this, this.getElement()), 0)
};
picker.api.MinimalPickerBase.prototype.focus = function(a) {
    try {
        a && a.focus()
    } catch (b) {}
};
picker.api.MinimalPickerBase.prototype.reposition = function() {
    picker.api.MinimalPickerBase.superClass_.reposition.call(this);
    var a = this.getPosition();
    a && a.reposition(this.tabCatcherElement_, this.getPinnedCorner(), this.getMargin())
};
picker.api.PickerInterface = function() {};
picker.api.PickerInterface.prototype.setVisible = function(a) {};
picker.api.PickerInterface.prototype.sendCommand = function(a) {};
picker.api.PickerUriParameter = {
    ACTIONS: "actions",
    ACTION_PANE_TYPE: "apt",
    ACTION_PANE_TEXT: "actionPaneText",
    AUTHUSER: "authuser",
    CHROME_MODE: "chromeMode",
    CROP_MODE: "cropMode",
    DEVELOPER_KEY: "developerKey",
    DOGFOOD_CONFIDENTIAL: "dfc",
    EVENT_ID: "eventId",
    EXCLUDE_IDS: "excludeIds",
    EXPERIMENTS: "e",
    FACE_DETECTION_TIMEOUT_MS: "fdtm",
    GADGETS_RPC_URL: "rpcUrl",
    GROUP_ID: "groupId",
    HOST_ID: "hostId",
    INITIAL_VIEW: "view",
    LEARN_MORE: "learnMore",
    LOCALE: "hl",
    MAX_SIZE_BYTES: "maxSizeBytes",
    MAX_SIZE_BYTES_PER_ITEM: "maxSizeBytesPerItem",
    MAX_ITEMS: "maxItems",
    MAX_SIZE: "maxSize",
    MIN_ITEMS: "minItems",
    MIN_SIZE: "minSize",
    NAV: "nav",
    NO_ITEMS_VIEW: "noItemsView",
    OAUTH_TOKEN: "oauth_token",
    ORIGIN: "origin",
    POST_PROCESSORS: "pp",
    PROTOCOL: "protocol",
    RELAY_URL: "relayUrl",
    SELECT_BUTTON_LABEL: "selectButtonLabel",
    SELECTABLE_MIME_TYPES: "selectableMimeTypes",
    SHOULD_RETURN_UPLOAD_METADATA: "srum",
    SQUARE_ID: "squid",
    TITLE_BAR_ICON_ID: "titleBarIconId",
    THUMBS: "thumbs",
    TITLE: "title",
    UI_VERSION: "ui",
    UPLOAD_BUTTON: "uploadButton",
    UPLOAD_TO_ALBUM_ID: "uploadToAlbumId",
    USER: "user",
    VIEWER_GENDER: "vg"
};
picker.api.MinimalPicker = function(a, b, c, d, e, f) {
    var g = c || goog.dom.getDomHelper(),
        h = g.createDom("div", "picker-min goog-menu"),
        k = new goog.Uri(a),
        l = "true" == k.getParameterValue(picker.api.Feature.MINIMAL_MODE_NEW);
    l && goog.dom.classlist.add(h, "picker-minew");
    g.appendChild(g.getDocument().body, h);
    picker.api.MinimalPickerBase.call(this, h, g);
    this.dom_ = g;
    this.targetId_ = goog.string.getRandomString();
    this.rpcToken_ = goog.string.getRandomString();
    this.setUrl(a);
    this.preferredPopupWidth_ = d || picker.api.MinimalPicker.DEFAULT_WIDTH_;
    this.preferredPopupHeight_ = e || l ? picker.api.MinimalPicker.DEFAULT_HEIGHT_NEW_ : picker.api.MinimalPicker.DEFAULT_HEIGHT_;
    this.disableAutoHide_ = !!f;
    b && (b = PICKER_THIRD_PARTY_API ? "onepick" : goog.Uri.parse(a).getParameterValue("hostId"), picker.api.GadgetsLoader.load(b, this.getDomHelper()));
    this.setDefaultRelayUrl_(a);
    this.setHideOnEscape(!1);
    this.setAutoHide(!1);
    a = k.getParameterValue("hl");
    a = !!a && goog.i18n.bidi.isRtlLanguage(a);
    this.calloutArrow_ = new picker.api.CalloutArrow(a, c);
    this.calloutArrow_.render(h)
};
goog.inherits(picker.api.MinimalPicker, picker.api.MinimalPickerBase);
picker.api.MinimalPicker.DEFAULT_WIDTH_ = 248;
picker.api.MinimalPicker.DEFAULT_HEIGHT_ = 300;
picker.api.MinimalPicker.DEFAULT_HEIGHT_NEW_ = 311;
picker.api.MinimalPicker.prototype.url_ = "";
picker.api.MinimalPicker.prototype.iframe_ = null;
picker.api.MinimalPicker.prototype.loadedFired_ = !1;
picker.api.MinimalPicker.prototype.callback_ = goog.nullFunction;
picker.api.MinimalPicker.prototype.create_ = function() {
    if (!this.iframe_) {
        var a = this.url_;
        this.iframe_ = this.dom_.createDom("iframe", {
            id: this.targetId_,
            name: this.targetId_,
            "class": "picker-frame",
            src: this.getBlankUrl_(),
            onload: goog.bind(this.handleIFrameLoad_, this),
            frameBorder: "0"
        });
        this.getElement().appendChild(this.iframe_);
        goog.dom.setFocusableTabIndex(this.iframe_, !0);
        goog.a11y.aria.setRole(this.iframe_, goog.a11y.aria.Role.DIALOG);
        var b = goog.Uri.parse(a).getParameterValue(picker.api.PickerUriParameter.TITLE);
        b && goog.a11y.aria.setLabel(this.iframe_, b);
        goog.dom.classlist.add(this.getElement(), "picker-min-popup");
        goog.style.setSize(this.iframe_, this.preferredPopupWidth_, this.preferredPopupHeight_);
        this.iframe_.src = a;
        this.execOnGadgetsLoad_(goog.bind(function(a) {
            a.setAuthToken(this.targetId_, this.rpcToken_)
        }, this))
    }
};
picker.api.MinimalPicker.prototype.reposition = function() {
    if (this.iframe_) {
        picker.api.MinimalPicker.superClass_.reposition.call(this);
        var a = this.getPosition(),
            b = this.getPinnedCorner();
        a instanceof goog.positioning.AnchoredPosition ? this.calloutArrow_.centerAtElement(a.element, this.getElement(), b) : this.calloutArrow_.update(this.getElement(), b, this.getMargin());
        goog.positioning.getEffectiveCorner(this.getElement(), b) & goog.positioning.CornerBit.BOTTOM ? goog.dom.classlist.set(this.iframe_, "picker-min-frame-down") :
            goog.dom.classlist.set(this.iframe_, "picker-min-frame-up")
    }
};
picker.api.MinimalPicker.prototype.getBlankUrl_ = function() {
    return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("7") && goog.string.startsWith(this.url_, "https") ? "https://about:blank" : goog.dom.iframe.BLANK_SOURCE
};
picker.api.MinimalPicker.prototype.handleIFrameLoad_ = function() {
    var a = this.getDomHelper().getWindow();
    this.iframe_.src == this.getBlankUrl_() ? this.getHandler().listen(a, goog.events.EventType.KEYDOWN, this.handleKeydown_) : this.getHandler().unlisten(a, goog.events.EventType.KEYDOWN, this.handleKeydown_)
};
picker.api.MinimalPicker.prototype.handleKeydown_ = function(a) {
    a.keyCode == goog.events.KeyCodes.ESC && this.closePicker_()
};
picker.api.MinimalPicker.prototype.execOnGadgetsLoad_ = function(a) {
    var b = this.getDomHelper();
    picker.api.GadgetsLoader.execOnLoad(function() {
        a(b.getWindow().gadgets.rpc)
    }, b)
};
picker.api.MinimalPicker.prototype.setUrl = function(a) {
    var b = (new goog.Uri(a)).setParameterValue("rpctoken", this.rpcToken_).setParameterValue("rpcService", this.targetId_);
    PICKER_THIRD_PARTY_API && b.setParameterValue("thirdParty", "true");
    this.url_ = b.toString();
    this.iframe_ && (this.iframe_.src = a)
};
picker.api.MinimalPicker.prototype.setAppId = function(a) {
    this.appId_ = a;
    this.loadedFired_ && this.setDriveOptions_()
};
picker.api.MinimalPicker.prototype.setCallback = function(a) {
    this.callback_ = a;
    this.execOnGadgetsLoad_(goog.bind(function(a) {
        a.register(this.targetId_, goog.bind(this.handlePickerAction_, this))
    }, this))
};
picker.api.MinimalPicker.prototype.handlePickerAction_ = function(a) {
    var b = a.action;
    b == picker.api.Action.LOADED && (this.loadedFired_ = !0, this.setDriveOptions_());
    b == picker.api.Action.VIEW_UPDATED || b == picker.api.Action.VIEW_CHANGED ? this.reposition() : (b != picker.api.Action.PICKED && b != picker.api.Action.CANCEL || this.setVisible(!1), this.callback_(a))
};
picker.api.MinimalPicker.prototype.hasFeature_ = function(a) {
    return "true" == goog.Uri.parse(this.url_).getParameterValue(a)
};
picker.api.MinimalPicker.prototype.setDriveOptions_ = function() {
    this.appId_ && this.sendCommand(new picker.api.commands.SetDriveOptionsCommand(this.appId_, window.location.protocol + "//" + window.location.host))
};
picker.api.MinimalPicker.prototype.setRelayUrl = function(a) {
    this.execOnGadgetsLoad_(goog.bind(function(b) {
        b.setRelayUrl(this.targetId_, a)
    }, this))
};
picker.api.MinimalPicker.prototype.setDefaultRelayUrl_ = function(a) {
    var b = null,
        c = a.indexOf("/picker?"); - 1 < c ? b = a.substring(0, c + 8 - 1) : goog.string.endsWith(a, "/picker") && (b = a);
    b && this.setRelayUrl(b + "/resources/rpc_relay.html")
};
picker.api.MinimalPicker.prototype.sendCommand = function(a) {
    this.execOnGadgetsLoad_(goog.bind(function(b) {
        b.call(this.targetId_, "picker", null, a)
    }, this))
};
picker.api.MinimalPicker.prototype.onShow_ = function() {
    picker.api.MinimalPicker.superClass_.onShow_.call(this);
    this.onShowInternal();
    this.create_();
    if (!this.disableAutoHide_) {
        var a = this.getDomHelper().getDocument();
        this.getHandler().listen(a, goog.events.EventType.MOUSEDOWN, this.closePicker_, !0);
        if (goog.userAgent.IE) {
            var b;
            try {
                b = a.activeElement
            } catch (c) {}
            for (; b && "IFRAME" == b.nodeName;) {
                try {
                    var d = goog.dom.getFrameContentDocument(b)
                } catch (e) {
                    break
                }
                a = d;
                b = a.activeElement
            }
            this.getHandler().listen(a, goog.events.EventType.MOUSEDOWN,
                this.closePicker_, !0)
        }
    }
    this.sendCommand(new picker.api.commands.VisibilityCommand(!0));
    this.reposition();
    this.focus(this.iframe_)
};
picker.api.MinimalPicker.prototype.onHide_ = function(a) {
    picker.api.MinimalPicker.superClass_.onHide_.call(this, a);
    this.onHideInternal();
    this.sendCommand(new picker.api.commands.VisibilityCommand(!1))
};
picker.api.MinimalPicker.prototype.closePicker_ = function() {
    var a = {
        action: picker.api.Action.CANCEL
    };
    this.setVisible(!1);
    this.callback_(a)
};
goog.dom.tags = {};
goog.dom.tags.VOID_TAGS_ = goog.object.createSet("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));
goog.dom.tags.isVoidTag = function(a) {
    return !0 === goog.dom.tags.VOID_TAGS_[a]
};
goog.string.TypedString = function() {};
goog.string.Const = function() {
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_
};
goog.string.Const.prototype.implementsGoogStringTypedString = !0;
goog.string.Const.prototype.getTypedStringValue = function() {
    return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
};
goog.string.Const.prototype.toString = function() {
    return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
};
goog.string.Const.unwrap = function(a) {
    if (a instanceof goog.string.Const && a.constructor === goog.string.Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
    goog.asserts.fail("expected object of type Const, got '" + a + "'");
    return "type_error:Const"
};
goog.string.Const.from = function(a) {
    return goog.string.Const.create__googStringSecurityPrivate_(a)
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(a) {
    var b = new goog.string.Const;
    b.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a;
    return b
};
goog.html = {};
goog.html.SafeStyle = function() {
    this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
    this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(a) {
    a = goog.string.Const.unwrap(a);
    if (0 === a.length) return goog.html.SafeStyle.EMPTY;
    goog.html.SafeStyle.checkStyle_(a);
    goog.asserts.assert(goog.string.endsWith(a, ";"), "Last character of style string is not ';': " + a);
    goog.asserts.assert(goog.string.contains(a, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + a);
    return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.SafeStyle.checkStyle_ = function(a) {
    goog.asserts.assert(!/[<>]/.test(a), "Forbidden characters in style string: " + a)
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
};
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
    return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
});
goog.html.SafeStyle.unwrap = function(a) {
    if (a instanceof goog.html.SafeStyle && a.constructor === goog.html.SafeStyle && a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
    goog.asserts.fail("expected object of type SafeStyle, got '" + a + "'");
    return "type_error:SafeStyle"
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_ = function(a) {
    var b = new goog.html.SafeStyle;
    b.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
    return b
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.create = function(a) {
    var b = "",
        c;
    for (c in a) {
        if (!/^[-_a-zA-Z0-9]+$/.test(c)) throw Error("Name allows only [-_a-zA-Z0-9], got: " + c);
        var d = a[c];
        null != d && (d instanceof goog.string.Const ? (d = goog.string.Const.unwrap(d), goog.asserts.assert(!/[{;}]/.test(d), "Value does not allow [{;}].")) : goog.html.SafeStyle.VALUE_RE_.test(d) || (goog.asserts.fail("String value allows only [-.%_!# a-zA-Z0-9], got: " + d), d = goog.html.SafeStyle.INNOCUOUS_STRING), b += c + ":" + d + ";")
    }
    if (!b) return goog.html.SafeStyle.EMPTY;
    goog.html.SafeStyle.checkStyle_(b);
    return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(b)
};
goog.html.SafeStyle.VALUE_RE_ = /^[-.%_!# a-zA-Z0-9]+$/;
goog.html.SafeStyle.concat = function(a) {
    var b = "",
        c = function(a) {
            goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyle.unwrap(a)
        };
    goog.array.forEach(arguments, c);
    return b ? goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(b) : goog.html.SafeStyle.EMPTY
};
goog.html.SafeUrl = function() {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
    this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeUrl.prototype.getDirection = function() {
    return goog.i18n.bidi.Dir.LTR
};
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
    return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
});
goog.html.SafeUrl.unwrap = function(a) {
    if (a instanceof goog.html.SafeUrl && a.constructor === goog.html.SafeUrl && a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    goog.asserts.fail("expected object of type SafeUrl, got '" + a + "'");
    return "type_error:SafeUrl"
};
goog.html.SafeUrl.fromConstant = function(a) {
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(goog.string.Const.unwrap(a))
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto):|[^&:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(a) {
    if (a instanceof goog.html.SafeUrl) return a;
    a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
    a = goog.html.SAFE_URL_PATTERN_.test(a) ? goog.html.SafeUrl.normalize_(a) : goog.html.SafeUrl.INNOCUOUS_STRING;
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.SafeUrl.normalize_ = function(a) {
    try {
        var b = encodeURI(a)
    } catch (c) {
        return goog.html.SafeUrl.INNOCUOUS_STRING
    }
    return b.replace(goog.html.SafeUrl.NORMALIZE_MATCHER_, function(a) {
        return goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_[a]
    })
};
goog.html.SafeUrl.NORMALIZE_MATCHER_ = /[()']|%5B|%5D|%25/g;
goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_ = {
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "%5B": "[",
    "%5D": "]",
    "%25": "%"
};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
    var b = new goog.html.SafeUrl;
    b.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
    return b
};
goog.html.SafeHtml = function() {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
    this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
    this.dir_ = null
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeHtml.prototype.getDirection = function() {
    return this.dir_
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
};
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
    return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
});
goog.html.SafeHtml.unwrap = function(a) {
    if (a instanceof goog.html.SafeHtml && a.constructor === goog.html.SafeHtml && a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    goog.asserts.fail("expected object of type SafeHtml, got '" + a + "'");
    return "type_error:SafeHtml"
};
goog.html.SafeHtml.htmlEscape = function(a) {
    if (a instanceof goog.html.SafeHtml) return a;
    var b = null;
    a.implementsGoogI18nBidiDirectionalString && (b = a.getDirection());
    a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(goog.string.htmlEscape(a), b)
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(a) {
    if (a instanceof goog.html.SafeHtml) return a;
    a = goog.html.SafeHtml.htmlEscape(a);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(a)), a.getDirection())
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet("action", "cite", "data", "formaction", "href", "manifest", "poster", "src");
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet("link", "script", "style");
goog.html.SafeHtml.create = function(a, b, c) {
    if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) throw Error("Invalid tag name <" + a + ">.");
    if (a.toLowerCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) throw Error("Tag name <" + a + "> is not allowed for SafeHtml.");
    var d = null,
        e = "<" + a;
    if (b)
        for (var f in b) {
            if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(f)) throw Error('Invalid attribute name "' + f + '".');
            var g = b[f];
            if (null != g) {
                if (g instanceof goog.string.Const) g = goog.string.Const.unwrap(g);
                else if ("style" == f.toLowerCase()) g =
                    goog.html.SafeHtml.getStyleValue_(g);
                else {
                    if (/^on/i.test(f)) throw Error('Attribute "' + f + '" requires goog.string.Const value, "' + g + '" given.');
                    if (g instanceof goog.html.SafeUrl) g = goog.html.SafeUrl.unwrap(g);
                    else if (f.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) throw Error('Attribute "' + f + '" requires goog.string.Const or goog.html.SafeUrl value, "' + g + '" given.');
                }
                goog.asserts.assert(goog.isString(g) || goog.isNumber(g), "String or number value expected, got " + typeof g + " with value: " + g);
                e += " " +
                    f + '="' + goog.string.htmlEscape(String(g)) + '"'
            }
        }
    goog.isDef(c) ? goog.isArray(c) || (c = [c]) : c = [];
    goog.dom.tags.isVoidTag(a.toLowerCase()) ? (goog.asserts.assert(!c.length, "Void tag <" + a + "> does not allow content."), e += ">") : (d = goog.html.SafeHtml.concat(c), e += ">" + goog.html.SafeHtml.unwrap(d) + "</" + a + ">", d = d.getDirection());
    (a = b && b.dir) && (d = /^(ltr|rtl|auto)$/i.test(a) ? goog.i18n.bidi.Dir.NEUTRAL : null);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(e, d)
};
goog.html.SafeHtml.getStyleValue_ = function(a) {
    if (!goog.isObject(a)) throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a);
    a instanceof goog.html.SafeStyle || (a = goog.html.SafeStyle.create(a));
    return goog.html.SafeStyle.unwrap(a)
};
goog.html.SafeHtml.createWithDir = function(a, b, c, d) {
    b = goog.html.SafeHtml.create(b, c, d);
    b.dir_ = a;
    return b
};
goog.html.SafeHtml.concat = function(a) {
    var b = goog.i18n.bidi.Dir.NEUTRAL,
        c = "",
        d = function(a) {
            goog.isArray(a) ? goog.array.forEach(a, d) : (a = goog.html.SafeHtml.htmlEscape(a), c += goog.html.SafeHtml.unwrap(a), a = a.getDirection(), b == goog.i18n.bidi.Dir.NEUTRAL ? b = a : a != goog.i18n.bidi.Dir.NEUTRAL && b != a && (b = null))
        };
    goog.array.forEach(arguments, d);
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(c, b)
};
goog.html.SafeHtml.concatWithDir = function(a, b) {
    var c = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
    c.dir_ = a;
    return c
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_ = function(a, b) {
    var c = new goog.html.SafeHtml;
    c.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
    c.dir_ = b;
    return c
};
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_("", goog.i18n.bidi.Dir.NEUTRAL);
goog.dom.safe = {};
goog.dom.safe.setInnerHtml = function(a, b) {
    a.innerHTML = goog.html.SafeHtml.unwrap(b)
};
goog.dom.safe.documentWrite = function(a, b) {
    a.write(goog.html.SafeHtml.unwrap(b))
};
goog.dom.safe.setAnchorHref = function(a, b) {
    var c;
    c = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitize(b);
    a.href = goog.html.SafeUrl.unwrap(c)
};
goog.dom.safe.setLocationHref = function(a, b) {
    var c;
    c = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitize(b);
    a.href = goog.html.SafeUrl.unwrap(c)
};
goog.fx.Dragger = function(a, b, c) {
    goog.events.EventTarget.call(this);
    this.target = a;
    this.handle = b || a;
    this.limits = c || new goog.math.Rect(NaN, NaN, NaN, NaN);
    this.document_ = goog.dom.getOwnerDocument(a);
    this.eventHandler_ = new goog.events.EventHandler(this);
    this.registerDisposable(this.eventHandler_);
    goog.events.listen(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this)
};
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);
goog.fx.Dragger.HAS_SET_CAPTURE_ = goog.userAgent.IE || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.3");
goog.fx.Dragger.cloneNode = function(a) {
    for (var b = a.cloneNode(!0), c = a.getElementsByTagName("textarea"), d = b.getElementsByTagName("textarea"), e = 0; e < c.length; e++) d[e].value = c[e].value;
    switch (a.tagName.toLowerCase()) {
        case "tr":
            return goog.dom.createDom("table", null, goog.dom.createDom("tbody", null, b));
        case "td":
        case "th":
            return goog.dom.createDom("table", null, goog.dom.createDom("tbody", null, goog.dom.createDom("tr", null, b)));
        case "textarea":
            b.value = a.value;
        default:
            return b
    }
};
goog.fx.Dragger.EventType = {
    EARLY_CANCEL: "earlycancel",
    START: "start",
    BEFOREDRAG: "beforedrag",
    DRAG: "drag",
    END: "end"
};
goog.fx.Dragger.prototype.clientX = 0;
goog.fx.Dragger.prototype.clientY = 0;
goog.fx.Dragger.prototype.screenX = 0;
goog.fx.Dragger.prototype.screenY = 0;
goog.fx.Dragger.prototype.startX = 0;
goog.fx.Dragger.prototype.startY = 0;
goog.fx.Dragger.prototype.deltaX = 0;
goog.fx.Dragger.prototype.deltaY = 0;
goog.fx.Dragger.prototype.enabled_ = !0;
goog.fx.Dragger.prototype.dragging_ = !1;
goog.fx.Dragger.prototype.hysteresisDistanceSquared_ = 0;
goog.fx.Dragger.prototype.mouseDownTime_ = 0;
goog.fx.Dragger.prototype.ieDragStartCancellingOn_ = !1;
goog.fx.Dragger.prototype.useRightPositioningForRtl_ = !1;
goog.fx.Dragger.prototype.enableRightPositioningForRtl = function(a) {
    this.useRightPositioningForRtl_ = a
};
goog.fx.Dragger.prototype.getHandler = function() {
    return this.eventHandler_
};
goog.fx.Dragger.prototype.setLimits = function(a) {
    this.limits = a || new goog.math.Rect(NaN, NaN, NaN, NaN)
};
goog.fx.Dragger.prototype.setHysteresis = function(a) {
    this.hysteresisDistanceSquared_ = Math.pow(a, 2)
};
goog.fx.Dragger.prototype.getHysteresis = function() {
    return Math.sqrt(this.hysteresisDistanceSquared_)
};
goog.fx.Dragger.prototype.setScrollTarget = function(a) {
    this.scrollTarget_ = a
};
goog.fx.Dragger.prototype.setCancelIeDragStart = function(a) {
    this.ieDragStartCancellingOn_ = a
};
goog.fx.Dragger.prototype.getEnabled = function() {
    return this.enabled_
};
goog.fx.Dragger.prototype.setEnabled = function(a) {
    this.enabled_ = a
};
goog.fx.Dragger.prototype.disposeInternal = function() {
    goog.fx.Dragger.superClass_.disposeInternal.call(this);
    goog.events.unlisten(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this);
    this.cleanUpAfterDragging_();
    this.handle = this.target = null
};
goog.fx.Dragger.prototype.isRightToLeft_ = function() {
    goog.isDef(this.rightToLeft_) || (this.rightToLeft_ = goog.style.isRightToLeft(this.target));
    return this.rightToLeft_
};
goog.fx.Dragger.prototype.startDrag = function(a) {
    var b = a.type == goog.events.EventType.MOUSEDOWN;
    if (!this.enabled_ || this.dragging_ || b && !a.isMouseActionButton()) this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL);
    else {
        this.maybeReinitTouchEvent_(a);
        if (0 == this.hysteresisDistanceSquared_)
            if (this.fireDragStart_(a)) this.dragging_ = !0, a.preventDefault();
            else return;
        else a.preventDefault();
        this.setupDragHandlers();
        this.clientX = this.startX = a.clientX;
        this.clientY = this.startY = a.clientY;
        this.screenX = a.screenX;
        this.screenY = a.screenY;
        this.computeInitialPosition();
        this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
        this.mouseDownTime_ = goog.now()
    }
};
goog.fx.Dragger.prototype.setupDragHandlers = function() {
    var a = this.document_,
        b = a.documentElement,
        c = !goog.fx.Dragger.HAS_SET_CAPTURE_;
    this.eventHandler_.listen(a, [goog.events.EventType.TOUCHMOVE, goog.events.EventType.MOUSEMOVE], this.handleMove_, c);
    this.eventHandler_.listen(a, [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP], this.endDrag, c);
    goog.fx.Dragger.HAS_SET_CAPTURE_ ? (b.setCapture(!1), this.eventHandler_.listen(b, goog.events.EventType.LOSECAPTURE, this.endDrag)) : this.eventHandler_.listen(goog.dom.getWindow(a),
        goog.events.EventType.BLUR, this.endDrag);
    goog.userAgent.IE && this.ieDragStartCancellingOn_ && this.eventHandler_.listen(a, goog.events.EventType.DRAGSTART, goog.events.Event.preventDefault);
    this.scrollTarget_ && this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL, this.onScroll_, c)
};
goog.fx.Dragger.prototype.fireDragStart_ = function(a) {
    return this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.START, this, a.clientX, a.clientY, a))
};
goog.fx.Dragger.prototype.cleanUpAfterDragging_ = function() {
    this.eventHandler_.removeAll();
    goog.fx.Dragger.HAS_SET_CAPTURE_ && this.document_.releaseCapture()
};
goog.fx.Dragger.prototype.endDrag = function(a, b) {
    this.cleanUpAfterDragging_();
    if (this.dragging_) {
        this.maybeReinitTouchEvent_(a);
        this.dragging_ = !1;
        var c = this.limitX(this.deltaX),
            d = this.limitY(this.deltaY);
        this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.END, this, a.clientX, a.clientY, a, c, d, b || a.type == goog.events.EventType.TOUCHCANCEL))
    } else this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL)
};
goog.fx.Dragger.prototype.endDragCancel = function(a) {
    this.endDrag(a, !0)
};
goog.fx.Dragger.prototype.maybeReinitTouchEvent_ = function(a) {
    var b = a.type;
    b == goog.events.EventType.TOUCHSTART || b == goog.events.EventType.TOUCHMOVE ? a.init(a.getBrowserEvent().targetTouches[0], a.currentTarget) : b != goog.events.EventType.TOUCHEND && b != goog.events.EventType.TOUCHCANCEL || a.init(a.getBrowserEvent().changedTouches[0], a.currentTarget)
};
goog.fx.Dragger.prototype.handleMove_ = function(a) {
    if (this.enabled_) {
        this.maybeReinitTouchEvent_(a);
        var b = (this.useRightPositioningForRtl_ && this.isRightToLeft_() ? -1 : 1) * (a.clientX - this.clientX),
            c = a.clientY - this.clientY;
        this.clientX = a.clientX;
        this.clientY = a.clientY;
        this.screenX = a.screenX;
        this.screenY = a.screenY;
        if (!this.dragging_) {
            var d = this.startX - this.clientX,
                e = this.startY - this.clientY;
            if (d * d + e * e > this.hysteresisDistanceSquared_)
                if (this.fireDragStart_(a)) this.dragging_ = !0;
                else {
                    this.isDisposed() || this.endDrag(a);
                    return
                }
        }
        c = this.calculatePosition_(b, c);
        b = c.x;
        c = c.y;
        this.dragging_ && this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, a.clientX, a.clientY, a, b, c)) && (this.doDrag(a, b, c, !1), a.preventDefault())
    }
};
goog.fx.Dragger.prototype.calculatePosition_ = function(a, b) {
    var c = goog.dom.getDomHelper(this.document_).getDocumentScroll();
    a += c.x - this.pageScroll.x;
    b += c.y - this.pageScroll.y;
    this.pageScroll = c;
    this.deltaX += a;
    this.deltaY += b;
    var c = this.limitX(this.deltaX),
        d = this.limitY(this.deltaY);
    return new goog.math.Coordinate(c, d)
};
goog.fx.Dragger.prototype.onScroll_ = function(a) {
    var b = this.calculatePosition_(0, 0);
    a.clientX = this.clientX;
    a.clientY = this.clientY;
    this.doDrag(a, b.x, b.y, !0)
};
goog.fx.Dragger.prototype.doDrag = function(a, b, c, d) {
    this.defaultAction(b, c);
    this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.DRAG, this, a.clientX, a.clientY, a, b, c))
};
goog.fx.Dragger.prototype.limitX = function(a) {
    var b = this.limits,
        c = isNaN(b.left) ? null : b.left,
        b = isNaN(b.width) ? 0 : b.width;
    return Math.min(null != c ? c + b : Infinity, Math.max(null != c ? c : -Infinity, a))
};
goog.fx.Dragger.prototype.limitY = function(a) {
    var b = this.limits,
        c = isNaN(b.top) ? null : b.top,
        b = isNaN(b.height) ? 0 : b.height;
    return Math.min(null != c ? c + b : Infinity, Math.max(null != c ? c : -Infinity, a))
};
goog.fx.Dragger.prototype.computeInitialPosition = function() {
    this.deltaX = this.useRightPositioningForRtl_ ? goog.style.bidi.getOffsetStart(this.target) : this.target.offsetLeft;
    this.deltaY = this.target.offsetTop
};
goog.fx.Dragger.prototype.defaultAction = function(a, b) {
    this.useRightPositioningForRtl_ && this.isRightToLeft_() ? this.target.style.right = a + "px" : this.target.style.left = a + "px";
    this.target.style.top = b + "px"
};
goog.fx.Dragger.prototype.isDragging = function() {
    return this.dragging_
};
goog.fx.DragEvent = function(a, b, c, d, e, f, g, h) {
    goog.events.Event.call(this, a);
    this.clientX = c;
    this.clientY = d;
    this.browserEvent = e;
    this.left = goog.isDef(f) ? f : b.deltaX;
    this.top = goog.isDef(g) ? g : b.deltaY;
    this.dragger = b;
    this.dragCanceled = !!h
};
goog.inherits(goog.fx.DragEvent, goog.events.Event);
goog.html.TrustedResourceUrl = function() {
    this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
    this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
    return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
    return goog.i18n.bidi.Dir.LTR
};
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
    return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}"
});
goog.html.TrustedResourceUrl.unwrap = function(a) {
    if (a instanceof goog.html.TrustedResourceUrl && a.constructor === goog.html.TrustedResourceUrl && a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
    goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + a + "'");
    return "type_error:TrustedResourceUrl"
};
goog.html.TrustedResourceUrl.fromConstant = function(a) {
    return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(goog.string.Const.unwrap(a))
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
    var b = new goog.html.TrustedResourceUrl;
    b.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = a;
    return b
};
goog.html.legacyconversions = {};
goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS = !0;
goog.html.legacyconversions.safeHtmlFromString = function(a) {
    goog.html.legacyconversions.throwIfConversionDisallowed_();
    return goog.html.legacyconversions.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.legacyconversions.trustedResourceUrlFromString = function(a) {
    goog.html.legacyconversions.throwIfConversionDisallowed_();
    return goog.html.legacyconversions.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.legacyconversions.safeUrlFromString = function(a) {
    goog.html.legacyconversions.throwIfConversionDisallowed_();
    return goog.html.legacyconversions.createSafeUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.legacyconversions.reportCallback_ = goog.nullFunction;
goog.html.legacyconversions.setReportCallback = function(a) {
    goog.html.legacyconversions.reportCallback_ = a
};
goog.html.legacyconversions.createSafeHtmlSecurityPrivateDoNotAccessOrElse_ = function(a) {
    return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(a, null)
};
goog.html.legacyconversions.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
    return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.legacyconversions.createSafeUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
    return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.legacyconversions.throwIfConversionDisallowed_ = function() {
    if (!goog.html.legacyconversions.ALLOW_LEGACY_CONVERSIONS) throw Error("Error: Legacy conversion from string to goog.html types is disabled");
    goog.html.legacyconversions.reportCallback_()
};
goog.ui.ModalPopup = function(a, b) {
    goog.ui.Component.call(this, b);
    this.useIframeMask_ = !!a;
    this.lastFocus_ = null
};
goog.inherits(goog.ui.ModalPopup, goog.ui.Component);
goog.ui.ModalPopup.prototype.focusHandler_ = null;
goog.ui.ModalPopup.prototype.visible_ = !1;
goog.ui.ModalPopup.prototype.bgEl_ = null;
goog.ui.ModalPopup.prototype.bgIframeEl_ = null;
goog.ui.ModalPopup.prototype.tabCatcherElement_ = null;
goog.ui.ModalPopup.prototype.backwardTabWrapInProgress_ = !1;
goog.ui.ModalPopup.prototype.getCssClass = function() {
    return "goog-modalpopup"
};
goog.ui.ModalPopup.prototype.getBackgroundIframe = function() {
    return this.bgIframeEl_
};
goog.ui.ModalPopup.prototype.getBackgroundElement = function() {
    return this.bgEl_
};
goog.ui.ModalPopup.prototype.createDom = function() {
    goog.ui.ModalPopup.superClass_.createDom.call(this);
    var a = this.getElement();
    goog.asserts.assert(a);
    var b = goog.string.trim(this.getCssClass()).split(" ");
    goog.dom.classlist.addAll(a, b);
    goog.dom.setFocusableTabIndex(a, !0);
    goog.style.setElementShown(a, !1);
    this.manageBackgroundDom_();
    this.createTabCatcher_()
};
goog.ui.ModalPopup.prototype.manageBackgroundDom_ = function() {
    this.useIframeMask_ && !this.bgIframeEl_ && (this.bgIframeEl_ = goog.dom.iframe.createBlank(this.getDomHelper()), this.bgIframeEl_.className = this.getCssClass() + "-bg", goog.style.setElementShown(this.bgIframeEl_, !1), goog.style.setOpacity(this.bgIframeEl_, 0));
    this.bgEl_ || (this.bgEl_ = this.getDomHelper().createDom("div", this.getCssClass() + "-bg"), goog.style.setElementShown(this.bgEl_, !1))
};
goog.ui.ModalPopup.prototype.createTabCatcher_ = function() {
    this.tabCatcherElement_ || (this.tabCatcherElement_ = this.getDomHelper().createElement("span"), goog.style.setElementShown(this.tabCatcherElement_, !1), goog.dom.setFocusableTabIndex(this.tabCatcherElement_, !0), this.tabCatcherElement_.style.position = "absolute")
};
goog.ui.ModalPopup.prototype.setupBackwardTabWrap = function() {
    this.backwardTabWrapInProgress_ = !0;
    try {
        this.tabCatcherElement_.focus()
    } catch (a) {}
    goog.Timer.callOnce(this.resetBackwardTabWrap_, 0, this)
};
goog.ui.ModalPopup.prototype.resetBackwardTabWrap_ = function() {
    this.backwardTabWrapInProgress_ = !1
};
goog.ui.ModalPopup.prototype.renderBackground_ = function() {
    goog.asserts.assert(!!this.bgEl_, "Background element must not be null.");
    this.bgIframeEl_ && goog.dom.insertSiblingBefore(this.bgIframeEl_, this.getElement());
    goog.dom.insertSiblingBefore(this.bgEl_, this.getElement())
};
goog.ui.ModalPopup.prototype.canDecorate = function(a) {
    return !!a && a.tagName == goog.dom.TagName.DIV
};
goog.ui.ModalPopup.prototype.decorateInternal = function(a) {
    goog.ui.ModalPopup.superClass_.decorateInternal.call(this, a);
    a = goog.string.trim(this.getCssClass()).split(" ");
    goog.dom.classlist.addAll(goog.asserts.assert(this.getElement()), a);
    this.manageBackgroundDom_();
    this.createTabCatcher_();
    goog.style.setElementShown(this.getElement(), !1)
};
goog.ui.ModalPopup.prototype.enterDocument = function() {
    this.renderBackground_();
    goog.ui.ModalPopup.superClass_.enterDocument.call(this);
    goog.dom.insertSiblingAfter(this.tabCatcherElement_, this.getElement());
    this.focusHandler_ = new goog.events.FocusHandler(this.getDomHelper().getDocument());
    this.getHandler().listen(this.focusHandler_, goog.events.FocusHandler.EventType.FOCUSIN, this.onFocus);
    this.setA11YDetectBackground(!1)
};
goog.ui.ModalPopup.prototype.exitDocument = function() {
    this.isVisible() && this.setVisible(!1);
    goog.dispose(this.focusHandler_);
    goog.ui.ModalPopup.superClass_.exitDocument.call(this);
    goog.dom.removeNode(this.bgIframeEl_);
    goog.dom.removeNode(this.bgEl_);
    goog.dom.removeNode(this.tabCatcherElement_)
};
goog.ui.ModalPopup.prototype.setVisible = function(a) {
    goog.asserts.assert(this.isInDocument(), "ModalPopup must be rendered first.");
    a != this.visible_ && (this.popupShowTransition_ && this.popupShowTransition_.stop(), this.bgShowTransition_ && this.bgShowTransition_.stop(), this.popupHideTransition_ && this.popupHideTransition_.stop(), this.bgHideTransition_ && this.bgHideTransition_.stop(), this.isInDocument() && this.setA11YDetectBackground(a), a ? this.show_() : this.hide_())
};
goog.ui.ModalPopup.prototype.setA11YDetectBackground = function(a) {
    if (a) {
        this.hiddenElements_ || (this.hiddenElements_ = []);
        a = this.getDomHelper();
        a = a.getChildren(a.getDocument().body);
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            c == this.getElementStrict() || goog.a11y.aria.getState(c, goog.a11y.aria.State.HIDDEN) || (goog.a11y.aria.setState(c, goog.a11y.aria.State.HIDDEN, !0), this.hiddenElements_.push(c))
        }
    } else if (this.hiddenElements_) {
        for (b = 0; b < this.hiddenElements_.length; b++) goog.a11y.aria.removeState(this.hiddenElements_[b],
            goog.a11y.aria.State.HIDDEN);
        this.hiddenElements_ = null
    }
};
goog.ui.ModalPopup.prototype.setTransition = function(a, b, c, d) {
    this.popupShowTransition_ = a;
    this.popupHideTransition_ = b;
    this.bgShowTransition_ = c;
    this.bgHideTransition_ = d
};
goog.ui.ModalPopup.prototype.show_ = function() {
    if (this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_SHOW)) {
        try {
            this.lastFocus_ = this.getDomHelper().getDocument().activeElement
        } catch (a) {}
        this.resizeBackground_();
        this.reposition();
        this.getHandler().listen(this.getDomHelper().getWindow(), goog.events.EventType.RESIZE, this.resizeBackground_);
        this.showPopupElement_(!0);
        this.focus();
        this.visible_ = !0;
        if (this.popupShowTransition_ && this.bgShowTransition_) goog.events.listenOnce(this.popupShowTransition_, goog.fx.Transition.EventType.END,
            this.onShow, !1, this), this.bgShowTransition_.play(), this.popupShowTransition_.play();
        else this.onShow()
    }
};
goog.ui.ModalPopup.prototype.hide_ = function() {
    if (this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_HIDE)) {
        this.getHandler().unlisten(this.getDomHelper().getWindow(), goog.events.EventType.RESIZE, this.resizeBackground_);
        this.visible_ = !1;
        if (this.popupHideTransition_ && this.bgHideTransition_) goog.events.listenOnce(this.popupHideTransition_, goog.fx.Transition.EventType.END, this.onHide, !1, this), this.bgHideTransition_.play(), this.popupHideTransition_.play();
        else this.onHide();
        try {
            var a = this.getDomHelper().getDocument().body,
                b = this.getDomHelper().getDocument().activeElement || a;
            this.lastFocus_ && b == a && this.lastFocus_ != a && this.lastFocus_.focus()
        } catch (c) {}
        this.lastFocus_ = null
    }
};
goog.ui.ModalPopup.prototype.showPopupElement_ = function(a) {
    this.bgIframeEl_ && goog.style.setElementShown(this.bgIframeEl_, a);
    this.bgEl_ && goog.style.setElementShown(this.bgEl_, a);
    goog.style.setElementShown(this.getElement(), a);
    goog.style.setElementShown(this.tabCatcherElement_, a)
};
goog.ui.ModalPopup.prototype.onShow = function() {
    this.dispatchEvent(goog.ui.PopupBase.EventType.SHOW)
};
goog.ui.ModalPopup.prototype.onHide = function() {
    this.showPopupElement_(!1);
    this.dispatchEvent(goog.ui.PopupBase.EventType.HIDE)
};
goog.ui.ModalPopup.prototype.isVisible = function() {
    return this.visible_
};
goog.ui.ModalPopup.prototype.focus = function() {
    this.focusElement_()
};
goog.ui.ModalPopup.prototype.resizeBackground_ = function() {
    this.bgIframeEl_ && goog.style.setElementShown(this.bgIframeEl_, !1);
    this.bgEl_ && goog.style.setElementShown(this.bgEl_, !1);
    var a = this.getDomHelper().getDocument(),
        b = goog.dom.getWindow(a) || window,
        c = goog.dom.getViewportSize(b),
        b = Math.max(c.width, Math.max(a.body.scrollWidth, a.documentElement.scrollWidth)),
        a = Math.max(c.height, Math.max(a.body.scrollHeight, a.documentElement.scrollHeight));
    this.bgIframeEl_ && (goog.style.setElementShown(this.bgIframeEl_, !0), goog.style.setSize(this.bgIframeEl_, b, a));
    this.bgEl_ && (goog.style.setElementShown(this.bgEl_, !0), goog.style.setSize(this.bgEl_, b, a))
};
goog.ui.ModalPopup.prototype.reposition = function() {
    var a = this.getDomHelper().getDocument(),
        b = goog.dom.getWindow(a) || window;
    if ("fixed" == goog.style.getComputedPosition(this.getElement())) var c = a = 0;
    else c = this.getDomHelper().getDocumentScroll(), a = c.x, c = c.y;
    var d = goog.style.getSize(this.getElement()),
        b = goog.dom.getViewportSize(b),
        a = Math.max(a + b.width / 2 - d.width / 2, 0),
        c = Math.max(c + b.height / 2 - d.height / 2, 0);
    goog.style.setPosition(this.getElement(), a, c);
    goog.style.setPosition(this.tabCatcherElement_, a, c)
};
goog.ui.ModalPopup.prototype.onFocus = function(a) {
    this.backwardTabWrapInProgress_ ? this.resetBackwardTabWrap_() : a.target == this.tabCatcherElement_ && goog.Timer.callOnce(this.focusElement_, 0, this)
};
goog.ui.ModalPopup.prototype.getTabCatcherElement = function() {
    return this.tabCatcherElement_
};
goog.ui.ModalPopup.prototype.focusElement_ = function() {
    try {
        goog.userAgent.IE && this.getDomHelper().getDocument().body.focus(), this.getElement().focus()
    } catch (a) {}
};
goog.ui.ModalPopup.prototype.disposeInternal = function() {
    goog.dispose(this.popupShowTransition_);
    this.popupShowTransition_ = null;
    goog.dispose(this.popupHideTransition_);
    this.popupHideTransition_ = null;
    goog.dispose(this.bgShowTransition_);
    this.bgShowTransition_ = null;
    goog.dispose(this.bgHideTransition_);
    this.bgHideTransition_ = null;
    goog.ui.ModalPopup.superClass_.disposeInternal.call(this)
};
goog.ui.Dialog = function(a, b, c) {
    goog.ui.ModalPopup.call(this, b, c);
    this.class_ = a || "modal-dialog";
    this.buttons_ = goog.ui.Dialog.ButtonSet.createOkCancel()
};
goog.inherits(goog.ui.Dialog, goog.ui.ModalPopup);
goog.ui.Dialog.prototype.escapeToCancel_ = !0;
goog.ui.Dialog.prototype.hasTitleCloseButton_ = !0;
goog.ui.Dialog.prototype.modal_ = !0;
goog.ui.Dialog.prototype.draggable_ = !0;
goog.ui.Dialog.prototype.backgroundElementOpacity_ = .5;
goog.ui.Dialog.prototype.title_ = "";
goog.ui.Dialog.prototype.content_ = null;
goog.ui.Dialog.prototype.dragger_ = null;
goog.ui.Dialog.prototype.disposeOnHide_ = !1;
goog.ui.Dialog.prototype.titleEl_ = null;
goog.ui.Dialog.prototype.titleTextEl_ = null;
goog.ui.Dialog.prototype.titleTextId_ = null;
goog.ui.Dialog.prototype.titleCloseEl_ = null;
goog.ui.Dialog.prototype.contentEl_ = null;
goog.ui.Dialog.prototype.buttonEl_ = null;
goog.ui.Dialog.prototype.preferredAriaRole_ = goog.a11y.aria.Role.DIALOG;
goog.ui.Dialog.prototype.getCssClass = function() {
    return this.class_
};
goog.ui.Dialog.prototype.setTitle = function(a) {
    this.title_ = a;
    this.titleTextEl_ && goog.dom.setTextContent(this.titleTextEl_, a)
};
goog.ui.Dialog.prototype.getTitle = function() {
    return this.title_
};
goog.ui.Dialog.prototype.setContent = function(a) {
    this.setSafeHtmlContent(goog.html.legacyconversions.safeHtmlFromString(a))
};
goog.ui.Dialog.prototype.setSafeHtmlContent = function(a) {
    this.content_ = a;
    this.contentEl_ && goog.dom.safe.setInnerHtml(this.contentEl_, a)
};
goog.ui.Dialog.prototype.getContent = function() {
    return null != this.content_ ? goog.html.SafeHtml.unwrap(this.content_) : ""
};
goog.ui.Dialog.prototype.getSafeHtmlContent = function() {
    return this.content_
};
goog.ui.Dialog.prototype.getPreferredAriaRole = function() {
    return this.preferredAriaRole_
};
goog.ui.Dialog.prototype.setPreferredAriaRole = function(a) {
    this.preferredAriaRole_ = a
};
goog.ui.Dialog.prototype.renderIfNoDom_ = function() {
    this.getElement() || this.render()
};
goog.ui.Dialog.prototype.getContentElement = function() {
    this.renderIfNoDom_();
    return this.contentEl_
};
goog.ui.Dialog.prototype.getTitleElement = function() {
    this.renderIfNoDom_();
    return this.titleEl_
};
goog.ui.Dialog.prototype.getTitleTextElement = function() {
    this.renderIfNoDom_();
    return this.titleTextEl_
};
goog.ui.Dialog.prototype.getTitleCloseElement = function() {
    this.renderIfNoDom_();
    return this.titleCloseEl_
};
goog.ui.Dialog.prototype.getButtonElement = function() {
    this.renderIfNoDom_();
    return this.buttonEl_
};
goog.ui.Dialog.prototype.getDialogElement = function() {
    this.renderIfNoDom_();
    return this.getElement()
};
goog.ui.Dialog.prototype.getBackgroundElement = function() {
    this.renderIfNoDom_();
    return goog.ui.Dialog.superClass_.getBackgroundElement.call(this)
};
goog.ui.Dialog.prototype.getBackgroundElementOpacity = function() {
    return this.backgroundElementOpacity_
};
goog.ui.Dialog.prototype.setBackgroundElementOpacity = function(a) {
    this.backgroundElementOpacity_ = a;
    this.getElement() && (a = this.getBackgroundElement()) && goog.style.setOpacity(a, this.backgroundElementOpacity_)
};
goog.ui.Dialog.prototype.setModal = function(a) {
    a != this.modal_ && this.setModalInternal_(a)
};
goog.ui.Dialog.prototype.setModalInternal_ = function(a) {
    this.modal_ = a;
    if (this.isInDocument()) {
        var b = this.getDomHelper(),
            c = this.getBackgroundElement(),
            d = this.getBackgroundIframe();
        a ? (d && b.insertSiblingBefore(d, this.getElement()), b.insertSiblingBefore(c, this.getElement())) : (b.removeNode(d), b.removeNode(c))
    }
    this.isVisible() && this.setA11YDetectBackground(a)
};
goog.ui.Dialog.prototype.getModal = function() {
    return this.modal_
};
goog.ui.Dialog.prototype.getClass = function() {
    return this.getCssClass()
};
goog.ui.Dialog.prototype.setDraggable = function(a) {
    this.draggable_ = a;
    this.setDraggingEnabled_(a && this.isInDocument())
};
goog.ui.Dialog.prototype.createDragger = function() {
    return new goog.fx.Dragger(this.getElement(), this.titleEl_)
};
goog.ui.Dialog.prototype.getDraggable = function() {
    return this.draggable_
};
goog.ui.Dialog.prototype.setDraggingEnabled_ = function(a) {
    var b = goog.string.trim(this.class_ + "-title-draggable").split(" ");
    this.getElement() && (a ? goog.dom.classlist.addAll(goog.asserts.assert(this.titleEl_), b) : goog.dom.classlist.removeAll(goog.asserts.assert(this.titleEl_), b));
    a && !this.dragger_ ? (this.dragger_ = this.createDragger(), goog.dom.classlist.addAll(goog.asserts.assert(this.titleEl_), b), goog.events.listen(this.dragger_, goog.fx.Dragger.EventType.START, this.setDraggerLimits_, !1, this)) : !a && this.dragger_ &&
        (this.dragger_.dispose(), this.dragger_ = null)
};
goog.ui.Dialog.prototype.createDom = function() {
    goog.ui.Dialog.superClass_.createDom.call(this);
    var a = this.getElement();
    goog.asserts.assert(a, "getElement() returns null");
    var b = this.getDomHelper();
    this.titleEl_ = b.createDom("div", this.class_ + "-title", this.titleTextEl_ = b.createDom("span", {
        className: this.class_ + "-title-text",
        id: this.getId()
    }, this.title_), this.titleCloseEl_ = b.createDom("span", this.class_ + "-title-close"));
    goog.dom.append(a, this.titleEl_, this.contentEl_ = b.createDom("div", this.class_ + "-content"),
        this.buttonEl_ = b.createDom("div", this.class_ + "-buttons"));
    goog.a11y.aria.setRole(this.titleTextEl_, goog.a11y.aria.Role.HEADING);
    goog.a11y.aria.setRole(this.titleCloseEl_, goog.a11y.aria.Role.BUTTON);
    goog.dom.setFocusableTabIndex(this.titleCloseEl_, !0);
    goog.a11y.aria.setLabel(this.titleCloseEl_, goog.ui.Dialog.MSG_GOOG_UI_DIALOG_CLOSE_);
    this.titleTextId_ = this.titleTextEl_.id;
    goog.a11y.aria.setRole(a, this.getPreferredAriaRole());
    goog.a11y.aria.setState(a, goog.a11y.aria.State.LABELLEDBY, this.titleTextId_ ||
        "");
    this.content_ && goog.dom.safe.setInnerHtml(this.contentEl_, this.content_);
    goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
    this.buttons_ && this.buttons_.attachToElement(this.buttonEl_);
    goog.style.setElementShown(this.buttonEl_, !!this.buttons_);
    this.setBackgroundElementOpacity(this.backgroundElementOpacity_)
};
goog.ui.Dialog.prototype.decorateInternal = function(a) {
    goog.ui.Dialog.superClass_.decorateInternal.call(this, a);
    a = this.getElement();
    goog.asserts.assert(a, "The DOM element for dialog cannot be null.");
    var b = this.class_ + "-content";
    this.contentEl_ = goog.dom.getElementsByTagNameAndClass(null, b, a)[0];
    this.contentEl_ || (this.contentEl_ = this.getDomHelper().createDom("div", b), this.content_ && goog.dom.safe.setInnerHtml(this.contentEl_, this.content_), a.appendChild(this.contentEl_));
    var b = this.class_ + "-title",
        c =
        this.class_ + "-title-text",
        d = this.class_ + "-title-close";
    (this.titleEl_ = goog.dom.getElementsByTagNameAndClass(null, b, a)[0]) ? (this.titleTextEl_ = goog.dom.getElementsByTagNameAndClass(null, c, this.titleEl_)[0], this.titleCloseEl_ = goog.dom.getElementsByTagNameAndClass(null, d, this.titleEl_)[0]) : (this.titleEl_ = this.getDomHelper().createDom("div", b), a.insertBefore(this.titleEl_, this.contentEl_));
    this.titleTextEl_ ? (this.title_ = goog.dom.getTextContent(this.titleTextEl_), this.titleTextEl_.id || (this.titleTextEl_.id =
        this.getId())) : (this.titleTextEl_ = goog.dom.createDom("span", {
        className: c,
        id: this.getId()
    }), this.titleEl_.appendChild(this.titleTextEl_));
    this.titleTextId_ = this.titleTextEl_.id;
    goog.a11y.aria.setState(a, goog.a11y.aria.State.LABELLEDBY, this.titleTextId_ || "");
    this.titleCloseEl_ || (this.titleCloseEl_ = this.getDomHelper().createDom("span", d), this.titleEl_.appendChild(this.titleCloseEl_));
    goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
    b = this.class_ + "-buttons";
    (this.buttonEl_ = goog.dom.getElementsByTagNameAndClass(null,
        b, a)[0]) ? (this.buttons_ = new goog.ui.Dialog.ButtonSet(this.getDomHelper()), this.buttons_.decorate(this.buttonEl_)) : (this.buttonEl_ = this.getDomHelper().createDom("div", b), a.appendChild(this.buttonEl_), this.buttons_ && this.buttons_.attachToElement(this.buttonEl_), goog.style.setElementShown(this.buttonEl_, !!this.buttons_));
    this.setBackgroundElementOpacity(this.backgroundElementOpacity_)
};
goog.ui.Dialog.prototype.enterDocument = function() {
    goog.ui.Dialog.superClass_.enterDocument.call(this);
    this.getHandler().listen(this.getElement(), goog.events.EventType.KEYDOWN, this.onKey_).listen(this.getElement(), goog.events.EventType.KEYPRESS, this.onKey_);
    this.getHandler().listen(this.buttonEl_, goog.events.EventType.CLICK, this.onButtonClick_);
    this.setDraggingEnabled_(this.draggable_);
    this.getHandler().listen(this.titleCloseEl_, goog.events.EventType.CLICK, this.onTitleCloseClick_);
    var a = this.getElement();
    goog.asserts.assert(a, "The DOM element for dialog cannot be null");
    goog.a11y.aria.setRole(a, this.getPreferredAriaRole());
    "" !== this.titleTextEl_.id && goog.a11y.aria.setState(a, goog.a11y.aria.State.LABELLEDBY, this.titleTextEl_.id);
    this.modal_ || this.setModalInternal_(!1)
};
goog.ui.Dialog.prototype.exitDocument = function() {
    this.isVisible() && this.setVisible(!1);
    this.setDraggingEnabled_(!1);
    goog.ui.Dialog.superClass_.exitDocument.call(this)
};
goog.ui.Dialog.prototype.setVisible = function(a) {
    a != this.isVisible() && (this.isInDocument() || this.render(), goog.ui.Dialog.superClass_.setVisible.call(this, a))
};
goog.ui.Dialog.prototype.onShow = function() {
    goog.ui.Dialog.superClass_.onShow.call(this);
    this.dispatchEvent(goog.ui.Dialog.EventType.AFTER_SHOW)
};
goog.ui.Dialog.prototype.onHide = function() {
    goog.ui.Dialog.superClass_.onHide.call(this);
    this.dispatchEvent(goog.ui.Dialog.EventType.AFTER_HIDE);
    this.disposeOnHide_ && this.dispose()
};
goog.ui.Dialog.prototype.setDraggerLimits_ = function(a) {
    var b = this.getDomHelper().getDocument();
    a = goog.dom.getWindow(b) || window;
    a = goog.dom.getViewportSize(a);
    var c = Math.max(b.body.scrollWidth, a.width),
        b = Math.max(b.body.scrollHeight, a.height),
        d = goog.style.getSize(this.getElement());
    "fixed" == goog.style.getComputedPosition(this.getElement()) ? this.dragger_.setLimits(new goog.math.Rect(0, 0, Math.max(0, a.width - d.width), Math.max(0, a.height - d.height))) : this.dragger_.setLimits(new goog.math.Rect(0, 0, c - d.width,
        b - d.height))
};
goog.ui.Dialog.prototype.onTitleCloseClick_ = function(a) {
    this.handleTitleClose_()
};
goog.ui.Dialog.prototype.handleTitleClose_ = function() {
    if (this.hasTitleCloseButton_) {
        var a = this.getButtonSet(),
            b = a && a.getCancel();
        b ? (a = a.get(b), this.dispatchEvent(new goog.ui.Dialog.Event(b, a)) && this.setVisible(!1)) : this.setVisible(!1)
    }
};
goog.ui.Dialog.prototype.getHasTitleCloseButton = function() {
    return this.hasTitleCloseButton_
};
goog.ui.Dialog.prototype.setHasTitleCloseButton = function(a) {
    this.hasTitleCloseButton_ = a;
    this.titleCloseEl_ && goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_)
};
goog.ui.Dialog.prototype.isEscapeToCancel = function() {
    return this.escapeToCancel_
};
goog.ui.Dialog.prototype.setEscapeToCancel = function(a) {
    this.escapeToCancel_ = a
};
goog.ui.Dialog.prototype.setDisposeOnHide = function(a) {
    this.disposeOnHide_ = a
};
goog.ui.Dialog.prototype.getDisposeOnHide = function() {
    return this.disposeOnHide_
};
goog.ui.Dialog.prototype.disposeInternal = function() {
    this.buttonEl_ = this.titleCloseEl_ = null;
    goog.ui.Dialog.superClass_.disposeInternal.call(this)
};
goog.ui.Dialog.prototype.setButtonSet = function(a) {
    this.buttons_ = a;
    this.buttonEl_ && (this.buttons_ ? this.buttons_.attachToElement(this.buttonEl_) : goog.dom.safe.setInnerHtml(this.buttonEl_, goog.html.SafeHtml.EMPTY), goog.style.setElementShown(this.buttonEl_, !!this.buttons_))
};
goog.ui.Dialog.prototype.getButtonSet = function() {
    return this.buttons_
};
goog.ui.Dialog.prototype.onButtonClick_ = function(a) {
    if ((a = this.findParentButton_(a.target)) && !a.disabled) {
        a = a.name;
        var b = this.getButtonSet().get(a);
        this.dispatchEvent(new goog.ui.Dialog.Event(a, b)) && this.setVisible(!1)
    }
};
goog.ui.Dialog.prototype.findParentButton_ = function(a) {
    for (; null != a && a != this.buttonEl_;) {
        if ("BUTTON" == a.tagName) return a;
        a = a.parentNode
    }
    return null
};
goog.ui.Dialog.prototype.onKey_ = function(a) {
    var b = !1,
        c = !1,
        d = this.getButtonSet(),
        e = a.target;
    if (a.type == goog.events.EventType.KEYDOWN)
        if (this.escapeToCancel_ && a.keyCode == goog.events.KeyCodes.ESC) {
            var f = d && d.getCancel(),
                e = "SELECT" == e.tagName && !e.disabled;
            f && !e ? (c = !0, b = d.get(f), b = this.dispatchEvent(new goog.ui.Dialog.Event(f, b))) : e || (b = !0)
        } else a.keyCode == goog.events.KeyCodes.TAB && a.shiftKey && e == this.getElement() && this.setupBackwardTabWrap();
    else if (a.keyCode == goog.events.KeyCodes.ENTER) {
        if ("BUTTON" ==
            e.tagName && !e.disabled) f = e.name;
        else if (e == this.titleCloseEl_) this.handleTitleClose_();
        else if (d) {
            var g = d.getDefault(),
                h = g && d.getButton(g),
                e = ("TEXTAREA" == e.tagName || "SELECT" == e.tagName || "A" == e.tagName) && !e.disabled;
            !h || h.disabled || e || (f = g)
        }
        f && d && (c = !0, b = this.dispatchEvent(new goog.ui.Dialog.Event(f, String(d.get(f)))))
    } else e == this.titleCloseEl_ && a.keyCode == goog.events.KeyCodes.SPACE && this.handleTitleClose_();
    if (b || c) a.stopPropagation(), a.preventDefault();
    b && this.setVisible(!1)
};
goog.ui.Dialog.Event = function(a, b) {
    this.type = goog.ui.Dialog.EventType.SELECT;
    this.key = a;
    this.caption = b
};
goog.inherits(goog.ui.Dialog.Event, goog.events.Event);
goog.ui.Dialog.SELECT_EVENT = "dialogselect";
goog.ui.Dialog.EventType = {
    SELECT: "dialogselect",
    AFTER_HIDE: "afterhide",
    AFTER_SHOW: "aftershow"
};
goog.ui.Dialog.ButtonSet = function(a) {
    this.dom_ = a || goog.dom.getDomHelper();
    goog.structs.Map.call(this)
};
goog.inherits(goog.ui.Dialog.ButtonSet, goog.structs.Map);
goog.ui.Dialog.ButtonSet.prototype.class_ = "goog-buttonset";
goog.ui.Dialog.ButtonSet.prototype.defaultButton_ = null;
goog.ui.Dialog.ButtonSet.prototype.element_ = null;
goog.ui.Dialog.ButtonSet.prototype.cancelButton_ = null;
goog.ui.Dialog.ButtonSet.prototype.set = function(a, b, c, d) {
    goog.structs.Map.prototype.set.call(this, a, b);
    c && (this.defaultButton_ = a);
    d && (this.cancelButton_ = a);
    return this
};
goog.ui.Dialog.ButtonSet.prototype.addButton = function(a, b, c) {
    return this.set(a.key, a.caption, b, c)
};
goog.ui.Dialog.ButtonSet.prototype.attachToElement = function(a) {
    this.element_ = a;
    this.render()
};
goog.ui.Dialog.ButtonSet.prototype.render = function() {
    if (this.element_) {
        goog.dom.safe.setInnerHtml(this.element_, goog.html.SafeHtml.EMPTY);
        var a = goog.dom.getDomHelper(this.element_);
        this.forEach(function(b, c) {
            var d = a.createDom("button", {
                name: c
            }, b);
            c == this.defaultButton_ && (d.className = this.class_ + "-default");
            this.element_.appendChild(d)
        }, this)
    }
};
goog.ui.Dialog.ButtonSet.prototype.decorate = function(a) {
    if (a && a.nodeType == goog.dom.NodeType.ELEMENT) {
        this.element_ = a;
        a = this.element_.getElementsByTagName("button");
        for (var b = 0, c, d, e; c = a[b]; b++)
            if (d = c.name || c.id, e = goog.dom.getTextContent(c) || c.value, d) {
                var f = 0 == b;
                this.set(d, e, f, c.name == goog.ui.Dialog.DefaultButtonKeys.CANCEL);
                f && goog.dom.classlist.add(c, this.class_ + "-default")
            }
    }
};
goog.ui.Dialog.ButtonSet.prototype.getElement = function() {
    return this.element_
};
goog.ui.Dialog.ButtonSet.prototype.getDomHelper = function() {
    return this.dom_
};
goog.ui.Dialog.ButtonSet.prototype.setDefault = function(a) {
    this.defaultButton_ = a
};
goog.ui.Dialog.ButtonSet.prototype.getDefault = function() {
    return this.defaultButton_
};
goog.ui.Dialog.ButtonSet.prototype.setCancel = function(a) {
    this.cancelButton_ = a
};
goog.ui.Dialog.ButtonSet.prototype.getCancel = function() {
    return this.cancelButton_
};
goog.ui.Dialog.ButtonSet.prototype.getButton = function(a) {
    for (var b = this.getAllButtons(), c = 0, d; d = b[c]; c++)
        if (d.name == a || d.id == a) return d;
    return null
};
goog.ui.Dialog.ButtonSet.prototype.getAllButtons = function() {
    return this.element_.getElementsByTagName(goog.dom.TagName.BUTTON)
};
goog.ui.Dialog.ButtonSet.prototype.setButtonEnabled = function(a, b) {
    var c = this.getButton(a);
    c && (c.disabled = !b)
};
goog.ui.Dialog.ButtonSet.prototype.setAllButtonsEnabled = function(a) {
    for (var b = this.getAllButtons(), c = 0, d; d = b[c]; c++) d.disabled = !a
};
goog.ui.Dialog.DefaultButtonKeys = {
    OK: "ok",
    CANCEL: "cancel",
    YES: "yes",
    NO: "no",
    SAVE: "save",
    CONTINUE: "continue"
};
goog.ui.Dialog.MSG_DIALOG_OK_ = "OK";
goog.ui.Dialog.MSG_DIALOG_CANCEL_ = "Cancel";
goog.ui.Dialog.MSG_DIALOG_YES_ = "Yes";
goog.ui.Dialog.MSG_DIALOG_NO_ = "No";
goog.ui.Dialog.MSG_DIALOG_SAVE_ = "Save";
goog.ui.Dialog.MSG_DIALOG_CONTINUE_ = "Continue";
goog.ui.Dialog.MSG_GOOG_UI_DIALOG_CLOSE_ = "Close";
goog.ui.Dialog.DefaultButtonCaptions = {
    OK: goog.ui.Dialog.MSG_DIALOG_OK_,
    CANCEL: goog.ui.Dialog.MSG_DIALOG_CANCEL_,
    YES: goog.ui.Dialog.MSG_DIALOG_YES_,
    NO: goog.ui.Dialog.MSG_DIALOG_NO_,
    SAVE: goog.ui.Dialog.MSG_DIALOG_SAVE_,
    CONTINUE: goog.ui.Dialog.MSG_DIALOG_CONTINUE_
};
goog.ui.Dialog.ButtonSet.DefaultButtons = {
    OK: {
        key: goog.ui.Dialog.DefaultButtonKeys.OK,
        caption: goog.ui.Dialog.DefaultButtonCaptions.OK
    },
    CANCEL: {
        key: goog.ui.Dialog.DefaultButtonKeys.CANCEL,
        caption: goog.ui.Dialog.DefaultButtonCaptions.CANCEL
    },
    YES: {
        key: goog.ui.Dialog.DefaultButtonKeys.YES,
        caption: goog.ui.Dialog.DefaultButtonCaptions.YES
    },
    NO: {
        key: goog.ui.Dialog.DefaultButtonKeys.NO,
        caption: goog.ui.Dialog.DefaultButtonCaptions.NO
    },
    SAVE: {
        key: goog.ui.Dialog.DefaultButtonKeys.SAVE,
        caption: goog.ui.Dialog.DefaultButtonCaptions.SAVE
    },
    CONTINUE: {
        key: goog.ui.Dialog.DefaultButtonKeys.CONTINUE,
        caption: goog.ui.Dialog.DefaultButtonCaptions.CONTINUE
    }
};
goog.ui.Dialog.ButtonSet.createOk = function() {
    return (new goog.ui.Dialog.ButtonSet).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK, !0, !0)
};
goog.ui.Dialog.ButtonSet.createOkCancel = function() {
    return (new goog.ui.Dialog.ButtonSet).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK, !0).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, !1, !0)
};
goog.ui.Dialog.ButtonSet.createYesNo = function() {
    return (new goog.ui.Dialog.ButtonSet).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.YES, !0).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.NO, !1, !0)
};
goog.ui.Dialog.ButtonSet.createYesNoCancel = function() {
    return (new goog.ui.Dialog.ButtonSet).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.YES).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.NO, !0).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, !1, !0)
};
goog.ui.Dialog.ButtonSet.createContinueSaveCancel = function() {
    return (new goog.ui.Dialog.ButtonSet).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CONTINUE).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE).addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, !0, !0)
};
(function() {
    "undefined" != typeof document && (goog.ui.Dialog.ButtonSet.OK = goog.ui.Dialog.ButtonSet.createOk(), goog.ui.Dialog.ButtonSet.OK_CANCEL = goog.ui.Dialog.ButtonSet.createOkCancel(), goog.ui.Dialog.ButtonSet.YES_NO = goog.ui.Dialog.ButtonSet.createYesNo(), goog.ui.Dialog.ButtonSet.YES_NO_CANCEL = goog.ui.Dialog.ButtonSet.createYesNoCancel(), goog.ui.Dialog.ButtonSet.CONTINUE_SAVE_CANCEL = goog.ui.Dialog.ButtonSet.createContinueSaveCancel())
})();
goog.events.MouseWheelHandler = function(a, b) {
    goog.events.EventTarget.call(this);
    this.element_ = a;
    var c = goog.dom.isElement(this.element_) ? this.element_ : this.element_ ? this.element_.body : null;
    this.isRtl_ = !!c && goog.style.isRightToLeft(c);
    this.listenKey_ = goog.events.listen(this.element_, goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", this, b)
};
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);
goog.events.MouseWheelHandler.EventType = {
    MOUSEWHEEL: "mousewheel"
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(a) {
    this.maxDeltaX_ = a
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(a) {
    this.maxDeltaY_ = a
};
goog.events.MouseWheelHandler.prototype.handleEvent = function(a) {
    var b = 0,
        c = 0,
        d = 0;
    a = a.getBrowserEvent();
    if ("mousewheel" == a.type) {
        c = 1;
        if (goog.userAgent.IE || goog.userAgent.WEBKIT && (goog.userAgent.WINDOWS || goog.userAgent.isVersionOrHigher("532.0"))) c = 40;
        d = goog.events.MouseWheelHandler.smartScale_(-a.wheelDelta, c);
        goog.isDef(a.wheelDeltaX) ? (b = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaX, c), c = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaY, c)) : c = d
    } else d = a.detail, 100 < d ? d = 3 : -100 > d && (d = -3), goog.isDef(a.axis) && a.axis === a.HORIZONTAL_AXIS ? b = d : c = d;
    goog.isNumber(this.maxDeltaX_) && (b = goog.math.clamp(b, -this.maxDeltaX_, this.maxDeltaX_));
    goog.isNumber(this.maxDeltaY_) && (c = goog.math.clamp(c, -this.maxDeltaY_, this.maxDeltaY_));
    this.isRtl_ && (b = -b);
    b = new goog.events.MouseWheelEvent(d, a, b, c);
    this.dispatchEvent(b)
};
goog.events.MouseWheelHandler.smartScale_ = function(a, b) {
    return goog.userAgent.WEBKIT && (goog.userAgent.MAC || goog.userAgent.LINUX) && 0 != a % b ? a : a / b
};
goog.events.MouseWheelHandler.prototype.disposeInternal = function() {
    goog.events.MouseWheelHandler.superClass_.disposeInternal.call(this);
    goog.events.unlistenByKey(this.listenKey_);
    this.listenKey_ = null
};
goog.events.MouseWheelEvent = function(a, b, c, d) {
    goog.events.BrowserEvent.call(this, b);
    this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;
    this.detail = a;
    this.deltaX = c;
    this.deltaY = d
};
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
picker.api.ScrollableParentFinder = {};
picker.api.ScrollableParentFinder.findFirst = function(a) {
    for (; a;) {
        if (a.nodeType == goog.dom.NodeType.ELEMENT) {
            var b = goog.style.getComputedOverflowY(a);
            if ("auto" == b || "scroll" == b) return a
        }
        a = a.parentNode
    }
    return null
};
picker.api.PickerScroller = {};
picker.api.PickerScroller.applyTo = function(a, b) {
    var c = new goog.events.MouseWheelHandler(a);
    b.registerDisposable(c);
    b.listen(c, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, goog.bind(picker.api.PickerScroller.handleScroll_, void 0, a)).listen(a, goog.events.EventType.SCROLL, goog.bind(picker.api.PickerScroller.handleScroll_, void 0, a))
};
picker.api.PickerScroller.handleScroll_ = function(a, b) {
    var c = picker.api.ScrollableParentFinder.findFirst(b.target);
    if (!c || !goog.dom.contains(a, c) || c.scrollHeight == c.clientHeight || 0 < b.deltaY && picker.api.PickerScroller.approximatelyEquals_(c.scrollTop, c.scrollHeight - c.clientHeight) || 0 > b.deltaY && 0 == c.scrollTop) b.preventDefault(), b.stopPropagation()
};
picker.api.PickerScroller.approximatelyEquals_ = function(a, b) {
    return 1 >= Math.abs(a - b)
};
goog.structs.Collection = function() {};
goog.structs.Set = function(a) {
    this.map_ = new goog.structs.Map;
    a && this.addAll(a)
};
goog.structs.Set.getKey_ = function(a) {
    var b = typeof a;
    return "object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
    return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
    this.map_.set(goog.structs.Set.getKey_(a), a)
};
goog.structs.Set.prototype.addAll = function(a) {
    a = goog.structs.getValues(a);
    for (var b = a.length, c = 0; c < b; c++) this.add(a[c])
};
goog.structs.Set.prototype.removeAll = function(a) {
    a = goog.structs.getValues(a);
    for (var b = a.length, c = 0; c < b; c++) this.remove(a[c])
};
goog.structs.Set.prototype.remove = function(a) {
    return this.map_.remove(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
    this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
    return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
    return this.map_.containsKey(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
    return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(a) {
    var b = new goog.structs.Set;
    a = goog.structs.getValues(a);
    for (var c = 0; c < a.length; c++) {
        var d = a[c];
        this.contains(d) && b.add(d)
    }
    return b
};
goog.structs.Set.prototype.difference = function(a) {
    var b = this.clone();
    b.removeAll(a);
    return b
};
goog.structs.Set.prototype.getValues = function() {
    return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
    return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
    return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
    var b = goog.structs.getCount(a);
    if (this.getCount() > b) return !1;
    !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
    return goog.structs.every(this, function(b) {
        return goog.structs.contains(a, b)
    })
};
goog.structs.Set.prototype.__iterator__ = function(a) {
    return this.map_.__iterator__(!1)
};
picker.api.PickerSizer = function() {};
goog.addSingletonGetter(picker.api.PickerSizer);
picker.api.PickerSizer.MIN_ONEPICK_HEIGHT_ = 350;
picker.api.PickerSizer.MAX_ONEPICK_HEIGHT_ = 650;
picker.api.PickerSizer.WIDTH_TO_HEIGHT_RATIO_ = .618;
picker.api.PickerSizer.MIN_ONEPICK_WIDTH_ = 566;
picker.api.PickerSizer.MAX_ONEPICK_WIDTH_ = 1051;
picker.api.PickerSizer.ONEPICK_SIZE_RATIO_ = .85;
picker.api.PickerSizer.SHADE_PADDING_ = 40;
picker.api.PickerSizer.getShadeSize = function(a) {
    var b = goog.dom.getViewportSize(a);
    a = Math.max(b.width - 2 * picker.api.PickerSizer.SHADE_PADDING_, 0);
    b = Math.max(b.height - picker.api.PickerSizer.SHADE_PADDING_, 0);
    return new goog.math.Size(a, b)
};
picker.api.PickerSizer.getOptimalSize = function(a, b, c) {
    b ? (b = Math.max(picker.api.PickerSizer.MIN_ONEPICK_WIDTH_, Math.min(picker.api.PickerSizer.MAX_ONEPICK_WIDTH_, b)), c || (a = goog.dom.getViewportSize(a), c = a.height * picker.api.PickerSizer.ONEPICK_SIZE_RATIO_), a = Math.max(picker.api.PickerSizer.MIN_ONEPICK_HEIGHT_, Math.min(picker.api.PickerSizer.MAX_ONEPICK_HEIGHT_, c))) : (a = goog.dom.getViewportSize(a), b = a.width * picker.api.PickerSizer.WIDTH_TO_HEIGHT_RATIO_, a = b < a.height ? Math.round(Math.max(picker.api.PickerSizer.MIN_ONEPICK_HEIGHT_,
        Math.min(picker.api.PickerSizer.MAX_ONEPICK_HEIGHT_, b * picker.api.PickerSizer.ONEPICK_SIZE_RATIO_))) : Math.round(Math.max(picker.api.PickerSizer.MIN_ONEPICK_HEIGHT_, Math.min(picker.api.PickerSizer.MAX_ONEPICK_HEIGHT_, a.height * picker.api.PickerSizer.ONEPICK_SIZE_RATIO_))), b = Math.round(a / picker.api.PickerSizer.WIDTH_TO_HEIGHT_RATIO_));
    return new goog.math.Size(b, a)
};
picker.api.PickerSizer.isLegacyHost = function(a) {
    picker.api.PickerSizer.legacyHosts_ || (picker.api.PickerSizer.legacyHosts_ = new goog.structs.Set("DocVerse fusiontables geo geowiki gm gmail-gadget gws hotpot jointly orkut presentations pwa sites templates trix trix-copy-sheet webstore".split(" ")));
    return picker.api.PickerSizer.legacyHosts_.contains(a)
};
picker.api.Picker = function(a, b, c, d, e) {
    goog.ui.Dialog.call(this, this.className_, !0, c);
    this.targetId_ = goog.string.getRandomString();
    this.rpcToken_ = goog.string.getRandomString();
    this.setUrl(a);
    this.preferredDialogWidth_ = d;
    this.preferredDialogHeight_ = e;
    this.autoSizeDialog_ = picker.api.Picker.isAutoSizeDialog(a, d, e);
    b && (b = PICKER_THIRD_PARTY_API ? "onepick" : goog.Uri.parse(a).getParameterValue("hostId"), picker.api.GadgetsLoader.load(b, this.getDomHelper()));
    this.setDefaultRelayUrl_(a);
    this.setEscapeToCancel(!1);
    this.setButtonSet(null)
};
goog.inherits(picker.api.Picker, goog.ui.Dialog);
picker.api.Picker.prototype.className_ = "picker modal-dialog";
picker.api.Picker.prototype.url_ = "";
picker.api.Picker.prototype.iframe_ = null;
picker.api.Picker.defaultAutoSizeDialog_ = void 0;
picker.api.Picker.prototype.loadedFired_ = !1;
picker.api.Picker.prototype.callback_ = goog.nullFunction;
picker.api.Picker.prototype.enterDocument = function() {
    picker.api.Picker.superClass_.enterDocument.call(this);
    picker.api.PickerScroller.applyTo(this.getBackgroundElement(), this.getHandler())
};
picker.api.Picker.prototype.render = function(a) {
    picker.api.Picker.superClass_.render.call(this, a);
    a = this.url_;
    this.iframe_ = this.dom_.createDom("iframe", {
        id: this.targetId_,
        name: this.targetId_,
        "class": "picker-frame",
        src: this.getBlankUrl_(),
        onload: goog.bind(this.handleIFrameLoad_, this),
        frameBorder: "0"
    });
    this.getContentElement().appendChild(this.iframe_);
    goog.dom.setFocusableTabIndex(this.iframe_, !0);
    goog.dom.classlist.add(this.getElement(), "picker-dialog");
    PICKER_THIRD_PARTY_API && (goog.dom.classlist.add(this.getElement(),
        "picker-dialog"), goog.dom.classlist.add(this.iframe_, "picker-dialog-frame"), goog.dom.classlist.add(this.getTitleElement(), "picker-dialog-title"), goog.dom.classlist.add(this.getBackgroundElement(), "picker-dialog-bg"), goog.dom.classlist.add(this.getBackgroundIframe(), "picker-dialog-bg"), goog.dom.classlist.add(this.getContentElement(), "picker-dialog-content"), this.getButtonElement() && goog.dom.classlist.add(this.getButtonElement(), "picker-dialog-buttons"));
    this.iframe_.src = a;
    this.execOnGadgetsLoad_(goog.bind(function(a) {
        a.setAuthToken(this.targetId_,
            this.rpcToken_)
    }, this));
    (a = goog.Uri.parse(this.url_).getParameterValue(picker.api.PickerUriParameter.TITLE)) && this.setTitle(a)
};
picker.api.Picker.prototype.getBlankUrl_ = function() {
    return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("7") && goog.string.startsWith(this.url_, "https") ? "https://about:blank" : goog.dom.iframe.BLANK_SOURCE
};
picker.api.Picker.prototype.handleIFrameLoad_ = function() {
    var a = this.getDomHelper().getWindow();
    this.iframe_.src == this.getBlankUrl_() ? this.getHandler().listen(a, goog.events.EventType.KEYDOWN, this.handleKeydown_) : this.getHandler().unlisten(a, goog.events.EventType.KEYDOWN, this.handleKeydown_)
};
picker.api.Picker.prototype.handleKeydown_ = function(a) {
    a.keyCode == goog.events.KeyCodes.ESC && (a = {
        action: picker.api.Action.CANCEL
    }, this.setVisible(!1), this.callback_(a))
};
picker.api.Picker.prototype.execOnGadgetsLoad_ = function(a) {
    var b = this.getDomHelper();
    picker.api.GadgetsLoader.execOnLoad(function() {
        a(b.getWindow().gadgets.rpc)
    }, b)
};
picker.api.Picker.prototype.setUrl = function(a) {
    var b = (new goog.Uri(a)).setParameterValue("rpctoken", this.rpcToken_).setParameterValue("rpcService", this.targetId_);
    PICKER_THIRD_PARTY_API && b.setParameterValue("thirdParty", "true");
    this.url_ = b.toString();
    this.iframe_ && (this.iframe_.src = a)
};
picker.api.Picker.prototype.setAppId = function(a) {
    this.appId_ = a;
    this.loadedFired_ && this.setDriveOptions_()
};
picker.api.Picker.prototype.setCallback = function(a) {
    this.callback_ = a;
    this.execOnGadgetsLoad_(goog.bind(function(a) {
        a.register(this.targetId_, goog.bind(this.handlePickerAction_, this))
    }, this))
};
picker.api.Picker.prototype.handlePickerAction_ = function(a) {
    var b = a.action;
    b == picker.api.Action.LOADED && (this.loadedFired_ = !0, this.setDriveOptions_(), this.setHasTitleCloseButton(!1));
    b != picker.api.Action.PICKED && b != picker.api.Action.CANCEL || this.setVisible(!1);
    this.callback_(a)
};
picker.api.Picker.prototype.hasFeature_ = function(a) {
    return "true" == goog.Uri.parse(this.url_).getParameterValue(a)
};
picker.api.Picker.prototype.setDriveOptions_ = function() {
    this.appId_ && this.sendCommand(new picker.api.commands.SetDriveOptionsCommand(this.appId_, window.location.protocol + "//" + window.location.host))
};
picker.api.Picker.prototype.setRelayUrl = function(a) {
    this.execOnGadgetsLoad_(goog.bind(function(b) {
        b.setRelayUrl(this.targetId_, a)
    }, this))
};
picker.api.Picker.prototype.setDefaultRelayUrl_ = function(a) {
    var b = null,
        c = a.indexOf("/picker?"); - 1 < c ? b = a.substring(0, c + 8 - 1) : goog.string.endsWith(a, "/picker") && (b = a);
    b && this.setRelayUrl(b + "/resources/rpc_relay.html")
};
picker.api.Picker.prototype.sendCommand = function(a) {
    this.execOnGadgetsLoad_(goog.bind(function(b) {
        b.call(this.targetId_, "picker", null, a)
    }, this))
};
picker.api.Picker.prototype.resizePicker_ = function(a) {
    a = this.getDomHelper().getDocument();
    a = goog.dom.getWindow(a) || window;
    a = this.hasFeature_(picker.api.Feature.SHADE_DIALOG) ? picker.api.PickerSizer.getShadeSize(a) : picker.api.PickerSizer.getOptimalSize(a, this.preferredDialogWidth_, this.preferredDialogHeight_);
    goog.style.setSize(this.getContentElement(), a);
    this.reposition()
};
picker.api.Picker.prototype.reposition = function() {
    if (this.hasFeature_(picker.api.Feature.SHADE_DIALOG)) {
        var a = goog.style.getSize(this.getElement()),
            b = goog.dom.getViewportSize(this.getDomHelper().getWindow()),
            a = Math.max(Math.floor(b.width / 2 - a.width / 2), 0),
            b = this.getDomHelper().getDocumentScroll().y;
        goog.style.setPosition(this.getElement(), a, b)
    } else picker.api.Picker.superClass_.reposition.call(this)
};
picker.api.Picker.prototype.setVisible = function(a) {
    if (a != this.isVisible() && this.autoSizeDialog_) {
        var b = this.getDomHelper().getDocument(),
            b = goog.dom.getWindow(b) || window;
        a ? (this.resizePicker_(), this.getHandler().listen(b, goog.events.EventType.RESIZE, this.resizePicker_)) : this.getHandler().unlisten(b, goog.events.EventType.RESIZE, this.resizePicker_)
    }
    picker.api.Picker.superClass_.setVisible.call(this, a);
    this.sendCommand(new picker.api.commands.VisibilityCommand(a))
};
picker.api.Picker.prototype.focus = function() {
    picker.api.Picker.superClass_.focus.call(this);
    if (this.iframe_) try {
        this.iframe_.focus()
    } catch (a) {}
};
picker.api.Picker.setForceAutoSizeDialog = function(a) {
    picker.api.Picker.defaultAutoSizeDialog_ = a
};
picker.api.Picker.isAutoSizeDialog = function(a, b, c) {
    if (goog.isDef(picker.api.Picker.defaultAutoSizeDialog_)) return picker.api.Picker.defaultAutoSizeDialog_;
    if (goog.isDef(b) || goog.isDef(c)) return !0;
    a = goog.Uri.parse(a).getParameterValue("hostId");
    return !picker.api.PickerSizer.isLegacyHost(a)
};
picker.api.PickerBuilder = function(a) {
    picker.api.AbstractPickerBuilder.call(this, a);
    this.uri_ = new goog.Uri(this.getBaseUrl());
    this.setProtocol(picker.api.Protocol.GADGETS);
    PICKER_THIRD_PARTY_API && window.google && (a = (a = window.google) && a.picker && a.picker.LoadArgs) && (a = (new goog.Uri.QueryData(a)).get("hl")) && this.setLocale(a.toString());
    (a = window.location.origin) || (a = window.location.protocol + "//" + window.location.host);
    this.setOrigin(a);
    this.postProcessors_ = []
};
goog.inherits(picker.api.PickerBuilder, picker.api.AbstractPickerBuilder);
picker.api.PickerBuilder.prototype.loadGadgets_ = !0;
picker.api.PickerBuilder.prototype.disposeOnHide_ = !1;
picker.api.PickerBuilder.prototype.addPostProcessor = function(a, b) {
    this.postProcessors_.push([a, b || {}]);
    return this
};
picker.api.PickerBuilder.prototype.buildInternal_ = function() {
    PICKER_THIRD_PARTY_API && this.uri_.setParameterValue(picker.api.PickerUriParameter.HOST_ID, window.location.host.split(":")[0]);
    this.getRelayUrl() || this.setRelayUrl(goog.Uri.parse(window.location.href).setQueryData(void 0).setFragment("").setPath("/favicon.ico").toString())
};
picker.api.PickerBuilder.prototype.build = function() {
    this.buildInternal_();
    if (Boolean(this.uri_.getParameterValue(picker.api.Feature.MINIMAL_MODE))) throw Error("use buildMinimal to build minimal picker");
    var a = new picker.api.Picker(this.toUri().toString(), this.loadGadgets_, this.getDomHelper(), this.dialogWidth_, this.dialogHeight_);
    a.setDisposeOnHide(this.disposeOnHide_);
    a.setAppId(this.getAppId());
    a.setCallback(this.getCallback());
    return a
};
picker.api.PickerBuilder.prototype.buildMinimal = function() {
    this.enableFeature(picker.api.Feature.MINIMAL_MODE);
    this.buildInternal_();
    var a = new picker.api.MinimalPicker(this.toUri().toString(), this.loadGadgets_, this.getDomHelper(), this.dialogWidth_, this.dialogHeight_, this.disableAutoHide_);
    a.setAppId(this.getAppId());
    a.setCallback(this.getCallback());
    return a
};
picker.api.PickerBuilder.prototype.disableAutoHide = function(a) {
    this.disableAutoHide_ = a;
    return this
};
picker.api.PickerBuilder.prototype.disableFeature = function(a) {
    this.uri_.removeParameter(a);
    return this
};
picker.api.PickerBuilder.prototype.enableFeature = function(a) {
    this.uri_.setParameterValue(a, "true");
    return this
};
picker.api.PickerBuilder.prototype.getDisposeOnHide = function() {
    return this.disposeOnHide_
};
picker.api.PickerBuilder.prototype.getHeight = function() {
    return this.dialogHeight_
};
picker.api.PickerBuilder.prototype.getProtocol = function() {
    return this.uri_.getParameterValue(picker.api.PickerUriParameter.PROTOCOL)
};
picker.api.PickerBuilder.prototype.getRelayUrl = function() {
    return this.uri_.getParameterValue(picker.api.PickerUriParameter.RELAY_URL)
};
picker.api.PickerBuilder.prototype.getSelectButtonLabel = function() {
    return this.uri_.getParameterValue(picker.api.PickerUriParameter.SELECT_BUTTON_LABEL)
};
picker.api.PickerBuilder.prototype.getTitle = function() {
    return this.uri_.getParameterValue(picker.api.PickerUriParameter.TITLE)
};
picker.api.PickerBuilder.prototype.getWidth = function() {
    return this.dialogWidth_
};
picker.api.PickerBuilder.prototype.getUiVersion = function() {
    var a = this.uri_.getParameterValue(picker.api.PickerUriParameter.UI_VERSION);
    return goog.isDef(a) ? Number(a) : void 0
};
picker.api.PickerBuilder.prototype.isDocsRelatedViewId_ = function(a) {
    switch (a) {
        case picker.api.ViewId.DOCS:
        case picker.api.ViewId.DOCS_VIDEOS:
        case picker.api.ViewId.DOCUMENTS:
        case picker.api.ViewId.FOLDERS:
        case picker.api.ViewId.FORMS:
        case picker.api.ViewId.PDFS:
        case picker.api.ViewId.PRESENTATIONS:
        case picker.api.ViewId.SPREADSHEETS:
            return !0
    }
    return !1
};
picker.api.PickerBuilder.prototype.isFeatureEnabled = function(a) {
    return "true" == this.uri_.getParameterValue(a)
};
picker.api.PickerBuilder.prototype.setDeveloperKey = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.DEVELOPER_KEY, a);
    return this
};
picker.api.PickerBuilder.prototype.setActionPaneType = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.ACTION_PANE_TYPE, a);
    return this
};
picker.api.PickerBuilder.prototype.setActions = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.ACTIONS, a.join(","));
    return this
};
picker.api.PickerBuilder.prototype.setAuthUser = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.AUTHUSER, a);
    return this
};
picker.api.PickerBuilder.prototype.setChromeMode = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.CHROME_MODE, a);
    return this
};
picker.api.PickerBuilder.prototype.setCropMode = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.CROP_MODE, a);
    return this
};
picker.api.PickerBuilder.prototype.setDisposeOnHide = function(a) {
    this.disposeOnHide_ = a;
    return this
};
picker.api.PickerBuilder.prototype.setEventId = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.EVENT_ID, a);
    return this
};
picker.api.PickerBuilder.prototype.setMaxSizeBytes = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MAX_SIZE_BYTES, a);
    return this
};
picker.api.PickerBuilder.prototype.setMaxSizeBytesPerItem = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MAX_SIZE_BYTES_PER_ITEM, a);
    return this
};
picker.api.PickerBuilder.prototype.setMaxItems = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MAX_ITEMS, a);
    return this
};
picker.api.PickerBuilder.prototype.setMinItems = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MIN_ITEMS, a);
    return this
};
picker.api.PickerBuilder.prototype.setExcludeIds = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.EXCLUDE_IDS, a.join(","));
    return this
};
picker.api.PickerBuilder.prototype.setExperiments = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.EXPERIMENTS, a.join(","));
    return this
};
picker.api.PickerBuilder.prototype.setFaceDetectionTimeout = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.FACE_DETECTION_TIMEOUT_MS, a);
    return this
};
picker.api.PickerBuilder.prototype.setGadgetsRpcUrl = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.GADGETS_RPC_URL, a);
    return this
};
picker.api.PickerBuilder.prototype.setGroupId = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.GROUP_ID, a);
    return this
};
picker.api.PickerBuilder.prototype.setHostId = function(a) {
    if (PICKER_THIRD_PARTY_API) throw Error("picker.api.PickerBuilder#setHostId is not supported.");
    this.uri_.setParameterValue(picker.api.PickerUriParameter.HOST_ID, a);
    return this
};
picker.api.PickerBuilder.prototype.setOrigin = function(a) {
    a && this.uri_.setParameterValue(picker.api.PickerUriParameter.ORIGIN, a);
    return this
};
picker.api.PickerBuilder.prototype.setInitialView = function(a) {
    a instanceof picker.api.View ? this.uri_.setParameterValue(picker.api.PickerUriParameter.INITIAL_VIEW, a.toString()) : this.uri_.setParameterValue(picker.api.PickerUriParameter.INITIAL_VIEW, a);
    return this
};
picker.api.PickerBuilder.prototype.setLearnMore = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.LEARN_MORE, a);
    return this
};
picker.api.PickerBuilder.prototype.setLoadGadgetsLibrary = function(a) {
    this.loadGadgets_ = a;
    return this
};
picker.api.PickerBuilder.prototype.setLocale = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.LOCALE, a);
    return this
};
picker.api.PickerBuilder.prototype.setMaxSize = function(a, b) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MAX_SIZE, a + "x" + b);
    return this
};
picker.api.PickerBuilder.prototype.setMinSize = function(a, b) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.MIN_SIZE, a + "x" + b);
    return this
};
picker.api.PickerBuilder.prototype.setNoItemsView = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.NO_ITEMS_VIEW, a);
    return this
};
picker.api.PickerBuilder.prototype.setOAuthToken = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.OAUTH_TOKEN, a);
    return this
};
picker.api.PickerBuilder.prototype.setProtocol = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.PROTOCOL, a);
    return this
};
picker.api.PickerBuilder.prototype.setPostProcessor = function(a, b) {
    return this.addPostProcessor(a, b)
};
picker.api.PickerBuilder.prototype.setRelayUrl = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.RELAY_URL, a);
    return this
};
picker.api.PickerBuilder.prototype.setSelectButtonLabel = function(a) {
    if (PICKER_THIRD_PARTY_API) throw Error("picker.api.PickerBuilder#setSelectButtonLabel is not supported");
    this.uri_.setParameterValue(picker.api.PickerUriParameter.SELECT_BUTTON_LABEL, a);
    return this
};
picker.api.PickerBuilder.prototype.setSelectableMimeTypes = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.SELECTABLE_MIME_TYPES, a);
    return this
};
picker.api.PickerBuilder.prototype.setSize = function(a, b) {
    this.dialogWidth_ = a;
    this.dialogHeight_ = b;
    return this
};
picker.api.PickerBuilder.prototype.setTitleBarIconId = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.TITLE_BAR_ICON_ID, a);
    return this
};
picker.api.PickerBuilder.prototype.setThumbs = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.THUMBS, a);
    return this
};
picker.api.PickerBuilder.prototype.setUploadButton = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.UPLOAD_BUTTON, a.toString());
    return this
};
picker.api.PickerBuilder.prototype.setUploadToAlbumId = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.UPLOAD_TO_ALBUM_ID, a);
    return this
};
picker.api.PickerBuilder.prototype.setTitle = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.TITLE, a);
    return this
};
picker.api.PickerBuilder.prototype.setDogfoodConfidential = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.DOGFOOD_CONFIDENTIAL, a);
    return this
};
picker.api.PickerBuilder.prototype.setActionPaneText = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.ACTION_PANE_TEXT, a);
    return this
};
picker.api.PickerBuilder.prototype.setUiVersion = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.UI_VERSION, a);
    return this
};
picker.api.PickerBuilder.prototype.setUser = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.USER, a);
    return this
};
picker.api.PickerBuilder.prototype.setViewerGender = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.VIEWER_GENDER, a ? a.charAt(0) : void 0);
    return this
};
picker.api.PickerBuilder.prototype.shouldReturnUploadMetadata = function(a) {
    this.uri_.setParameterValue(picker.api.PickerUriParameter.SHOULD_RETURN_UPLOAD_METADATA, a);
    return this
};
picker.api.PickerBuilder.prototype.toUri = function() {
    this.postProcessors_.length && this.uri_.setParameterValue(picker.api.PickerUriParameter.POST_PROCESSORS, goog.json.serialize(this.postProcessors_));
    return this.uri_.setParameterValue(picker.api.PickerUriParameter.NAV, this.getNav()).clone()
};
picker.api.properties = {};
picker.api.properties.Response = {
    ACTION: "action",
    EXTRA_USER_INPUTS: "extraUserInputs",
    DOCUMENTS: "docs",
    PARENTS: "parents",
    VIEW: "view",
    VIEW_TOKEN: "viewToken"
};
picker.api.properties.ExtraUserInputKey = {
    IS_ATTACHMENT: "isAttachment"
};
picker.api.properties.Document = {
    AUDIENCE: "audience",
    CHILDREN: "children",
    CONTENT_ID: "contentId",
    COVER_PHOTO_ID: "coverPhotoId",
    CROP_COORDINATES: "crop",
    DESCRIPTION: "description",
    DRIVE_SUCCESS: "driveSuccess",
    DRIVE_ERROR: "driveError",
    EMAIL: "email",
    EMBEDDABLE_URL: "embedUrl",
    ICON_URL: "iconUrl",
    ID: "id",
    IS_NEW: "isNew",
    IS_LOCAL_PROFILE_PHOTO: "isLocalProfilePhoto",
    KANSAS_VERSION_INFO: "kansasVersionInfo",
    LAST_EDITED_UTC: "lastEditedUtc",
    LATITUDE: "latitude",
    LONGITUDE: "longitude",
    MARKED_FOR_REMOVAL: "markedForRemoval",
    MEDIA_KEY: "mediaKey",
    MIME_TYPE: "mimeType",
    NAME: "name",
    NUM_CHILDREN: "numChildren",
    NUM_TAGGED_FACES: "numTagged",
    NUM_UNTAGGED_FACES: "numUntagged",
    PARENT_ID: "parentId",
    PEOPLE: "people",
    ROTATION: "rotation",
    SERVICE_ID: "serviceId",
    SIZE_BYTES: "sizeBytes",
    THUMBNAILS: "thumbnails",
    TYPE: "type",
    UPLOAD_ID: "uploadId",
    UPLOAD_METADATA: "uploadMetadata",
    UPLOAD_STATE: "uploadState",
    URL: "url",
    VERSION: "version",
    VISIBILITY: "visibility"
};
picker.api.properties.Thumbnail = {
    HEIGHT: "height",
    URL: "url",
    WIDTH: "width"
};
picker.api.properties.Map = {
    ADDRESS_LINES: "addressLines",
    PHONE_NUMBERS: "phoneNumbers",
    PHONE_NUMBER: "number",
    REFERENCE: "reference"
};
picker.api.properties.Video = {
    ASPECT_RATIO: "aspectRatio",
    CONTENT_ID: "video_cid",
    DURATION: "duration"
};
picker.api.properties.Person = {
    DISPLAY_NAME: "name",
    EMAIL: "email",
    USER_ID: "userId"
};
picker.api.properties.IframesChannel = {
    GET_HEALTHC_METHOD: "getHealthc",
    GET_VARC_METHOD: "getVarc",
    SEND_COMMAND_METHOD: "sendCommand"
};
picker.api.properties.ViewToken = {
    VIEW_ID: 0,
    LABEL: 1,
    VIEW_OPTIONS: 2
};
var gdocs = {
    domUtil: {}
};
gdocs.domUtil.HIDDEN_CLASS_ = "gdocs-hidden";
gdocs.domUtil.getHtmlElementByIdAssert = function(a) {
    var b = document.getElementById(a);
    if (!b) throw 'Could not find Element with id: "' + a + '"';
    return b
};
gdocs.domUtil.setTextContent = function(a, b) {
    a.textContent = b
};
gdocs.domUtil.setTextContentId = function(a, b) {
    var c = document.getElementById(a);
    c && gdocs.domUtil.setTextContent(c, b)
};
gdocs.domUtil.hideElem = function(a) {
    for (var b = 0; b < arguments.length; b++) arguments[b].classList.add(gdocs.domUtil.HIDDEN_CLASS_)
};
gdocs.domUtil.showElem = function(a) {
    for (var b = 0; b < arguments.length; b++) arguments[b].classList.remove(gdocs.domUtil.HIDDEN_CLASS_)
};

var gdlog = {};
goog.exportSymbol("gdlog", gdlog);
gdlog.Level = {
    SEVERE: 1E3,
    WARNING: 900,
    INFO: 800,
    CONFIG: 700,
    FINE: 500,
    FINER: 400,
    FINEST: 300
};
gdlog.ENABLE_DEBUG_FLAG = !0;
gdlog.DEFAULT_LEVEL_UNCOMPILED_ = gdlog.Level.INFO;
gdlog.DEFAULT_LEVEL_COMPILED_ = gdlog.Level.WARNING;
gdlog.loglevel = gdlog.ENABLE_DEBUG_FLAG ? gdlog.DEFAULT_LEVEL_UNCOMPILED_ : gdlog.DEFAULT_LEVEL_COMPILED_;
goog.exportSymbol("gdlog.loglevel", gdlog.loglevel);
gdlog.msg_ = function(a, b) {
    return a + ": " + b
};
gdlog.isLoggable_ = function(a) {
    return a >= gdlog.loglevel
};
gdlog.error = function(a, b) {
    window.console.error(gdlog.msg_(a, b))
};
gdlog.errorLastErr = function(a, b) {
    window.console.error(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.warn = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b))
};
gdlog.warnLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.info = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b))
};
gdlog.infoLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.fine = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b))
};
gdlog.fineLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.finer = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINER) && window.console.debug(gdlog.msg_(a, b))
};
gdlog.logwarn = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.WARNING, "WARN")
};
goog.exportSymbol("gdlog.logwarn", gdlog.logwarn);
gdlog.loginfo = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.INFO, "INFO")
};
goog.exportSymbol("gdlog.loginfo", gdlog.loginfo);
gdlog.logfine = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINE, "FINE")
};
goog.exportSymbol("gdlog.logfine", gdlog.logfine);
gdlog.logfiner = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINER, "FINER")
};
goog.exportSymbol("gdlog.logfiner", gdlog.logfiner);
gdlog.setLoggingLevel_ = function(a, b) {
    gdlog.loglevel = a;
    return "Log level is now " + b
};
gdlog.lastErr = function() {
    return chrome.runtime.lastError ? chrome.runtime.lastError.message ? " lastError:" + chrome.runtime.lastError.message : " lastError (no message)" : ""
};
gdlog.prettyPrint = function(a, b) {
    if (!a) return '""';
    var c = b || 100,
        d = {},
        e;
    for (e in a) {
        var f = String(a[e]),
            g = f.length;
        g > c && (f = f.substr(0, c) + " ... (" + g + " bytes)");
        d[e] = f
    }
    return JSON.stringify(d, null, 2)
};
gdocs.global = {};
gdocs.Impression = {
    OTHER: 0,
    LINK: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    PAGE_ACTION_URL: 6,
    PAGE_ACTION_DOC: 7,
    PAGE_ACTION_HTML: 8,
    PAGE_ACTION_CAPTURE_IMAGE_VISIBLE: 9,
    PAGE_ACTION_CAPTURE_MHTML: 10,
    PAGE_ACTION_CAPTURE_IMAGE_ENTIRE: 15
};
gdocs.HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    RESUME_INCOMPLETE: 308,
    UNAUTHORIZED: 401
};
gdocs.global.MAX_GENERATED_TITLE_LEN = 50;
gdocs.global.MAX_SUFFIX_LEN = 8;
gdocs.global.SAVE_DIALOG_SIZE = new goog.math.Size(417, 170);
gdocs.MimeType = {
    ATOM: "application/atom+xml",
    HTML: "text/html",
    MHTML: "text/mhtml",
    JSON: "application/json",
    OCTET_STREAM: "application/octet-stream",
    PLAIN: "text/plain",
    PDF: "application/pdf",
    PNG: "image/png",
    X_PDF: "application/x-pdf",
    XML: "text/xml"
};
gdocs.ActionId = {
    BUG_INTERNAL: "bug-internal",
    CHANGE_FOLDER: "change-folder",
    FEEDBACK_INTERNAL: "feedback-internal",
    HELP: "help",
    HTML: "html",
    HTML_DOC: "htmldoc",
    IMAGE_ENTIRE: "image-entire",
    IMAGE_VISIBLE: "image-visible",
    MHTML: "mhtml",
    OPTIONS: "options",
    SEND_FEEDBACK: "send-feedback",
    URL: "url"
};
gdocs.UrlUtil = {};
gdocs.UrlUtil.executeUrl = function(a) {
    chrome.windows.create({
        url: gdocs.UrlUtil.createUrl_(a),
        type: "normal"
    })
};
gdocs.UrlUtil.createUrl_ = function(a) {
    return a == gdocs.ActionId.BUG_INTERNAL || a == gdocs.ActionId.FEEDBACK_INTERNAL ? gdocs.UrlUtil.createInternalGotoUrl_(a) : a == gdocs.ActionId.SEND_FEEDBACK ? gdocs.UrlUtil.createExternalFeedbackUrl_() : gdocs.UrlUtil.createExternalHelpUrl_()
};
gdocs.UrlUtil.createInternalGotoUrl_ = function(a) {
    return a == gdocs.ActionId.BUG_INTERNAL ? "http://goto.ext.google.com/drive-extension-bug?foundIn=" + chrome.runtime.getManifest().version : "http://goto.ext.google.com/drive-extension-feedback"
};
gdocs.UrlUtil.createExternalFeedbackUrl_ = function() {
    var a = "https://chrome.google.com/webstore/support/" + chrome.i18n.getMessage("@@extension_id"),
        b = chrome.i18n.getMessage("@@ui_locale");
    b && (a += "?hl=" + b);
    return a + "#bug"
};
gdocs.UrlUtil.createExternalHelpUrl_ = function() {
    var a = "http://support.google.com/drive/?",
        b = chrome.i18n.getMessage("@@ui_locale");
    b && (a += "hl=" + b + "&");
    return a + "p=extension_help"
};
gdocs.OptionsPage = function(a) {
    this.bg_ = a;
    this.convertEl_ = gdocs.domUtil.getHtmlElementByIdAssert("convert");
    this.changeFolderEl_ = gdocs.domUtil.getHtmlElementByIdAssert("change-folder");
    this.userIdEl_ = gdocs.domUtil.getHtmlElementByIdAssert("user-id");
    this.folderNameEl_ = gdocs.domUtil.getHtmlElementByIdAssert("save-folder");
    this.postToGoogleDrive_ = gdocs.domUtil.getHtmlElementByIdAssert("post-to-drive");
    this.journalEntryTextArea_ = gdocs.domUtil.getHtmlElementByIdAssert("journal-textarea");
    this.blockDescription_ = gdocs.domUtil.getHtmlElementByIdAssert("block-description");
    this.blockUrl_ = gdocs.domUtil.getHtmlElementByIdAssert("block-url");

    this.shownGoogleInternal_ = !1;
    gdocs.domUtil.setTextContentId("title", chrome.i18n.getMessage("OPTIONS_TITLE"));
    gdocs.domUtil.setTextContentId("header-text", chrome.i18n.getMessage("OPTIONS_HEADER_TEXT"));
    gdocs.domUtil.setTextContentId("account", chrome.i18n.getMessage("ACCOUNT"));
    gdocs.domUtil.setTextContentId("sign-out", chrome.i18n.getMessage("SIGN_OUT"));
    gdocs.domUtil.setTextContentId("save-folder-text", chrome.i18n.getMessage("SAVE_TO_FOLDER_TEXT"));
    gdocs.domUtil.setTextContentId("change-folder", chrome.i18n.getMessage("CHANGE_DEST_FOLDER"));
    gdocs.domUtil.setTextContentId("save-as-text", chrome.i18n.getMessage("SAVE_PAGE_AS"));
    gdocs.domUtil.setTextContentId("save-image-entire", chrome.i18n.getMessage("SAVE_AS_IMAGE_ENTIRE"));
    gdocs.domUtil.setTextContentId("save-image-visible", chrome.i18n.getMessage("SAVE_AS_IMAGE_VISIBLE"));
    gdocs.domUtil.setTextContentId("save-html", chrome.i18n.getMessage("SAVE_AS_HTML"));
    gdocs.domUtil.setTextContentId("save-mhtml", chrome.i18n.getMessage("SAVE_AS_MHTML"));
    gdocs.domUtil.setTextContentId("save-htmldoc", chrome.i18n.getMessage("SAVE_AS_HTMLDOC"));
    gdocs.domUtil.setTextContentId("misc-text", chrome.i18n.getMessage("MISC"));
    gdocs.domUtil.setTextContentId("convert-to-docs", chrome.i18n.getMessage("CONVERT_TO_GOOGLE_FORMAT"));
    gdocs.domUtil.setTextContentId("debug-text", chrome.i18n.getMessage("DEBUG"));
    gdocs.domUtil.setTextContentId("privacy-link", chrome.i18n.getMessage("PRIVACY"))
};
gdocs.OptionsPage.FOLDER_MIMETYPE_ = "application/vnd.google-apps.folder";
gdocs.OptionsPage.prototype.populate = function() {
    this.bg_.getUserId().getUserIdStr(goog.bind(this.populateUserId_, this));
    this.changeFolderEl_.addEventListener("click", goog.bind(this.displayPicker_, this), !1);
    //console.log(gdocs);
    //console.log(this.bg_.browserAction_.browserActionHandler_);

    this.postToGoogleDrive_.addEventListener("click", goog.bind(this.getJournalEntryInfo_, this), !1);
    
    //this.postToGoogleDrive_.onClicked.addListener(goog.bind(this.bg_.browserAction_.browserActionHandler_, this));
    console.log("THESE ARE THE THINGS BEING BOUND IN OPTIONS ALL");
    console.log(this.bg_.browserAction_.browserActionHandler_);
    console.log(this.bg_.browserAction_);

    for (var a = this.bg_.getOptions().getHtmlFormat(), b = document.getElementsByName("html-format"), c = 0; c < b.length; c++) {
        var d = b[c];
        d.checked = d.id == a;
        d.addEventListener("click", goog.bind(this.handleRadio_, this), !1)
    }
    this.convertEl_.checked = this.bg_.getOptions().getConvertToGoogleFormat();
    this.convertEl_.addEventListener("click",
        goog.bind(this.handleConvert_, this), !1);
    this.attachUrlActionMsg_("send-feedback", "SEND_FEEDBACK");
    this.attachUrlActionMsg_("help", "HELP");
    this.checkGoogle_();
};

gdocs.OptionsPage.prototype.getJournalEntryInfo_ = function() {
    this.journalEntryInfo_ = {
        "journal_entry": this.journalEntryTextArea_.value,
        "description": this.blockDescription_.innerHTML,
        "url": this.blockUrl_.innerHTML,
        "time":  goog.now()
        }
    this.bg_.browserAction_.browserActionHandler_(this);
    window.location.href=getBeforeLocation();

};

gdocs.OptionsPage.prototype.sendJournalEntry_ = function(a) {

};

gdocs.OptionsPage.prototype.populateUserId_ = function(a) {
    a ? this.setUserId_(null, a) : this.clearUserId_()
};
gdocs.OptionsPage.prototype.updateUserId_ = function(a) {
    this.bg_.getUserId().getUserIdStr(goog.bind(this.setUserId_, this, a || null))
};
gdocs.OptionsPage.prototype.setUserId_ = function(a, b) {
    if (b) {
        this.setUserIdTxt_(b);
        this.checkGoogle_();
        a ? this.bg_.getOptions().addDestFolderInfo(b, a) : a = this.bg_.getOptions().getDestFolderInfo(b);
        var c = a ? a.folderName : "";
        c || (c = chrome.i18n.getMessage("MY_DRIVE"));
        this.setSaveFolderTxt_(c)
    } else this.clearUserId_()
};
gdocs.OptionsPage.prototype.clearUserId_ = function() {
    this.setUserIdTxt_("");
    this.setSaveFolderTxt_("")
};
gdocs.OptionsPage.prototype.attachUrlActionMsg_ = function(a, b) {
    var c = gdocs.domUtil.getHtmlElementByIdAssert(a);
    gdocs.domUtil.setTextContent(c, chrome.i18n.getMessage(b));
    c.addEventListener("click", goog.bind(gdocs.UrlUtil.executeUrl, this, a), !1)
};
gdocs.OptionsPage.prototype.handleRadio_ = function(a) {
    goog.asserts.assert(a);
    a = a.currentTarget.id;
    this.bg_.getOptions().setHtmlFormat(a)
};
gdocs.OptionsPage.prototype.handleConvert_ = function(a) {
    goog.asserts.assert(a);
    a = a.currentTarget;
    this.bg_.getOptions().setConvertToGoogleFormat(a.checked)
};
gdocs.OptionsPage.prototype.checkGoogle_ = function() {
    !this.shownGoogleInternal_ && this.bg_.getUserId().isGoogle() && (gdocs.domUtil.showElem(gdocs.domUtil.getHtmlElementByIdAssert("internal")), this.attachUrlActionMsg_("feedback-internal", "FEEDBACK_INTERNAL"), this.attachUrlActionMsg_("bug-internal", "FILE_BUG_INTERNAL"), this.shownGoogleInternal_ = !0)
};
gdocs.OptionsPage.prototype.setUserIdTxt_ = function(a) {
    gdocs.domUtil.setTextContent(this.userIdEl_, a)
};
gdocs.OptionsPage.prototype.setSaveFolderTxt_ = function(a) {
    gdocs.domUtil.setTextContent(this.folderNameEl_, a)
};
gdocs.OptionsPage.prototype.displayPicker_ = function() {
    chrome.identity.getAuthToken({
        interactive: !0
    }, goog.bind(this.displayOauthPicker_, this))
};
gdocs.OptionsPage.prototype.displayOauthPicker_ = function(a) {
    chrome.runtime.lastError && gdlog.infoLastErr("OptionsPage.displayOauthPicker", "getAuthToken()");
    var b = (new picker.api.PickerBuilder).setTitle(chrome.i18n.getMessage("SELECT_SAVE_TO_FOLDER")).addView((new picker.api.DocsView(picker.api.ViewId.FOLDERS)).setIncludeFolders(!0).setMimeTypes(gdocs.OptionsPage.FOLDER_MIMETYPE_).setMode(picker.api.DocsViewMode.LIST).setOwnedByMe(!0).setSelectFolderEnabled(!0)).setCallback(goog.bind(this.handlePick_, this)).setLoadGadgetsLibrary(!1).enableFeature(picker.api.Feature.NAV_HIDDEN).setUiVersion(2);
    a && b.setOAuthToken(a);
    a = b.build();
    picker.api.GadgetsLoader.loadFromUrl("https://www-onepick-opensocial.googleusercontent.com/gadgets/js/rpc.js?c=1&container=onepick", a.getDomHelper());
    goog.dom.iframe.BLANK_SOURCE = "";
    a.setVisible(!0)
};
gdocs.OptionsPage.prototype.handlePick_ = function(a) {
    if (a) {
        var b = a[picker.api.properties.Response.ACTION];
        b == picker.api.Action.PICKED ? (a = a[picker.api.properties.Response.DOCUMENTS][0], this.updateUserId_({
            folderId: a[picker.api.properties.Document.ID],
            folderName: a[picker.api.properties.Document.NAME]
        })) : b == picker.api.Action.CANCEL && this.updateUserId_()
    } else gdlog.warn("OptionsPage.handlePick", "No message returned")
};
window.addEventListener("load", function() {
    var a = chrome.extension.getBackgroundPage().bg;
    (new gdocs.OptionsPage(a)).populate()
}, !1);