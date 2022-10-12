import define1 from "./fd76d9b1ca231ef4@1568.js";
import define2 from "./140f555faa1ea41f@2011.js";
import define3 from "./a33468b95d0b15b0@808.js";

function _1(md){return(
md`# Sector List Map`
)}

function _2(md){return(
md`## The data`
)}

function _fertility(FileAttachment){return(
FileAttachment("fertility3-1.json").json()
)}

function _relief(FileAttachment){return(
FileAttachment("relief4-1.json").json()
)}

function _5(md){return(
md`## A Black and White map from a geoJSON using SVG`
)}

function _bwMap(geoJsonToMap,fertility){return(
geoJsonToMap(fertility, 600)
)}

function _geoJsonToMap(d3,html){return(
function geoJsonToMap(data, width) {
  const projection = d3.geoIdentity().reflectY(true).fitWidth(width, data);
  const path = d3.geoPath(projection);
  const height = Math.ceil(path.bounds(data)[1][1]);
  return html`<svg width=${width} height=${height}>
     <path d="${path(data)}" fill="none" stroke="black"></path>
     </svg>`;
}
)}

function _8(md){return(
md`## A Colored Map from a geoJSON using SVG`
)}

function _9(Legend,fertilityToColor){return(
Legend(fertilityToColor)
)}

function _coloredMap(geoJsonToColoredMap,fertility,fertilityToColor){return(
geoJsonToColoredMap(fertility, 600, (feat) =>
  fertilityToColor(feat.properties.class)
)
)}

function _geoJsonToColoredMap(d3,html,svg){return(
function geoJsonToColoredMap(data, width, color) {
  const projection = d3.geoIdentity().reflectY(true).fitWidth(width, data);
  const path = d3.geoPath(projection);
  const height = Math.ceil(path.bounds(data)[1][1]);
  const map = html`<svg width=${width} height=${height}>`;
  for (let feat of data.features) {
    const elem = svg`<path d="${path(feat)}" fill=${color(
      feat
    )} stroke="black">`;
    map.append(elem);
  }
  return map;
}
)}

function _fertilityToColor(d3){return(
d3.scaleOrdinal(["Good", "Regular", "Poor"], ["aqua", "lightgray", "red"])
)}

function _13(md){return(
md`## Converting a GeoJSON to a Sector List`
)}

function _coord()
{
  const pow = 6;
  const K = 1 << pow;
  //return (x) => ~~(x * K) / K;
  return (x) => x;
}


function _degenerateCount(){return(
0
)}

function _geoJsonToSectorList(d3,coord,SectorList){return(
function geoJsonToSectorList(data, width, weight) {
  const projection = d3.geoIdentity().reflectY(true).fitWidth(width, data);
  const path = d3.geoPath(projection);
  const height = Math.ceil(path.bounds(data)[1][1]);
  const bbox = [-100, -100, width + 100, height + 100];
  let sectors = [];
  for (let feat of data.features) {
    const polygons = [];
    path.context({
      beginPath: function () {
        polygons.push([]);
      },
      moveTo: function (x, y) {
        polygons.push([]);
        polygons[polygons.length - 1].push([coord(x), coord(y)]);
      },
      lineTo: function (x, y) {
        polygons[polygons.length - 1].push([coord(x), coord(y)]);
      },
      closePath: function () {},
      arc: function () {}
    });
    path(feat);
    const w = weight(feat);
    for (let poly of polygons) {
      // poly = normalizePoly(poly);
      // if (!selfIntersect(poly))
        sectors.push(
          ...SectorList.convertFrom(poly.reverse().flat(), w, bbox).sectors
        );
      // else mutable degenerateCount++;
    }
  }
  return SectorList.fromSectorArray(sectors, bbox);
}
)}

function _SLFertilityRaw(geoJsonToSectorList,fertility,classToWeight){return(
geoJsonToSectorList(fertility, 600, (feat) =>
  classToWeight(feat.properties.class)
)
)}

function _reliefToWeight(d3){return(
d3.scaleOrdinal(
  ["_", "Depression", "Ridge", "Plateau", "Lowland"],
  [0, 1, 3, 4, 5]
)
)}

function _SLReliefRaw(geoJsonToSectorList,relief,reliefToWeight){return(
geoJsonToSectorList(relief, 600, (feat) =>
  reliefToWeight(feat.properties.class)
)
)}

function _scalarValues(){return(
function scalarValues(SL) {
  let values = new Set();
  SL.scalarTransformation((x) => {
    values.add(x);
    return x;
  });
  return values;
}
)}

function _25(scalarValues,SLFertilityRaw){return(
scalarValues(SLFertilityRaw)
)}

function _26(scalarValues,SLReliefRaw){return(
scalarValues(SLReliefRaw)
)}

function _cleanupMap(){return(
function cleanupMap(allowedValues) {
  allowedValues = new Set([...allowedValues]);
  return (x) => (allowedValues.has(x) ? x : 0);
}
)}

function _SLFertility(SLFertilityRaw,cleanupMap){return(
SLFertilityRaw.scalarTransformation(cleanupMap([1, 2, 3]))
)}

function _SLRelief(SLReliefRaw,cleanupMap){return(
SLReliefRaw.scalarTransformation(cleanupMap([1, 3, 4, 5]))
)}

function _30(scalarValues,SLFertility){return(
scalarValues(SLFertility)
)}

function _31(scalarValues,SLRelief){return(
scalarValues(SLRelief)
)}

function _32(md){return(
md`## Colored map from Sector List`
)}

function _33(Legend,fertilityToColor){return(
Legend(fertilityToColor)
)}

function _34(fieldRender,SLFertility,weightToColor,weightToClass){return(
fieldRender(SLFertility, {
  fieldColor: weightToColor,
  tooltipMap: weightToClass,
  width: 600,
  height: 600,
  margin: 20
})
)}

function _weightToColor(d3){return(
d3.scaleOrdinal(
  [0, 1, 2, 3],
  ["white", "aqua", "lightgray", "red"]
)
)}

function _weightToClass(d3){return(
d3.scaleOrdinal(
  [0, 1, 2, 3],
  ["_", "Good", "Regular", "Poor"]
)
)}

function _classToWeight(d3){return(
d3.scaleOrdinal(["Good", "Regular", "Poor"], [1, 2, 3])
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["fertility3-1.json", {url: new URL("./files/55adea6a11e2bbd749fc5fd43b8780170444c7c7e25457090761c585bac7e692e1d64d7a6ec97332356368046d8bf70ed4e2f78ec8de3b9127a7f16393a56f92.json", import.meta.url), mimeType: "application/json", toString}],
    ["relief4-1.json", {url: new URL("./files/c68ad1d4ea02546cdc140f860fdbfe279133eeaa5b1cc3e0743e2f1dfc2cefcaabf67ae76671b723ec60aadeb7f575ebcf5156d18463b8ce22e690cc7ecbd707.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("fertility")).define("fertility", ["FileAttachment"], _fertility);
  main.variable(observer("relief")).define("relief", ["FileAttachment"], _relief);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("bwMap")).define("bwMap", ["geoJsonToMap","fertility"], _bwMap);
  main.variable(observer("geoJsonToMap")).define("geoJsonToMap", ["d3","html"], _geoJsonToMap);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Legend","fertilityToColor"], _9);
  main.variable(observer("coloredMap")).define("coloredMap", ["geoJsonToColoredMap","fertility","fertilityToColor"], _coloredMap);
  main.variable(observer("geoJsonToColoredMap")).define("geoJsonToColoredMap", ["d3","html","svg"], _geoJsonToColoredMap);
  main.variable(observer("fertilityToColor")).define("fertilityToColor", ["d3"], _fertilityToColor);
  main.variable(observer()).define(["md"], _13);
  const child1 = runtime.module(define1);
  main.import("Constants", child1);
  main.import("SectorList", child1);
  const child2 = runtime.module(define2);
  main.import("fieldRender", child2);
  const child3 = runtime.module(define3);
  main.import("Legend", child3);
  main.variable(observer("coord")).define("coord", _coord);
  main.define("initial degenerateCount", _degenerateCount);
  main.variable(observer("mutable degenerateCount")).define("mutable degenerateCount", ["Mutable", "initial degenerateCount"], (M, _) => new M(_));
  main.variable(observer("degenerateCount")).define("degenerateCount", ["mutable degenerateCount"], _ => _.generator);
  main.variable(observer("geoJsonToSectorList")).define("geoJsonToSectorList", ["d3","coord","SectorList"], _geoJsonToSectorList);
  main.variable(observer("SLFertilityRaw")).define("SLFertilityRaw", ["geoJsonToSectorList","fertility","classToWeight"], _SLFertilityRaw);
  main.variable(observer("reliefToWeight")).define("reliefToWeight", ["d3"], _reliefToWeight);
  main.variable(observer("SLReliefRaw")).define("SLReliefRaw", ["geoJsonToSectorList","relief","reliefToWeight"], _SLReliefRaw);
  main.variable(observer("scalarValues")).define("scalarValues", _scalarValues);
  main.variable(observer()).define(["scalarValues","SLFertilityRaw"], _25);
  main.variable(observer()).define(["scalarValues","SLReliefRaw"], _26);
  main.variable(observer("cleanupMap")).define("cleanupMap", _cleanupMap);
  main.variable(observer("SLFertility")).define("SLFertility", ["SLFertilityRaw","cleanupMap"], _SLFertility);
  main.variable(observer("SLRelief")).define("SLRelief", ["SLReliefRaw","cleanupMap"], _SLRelief);
  main.variable(observer()).define(["scalarValues","SLFertility"], _30);
  main.variable(observer()).define(["scalarValues","SLRelief"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["Legend","fertilityToColor"], _33);
  main.variable(observer()).define(["fieldRender","SLFertility","weightToColor","weightToClass"], _34);
  main.variable(observer("weightToColor")).define("weightToColor", ["d3"], _weightToColor);
  main.variable(observer("weightToClass")).define("weightToClass", ["d3"], _weightToClass);
  main.variable(observer("classToWeight")).define("classToWeight", ["d3"], _classToWeight);
  return main;
}
