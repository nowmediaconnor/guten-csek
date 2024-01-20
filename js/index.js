"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/typescript-cubic-spline/dist/Spline.js
  var require_Spline = __commonJS({
    "node_modules/typescript-cubic-spline/dist/Spline.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Spline2 = (
        /** @class */
        function() {
          function Spline3(xs, ys) {
            this.xs = xs;
            this.ys = ys;
            this.ks = this.getNaturalKs(new Float64Array(this.xs.length));
          }
          Spline3.prototype.getNaturalKs = function(ks) {
            var n = this.xs.length - 1;
            var A = zerosMat(n + 1, n + 2);
            for (var i = 1; i < n; i++) {
              A[i][i - 1] = 1 / (this.xs[i] - this.xs[i - 1]);
              A[i][i] = 2 * (1 / (this.xs[i] - this.xs[i - 1]) + 1 / (this.xs[i + 1] - this.xs[i]));
              A[i][i + 1] = 1 / (this.xs[i + 1] - this.xs[i]);
              A[i][n + 1] = 3 * ((this.ys[i] - this.ys[i - 1]) / ((this.xs[i] - this.xs[i - 1]) * (this.xs[i] - this.xs[i - 1])) + (this.ys[i + 1] - this.ys[i]) / ((this.xs[i + 1] - this.xs[i]) * (this.xs[i + 1] - this.xs[i])));
            }
            A[0][0] = 2 / (this.xs[1] - this.xs[0]);
            A[0][1] = 1 / (this.xs[1] - this.xs[0]);
            A[0][n + 1] = 3 * (this.ys[1] - this.ys[0]) / ((this.xs[1] - this.xs[0]) * (this.xs[1] - this.xs[0]));
            A[n][n - 1] = 1 / (this.xs[n] - this.xs[n - 1]);
            A[n][n] = 2 / (this.xs[n] - this.xs[n - 1]);
            A[n][n + 1] = 3 * (this.ys[n] - this.ys[n - 1]) / ((this.xs[n] - this.xs[n - 1]) * (this.xs[n] - this.xs[n - 1]));
            return solve(A, ks);
          };
          Spline3.prototype.getIndexBefore = function(target) {
            var low = 0;
            var high = this.xs.length;
            var mid = 0;
            while (low < high) {
              mid = Math.floor((low + high) / 2);
              if (this.xs[mid] < target && mid !== low) {
                low = mid;
              } else if (this.xs[mid] >= target && mid !== high) {
                high = mid;
              } else {
                high = low;
              }
            }
            return low + 1;
          };
          Spline3.prototype.at = function(x) {
            var i = this.getIndexBefore(x);
            var t = (x - this.xs[i - 1]) / (this.xs[i] - this.xs[i - 1]);
            var a = this.ks[i - 1] * (this.xs[i] - this.xs[i - 1]) - (this.ys[i] - this.ys[i - 1]);
            var b = -this.ks[i] * (this.xs[i] - this.xs[i - 1]) + (this.ys[i] - this.ys[i - 1]);
            var q = (1 - t) * this.ys[i - 1] + t * this.ys[i] + t * (1 - t) * (a * (1 - t) + b * t);
            return q;
          };
          return Spline3;
        }()
      );
      function solve(A, ks) {
        var m = A.length;
        var h = 0;
        var k = 0;
        while (h < m && k <= m) {
          var i_max = 0;
          var max = -Infinity;
          for (var i = h; i < m; i++) {
            var v_1 = Math.abs(A[i][k]);
            if (v_1 > max) {
              i_max = i;
              max = v_1;
            }
          }
          if (A[i_max][k] === 0) {
            k++;
          } else {
            swapRows(A, h, i_max);
            for (var i = h + 1; i < m; i++) {
              var f = A[i][k] / A[h][k];
              A[i][k] = 0;
              for (var j = k + 1; j <= m; j++)
                A[i][j] -= A[h][j] * f;
            }
            h++;
            k++;
          }
        }
        for (var i = m - 1; i >= 0; i--) {
          var v = 0;
          if (A[i][i]) {
            v = A[i][m] / A[i][i];
          }
          ks[i] = v;
          for (var j = i - 1; j >= 0; j--) {
            A[j][m] -= A[j][i] * v;
            A[j][i] = 0;
          }
        }
        return ks;
      }
      function zerosMat(r, c) {
        var A = [];
        for (var i = 0; i < r; i++)
          A.push(new Float64Array(c));
        return A;
      }
      function swapRows(m, k, l) {
        var p = m[k];
        m[k] = m[l];
        m[l] = p;
      }
      exports.default = Spline2;
    }
  });

  // node_modules/circletype/dist/circletype.min.js
  var require_circletype_min = __commonJS({
    "node_modules/circletype/dist/circletype.min.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.CircleType = e() : t.CircleType = e();
      }("undefined" != typeof self ? self : exports, function() {
        return function(t) {
          function e(r) {
            if (n[r])
              return n[r].exports;
            var i = n[r] = { i: r, l: false, exports: {} };
            return t[r].call(i.exports, i, i.exports, e), i.l = true, i.exports;
          }
          var n = {};
          return e.m = t, e.c = n, e.d = function(t2, n2, r) {
            e.o(t2, n2) || Object.defineProperty(t2, n2, { configurable: false, enumerable: true, get: r });
          }, e.n = function(t2) {
            var n2 = t2 && t2.__esModule ? function() {
              return t2.default;
            } : function() {
              return t2;
            };
            return e.d(n2, "a", n2), n2;
          }, e.o = function(t2, e2) {
            return Object.prototype.hasOwnProperty.call(t2, e2);
          }, e.p = "", e(e.s = 29);
        }([function(t, e, n) {
          var r = n(24)("wks"), i = n(12), o = n(1).Symbol, u = "function" == typeof o;
          (t.exports = function(t2) {
            return r[t2] || (r[t2] = u && o[t2] || (u ? o : i)("Symbol." + t2));
          }).store = r;
        }, function(t, e) {
          var n = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
          "number" == typeof __g && (__g = n);
        }, function(t, e) {
          var n = t.exports = { version: "2.5.6" };
          "number" == typeof __e && (__e = n);
        }, function(t, e, n) {
          var r = n(4), i = n(11);
          t.exports = n(6) ? function(t2, e2, n2) {
            return r.f(t2, e2, i(1, n2));
          } : function(t2, e2, n2) {
            return t2[e2] = n2, t2;
          };
        }, function(t, e, n) {
          var r = n(5), i = n(34), o = n(35), u = Object.defineProperty;
          e.f = n(6) ? Object.defineProperty : function(t2, e2, n2) {
            if (r(t2), e2 = o(e2, true), r(n2), i)
              try {
                return u(t2, e2, n2);
              } catch (t3) {
              }
            if ("get" in n2 || "set" in n2)
              throw TypeError("Accessors not supported!");
            return "value" in n2 && (t2[e2] = n2.value), t2;
          };
        }, function(t, e, n) {
          var r = n(10);
          t.exports = function(t2) {
            if (!r(t2))
              throw TypeError(t2 + " is not an object!");
            return t2;
          };
        }, function(t, e, n) {
          t.exports = !n(17)(function() {
            return 7 != Object.defineProperty({}, "a", { get: function() {
              return 7;
            } }).a;
          });
        }, function(t, e) {
          var n = {}.hasOwnProperty;
          t.exports = function(t2, e2) {
            return n.call(t2, e2);
          };
        }, function(t, e) {
          var n = Math.ceil, r = Math.floor;
          t.exports = function(t2) {
            return isNaN(t2 = +t2) ? 0 : (t2 > 0 ? r : n)(t2);
          };
        }, function(t, e) {
          t.exports = function(t2) {
            if (void 0 == t2)
              throw TypeError("Can't call method on  " + t2);
            return t2;
          };
        }, function(t, e) {
          t.exports = function(t2) {
            return "object" == typeof t2 ? null !== t2 : "function" == typeof t2;
          };
        }, function(t, e) {
          t.exports = function(t2, e2) {
            return { enumerable: !(1 & t2), configurable: !(2 & t2), writable: !(4 & t2), value: e2 };
          };
        }, function(t, e) {
          var n = 0, r = Math.random();
          t.exports = function(t2) {
            return "Symbol(".concat(void 0 === t2 ? "" : t2, ")_", (++n + r).toString(36));
          };
        }, function(t, e) {
          t.exports = {};
        }, function(t, e, n) {
          var r = n(24)("keys"), i = n(12);
          t.exports = function(t2) {
            return r[t2] || (r[t2] = i(t2));
          };
        }, function(t, e) {
          t.exports = false;
        }, function(t, e, n) {
          var r = n(1), i = n(2), o = n(3), u = n(19), c = n(20), f = function(t2, e2, n2) {
            var a, s, l, p, h = t2 & f.F, d = t2 & f.G, v = t2 & f.S, y = t2 & f.P, _ = t2 & f.B, m = d ? r : v ? r[e2] || (r[e2] = {}) : (r[e2] || {}).prototype, g = d ? i : i[e2] || (i[e2] = {}), x = g.prototype || (g.prototype = {});
            d && (n2 = e2);
            for (a in n2)
              s = !h && m && void 0 !== m[a], l = (s ? m : n2)[a], p = _ && s ? c(l, r) : y && "function" == typeof l ? c(Function.call, l) : l, m && u(m, a, l, t2 & f.U), g[a] != l && o(g, a, p), y && x[a] != l && (x[a] = l);
          };
          r.core = i, f.F = 1, f.G = 2, f.S = 4, f.P = 8, f.B = 16, f.W = 32, f.U = 64, f.R = 128, t.exports = f;
        }, function(t, e) {
          t.exports = function(t2) {
            try {
              return !!t2();
            } catch (t3) {
              return true;
            }
          };
        }, function(t, e, n) {
          var r = n(10), i = n(1).document, o = r(i) && r(i.createElement);
          t.exports = function(t2) {
            return o ? i.createElement(t2) : {};
          };
        }, function(t, e, n) {
          var r = n(1), i = n(3), o = n(7), u = n(12)("src"), c = Function.toString, f = ("" + c).split("toString");
          n(2).inspectSource = function(t2) {
            return c.call(t2);
          }, (t.exports = function(t2, e2, n2, c2) {
            var a = "function" == typeof n2;
            a && (o(n2, "name") || i(n2, "name", e2)), t2[e2] !== n2 && (a && (o(n2, u) || i(n2, u, t2[e2] ? "" + t2[e2] : f.join(String(e2)))), t2 === r ? t2[e2] = n2 : c2 ? t2[e2] ? t2[e2] = n2 : i(t2, e2, n2) : (delete t2[e2], i(t2, e2, n2)));
          })(Function.prototype, "toString", function() {
            return "function" == typeof this && this[u] || c.call(this);
          });
        }, function(t, e, n) {
          var r = n(36);
          t.exports = function(t2, e2, n2) {
            if (r(t2), void 0 === e2)
              return t2;
            switch (n2) {
              case 1:
                return function(n3) {
                  return t2.call(e2, n3);
                };
              case 2:
                return function(n3, r2) {
                  return t2.call(e2, n3, r2);
                };
              case 3:
                return function(n3, r2, i) {
                  return t2.call(e2, n3, r2, i);
                };
            }
            return function() {
              return t2.apply(e2, arguments);
            };
          };
        }, function(t, e, n) {
          var r = n(42), i = n(9);
          t.exports = function(t2) {
            return r(i(t2));
          };
        }, function(t, e) {
          var n = {}.toString;
          t.exports = function(t2) {
            return n.call(t2).slice(8, -1);
          };
        }, function(t, e, n) {
          var r = n(8), i = Math.min;
          t.exports = function(t2) {
            return t2 > 0 ? i(r(t2), 9007199254740991) : 0;
          };
        }, function(t, e, n) {
          var r = n(2), i = n(1), o = i["__core-js_shared__"] || (i["__core-js_shared__"] = {});
          (t.exports = function(t2, e2) {
            return o[t2] || (o[t2] = void 0 !== e2 ? e2 : {});
          })("versions", []).push({ version: r.version, mode: n(15) ? "pure" : "global", copyright: "\xA9 2018 Denis Pushkarev (zloirock.ru)" });
        }, function(t, e) {
          t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
        }, function(t, e, n) {
          var r = n(4).f, i = n(7), o = n(0)("toStringTag");
          t.exports = function(t2, e2, n2) {
            t2 && !i(t2 = n2 ? t2 : t2.prototype, o) && r(t2, o, { configurable: true, value: e2 });
          };
        }, function(t, e, n) {
          var r = n(9);
          t.exports = function(t2) {
            return Object(r(t2));
          };
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var r = Math.PI / 180;
          e.default = function(t2) {
            return t2 * r;
          };
        }, function(t, e, n) {
          "use strict";
          n(30);
          var r = n(54), i = function(t2) {
            return t2 && t2.__esModule ? t2 : { default: t2 };
          }(r);
          t.exports = i.default;
        }, function(t, e, n) {
          n(31), n(47), t.exports = n(2).Array.from;
        }, function(t, e, n) {
          "use strict";
          var r = n(32)(true);
          n(33)(String, "String", function(t2) {
            this._t = String(t2), this._i = 0;
          }, function() {
            var t2, e2 = this._t, n2 = this._i;
            return n2 >= e2.length ? { value: void 0, done: true } : (t2 = r(e2, n2), this._i += t2.length, { value: t2, done: false });
          });
        }, function(t, e, n) {
          var r = n(8), i = n(9);
          t.exports = function(t2) {
            return function(e2, n2) {
              var o, u, c = String(i(e2)), f = r(n2), a = c.length;
              return f < 0 || f >= a ? t2 ? "" : void 0 : (o = c.charCodeAt(f), o < 55296 || o > 56319 || f + 1 === a || (u = c.charCodeAt(f + 1)) < 56320 || u > 57343 ? t2 ? c.charAt(f) : o : t2 ? c.slice(f, f + 2) : u - 56320 + (o - 55296 << 10) + 65536);
            };
          };
        }, function(t, e, n) {
          "use strict";
          var r = n(15), i = n(16), o = n(19), u = n(3), c = n(13), f = n(37), a = n(26), s = n(46), l = n(0)("iterator"), p = !([].keys && "next" in [].keys()), h = function() {
            return this;
          };
          t.exports = function(t2, e2, n2, d, v, y, _) {
            f(n2, e2, d);
            var m, g, x, b = function(t3) {
              if (!p && t3 in M)
                return M[t3];
              switch (t3) {
                case "keys":
                case "values":
                  return function() {
                    return new n2(this, t3);
                  };
              }
              return function() {
                return new n2(this, t3);
              };
            }, O = e2 + " Iterator", w = "values" == v, j = false, M = t2.prototype, S = M[l] || M["@@iterator"] || v && M[v], P = S || b(v), A = v ? w ? b("entries") : P : void 0, T = "Array" == e2 ? M.entries || S : S;
            if (T && (x = s(T.call(new t2()))) !== Object.prototype && x.next && (a(x, O, true), r || "function" == typeof x[l] || u(x, l, h)), w && S && "values" !== S.name && (j = true, P = function() {
              return S.call(this);
            }), r && !_ || !p && !j && M[l] || u(M, l, P), c[e2] = P, c[O] = h, v)
              if (m = { values: w ? P : b("values"), keys: y ? P : b("keys"), entries: A }, _)
                for (g in m)
                  g in M || o(M, g, m[g]);
              else
                i(i.P + i.F * (p || j), e2, m);
            return m;
          };
        }, function(t, e, n) {
          t.exports = !n(6) && !n(17)(function() {
            return 7 != Object.defineProperty(n(18)("div"), "a", { get: function() {
              return 7;
            } }).a;
          });
        }, function(t, e, n) {
          var r = n(10);
          t.exports = function(t2, e2) {
            if (!r(t2))
              return t2;
            var n2, i;
            if (e2 && "function" == typeof (n2 = t2.toString) && !r(i = n2.call(t2)))
              return i;
            if ("function" == typeof (n2 = t2.valueOf) && !r(i = n2.call(t2)))
              return i;
            if (!e2 && "function" == typeof (n2 = t2.toString) && !r(i = n2.call(t2)))
              return i;
            throw TypeError("Can't convert object to primitive value");
          };
        }, function(t, e) {
          t.exports = function(t2) {
            if ("function" != typeof t2)
              throw TypeError(t2 + " is not a function!");
            return t2;
          };
        }, function(t, e, n) {
          "use strict";
          var r = n(38), i = n(11), o = n(26), u = {};
          n(3)(u, n(0)("iterator"), function() {
            return this;
          }), t.exports = function(t2, e2, n2) {
            t2.prototype = r(u, { next: i(1, n2) }), o(t2, e2 + " Iterator");
          };
        }, function(t, e, n) {
          var r = n(5), i = n(39), o = n(25), u = n(14)("IE_PROTO"), c = function() {
          }, f = function() {
            var t2, e2 = n(18)("iframe"), r2 = o.length;
            for (e2.style.display = "none", n(45).appendChild(e2), e2.src = "javascript:", t2 = e2.contentWindow.document, t2.open(), t2.write("<script>document.F=Object<\/script>"), t2.close(), f = t2.F; r2--; )
              delete f.prototype[o[r2]];
            return f();
          };
          t.exports = Object.create || function(t2, e2) {
            var n2;
            return null !== t2 ? (c.prototype = r(t2), n2 = new c(), c.prototype = null, n2[u] = t2) : n2 = f(), void 0 === e2 ? n2 : i(n2, e2);
          };
        }, function(t, e, n) {
          var r = n(4), i = n(5), o = n(40);
          t.exports = n(6) ? Object.defineProperties : function(t2, e2) {
            i(t2);
            for (var n2, u = o(e2), c = u.length, f = 0; c > f; )
              r.f(t2, n2 = u[f++], e2[n2]);
            return t2;
          };
        }, function(t, e, n) {
          var r = n(41), i = n(25);
          t.exports = Object.keys || function(t2) {
            return r(t2, i);
          };
        }, function(t, e, n) {
          var r = n(7), i = n(21), o = n(43)(false), u = n(14)("IE_PROTO");
          t.exports = function(t2, e2) {
            var n2, c = i(t2), f = 0, a = [];
            for (n2 in c)
              n2 != u && r(c, n2) && a.push(n2);
            for (; e2.length > f; )
              r(c, n2 = e2[f++]) && (~o(a, n2) || a.push(n2));
            return a;
          };
        }, function(t, e, n) {
          var r = n(22);
          t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t2) {
            return "String" == r(t2) ? t2.split("") : Object(t2);
          };
        }, function(t, e, n) {
          var r = n(21), i = n(23), o = n(44);
          t.exports = function(t2) {
            return function(e2, n2, u) {
              var c, f = r(e2), a = i(f.length), s = o(u, a);
              if (t2 && n2 != n2) {
                for (; a > s; )
                  if ((c = f[s++]) != c)
                    return true;
              } else
                for (; a > s; s++)
                  if ((t2 || s in f) && f[s] === n2)
                    return t2 || s || 0;
              return !t2 && -1;
            };
          };
        }, function(t, e, n) {
          var r = n(8), i = Math.max, o = Math.min;
          t.exports = function(t2, e2) {
            return t2 = r(t2), t2 < 0 ? i(t2 + e2, 0) : o(t2, e2);
          };
        }, function(t, e, n) {
          var r = n(1).document;
          t.exports = r && r.documentElement;
        }, function(t, e, n) {
          var r = n(7), i = n(27), o = n(14)("IE_PROTO"), u = Object.prototype;
          t.exports = Object.getPrototypeOf || function(t2) {
            return t2 = i(t2), r(t2, o) ? t2[o] : "function" == typeof t2.constructor && t2 instanceof t2.constructor ? t2.constructor.prototype : t2 instanceof Object ? u : null;
          };
        }, function(t, e, n) {
          "use strict";
          var r = n(20), i = n(16), o = n(27), u = n(48), c = n(49), f = n(23), a = n(50), s = n(51);
          i(i.S + i.F * !n(53)(function(t2) {
            Array.from(t2);
          }), "Array", { from: function(t2) {
            var e2, n2, i2, l, p = o(t2), h = "function" == typeof this ? this : Array, d = arguments.length, v = d > 1 ? arguments[1] : void 0, y = void 0 !== v, _ = 0, m = s(p);
            if (y && (v = r(v, d > 2 ? arguments[2] : void 0, 2)), void 0 == m || h == Array && c(m))
              for (e2 = f(p.length), n2 = new h(e2); e2 > _; _++)
                a(n2, _, y ? v(p[_], _) : p[_]);
            else
              for (l = m.call(p), n2 = new h(); !(i2 = l.next()).done; _++)
                a(n2, _, y ? u(l, v, [i2.value, _], true) : i2.value);
            return n2.length = _, n2;
          } });
        }, function(t, e, n) {
          var r = n(5);
          t.exports = function(t2, e2, n2, i) {
            try {
              return i ? e2(r(n2)[0], n2[1]) : e2(n2);
            } catch (e3) {
              var o = t2.return;
              throw void 0 !== o && r(o.call(t2)), e3;
            }
          };
        }, function(t, e, n) {
          var r = n(13), i = n(0)("iterator"), o = Array.prototype;
          t.exports = function(t2) {
            return void 0 !== t2 && (r.Array === t2 || o[i] === t2);
          };
        }, function(t, e, n) {
          "use strict";
          var r = n(4), i = n(11);
          t.exports = function(t2, e2, n2) {
            e2 in t2 ? r.f(t2, e2, i(0, n2)) : t2[e2] = n2;
          };
        }, function(t, e, n) {
          var r = n(52), i = n(0)("iterator"), o = n(13);
          t.exports = n(2).getIteratorMethod = function(t2) {
            if (void 0 != t2)
              return t2[i] || t2["@@iterator"] || o[r(t2)];
          };
        }, function(t, e, n) {
          var r = n(22), i = n(0)("toStringTag"), o = "Arguments" == r(/* @__PURE__ */ function() {
            return arguments;
          }()), u = function(t2, e2) {
            try {
              return t2[e2];
            } catch (t3) {
            }
          };
          t.exports = function(t2) {
            var e2, n2, c;
            return void 0 === t2 ? "Undefined" : null === t2 ? "Null" : "string" == typeof (n2 = u(e2 = Object(t2), i)) ? n2 : o ? r(e2) : "Object" == (c = r(e2)) && "function" == typeof e2.callee ? "Arguments" : c;
          };
        }, function(t, e, n) {
          var r = n(0)("iterator"), i = false;
          try {
            var o = [7][r]();
            o.return = function() {
              i = true;
            }, Array.from(o, function() {
              throw 2;
            });
          } catch (t2) {
          }
          t.exports = function(t2, e2) {
            if (!e2 && !i)
              return false;
            var n2 = false;
            try {
              var o2 = [7], u = o2[r]();
              u.next = function() {
                return { done: n2 = true };
              }, o2[r] = function() {
                return u;
              }, t2(o2);
            } catch (t3) {
            }
            return n2;
          };
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            return t2 && t2.__esModule ? t2 : { default: t2 };
          }
          function i(t2, e2) {
            if (!(t2 instanceof e2))
              throw new TypeError("Cannot call a class as a function");
          }
          Object.defineProperty(e, "__esModule", { value: true });
          var o = /* @__PURE__ */ function() {
            function t2(t3, e2) {
              for (var n2 = 0; n2 < e2.length; n2++) {
                var r2 = e2[n2];
                r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t3, r2.key, r2);
              }
            }
            return function(e2, n2, r2) {
              return n2 && t2(e2.prototype, n2), r2 && t2(e2, r2), e2;
            };
          }(), u = n(55), c = r(u), f = n(56), a = r(f), s = n(57), l = r(s), p = n(58), h = r(p), d = n(59), v = r(d), y = Math.PI, _ = Math.max, m = Math.min, g = function() {
            function t2(e2, n2) {
              i(this, t2), this.element = e2, this.originalHTML = this.element.innerHTML;
              var r2 = document.createElement("div"), o2 = document.createDocumentFragment();
              r2.setAttribute("aria-label", e2.innerText), r2.style.position = "relative", this.container = r2, this._letters = (0, a.default)(e2, n2), this._letters.forEach(function(t3) {
                return o2.appendChild(t3);
              }), r2.appendChild(o2), this.element.innerHTML = "", this.element.appendChild(r2);
              var u2 = window.getComputedStyle(this.element), f2 = u2.fontSize, s2 = u2.lineHeight;
              this._fontSize = parseFloat(f2), this._lineHeight = parseFloat(s2) || this._fontSize, this._metrics = this._letters.map(c.default);
              var l2 = this._metrics.reduce(function(t3, e3) {
                return t3 + e3.width;
              }, 0);
              this._minRadius = l2 / y / 2 + this._lineHeight, this._dir = 1, this._forceWidth = false, this._forceHeight = true, this._radius = this._minRadius, this._invalidate();
            }
            return o(t2, [{ key: "radius", value: function(t3) {
              return void 0 !== t3 ? (this._radius = _(this._minRadius, t3), this._invalidate(), this) : this._radius;
            } }, { key: "dir", value: function(t3) {
              return void 0 !== t3 ? (this._dir = t3, this._invalidate(), this) : this._dir;
            } }, { key: "forceWidth", value: function(t3) {
              return void 0 !== t3 ? (this._forceWidth = t3, this._invalidate(), this) : this._forceWidth;
            } }, { key: "forceHeight", value: function(t3) {
              return void 0 !== t3 ? (this._forceHeight = t3, this._invalidate(), this) : this._forceHeight;
            } }, { key: "refresh", value: function() {
              return this._invalidate();
            } }, { key: "destroy", value: function() {
              return this.element.innerHTML = this.originalHTML, this;
            } }, { key: "_invalidate", value: function() {
              var t3 = this;
              return cancelAnimationFrame(this._raf), this._raf = requestAnimationFrame(function() {
                t3._layout();
              }), this;
            } }, { key: "_layout", value: function() {
              var t3 = this, e2 = this._radius, n2 = this._dir, r2 = -1 === n2 ? -e2 + this._lineHeight : e2, i2 = "center " + r2 / this._fontSize + "em", o2 = e2 - this._lineHeight, u2 = (0, v.default)(this._metrics, o2), c2 = u2.rotations, f2 = u2.\u03B8;
              if (this._letters.forEach(function(e3, r3) {
                var o3 = e3.style, u3 = (-0.5 * f2 + c2[r3]) * n2, a3 = -0.5 * t3._metrics[r3].width / t3._fontSize, s3 = "translateX(" + a3 + "em) rotate(" + u3 + "deg)";
                o3.position = "absolute", o3.bottom = -1 === n2 ? 0 : "auto", o3.left = "50%", o3.transform = s3, o3.transformOrigin = i2, o3.webkitTransform = s3, o3.webkitTransformOrigin = i2;
              }), this._forceHeight) {
                var a2 = f2 > 180 ? (0, l.default)(e2, f2) : (0, l.default)(o2, f2) + this._lineHeight;
                this.container.style.height = a2 / this._fontSize + "em";
              }
              if (this._forceWidth) {
                var s2 = (0, h.default)(e2, m(180, f2));
                this.container.style.width = s2 / this._fontSize + "em";
              }
              return this;
            } }]), t2;
          }();
          e.default = g;
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.default = function(t2) {
            var e2 = t2.getBoundingClientRect();
            return { height: e2.height, left: e2.left + window.pageXOffset, top: e2.top + window.pageYOffset, width: e2.width };
          };
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            if (Array.isArray(t2)) {
              for (var e2 = 0, n2 = Array(t2.length); e2 < t2.length; e2++)
                n2[e2] = t2[e2];
              return n2;
            }
            return Array.from(t2);
          }
          Object.defineProperty(e, "__esModule", { value: true }), e.default = function(t2, e2) {
            var n2 = document.createElement("span"), i = t2.innerText.trim();
            return (e2 ? e2(i) : [].concat(r(i))).map(function(t3) {
              var e3 = n2.cloneNode();
              return e3.insertAdjacentHTML("afterbegin", " " === t3 ? "&nbsp;" : t3), e3;
            });
          };
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var r = n(28), i = function(t2) {
            return t2 && t2.__esModule ? t2 : { default: t2 };
          }(r);
          e.default = function(t2, e2) {
            return t2 * (1 - Math.cos((0, i.default)(e2 / 2)));
          };
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var r = n(28), i = function(t2) {
            return t2 && t2.__esModule ? t2 : { default: t2 };
          }(r);
          e.default = function(t2, e2) {
            return 2 * t2 * Math.sin((0, i.default)(e2 / 2));
          };
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var r = n(60), i = function(t2) {
            return t2 && t2.__esModule ? t2 : { default: t2 };
          }(r);
          e.default = function(t2, e2) {
            return t2.reduce(function(t3, n2) {
              var r2 = n2.width, o = (0, i.default)(r2 / e2);
              return { "\u03B8": t3.\u03B8 + o, rotations: t3.rotations.concat([t3.\u03B8 + o / 2]) };
            }, { "\u03B8": 0, rotations: [] });
          };
        }, function(t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true });
          var r = 180 / Math.PI;
          e.default = function(t2) {
            return t2 * r;
          };
        }]);
      });
    }
  });

  // node_modules/sprintf-js/src/sprintf.js
  var require_sprintf = __commonJS({
    "node_modules/sprintf-js/src/sprintf.js"(exports) {
      !function() {
        "use strict";
        var re = {
          not_string: /[^s]/,
          not_bool: /[^t]/,
          not_type: /[^T]/,
          not_primitive: /[^v]/,
          number: /[diefg]/,
          numeric_arg: /[bcdiefguxX]/,
          json: /[j]/,
          not_json: /[^j]/,
          text: /^[^\x25]+/,
          modulo: /^\x25{2}/,
          placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
          key: /^([a-z_][a-z_\d]*)/i,
          key_access: /^\.([a-z_][a-z_\d]*)/i,
          index_access: /^\[(\d+)\]/,
          sign: /^[+-]/
        };
        function sprintf2(key) {
          return sprintf_format(sprintf_parse(key), arguments);
        }
        function vsprintf(fmt, argv) {
          return sprintf2.apply(null, [fmt].concat(argv || []));
        }
        function sprintf_format(parse_tree, argv) {
          var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k, ph, pad2, pad_character, pad_length, is_positive, sign;
          for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === "string") {
              output += parse_tree[i];
            } else if (typeof parse_tree[i] === "object") {
              ph = parse_tree[i];
              if (ph.keys) {
                arg = argv[cursor];
                for (k = 0; k < ph.keys.length; k++) {
                  if (arg == void 0) {
                    throw new Error(sprintf2('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
                  }
                  arg = arg[ph.keys[k]];
                }
              } else if (ph.param_no) {
                arg = argv[ph.param_no];
              } else {
                arg = argv[cursor++];
              }
              if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                arg = arg();
              }
              if (re.numeric_arg.test(ph.type) && (typeof arg !== "number" && isNaN(arg))) {
                throw new TypeError(sprintf2("[sprintf] expecting number but found %T", arg));
              }
              if (re.number.test(ph.type)) {
                is_positive = arg >= 0;
              }
              switch (ph.type) {
                case "b":
                  arg = parseInt(arg, 10).toString(2);
                  break;
                case "c":
                  arg = String.fromCharCode(parseInt(arg, 10));
                  break;
                case "d":
                case "i":
                  arg = parseInt(arg, 10);
                  break;
                case "j":
                  arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
                  break;
                case "e":
                  arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
                  break;
                case "f":
                  arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
                  break;
                case "g":
                  arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
                  break;
                case "o":
                  arg = (parseInt(arg, 10) >>> 0).toString(8);
                  break;
                case "s":
                  arg = String(arg);
                  arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                  break;
                case "t":
                  arg = String(!!arg);
                  arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                  break;
                case "T":
                  arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                  arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                  break;
                case "u":
                  arg = parseInt(arg, 10) >>> 0;
                  break;
                case "v":
                  arg = arg.valueOf();
                  arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                  break;
                case "x":
                  arg = (parseInt(arg, 10) >>> 0).toString(16);
                  break;
                case "X":
                  arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                  break;
              }
              if (re.json.test(ph.type)) {
                output += arg;
              } else {
                if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                  sign = is_positive ? "+" : "-";
                  arg = arg.toString().replace(re.sign, "");
                } else {
                  sign = "";
                }
                pad_character = ph.pad_char ? ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1) : " ";
                pad_length = ph.width - (sign + arg).length;
                pad2 = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
                output += ph.align ? sign + arg + pad2 : pad_character === "0" ? sign + pad2 + arg : pad2 + sign + arg;
              }
            }
          }
          return output;
        }
        var sprintf_cache = /* @__PURE__ */ Object.create(null);
        function sprintf_parse(fmt) {
          if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt];
          }
          var _fmt = fmt, match, parse_tree = [], arg_names = 0;
          while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
              parse_tree.push(match[0]);
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
              parse_tree.push("%");
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
              if (match[2]) {
                arg_names |= 1;
                var field_list = [], replacement_field = match[2], field_match = [];
                if ((field_match = re.key.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                  while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                    if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                      field_list.push(field_match[1]);
                    } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                      field_list.push(field_match[1]);
                    } else {
                      throw new SyntaxError("[sprintf] failed to parse named argument key");
                    }
                  }
                } else {
                  throw new SyntaxError("[sprintf] failed to parse named argument key");
                }
                match[2] = field_list;
              } else {
                arg_names |= 2;
              }
              if (arg_names === 3) {
                throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
              }
              parse_tree.push(
                {
                  placeholder: match[0],
                  param_no: match[1],
                  keys: match[2],
                  sign: match[3],
                  pad_char: match[4],
                  align: match[5],
                  width: match[6],
                  precision: match[7],
                  type: match[8]
                }
              );
            } else {
              throw new SyntaxError("[sprintf] unexpected placeholder");
            }
            _fmt = _fmt.substring(match[0].length);
          }
          return sprintf_cache[fmt] = parse_tree;
        }
        if (typeof exports !== "undefined") {
          exports["sprintf"] = sprintf2;
          exports["vsprintf"] = vsprintf;
        }
        if (typeof window !== "undefined") {
          window["sprintf"] = sprintf2;
          window["vsprintf"] = vsprintf;
          if (typeof define === "function" && define["amd"]) {
            define(function() {
              return {
                "sprintf": sprintf2,
                "vsprintf": vsprintf
              };
            });
          }
        }
      }();
    }
  });

  // src/js/scripts/math.ts
  var import_typescript_cubic_spline = __toESM(require_Spline());

  // src/js/scripts/array.ts
  var shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex = 0;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = randomIntInRange(0, currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  };

  // src/js/scripts/math.ts
  var constrain = (n, low, high) => {
    return Math.max(Math.min(n, high), low);
  };
  var map = (n, start1, stop1, start2, stop2) => {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (start2 < stop2) {
      return constrain(newval, start2, stop2);
    } else {
      return constrain(newval, stop2, start2);
    }
  };
  var randomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var randomPartOfOne = () => {
    return Math.random() * 2 - 1;
  };

  // src/js/scripts/dom.ts
  var DOM_FLAGS = {
    DEBUG: true,
    taglineSroll: true
  };
  var getChildren = (n, skipMe) => {
    let r = [];
    for (; n; n = n.nextSibling)
      if (n.nodeType == 1 && n != skipMe)
        r.push(n);
    return r;
  };
  var getSiblings = (n) => {
    const parent = n.parentNode;
    if (!parent)
      return [];
    return getChildren(parent.firstChild, n);
  };
  var prepareExpandingVideoBlocks = () => {
    const expandingVideoBlocks = document.querySelectorAll(".wp-block-guten-csek-expanding-video-block");
    const elementsToFadeOnScroll = document.querySelectorAll(".scroll-fade-away");
    for (const videoBlock of expandingVideoBlocks) {
      const threshold = videoBlock.querySelector(".threshold");
      const video = videoBlock.querySelector(".expanding-video-container");
      if (!threshold || !video)
        continue;
      window.addEventListener("scroll", () => {
        const blockRect = videoBlock.getBoundingClientRect();
        const thresholdRect = threshold.getBoundingClientRect();
        const thresholdTop = thresholdRect.top;
        if (parseInt(thresholdTop.toString()) <= 0 && DOM_FLAGS.taglineSroll && blockRect.bottom > 0) {
          video.classList.add("expanded");
          for (const element of elementsToFadeOnScroll) {
            element.classList.add("hide");
          }
          document.body.style.backgroundColor = "#131313";
          DOM_FLAGS.taglineSroll = false;
          log("Expansion threshold reached");
        } else if (parseInt(thresholdTop.toString()) > 0 && !DOM_FLAGS.taglineSroll) {
          video.classList.remove("expanded");
          for (const element of elementsToFadeOnScroll) {
            element.classList.remove("hide");
          }
          document.body.style.backgroundColor = "transparent";
          DOM_FLAGS.taglineSroll = true;
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
  };
  var BlockController = class {
    static get isMobile() {
      return window.innerWidth <= 768;
    }
    constructor() {
      this.name = "BlockController";
    }
    invalid(truthy) {
      if (truthy) {
        this.log("Block is valid.");
        return false;
      }
      this.log("Block is invalid.");
      this.isInitialized = true;
      return true;
    }
    log(...msg) {
      if (this.debug && DOMController.siteDebug) {
        log(`[${this.name}]`, ...msg);
      }
    }
    err(...msg) {
      if (this.debug && DOMController.siteDebug) {
        error(`[${this.name}]`, ...msg);
      }
    }
  };
  var _DOMController = class _DOMController extends BlockController {
    constructor(...blockControllers) {
      super();
      this.isLetsTalkOpen = false;
      this.usingEditor = false;
      this.name = "DOMController";
      this.blockControllers = blockControllers;
      this.debug = true;
      this.isInitialized = false;
      this.isStarted = false;
      this.prepareLoadingPanel();
      this.url = new URL(window.location.href);
      this.basePath = this.url.pathname.split("/").slice(0, -1).join("/");
      const searchParams = new URLSearchParams(this.url.search);
      const isAdmin = this.basePath === "/wp-admin";
      const isEdit = searchParams.get("action") === "edit";
      this.usingEditor = isAdmin && isEdit;
    }
    addController(controller) {
      this.blockControllers.push(controller);
      if (this.isInitialized) {
        controller.setup();
      }
      this.addEventListeners();
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
      this.loadingPanel.classList.add("complete");
    }
    setup() {
      if (this.isStarted === false)
        this.isStarted = true;
      prepareExpandingVideoBlocks();
      this.setFeaturedImageColors();
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
              if (_DOMController.isMobile)
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
      if (this.prepareLetsTalkScreen()) {
        this.letsTalkOpenButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            this.openLetsTalk();
          });
        });
        this.letsTalkCloseButton.addEventListener("click", () => {
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
      if (this.usingEditor)
        return;
      this.loadingPanel.classList.remove("complete");
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
    setFeaturedImageColors() {
      return __async(this, null, function* () {
        yield updateFeaturedImageColorDerivatives();
      });
    }
  };
  _DOMController.siteDebug = false;
  var DOMController = _DOMController;

  // src/js/scripts/files.ts
  var imageToBase64 = (url) => __async(void 0, null, function* () {
    const response = yield fetch(url);
    const blob = yield response.blob();
    const okMimes = ["image/jpeg", "image/png", "image/gif"];
    if (!blob || !okMimes.includes(blob.type)) {
      throw new Error("Blob is null");
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  });
  var getImageColor = (url) => __async(void 0, null, function* () {
    try {
      const base64Data = yield imageToBase64(url);
      const fileName = url.split("/").pop();
      const res = yield fetch("/wp-json/csek/v2/img-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ base64Data, fileName })
      });
      const body = yield res.json();
      const { css_rgb } = JSON.parse(body);
      log("Fetched rgb:", css_rgb);
      if (!css_rgb) {
        throw new Error(`Color is null. URL: ${url}`);
      }
      return css_rgb;
    } catch (err) {
      error("[getImageColor]", err);
    }
    return "rgb(19,19,19)";
  });

  // src/js/scripts/global.ts
  function updateFeaturedImageColorDerivatives() {
    return __async(this, null, function* () {
      const featuredImageColorElements = document.querySelectorAll(".featured-image-color");
      if (!featuredImageColorElements || featuredImageColorElements.length === 0) {
        return false;
      }
      featuredImageColorElements.forEach((element) => {
        element.classList.add("skeleton");
      });
      const featuredImage = document.getElementById("featured-image");
      if (!featuredImage || !featuredImage.src) {
        return false;
      }
      const featuredImageColor = yield getImageColor(featuredImage.src);
      featuredImageColorElements.forEach((element) => {
        element.style.backgroundColor = featuredImageColor;
        element.classList.remove("skeleton");
      });
      return true;
    });
  }
  var log = (...args) => {
    if (DOMController.siteDebug) {
      console.log("[CsekCreative]", ...args);
    }
  };
  var error = (...args) => {
    if (DOMController.siteDebug) {
      console.error("[CsekCreative]", ...args);
    }
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

  // src/js/scripts/controllers/scroll-down-controller.ts
  var import_circletype = __toESM(require_circletype_min());
  var ScrollDownController = class extends BlockController {
    constructor(scrollDownId, parentScrollTargetSelector) {
      super();
      this.name = "ScrollDownController";
      if (!scrollDownId)
        throw new Error("Scroll down id not provided");
      if (!parentScrollTargetSelector)
        throw new Error("Parent scroll target selector not provided");
      this.scrollDownId = scrollDownId;
      this.parentScrollTargetSelector = parentScrollTargetSelector;
    }
    setup() {
      this.scrollDownElement = document.getElementById(this.scrollDownId);
      this.parentScrollTarget = document.querySelector(this.parentScrollTargetSelector);
      if (this.scrollDownElement && this.parentScrollTarget) {
        new import_circletype.default(this.scrollDownElement);
        this.addEventListeners();
      } else {
        this.log("No scroll down element");
      }
      this.isInitialized = true;
    }
    addEventListeners() {
      window.addEventListener("scroll", () => {
      });
    }
    scroll(scrollY) {
      this.update();
    }
    update() {
      if (!this.parentScrollTarget || !this.scrollDownElement)
        return;
      const scrollTargetRect = this.parentScrollTarget.getBoundingClientRect();
      this.log({ bottom: scrollTargetRect.bottom });
      if (scrollTargetRect.bottom <= 0) {
        this.scrollDownElement.style.opacity = "0";
        return;
      }
      this.scrollDownElement.style.opacity = "1";
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/strings.ts
  var pad = (n, digits, uses = "0") => {
    let str = n.toString();
    if (str.length >= digits)
      return str.slice(str.length - digits, digits);
    while (str.length < digits) {
      str = uses + str;
    }
    return str;
  };
  var removeHTMLTags = (str) => {
    const cleanText = str.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText;
  };
  var decodeHtmlEntities = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || "";
  };

  // src/js/scripts/controllers/carousel-controller.ts
  var CarouselController = class extends BlockController {
    constructor(carouselClass) {
      super();
      this.debug = false;
      this.name = "CarouselController";
      this.carouselClass = carouselClass.startsWith(".") ? carouselClass : `.${carouselClass}`;
      this.numItems = 0;
      this.blockHeight = 0;
    }
    setup() {
      this.carouselBlock = document.querySelector(this.carouselClass);
      if (this.invalid(this.carouselBlock))
        return;
      this.carousel = this.carouselBlock.querySelector(".carousel");
      this.log("Found carousel");
      this.progressNumerator = this.carouselBlock.querySelector(".carousel-slider-progress .start");
      this.progressDenominator = this.carouselBlock.querySelector(".carousel-slider-progress .stop");
      this.barProgress = this.carouselBlock.querySelector(".carousel-slider-progress .bar .progress");
      this.skipButton = this.carouselBlock.querySelector(".carousel-slider-progress .skip");
      const carouselItems = this.carouselBlock.querySelectorAll(".carousel-item");
      this.numItems = carouselItems.length;
      this.debug = true;
      this.addEventListeners();
      this.loadScroll();
      this.updateScroll();
      this.updateDenominator(pad(this.numItems, 2));
      this.updateProgress();
      this.isInitialized = true;
    }
    addEventListeners() {
      if (this.skipButton) {
        this.skipButton.addEventListener("click", (e) => {
          e.preventDefault();
          const skipCarousel = document.getElementById("skip-carousel");
          if (skipCarousel) {
            skipCarousel.scrollIntoView();
            window.scrollTo(0, window.scrollY - window.innerHeight);
          }
        });
      }
    }
    update() {
    }
    updateProgress() {
      if (this.barProgress) {
        const proportion = this.updateBarProgress(this.barProgress);
        this.updateNumerator(pad(Math.floor(proportion * this.numItems) + 1, 2));
      }
    }
    updateNumerator(val) {
      if (this.progressNumerator) {
        this.progressNumerator.innerText = val;
      }
    }
    updateDenominator(val) {
      if (this.progressDenominator) {
        this.progressDenominator.innerText = val;
      }
    }
    updateBarProgress(progressBar) {
      const proportion = this.scrollOffset / this.blockHeight;
      progressBar.style.width = `${constrain(proportion, 0, 1) * 100}%`;
      return proportion;
    }
    scroll(scrollY) {
      this.updateScroll(scrollY);
    }
    /**
     * Adapted from the script at: https://kyliedeboer.com/wp-content/themes/theme/_assets/scripts/plugins/featureslider.js
     * @param scrollY the current value of window.scrollY
     */
    updateScroll(scrollY) {
      var _a;
      const carouselSlider = (_a = this.carouselBlock) == null ? void 0 : _a.querySelector(".carousel-slider");
      if (carouselSlider && this.carouselBlock) {
        const vertScroll = scrollY || window.scrollY;
        const sliderBoundingRect = this.carouselBlock.getBoundingClientRect();
        if (sliderBoundingRect) {
          const theScrollOffset = this.carouselBlock.offsetTop - window.innerHeight;
          const theSliderScrollAmount = vertScroll - theScrollOffset - window.innerHeight;
          this.log(
            "theScrollOffset:",
            theScrollOffset,
            "top:",
            sliderBoundingRect.top,
            "scrollY:",
            vertScroll,
            "theSliderScrollAmount:",
            theSliderScrollAmount
          );
          carouselSlider.scrollLeft = theSliderScrollAmount;
          this.scrollOffset = theSliderScrollAmount;
          this.updateProgress();
        }
      }
    }
    /**
     * Adapted from the script at: https://kyliedeboer.com/wp-content/themes/theme/_assets/scripts/plugins/featureslider.js
     */
    loadScroll() {
      if (!this.carouselBlock || !this.carousel)
        return;
      let slides = this.carousel.querySelectorAll("li.carousel-item");
      let numSlides = slides.length;
      let slideWidth = slides[0].offsetWidth;
      let slideHeight = slides[0].offsetHeight;
      let sliderWidth = numSlides * slideWidth;
      let offset = 1;
      let newHeight = slideHeight + (sliderWidth - window.innerWidth) * offset;
      this.blockHeight = newHeight - slideHeight;
      this.carouselBlock.style.height = `${newHeight}px`;
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // node_modules/@vimeo/player/dist/player.es.js
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function() {
      return exports;
    };
    var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function(obj, key, desc) {
      obj[key] = desc.value;
    }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define2(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      }), obj[key];
    }
    try {
      define2({}, "");
    } catch (err) {
      define2 = function(obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self2, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self2, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var IteratorPrototype = {};
    define2(IteratorPrototype, iteratorSymbol, function() {
      return this;
    });
    var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define2(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg, value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function(value2) {
            invoke("next", value2, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function(unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function(error3) {
            return invoke("throw", error3, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self2, context) {
      var state = "suspendedStart";
      return function(method, arg) {
        if ("executing" === state)
          throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method)
            throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg; ; ) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel)
                continue;
              return delegateResult;
            }
          }
          if ("next" === context.method)
            context.sent = context._sent = context.arg;
          else if ("throw" === context.method) {
            if ("suspendedStart" === state)
              throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else
            "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self2, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel)
              continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method, method = delegate.iterator[methodName];
      if (void 0 === method)
        return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = void 0, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type)
        return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = void 0), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(true);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod)
          return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next)
          return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1, next = function next2() {
            for (; ++i < iterable.length; )
              if (hasOwn.call(iterable, i))
                return next2.value = iterable[i], next2.done = false, next2;
            return next2.value = void 0, next2.done = true, next2;
          };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: void 0,
        done: true
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: true
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: true
    }), GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function(genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function(genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define2(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function(arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define2(AsyncIterator.prototype, asyncIteratorSymbol, function() {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define2(Gp, toStringTagSymbol, "Generator"), define2(Gp, iteratorSymbol, function() {
      return this;
    }), define2(Gp, "toString", function() {
      return "[object Generator]";
    }), exports.keys = function(val) {
      var object = Object(val), keys = [];
      for (var key in object)
        keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length; ) {
          var key2 = keys.pop();
          if (key2 in object)
            return next.value = key2, next.done = false, next;
        }
        return next.done = true, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function(skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = false, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(resetTryEntry), !skipTempReset)
          for (var name in this)
            "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = void 0);
      },
      stop: function() {
        this.done = true;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type)
          throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function(exception) {
        if (this.done)
          throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = void 0), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i], record = entry.completion;
          if ("root" === entry.tryLoc)
            return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc)
                return handle(entry.catchLoc, true);
              if (this.prev < entry.finallyLoc)
                return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc)
                return handle(entry.catchLoc, true);
            } else {
              if (!hasFinally)
                throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc)
                return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function(record, afterLoc) {
        if ("throw" === record.type)
          throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc)
            return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function(iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName,
          nextLoc
        }, "next" === this.method && (this.arg = void 0), ContinueSentinel;
      }
    }, exports;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error3) {
      reject(error3);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self2 = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self2, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(void 0);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _possibleConstructorReturn(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self2);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null)
      return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object")
        return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  var isNode = typeof global !== "undefined" && {}.toString.call(global) === "[object global]";
  function getMethodName(prop, type) {
    if (prop.indexOf(type.toLowerCase()) === 0) {
      return prop;
    }
    return "".concat(type.toLowerCase()).concat(prop.substr(0, 1).toUpperCase()).concat(prop.substr(1));
  }
  function isDomElement(element) {
    return Boolean(element && element.nodeType === 1 && "nodeName" in element && element.ownerDocument && element.ownerDocument.defaultView);
  }
  function isInteger(value) {
    return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value;
  }
  function isVimeoUrl(url) {
    return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(url);
  }
  function isVimeoEmbed(url) {
    var expr = /^https:\/\/player\.vimeo\.com\/video\/\d+/;
    return expr.test(url);
  }
  function getVimeoUrl() {
    var oEmbedParameters2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var id = oEmbedParameters2.id;
    var url = oEmbedParameters2.url;
    var idOrUrl = id || url;
    if (!idOrUrl) {
      throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
    }
    if (isInteger(idOrUrl)) {
      return "https://vimeo.com/".concat(idOrUrl);
    }
    if (isVimeoUrl(idOrUrl)) {
      return idOrUrl.replace("http:", "https:");
    }
    if (id) {
      throw new TypeError("\u201C".concat(id, "\u201D is not a valid video id."));
    }
    throw new TypeError("\u201C".concat(idOrUrl, "\u201D is not a vimeo.com url."));
  }
  var subscribe = function subscribe2(target, eventName, callback) {
    var onName = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "addEventListener";
    var offName = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "removeEventListener";
    var eventNames = typeof eventName === "string" ? [eventName] : eventName;
    eventNames.forEach(function(evName) {
      target[onName](evName, callback);
    });
    return {
      cancel: function cancel() {
        return eventNames.forEach(function(evName) {
          return target[offName](evName, callback);
        });
      }
    };
  };
  var arrayIndexOfSupport = typeof Array.prototype.indexOf !== "undefined";
  var postMessageSupport = typeof window !== "undefined" && typeof window.postMessage !== "undefined";
  if (!isNode && (!arrayIndexOfSupport || !postMessageSupport)) {
    throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }
  (function(self2) {
    if (self2.WeakMap) {
      return;
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasDefine = Object.defineProperty && function() {
      try {
        return Object.defineProperty({}, "x", {
          value: 1
        }).x === 1;
      } catch (e) {
      }
    }();
    var defineProperty = function(object, name, value) {
      if (hasDefine) {
        Object.defineProperty(object, name, {
          configurable: true,
          writable: true,
          value
        });
      } else {
        object[name] = value;
      }
    };
    self2.WeakMap = function() {
      function WeakMap2() {
        if (this === void 0) {
          throw new TypeError("Constructor WeakMap requires 'new'");
        }
        defineProperty(this, "_id", genId("_WeakMap"));
        if (arguments.length > 0) {
          throw new TypeError("WeakMap iterable is not supported");
        }
      }
      defineProperty(WeakMap2.prototype, "delete", function(key) {
        checkInstance(this, "delete");
        if (!isObject(key)) {
          return false;
        }
        var entry = key[this._id];
        if (entry && entry[0] === key) {
          delete key[this._id];
          return true;
        }
        return false;
      });
      defineProperty(WeakMap2.prototype, "get", function(key) {
        checkInstance(this, "get");
        if (!isObject(key)) {
          return void 0;
        }
        var entry = key[this._id];
        if (entry && entry[0] === key) {
          return entry[1];
        }
        return void 0;
      });
      defineProperty(WeakMap2.prototype, "has", function(key) {
        checkInstance(this, "has");
        if (!isObject(key)) {
          return false;
        }
        var entry = key[this._id];
        if (entry && entry[0] === key) {
          return true;
        }
        return false;
      });
      defineProperty(WeakMap2.prototype, "set", function(key, value) {
        checkInstance(this, "set");
        if (!isObject(key)) {
          throw new TypeError("Invalid value used as weak map key");
        }
        var entry = key[this._id];
        if (entry && entry[0] === key) {
          entry[1] = value;
          return this;
        }
        defineProperty(key, this._id, [key, value]);
        return this;
      });
      function checkInstance(x, methodName) {
        if (!isObject(x) || !hasOwnProperty.call(x, "_id")) {
          throw new TypeError(methodName + " method called on incompatible receiver " + typeof x);
        }
      }
      function genId(prefix) {
        return prefix + "_" + rand() + "." + rand();
      }
      function rand() {
        return Math.random().toString().substring(2);
      }
      defineProperty(WeakMap2, "_polyfill", true);
      return WeakMap2;
    }();
    function isObject(x) {
      return Object(x) === x;
    }
  })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : commonjsGlobal);
  var npo_src = createCommonjsModule(function(module) {
    (function UMD(name, context, definition) {
      context[name] = context[name] || definition();
      if (module.exports) {
        module.exports = context[name];
      }
    })("Promise", typeof commonjsGlobal != "undefined" ? commonjsGlobal : commonjsGlobal, function DEF() {
      var builtInProp, cycle, scheduling_queue, ToString = Object.prototype.toString, timer = typeof setImmediate != "undefined" ? function timer2(fn) {
        return setImmediate(fn);
      } : setTimeout;
      try {
        Object.defineProperty({}, "x", {});
        builtInProp = function builtInProp2(obj, name, val, config) {
          return Object.defineProperty(obj, name, {
            value: val,
            writable: true,
            configurable: config !== false
          });
        };
      } catch (err) {
        builtInProp = function builtInProp2(obj, name, val) {
          obj[name] = val;
          return obj;
        };
      }
      scheduling_queue = /* @__PURE__ */ function Queue() {
        var first, last, item;
        function Item(fn, self2) {
          this.fn = fn;
          this.self = self2;
          this.next = void 0;
        }
        return {
          add: function add(fn, self2) {
            item = new Item(fn, self2);
            if (last) {
              last.next = item;
            } else {
              first = item;
            }
            last = item;
            item = void 0;
          },
          drain: function drain() {
            var f = first;
            first = last = cycle = void 0;
            while (f) {
              f.fn.call(f.self);
              f = f.next;
            }
          }
        };
      }();
      function schedule(fn, self2) {
        scheduling_queue.add(fn, self2);
        if (!cycle) {
          cycle = timer(scheduling_queue.drain);
        }
      }
      function isThenable(o) {
        var _then, o_type = typeof o;
        if (o != null && (o_type == "object" || o_type == "function")) {
          _then = o.then;
        }
        return typeof _then == "function" ? _then : false;
      }
      function notify() {
        for (var i = 0; i < this.chain.length; i++) {
          notifyIsolated(this, this.state === 1 ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
        }
        this.chain.length = 0;
      }
      function notifyIsolated(self2, cb, chain) {
        var ret, _then;
        try {
          if (cb === false) {
            chain.reject(self2.msg);
          } else {
            if (cb === true) {
              ret = self2.msg;
            } else {
              ret = cb.call(void 0, self2.msg);
            }
            if (ret === chain.promise) {
              chain.reject(TypeError("Promise-chain cycle"));
            } else if (_then = isThenable(ret)) {
              _then.call(ret, chain.resolve, chain.reject);
            } else {
              chain.resolve(ret);
            }
          }
        } catch (err) {
          chain.reject(err);
        }
      }
      function resolve(msg) {
        var _then, self2 = this;
        if (self2.triggered) {
          return;
        }
        self2.triggered = true;
        if (self2.def) {
          self2 = self2.def;
        }
        try {
          if (_then = isThenable(msg)) {
            schedule(function() {
              var def_wrapper = new MakeDefWrapper(self2);
              try {
                _then.call(msg, function $resolve$() {
                  resolve.apply(def_wrapper, arguments);
                }, function $reject$() {
                  reject.apply(def_wrapper, arguments);
                });
              } catch (err) {
                reject.call(def_wrapper, err);
              }
            });
          } else {
            self2.msg = msg;
            self2.state = 1;
            if (self2.chain.length > 0) {
              schedule(notify, self2);
            }
          }
        } catch (err) {
          reject.call(new MakeDefWrapper(self2), err);
        }
      }
      function reject(msg) {
        var self2 = this;
        if (self2.triggered) {
          return;
        }
        self2.triggered = true;
        if (self2.def) {
          self2 = self2.def;
        }
        self2.msg = msg;
        self2.state = 2;
        if (self2.chain.length > 0) {
          schedule(notify, self2);
        }
      }
      function iteratePromises(Constructor, arr, resolver, rejecter) {
        for (var idx = 0; idx < arr.length; idx++) {
          (function IIFE(idx2) {
            Constructor.resolve(arr[idx2]).then(function $resolver$(msg) {
              resolver(idx2, msg);
            }, rejecter);
          })(idx);
        }
      }
      function MakeDefWrapper(self2) {
        this.def = self2;
        this.triggered = false;
      }
      function MakeDef(self2) {
        this.promise = self2;
        this.state = 0;
        this.triggered = false;
        this.chain = [];
        this.msg = void 0;
      }
      function Promise2(executor) {
        if (typeof executor != "function") {
          throw TypeError("Not a function");
        }
        if (this.__NPO__ !== 0) {
          throw TypeError("Not a promise");
        }
        this.__NPO__ = 1;
        var def = new MakeDef(this);
        this["then"] = function then(success, failure) {
          var o = {
            success: typeof success == "function" ? success : true,
            failure: typeof failure == "function" ? failure : false
          };
          o.promise = new this.constructor(function extractChain(resolve2, reject2) {
            if (typeof resolve2 != "function" || typeof reject2 != "function") {
              throw TypeError("Not a function");
            }
            o.resolve = resolve2;
            o.reject = reject2;
          });
          def.chain.push(o);
          if (def.state !== 0) {
            schedule(notify, def);
          }
          return o.promise;
        };
        this["catch"] = function $catch$(failure) {
          return this.then(void 0, failure);
        };
        try {
          executor.call(void 0, function publicResolve(msg) {
            resolve.call(def, msg);
          }, function publicReject(msg) {
            reject.call(def, msg);
          });
        } catch (err) {
          reject.call(def, err);
        }
      }
      var PromisePrototype = builtInProp(
        {},
        "constructor",
        Promise2,
        /*configurable=*/
        false
      );
      Promise2.prototype = PromisePrototype;
      builtInProp(
        PromisePrototype,
        "__NPO__",
        0,
        /*configurable=*/
        false
      );
      builtInProp(Promise2, "resolve", function Promise$resolve(msg) {
        var Constructor = this;
        if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
          return msg;
        }
        return new Constructor(function executor(resolve2, reject2) {
          if (typeof resolve2 != "function" || typeof reject2 != "function") {
            throw TypeError("Not a function");
          }
          resolve2(msg);
        });
      });
      builtInProp(Promise2, "reject", function Promise$reject(msg) {
        return new this(function executor(resolve2, reject2) {
          if (typeof resolve2 != "function" || typeof reject2 != "function") {
            throw TypeError("Not a function");
          }
          reject2(msg);
        });
      });
      builtInProp(Promise2, "all", function Promise$all(arr) {
        var Constructor = this;
        if (ToString.call(arr) != "[object Array]") {
          return Constructor.reject(TypeError("Not an array"));
        }
        if (arr.length === 0) {
          return Constructor.resolve([]);
        }
        return new Constructor(function executor(resolve2, reject2) {
          if (typeof resolve2 != "function" || typeof reject2 != "function") {
            throw TypeError("Not a function");
          }
          var len = arr.length, msgs = Array(len), count = 0;
          iteratePromises(Constructor, arr, function resolver(idx, msg) {
            msgs[idx] = msg;
            if (++count === len) {
              resolve2(msgs);
            }
          }, reject2);
        });
      });
      builtInProp(Promise2, "race", function Promise$race(arr) {
        var Constructor = this;
        if (ToString.call(arr) != "[object Array]") {
          return Constructor.reject(TypeError("Not an array"));
        }
        return new Constructor(function executor(resolve2, reject2) {
          if (typeof resolve2 != "function" || typeof reject2 != "function") {
            throw TypeError("Not a function");
          }
          iteratePromises(Constructor, arr, function resolver(idx, msg) {
            resolve2(msg);
          }, reject2);
        });
      });
      return Promise2;
    });
  });
  var callbackMap = /* @__PURE__ */ new WeakMap();
  function storeCallback(player, name, callback) {
    var playerCallbacks = callbackMap.get(player.element) || {};
    if (!(name in playerCallbacks)) {
      playerCallbacks[name] = [];
    }
    playerCallbacks[name].push(callback);
    callbackMap.set(player.element, playerCallbacks);
  }
  function getCallbacks(player, name) {
    var playerCallbacks = callbackMap.get(player.element) || {};
    return playerCallbacks[name] || [];
  }
  function removeCallback(player, name, callback) {
    var playerCallbacks = callbackMap.get(player.element) || {};
    if (!playerCallbacks[name]) {
      return true;
    }
    if (!callback) {
      playerCallbacks[name] = [];
      callbackMap.set(player.element, playerCallbacks);
      return true;
    }
    var index = playerCallbacks[name].indexOf(callback);
    if (index !== -1) {
      playerCallbacks[name].splice(index, 1);
    }
    callbackMap.set(player.element, playerCallbacks);
    return playerCallbacks[name] && playerCallbacks[name].length === 0;
  }
  function shiftCallbacks(player, name) {
    var playerCallbacks = getCallbacks(player, name);
    if (playerCallbacks.length < 1) {
      return false;
    }
    var callback = playerCallbacks.shift();
    removeCallback(player, name, callback);
    return callback;
  }
  function swapCallbacks(oldElement, newElement) {
    var playerCallbacks = callbackMap.get(oldElement);
    callbackMap.set(newElement, playerCallbacks);
    callbackMap.delete(oldElement);
  }
  function parseMessageData(data) {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (error3) {
        console.warn(error3);
        return {};
      }
    }
    return data;
  }
  function postMessage(player, method, params) {
    if (!player.element.contentWindow || !player.element.contentWindow.postMessage) {
      return;
    }
    var message = {
      method
    };
    if (params !== void 0) {
      message.value = params;
    }
    var ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
    if (ieVersion >= 8 && ieVersion < 10) {
      message = JSON.stringify(message);
    }
    player.element.contentWindow.postMessage(message, player.origin);
  }
  function processData(player, data) {
    data = parseMessageData(data);
    var callbacks = [];
    var param;
    if (data.event) {
      if (data.event === "error") {
        var promises = getCallbacks(player, data.data.method);
        promises.forEach(function(promise) {
          var error3 = new Error(data.data.message);
          error3.name = data.data.name;
          promise.reject(error3);
          removeCallback(player, data.data.method, promise);
        });
      }
      callbacks = getCallbacks(player, "event:".concat(data.event));
      param = data.data;
    } else if (data.method) {
      var callback = shiftCallbacks(player, data.method);
      if (callback) {
        callbacks.push(callback);
        param = data.value;
      }
    }
    callbacks.forEach(function(callback2) {
      try {
        if (typeof callback2 === "function") {
          callback2.call(player, param);
          return;
        }
        callback2.resolve(param);
      } catch (e) {
      }
    });
  }
  var oEmbedParameters = ["autopause", "autoplay", "background", "byline", "color", "colors", "controls", "dnt", "height", "id", "interactive_params", "keyboard", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "texttrack", "title", "transparent", "url", "width"];
  function getOEmbedParameters(element) {
    var defaults = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return oEmbedParameters.reduce(function(params, param) {
      var value = element.getAttribute("data-vimeo-".concat(param));
      if (value || value === "") {
        params[param] = value === "" ? 1 : value;
      }
      return params;
    }, defaults);
  }
  function createEmbed(_ref, element) {
    var html = _ref.html;
    if (!element) {
      throw new TypeError("An element must be provided");
    }
    if (element.getAttribute("data-vimeo-initialized") !== null) {
      return element.querySelector("iframe");
    }
    var div = document.createElement("div");
    div.innerHTML = html;
    element.appendChild(div.firstChild);
    element.setAttribute("data-vimeo-initialized", "true");
    return element.querySelector("iframe");
  }
  function getOEmbedData(videoUrl) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var element = arguments.length > 2 ? arguments[2] : void 0;
    return new Promise(function(resolve, reject) {
      if (!isVimeoUrl(videoUrl)) {
        throw new TypeError("\u201C".concat(videoUrl, "\u201D is not a vimeo.com url."));
      }
      var url = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(videoUrl));
      for (var param in params) {
        if (params.hasOwnProperty(param)) {
          url += "&".concat(param, "=").concat(encodeURIComponent(params[param]));
        }
      }
      var xhr = "XDomainRequest" in window ? new XDomainRequest() : new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function() {
        if (xhr.status === 404) {
          reject(new Error("\u201C".concat(videoUrl, "\u201D was not found.")));
          return;
        }
        if (xhr.status === 403) {
          reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
          return;
        }
        try {
          var json = JSON.parse(xhr.responseText);
          if (json.domain_status_code === 403) {
            createEmbed(json, element);
            reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
            return;
          }
          resolve(json);
        } catch (error3) {
          reject(error3);
        }
      };
      xhr.onerror = function() {
        var status = xhr.status ? " (".concat(xhr.status, ")") : "";
        reject(new Error("There was an error fetching the embed code from Vimeo".concat(status, ".")));
      };
      xhr.send();
    });
  }
  function initializeEmbeds() {
    var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
    var elements = [].slice.call(parent.querySelectorAll("[data-vimeo-id], [data-vimeo-url]"));
    var handleError = function handleError2(error3) {
      if ("console" in window && console.error) {
        console.error("There was an error creating an embed: ".concat(error3));
      }
    };
    elements.forEach(function(element) {
      try {
        if (element.getAttribute("data-vimeo-defer") !== null) {
          return;
        }
        var params = getOEmbedParameters(element);
        var url = getVimeoUrl(params);
        getOEmbedData(url, params, element).then(function(data) {
          return createEmbed(data, element);
        }).catch(handleError);
      } catch (error3) {
        handleError(error3);
      }
    });
  }
  function resizeEmbeds() {
    var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
    if (window.VimeoPlayerResizeEmbeds_) {
      return;
    }
    window.VimeoPlayerResizeEmbeds_ = true;
    var onMessage = function onMessage2(event) {
      if (!isVimeoUrl(event.origin)) {
        return;
      }
      if (!event.data || event.data.event !== "spacechange") {
        return;
      }
      var iframes = parent.querySelectorAll("iframe");
      for (var i = 0; i < iframes.length; i++) {
        if (iframes[i].contentWindow !== event.source) {
          continue;
        }
        var space = iframes[i].parentElement;
        space.style.paddingBottom = "".concat(event.data.data[0].bottom, "px");
        break;
      }
    };
    window.addEventListener("message", onMessage);
  }
  function initAppendVideoMetadata() {
    var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
    if (window.VimeoSeoMetadataAppended) {
      return;
    }
    window.VimeoSeoMetadataAppended = true;
    var onMessage = function onMessage2(event) {
      if (!isVimeoUrl(event.origin)) {
        return;
      }
      var data = parseMessageData(event.data);
      if (!data || data.event !== "ready") {
        return;
      }
      var iframes = parent.querySelectorAll("iframe");
      for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var isValidMessageSource = iframe.contentWindow === event.source;
        if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
          var player = new Player(iframe);
          player.callMethod("appendVideoMetadata", window.location.href);
        }
      }
    };
    window.addEventListener("message", onMessage);
  }
  function checkUrlTimeParam() {
    var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
    if (window.VimeoCheckedUrlTimeParam) {
      return;
    }
    window.VimeoCheckedUrlTimeParam = true;
    var handleError = function handleError2(error3) {
      if ("console" in window && console.error) {
        console.error("There was an error getting video Id: ".concat(error3));
      }
    };
    var onMessage = function onMessage2(event) {
      if (!isVimeoUrl(event.origin)) {
        return;
      }
      var data = parseMessageData(event.data);
      if (!data || data.event !== "ready") {
        return;
      }
      var iframes = parent.querySelectorAll("iframe");
      var _loop = function _loop2() {
        var iframe = iframes[i];
        var isValidMessageSource = iframe.contentWindow === event.source;
        if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
          var player = new Player(iframe);
          player.getVideoId().then(function(videoId) {
            var matches = new RegExp("[?&]vimeo_t_".concat(videoId, "=([^&#]*)")).exec(window.location.href);
            if (matches && matches[1]) {
              var sec = decodeURI(matches[1]);
              player.setCurrentTime(sec);
            }
            return;
          }).catch(handleError);
        }
      };
      for (var i = 0; i < iframes.length; i++) {
        _loop();
      }
    };
    window.addEventListener("message", onMessage);
  }
  function initializeScreenfull() {
    var fn = function() {
      var val;
      var fnMap = [
        ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
        // New WebKit
        ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
        // Old WebKit
        ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
        ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
        ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
      ];
      var i = 0;
      var l = fnMap.length;
      var ret = {};
      for (; i < l; i++) {
        val = fnMap[i];
        if (val && val[1] in document) {
          for (i = 0; i < val.length; i++) {
            ret[fnMap[0][i]] = val[i];
          }
          return ret;
        }
      }
      return false;
    }();
    var eventNameMap = {
      fullscreenchange: fn.fullscreenchange,
      fullscreenerror: fn.fullscreenerror
    };
    var screenfull2 = {
      request: function request(element) {
        return new Promise(function(resolve, reject) {
          var onFullScreenEntered = function onFullScreenEntered2() {
            screenfull2.off("fullscreenchange", onFullScreenEntered2);
            resolve();
          };
          screenfull2.on("fullscreenchange", onFullScreenEntered);
          element = element || document.documentElement;
          var returnPromise = element[fn.requestFullscreen]();
          if (returnPromise instanceof Promise) {
            returnPromise.then(onFullScreenEntered).catch(reject);
          }
        });
      },
      exit: function exit() {
        return new Promise(function(resolve, reject) {
          if (!screenfull2.isFullscreen) {
            resolve();
            return;
          }
          var onFullScreenExit = function onFullScreenExit2() {
            screenfull2.off("fullscreenchange", onFullScreenExit2);
            resolve();
          };
          screenfull2.on("fullscreenchange", onFullScreenExit);
          var returnPromise = document[fn.exitFullscreen]();
          if (returnPromise instanceof Promise) {
            returnPromise.then(onFullScreenExit).catch(reject);
          }
        });
      },
      on: function on(event, callback) {
        var eventName = eventNameMap[event];
        if (eventName) {
          document.addEventListener(eventName, callback);
        }
      },
      off: function off(event, callback) {
        var eventName = eventNameMap[event];
        if (eventName) {
          document.removeEventListener(eventName, callback);
        }
      }
    };
    Object.defineProperties(screenfull2, {
      isFullscreen: {
        get: function get() {
          return Boolean(document[fn.fullscreenElement]);
        }
      },
      element: {
        enumerable: true,
        get: function get() {
          return document[fn.fullscreenElement];
        }
      },
      isEnabled: {
        enumerable: true,
        get: function get() {
          return Boolean(document[fn.fullscreenEnabled]);
        }
      }
    });
    return screenfull2;
  }
  var defaultOptions = {
    role: "viewer",
    autoPlayMuted: true,
    allowedDrift: 0.3,
    maxAllowedDrift: 1,
    minCheckInterval: 0.1,
    maxRateAdjustment: 0.2,
    maxTimeToCatchUp: 1
  };
  var TimingSrcConnector = /* @__PURE__ */ function(_EventTarget) {
    _inherits(TimingSrcConnector2, _EventTarget);
    var _super = _createSuper(TimingSrcConnector2);
    function TimingSrcConnector2(_player, timingObject) {
      var _this;
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var logger = arguments.length > 3 ? arguments[3] : void 0;
      _classCallCheck(this, TimingSrcConnector2);
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "logger", void 0);
      _defineProperty(_assertThisInitialized(_this), "speedAdjustment", 0);
      _defineProperty(_assertThisInitialized(_this), "adjustSpeed", /* @__PURE__ */ function() {
        var _ref = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(player, newAdjustment) {
          var newPlaybackRate;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1)
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(_this.speedAdjustment === newAdjustment)) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  _context.next = 4;
                  return player.getPlaybackRate();
                case 4:
                  _context.t0 = _context.sent;
                  _context.t1 = _this.speedAdjustment;
                  _context.t2 = _context.t0 - _context.t1;
                  _context.t3 = newAdjustment;
                  newPlaybackRate = _context.t2 + _context.t3;
                  _this.log("New playbackRate:  ".concat(newPlaybackRate));
                  _context.next = 12;
                  return player.setPlaybackRate(newPlaybackRate);
                case 12:
                  _this.speedAdjustment = newAdjustment;
                case 13:
                case "end":
                  return _context.stop();
              }
          }, _callee);
        }));
        return function(_x2, _x22) {
          return _ref.apply(this, arguments);
        };
      }());
      _this.logger = logger;
      _this.init(timingObject, _player, _objectSpread2(_objectSpread2({}, defaultOptions), options));
      return _this;
    }
    _createClass(TimingSrcConnector2, [{
      key: "disconnect",
      value: function disconnect() {
        this.dispatchEvent(new Event("disconnect"));
      }
      /**
       * @param {TimingObject} timingObject
       * @param {PlayerControls} player
       * @param {TimingSrcConnectorOptions} options
       * @return {Promise<void>}
       */
    }, {
      key: "init",
      value: function() {
        var _init = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee2(timingObject, player, options) {
          var _this2 = this;
          var playerUpdater, positionSync, timingObjectUpdater;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1)
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.waitForTOReadyState(timingObject, "open");
                case 2:
                  if (!(options.role === "viewer")) {
                    _context2.next = 10;
                    break;
                  }
                  _context2.next = 5;
                  return this.updatePlayer(timingObject, player, options);
                case 5:
                  playerUpdater = subscribe(timingObject, "change", function() {
                    return _this2.updatePlayer(timingObject, player, options);
                  });
                  positionSync = this.maintainPlaybackPosition(timingObject, player, options);
                  this.addEventListener("disconnect", function() {
                    positionSync.cancel();
                    playerUpdater.cancel();
                  });
                  _context2.next = 14;
                  break;
                case 10:
                  _context2.next = 12;
                  return this.updateTimingObject(timingObject, player);
                case 12:
                  timingObjectUpdater = subscribe(player, ["seeked", "play", "pause", "ratechange"], function() {
                    return _this2.updateTimingObject(timingObject, player);
                  }, "on", "off");
                  this.addEventListener("disconnect", function() {
                    return timingObjectUpdater.cancel();
                  });
                case 14:
                case "end":
                  return _context2.stop();
              }
          }, _callee2, this);
        }));
        function init(_x3, _x4, _x5) {
          return _init.apply(this, arguments);
        }
        return init;
      }()
      /**
       * Sets the TimingObject's state to reflect that of the player
       *
       * @param {TimingObject} timingObject
       * @param {PlayerControls} player
       * @return {Promise<void>}
       */
    }, {
      key: "updateTimingObject",
      value: function() {
        var _updateTimingObject = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee3(timingObject, player) {
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1)
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = timingObject;
                  _context3.next = 3;
                  return player.getCurrentTime();
                case 3:
                  _context3.t1 = _context3.sent;
                  _context3.next = 6;
                  return player.getPaused();
                case 6:
                  if (!_context3.sent) {
                    _context3.next = 10;
                    break;
                  }
                  _context3.t2 = 0;
                  _context3.next = 13;
                  break;
                case 10:
                  _context3.next = 12;
                  return player.getPlaybackRate();
                case 12:
                  _context3.t2 = _context3.sent;
                case 13:
                  _context3.t3 = _context3.t2;
                  _context3.t4 = {
                    position: _context3.t1,
                    velocity: _context3.t3
                  };
                  _context3.t0.update.call(_context3.t0, _context3.t4);
                case 16:
                case "end":
                  return _context3.stop();
              }
          }, _callee3);
        }));
        function updateTimingObject(_x6, _x7) {
          return _updateTimingObject.apply(this, arguments);
        }
        return updateTimingObject;
      }()
      /**
       * Sets the player's timing state to reflect that of the TimingObject
       *
       * @param {TimingObject} timingObject
       * @param {PlayerControls} player
       * @param {TimingSrcConnectorOptions} options
       * @return {Promise<void>}
       */
    }, {
      key: "updatePlayer",
      value: function() {
        var _updatePlayer = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee5(timingObject, player, options) {
          var _timingObject$query, position, velocity;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1)
              switch (_context5.prev = _context5.next) {
                case 0:
                  _timingObject$query = timingObject.query(), position = _timingObject$query.position, velocity = _timingObject$query.velocity;
                  if (typeof position === "number") {
                    player.setCurrentTime(position);
                  }
                  if (!(typeof velocity === "number")) {
                    _context5.next = 25;
                    break;
                  }
                  if (!(velocity === 0)) {
                    _context5.next = 11;
                    break;
                  }
                  _context5.next = 6;
                  return player.getPaused();
                case 6:
                  _context5.t0 = _context5.sent;
                  if (!(_context5.t0 === false)) {
                    _context5.next = 9;
                    break;
                  }
                  player.pause();
                case 9:
                  _context5.next = 25;
                  break;
                case 11:
                  if (!(velocity > 0)) {
                    _context5.next = 25;
                    break;
                  }
                  _context5.next = 14;
                  return player.getPaused();
                case 14:
                  _context5.t1 = _context5.sent;
                  if (!(_context5.t1 === true)) {
                    _context5.next = 19;
                    break;
                  }
                  _context5.next = 18;
                  return player.play().catch(/* @__PURE__ */ function() {
                    var _ref2 = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee4(err) {
                      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                        while (1)
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!(err.name === "NotAllowedError" && options.autoPlayMuted)) {
                                _context4.next = 5;
                                break;
                              }
                              _context4.next = 3;
                              return player.setMuted(true);
                            case 3:
                              _context4.next = 5;
                              return player.play().catch(function(err2) {
                                return console.error("Couldn't play the video from TimingSrcConnector. Error:", err2);
                              });
                            case 5:
                            case "end":
                              return _context4.stop();
                          }
                      }, _callee4);
                    }));
                    return function(_x11) {
                      return _ref2.apply(this, arguments);
                    };
                  }());
                case 18:
                  this.updatePlayer(timingObject, player, options);
                case 19:
                  _context5.next = 21;
                  return player.getPlaybackRate();
                case 21:
                  _context5.t2 = _context5.sent;
                  _context5.t3 = velocity;
                  if (!(_context5.t2 !== _context5.t3)) {
                    _context5.next = 25;
                    break;
                  }
                  player.setPlaybackRate(velocity);
                case 25:
                case "end":
                  return _context5.stop();
              }
          }, _callee5, this);
        }));
        function updatePlayer(_x8, _x9, _x10) {
          return _updatePlayer.apply(this, arguments);
        }
        return updatePlayer;
      }()
      /**
       * Since video players do not play with 100% time precision, we need to closely monitor
       * our player to be sure it remains in sync with the TimingObject.
       *
       * If out of sync, we use the current conditions and the options provided to determine
       * whether to re-sync via setting currentTime or adjusting the playbackRate
       *
       * @param {TimingObject} timingObject
       * @param {PlayerControls} player
       * @param {TimingSrcConnectorOptions} options
       * @return {{cancel: (function(): void)}}
       */
    }, {
      key: "maintainPlaybackPosition",
      value: function maintainPlaybackPosition(timingObject, player, options) {
        var _this3 = this;
        var allowedDrift = options.allowedDrift, maxAllowedDrift = options.maxAllowedDrift, minCheckInterval = options.minCheckInterval, maxRateAdjustment = options.maxRateAdjustment, maxTimeToCatchUp = options.maxTimeToCatchUp;
        var syncInterval = Math.min(maxTimeToCatchUp, Math.max(minCheckInterval, maxAllowedDrift)) * 1e3;
        var check = /* @__PURE__ */ function() {
          var _ref3 = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee6() {
            var diff, diffAbs, min, max, adjustment;
            return _regeneratorRuntime().wrap(function _callee6$(_context6) {
              while (1)
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.t0 = timingObject.query().velocity === 0;
                    if (_context6.t0) {
                      _context6.next = 6;
                      break;
                    }
                    _context6.next = 4;
                    return player.getPaused();
                  case 4:
                    _context6.t1 = _context6.sent;
                    _context6.t0 = _context6.t1 === true;
                  case 6:
                    if (!_context6.t0) {
                      _context6.next = 8;
                      break;
                    }
                    return _context6.abrupt("return");
                  case 8:
                    _context6.t2 = timingObject.query().position;
                    _context6.next = 11;
                    return player.getCurrentTime();
                  case 11:
                    _context6.t3 = _context6.sent;
                    diff = _context6.t2 - _context6.t3;
                    diffAbs = Math.abs(diff);
                    _this3.log("Drift: ".concat(diff));
                    if (!(diffAbs > maxAllowedDrift)) {
                      _context6.next = 22;
                      break;
                    }
                    _context6.next = 18;
                    return _this3.adjustSpeed(player, 0);
                  case 18:
                    player.setCurrentTime(timingObject.query().position);
                    _this3.log("Resync by currentTime");
                    _context6.next = 29;
                    break;
                  case 22:
                    if (!(diffAbs > allowedDrift)) {
                      _context6.next = 29;
                      break;
                    }
                    min = diffAbs / maxTimeToCatchUp;
                    max = maxRateAdjustment;
                    adjustment = min < max ? (max - min) / 2 : max;
                    _context6.next = 28;
                    return _this3.adjustSpeed(player, adjustment * Math.sign(diff));
                  case 28:
                    _this3.log("Resync by playbackRate");
                  case 29:
                  case "end":
                    return _context6.stop();
                }
            }, _callee6);
          }));
          return function check2() {
            return _ref3.apply(this, arguments);
          };
        }();
        var interval = setInterval(function() {
          return check();
        }, syncInterval);
        return {
          cancel: function cancel() {
            return clearInterval(interval);
          }
        };
      }
      /**
       * @param {string} msg
       */
    }, {
      key: "log",
      value: function log4(msg) {
        var _this$logger;
        (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.call(this, "TimingSrcConnector: ".concat(msg));
      }
    }, {
      key: "waitForTOReadyState",
      value: (
        /**
         * @param {TimingObject} timingObject
         * @param {TConnectionState} state
         * @return {Promise<void>}
         */
        function waitForTOReadyState(timingObject, state) {
          return new Promise(function(resolve) {
            var check = function check2() {
              if (timingObject.readyState === state) {
                resolve();
              } else {
                timingObject.addEventListener("readystatechange", check2, {
                  once: true
                });
              }
            };
            check();
          });
        }
      )
    }]);
    return TimingSrcConnector2;
  }(/* @__PURE__ */ _wrapNativeSuper(EventTarget));
  var playerMap = /* @__PURE__ */ new WeakMap();
  var readyMap = /* @__PURE__ */ new WeakMap();
  var screenfull = {};
  var Player = /* @__PURE__ */ function() {
    function Player2(element) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, Player2);
      if (window.jQuery && element instanceof jQuery) {
        if (element.length > 1 && window.console && console.warn) {
          console.warn("A jQuery object with multiple elements was passed, using the first element.");
        }
        element = element[0];
      }
      if (typeof document !== "undefined" && typeof element === "string") {
        element = document.getElementById(element);
      }
      if (!isDomElement(element)) {
        throw new TypeError("You must pass either a valid element or a valid id.");
      }
      if (element.nodeName !== "IFRAME") {
        var iframe = element.querySelector("iframe");
        if (iframe) {
          element = iframe;
        }
      }
      if (element.nodeName === "IFRAME" && !isVimeoUrl(element.getAttribute("src") || "")) {
        throw new Error("The player element passed isn\u2019t a Vimeo embed.");
      }
      if (playerMap.has(element)) {
        return playerMap.get(element);
      }
      this._window = element.ownerDocument.defaultView;
      this.element = element;
      this.origin = "*";
      var readyPromise = new npo_src(function(resolve, reject) {
        _this._onMessage = function(event) {
          if (!isVimeoUrl(event.origin) || _this.element.contentWindow !== event.source) {
            return;
          }
          if (_this.origin === "*") {
            _this.origin = event.origin;
          }
          var data = parseMessageData(event.data);
          var isError = data && data.event === "error";
          var isReadyError = isError && data.data && data.data.method === "ready";
          if (isReadyError) {
            var error3 = new Error(data.data.message);
            error3.name = data.data.name;
            reject(error3);
            return;
          }
          var isReadyEvent = data && data.event === "ready";
          var isPingResponse = data && data.method === "ping";
          if (isReadyEvent || isPingResponse) {
            _this.element.setAttribute("data-ready", "true");
            resolve();
            return;
          }
          processData(_this, data);
        };
        _this._window.addEventListener("message", _this._onMessage);
        if (_this.element.nodeName !== "IFRAME") {
          var params = getOEmbedParameters(element, options);
          var url = getVimeoUrl(params);
          getOEmbedData(url, params, element).then(function(data) {
            var iframe2 = createEmbed(data, element);
            _this.element = iframe2;
            _this._originalElement = element;
            swapCallbacks(element, iframe2);
            playerMap.set(_this.element, _this);
            return data;
          }).catch(reject);
        }
      });
      readyMap.set(this, readyPromise);
      playerMap.set(this.element, this);
      if (this.element.nodeName === "IFRAME") {
        postMessage(this, "ping");
      }
      if (screenfull.isEnabled) {
        var exitFullscreen = function exitFullscreen2() {
          return screenfull.exit();
        };
        this.fullscreenchangeHandler = function() {
          if (screenfull.isFullscreen) {
            storeCallback(_this, "event:exitFullscreen", exitFullscreen);
          } else {
            removeCallback(_this, "event:exitFullscreen", exitFullscreen);
          }
          _this.ready().then(function() {
            postMessage(_this, "fullscreenchange", screenfull.isFullscreen);
          });
        };
        screenfull.on("fullscreenchange", this.fullscreenchangeHandler);
      }
      return this;
    }
    _createClass(Player2, [{
      key: "callMethod",
      value: function callMethod(name) {
        var _this2 = this;
        var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return new npo_src(function(resolve, reject) {
          return _this2.ready().then(function() {
            storeCallback(_this2, name, {
              resolve,
              reject
            });
            postMessage(_this2, name, args);
          }).catch(reject);
        });
      }
      /**
       * Get a promise for the value of a player property.
       *
       * @param {string} name The property name
       * @return {Promise}
       */
    }, {
      key: "get",
      value: function get(name) {
        var _this3 = this;
        return new npo_src(function(resolve, reject) {
          name = getMethodName(name, "get");
          return _this3.ready().then(function() {
            storeCallback(_this3, name, {
              resolve,
              reject
            });
            postMessage(_this3, name);
          }).catch(reject);
        });
      }
      /**
       * Get a promise for setting the value of a player property.
       *
       * @param {string} name The API method to call.
       * @param {mixed} value The value to set.
       * @return {Promise}
       */
    }, {
      key: "set",
      value: function set(name, value) {
        var _this4 = this;
        return new npo_src(function(resolve, reject) {
          name = getMethodName(name, "set");
          if (value === void 0 || value === null) {
            throw new TypeError("There must be a value to set.");
          }
          return _this4.ready().then(function() {
            storeCallback(_this4, name, {
              resolve,
              reject
            });
            postMessage(_this4, name, value);
          }).catch(reject);
        });
      }
      /**
       * Add an event listener for the specified event. Will call the
       * callback with a single parameter, `data`, that contains the data for
       * that event.
       *
       * @param {string} eventName The name of the event.
       * @param {function(*)} callback The function to call when the event fires.
       * @return {void}
       */
    }, {
      key: "on",
      value: function on(eventName, callback) {
        if (!eventName) {
          throw new TypeError("You must pass an event name.");
        }
        if (!callback) {
          throw new TypeError("You must pass a callback function.");
        }
        if (typeof callback !== "function") {
          throw new TypeError("The callback must be a function.");
        }
        var callbacks = getCallbacks(this, "event:".concat(eventName));
        if (callbacks.length === 0) {
          this.callMethod("addEventListener", eventName).catch(function() {
          });
        }
        storeCallback(this, "event:".concat(eventName), callback);
      }
      /**
       * Remove an event listener for the specified event. Will remove all
       * listeners for that event if a `callback` isn’t passed, or only that
       * specific callback if it is passed.
       *
       * @param {string} eventName The name of the event.
       * @param {function} [callback] The specific callback to remove.
       * @return {void}
       */
    }, {
      key: "off",
      value: function off(eventName, callback) {
        if (!eventName) {
          throw new TypeError("You must pass an event name.");
        }
        if (callback && typeof callback !== "function") {
          throw new TypeError("The callback must be a function.");
        }
        var lastCallback = removeCallback(this, "event:".concat(eventName), callback);
        if (lastCallback) {
          this.callMethod("removeEventListener", eventName).catch(function(e) {
          });
        }
      }
      /**
       * A promise to load a new video.
       *
       * @promise LoadVideoPromise
       * @fulfill {number} The video with this id or url successfully loaded.
       * @reject {TypeError} The id was not a number.
       */
      /**
       * Load a new video into this embed. The promise will be resolved if
       * the video is successfully loaded, or it will be rejected if it could
       * not be loaded.
       *
       * @param {number|string|object} options The id of the video, the url of the video, or an object with embed options.
       * @return {LoadVideoPromise}
       */
    }, {
      key: "loadVideo",
      value: function loadVideo(options) {
        return this.callMethod("loadVideo", options);
      }
      /**
       * A promise to perform an action when the Player is ready.
       *
       * @todo document errors
       * @promise LoadVideoPromise
       * @fulfill {void}
       */
      /**
       * Trigger a function when the player iframe has initialized. You do not
       * need to wait for `ready` to trigger to begin adding event listeners
       * or calling other methods.
       *
       * @return {ReadyPromise}
       */
    }, {
      key: "ready",
      value: function ready() {
        var readyPromise = readyMap.get(this) || new npo_src(function(resolve, reject) {
          reject(new Error("Unknown player. Probably unloaded."));
        });
        return npo_src.resolve(readyPromise);
      }
      /**
       * A promise to add a cue point to the player.
       *
       * @promise AddCuePointPromise
       * @fulfill {string} The id of the cue point to use for removeCuePoint.
       * @reject {RangeError} the time was less than 0 or greater than the
       *         video’s duration.
       * @reject {UnsupportedError} Cue points are not supported with the current
       *         player or browser.
       */
      /**
       * Add a cue point to the player.
       *
       * @param {number} time The time for the cue point.
       * @param {object} [data] Arbitrary data to be returned with the cue point.
       * @return {AddCuePointPromise}
       */
    }, {
      key: "addCuePoint",
      value: function addCuePoint(time) {
        var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return this.callMethod("addCuePoint", {
          time,
          data
        });
      }
      /**
       * A promise to remove a cue point from the player.
       *
       * @promise AddCuePointPromise
       * @fulfill {string} The id of the cue point that was removed.
       * @reject {InvalidCuePoint} The cue point with the specified id was not
       *         found.
       * @reject {UnsupportedError} Cue points are not supported with the current
       *         player or browser.
       */
      /**
       * Remove a cue point from the video.
       *
       * @param {string} id The id of the cue point to remove.
       * @return {RemoveCuePointPromise}
       */
    }, {
      key: "removeCuePoint",
      value: function removeCuePoint(id) {
        return this.callMethod("removeCuePoint", id);
      }
      /**
       * A representation of a text track on a video.
       *
       * @typedef {Object} VimeoTextTrack
       * @property {string} language The ISO language code.
       * @property {string} kind The kind of track it is (captions or subtitles).
       * @property {string} label The human‐readable label for the track.
       */
      /**
       * A promise to enable a text track.
       *
       * @promise EnableTextTrackPromise
       * @fulfill {VimeoTextTrack} The text track that was enabled.
       * @reject {InvalidTrackLanguageError} No track was available with the
       *         specified language.
       * @reject {InvalidTrackError} No track was available with the specified
       *         language and kind.
       */
      /**
       * Enable the text track with the specified language, and optionally the
       * specified kind (captions or subtitles).
       *
       * When set via the API, the track language will not change the viewer’s
       * stored preference.
       *
       * @param {string} language The two‐letter language code.
       * @param {string} [kind] The kind of track to enable (captions or subtitles).
       * @return {EnableTextTrackPromise}
       */
    }, {
      key: "enableTextTrack",
      value: function enableTextTrack(language, kind) {
        if (!language) {
          throw new TypeError("You must pass a language.");
        }
        return this.callMethod("enableTextTrack", {
          language,
          kind
        });
      }
      /**
       * A promise to disable the active text track.
       *
       * @promise DisableTextTrackPromise
       * @fulfill {void} The track was disabled.
       */
      /**
       * Disable the currently-active text track.
       *
       * @return {DisableTextTrackPromise}
       */
    }, {
      key: "disableTextTrack",
      value: function disableTextTrack() {
        return this.callMethod("disableTextTrack");
      }
      /**
       * A promise to pause the video.
       *
       * @promise PausePromise
       * @fulfill {void} The video was paused.
       */
      /**
       * Pause the video if it’s playing.
       *
       * @return {PausePromise}
       */
    }, {
      key: "pause",
      value: function pause() {
        return this.callMethod("pause");
      }
      /**
       * A promise to play the video.
       *
       * @promise PlayPromise
       * @fulfill {void} The video was played.
       */
      /**
       * Play the video if it’s paused. **Note:** on iOS and some other
       * mobile devices, you cannot programmatically trigger play. Once the
       * viewer has tapped on the play button in the player, however, you
       * will be able to use this function.
       *
       * @return {PlayPromise}
       */
    }, {
      key: "play",
      value: function play() {
        return this.callMethod("play");
      }
      /**
       * Request that the player enters fullscreen.
       * @return {Promise}
       */
    }, {
      key: "requestFullscreen",
      value: function requestFullscreen() {
        if (screenfull.isEnabled) {
          return screenfull.request(this.element);
        }
        return this.callMethod("requestFullscreen");
      }
      /**
       * Request that the player exits fullscreen.
       * @return {Promise}
       */
    }, {
      key: "exitFullscreen",
      value: function exitFullscreen() {
        if (screenfull.isEnabled) {
          return screenfull.exit();
        }
        return this.callMethod("exitFullscreen");
      }
      /**
       * Returns true if the player is currently fullscreen.
       * @return {Promise}
       */
    }, {
      key: "getFullscreen",
      value: function getFullscreen() {
        if (screenfull.isEnabled) {
          return npo_src.resolve(screenfull.isFullscreen);
        }
        return this.get("fullscreen");
      }
      /**
       * Request that the player enters picture-in-picture.
       * @return {Promise}
       */
    }, {
      key: "requestPictureInPicture",
      value: function requestPictureInPicture() {
        return this.callMethod("requestPictureInPicture");
      }
      /**
       * Request that the player exits picture-in-picture.
       * @return {Promise}
       */
    }, {
      key: "exitPictureInPicture",
      value: function exitPictureInPicture() {
        return this.callMethod("exitPictureInPicture");
      }
      /**
       * Returns true if the player is currently picture-in-picture.
       * @return {Promise}
       */
    }, {
      key: "getPictureInPicture",
      value: function getPictureInPicture() {
        return this.get("pictureInPicture");
      }
      /**
       * A promise to prompt the viewer to initiate remote playback.
       *
       * @promise RemotePlaybackPromptPromise
       * @fulfill {void}
       * @reject {NotFoundError} No remote playback device is available.
       */
      /**
       * Request to prompt the user to initiate remote playback.
       *
       * @return {RemotePlaybackPromptPromise}
       */
    }, {
      key: "remotePlaybackPrompt",
      value: function remotePlaybackPrompt() {
        return this.callMethod("remotePlaybackPrompt");
      }
      /**
       * A promise to unload the video.
       *
       * @promise UnloadPromise
       * @fulfill {void} The video was unloaded.
       */
      /**
       * Return the player to its initial state.
       *
       * @return {UnloadPromise}
       */
    }, {
      key: "unload",
      value: function unload() {
        return this.callMethod("unload");
      }
      /**
       * Cleanup the player and remove it from the DOM
       *
       * It won't be usable and a new one should be constructed
       *  in order to do any operations.
       *
       * @return {Promise}
       */
    }, {
      key: "destroy",
      value: function destroy() {
        var _this5 = this;
        return new npo_src(function(resolve) {
          readyMap.delete(_this5);
          playerMap.delete(_this5.element);
          if (_this5._originalElement) {
            playerMap.delete(_this5._originalElement);
            _this5._originalElement.removeAttribute("data-vimeo-initialized");
          }
          if (_this5.element && _this5.element.nodeName === "IFRAME" && _this5.element.parentNode) {
            if (_this5.element.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== _this5.element.parentNode) {
              _this5.element.parentNode.parentNode.removeChild(_this5.element.parentNode);
            } else {
              _this5.element.parentNode.removeChild(_this5.element);
            }
          }
          if (_this5.element && _this5.element.nodeName === "DIV" && _this5.element.parentNode) {
            _this5.element.removeAttribute("data-vimeo-initialized");
            var iframe = _this5.element.querySelector("iframe");
            if (iframe && iframe.parentNode) {
              if (iframe.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== iframe.parentNode) {
                iframe.parentNode.parentNode.removeChild(iframe.parentNode);
              } else {
                iframe.parentNode.removeChild(iframe);
              }
            }
          }
          _this5._window.removeEventListener("message", _this5._onMessage);
          if (screenfull.isEnabled) {
            screenfull.off("fullscreenchange", _this5.fullscreenchangeHandler);
          }
          resolve();
        });
      }
      /**
       * A promise to get the autopause behavior of the video.
       *
       * @promise GetAutopausePromise
       * @fulfill {boolean} Whether autopause is turned on or off.
       * @reject {UnsupportedError} Autopause is not supported with the current
       *         player or browser.
       */
      /**
       * Get the autopause behavior for this player.
       *
       * @return {GetAutopausePromise}
       */
    }, {
      key: "getAutopause",
      value: function getAutopause() {
        return this.get("autopause");
      }
      /**
       * A promise to set the autopause behavior of the video.
       *
       * @promise SetAutopausePromise
       * @fulfill {boolean} Whether autopause is turned on or off.
       * @reject {UnsupportedError} Autopause is not supported with the current
       *         player or browser.
       */
      /**
       * Enable or disable the autopause behavior of this player.
       *
       * By default, when another video is played in the same browser, this
       * player will automatically pause. Unless you have a specific reason
       * for doing so, we recommend that you leave autopause set to the
       * default (`true`).
       *
       * @param {boolean} autopause
       * @return {SetAutopausePromise}
       */
    }, {
      key: "setAutopause",
      value: function setAutopause(autopause) {
        return this.set("autopause", autopause);
      }
      /**
       * A promise to get the buffered property of the video.
       *
       * @promise GetBufferedPromise
       * @fulfill {Array} Buffered Timeranges converted to an Array.
       */
      /**
       * Get the buffered property of the video.
       *
       * @return {GetBufferedPromise}
       */
    }, {
      key: "getBuffered",
      value: function getBuffered() {
        return this.get("buffered");
      }
      /**
       * @typedef {Object} CameraProperties
       * @prop {number} props.yaw - Number between 0 and 360.
       * @prop {number} props.pitch - Number between -90 and 90.
       * @prop {number} props.roll - Number between -180 and 180.
       * @prop {number} props.fov - The field of view in degrees.
       */
      /**
       * A promise to get the camera properties of the player.
       *
       * @promise GetCameraPromise
       * @fulfill {CameraProperties} The camera properties.
       */
      /**
       * For 360° videos get the camera properties for this player.
       *
       * @return {GetCameraPromise}
       */
    }, {
      key: "getCameraProps",
      value: function getCameraProps() {
        return this.get("cameraProps");
      }
      /**
       * A promise to set the camera properties of the player.
       *
       * @promise SetCameraPromise
       * @fulfill {Object} The camera was successfully set.
       * @reject {RangeError} The range was out of bounds.
       */
      /**
       * For 360° videos set the camera properties for this player.
       *
       * @param {CameraProperties} camera The camera properties
       * @return {SetCameraPromise}
       */
    }, {
      key: "setCameraProps",
      value: function setCameraProps(camera) {
        return this.set("cameraProps", camera);
      }
      /**
       * A representation of a chapter.
       *
       * @typedef {Object} VimeoChapter
       * @property {number} startTime The start time of the chapter.
       * @property {object} title The title of the chapter.
       * @property {number} index The place in the order of Chapters. Starts at 1.
       */
      /**
       * A promise to get chapters for the video.
       *
       * @promise GetChaptersPromise
       * @fulfill {VimeoChapter[]} The chapters for the video.
       */
      /**
       * Get an array of all the chapters for the video.
       *
       * @return {GetChaptersPromise}
       */
    }, {
      key: "getChapters",
      value: function getChapters() {
        return this.get("chapters");
      }
      /**
       * A promise to get the currently active chapter.
       *
       * @promise GetCurrentChaptersPromise
       * @fulfill {VimeoChapter|undefined} The current chapter for the video.
       */
      /**
       * Get the currently active chapter for the video.
       *
       * @return {GetCurrentChaptersPromise}
       */
    }, {
      key: "getCurrentChapter",
      value: function getCurrentChapter() {
        return this.get("currentChapter");
      }
      /**
       * A promise to get the accent color of the player.
       *
       * @promise GetColorPromise
       * @fulfill {string} The hex color of the player.
       */
      /**
       * Get the accent color for this player. Note this is deprecated in place of `getColorTwo`.
       *
       * @return {GetColorPromise}
       */
    }, {
      key: "getColor",
      value: function getColor() {
        return this.get("color");
      }
      /**
       * A promise to get all colors for the player in an array.
       *
       * @promise GetColorsPromise
       * @fulfill {string[]} The hex colors of the player.
       */
      /**
       * Get all the colors for this player in an array: [colorOne, colorTwo, colorThree, colorFour]
       *
       * @return {GetColorPromise}
       */
    }, {
      key: "getColors",
      value: function getColors() {
        return npo_src.all([this.get("colorOne"), this.get("colorTwo"), this.get("colorThree"), this.get("colorFour")]);
      }
      /**
       * A promise to set the accent color of the player.
       *
       * @promise SetColorPromise
       * @fulfill {string} The color was successfully set.
       * @reject {TypeError} The string was not a valid hex or rgb color.
       * @reject {ContrastError} The color was set, but the contrast is
       *         outside of the acceptable range.
       * @reject {EmbedSettingsError} The owner of the player has chosen to
       *         use a specific color.
       */
      /**
       * Set the accent color of this player to a hex or rgb string. Setting the
       * color may fail if the owner of the video has set their embed
       * preferences to force a specific color.
       * Note this is deprecated in place of `setColorTwo`.
       *
       * @param {string} color The hex or rgb color string to set.
       * @return {SetColorPromise}
       */
    }, {
      key: "setColor",
      value: function setColor(color) {
        return this.set("color", color);
      }
      /**
       * A promise to set all colors for the player.
       *
       * @promise SetColorsPromise
       * @fulfill {string[]} The colors were successfully set.
       * @reject {TypeError} The string was not a valid hex or rgb color.
       * @reject {ContrastError} The color was set, but the contrast is
       *         outside of the acceptable range.
       * @reject {EmbedSettingsError} The owner of the player has chosen to
       *         use a specific color.
       */
      /**
       * Set the colors of this player to a hex or rgb string. Setting the
       * color may fail if the owner of the video has set their embed
       * preferences to force a specific color.
       * The colors should be passed in as an array: [colorOne, colorTwo, colorThree, colorFour].
       * If a color should not be set, the index in the array can be left as null.
       *
       * @param {string[]} colors Array of the hex or rgb color strings to set.
       * @return {SetColorsPromise}
       */
    }, {
      key: "setColors",
      value: function setColors(colors) {
        if (!Array.isArray(colors)) {
          return new npo_src(function(resolve, reject) {
            return reject(new TypeError("Argument must be an array."));
          });
        }
        var nullPromise = new npo_src(function(resolve) {
          return resolve(null);
        });
        var colorPromises = [colors[0] ? this.set("colorOne", colors[0]) : nullPromise, colors[1] ? this.set("colorTwo", colors[1]) : nullPromise, colors[2] ? this.set("colorThree", colors[2]) : nullPromise, colors[3] ? this.set("colorFour", colors[3]) : nullPromise];
        return npo_src.all(colorPromises);
      }
      /**
       * A representation of a cue point.
       *
       * @typedef {Object} VimeoCuePoint
       * @property {number} time The time of the cue point.
       * @property {object} data The data passed when adding the cue point.
       * @property {string} id The unique id for use with removeCuePoint.
       */
      /**
       * A promise to get the cue points of a video.
       *
       * @promise GetCuePointsPromise
       * @fulfill {VimeoCuePoint[]} The cue points added to the video.
       * @reject {UnsupportedError} Cue points are not supported with the current
       *         player or browser.
       */
      /**
       * Get an array of the cue points added to the video.
       *
       * @return {GetCuePointsPromise}
       */
    }, {
      key: "getCuePoints",
      value: function getCuePoints() {
        return this.get("cuePoints");
      }
      /**
       * A promise to get the current time of the video.
       *
       * @promise GetCurrentTimePromise
       * @fulfill {number} The current time in seconds.
       */
      /**
       * Get the current playback position in seconds.
       *
       * @return {GetCurrentTimePromise}
       */
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this.get("currentTime");
      }
      /**
       * A promise to set the current time of the video.
       *
       * @promise SetCurrentTimePromise
       * @fulfill {number} The actual current time that was set.
       * @reject {RangeError} the time was less than 0 or greater than the
       *         video’s duration.
       */
      /**
       * Set the current playback position in seconds. If the player was
       * paused, it will remain paused. Likewise, if the player was playing,
       * it will resume playing once the video has buffered.
       *
       * You can provide an accurate time and the player will attempt to seek
       * to as close to that time as possible. The exact time will be the
       * fulfilled value of the promise.
       *
       * @param {number} currentTime
       * @return {SetCurrentTimePromise}
       */
    }, {
      key: "setCurrentTime",
      value: function setCurrentTime(currentTime) {
        return this.set("currentTime", currentTime);
      }
      /**
       * A promise to get the duration of the video.
       *
       * @promise GetDurationPromise
       * @fulfill {number} The duration in seconds.
       */
      /**
       * Get the duration of the video in seconds. It will be rounded to the
       * nearest second before playback begins, and to the nearest thousandth
       * of a second after playback begins.
       *
       * @return {GetDurationPromise}
       */
    }, {
      key: "getDuration",
      value: function getDuration() {
        return this.get("duration");
      }
      /**
       * A promise to get the ended state of the video.
       *
       * @promise GetEndedPromise
       * @fulfill {boolean} Whether or not the video has ended.
       */
      /**
       * Get the ended state of the video. The video has ended if
       * `currentTime === duration`.
       *
       * @return {GetEndedPromise}
       */
    }, {
      key: "getEnded",
      value: function getEnded() {
        return this.get("ended");
      }
      /**
       * A promise to get the loop state of the player.
       *
       * @promise GetLoopPromise
       * @fulfill {boolean} Whether or not the player is set to loop.
       */
      /**
       * Get the loop state of the player.
       *
       * @return {GetLoopPromise}
       */
    }, {
      key: "getLoop",
      value: function getLoop() {
        return this.get("loop");
      }
      /**
       * A promise to set the loop state of the player.
       *
       * @promise SetLoopPromise
       * @fulfill {boolean} The loop state that was set.
       */
      /**
       * Set the loop state of the player. When set to `true`, the player
       * will start over immediately once playback ends.
       *
       * @param {boolean} loop
       * @return {SetLoopPromise}
       */
    }, {
      key: "setLoop",
      value: function setLoop(loop) {
        return this.set("loop", loop);
      }
      /**
       * A promise to set the muted state of the player.
       *
       * @promise SetMutedPromise
       * @fulfill {boolean} The muted state that was set.
       */
      /**
       * Set the muted state of the player. When set to `true`, the player
       * volume will be muted.
       *
       * @param {boolean} muted
       * @return {SetMutedPromise}
       */
    }, {
      key: "setMuted",
      value: function setMuted(muted) {
        return this.set("muted", muted);
      }
      /**
       * A promise to get the muted state of the player.
       *
       * @promise GetMutedPromise
       * @fulfill {boolean} Whether or not the player is muted.
       */
      /**
       * Get the muted state of the player.
       *
       * @return {GetMutedPromise}
       */
    }, {
      key: "getMuted",
      value: function getMuted() {
        return this.get("muted");
      }
      /**
       * A promise to get the paused state of the player.
       *
       * @promise GetLoopPromise
       * @fulfill {boolean} Whether or not the video is paused.
       */
      /**
       * Get the paused state of the player.
       *
       * @return {GetLoopPromise}
       */
    }, {
      key: "getPaused",
      value: function getPaused() {
        return this.get("paused");
      }
      /**
       * A promise to get the playback rate of the player.
       *
       * @promise GetPlaybackRatePromise
       * @fulfill {number} The playback rate of the player on a scale from 0 to 2.
       */
      /**
       * Get the playback rate of the player on a scale from `0` to `2`.
       *
       * @return {GetPlaybackRatePromise}
       */
    }, {
      key: "getPlaybackRate",
      value: function getPlaybackRate() {
        return this.get("playbackRate");
      }
      /**
       * A promise to set the playbackrate of the player.
       *
       * @promise SetPlaybackRatePromise
       * @fulfill {number} The playback rate was set.
       * @reject {RangeError} The playback rate was less than 0 or greater than 2.
       */
      /**
       * Set the playback rate of the player on a scale from `0` to `2`. When set
       * via the API, the playback rate will not be synchronized to other
       * players or stored as the viewer's preference.
       *
       * @param {number} playbackRate
       * @return {SetPlaybackRatePromise}
       */
    }, {
      key: "setPlaybackRate",
      value: function setPlaybackRate(playbackRate) {
        return this.set("playbackRate", playbackRate);
      }
      /**
       * A promise to get the played property of the video.
       *
       * @promise GetPlayedPromise
       * @fulfill {Array} Played Timeranges converted to an Array.
       */
      /**
       * Get the played property of the video.
       *
       * @return {GetPlayedPromise}
       */
    }, {
      key: "getPlayed",
      value: function getPlayed() {
        return this.get("played");
      }
      /**
       * A promise to get the qualities available of the current video.
       *
       * @promise GetQualitiesPromise
       * @fulfill {Array} The qualities of the video.
       */
      /**
       * Get the qualities of the current video.
       *
       * @return {GetQualitiesPromise}
       */
    }, {
      key: "getQualities",
      value: function getQualities() {
        return this.get("qualities");
      }
      /**
       * A promise to get the current set quality of the video.
       *
       * @promise GetQualityPromise
       * @fulfill {string} The current set quality.
       */
      /**
       * Get the current set quality of the video.
       *
       * @return {GetQualityPromise}
       */
    }, {
      key: "getQuality",
      value: function getQuality() {
        return this.get("quality");
      }
      /**
       * A promise to set the video quality.
       *
       * @promise SetQualityPromise
       * @fulfill {number} The quality was set.
       * @reject {RangeError} The quality is not available.
       */
      /**
       * Set a video quality.
       *
       * @param {string} quality
       * @return {SetQualityPromise}
       */
    }, {
      key: "setQuality",
      value: function setQuality(quality) {
        return this.set("quality", quality);
      }
      /**
       * A promise to get the remote playback availability.
       *
       * @promise RemotePlaybackAvailabilityPromise
       * @fulfill {boolean} Whether remote playback is available.
       */
      /**
       * Get the availability of remote playback.
       *
       * @return {RemotePlaybackAvailabilityPromise}
       */
    }, {
      key: "getRemotePlaybackAvailability",
      value: function getRemotePlaybackAvailability() {
        return this.get("remotePlaybackAvailability");
      }
      /**
       * A promise to get the current remote playback state.
       *
       * @promise RemotePlaybackStatePromise
       * @fulfill {string} The state of the remote playback: connecting, connected, or disconnected.
       */
      /**
       * Get the current remote playback state.
       *
       * @return {RemotePlaybackStatePromise}
       */
    }, {
      key: "getRemotePlaybackState",
      value: function getRemotePlaybackState() {
        return this.get("remotePlaybackState");
      }
      /**
       * A promise to get the seekable property of the video.
       *
       * @promise GetSeekablePromise
       * @fulfill {Array} Seekable Timeranges converted to an Array.
       */
      /**
       * Get the seekable property of the video.
       *
       * @return {GetSeekablePromise}
       */
    }, {
      key: "getSeekable",
      value: function getSeekable() {
        return this.get("seekable");
      }
      /**
       * A promise to get the seeking property of the player.
       *
       * @promise GetSeekingPromise
       * @fulfill {boolean} Whether or not the player is currently seeking.
       */
      /**
       * Get if the player is currently seeking.
       *
       * @return {GetSeekingPromise}
       */
    }, {
      key: "getSeeking",
      value: function getSeeking() {
        return this.get("seeking");
      }
      /**
       * A promise to get the text tracks of a video.
       *
       * @promise GetTextTracksPromise
       * @fulfill {VimeoTextTrack[]} The text tracks associated with the video.
       */
      /**
       * Get an array of the text tracks that exist for the video.
       *
       * @return {GetTextTracksPromise}
       */
    }, {
      key: "getTextTracks",
      value: function getTextTracks() {
        return this.get("textTracks");
      }
      /**
       * A promise to get the embed code for the video.
       *
       * @promise GetVideoEmbedCodePromise
       * @fulfill {string} The `<iframe>` embed code for the video.
       */
      /**
       * Get the `<iframe>` embed code for the video.
       *
       * @return {GetVideoEmbedCodePromise}
       */
    }, {
      key: "getVideoEmbedCode",
      value: function getVideoEmbedCode() {
        return this.get("videoEmbedCode");
      }
      /**
       * A promise to get the id of the video.
       *
       * @promise GetVideoIdPromise
       * @fulfill {number} The id of the video.
       */
      /**
       * Get the id of the video.
       *
       * @return {GetVideoIdPromise}
       */
    }, {
      key: "getVideoId",
      value: function getVideoId() {
        return this.get("videoId");
      }
      /**
       * A promise to get the title of the video.
       *
       * @promise GetVideoTitlePromise
       * @fulfill {number} The title of the video.
       */
      /**
       * Get the title of the video.
       *
       * @return {GetVideoTitlePromise}
       */
    }, {
      key: "getVideoTitle",
      value: function getVideoTitle() {
        return this.get("videoTitle");
      }
      /**
       * A promise to get the native width of the video.
       *
       * @promise GetVideoWidthPromise
       * @fulfill {number} The native width of the video.
       */
      /**
       * Get the native width of the currently‐playing video. The width of
       * the highest‐resolution available will be used before playback begins.
       *
       * @return {GetVideoWidthPromise}
       */
    }, {
      key: "getVideoWidth",
      value: function getVideoWidth() {
        return this.get("videoWidth");
      }
      /**
       * A promise to get the native height of the video.
       *
       * @promise GetVideoHeightPromise
       * @fulfill {number} The native height of the video.
       */
      /**
       * Get the native height of the currently‐playing video. The height of
       * the highest‐resolution available will be used before playback begins.
       *
       * @return {GetVideoHeightPromise}
       */
    }, {
      key: "getVideoHeight",
      value: function getVideoHeight() {
        return this.get("videoHeight");
      }
      /**
       * A promise to get the vimeo.com url for the video.
       *
       * @promise GetVideoUrlPromise
       * @fulfill {number} The vimeo.com url for the video.
       * @reject {PrivacyError} The url isn’t available because of the video’s privacy setting.
       */
      /**
       * Get the vimeo.com url for the video.
       *
       * @return {GetVideoUrlPromise}
       */
    }, {
      key: "getVideoUrl",
      value: function getVideoUrl() {
        return this.get("videoUrl");
      }
      /**
       * A promise to get the volume level of the player.
       *
       * @promise GetVolumePromise
       * @fulfill {number} The volume level of the player on a scale from 0 to 1.
       */
      /**
       * Get the current volume level of the player on a scale from `0` to `1`.
       *
       * Most mobile devices do not support an independent volume from the
       * system volume. In those cases, this method will always return `1`.
       *
       * @return {GetVolumePromise}
       */
    }, {
      key: "getVolume",
      value: function getVolume() {
        return this.get("volume");
      }
      /**
       * A promise to set the volume level of the player.
       *
       * @promise SetVolumePromise
       * @fulfill {number} The volume was set.
       * @reject {RangeError} The volume was less than 0 or greater than 1.
       */
      /**
       * Set the volume of the player on a scale from `0` to `1`. When set
       * via the API, the volume level will not be synchronized to other
       * players or stored as the viewer’s preference.
       *
       * Most mobile devices do not support setting the volume. An error will
       * *not* be triggered in that situation.
       *
       * @param {number} volume
       * @return {SetVolumePromise}
       */
    }, {
      key: "setVolume",
      value: function setVolume(volume) {
        return this.set("volume", volume);
      }
      /** @typedef {import('./lib/timing-object.types').TimingObject} TimingObject */
      /** @typedef {import('./lib/timing-src-connector.types').TimingSrcConnectorOptions} TimingSrcConnectorOptions */
      /** @typedef {import('./lib/timing-src-connector').TimingSrcConnector} TimingSrcConnector */
      /**
       * Connects a TimingObject to the video player (https://webtiming.github.io/timingobject/)
       *
       * @param {TimingObject} timingObject
       * @param {TimingSrcConnectorOptions} options
       *
       * @return {Promise<TimingSrcConnector>}
       */
    }, {
      key: "setTimingSrc",
      value: function() {
        var _setTimingSrc = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(timingObject, options) {
          var _this6 = this;
          var connector;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1)
              switch (_context.prev = _context.next) {
                case 0:
                  if (timingObject) {
                    _context.next = 2;
                    break;
                  }
                  throw new TypeError("A Timing Object must be provided.");
                case 2:
                  _context.next = 4;
                  return this.ready();
                case 4:
                  connector = new TimingSrcConnector(this, timingObject, options);
                  postMessage(this, "notifyTimingObjectConnect");
                  connector.addEventListener("disconnect", function() {
                    return postMessage(_this6, "notifyTimingObjectDisconnect");
                  });
                  return _context.abrupt("return", connector);
                case 8:
                case "end":
                  return _context.stop();
              }
          }, _callee, this);
        }));
        function setTimingSrc(_x2, _x22) {
          return _setTimingSrc.apply(this, arguments);
        }
        return setTimingSrc;
      }()
    }]);
    return Player2;
  }();
  if (!isNode) {
    screenfull = initializeScreenfull();
    initializeEmbeds();
    resizeEmbeds();
    initAppendVideoMetadata();
    checkUrlTimeParam();
  }
  var player_es_default = Player;

  // src/js/scripts/vimeo.ts
  var VimeoVideo = class _VimeoVideo {
    constructor(vimeoURL, width = 640, height = 360, autoplay = false) {
      this.vimeoURL = vimeoURL;
      this.width = width;
      this.height = height;
      this.autoplay = autoplay;
      this.apiResponseData = null;
    }
    log(...args) {
      log("[VimeoVideo]", ...args);
    }
    createPlayer(parent) {
      if (!this.apiResponseData)
        return null;
      const options = {
        id: this.apiResponseData.video_id,
        width: this.width,
        loop: false,
        colors: [void 0, void 0, void 0, "#131313"]
      };
      const player = new player_es_default(parent, options);
      return player;
    }
    get thumbnail() {
      var _a, _b;
      const thumbnail = document.createElement("img");
      thumbnail.src = ((_a = this.apiResponseData) == null ? void 0 : _a.thumbnail_url) || "";
      thumbnail.width = this.width;
      thumbnail.height = this.height;
      thumbnail.alt = ((_b = this.apiResponseData) == null ? void 0 : _b.title) || "";
      return thumbnail;
    }
    updateVideoData() {
      return __async(this, null, function* () {
        this.log("Updating video data");
        if (this.apiResponseData) {
          this.log("Video data already fetched");
          return this.apiResponseData;
        }
        this.apiResponseData = yield _VimeoVideo.fetchVideoData(this.vimeoURL, this.width, this.height);
        this.log("Video data fetched: ", this.apiResponseData);
        return this.apiResponseData;
      });
    }
    static fetchVideoData(url, width = 640, height = 360) {
      return __async(this, null, function* () {
        try {
          const response = yield fetch(
            `https://vimeo.com/api/oembed.json?url=${encodeURI(
              url
            )}&width=${width}&height=${height}&responive=true&playsinline=false`
          );
          const data = yield response.json();
          return data;
        } catch (err) {
          console.error(err);
          return null;
        }
      });
    }
    static getThumbnailURL(vimeoURL, width = 640, height = 360) {
      return __async(this, null, function* () {
        const videoData = yield _VimeoVideo.fetchVideoData(vimeoURL);
        if (!videoData)
          return null;
        return videoData.thumbnail_url;
      });
    }
  };

  // src/js/scripts/controllers/video-carousel-controller.ts
  var VideoCarouselController = class extends BlockController {
    constructor(videoCarouselClassName) {
      super();
      this.debug = false;
      this.name = "VideoCarouselController";
      if (!videoCarouselClassName)
        throw new Error("Video carousel class name not provided");
      if (videoCarouselClassName[0] === ".")
        videoCarouselClassName = videoCarouselClassName.slice(1);
      this.videoCarouselClassName = videoCarouselClassName;
      this.activeIndex = 0;
      this.vimeoVideos = [];
    }
    setup() {
      var _a;
      this.debug = true;
      this.videoCarousel = document.querySelector(`.${this.videoCarouselClassName}`);
      if (this.invalid(this.videoCarousel)) {
        this.log("No video carousel found.");
        return;
      }
      this.log("Found video carousel");
      this.videoDialog = document.getElementById("video-player");
      this.videoStrip = this.videoCarousel.querySelector(".video-strip");
      this.progressNumerator = this.videoCarousel.querySelector(".video-carousel-slider-progress .start");
      this.progressDenominator = this.videoCarousel.querySelector(".video-carousel-slider-progress .stop");
      this.barProgress = this.videoCarousel.querySelector(".video-carousel-slider-progress .bar .progress");
      if (!this.videoDialog)
        this.log("Could not find video dialog");
      if (!this.videoStrip)
        this.log("Could not find video strip");
      if (!this.progressNumerator)
        this.log("Could not find progress numerator");
      if (!this.progressDenominator)
        this.log("Could not find progress denominator");
      if (!this.barProgress)
        this.log("Could not find bar progress");
      if (!this.videoDialog || !this.progressNumerator || !this.progressDenominator || !this.barProgress)
        return;
      this.videoBlocks = this.videoCarousel.querySelectorAll(".video-block");
      this.numItems = (_a = this.videoBlocks) == null ? void 0 : _a.length;
      this.progressDenominator.innerText = pad(this.numItems, 2);
      this.prepareThumbnails();
      this.log("Found video dialog");
      this.log("Found video strip");
      this.log("Found progress numerator");
      this.log("Found progress denominator");
      this.log("Found bar progress");
      this.addEventListeners();
      this.log("Setup complete");
      this.isInitialized = true;
    }
    addEventListeners() {
      if (!this.videoCarousel)
        return;
      const prevButton = this.videoCarousel.querySelector(".video-carousel-slider-progress .prev");
      const nextButton = this.videoCarousel.querySelector(".video-carousel-slider-progress .next");
      this.videoPlayButton = this.videoCarousel.querySelector(
        `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`
      );
      this.videoCloseButton = document.body.querySelector(".close-dialog");
      if (prevButton) {
        this.log("prev button found");
        prevButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.prev();
          this.update();
          this.log("prev");
        });
      } else {
        this.log("prev button not found");
      }
      if (nextButton) {
        this.log("next button found");
        nextButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.next();
          this.update();
          this.log("next");
        });
      } else {
        this.log("next button not found");
      }
      if (this.videoCloseButton) {
        this.log("close dialog button found");
        this.videoCloseButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.log("close dialog button clicked");
          this.closeVideoPlayer();
        });
      } else {
        this.log("close dialog button not found");
      }
      this.update();
    }
    prepareThumbnails() {
      return __async(this, null, function* () {
        var _a, _b, _c;
        if (!this.videoBlocks)
          return;
        this.log("Preparing thumbnails...");
        let idx = 0;
        for (const block of this.videoBlocks) {
          const vimeoThumbnail = block.querySelector(".vimeo-thumbnail[data-vimeo-url]");
          if (vimeoThumbnail) {
            const url = (_a = vimeoThumbnail.getAttribute("data-vimeo-url")) != null ? _a : "";
            const video = new VimeoVideo(url, 1920, 1080, false);
            this.vimeoVideos[idx] = video;
            yield video.updateVideoData();
            this.log("video data updated:", __spreadValues({}, video.apiResponseData));
            if (vimeoThumbnail.getAttribute("src") === "") {
              const thumbnail = (_c = (_b = video.apiResponseData) == null ? void 0 : _b.thumbnail_url) != null ? _c : "";
              vimeoThumbnail.setAttribute("src", thumbnail);
            }
          } else {
            this.log("vimeo data not found");
          }
          idx++;
        }
      });
    }
    update() {
      this.log("active index:", this.activeIndex);
      if (this.videoStrip && this.videoCarousel) {
        this.videoStrip.style.transform = `translateX(-${this.activeIndex * 100}vw)`;
        this.updateNumerator(pad(this.activeIndex + 1, 2));
        this.updateBarProgress();
        this.updateVideoPlayer();
        this.updatePlayButton();
      }
    }
    prev() {
      this.activeIndex = (this.activeIndex - 1 + this.numItems) % this.numItems;
    }
    next() {
      this.activeIndex = (this.activeIndex + 1) % this.numItems;
    }
    updateNumerator(val) {
      if (this.progressNumerator) {
        this.progressNumerator.innerText = val;
      }
    }
    updateDenominator(val) {
      if (this.progressDenominator) {
        this.progressDenominator.innerText = val;
      }
    }
    updatePlayButton() {
      if (this.videoPlayButton && this.videoCarousel) {
        this.log("updating current play button...");
        const buttonSelector = `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`;
        this.log("button selector:", buttonSelector);
        this.videoPlayButton = this.videoCarousel.querySelector(buttonSelector);
        if (this.videoPlayButton) {
          this.log("video play button found");
          this.videoPlayButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.log("video play button clicked");
            this.openVideoPlayer();
          });
        } else {
          this.log("updated play button not found");
        }
      } else {
        this.log("could not find play button");
      }
    }
    updateBarProgress() {
      if (this.barProgress) {
        const proportion = this.activeIndex / (this.numItems - 1);
        this.barProgress.style.width = `${constrain(proportion, 0, 1) * 100}%`;
      }
    }
    updateVideoPlayer() {
      var _a, _b, _c, _d;
      if (this.videoDialog) {
        const player = this.videoDialog.querySelector(".player");
        if (!player)
          return;
        player.innerHTML = "";
        const vimeoVideo = this.vimeoVideos[this.activeIndex];
        if (vimeoVideo) {
          player.innerHTML = (_b = (_a = vimeoVideo.apiResponseData) == null ? void 0 : _a.html) != null ? _b : "";
          this.currentVimeoPlayer = vimeoVideo.createPlayer(player);
        } else if (!vimeoVideo) {
          const internalVideo = document.createElement("video");
          const currentSource = (_d = (_c = this.videoStrip) == null ? void 0 : _c.querySelector(`.video-block:nth-child(${this.activeIndex + 1}) video source`)) == null ? void 0 : _d.cloneNode(true);
          if (internalVideo && currentSource) {
            internalVideo.appendChild(currentSource);
            player.appendChild(internalVideo);
            this.log("video updated");
          }
        }
        this.videoDialog.addEventListener("close", () => {
          player.innerHTML = "";
        });
      }
    }
    openVideoPlayer() {
      this.update();
      if (this.videoDialog) {
        this.videoDialog.classList.add("open");
        const internalVideo = this.videoDialog.querySelector("video");
        if (internalVideo) {
          internalVideo.play();
          this.log("video playing");
        } else if (this.currentVimeoPlayer) {
          this.currentVimeoPlayer.play();
          this.log("vimeo video playing");
        } else {
          this.log("no video found");
        }
      }
    }
    closeVideoPlayer() {
      this.update();
      if (this.videoDialog) {
        this.videoDialog.classList.remove("open");
      }
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/expanding-video-controller.ts
  var _ExpandingVideoController = class _ExpandingVideoController extends BlockController {
    constructor(blockClassName) {
      super();
      this.debug = false;
      this.name = "ExpandingVideoController";
      this.blockClassName = blockClassName;
    }
    setup() {
      const block = document.querySelector(this.blockClassName);
      if (this.invalid(block)) {
        this.log("No expanding video block found.");
        return;
      }
      this.expandingVideos = block == null ? void 0 : block.querySelectorAll(".expanding-video-container");
      if (this.invalid(this.expandingVideos.length > 0)) {
        this.log("No expanding videos found.");
        return;
      } else {
        this.log(`Found ${this.expandingVideos.length} expanding videos`);
      }
      this.floatingImages = block == null ? void 0 : block.querySelectorAll(".floating-image");
      this.floatingImages.forEach((image) => {
        image.style.animationDelay = `${randomIntInRange(100, 750)}ms`;
      });
      this.addScrollEventListener();
      this.isInitialized = true;
    }
    expandVideo(container) {
      this.log("Expanding video...");
      container.classList.add("expanded");
      const otherElements = getSiblings(container);
      if (otherElements.length === 0) {
        this.log("No siblings found");
        return;
      }
      otherElements.forEach((elmt) => {
        elmt.classList.add("disappear");
      });
    }
    retractVideo(container) {
      container.classList.remove("expanded");
      const otherElements = getSiblings(container);
      if (otherElements.length === 0) {
        this.log("No siblings found");
        return;
      }
      otherElements.forEach((elmt) => elmt.classList.remove("disappear"));
    }
    onScroll(pos) {
      if (this.expandingVideos.length === 0)
        return;
      this.expandingVideos.forEach((container) => {
        const parent = container.parentElement;
        if (!parent)
          return;
        const rect = parent.getBoundingClientRect();
        if (rect.top <= _ExpandingVideoController.scrollThreshold) {
          this.expandVideo(container);
        } else {
          this.retractVideo(container);
        }
      });
    }
    addScrollEventListener() {
      window.addEventListener("scroll", () => {
        const pos = window.scrollY;
        this.onScroll(pos);
      });
    }
    onMouseMove(e, blockIndex) {
    }
  };
  _ExpandingVideoController.scrollThreshold = 150;
  var ExpandingVideoController = _ExpandingVideoController;

  // src/js/scripts/marquee/row.ts
  var _Strip = class _Strip {
    constructor(mq, words) {
      this.fadeInAmt = 0;
      this.fadeOutAmt = 1;
      this.activeWord = "";
      this.oldWord = "";
      this.mq = mq;
      this.words = shuffle(words);
      if (this.mq.separator) {
        this.words = [];
        for (const word of shuffle(words)) {
          this.words.push(word);
          this.words.push(this.mq.separator);
        }
      }
      const dimensions = this.calculateDimensions();
      this.width = dimensions.w;
      this.height = dimensions.h;
      this.acc = dimensions.acc;
      this.dec = dimensions.dec;
    }
    calculateDimensions() {
      return this.words.reduce(
        (acc, word) => {
          const dimensions = this.mq.textDimensions(word);
          return {
            w: acc.w + dimensions.w + _Strip.wordSpacing,
            h: Math.max(acc.h, dimensions.h),
            acc: Math.max(acc.acc, dimensions.acc),
            dec: Math.max(acc.dec, dimensions.dec)
          };
        },
        { w: 0, h: 0, acc: 0, dec: 0 }
      );
    }
    update() {
      if (this.activeWord !== this.mq.activeWord) {
        this.oldWord = this.activeWord;
        this.activeWord = this.mq.activeWord;
        this.fadeInAmt = 0;
        this.fadeOutAmt = 1;
      }
      this.fadeInAmt += 0.1;
      this.fadeOutAmt -= 0.1;
      if (this.fadeInAmt > 1)
        this.fadeInAmt = 1;
      if (this.fadeOutAmt < 0)
        this.fadeOutAmt = 0;
    }
    draw(x = 0, y = 0) {
      let localOffset = 0;
      for (let i = 0; i < this.words.length; i++) {
        const word = this.words[i];
        this.mq.text(word, x + localOffset, y, Row.lightColor);
        if (word === this.activeWord) {
          this.mq.ctx.globalAlpha = this.fadeInAmt;
          this.mq.text(word, x + localOffset, y, Row.darkColor);
        } else if (word === this.oldWord) {
          this.mq.ctx.globalAlpha = this.fadeOutAmt;
          this.mq.text(word, x + localOffset, y, Row.darkColor);
        }
        this.mq.ctx.globalAlpha = 1;
        localOffset += this.mq.textDimensions(word).w + _Strip.wordSpacing;
      }
    }
    clone() {
      const clone = new _Strip(this.mq, [...this.words]);
      return clone;
    }
  };
  _Strip.wordSpacing = 64;
  var Strip = _Strip;
  var Ribbon = class _Ribbon {
    constructor(mq, words) {
      this.offset = 0;
      this.mq = mq;
      this.words = words;
      const firstStrip = new Strip(mq, words);
      this.strips = [firstStrip];
      this.numberOfStrips = Math.ceil(this.mq.width / firstStrip.width);
      for (let i = 1; i < this.numberOfStrips; i++) {
        const strip = firstStrip.clone();
        this.strips.push(strip);
      }
      this.width = this.calculateWidth();
      this.height = firstStrip.height;
      this.acc = firstStrip.acc;
      this.dec = firstStrip.dec;
    }
    calculateWidth() {
      return this.strips.reduce((acc, strip) => {
        return acc + strip.width;
      }, 0);
    }
    update(direction) {
      this.offset += direction * Row.scrollSpeed;
      for (const s of this.strips) {
        s.update();
      }
    }
    draw(x = 0, y = 0) {
      let localOffset = 0;
      for (let i = 0; i < this.numberOfStrips; i++) {
        const strip = this.strips[i];
        strip.draw(x + localOffset + this.offset, y);
        localOffset += strip.width;
      }
    }
    clone() {
      const clone = new _Ribbon(this.mq, [...this.words]);
      return clone;
    }
  };
  var Row = class {
    constructor(mq, words, direction) {
      this.direction = 1;
      this.mq = mq;
      this.words = words;
      if (direction)
        this.direction = direction;
      this.primaryRibbon = new Ribbon(mq, words);
      this.primaryRibbon.offset = Math.random() * this.primaryRibbon.width * this.direction;
      this.secondaryRibbon = this.primaryRibbon.clone();
      this.direction ? this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon) : this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
    }
    get width() {
      return this.primaryRibbon.width + this.secondaryRibbon.width;
    }
    get height() {
      return this.primaryRibbon.height;
    }
    get acc() {
      return this.primaryRibbon.acc;
    }
    get dec() {
      return this.primaryRibbon.dec;
    }
    update() {
      this.primaryRibbon.update(this.direction);
      this.secondaryRibbon.update(this.direction);
      switch (this.direction) {
        case 1:
          if (this.primaryRibbon.offset >= this.mq.width) {
            this.log("Moving primary ribbon behind");
            this.moveRibbonBehind(this.primaryRibbon, this.secondaryRibbon);
          }
          if (this.secondaryRibbon.offset >= this.mq.width) {
            this.log("Moving secondary ribbon behind");
            this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon);
          }
          break;
        case -1:
          if (this.primaryRibbon.offset <= -this.primaryRibbon.width) {
            this.log("Moving primary ribbon ahead");
            this.moveRibbonAhead(this.primaryRibbon, this.secondaryRibbon);
          }
          if (this.secondaryRibbon.offset <= -this.secondaryRibbon.width) {
            this.log("Moving secondary ribbon ahead");
            this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
          }
          break;
      }
    }
    draw(x = 0, y = 0) {
      this.primaryRibbon.draw(x, y);
      this.secondaryRibbon.draw(x, y);
    }
    moveRibbonBehind(thisRibbon, thatRibbon) {
      thisRibbon.offset = thatRibbon.offset - thisRibbon.width;
    }
    moveRibbonAhead(thisRibbon, thatRibbon) {
      thisRibbon.offset = thatRibbon.offset + thatRibbon.width;
    }
    reset() {
      this.primaryRibbon.offset = 0;
      this.secondaryRibbon.offset = 0;
      this.direction === 1 ? this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon) : this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
    }
    log(...args) {
      log("[MarqueeRow]", ...args);
    }
  };
  Row.scrollSpeed = 1;
  Row.lightColor = "#e9ebea";
  Row.darkColor = "#131313";

  // src/js/scripts/marquee/marquee.ts
  var _MarqueeCanvas = class _MarqueeCanvas {
    constructor(parent, w, h, rows) {
      this.width = 100;
      this.height = 100;
      this.rowCount = 1;
      this.frameCount = 0;
      this.fontSize = 50;
      this.fontFamily = "Syne";
      this.backgroundColor = "transparent";
      this.lineColor = Row.lightColor;
      this.lineWidth = 0.9;
      this.rows = [];
      this.activeWord = "";
      this._words = [];
      this.parent = parent;
      if (w)
        this.width = w;
      if (h)
        this.height = h;
      if (rows)
        this.rowCount = rows;
      this.canvas = _MarqueeCanvas.createHiDPICanvas(this.width, this.height, _MarqueeCanvas.PIXEL_RATIO);
      this.ctx = this.canvas.getContext("2d");
      const lineSize = this.width * this.lineWidth;
      this.lineStart = (this.width - lineSize) / 2;
      this.lineEnd = this.width - this.lineStart;
    }
    set words(words) {
      this.log("Setting words in marquee...");
      this._words = words;
    }
    get words() {
      return this._words;
    }
    get rowSpace() {
      return this.height / this.rowCount;
    }
    get font() {
      return `${this.fontSize}pt ${this.fontFamily}`;
    }
    setup() {
      if (!this.words || this.words.length === 0) {
        throw new Error("No words specified");
      }
      this.rows = [];
      for (let i = 0; i < this.rowCount; i++) {
        const row = new Row(this, this.words, i % 2 === 0 ? 1 : -1);
        this.rows.push(row);
      }
      const testString = this.words.join(" ");
      const testStringDims = this.textDimensions(testString);
      const testH = testStringDims.h;
      this.spacing = this.spacesAround(testH, this.height, this.rowCount, testStringDims.acc);
    }
    update() {
      for (let row of this.rows) {
        row.update();
      }
    }
    draw() {
      this.wipe();
      this.fill(this.backgroundColor);
      for (let i = 0; i < this.rowCount; i++) {
        const row = this.rows[i];
        row.draw(0, this.spacing[i]);
        if (i !== this.rowCount - 1) {
          const topDiff = this.spacing[i + 1] - this.spacing[i];
          const y = this.spacing[i] + (topDiff - row.acc) / 2 + row.dec / 2;
          this.drawHorizontalLine(y);
        }
      }
      this.frameCount++;
    }
    drawFrameCount() {
      this.text(this.frameCount.toString(), 14, 21, "lightgreen", "14pt serif");
    }
    drawHorizontalLine(y) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lineStart, y);
      this.ctx.lineTo(this.lineEnd, y);
      this.ctx.strokeStyle = this.lineColor;
      this.ctx.stroke();
    }
    wipe() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    fill(color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    rect(x, y, w, h, color) {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x, y, w, h);
    }
    text(text, x, y, color, font) {
      if (color)
        this.ctx.fillStyle = color;
      else
        this.ctx.fillStyle = "black";
      if (font)
        this.ctx.font = font;
      else
        this.ctx.font = this.font;
      this.ctx.fillText(text, x, y);
    }
    textDimensions(text, font) {
      if (font)
        this.ctx.font = font;
      else
        this.ctx.font = this.font;
      const measured = this.ctx.measureText(text);
      const w = Math.floor(measured.width);
      const h = Math.floor(measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent);
      const acc = Math.floor(measured.actualBoundingBoxAscent);
      const dec = Math.floor(measured.actualBoundingBoxDescent);
      return { w, h, acc, dec };
    }
    spacesAround(elementHeight, parentHeight, numberOfElements, offset = 0) {
      const totalElementHeight = elementHeight * numberOfElements;
      let remainingSpace = parentHeight - totalElementHeight;
      if (remainingSpace < 0)
        remainingSpace = 0;
      const spaceAround = remainingSpace / (numberOfElements + 1);
      const topPositions = [];
      for (let i = 0; i < numberOfElements; i++) {
        const top = spaceAround * (i + 1) + elementHeight * i + offset;
        topPositions.push(top);
      }
      return topPositions;
    }
    resetRows() {
      for (let row of this.rows) {
        row.reset();
      }
    }
    placeCanvas(x = 0, y = 0) {
      this.canvas.style.position = "absolute";
      this.canvas.style.top = `${y}px`;
      this.canvas.style.left = `${x}px`;
      if (this.parent) {
        this.parent.appendChild(this.canvas);
      }
    }
    static createHiDPICanvas(w, h, ratio) {
      var _a;
      if (!ratio) {
        ratio = _MarqueeCanvas.PIXEL_RATIO;
      }
      let can = document.createElement("canvas");
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      (_a = can.getContext("2d")) == null ? void 0 : _a.setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
    }
    log(...args) {
      log("[MarqueeCanvas]", ...args);
    }
  };
  _MarqueeCanvas.font = "10pt serif";
  _MarqueeCanvas.PIXEL_RATIO = (() => {
    let ctx = document.createElement("canvas").getContext("2d"), dpr = window.devicePixelRatio || 1, bsr = 1;
    if (ctx.webkitBackingStorePixelRatio !== void 0) {
      bsr = ctx.webkitBackingStorePixelRatio;
    } else if (ctx.mozBackingStorePixelRatio !== void 0) {
      bsr = ctx.mozBackingStorePixelRatio;
    } else if (ctx.msBackingStorePixelRatio !== void 0) {
      bsr = ctx.msBackingStorePixelRatio;
    } else if (ctx.oBackingStorePixelRatio !== void 0) {
      bsr = ctx.oBackingStorePixelRatio;
    } else if (ctx.backingStorePixelRatio !== void 0) {
      bsr = ctx.backingStorePixelRatio;
    }
    return dpr / bsr;
  })();
  var MarqueeCanvas = _MarqueeCanvas;

  // src/js/scripts/controllers/projects-marquee-controller.ts
  var ProjectsMarqueeController = class extends BlockController {
    constructor(block) {
      super();
      this.debug = true;
      this.blockClassName = ".wp-block-guten-csek-scrolling-projects-block";
      this.name = "ProjectsMarqueeController";
      this.block = block;
    }
    setup() {
      if (this.invalid(this.block)) {
        this.err("Block not found");
        return;
      } else if (this.block) {
        this.prepCanvas(this.block);
        this.prepObserver(this.block);
        this.isInitialized = true;
      }
    }
    prepCanvas(block, projectNames) {
      const projectsArea = block.querySelector(".projects");
      if (projectsArea) {
        projectsArea.style.display = "none";
      }
      const blockRect = block.getBoundingClientRect();
      const blockWidth = blockRect.width;
      const blockHeight = blockRect.height;
      if (!projectNames)
        this.getProjectsFromBlock();
      else if (projectNames)
        this.projectNames = projectNames;
      Strip.wordSpacing = 64;
      this.marquee = new MarqueeCanvas(block, blockWidth, blockHeight, 3);
      this.marquee.placeCanvas(0, 0);
      this.marquee.separator = "\u2014";
      this.marquee.words = this.projectNames;
      this.marquee.setup();
    }
    prepObserver(block) {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0
      };
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startMarquee();
          } else {
            this.stopMarquee();
          }
        });
      }, observerOptions);
      this.intersectionObserver.observe(block);
    }
    getProjectsFromBlock() {
      var _a;
      const projectsArea = (_a = this.block) == null ? void 0 : _a.querySelector(".projects");
      if (this.invalid(projectsArea)) {
        this.err("Projects area not found");
        return;
      }
      const projects = projectsArea.querySelectorAll(".projects ul li a");
      if (this.invalid(projects)) {
        this.err("Projects not found");
        return;
      }
      const projectNames = [];
      for (let i = 0; i < projects.length; i++) {
        const innerText = projects[i].innerText;
        if (!innerText)
          continue;
        if (!projectNames.includes(innerText))
          projectNames.push(innerText);
      }
      this.projectNames = projectNames;
    }
    startMarquee() {
      this.marqueeInterval = window.setInterval(() => {
        try {
          if (!this.block)
            throw new Error("Block not found");
          this.marquee.activeWord = this.block.getAttribute("data-project") || "";
          this.marquee.update();
          this.marquee.draw();
        } catch (err) {
          this.err(err.message, err.stack);
          this.stopMarquee();
        }
      }, 32);
    }
    stopMarquee() {
      window.clearInterval(this.marqueeInterval);
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/scrolling-projects-controller.ts
  var _ScrollingProjectsBlock = class _ScrollingProjectsBlock {
    constructor(block) {
      this.currentProjectIndex = 0;
      this.updateProjectIntervalId = -1;
      this.fadedOut = false;
      this.block = block;
      this.canvasContainer = block.querySelector(".canvas-container");
      this.projectNameHeading = block.querySelector(".selected-project-name");
      this.blurb = block.querySelector(".project-blurb");
      this.projectImage = block.querySelector(".project-image");
      this.viewProjectButton = block.querySelector(".view-button");
      this.currentProject = {
        name: "Our Projects",
        url: new URL("#not-found", window.location.href),
        imageUrl: new URL("#not-found", window.location.href),
        color: _ScrollingProjectsBlock.defaultColor
      };
      this.marqueeController = new ProjectsMarqueeController(this.canvasContainer);
    }
    get blockElements() {
      return {
        block: this.block,
        canvasContainer: this.canvasContainer,
        projectNameHeading: this.projectNameHeading,
        blurb: this.blurb,
        projectImage: this.projectImage,
        viewProjectButton: this.viewProjectButton
      };
    }
    setup() {
      this.prepObserver();
      this.gatherProjectData();
      this.precalculateColors();
      this.shuffleProjectOrder();
      this.update();
      this.marqueeController.setup();
    }
    prepObserver() {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0
      };
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.log("Starting scrolling projects block");
            this.start();
          } else {
            this.log("Stopping scrolling projects block");
            this.stop();
          }
        });
      }, observerOptions);
      this.observer.observe(this.block);
    }
    gatherProjectData() {
      var _a;
      const allProjects = this.block.querySelectorAll(".project-ribbon ul li");
      if (!allProjects) {
        this.projectData = [];
        return;
      }
      const seenProjects = [];
      const projectData = [];
      for (let i = 0; i < allProjects.length; i++) {
        const project = allProjects[i];
        if (!project)
          continue;
        const link = project.querySelector("a");
        if (!link)
          continue;
        const imageSrc = (_a = project.querySelector("img")) == null ? void 0 : _a.src;
        if (!imageSrc)
          continue;
        const name = link.innerHTML;
        if (seenProjects.includes(name))
          continue;
        seenProjects.push(name);
        const url = new URL(link.href);
        const imageUrl = new URL(imageSrc);
        projectData.push({ name, url, imageUrl, color: _ScrollingProjectsBlock.defaultColor });
      }
      this.projectData = projectData;
    }
    precalculateColors() {
      return __async(this, null, function* () {
        if (!this.projectData) {
          return;
        }
        for (const project of this.projectData) {
          try {
            const imageColor = yield getImageColor(project.imageUrl.href);
            project.color = imageColor;
          } catch (err) {
            console.error("Error:", err);
          }
        }
      });
    }
    shuffleProjectOrder() {
      const shuffled = [];
      const used = /* @__PURE__ */ new Set();
      while (shuffled.length < this.projectData.length) {
        const index = Math.floor(Math.random() * this.projectData.length);
        if (!used.has(index)) {
          used.add(index);
          shuffled.push(index);
        }
      }
      this.randomProjectOrder = shuffled;
    }
    updateCurrentProject() {
      if (!this.projectData)
        return;
      const index = this.randomProjectOrder[this.currentProjectIndex];
      const project = this.projectData[index];
      this.currentProject = project;
    }
    nextProject() {
      this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projectData.length;
      this.updateCurrentProject();
    }
    previousProject() {
      this.currentProjectIndex = (this.currentProjectIndex - 1) % this.projectData.length;
      this.updateCurrentProject();
    }
    update() {
      this.updateCurrentProject();
      this.fadeOut();
      this.projectImage.addEventListener("transitionend", () => {
        this.updateShowcasedElements();
        this.fadeIn();
      });
    }
    updateShowcasedElements() {
      var _a;
      this.canvasContainer.setAttribute("data-project", this.currentProject.name);
      this.projectNameHeading.innerHTML = this.currentProject.name;
      this.blurb.style.setProperty("--project-blurb-color", this.currentProject.color);
      this.projectImage.src = this.currentProject.imageUrl.href;
      (_a = this.viewProjectButton.querySelector("a")) == null ? void 0 : _a.setAttribute("href", this.currentProject.url.href);
    }
    fadeOutProjectImage() {
      this.projectImage.style.opacity = "0";
    }
    fadeInProjectImage() {
      this.projectImage.style.opacity = "1";
    }
    fadeOut() {
      this.fadeOutProjectImage();
      this.projectNameHeading.style.opacity = "0";
      this.fadedOut = true;
    }
    fadeIn() {
      this.fadeInProjectImage();
      this.projectNameHeading.style.opacity = "1";
      this.fadedOut = false;
    }
    start() {
      this.updateProjectIntervalId = window.setInterval(() => {
        this.nextProject();
        this.update();
      }, _ScrollingProjectsBlock.nextProjectDelayMs);
    }
    stop() {
      window.clearInterval(this.updateProjectIntervalId);
    }
    log(...args) {
      log(`[${this.constructor.name}]`, ...args);
    }
  };
  _ScrollingProjectsBlock.nextProjectDelayMs = 1e4;
  _ScrollingProjectsBlock.retryColorDelayMs = 250;
  _ScrollingProjectsBlock.defaultColor = "#e9ebea";
  var ScrollingProjectsBlock = _ScrollingProjectsBlock;
  var ScrollingProjectsController = class extends BlockController {
    constructor(scrollingProjectsBlockClassName) {
      super();
      this.debug = true;
      this.projectsBlocks = [];
      this.name = "ScrollingProjectsController";
      if (!scrollingProjectsBlockClassName)
        throw new Error("Scrolling projects block class name not provided");
      else if (scrollingProjectsBlockClassName[0] === ".")
        scrollingProjectsBlockClassName = scrollingProjectsBlockClassName.slice(1);
      this.scrollingProjectsBlockClassName = scrollingProjectsBlockClassName;
    }
    setup() {
      this.blocks = document.querySelectorAll("." + this.scrollingProjectsBlockClassName);
      if (this.invalid(this.blocks.length)) {
        this.log("No scrolling projects block found.");
        return;
      }
      this.log(`Found ${this.blocks.length} scrolling projects blocks.`);
      this.blocks.forEach((block, i) => {
        if (!block)
          return;
        const scrollingProjectsBlock = new ScrollingProjectsBlock(block);
        scrollingProjectsBlock.setup();
        this.projectsBlocks[i] = scrollingProjectsBlock;
      });
      this.isInitialized = true;
    }
    onMouseMove(e, blockIndex) {
      const scrollingProjectsBlock = this.projectsBlocks[blockIndex];
      if (!scrollingProjectsBlock)
        return;
      const { block, viewProjectButton } = scrollingProjectsBlock.blockElements;
      const blockRect = block.getBoundingClientRect();
      const buttonRect = viewProjectButton.getBoundingClientRect();
      const buttonHalfWidth = buttonRect.width / 2;
      const buttonHalfHeight = buttonRect.height / 2;
      const x = e.clientX;
      const y = e.clientY;
      if (x < blockRect.left || x > blockRect.right || y < blockRect.top || y > blockRect.bottom)
        return;
      const newX = x - blockRect.left;
      const newY = y - blockRect.top;
      viewProjectButton.style.left = `${newX}px`;
      viewProjectButton.style.top = `${newY}px`;
      if (newX < buttonHalfWidth)
        viewProjectButton.style.left = `${buttonHalfWidth}px`;
      else if (newX > blockRect.width - buttonHalfWidth)
        viewProjectButton.style.left = `${blockRect.width - buttonHalfWidth}px`;
      if (newY < buttonHalfHeight)
        viewProjectButton.style.top = `${buttonHalfHeight}px`;
      else if (newY > blockRect.height - buttonHalfHeight)
        viewProjectButton.style.top = `${blockRect.height - buttonHalfHeight}px`;
    }
  };

  // src/js/scripts/curtainify.ts
  log("Curtainify.js");
  var insertAfter = (newNode, referenceNode) => {
    if (!referenceNode.parentNode)
      return;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };
  var makeIntoLeftCurtain = (elmt) => {
    const leftCurtain = document.createElement("div");
    const leftCurtainContent = elmt.cloneNode(true);
    leftCurtain.classList.add("left-curtain");
    leftCurtain.appendChild(leftCurtainContent);
    return leftCurtain;
  };
  var makeIntoRightCurtain = (elmt) => {
    const rightCurtain = document.createElement("div");
    const rightCurtainContent = elmt.cloneNode(true);
    rightCurtain.classList.add("right-curtain");
    rightCurtain.appendChild(rightCurtainContent);
    return rightCurtain;
  };
  var curtainify = (contentReel, contentReelItems) => {
    contentReel.innerHTML = "";
    contentReelItems.forEach((item, index) => {
      const left = makeIntoLeftCurtain(item);
      const right = makeIntoRightCurtain(item);
      const zIndex = contentReelItems.length - index;
      const leftVideo = left.querySelector("video");
      const rightVideo = right.querySelector("video");
      const threshold = 0.1;
      if (leftVideo && rightVideo) {
        leftVideo.addEventListener("timeupdate", () => {
          if (Math.abs(leftVideo.currentTime - rightVideo.currentTime) > threshold)
            rightVideo.currentTime = leftVideo.currentTime;
        });
        rightVideo.addEventListener("timeupdate", () => {
          if (Math.abs(rightVideo.currentTime - leftVideo.currentTime) > threshold)
            leftVideo.currentTime = rightVideo.currentTime;
        });
      }
      left.style.zIndex = zIndex.toString();
      right.style.zIndex = zIndex.toString();
      contentReel.appendChild(left);
      contentReel.appendChild(right);
    });
  };
  var prepareCurtainElements = () => {
    const contentReel = document.querySelector(".curtain-reel");
    const contentReelItems = document.querySelectorAll(".curtain");
    if (!contentReel)
      return;
    curtainify(contentReel, contentReelItems);
    const contentReelContents = document.querySelectorAll(".curtain-reel > *");
    const heights = [];
    for (let i = 0; i < contentReelContents.length; i++) {
      heights.push(contentReelContents[i].getBoundingClientRect().height);
    }
    const contentReelHeight = heights.reduce((partialSum, a) => partialSum + a, 0) / 2;
    const contentReelFirstChild = contentReel.firstChild;
    if (!contentReelFirstChild)
      return;
    const contentReelFirstChildRect = contentReelFirstChild.getBoundingClientRect();
    const contentReelTop = contentReelFirstChildRect.top;
    const contentReelBottom = contentReelFirstChildRect.bottom;
    const contentReelScrollMass = document.createElement("div");
    contentReelScrollMass.setAttribute("id", "curtain-reel-scroll-mass");
    contentReelScrollMass.classList.add("guten-csek-block");
    contentReelScrollMass.style.zIndex = "-1";
    contentReelScrollMass.style.height = `${contentReelHeight}px`;
    contentReelScrollMass.style.backgroundColor = "#131313";
    insertAfter(contentReelScrollMass, contentReel);
    if (window.scrollY > contentReelTop) {
      window.scrollTo(0, window.scrollY - contentReelHeight);
    }
    const leftCurtains = document.querySelectorAll(".left-curtain");
    const rightCurtains = document.querySelectorAll(".right-curtain");
    const shadowBlock = document.createElement("div");
    shadowBlock.classList.add("shadow-block");
    shadowBlock.style.zIndex = (contentReelContents.length + 1).toString();
    contentReel.appendChild(shadowBlock);
    const splitCurtains = (index = 0) => {
      const scrollPosition = window.scrollY;
      const scrollPositionFromTop = scrollPosition - contentReelTop - window.innerHeight * index;
      const scrollPercentage = Math.floor(constrain(scrollPositionFromTop / window.innerHeight, 0, 1) * 100) / 100;
      if (index < leftCurtains.length - 1) {
        const previousLeft = leftCurtains[index + 1];
        const previousRight = rightCurtains[index + 1];
        const zHeight = map(scrollPercentage, 0, 1, -0.125, 0);
        previousLeft.style.transform = `translateZ(${zHeight}rem)`;
        previousRight.style.transform = `translateZ(${zHeight}rem)`;
        const contentBlock = previousLeft.querySelector(".content-block");
        if (contentBlock) {
          const color = window.getComputedStyle(contentBlock).getPropertyValue("background-color");
          const scrollMass = document.getElementById("curtain-reel-scroll-mass");
          if (scrollMass) {
            scrollMass.style.backgroundColor = color;
          }
        }
      }
      const left = leftCurtains[index];
      const right = rightCurtains[index];
      left.style.transform = `translateX(-${scrollPercentage * 100}%)`;
      right.style.transform = `translateX(${scrollPercentage * 100}%)`;
      shadowBlock.style.width = `${scrollPercentage * 100}%`;
      shadowBlock.style.background = `radial-gradient(transparent 40%, rgba(0,0,0,${map(
        scrollPercentage,
        0,
        1,
        0.5,
        0
      )}) 98%)`;
      return scrollPercentage;
    };
    let lastScroll = window.scrollY;
    let currentIndex = constrain(
      Math.floor((lastScroll - contentReelTop) / contentReelHeight * (contentReelContents.length / 2)),
      0,
      contentReelContents.length / 2 - 1
    );
    const adjustBasedOnScroll = (scroll) => {
      const scrollDirection = Math.floor(constrain(window.scrollY - lastScroll, -1, 1));
      lastScroll = window.scrollY;
      if (scroll === 1 && scrollDirection === 1) {
        currentIndex++;
      } else if (scroll === 0 && scrollDirection === -1) {
        currentIndex--;
      }
      currentIndex = constrain(currentIndex, 0, leftCurtains.length - 1);
      if (currentIndex === leftCurtains.length) {
        shadowBlock.style.visibility = "hidden";
      }
    };
    window.addEventListener("scroll", (e) => {
      const scroll = splitCurtains(currentIndex);
      adjustBasedOnScroll(scroll);
    });
    const initializeTranslations = (currentIndex2) => {
      for (let i = 0; i < currentIndex2; i++) {
        const left = leftCurtains[i];
        const right = rightCurtains[i];
        left.style.transform = `translateX(-100%)`;
        right.style.transform = `translateX(100%)`;
      }
    };
    const scrollInitital = splitCurtains(currentIndex);
    adjustBasedOnScroll(scrollInitital);
    initializeTranslations(currentIndex);
  };

  // src/js/scripts/controllers/curtainify-controller.ts
  var CurtainifyController = class extends BlockController {
    constructor() {
      super();
      this.name = "CurtainifyController";
    }
    setup() {
      prepareCurtainElements();
      this.isInitialized = true;
    }
    beforeReload() {
      window.scrollTo(0, 0);
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/team-controller.ts
  var TeamController = class _TeamController extends BlockController {
    constructor(className) {
      super();
      this.debug = true;
      this.headshotOffsetPx = 256;
      this.name = "TeamController";
      this.blockClassName = className != null ? className : ".wp-block-guten-csek-team-block";
    }
    setup() {
      var _a;
      this.block = document.querySelector(this.blockClassName);
      if (this.invalid(this.block)) {
        this.err("No block found");
        return;
      }
      this.headshots = (_a = this.block) == null ? void 0 : _a.querySelectorAll(".headshot");
      if (this.invalid(this.headshots.length)) {
        this.err("No headshots found");
        return;
      }
      this.setupHeadshots();
      this.isInitialized = true;
    }
    setupHeadshots() {
      if (_TeamController.isMobile)
        return;
      this.headshots.forEach((headshot) => {
        const diameter = parseInt(getComputedStyle(headshot).width);
        this.updateHeadshotOffset(headshot, this.headshotOffsetPx);
      });
    }
    scroll() {
      var _a, _b, _c, _d;
      if (_TeamController.isMobile)
        return;
      const blockRect = (_a = this.block) == null ? void 0 : _a.getBoundingClientRect();
      const blockTop = (_b = blockRect == null ? void 0 : blockRect.top) != null ? _b : 0;
      const blockBottom = (_c = blockRect == null ? void 0 : blockRect.bottom) != null ? _c : 0;
      const blockHeight = (_d = blockRect == null ? void 0 : blockRect.height) != null ? _d : 0;
      if (blockTop < window.innerHeight && blockBottom > 0) {
        this.headshots.forEach((headshot) => {
          const posY = map(
            blockTop,
            window.innerHeight,
            -blockHeight,
            this.headshotOffsetPx,
            -this.headshotOffsetPx
          );
          this.updateHeadshotOffset(headshot, posY);
        });
      }
    }
    updateHeadshotOffset(headshot, posY) {
      const diameter = headshot.clientWidth;
      const speed = (diameter - 32) / 500;
      headshot.style.transform = `translateY(${posY * speed}px)`;
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/next-project-controller.ts
  var NextProjectController = class extends BlockController {
    constructor(nextProjectBlockClassName) {
      super();
      this.name = "NextProjectController";
      if (!nextProjectBlockClassName)
        throw new Error("NextProjectController: nextProjectBlockClassName is undefined");
      this.blockClassname = nextProjectBlockClassName;
    }
    setup() {
      this.blocks = document.querySelectorAll(this.blockClassname);
      if (this.invalid(this.blocks.length > 0)) {
        this.log("No next project blocks found");
        return;
      }
      this.blocks.forEach((block, index) => {
        this.log(`Prepping NextProjectBlock ${index}...`);
        const image = block.querySelector("div > div.next-project-image > img");
        const imageBacking = block.querySelector(".image-backing");
        if (this.invalid(image)) {
          this.log("No image found");
          return;
        }
        if (image && imageBacking) {
          this.updateImageBacking(image, imageBacking);
        } else {
          this.log("No image or image backing found");
        }
      });
      this.isInitialized = true;
    }
    updateImageBacking(image, imageBacking) {
      this.log("Updating image backing...");
      getImageColor(image.src).then((color) => {
        imageBacking.style.backgroundColor = color;
      });
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/featured-video-controller.ts
  var FeaturedVideoController = class extends BlockController {
    constructor(blockClassName) {
      super();
      this.name = "FeaturedVideoController";
      if (!blockClassName)
        throw new Error("FeaturedVideoController: blockClassName is undefined");
      this.blockClassName = blockClassName;
    }
    setup() {
      var _a, _b, _c;
      this.debug = true;
      this.block = document.querySelector(this.blockClassName);
      if (this.invalid(this.block)) {
        this.log("No featured video block found:", this.blockClassName);
        return;
      }
      this.videoShade = (_a = this.block) == null ? void 0 : _a.querySelector(".video-container .video-shade");
      this.videoPlayer = (_b = this.block) == null ? void 0 : _b.querySelector(".video-container video");
      this.playButton = (_c = this.block) == null ? void 0 : _c.querySelector(".video-container .playbutton");
      this.debug = true;
      if (!this.videoShade) {
        this.log("No video shade found");
        this.isInitialized = true;
        return;
      }
      if (!this.videoPlayer) {
        this.log("No video player found");
        this.isInitialized = true;
        return;
      }
      if (!this.playButton) {
        this.log("No play button found");
        this.isInitialized = true;
        return;
      }
      this.addEventListeners();
      this.isInitialized = true;
    }
    addEventListeners() {
      this.log("Adding event listeners...");
      this.playButton.addEventListener("click", () => {
        this.hideShade();
        this.hidePlayButton();
        this.playVideo();
      });
      this.videoPlayer.addEventListener("pause", () => {
        this.showShade();
        this.showPlayButton();
        this.videoPlayer.controls = false;
      });
    }
    playVideo() {
      this.log("Clicked play!");
      this.videoPlayer.controls = true;
      this.videoPlayer.play();
    }
    hideShade() {
      this.videoShade.style.opacity = "0";
    }
    hidePlayButton() {
      this.playButton.style.display = "none";
    }
    showShade() {
      this.videoShade.style.opacity = "1";
    }
    showPlayButton() {
      this.playButton.style.display = "flex";
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/staff-profiles-controller.ts
  var StaffProfilesController = class extends BlockController {
    constructor(blockClassName) {
      super();
      this.name = "StaffProfilesController";
      if (!blockClassName)
        throw new Error("FeaturedVideoController: blockClassName is undefined");
      this.blockClassName = blockClassName;
    }
    setup() {
      var _a;
      this.block = document.querySelector(this.blockClassName);
      if (this.invalid(this.block)) {
        this.log("No staff profiles block found:", this.blockClassName);
        return;
      }
      this.staffSummaries = (_a = this.block) == null ? void 0 : _a.querySelectorAll(".staff-summary");
      this.addEventListeners();
      this.isInitialized = true;
    }
    addEventListeners() {
      var _a;
      (_a = this.staffSummaries) == null ? void 0 : _a.forEach((staffSummary) => {
        const innerStaffProfile = staffSummary.querySelector(".staff-profile");
        const closeButton = innerStaffProfile == null ? void 0 : innerStaffProfile.querySelector(".close-button");
        closeButton == null ? void 0 : closeButton.addEventListener("click", (event) => {
          event.stopPropagation();
          if (innerStaffProfile) {
            innerStaffProfile.classList.remove("opened");
          }
        });
        staffSummary.addEventListener("click", () => {
          if (innerStaffProfile && !innerStaffProfile.classList.contains("opened")) {
            innerStaffProfile.classList.add("opened");
          }
        });
      });
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/scripts/controllers/cycling-stack-controller.ts
  var _CyclingStackController = class _CyclingStackController extends BlockController {
    constructor() {
      super();
      this.name = "CyclingStackController";
    }
    setup() {
      this.debug = true;
      this.blocks = document.querySelectorAll("." + _CyclingStackController.blockClassName);
      this.blocks.forEach((cyclingStack) => {
        const wordsList = cyclingStack.querySelector(".words-list");
        const words = cyclingStack.querySelectorAll(".cycling-word");
        if (!(wordsList == null ? void 0 : wordsList.hasAttribute("data-current-index"))) {
          wordsList.setAttribute("data-current-index", "0");
        }
        const currentIndex = Number(wordsList == null ? void 0 : wordsList.getAttribute("data-current-index"));
        this.log("Setting up cycling stack. Current index:", currentIndex);
        this.log("Words:", words);
        words[currentIndex].style.animation = `csekSlideAndFadeIn ${_CyclingStackController.animationDurationMS}ms`;
      });
      this.start();
      this.isInitialized = true;
    }
    revolve(wordsList) {
      const words = wordsList.querySelectorAll(".cycling-word");
      const currentIndex = Number(wordsList.getAttribute("data-current-index"));
      words[currentIndex].style.animation = "";
      words[currentIndex].style.opacity = "0";
      const nextIndex = (Number(currentIndex) + 1) % words.length;
      words[nextIndex].style.animation = `csekSlideAndFadeIn ${_CyclingStackController.animationDurationMS}ms`;
      wordsList.setAttribute("data-current-index", nextIndex.toString());
    }
    start() {
      this.blocks.forEach((cyclingStack) => {
        const wordsList = cyclingStack.querySelector(".words-list");
        setInterval(() => {
          this.revolve(wordsList);
        }, _CyclingStackController.animationDurationMS);
      });
    }
    onMouseMove(e, blockIndex) {
    }
  };
  _CyclingStackController.blockClassName = "cycling-stack";
  _CyclingStackController.animationDurationMS = 2500;
  var CyclingStackController = _CyclingStackController;

  // src/js/scripts/image.ts
  var _CsekImage = class _CsekImage {
    constructor(id, type = "image", alt) {
      this.id = id;
      this.type = type;
      if (alt) {
        this.alt = alt;
      }
      this.preload();
    }
    preload() {
      return __async(this, null, function* () {
        try {
          const data = yield getMediaById(this.id);
          if (!this.alt)
            this.alt = data.alt_text;
          if (this.type === "video") {
            this._url = data.source_url;
            return;
          }
          const details = data.media_details;
          const foundSizes = details.sizes;
          if (Object.keys(foundSizes).length === 0) {
            this.sizes = {
              thumbnail: {
                file: details.file,
                source_url: data.source_url,
                width: details.width,
                height: details.height,
                filesize: details.filesize,
                mime_type: data.mime_type
              }
            };
            return;
          }
          this.sizes = foundSizes;
        } catch (err) {
          error(`[CsekImage] Error: ${err}`);
        }
      });
    }
    doubleCheckSizes() {
      return __async(this, null, function* () {
        if (!this.sizes) {
          yield this.preload();
        }
      });
    }
    getSize(size, fallbackSize) {
      if (this.sizes && this.sizes[size]) {
        return this.sizes[size].source_url;
      }
      if (fallbackSize && this.sizes && this.sizes[fallbackSize]) {
        return this.sizes[fallbackSize].source_url;
      }
      const index = _CsekImage.SIZE_ORDER.indexOf(size);
      if (index < 0 || index === _CsekImage.SIZE_ORDER.length - 1) {
        return this.sizes ? this.sizes.full.source_url : "";
      } else {
        return this.getSize(_CsekImage.SIZE_ORDER[index + 1]);
      }
    }
    get url() {
      switch (this.type) {
        case "image":
          return this.full;
        case "video":
          return this._url;
      }
    }
    get thumbnail() {
      return this.getSize("thumbnail");
    }
    get medium() {
      return this.getSize("medium");
    }
    get large() {
      return this.getSize("large");
    }
    get full() {
      return this.getSize("full");
    }
    get altText() {
      return this.alt;
    }
  };
  _CsekImage.SIZE_ORDER = ["large", "medium", "thumbnail", "full"];
  var CsekImage = _CsekImage;

  // node_modules/memize/dist/index.js
  function memize(fn, options) {
    var size = 0;
    var head;
    var tail;
    options = options || {};
    function memoized() {
      var node = head, len = arguments.length, args, i;
      searchCache:
        while (node) {
          if (node.args.length !== arguments.length) {
            node = node.next;
            continue;
          }
          for (i = 0; i < len; i++) {
            if (node.args[i] !== arguments[i]) {
              node = node.next;
              continue searchCache;
            }
          }
          if (node !== head) {
            if (node === tail) {
              tail = node.prev;
            }
            node.prev.next = node.next;
            if (node.next) {
              node.next.prev = node.prev;
            }
            node.next = head;
            node.prev = null;
            head.prev = node;
            head = node;
          }
          return node.val;
        }
      args = new Array(len);
      for (i = 0; i < len; i++) {
        args[i] = arguments[i];
      }
      node = {
        args,
        // Generate the result from original function
        val: fn.apply(null, args)
      };
      if (head) {
        head.prev = node;
        node.next = head;
      } else {
        tail = node;
      }
      if (size === /** @type {MemizeOptions} */
      options.maxSize) {
        tail = /** @type {MemizeCacheNode} */
        tail.prev;
        tail.next = null;
      } else {
        size++;
      }
      head = node;
      return node.val;
    }
    memoized.clear = function() {
      head = null;
      tail = null;
      size = 0;
    };
    return memoized;
  }

  // node_modules/@wordpress/i18n/build-module/sprintf.js
  var import_sprintf_js = __toESM(require_sprintf());
  var logErrorOnce = memize(console.error);

  // node_modules/@tannin/postfix/index.js
  var PRECEDENCE;
  var OPENERS;
  var TERMINATORS;
  var PATTERN;
  PRECEDENCE = {
    "(": 9,
    "!": 8,
    "*": 7,
    "/": 7,
    "%": 7,
    "+": 6,
    "-": 6,
    "<": 5,
    "<=": 5,
    ">": 5,
    ">=": 5,
    "==": 4,
    "!=": 4,
    "&&": 3,
    "||": 2,
    "?": 1,
    "?:": 1
  };
  OPENERS = ["(", "?"];
  TERMINATORS = {
    ")": ["("],
    ":": ["?", "?:"]
  };
  PATTERN = /<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;
  function postfix(expression) {
    var terms = [], stack = [], match, operator, term, element;
    while (match = expression.match(PATTERN)) {
      operator = match[0];
      term = expression.substr(0, match.index).trim();
      if (term) {
        terms.push(term);
      }
      while (element = stack.pop()) {
        if (TERMINATORS[operator]) {
          if (TERMINATORS[operator][0] === element) {
            operator = TERMINATORS[operator][1] || operator;
            break;
          }
        } else if (OPENERS.indexOf(element) >= 0 || PRECEDENCE[element] < PRECEDENCE[operator]) {
          stack.push(element);
          break;
        }
        terms.push(element);
      }
      if (!TERMINATORS[operator]) {
        stack.push(operator);
      }
      expression = expression.substr(match.index + operator.length);
    }
    expression = expression.trim();
    if (expression) {
      terms.push(expression);
    }
    return terms.concat(stack.reverse());
  }

  // node_modules/@tannin/evaluate/index.js
  var OPERATORS = {
    "!": function(a) {
      return !a;
    },
    "*": function(a, b) {
      return a * b;
    },
    "/": function(a, b) {
      return a / b;
    },
    "%": function(a, b) {
      return a % b;
    },
    "+": function(a, b) {
      return a + b;
    },
    "-": function(a, b) {
      return a - b;
    },
    "<": function(a, b) {
      return a < b;
    },
    "<=": function(a, b) {
      return a <= b;
    },
    ">": function(a, b) {
      return a > b;
    },
    ">=": function(a, b) {
      return a >= b;
    },
    "==": function(a, b) {
      return a === b;
    },
    "!=": function(a, b) {
      return a !== b;
    },
    "&&": function(a, b) {
      return a && b;
    },
    "||": function(a, b) {
      return a || b;
    },
    "?:": function(a, b, c) {
      if (a) {
        throw b;
      }
      return c;
    }
  };
  function evaluate(postfix2, variables) {
    var stack = [], i, j, args, getOperatorResult, term, value;
    for (i = 0; i < postfix2.length; i++) {
      term = postfix2[i];
      getOperatorResult = OPERATORS[term];
      if (getOperatorResult) {
        j = getOperatorResult.length;
        args = Array(j);
        while (j--) {
          args[j] = stack.pop();
        }
        try {
          value = getOperatorResult.apply(null, args);
        } catch (earlyReturn) {
          return earlyReturn;
        }
      } else if (variables.hasOwnProperty(term)) {
        value = variables[term];
      } else {
        value = +term;
      }
      stack.push(value);
    }
    return stack[0];
  }

  // node_modules/@tannin/compile/index.js
  function compile(expression) {
    var terms = postfix(expression);
    return function(variables) {
      return evaluate(terms, variables);
    };
  }

  // node_modules/@tannin/plural-forms/index.js
  function pluralForms(expression) {
    var evaluate2 = compile(expression);
    return function(n) {
      return +evaluate2({ n });
    };
  }

  // node_modules/tannin/index.js
  var DEFAULT_OPTIONS = {
    contextDelimiter: "",
    onMissingKey: null
  };
  function getPluralExpression(pf) {
    var parts, i, part;
    parts = pf.split(";");
    for (i = 0; i < parts.length; i++) {
      part = parts[i].trim();
      if (part.indexOf("plural=") === 0) {
        return part.substr(7);
      }
    }
  }
  function Tannin(data, options) {
    var key;
    this.data = data;
    this.pluralForms = {};
    this.options = {};
    for (key in DEFAULT_OPTIONS) {
      this.options[key] = options !== void 0 && key in options ? options[key] : DEFAULT_OPTIONS[key];
    }
  }
  Tannin.prototype.getPluralForm = function(domain, n) {
    var getPluralForm = this.pluralForms[domain], config, plural, pf;
    if (!getPluralForm) {
      config = this.data[domain][""];
      pf = config["Plural-Forms"] || config["plural-forms"] || // Ignore reason: As known, there's no way to document the empty
      // string property on a key to guarantee this as metadata.
      // @ts-ignore
      config.plural_forms;
      if (typeof pf !== "function") {
        plural = getPluralExpression(
          config["Plural-Forms"] || config["plural-forms"] || // Ignore reason: As known, there's no way to document the empty
          // string property on a key to guarantee this as metadata.
          // @ts-ignore
          config.plural_forms
        );
        pf = pluralForms(plural);
      }
      getPluralForm = this.pluralForms[domain] = pf;
    }
    return getPluralForm(n);
  };
  Tannin.prototype.dcnpgettext = function(domain, context, singular, plural, n) {
    var index, key, entry;
    if (n === void 0) {
      index = 0;
    } else {
      index = this.getPluralForm(domain, n);
    }
    key = singular;
    if (context) {
      key = context + this.options.contextDelimiter + singular;
    }
    entry = this.data[domain][key];
    if (entry && entry[index]) {
      return entry[index];
    }
    if (this.options.onMissingKey) {
      this.options.onMissingKey(singular, domain);
    }
    return index === 0 ? singular : plural;
  };

  // node_modules/@wordpress/i18n/build-module/create-i18n.js
  var DEFAULT_LOCALE_DATA = {
    "": {
      /** @param {number} n */
      plural_forms(n) {
        return n === 1 ? 0 : 1;
      }
    }
  };
  var I18N_HOOK_REGEXP = /^i18n\.(n?gettext|has_translation)(_|$)/;
  var createI18n = (initialData, initialDomain, hooks) => {
    const tannin = new Tannin({});
    const listeners = /* @__PURE__ */ new Set();
    const notifyListeners = () => {
      listeners.forEach((listener) => listener());
    };
    const subscribe4 = (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    };
    const getLocaleData2 = (domain = "default") => tannin.data[domain];
    const doSetLocaleData = (data, domain = "default") => {
      var _a;
      tannin.data[domain] = __spreadValues(__spreadValues({}, tannin.data[domain]), data);
      tannin.data[domain][""] = __spreadValues(__spreadValues({}, DEFAULT_LOCALE_DATA[""]), (_a = tannin.data[domain]) == null ? void 0 : _a[""]);
      delete tannin.pluralForms[domain];
    };
    const setLocaleData2 = (data, domain) => {
      doSetLocaleData(data, domain);
      notifyListeners();
    };
    const addLocaleData = (data, domain = "default") => {
      var _a;
      tannin.data[domain] = __spreadProps(__spreadValues(__spreadValues({}, tannin.data[domain]), data), {
        // Populate default domain configuration (supported locale date which omits
        // a plural forms expression).
        "": __spreadValues(__spreadValues(__spreadValues({}, DEFAULT_LOCALE_DATA[""]), (_a = tannin.data[domain]) == null ? void 0 : _a[""]), data == null ? void 0 : data[""])
      });
      delete tannin.pluralForms[domain];
      notifyListeners();
    };
    const resetLocaleData2 = (data, domain) => {
      tannin.data = {};
      tannin.pluralForms = {};
      setLocaleData2(data, domain);
    };
    const dcnpgettext = (domain = "default", context, single, plural, number) => {
      if (!tannin.data[domain]) {
        doSetLocaleData(void 0, domain);
      }
      return tannin.dcnpgettext(domain, context, single, plural, number);
    };
    const getFilterDomain = (domain = "default") => domain;
    const __2 = (text, domain) => {
      let translation = dcnpgettext(domain, void 0, text);
      if (!hooks) {
        return translation;
      }
      translation = /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.gettext", translation, text, domain);
      return (
        /** @type {string} */
        /** @type {*} */
        hooks.applyFilters("i18n.gettext_" + getFilterDomain(domain), translation, text, domain)
      );
    };
    const _x2 = (text, context, domain) => {
      let translation = dcnpgettext(domain, context, text);
      if (!hooks) {
        return translation;
      }
      translation = /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.gettext_with_context", translation, text, context, domain);
      return (
        /** @type {string} */
        /** @type {*} */
        hooks.applyFilters("i18n.gettext_with_context_" + getFilterDomain(domain), translation, text, context, domain)
      );
    };
    const _n2 = (single, plural, number, domain) => {
      let translation = dcnpgettext(domain, void 0, single, plural, number);
      if (!hooks) {
        return translation;
      }
      translation = /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.ngettext", translation, single, plural, number, domain);
      return (
        /** @type {string} */
        /** @type {*} */
        hooks.applyFilters("i18n.ngettext_" + getFilterDomain(domain), translation, single, plural, number, domain)
      );
    };
    const _nx2 = (single, plural, number, context, domain) => {
      let translation = dcnpgettext(domain, context, single, plural, number);
      if (!hooks) {
        return translation;
      }
      translation = /** @type {string} */
      /** @type {*} */
      hooks.applyFilters("i18n.ngettext_with_context", translation, single, plural, number, context, domain);
      return (
        /** @type {string} */
        /** @type {*} */
        hooks.applyFilters("i18n.ngettext_with_context_" + getFilterDomain(domain), translation, single, plural, number, context, domain)
      );
    };
    const isRTL2 = () => {
      return "rtl" === _x2("ltr", "text direction");
    };
    const hasTranslation2 = (single, context, domain) => {
      var _a, _b;
      const key = context ? context + "" + single : single;
      let result = !!((_b = (_a = tannin.data) == null ? void 0 : _a[domain !== null && domain !== void 0 ? domain : "default"]) == null ? void 0 : _b[key]);
      if (hooks) {
        result = /** @type { boolean } */
        /** @type {*} */
        hooks.applyFilters("i18n.has_translation", result, single, context, domain);
        result = /** @type { boolean } */
        /** @type {*} */
        hooks.applyFilters("i18n.has_translation_" + getFilterDomain(domain), result, single, context, domain);
      }
      return result;
    };
    if (initialData) {
      setLocaleData2(initialData, initialDomain);
    }
    if (hooks) {
      const onHookAddedOrRemoved = (hookName) => {
        if (I18N_HOOK_REGEXP.test(hookName)) {
          notifyListeners();
        }
      };
      hooks.addAction("hookAdded", "core/i18n", onHookAddedOrRemoved);
      hooks.addAction("hookRemoved", "core/i18n", onHookAddedOrRemoved);
    }
    return {
      getLocaleData: getLocaleData2,
      setLocaleData: setLocaleData2,
      addLocaleData,
      resetLocaleData: resetLocaleData2,
      subscribe: subscribe4,
      __: __2,
      _x: _x2,
      _n: _n2,
      _nx: _nx2,
      isRTL: isRTL2,
      hasTranslation: hasTranslation2
    };
  };

  // node_modules/@wordpress/hooks/build-module/validateNamespace.js
  function validateNamespace(namespace) {
    if ("string" !== typeof namespace || "" === namespace) {
      console.error("The namespace must be a non-empty string.");
      return false;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
      console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.");
      return false;
    }
    return true;
  }
  var validateNamespace_default = validateNamespace;

  // node_modules/@wordpress/hooks/build-module/validateHookName.js
  function validateHookName(hookName) {
    if ("string" !== typeof hookName || "" === hookName) {
      console.error("The hook name must be a non-empty string.");
      return false;
    }
    if (/^__/.test(hookName)) {
      console.error("The hook name cannot begin with `__`.");
      return false;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
      console.error("The hook name can only contain numbers, letters, dashes, periods and underscores.");
      return false;
    }
    return true;
  }
  var validateHookName_default = validateHookName;

  // node_modules/@wordpress/hooks/build-module/createAddHook.js
  function createAddHook(hooks, storeKey) {
    return function addHook(hookName, namespace, callback, priority = 10) {
      const hooksStore = hooks[storeKey];
      if (!validateHookName_default(hookName)) {
        return;
      }
      if (!validateNamespace_default(namespace)) {
        return;
      }
      if ("function" !== typeof callback) {
        console.error("The hook callback must be a function.");
        return;
      }
      if ("number" !== typeof priority) {
        console.error("If specified, the hook priority must be a number.");
        return;
      }
      const handler = {
        callback,
        priority,
        namespace
      };
      if (hooksStore[hookName]) {
        const handlers = hooksStore[hookName].handlers;
        let i;
        for (i = handlers.length; i > 0; i--) {
          if (priority >= handlers[i - 1].priority) {
            break;
          }
        }
        if (i === handlers.length) {
          handlers[i] = handler;
        } else {
          handlers.splice(i, 0, handler);
        }
        hooksStore.__current.forEach((hookInfo) => {
          if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
            hookInfo.currentIndex++;
          }
        });
      } else {
        hooksStore[hookName] = {
          handlers: [handler],
          runs: 0
        };
      }
      if (hookName !== "hookAdded") {
        hooks.doAction("hookAdded", hookName, namespace, callback, priority);
      }
    };
  }
  var createAddHook_default = createAddHook;

  // node_modules/@wordpress/hooks/build-module/createRemoveHook.js
  function createRemoveHook(hooks, storeKey, removeAll = false) {
    return function removeHook(hookName, namespace) {
      const hooksStore = hooks[storeKey];
      if (!validateHookName_default(hookName)) {
        return;
      }
      if (!removeAll && !validateNamespace_default(namespace)) {
        return;
      }
      if (!hooksStore[hookName]) {
        return 0;
      }
      let handlersRemoved = 0;
      if (removeAll) {
        handlersRemoved = hooksStore[hookName].handlers.length;
        hooksStore[hookName] = {
          runs: hooksStore[hookName].runs,
          handlers: []
        };
      } else {
        const handlers = hooksStore[hookName].handlers;
        for (let i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i].namespace === namespace) {
            handlers.splice(i, 1);
            handlersRemoved++;
            hooksStore.__current.forEach((hookInfo) => {
              if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
                hookInfo.currentIndex--;
              }
            });
          }
        }
      }
      if (hookName !== "hookRemoved") {
        hooks.doAction("hookRemoved", hookName, namespace);
      }
      return handlersRemoved;
    };
  }
  var createRemoveHook_default = createRemoveHook;

  // node_modules/@wordpress/hooks/build-module/createHasHook.js
  function createHasHook(hooks, storeKey) {
    return function hasHook(hookName, namespace) {
      const hooksStore = hooks[storeKey];
      if ("undefined" !== typeof namespace) {
        return hookName in hooksStore && hooksStore[hookName].handlers.some((hook) => hook.namespace === namespace);
      }
      return hookName in hooksStore;
    };
  }
  var createHasHook_default = createHasHook;

  // node_modules/@wordpress/hooks/build-module/createRunHook.js
  function createRunHook(hooks, storeKey, returnFirstArg = false) {
    return function runHooks(hookName, ...args) {
      const hooksStore = hooks[storeKey];
      if (!hooksStore[hookName]) {
        hooksStore[hookName] = {
          handlers: [],
          runs: 0
        };
      }
      hooksStore[hookName].runs++;
      const handlers = hooksStore[hookName].handlers;
      if (true) {
        if ("hookAdded" !== hookName && hooksStore.all) {
          handlers.push(...hooksStore.all.handlers);
        }
      }
      if (!handlers || !handlers.length) {
        return returnFirstArg ? args[0] : void 0;
      }
      const hookInfo = {
        name: hookName,
        currentIndex: 0
      };
      hooksStore.__current.push(hookInfo);
      while (hookInfo.currentIndex < handlers.length) {
        const handler = handlers[hookInfo.currentIndex];
        const result = handler.callback.apply(null, args);
        if (returnFirstArg) {
          args[0] = result;
        }
        hookInfo.currentIndex++;
      }
      hooksStore.__current.pop();
      if (returnFirstArg) {
        return args[0];
      }
      return void 0;
    };
  }
  var createRunHook_default = createRunHook;

  // node_modules/@wordpress/hooks/build-module/createCurrentHook.js
  function createCurrentHook(hooks, storeKey) {
    return function currentHook() {
      var _a;
      var _hooksStore$__current;
      const hooksStore = hooks[storeKey];
      return (_hooksStore$__current = (_a = hooksStore.__current[hooksStore.__current.length - 1]) == null ? void 0 : _a.name) !== null && _hooksStore$__current !== void 0 ? _hooksStore$__current : null;
    };
  }
  var createCurrentHook_default = createCurrentHook;

  // node_modules/@wordpress/hooks/build-module/createDoingHook.js
  function createDoingHook(hooks, storeKey) {
    return function doingHook(hookName) {
      const hooksStore = hooks[storeKey];
      if ("undefined" === typeof hookName) {
        return "undefined" !== typeof hooksStore.__current[0];
      }
      return hooksStore.__current[0] ? hookName === hooksStore.__current[0].name : false;
    };
  }
  var createDoingHook_default = createDoingHook;

  // node_modules/@wordpress/hooks/build-module/createDidHook.js
  function createDidHook(hooks, storeKey) {
    return function didHook(hookName) {
      const hooksStore = hooks[storeKey];
      if (!validateHookName_default(hookName)) {
        return;
      }
      return hooksStore[hookName] && hooksStore[hookName].runs ? hooksStore[hookName].runs : 0;
    };
  }
  var createDidHook_default = createDidHook;

  // node_modules/@wordpress/hooks/build-module/createHooks.js
  var _Hooks = class {
    constructor() {
      this.actions = /* @__PURE__ */ Object.create(null);
      this.actions.__current = [];
      this.filters = /* @__PURE__ */ Object.create(null);
      this.filters.__current = [];
      this.addAction = createAddHook_default(this, "actions");
      this.addFilter = createAddHook_default(this, "filters");
      this.removeAction = createRemoveHook_default(this, "actions");
      this.removeFilter = createRemoveHook_default(this, "filters");
      this.hasAction = createHasHook_default(this, "actions");
      this.hasFilter = createHasHook_default(this, "filters");
      this.removeAllActions = createRemoveHook_default(this, "actions", true);
      this.removeAllFilters = createRemoveHook_default(this, "filters", true);
      this.doAction = createRunHook_default(this, "actions");
      this.applyFilters = createRunHook_default(this, "filters", true);
      this.currentAction = createCurrentHook_default(this, "actions");
      this.currentFilter = createCurrentHook_default(this, "filters");
      this.doingAction = createDoingHook_default(this, "actions");
      this.doingFilter = createDoingHook_default(this, "filters");
      this.didAction = createDidHook_default(this, "actions");
      this.didFilter = createDidHook_default(this, "filters");
    }
  };
  function createHooks() {
    return new _Hooks();
  }
  var createHooks_default = createHooks;

  // node_modules/@wordpress/hooks/build-module/index.js
  var defaultHooks = createHooks_default();
  var {
    addAction,
    addFilter,
    removeAction,
    removeFilter,
    hasAction,
    hasFilter,
    removeAllActions,
    removeAllFilters,
    doAction,
    applyFilters,
    currentAction,
    currentFilter,
    doingAction,
    doingFilter,
    didAction,
    didFilter,
    actions,
    filters
  } = defaultHooks;

  // node_modules/@wordpress/i18n/build-module/default-i18n.js
  var i18n = createI18n(void 0, void 0, defaultHooks);
  var getLocaleData = i18n.getLocaleData.bind(i18n);
  var setLocaleData = i18n.setLocaleData.bind(i18n);
  var resetLocaleData = i18n.resetLocaleData.bind(i18n);
  var subscribe3 = i18n.subscribe.bind(i18n);
  var __ = i18n.__.bind(i18n);
  var _x = i18n._x.bind(i18n);
  var _n = i18n._n.bind(i18n);
  var _nx = i18n._nx.bind(i18n);
  var isRTL = i18n.isRTL.bind(i18n);
  var hasTranslation = i18n.hasTranslation.bind(i18n);

  // node_modules/@wordpress/api-fetch/build-module/middlewares/nonce.js
  function createNonceMiddleware(nonce) {
    const middleware = (options, next) => {
      const {
        headers = {}
      } = options;
      for (const headerName in headers) {
        if (headerName.toLowerCase() === "x-wp-nonce" && headers[headerName] === middleware.nonce) {
          return next(options);
        }
      }
      return next(__spreadProps(__spreadValues({}, options), {
        headers: __spreadProps(__spreadValues({}, headers), {
          "X-WP-Nonce": middleware.nonce
        })
      }));
    };
    middleware.nonce = nonce;
    return middleware;
  }
  var nonce_default = createNonceMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js
  var namespaceAndEndpointMiddleware = (options, next) => {
    let path = options.path;
    let namespaceTrimmed, endpointTrimmed;
    if (typeof options.namespace === "string" && typeof options.endpoint === "string") {
      namespaceTrimmed = options.namespace.replace(/^\/|\/$/g, "");
      endpointTrimmed = options.endpoint.replace(/^\//, "");
      if (endpointTrimmed) {
        path = namespaceTrimmed + "/" + endpointTrimmed;
      } else {
        path = namespaceTrimmed;
      }
    }
    delete options.namespace;
    delete options.endpoint;
    return next(__spreadProps(__spreadValues({}, options), {
      path
    }));
  };
  var namespace_endpoint_default = namespaceAndEndpointMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/root-url.js
  var createRootURLMiddleware = (rootURL) => (options, next) => {
    return namespace_endpoint_default(options, (optionsWithPath) => {
      let url = optionsWithPath.url;
      let path = optionsWithPath.path;
      let apiRoot;
      if (typeof path === "string") {
        apiRoot = rootURL;
        if (-1 !== rootURL.indexOf("?")) {
          path = path.replace("?", "&");
        }
        path = path.replace(/^\//, "");
        if ("string" === typeof apiRoot && -1 !== apiRoot.indexOf("?")) {
          path = path.replace("?", "&");
        }
        url = apiRoot + path;
      }
      return next(__spreadProps(__spreadValues({}, optionsWithPath), {
        url
      }));
    });
  };
  var root_url_default = createRootURLMiddleware;

  // node_modules/@wordpress/url/build-module/get-query-string.js
  function getQueryString(url) {
    let query;
    try {
      query = new URL(url, "http://example.com").search.substring(1);
    } catch (error3) {
    }
    if (query) {
      return query;
    }
  }

  // node_modules/@wordpress/url/build-module/build-query-string.js
  function buildQueryString(data) {
    let string = "";
    const stack = Object.entries(data);
    let pair;
    while (pair = stack.shift()) {
      let [key, value] = pair;
      const hasNestedData = Array.isArray(value) || value && value.constructor === Object;
      if (hasNestedData) {
        const valuePairs = Object.entries(value).reverse();
        for (const [member, memberValue] of valuePairs) {
          stack.unshift([`${key}[${member}]`, memberValue]);
        }
      } else if (value !== void 0) {
        if (value === null) {
          value = "";
        }
        string += "&" + [key, value].map(encodeURIComponent).join("=");
      }
    }
    return string.substr(1);
  }

  // node_modules/@wordpress/url/build-module/safe-decode-uri-component.js
  function safeDecodeURIComponent(uriComponent) {
    try {
      return decodeURIComponent(uriComponent);
    } catch (uriComponentError) {
      return uriComponent;
    }
  }

  // node_modules/@wordpress/url/build-module/get-query-args.js
  function setPath(object, path, value) {
    const length = path.length;
    const lastIndex = length - 1;
    for (let i = 0; i < length; i++) {
      let key = path[i];
      if (!key && Array.isArray(object)) {
        key = object.length.toString();
      }
      key = ["__proto__", "constructor", "prototype"].includes(key) ? key.toUpperCase() : key;
      const isNextKeyArrayIndex = !isNaN(Number(path[i + 1]));
      object[key] = i === lastIndex ? (
        // If at end of path, assign the intended value.
        value
      ) : (
        // Otherwise, advance to the next object in the path, creating
        // it if it does not yet exist.
        object[key] || (isNextKeyArrayIndex ? [] : {})
      );
      if (Array.isArray(object[key]) && !isNextKeyArrayIndex) {
        object[key] = __spreadValues({}, object[key]);
      }
      object = object[key];
    }
  }
  function getQueryArgs(url) {
    return (getQueryString(url) || "").replace(/\+/g, "%20").split("&").reduce((accumulator, keyValue) => {
      const [key, value = ""] = keyValue.split("=").filter(Boolean).map(safeDecodeURIComponent);
      if (key) {
        const segments = key.replace(/\]/g, "").split("[");
        setPath(accumulator, segments, value);
      }
      return accumulator;
    }, /* @__PURE__ */ Object.create(null));
  }

  // node_modules/@wordpress/url/build-module/add-query-args.js
  function addQueryArgs(url = "", args) {
    if (!args || !Object.keys(args).length) {
      return url;
    }
    let baseUrl = url;
    const queryStringIndex = url.indexOf("?");
    if (queryStringIndex !== -1) {
      args = Object.assign(getQueryArgs(url), args);
      baseUrl = baseUrl.substr(0, queryStringIndex);
    }
    return baseUrl + "?" + buildQueryString(args);
  }

  // node_modules/@wordpress/url/build-module/get-query-arg.js
  function getQueryArg(url, arg) {
    return getQueryArgs(url)[arg];
  }

  // node_modules/@wordpress/url/build-module/has-query-arg.js
  function hasQueryArg(url, arg) {
    return getQueryArg(url, arg) !== void 0;
  }

  // node_modules/@wordpress/url/build-module/normalize-path.js
  function normalizePath(path) {
    const splitted = path.split("?");
    const query = splitted[1];
    const base = splitted[0];
    if (!query) {
      return base;
    }
    return base + "?" + query.split("&").map((entry) => entry.split("=")).map((pair) => pair.map(decodeURIComponent)).sort((a, b) => a[0].localeCompare(b[0])).map((pair) => pair.map(encodeURIComponent)).map((pair) => pair.join("=")).join("&");
  }

  // node_modules/@wordpress/api-fetch/build-module/middlewares/preloading.js
  function createPreloadingMiddleware(preloadedData) {
    const cache = Object.fromEntries(Object.entries(preloadedData).map(([path, data]) => [normalizePath(path), data]));
    return (options, next) => {
      const {
        parse = true
      } = options;
      let rawPath = options.path;
      if (!rawPath && options.url) {
        const _a = getQueryArgs(options.url), {
          rest_route: pathFromQuery
        } = _a, queryArgs = __objRest(_a, [
          "rest_route"
        ]);
        if (typeof pathFromQuery === "string") {
          rawPath = addQueryArgs(pathFromQuery, queryArgs);
        }
      }
      if (typeof rawPath !== "string") {
        return next(options);
      }
      const method = options.method || "GET";
      const path = normalizePath(rawPath);
      if ("GET" === method && cache[path]) {
        const cacheData = cache[path];
        delete cache[path];
        return prepareResponse(cacheData, !!parse);
      } else if ("OPTIONS" === method && cache[method] && cache[method][path]) {
        const cacheData = cache[method][path];
        delete cache[method][path];
        return prepareResponse(cacheData, !!parse);
      }
      return next(options);
    };
  }
  function prepareResponse(responseData, parse) {
    return Promise.resolve(parse ? responseData.body : new window.Response(JSON.stringify(responseData.body), {
      status: 200,
      statusText: "OK",
      headers: responseData.headers
    }));
  }
  var preloading_default = createPreloadingMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/fetch-all-middleware.js
  var modifyQuery = (_a, queryArgs) => {
    var _b = _a, {
      path,
      url
    } = _b, options = __objRest(_b, [
      "path",
      "url"
    ]);
    return __spreadProps(__spreadValues({}, options), {
      url: url && addQueryArgs(url, queryArgs),
      path: path && addQueryArgs(path, queryArgs)
    });
  };
  var parseResponse = (response) => response.json ? response.json() : Promise.reject(response);
  var parseLinkHeader = (linkHeader) => {
    if (!linkHeader) {
      return {};
    }
    const match = linkHeader.match(/<([^>]+)>; rel="next"/);
    return match ? {
      next: match[1]
    } : {};
  };
  var getNextPageUrl = (response) => {
    const {
      next
    } = parseLinkHeader(response.headers.get("link"));
    return next;
  };
  var requestContainsUnboundedQuery = (options) => {
    const pathIsUnbounded = !!options.path && options.path.indexOf("per_page=-1") !== -1;
    const urlIsUnbounded = !!options.url && options.url.indexOf("per_page=-1") !== -1;
    return pathIsUnbounded || urlIsUnbounded;
  };
  var fetchAllMiddleware = (options, next) => __async(void 0, null, function* () {
    if (options.parse === false) {
      return next(options);
    }
    if (!requestContainsUnboundedQuery(options)) {
      return next(options);
    }
    const response = yield build_module_default(__spreadProps(__spreadValues({}, modifyQuery(options, {
      per_page: 100
    })), {
      // Ensure headers are returned for page 1.
      parse: false
    }));
    const results = yield parseResponse(response);
    if (!Array.isArray(results)) {
      return results;
    }
    let nextPage = getNextPageUrl(response);
    if (!nextPage) {
      return results;
    }
    let mergedResults = (
      /** @type {any[]} */
      [].concat(results)
    );
    while (nextPage) {
      const nextResponse = yield build_module_default(__spreadProps(__spreadValues({}, options), {
        // Ensure the URL for the next page is used instead of any provided path.
        path: void 0,
        url: nextPage,
        // Ensure we still get headers so we can identify the next page.
        parse: false
      }));
      const nextResults = yield parseResponse(nextResponse);
      mergedResults = mergedResults.concat(nextResults);
      nextPage = getNextPageUrl(nextResponse);
    }
    return mergedResults;
  });
  var fetch_all_middleware_default = fetchAllMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/http-v1.js
  var OVERRIDE_METHODS = /* @__PURE__ */ new Set(["PATCH", "PUT", "DELETE"]);
  var DEFAULT_METHOD = "GET";
  var httpV1Middleware = (options, next) => {
    const {
      method = DEFAULT_METHOD
    } = options;
    if (OVERRIDE_METHODS.has(method.toUpperCase())) {
      options = __spreadProps(__spreadValues({}, options), {
        headers: __spreadProps(__spreadValues({}, options.headers), {
          "X-HTTP-Method-Override": method,
          "Content-Type": "application/json"
        }),
        method: "POST"
      });
    }
    return next(options);
  };
  var http_v1_default = httpV1Middleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/user-locale.js
  var userLocaleMiddleware = (options, next) => {
    if (typeof options.url === "string" && !hasQueryArg(options.url, "_locale")) {
      options.url = addQueryArgs(options.url, {
        _locale: "user"
      });
    }
    if (typeof options.path === "string" && !hasQueryArg(options.path, "_locale")) {
      options.path = addQueryArgs(options.path, {
        _locale: "user"
      });
    }
    return next(options);
  };
  var user_locale_default = userLocaleMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/utils/response.js
  var parseResponse2 = (response, shouldParseResponse = true) => {
    if (shouldParseResponse) {
      if (response.status === 204) {
        return null;
      }
      return response.json ? response.json() : Promise.reject(response);
    }
    return response;
  };
  var parseJsonAndNormalizeError = (response) => {
    const invalidJsonError = {
      code: "invalid_json",
      message: __("The response is not a valid JSON response.")
    };
    if (!response || !response.json) {
      throw invalidJsonError;
    }
    return response.json().catch(() => {
      throw invalidJsonError;
    });
  };
  var parseResponseAndNormalizeError = (response, shouldParseResponse = true) => {
    return Promise.resolve(parseResponse2(response, shouldParseResponse)).catch((res) => parseAndThrowError(res, shouldParseResponse));
  };
  function parseAndThrowError(response, shouldParseResponse = true) {
    if (!shouldParseResponse) {
      throw response;
    }
    return parseJsonAndNormalizeError(response).then((error3) => {
      const unknownError = {
        code: "unknown_error",
        message: __("An unknown error occurred.")
      };
      throw error3 || unknownError;
    });
  }

  // node_modules/@wordpress/api-fetch/build-module/middlewares/media-upload.js
  function isMediaUploadRequest(options) {
    const isCreateMethod = !!options.method && options.method === "POST";
    const isMediaEndpoint = !!options.path && options.path.indexOf("/wp/v2/media") !== -1 || !!options.url && options.url.indexOf("/wp/v2/media") !== -1;
    return isMediaEndpoint && isCreateMethod;
  }
  var mediaUploadMiddleware = (options, next) => {
    if (!isMediaUploadRequest(options)) {
      return next(options);
    }
    let retries = 0;
    const maxRetries = 5;
    const postProcess = (attachmentId) => {
      retries++;
      return next({
        path: `/wp/v2/media/${attachmentId}/post-process`,
        method: "POST",
        data: {
          action: "create-image-subsizes"
        },
        parse: false
      }).catch(() => {
        if (retries < maxRetries) {
          return postProcess(attachmentId);
        }
        next({
          path: `/wp/v2/media/${attachmentId}?force=true`,
          method: "DELETE"
        });
        return Promise.reject();
      });
    };
    return next(__spreadProps(__spreadValues({}, options), {
      parse: false
    })).catch((response) => {
      const attachmentId = response.headers.get("x-wp-upload-attachment-id");
      if (response.status >= 500 && response.status < 600 && attachmentId) {
        return postProcess(attachmentId).catch(() => {
          if (options.parse !== false) {
            return Promise.reject({
              code: "post_process",
              message: __("Media upload failed. If this is a photo or a large image, please scale it down and try again.")
            });
          }
          return Promise.reject(response);
        });
      }
      return parseAndThrowError(response, options.parse);
    }).then((response) => parseResponseAndNormalizeError(response, options.parse));
  };
  var media_upload_default = mediaUploadMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/middlewares/theme-preview.js
  var createThemePreviewMiddleware = (themePath) => (options, next) => {
    if (typeof options.url === "string" && !hasQueryArg(options.url, "wp_theme_preview")) {
      options.url = addQueryArgs(options.url, {
        wp_theme_preview: themePath
      });
    }
    if (typeof options.path === "string" && !hasQueryArg(options.path, "wp_theme_preview")) {
      options.path = addQueryArgs(options.path, {
        wp_theme_preview: themePath
      });
    }
    return next(options);
  };
  var theme_preview_default = createThemePreviewMiddleware;

  // node_modules/@wordpress/api-fetch/build-module/index.js
  var DEFAULT_HEADERS = {
    // The backend uses the Accept header as a condition for considering an
    // incoming request as a REST request.
    //
    // See: https://core.trac.wordpress.org/ticket/44534
    Accept: "application/json, */*;q=0.1"
  };
  var DEFAULT_OPTIONS2 = {
    credentials: "include"
  };
  var middlewares = [user_locale_default, namespace_endpoint_default, http_v1_default, fetch_all_middleware_default];
  function registerMiddleware(middleware) {
    middlewares.unshift(middleware);
  }
  var checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    throw response;
  };
  var defaultFetchHandler = (nextOptions) => {
    const _a = nextOptions, {
      url,
      path,
      data,
      parse = true
    } = _a, remainingOptions = __objRest(_a, [
      "url",
      "path",
      "data",
      "parse"
    ]);
    let {
      body,
      headers
    } = nextOptions;
    headers = __spreadValues(__spreadValues({}, DEFAULT_HEADERS), headers);
    if (data) {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }
    const responsePromise = window.fetch(
      // Fall back to explicitly passing `window.location` which is the behavior if `undefined` is passed.
      url || path || window.location.href,
      __spreadProps(__spreadValues(__spreadValues({}, DEFAULT_OPTIONS2), remainingOptions), {
        body,
        headers
      })
    );
    return responsePromise.then((value) => Promise.resolve(value).then(checkStatus).catch((response) => parseAndThrowError(response, parse)).then((response) => parseResponseAndNormalizeError(response, parse)), (err) => {
      if (err && err.name === "AbortError") {
        throw err;
      }
      throw {
        code: "fetch_error",
        message: __("You are probably offline.")
      };
    });
  };
  var fetchHandler = defaultFetchHandler;
  function setFetchHandler(newFetchHandler) {
    fetchHandler = newFetchHandler;
  }
  function apiFetch(options) {
    const enhancedHandler = middlewares.reduceRight((next, middleware) => {
      return (workingOptions) => middleware(workingOptions, next);
    }, fetchHandler);
    return enhancedHandler(options).catch((error3) => {
      if (error3.code !== "rest_cookie_invalid_nonce") {
        return Promise.reject(error3);
      }
      return window.fetch(apiFetch.nonceEndpoint).then(checkStatus).then((data) => data.text()).then((text) => {
        apiFetch.nonceMiddleware.nonce = text;
        return apiFetch(options);
      });
    });
  }
  apiFetch.use = registerMiddleware;
  apiFetch.setFetchHandler = setFetchHandler;
  apiFetch.createNonceMiddleware = nonce_default;
  apiFetch.createPreloadingMiddleware = preloading_default;
  apiFetch.createRootURLMiddleware = root_url_default;
  apiFetch.fetchAllMiddleware = fetch_all_middleware_default;
  apiFetch.mediaUploadMiddleware = media_upload_default;
  apiFetch.createThemePreviewMiddleware = theme_preview_default;
  var build_module_default = apiFetch;

  // src/js/scripts/wp.ts
  function getMediaById(id) {
    return __async(this, null, function* () {
      const media = yield build_module_default({ path: `/wp/v2/media/${id}`, method: "GET" });
      return media;
    });
  }
  function getAllPosts(tags, categories) {
    return __async(this, null, function* () {
      try {
        const filteredTags = tags && tags.length > 0 ? tags.filter((t) => t > -1) : [];
        const filteredCategories = categories && categories.length > 0 ? categories.filter((c) => c > -1) : [];
        const tagQuery = filteredTags.length > 0 ? "&tags=" + filteredTags.join(",") : "";
        const categoryQuery = filteredCategories.length > 0 ? "&categories=" + filteredCategories.join(",") : "";
        const res = yield fetch(`/wp-json/wp/v2/posts?context=view${tagQuery}${categoryQuery}`);
        const postsData = yield res.json();
        const posts = [];
        for (const post of postsData) {
          const img = new CsekImage(post.featured_media);
          yield img.preload();
          posts.push({
            id: post.id,
            url: post.link,
            slug: post.slug,
            title: post.title.rendered,
            categories: post.categories,
            tags: post.tags,
            featuredImage: img,
            readTime: calculateReadTime(post.content.rendered)
          });
        }
        return posts;
      } catch (error3) {
        console.error(error3);
      }
      return [];
    });
  }
  function getAllTags() {
    return __async(this, null, function* () {
      try {
        const res = yield fetch(`/wp-json/wp/v2/tags?context=view`);
        const tagData = yield res.json();
        const tags = [];
        tagData.forEach((tag) => {
          tags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            description: tag.description,
            url: tag.link
          });
        });
        return tags;
      } catch (error3) {
        console.error(error3);
      }
      return [];
    });
  }
  function getCategoriesFromParent(parentId) {
    return __async(this, null, function* () {
      try {
        const parentCategory = parentId > -1 ? `&parent=${parentId}` : "";
        const res = yield fetch(`/wp-json/wp/v2/categories?context=view${parentCategory}`);
        const categoryData = yield res.json();
        const categories = [];
        categoryData.forEach((category) => {
          categories.push({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            url: category.link
          });
        });
        return categories;
      } catch (err) {
        console.error(err);
      }
      return void 0;
    });
  }
  function calculateReadTime(content) {
    const words = removeHTMLTags(content).split(" ");
    const readTime = Math.ceil(words.length / 225);
    return readTime;
  }
  function makeTagList(post) {
    return __async(this, null, function* () {
      const allTags = yield getAllTags();
      const postTags = allTags.filter((tag) => {
        return post.tags.includes(tag.id);
      });
      const tagLimit = 2;
      const tagLinks = postTags.filter((_, index) => {
        return index < tagLimit;
      }).map((tag) => {
        const tagLink = document.createElement("a");
        tagLink.href = tag.url;
        tagLink.classList.add("chip");
        tagLink.innerHTML = tag.name;
        return tagLink;
      });
      if (postTags.length > tagLimit) {
        const remainingTags = postTags.slice(tagLimit).map((tag) => {
          return decodeHtmlEntities(tag.name);
        }).join(", ");
        const moreTagLink = document.createElement("a");
        moreTagLink.href = "#";
        moreTagLink.classList.add("chip");
        moreTagLink.title = remainingTags;
        moreTagLink.innerHTML = `+${postTags.length - tagLimit}`;
        tagLinks.push(moreTagLink);
      }
      return tagLinks;
    });
  }
  function generateRelatedPostDOM(post) {
    return __async(this, null, function* () {
      const postDOM = document.createElement("div");
      postDOM.classList.add("related-post");
      const postLink = document.createElement("a");
      postLink.href = post.url;
      postLink.classList.add("post-link");
      const featuredImage = document.createElement("img");
      if (post.featuredImage) {
        featuredImage.classList.add("featured-image");
        featuredImage.src = post.featuredImage.getSize("large", "full");
        featuredImage.alt = post.featuredImage.altText;
        postLink.append(featuredImage);
      }
      const textContent = document.createElement("div");
      textContent.classList.add("text-content");
      const title = document.createElement("h2");
      title.classList.add("title");
      const splitTitle = decodeHtmlEntities(post.title).split("|");
      const mainTitle = splitTitle[0].trim();
      title.innerText = mainTitle;
      const readTime = document.createElement("div");
      readTime.classList.add("read-time");
      readTime.innerHTML = `${post.readTime} min read`;
      const tags = document.createElement("div");
      tags.classList.add("tags");
      tags.append(...yield makeTagList(post));
      textContent.append(title, readTime);
      postLink.append(textContent);
      postDOM.append(postLink, tags);
      return postDOM;
    });
  }

  // src/js/scripts/controllers/blog/post-collage-controller.ts
  var PostCollageBlock = class {
    constructor(block) {
      this.block = block;
      this.category = -1;
      this.currentCategory = -1;
      this.posts = [];
      this.tags = [];
      this.relatedPosts = [];
    }
    setup() {
      return __async(this, null, function* () {
        var _a, _b;
        this.category = parseInt((_a = this.block.dataset.chosenCategory) != null ? _a : "-1");
        this.tags = JSON.parse(this.block.dataset.foundTags || "[]");
        this.postCount = parseInt((_b = this.block.dataset.postCount) != null ? _b : "6");
        this.posts = yield getAllPosts(void 0, [this.category]);
        this.categories = yield this.fetchCategories();
        this.catLinkList = this.block.querySelector(".tag-nav ul");
        yield this.buildCategoryLinks();
        for (const p of this.posts) {
          const dom = yield generateRelatedPostDOM(p);
          const related = {
            tags: p.tags,
            categories: p.categories,
            dom,
            post: p
          };
          this.relatedPosts.push(related);
        }
        this.catLinks = this.block.querySelectorAll(".tag-nav ul li a");
        this.relatedPostsArea = this.block.querySelector(".collage-related-posts");
        this.relatedPostsArea.addEventListener("transitionend", (e) => {
          const target = e.target;
          if (!target || target.classList.contains(".collage-related-posts") || e.propertyName !== "opacity" || target.style.opacity !== "0") {
            return;
          }
          this.relatedPostsArea.innerHTML = "";
          for (const post of this.relatedPosts) {
            if (this.currentCategory === -1 || post.categories.includes(this.currentCategory)) {
              post.dom.style.display = "block";
            } else {
              post.dom.style.display = "none";
            }
          }
          const visiblePosts = this.relatedPosts.filter((post) => post.dom.style.display === "block");
          this.buildPostsGrid(visiblePosts).then((elmts) => {
            target.append(...elmts);
            target.style.opacity = "1";
          });
        });
        this.catLinks.forEach((link, index) => {
          if (index === 0) {
            link.classList.add("chosen");
          }
          link.addEventListener("click", (e) => __async(this, null, function* () {
            var _a2;
            e.preventDefault();
            const id = parseInt((_a2 = link.dataset.tagId) != null ? _a2 : "-1");
            this.currentCategory = id;
            yield this.update();
          }));
        });
        yield this.update();
      });
    }
    update() {
      return __async(this, null, function* () {
        this.log("updating...");
        this.relatedPostsArea.style.opacity = "0";
        this.catLinks.forEach((link) => {
          var _a;
          const id = parseInt((_a = link.dataset.tagId) != null ? _a : "-1");
          if (id === this.currentCategory) {
            link.classList.add("chosen");
          } else {
            link.classList.remove("chosen");
          }
        });
      });
    }
    fetchCategories() {
      return __async(this, null, function* () {
        const cats = yield getCategoriesFromParent(this.category);
        if (cats) {
          log("Post categories", cats);
          return cats;
        }
        return [];
      });
    }
    createRelatedPostGrid(posts) {
      return __async(this, null, function* () {
        function isRelatedPostDOM(post) {
          return post.hasOwnProperty("dom");
        }
        const grid = document.createElement("div");
        grid.classList.add("related-posts-grid");
        for (const post of posts) {
          if (isRelatedPostDOM(post)) {
            grid.appendChild(post.dom);
            continue;
          }
          const postDOM = yield generateRelatedPostDOM(post);
          grid.appendChild(postDOM);
        }
        return grid;
      });
    }
    createFeaturedPost(post) {
      return __async(this, null, function* () {
        const featuredPost = document.createElement("div");
        featuredPost.classList.add("featured-post");
        const featuredInner = document.createElement("div");
        featuredInner.classList.add("inner");
        featuredInner.style.backgroundImage = `url(${decodeHtmlEntities(post.featuredImage.full)})`;
        if (this.posts.length > this.postCount) {
          featuredInner.classList.add("visible");
        } else {
          featuredInner.classList.remove("visible");
        }
        const featuredContent = document.createElement("div");
        featuredContent.classList.add("featured-content");
        const titleLink = document.createElement("a");
        titleLink.href = post.url;
        const featuredTitle = document.createElement("h2");
        featuredTitle.classList.add("title");
        featuredTitle.innerHTML = post.title;
        titleLink.appendChild(featuredTitle);
        const readTime = document.createElement("div");
        readTime.classList.add("read-time");
        readTime.innerHTML = `${post.readTime} min read`;
        const tags = document.createElement("div");
        tags.classList.add("tags");
        tags.append(...yield makeTagList(post));
        featuredContent.append(titleLink, readTime, tags);
        featuredInner.appendChild(featuredContent);
        featuredPost.appendChild(featuredInner);
        return featuredPost;
      });
    }
    buildPostsGrid(posts) {
      return __async(this, null, function* () {
        this.log("building posts grid...");
        const elements = [];
        if (posts.length > this.postCount) {
          const firstGrid = yield this.createRelatedPostGrid(posts.slice(0, this.postCount));
          elements.push(firstGrid);
          const featuredPost = yield this.createFeaturedPost(posts[Math.floor(Math.random() * posts.length)].post);
          elements.push(featuredPost);
          const secondGrid = yield this.createRelatedPostGrid(posts.slice(this.postCount));
          elements.push(secondGrid);
        } else {
          const onlyGrid = yield this.createRelatedPostGrid(posts);
          elements.push(onlyGrid);
        }
        return elements;
      });
    }
    buildCategoryLinks() {
      return __async(this, null, function* () {
        this.log("building category links...");
        const links = [];
        for (const cat of this.categories) {
          const link = document.createElement("li");
          const a = document.createElement("a");
          a.href = "#" + cat.slug;
          a.innerText = decodeHtmlEntities(cat.name);
          a.dataset.tagId = cat.id.toString();
          link.appendChild(a);
          links.push(link);
        }
        this.catLinkList.append(...links);
      });
    }
    log(...args) {
      log("[PostCollageBlock]", ...args);
    }
  };
  var PostCollageController = class extends BlockController {
    constructor() {
      super();
      this.name = "PostCollageBlock";
      this.collageBlocks = [];
    }
    setup() {
      this.debug = true;
      this.blocks = document.querySelectorAll(".wp-block-guten-csek-post-collage-block");
      if (this.invalid(this.blocks.length)) {
        this.err("No blocks found");
        return;
      }
      this.blocks.forEach((block) => {
        const collageBlock = new PostCollageBlock(block);
        this.collageBlocks.push(collageBlock);
      });
      this.collageBlocks.forEach((collageBlock, index) => {
        this.log(`Setting up collage block ${index}`);
        collageBlock.setup();
      });
      this.isInitialized = true;
    }
    setupBlocks() {
      return __async(this, null, function* () {
        for (const collageBlock of this.collageBlocks) {
          yield collageBlock.setup();
        }
      });
    }
    onMouseMove(e, blockIndex) {
    }
  };

  // src/js/guten-csek.ts
  var GutenCsek = class {
    static log(...msg) {
      if (this.siteDebug) {
        log3(`[${this.siteName}]`, ...msg);
      }
    }
    static err(...msg) {
      if (this.siteDebug) {
        error2(`[${this.siteName}]`, ...msg);
      }
    }
  };
  GutenCsek.siteDebug = false;
  GutenCsek.siteName = "Csek Creative";
  var log3 = (...args) => {
    GutenCsek.log(...args);
  };
  var error2 = (...args) => {
    GutenCsek.err(...args);
  };

  // src/js/index.ts
  var createDOMController = () => {
    const curtainifyController = new CurtainifyController();
    const scrollController = new ScrollDownController("scroll-down", ".header-scroll-down-target");
    const carouselController = new CarouselController(".wp-block-guten-csek-horizontal-carousel-block");
    const videoCarouselController = new VideoCarouselController(".wp-block-guten-csek-video-carousel-block");
    const scrollingProjectsController = new ScrollingProjectsController(
      ".wp-block-guten-csek-scrolling-projects-block"
    );
    const expandingVideoController = new ExpandingVideoController(".wp-block-guten-csek-expanding-video-block");
    const teamController = new TeamController();
    const nextProjectController = new NextProjectController(".wp-block-guten-csek-next-project-block");
    const featuredVideoController = new FeaturedVideoController(".wp-block-guten-csek-featured-video-block");
    const staffProfilesController = new StaffProfilesController(".wp-block-guten-csek-staff-profiles-block");
    const cyclingStackController = new CyclingStackController();
    const postCollageController = new PostCollageController();
    return new DOMController(
      curtainifyController,
      scrollController,
      videoCarouselController,
      scrollingProjectsController,
      expandingVideoController,
      carouselController,
      nextProjectController,
      featuredVideoController,
      staffProfilesController,
      cyclingStackController,
      teamController,
      // processBlockController,
      // projectsMasonryBlock,
      postCollageController
    );
  };
  window.addEventListener("load", (e) => {
    log("[Csek Creative] Window loaded.");
    runAccumulators();
    const domController = createDOMController();
    window.requestAnimationFrame(() => {
      try {
        domController.setup();
      } catch (e2) {
        error2(e2);
        domController.isStarted = false;
      }
      domController.debugMode = true;
    });
    setTimeout(() => {
      if (!domController.isStarted || !domController) {
        domController.hideLoadingPanel();
      }
    }, 1e3);
  });
})();
/*! Bundled license information:

circletype/dist/circletype.min.js:
  (*!
   * circletype 2.3.0
   * A JavaScript library that lets you curve type on the web.
   * Copyright © 2014-2018 Peter Hrynkow
   * Licensed MIT
   * https://github.com/peterhry/CircleType#readme
   *)

@vimeo/player/dist/player.es.js:
  (*! @vimeo/player v2.20.1 | (c) 2023 Vimeo | MIT License | https://github.com/vimeo/player.js *)
  (*!
   * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
   * https://github.com/polygonplanet/weakmap-polyfill
   * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
   * @license MIT
   *)
  (*! Native Promise Only
      v0.8.1 (c) Kyle Simpson
      MIT License: http://getify.mit-license.org
  *)
*/
