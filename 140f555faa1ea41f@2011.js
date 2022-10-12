import define1 from "./fd76d9b1ca231ef4@1568.js";
import define2 from "./0f2fc775435b2814@262.js";
import define3 from "./a33468b95d0b15b0@808.js";
import define4 from "./af0382a0466244be@91.js";

function _1(md){return(
md`# Sector List Examples

The purpose of this notebook is to illustrate how to use the \`SectorList\` class
in your application. This is done through a series of examples that try to cover typical use cases.
As a preliminary, we import \`Constants\` and \`SectorList\` from the library module.`
)}

function _3(cell){return(
cell`import { Constants, SectorList } from "fd76d9b1ca231ef4"`
)}

function _4(md){return(
md`<br>
## Examples
`
)}

function _5(md){return(
md`
### 1. Create a \`SectorList\` from a simple polygon 
First we define a polygon using an array of points, where each point is represented as an array with two coordinates:

`
)}

function _polygonA(){return(
[[100,100], [400,180], [200, 300], [400,350], [200,400]]
)}

function _7(cell){return(
cell`polygonA = [[100,100], [400,180], [200, 300], [400,350], [200,400]]`
)}

function _8(md){return(
md`In order to create a sector list equivalent to \`polygonA\`, we use the static method
\`SectorList.convertFrom(\`*coords*, *w*, *box*\`)\`, where *coords* is a **flat** array of coordinates, 
*w* is the weight the scalar field should be mapped to, and *box* is an array in the form
\`[\`*xmin*,*ymin*,*width*,*height*\`]\` delimiting the region of the plane described by this field. If *box* is not given, a default bounding box [-1000,-1000,2000,2000] is assumed (the default box can be changed by calling static method \`SectorList.setDefaultBbox (\`*box*\`)\`, if desired). Note that the algorithm assumes that the vertex circulation has counter-clockwise orientation, otherwise the polygonal region is mapped to *-w* instead.`
)}

function _sectorListA(SectorList,polygonA){return(
SectorList.convertFrom(polygonA.flat(),1)
)}

function _10(cell){return(
cell`sectorListA = SectorList.convertFrom(polygonA.flat(),1)`
)}

function _11(md){return(
md`Below we show a rendering of \`polygonA\` along with a depiction of \`sectorListA\`. We use the following visual encoding for sectors:
 1. Sectors are drawn in transparent <span style="color:blue">blue</span> or <span style="color:red">red</span> according to whether they have positive or negative weights. 
 2. Sectors with bigger absolute weights are increasingly less transparent.
 3. If one or more sectors have the same apex, they are drawn with increasing radii, following the scan order.`
)}

function _12(sectorListAndPolyToSvg,sectorListA,polygonA){return(
sectorListAndPolyToSvg (sectorListA,polygonA)
)}

function _13(cell){return(
cell`sectorListAndPolyToSvg (sectorListA,polygonA)`
)}

function _14(md){return(
md`### 2. Sum of 2 scalar fields 

First we define another polygon ...`
)}

function _polygonB(){return(
[[100,400], [400,280], [200, 200], [400,0], [200,50]].reverse()
)}

function _16(cell){return(
cell`// Note that polygons must have consistent circulations
polygonB = [[100,400], [400,280], [200, 200], [400,0], [200,50]].reverse()`
)}

function _17(md){return(
md`... and create an equivalent sector list.`
)}

function _sectorListB(SectorList,polygonB){return(
SectorList.convertFrom(polygonB.flat(), 1)
)}

function _19(cell){return(
cell`sectorListB = SectorList.convertFrom(polygonB.flat(),1)`
)}

function _20(md){return(
md`Here's a rendering of polygon B and of the sectors in its equivalent \`SectorList\` representation.`
)}

function _21(sectorListAndPolyToSvg,sectorListB,polygonB){return(
sectorListAndPolyToSvg (sectorListB,polygonB)
)}

function _22(cell){return(
cell`sectorListAndPolyToSvg (sectorListB,polygonB)`
)}

function _23(md){return(
md`Then, we use \`SectorList.add()\` to create a sector list that represents the sum of scalar fields A and B. Note that the region common to A and B is mapped to 2.`
)}

function _sectorListAPlusB(sectorListA,sectorListB){return(
sectorListA.add(sectorListB)
)}

function _25(cell){return(
cell`sectorListAPlusB = sectorListA.add(sectorListB)`
)}

function _26(md){return(
md`Below we render the two polygons and the sectors of scalar field A+B.`
)}

function _27(sectorListAndPolyToSvg,sectorListAPlusB,polygonA,polygonB){return(
sectorListAndPolyToSvg (sectorListAPlusB,polygonA,polygonB)
)}

function _28(cell){return(
cell`sectorListAndPolyToSvg (sectorListAPlusB,polygonA,polygonB)`
)}

function _29(md){return(
md`### 3. Boolean operation between two polygons `
)}

function _30(md){return(
md`We can perform boolean operations between A and B by applying a proper scalar function to the sector list of A+B. Select the operation among the options below.`
)}

function _boolOp(Inputs)
{
  let scalarFunctions = [
    { name: "union", func: function(x) {return x > 0 ? 1 : 0 } },
    { name: "intersection", func: function(x) { return x == 2 ? 1 : 0} },
     { name: "difference", func: function(x) {return x == 1 ? 1 : 0}}
  ]
  return Inputs.radio(scalarFunctions, 
                             {label: "Boolean Op", 
                              value: scalarFunctions.find(x=>x.name==="union"),
                              format: x => x.name
                             })
}


function _32(tex,md){return(
md`The resulting sector list C is computed with method \`scalarTransformation(\`*f*\`)\`  applied to the sector list of A+B, where *f* is one of the following scalar functions:

${tex`\begin{array}{rcl}
union(x)&=&\left\{ 
\begin{array}{cl} 
1 & \textrm{if } x>0, \\
0 & \textrm{otherwise.} \\
\end{array}\right.\\~\\
intersection(x)&=&\left\{ 
\begin{array}{cl} 
1 & \textrm{if } x = 2, \\
0 & \textrm{otherwise.} \\
\end{array}\right.\\~\\
difference(x)&=&\left\{ 
\begin{array}{cl} 
1 & \textrm{if } x=1, \\
0 & \textrm{otherwise.} \\
\end{array}\right.
\end{array}
`}`
)}

function _sectorListBoolean(sectorListAPlusB,boolOp){return(
sectorListAPlusB.scalarTransformation(boolOp.func)
)}

function _34(cell){return(
cell`sectorListBoolean = sectorListAPlusB.scalarTransformation(boolOp.func)`
)}

function _35(md){return(
md`Since all scalar functions yield 0 or 1, the result is a binary scalar field (maps points of the plane to 0 or 1). In this case we can obtain a representation of the resulting polygons using method \`convertToVertexCirculation()\`.`
)}

function _circulationsBoolean(sectorListBoolean){return(
sectorListBoolean.convertToVertexCirculation()
)}

function _37(cell){return(
cell`circulationsBoolean = sectorListBoolean.convertToVertexCirculation()`
)}

function _38(boolOp,md){return(
md`The rendering below shows the __*${boolOp.name}*__ of A and B along with a depiction of the sectors that represent it.`
)}

function _39(sectorListAndPolyToSvg,sectorListBoolean,ringsToPolygons,circulationsBoolean){return(
sectorListAndPolyToSvg(sectorListBoolean, ... ringsToPolygons(circulationsBoolean))
)}

function _40(cell){return(
cell`sectorListAndPolyToSvg(sectorListBoolean, ... ringsToPolygons(circulationsBoolean))`
)}

function _41(md){return(
md`### 4. Morphological operations

Morphological operations like dilation (or erosion) of a binary field represented by a Sector List can be produced by moving outwards (or inwards) the edges of the field. Method \`morph()\` can be used for that purpose. For instance, we can dilate or erode a field using a square as a structuring element by moving first the edges in the x direction and then in the y direction. 

For instance, here's how to morph with a square the sector list obtained with the boolean operation above. Use the interface below to select the displacement amount and whether the operation is a dilation or an erosion:
`
)}

function _morphOp(Constants,Inputs)
{
  let [D,E] = [["Constants.DILATION",Constants.DILATION], ["Constants.EROSION", Constants.EROSION]]
  return Inputs.radio([D,E], {label:"morphOp", value:D, format:x=>x[0]})
}


function _displacement(Inputs){return(
Inputs.range([0,50], {label: "displacement", step: 1, value:10})
)}

function _sectorListBooleanMorph(sectorListBoolean,displacement,morphOp){return(
sectorListBoolean.morph(displacement,0,morphOp[1]).morph(0,displacement,morphOp[1])
)}

function _45(cell){return(
cell`sectorListBooleanMorph = sectorListBoolean
                         .morph(displacement,0,morphOp)
                         .morph(0,displacement,morphOp)`
)}

function _46(sectorListAndPolyToSvg,sectorListBooleanMorph,ringsToPolygons){return(
sectorListAndPolyToSvg(sectorListBooleanMorph, ... ringsToPolygons(sectorListBooleanMorph.convertToVertexCirculation()))
)}

function _47(md){return(
md`<br>
### 5. Field rendering
If a field is not binary, i.e., it may map points of the plane to values different from 0 and 1. Thus, we cannot convert it to a polygon, but it is still possible to create a rendering of the field where different values are mapped to different colors. In this page, we use the following color scale:`
)}

function _48(Legend,colorScale){return(
Legend(colorScale, {
  title: "field value"
})
)}

function _colorScale(d3)
{
  const continuousScale = d3.scaleDivergingSqrt([-7, 0, 7], d3.interpolateRdBu);
  const map = d3.range(-7,7+1).map(x=>[x,d3.color(continuousScale(x))]);
  const discreteScale = d3.scaleOrdinal(map.map(x=>x[0]), map.map(x=>x[1]));
  return discreteScale
}


function _50(cell){return(
cell`colorScale = {
  const continuousScale = d3.scaleDivergingSqrt([-7, 0, 7], d3.interpolateRdBu);
  const map = d3.range(-7,7+1).map(x=>[x,d3.color(continuousScale(x))]);
  const discreteScale = d3.scaleOrdinal(map.map(x=>x[0]), map.map(x=>x[1]));
  return discreteScale
}`
)}

function _51(md){return(
md`We provide function \`fieldRender()\` (see the *Utilities* section below) to render a \`SectorList\`. It uses method \`convertToTrapezoidalDecomposition()\` to obtain a set of trapezoids covering the field and method \`detectEdges()\` to obtain a set of line segments separating areas mapped to different values. By default it uses the above color scale to paint the different regions. For instance, here is a rendering of \`sectorListAPlusB\`:`
)}

function _52(fieldRender,sectorListAPlusB){return(
fieldRender(sectorListAPlusB)
)}

function _53(cell){return(
cell`fieldRender(sectorListAPlusB)`
)}

function _54(md){return(
md`Function \`fieldRender()\` supports several options that allow for different rendering effects. For instance, we can enable tooltips, use a different color scale, generate an image of a different size, etc. `
)}

function _55(fieldRender,sectorListAPlusB,d3){return(
fieldRender(sectorListAPlusB, {
  showEdges: false,
  fieldColor: d3.scaleOrdinal([0, 1, 2], ["pink", "purple", "aqua"]),
  tooltipMap: d3.scaleOrdinal([0, 1, 2], ["outside", "one", "two"]),
  margin: 10,
  width: 500,
  height: 300
})
)}

function _56(cell){return(
cell`fieldRender(sectorListAPlusB, {
  showEdges: false,
  fieldColor: d3.scaleOrdinal([0, 1, 2], ["pink", "purple", "aqua"]),
  tooltipMap: "auto",
  margin: 10,
  width: 500,
  height: 300
})`
)}

function _57(md){return(
md`### 6. Weighted Sum and field rendering
In this example, the idea is to compute a field S = *a* A + *b* B + *c* C. where A, B, C are scalar fields, and *a*, *b* and *c* are scalars. Since we have already defined two fields A and B earlier, let's define a third field C by converting yet another polygon to a sector list:`
)}

function _sectorListC(SectorList,polygonC){return(
SectorList.convertFrom(polygonC.flat(), 1)
)}

function _59(cell){return(
cell`sectorListC = SectorList.convertFrom(polygonC.flat(), 1)`
)}

function _60(md){return(
md`where`
)}

function _polygonC(){return(
[[120,350],[120, 80], [350, 350] ]
)}

function _62(cell){return(
cell`polygonC = [[120,350],[120, 80], [350, 350] ]`
)}

function _63(sectorListAndPolyToSvg,sectorListC,polygonC){return(
sectorListAndPolyToSvg (sectorListC,polygonC)
)}

function _64(md){return(
md`The values  of scalars *a*, *b* and *c* can be chosen with the interface below.`
)}

function _scalars(Inputs){return(
Inputs.form({a: Inputs.select([-3, -2,-1,0,1,2,3], {label:"a", value:1}),
                              b: Inputs.select([-3,-2, -1,0,1,2,3], {label:"b", value:-2}),
                             c: Inputs.select([-3,-2,-1,0,1,2,3], {label:"c", value:3})})
)}

function _66(md){return(
md`Since the \`scalarMultiplication()\` method modifies the sector list in place, we must first \`clone()\` each sectorList before multiplying it by the respective scalar:`
)}

function _sectorListS(sectorListA,scalars,sectorListB,sectorListC){return(
sectorListA.scalarMultiplication (scalars.a).add (sectorListB.scalarMultiplication (scalars.b)).add (sectorListC.scalarMultiplication (scalars.c))
)}

function _68(cell){return(
cell`sectorListS = sectorListA.scalarMultiplication (a)
                .add (sectorListB.scalarMultiplication (b))
                  .add (sectorListC.scalarMultiplication (c))`
)}

function _69(fieldRender,sectorListS){return(
fieldRender(sectorListS, { tooltipMap: "auto" })
)}

function _70(cell){return(
cell`fieldRender(sectorListS, { tooltipMap: "auto" })`
)}

function _71(md){return(
md`<br>
## Utilities

Assorted functions used in this notebook to produce renderings of sector lists, polygons, trapezoids, etc.`
)}

function _72(md){return(
md`#### ringsToPolygons(circulationDS)

Converts the data structure returned by SectorList.convertToVertexCirculation()
to an array of arrays of pairs of coordinates. It does not handle polygons with holes, though.
`
)}

function _ringsToPolygons(){return(
function ringsToPolygons (circulationDS) {
  return circulationDS.polygons[0].inner_rings.map(
    ring => ring.map(({x,y}) => [x,y])
  )
}
)}

function _74(md){return(
md`#### boundingBox(points)
Computes the bounding box of an array of points. The bounding box is an array of the form
\`[minX, minY, width, height]\`.`
)}

function _boundingBox(){return(
function boundingBox(points) {
  const min = points.reduce (([x1,y1],[x2,y2]) => [Math.min(x1,x2),Math.min(y1,y2)]);
  const max = points.reduce (([x1,y1],[x2,y2]) => [Math.max(x1,x2),Math.max(y1,y2)]);
  const width = max[0]-min[0], height = max[1]-min[1];
  return [min[0],min[1],width,height];
}
)}

function _76(md){return(
md`#### trapsToTrianglesAndColors(traps, colorScale) 
Given an array of trapezoids \`traps\`, returns two arrays of equal size: an array of points (triangle vertices) and an  array of colors in format [r,g,b,a], where color coordinates obey the webgl standard, i.e., are numbers between 0 and 1. Colors for each triangle are computed by means of function \`colorScale(\`*w*\`)\`, which returns a css color for weight *w*.`
)}

function _trapsToTrianglesAndColors(colorScale,d3){return(
function trapsToTrianglesAndColors (traps, scale = colorScale) {
  const triangles = [];
  const colors = [];
  for (let t of traps) {
    //if (t.w == 0) continue;
    triangles.push ([t.x1, t.ymin],
				            [t.x2, t.ymin],
				            [t.x4, t.ymax],
                    [t.x1, t.ymin],
                    [t.x4, t.ymax],
                    [t.x3, t.ymax]
                   );
    const {r,g,b} = d3.rgb(scale (t.w))
    const color = [r/255,g/255,b/255,1];
    colors.push (color,color,color,color,color,color)
  }
  return [triangles,colors]
}
)}

function _78(md){return(
md`### SVG Rendering utilities`
)}

function _79(md){return(
md`**sectorListAndPolyToSvg (slist,...polygons)**<br>
Creates an SVG rendering of the sectors in *slist* drawn over a rendering of the given *polygons*.`
)}

function _sectorListAndPolyToSvg(polyToSvg,sectorListToSvg){return(
function sectorListAndPolyToSvg (slist,...polygons) {
  let psvg = polyToSvg(...polygons);
  for (let ssvg of sectorListToSvg(slist)) psvg.append(ssvg);
  return psvg;
}
)}

function _81(md){return(
md`#### polyToSvg (polygon1, ... polygonN)
Returns an SVG element with a rendering of polygons passed as arguments. The rendering is produced for a rectangular area around the bounding box of all polygons expanded with a margin of 50 pixels. Polygons are rendered in transparent gray so we can distinguish overlapping areas.`
)}

function _polyToSvg(boundingBox,svg){return(
function polyToSvg (...polygons) {
  const margin = 50;
  const [xmin,ymin,width,height] = polygons.length ? boundingBox(polygons.flat()):[0,0,1,1];
  const viewbox = ""+[xmin-margin,ymin-margin, width+margin*2,height+margin*2];
  const psvg = svg`<svg width=${width+margin*2} height=${height+margin*2} viewbox=${viewbox} >`;
  for (let polygon of polygons) {
    psvg.append(svg`<polygon points=${""+polygon.flat()} fill="rgba(0,0,0,0.2)" stroke=black >`)
  }
  return psvg
}
)}

function _83(md){return(
md`#### sectorToSvg (s, r)
Returns an SVG path element with a rendering of sector s using arcs of radius r.`
)}

function _sectorToSvg(svg){return(
function sectorToSvg (s, r = 20) {
  const {x,y} = s.apex;
  const {dx,dy} = s.theta;
  const h = Math.hypot(dx,dy);
  const [x1,y1] = [x+dx/h*r, y+dy/h*r];
  const alpha = Math.min(1,0.2*Math.abs(s.w));
  const color= s.w>0 ? `rgba(0,0,255,${alpha})` : `rgba(255,0,0,${alpha})`;
  return svg`<path d="M${x},${y} L${x+r},${y} A${r},${r},0,0,1,${x1},${y1}" fill=${color} />`;
}
)}

function _85(md){return(
md`**sectorListToSvg (slist)**<br>
Generates SVG sector renderings of all sectors in sector list *slist*`
)}

function _sectorListToSvg(sectorToSvg){return(
function* sectorListToSvg (slist) {
  let prev = {x:0, y:0}, dup = 0;
  const rbase = 30, rincr = 10;
  for (let s of slist.sectors) {
    if (s.apex.x == prev.x && s.apex.y == s.apex.y) dup++;
    else dup = 0;
    prev = s.apex;
    yield sectorToSvg(s, rbase+rincr*dup);
  }
}
)}

function _87(md){return(
md`### WebGL rendering utilities`
)}

function _88(md){return(
md`**fieldRender(sectorList, _options_)**<br>
Generates a WebGL rendering of the field encoded by \`sectorList\`. Field edges are computed using the \`detectEdges()\` method, while the field regions are computed using the \`convertToTrapezoidalDecomposition()\` method. The \`options\` object allows for different rendering configurations, and may contain one or more of the following:
 1. \`showEdges\` - whether or not render field edges (default: *true*).
 2. \`edgeColor\` - color used to draw the edges (default: _"black"_)
 3. \`fieldColor\` - a function mapping field values to (css) colors. This is usually a function computed by \`d3.ordinalScale()\` (see the [d3-scale](https://github.com/d3/d3-scale) package) where the domain is a set of integers and the range is a set of colors (default: a color scale mapping integers from -7 to 7 to colors from red to blue).
 4.  \`tooltipMap\` - if defined, a tooltip mechanism is added for showing value fields on mouse hover. In this case, this option should be set to a function mapping field values to labels that signify their meaning. If the special value \`"auto"\` is given, tooltips will show only the value of the field. Default: *null* (no tooltips).
 5. \`bbox\` - an array of the form \`[x0, y0, dx, dy]\` denoting the part of the plane that will be rendered. If not given, the function will use the bounding box of all sector apexes.
 6.  \`width\` - width of the canvas.
 7.  \`height\` - height of the canvas.`
)}

function _fieldRender(colorScale,d3,boundingBox,trapsToTrianglesAndColors,webGLRender,cssColorToWebGLColor,inverseColorScale,tooltipWebglCanvas){return(
function (sectorList, options = {}) {
  // Default options
  let {
    showEdges = true,
    edgeColor = "black",
    fieldColor = colorScale,
    tooltipMap = false,
    bbox,
    width = 500,
    height = 500,
    margin = 40
  } = options;
  //
  // Frames the given bounding box within a width by
  // height rectangle allowing margin pixels on each side.
  // Returns a proper world set of coordinates, i.e.,
  // [left, top, right, bottom].
  //
  const bboxToWorld = (x0, y0, dx, dy, width, height, margin) => {
    let w = width - margin * 2,
      h = height - margin * 2;
    let xscale, yscale;
    if (dx / dy < w / h) {
      yscale = d3.scaleLinear([y0, y0 + dy], [margin, margin + h]);
      let scale = h / dy;
      let kx = (w - dx * scale) / 2;
      xscale = d3.scaleLinear([x0, x0 + dx], [margin + kx, margin + w - kx]);
    } else {
      xscale = d3.scaleLinear([x0, x0 + dx], [margin, margin + w]);
      let scale = w / dx;
      let ky = (h - dy * scale) / 2;
      yscale = d3.scaleLinear([y0, y0 + dy], [margin + ky, margin + h - ky]);
    }
    return [
      xscale.invert(0),
      yscale.invert(0),
      xscale.invert(width),
      yscale.invert(height)
    ];
  };
  bbox =
    bbox || boundingBox(sectorList.sectors.map((s) => [s.apex.x, s.apex.y]));
  const world = bboxToWorld(...bbox, width, height, margin);
  //
  // Compute edge coordinates
  let edges = [];
  if (showEdges)
    edges = sectorList
      .detectEdges()
      .map((e) => [
        [e.p1.x, e.p1.y],
        [e.p2.x, e.p2.y]
      ])
      .flat();
  //
  // Compute triangle coordinates and associated colors
  let [triangles, colors] = trapsToTrianglesAndColors(
    sectorList.convertToTrapezoidalDecomposition(),
    fieldColor
  );
  // Finally, do the render
  let canvas = webGLRender(
    edges,
    cssColorToWebGLColor(edgeColor),
    triangles,
    colors,
    world,
    width,
    height
  );
  // Add a tooltip layer if requested
  if (tooltipMap) {
    let toolTipScale = inverseColorScale(fieldColor);
    if (tooltipMap === "auto") {
      return tooltipWebglCanvas(canvas, toolTipScale);
    }
    return tooltipWebglCanvas(canvas, (color) =>
      tooltipMap(toolTipScale(color))
    );
  }
  return canvas;
}
)}

function _90(md){return(
md`#### webGLRender (edges, edgeColor, triangles, triangleColors, world, width, height)
This is a general 2D WebGL render utility that renders as canvas of size *width* by *height*. Arguments *edges*, *edgeColor*, *triangles* and *triangleColors* are flat arrays of numbers: 4 coordinates for each edge (x0,y0,...), 4 numbers (r,g,b,a) for the edge color, 6 coordinates for each triangle (x0,y0,...) and 9 coordinates for each triangle color (r0,g0,b0, ...). The *world* is a an array of the form [left, top, right, bottom] denoting the world coordinates that will be mapped onto the canvas.`
)}

function _webGLRender(html,glmatrix,createRegl){return(
function webGLRender(
  edges,
  edgeColor,
  triangles,
  triangleColors,
  world,
  width,
  height
) {
  const canvas = html`<canvas width=${width} height=${height} />`;
  const [left, top, right, bottom] = world;
  const modelview = glmatrix.mat4.ortho([], left, right, bottom, top, -1, 1);
  const regl = createRegl({
    canvas,
    attributes: { preserveDrawingBuffer: true }
  });
  const drawTriangles = regl({
    frag: `
    precision mediump float;
    varying vec4 v_color;
    void main () {
      gl_FragColor = v_color;
    }`,

    vert: `
    attribute vec2 position;
    attribute vec4 color;
    varying vec4 v_color;
    uniform mat4 modelview;
    void main () {
      gl_Position = modelview * vec4(position, 0, 1);
      v_color = color;
    }`,

    attributes: {
      position: triangles,
      color: triangleColors
    },

    uniforms: {
      modelview: modelview
    },

    // Total number of vertices to be fed into the pipeline
    count: triangles.length
  });

  const drawEdges = regl({
    frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor = color;
    }`,

    vert: `
    attribute vec2 position;
    uniform mat4 modelview;
    void main () {
      gl_Position = modelview * vec4(position, 0, 1);
    }`,

    attributes: {
      position: edges
    },

    uniforms: {
      modelview: modelview,
      color: edgeColor
    },

    primitive: "lines",
    lineWidth: 1,

    // Total number of vertices to be fed into the pipeline
    count: edges.length
  });

  if (edges.length > 1) drawEdges();
  if (triangles.length > 2) drawTriangles();

  canvas.regl = regl;

  return canvas;
}
)}

function _92(md){return(
md`### inverseColorScale (colorScale)
Assuming that colorScale is a d3.ordinalScale that maps integers to colors, returns a function that realizes the inverse mapping`
)}

function _inverseColorScale(d3){return(
function (colorScale) {
  return function (color) {
    let { r, g, b } = d3.color(color);
    let closest = 0;
    let closestDist = Number.MAX_VALUE;
    for (let k of colorScale.domain()) {
      let c = d3.color(colorScale(k));
      let d = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
      if (d < closestDist) {
        closest = k;
        closestDist = d;
      }
    }
    return closest;
  };
}
)}

function _94(md){return(
md`### _Other utility functions_`
)}

function _cssColorToWebGLColor(d3){return(
function (cssColor) {
  let { r, g, b, opacity } = d3.color(cssColor);
  return [r / 255, g / 255, b / 255, opacity];
}
)}

function _webGLColorToCssColor(){return(
function ([r, g, b, a]) {
  return `rgba(${r * 255},${g * 255},${b * 255},${+a})`;
}
)}

function _tooltipWebglCanvas(toolTipper){return(
function (canvas, colorToValue) {
  let pixel = {
    width: 1,
    height: 1,
    data: new Uint8Array(4)
  };

  function tipContent(x, y) {
    pixel.x = x;
    pixel.y = Math.max(0, Math.min(canvas.height - 1, canvas.height - y));
    canvas.regl.read(pixel);
    const cssColor = "rgb(" + pixel.data.slice(0, 3) + ")";
    return `${colorToValue(cssColor)}`;
  }

  const element = toolTipper(canvas, tipContent);
  return element;
}
)}

function _98(md){return(
md`## Dependencies

Some utility libraries.`
)}

function _createRegl(require){return(
require('regl@1.4.2/dist/regl.js')
)}

function _glmatrix(){return(
import('https://unpkg.com/gl-matrix@3.3.0/esm/index.js?module')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  const child1 = runtime.module(define1);
  main.import("Constants", child1);
  main.import("SectorList", child1);
  main.variable(observer()).define(["cell"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("polygonA")).define("polygonA", _polygonA);
  main.variable(observer()).define(["cell"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("sectorListA")).define("sectorListA", ["SectorList","polygonA"], _sectorListA);
  main.variable(observer()).define(["cell"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListA","polygonA"], _12);
  main.variable(observer()).define(["cell"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("polygonB")).define("polygonB", _polygonB);
  main.variable(observer()).define(["cell"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("sectorListB")).define("sectorListB", ["SectorList","polygonB"], _sectorListB);
  main.variable(observer()).define(["cell"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListB","polygonB"], _21);
  main.variable(observer()).define(["cell"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("sectorListAPlusB")).define("sectorListAPlusB", ["sectorListA","sectorListB"], _sectorListAPlusB);
  main.variable(observer()).define(["cell"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListAPlusB","polygonA","polygonB"], _27);
  main.variable(observer()).define(["cell"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("viewof boolOp")).define("viewof boolOp", ["Inputs"], _boolOp);
  main.variable(observer("boolOp")).define("boolOp", ["Generators", "viewof boolOp"], (G, _) => G.input(_));
  main.variable(observer()).define(["tex","md"], _32);
  main.variable(observer("sectorListBoolean")).define("sectorListBoolean", ["sectorListAPlusB","boolOp"], _sectorListBoolean);
  main.variable(observer()).define(["cell"], _34);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("circulationsBoolean")).define("circulationsBoolean", ["sectorListBoolean"], _circulationsBoolean);
  main.variable(observer()).define(["cell"], _37);
  main.variable(observer()).define(["boolOp","md"], _38);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListBoolean","ringsToPolygons","circulationsBoolean"], _39);
  main.variable(observer()).define(["cell"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("viewof morphOp")).define("viewof morphOp", ["Constants","Inputs"], _morphOp);
  main.variable(observer("morphOp")).define("morphOp", ["Generators", "viewof morphOp"], (G, _) => G.input(_));
  main.variable(observer("viewof displacement")).define("viewof displacement", ["Inputs"], _displacement);
  main.variable(observer("displacement")).define("displacement", ["Generators", "viewof displacement"], (G, _) => G.input(_));
  main.variable(observer("sectorListBooleanMorph")).define("sectorListBooleanMorph", ["sectorListBoolean","displacement","morphOp"], _sectorListBooleanMorph);
  main.variable(observer()).define(["cell"], _45);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListBooleanMorph","ringsToPolygons"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer()).define(["Legend","colorScale"], _48);
  main.variable(observer("colorScale")).define("colorScale", ["d3"], _colorScale);
  main.variable(observer()).define(["cell"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["fieldRender","sectorListAPlusB"], _52);
  main.variable(observer()).define(["cell"], _53);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["fieldRender","sectorListAPlusB","d3"], _55);
  main.variable(observer()).define(["cell"], _56);
  main.variable(observer()).define(["md"], _57);
  main.variable(observer("sectorListC")).define("sectorListC", ["SectorList","polygonC"], _sectorListC);
  main.variable(observer()).define(["cell"], _59);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("polygonC")).define("polygonC", _polygonC);
  main.variable(observer()).define(["cell"], _62);
  main.variable(observer()).define(["sectorListAndPolyToSvg","sectorListC","polygonC"], _63);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer("viewof scalars")).define("viewof scalars", ["Inputs"], _scalars);
  main.variable(observer("scalars")).define("scalars", ["Generators", "viewof scalars"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _66);
  main.variable(observer("sectorListS")).define("sectorListS", ["sectorListA","scalars","sectorListB","sectorListC"], _sectorListS);
  main.variable(observer()).define(["cell"], _68);
  main.variable(observer()).define(["fieldRender","sectorListS"], _69);
  main.variable(observer()).define(["cell"], _70);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer("ringsToPolygons")).define("ringsToPolygons", _ringsToPolygons);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("boundingBox")).define("boundingBox", _boundingBox);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer("trapsToTrianglesAndColors")).define("trapsToTrianglesAndColors", ["colorScale","d3"], _trapsToTrianglesAndColors);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer()).define(["md"], _79);
  main.variable(observer("sectorListAndPolyToSvg")).define("sectorListAndPolyToSvg", ["polyToSvg","sectorListToSvg"], _sectorListAndPolyToSvg);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer("polyToSvg")).define("polyToSvg", ["boundingBox","svg"], _polyToSvg);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer("sectorToSvg")).define("sectorToSvg", ["svg"], _sectorToSvg);
  main.variable(observer()).define(["md"], _85);
  main.variable(observer("sectorListToSvg")).define("sectorListToSvg", ["sectorToSvg"], _sectorListToSvg);
  main.variable(observer()).define(["md"], _87);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer("fieldRender")).define("fieldRender", ["colorScale","d3","boundingBox","trapsToTrianglesAndColors","webGLRender","cssColorToWebGLColor","inverseColorScale","tooltipWebglCanvas"], _fieldRender);
  main.variable(observer()).define(["md"], _90);
  main.variable(observer("webGLRender")).define("webGLRender", ["html","glmatrix","createRegl"], _webGLRender);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer("inverseColorScale")).define("inverseColorScale", ["d3"], _inverseColorScale);
  main.variable(observer()).define(["md"], _94);
  main.variable(observer("cssColorToWebGLColor")).define("cssColorToWebGLColor", ["d3"], _cssColorToWebGLColor);
  main.variable(observer("webGLColorToCssColor")).define("webGLColorToCssColor", _webGLColorToCssColor);
  main.variable(observer("tooltipWebglCanvas")).define("tooltipWebglCanvas", ["toolTipper"], _tooltipWebglCanvas);
  main.variable(observer()).define(["md"], _98);
  const child2 = runtime.module(define2);
  main.import("cell", child2);
  main.variable(observer("createRegl")).define("createRegl", ["require"], _createRegl);
  main.variable(observer("glmatrix")).define("glmatrix", _glmatrix);
  const child3 = runtime.module(define3);
  main.import("Legend", child3);
  const child4 = runtime.module(define4);
  main.import("toolTipper", child4);
  return main;
}
