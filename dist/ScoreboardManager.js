var u = Object.defineProperty;
var m = (e, t, r) => t in e ? u(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var s = (e, t, r) => m(e, typeof t != "symbol" ? t + "" : t, r);
class g {
  constructor() {
    s(this, "matches", /* @__PURE__ */ new Map());
  }
  save(t) {
    this.matches.set(t.id, t);
  }
  remove(t) {
    this.matches.delete(t);
  }
  findById(t) {
    return this.matches.get(t);
  }
  findByTeams(t, r) {
    return Array.from(this.matches.values()).find(
      (n) => n.homeTeam === t && n.awayTeam === r || n.homeTeam === r && n.awayTeam === t
    );
  }
  getAll() {
    return Array.from(this.matches.values());
  }
}
const o = [];
for (let e = 0; e < 256; ++e)
  o.push((e + 256).toString(16).slice(1));
function y(e, t = 0) {
  return (o[e[t + 0]] + o[e[t + 1]] + o[e[t + 2]] + o[e[t + 3]] + "-" + o[e[t + 4]] + o[e[t + 5]] + "-" + o[e[t + 6]] + o[e[t + 7]] + "-" + o[e[t + 8]] + o[e[t + 9]] + "-" + o[e[t + 10]] + o[e[t + 11]] + o[e[t + 12]] + o[e[t + 13]] + o[e[t + 14]] + o[e[t + 15]]).toLowerCase();
}
let c;
const l = new Uint8Array(16);
function S() {
  if (!c) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    c = crypto.getRandomValues.bind(crypto);
  }
  return c(l);
}
const b = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), d = { randomUUID: b };
function w(e, t, r) {
  var a;
  if (d.randomUUID && !e)
    return d.randomUUID();
  e = e || {};
  const n = e.random ?? ((a = e.rng) == null ? void 0 : a.call(e)) ?? S();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, y(n);
}
function f(e, t) {
  if (!e.trim() || !t.trim())
    throw new Error("Both home team and away team names are required");
  if (e === t)
    throw new Error("Home team and away team cannot be the same");
  return {
    homeTeam: e,
    awayTeam: t,
    homeScore: 0,
    awayScore: 0,
    startTime: /* @__PURE__ */ new Date()
  };
}
function p(e, t, r) {
  if (!Number.isSafeInteger(t) || !Number.isSafeInteger(r))
    throw new Error("Scores must be safe integers");
  if (t < 0 || r < 0)
    throw new Error("Scores cannot be negative");
  return {
    ...e,
    homeScore: t,
    awayScore: r
  };
}
function h(e) {
  return e.homeScore + e.awayScore;
}
class I {
  constructor(t) {
    s(this, "_scoreboardStorage");
    this._scoreboardStorage = t || new g();
  }
  startMatch(t, r) {
    if (this._scoreboardStorage.findByTeams(t, r))
      throw Error("A match with these teams already exists");
    const a = {
      id: w(),
      ...f(t, r)
    };
    return this._scoreboardStorage.save(a), a;
  }
  updateScore(t, r, n) {
    const a = this.getMatchById(t), i = p(a, r, n);
    return this._scoreboardStorage.save(i), i;
  }
  finishMatch(t) {
    return this.getMatchById(t), this._scoreboardStorage.remove(t), !0;
  }
  getSummary() {
    return this._scoreboardStorage.getAll().toSorted((r, n) => {
      const a = h(n) - h(r);
      return a !== 0 ? a : n.startTime.getTime() - r.startTime.getTime();
    });
  }
  getAllMatches() {
    return this._scoreboardStorage.getAll();
  }
  getMatchById(t) {
    const r = this._scoreboardStorage.findById(t);
    if (!r)
      throw new Error("A match with this ID doesn't exist");
    return r;
  }
  findMatch(t, r) {
    return this._scoreboardStorage.findByTeams(t, r);
  }
}
export {
  g as InMemoryScoreboardStorage,
  I as ScoreboardManager
};
