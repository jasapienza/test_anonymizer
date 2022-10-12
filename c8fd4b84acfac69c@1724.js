// https://observablehq.com/@jasapienza/part-1-sector-list-implementation-in-javascript@1724
import define1 from "./0f2fc775435b2814@262.js";

function _1(md){return(
md`# Part 1) Sector List Implementation in JavaScript`
)}

function _2(md){return(
md`In this notebook we present a straightforward single-thread implementation of the *Sector List* data structure and its algorithms written in the JavaScript language. This implementation is capable of computing all operations on sector lists as described in the accompanying paper submission manuscript.

**Sector Lists** (SLs) are data structures that represent discrete scalar fields equivalent to polygonal maps. SLs are elegant and efficient data structures combining properties of representations based both on vertex circulations (polygons) and on rasters (images).

The idea is to model scalar fields a sum of elementary, wedge-shaped constant fields -- what we call **sectors**. As a result, a polygonal map represented as a SL enjoys properties often associated with a raster. Unlike the latter, however, the borders of regions mapped to the same value can be represented exactly. Algorithms to convert, evaluate, add, transform and morph SLs are implemented herein as a proof-of-concept prototype that is to be made publicly available. `
)}

function _3(md){return(
md`## Ancillary Classes`
)}

function _4(md){return(
md`The codes below are divided into cells with a class or a struct, which in turn are grouped by purpose within the Sector List implementation. The cells can be expanded and modified for testing. An interested reader can also download this JS implementation.`
)}

function _5(md){return(
md`At the beggining, some constants to make the SL's code more readable.`
)}

function _Constants(){return(
{
	LESS: -1, // compare results
	GREATER: 1,
	EQUAL: 0,
	EVENTINTER: 100, // event type
	EVENTINSERT: 101,
	PREPARE: 200, // types of scan procure
	FORWARD: 201,
	CONVTP: 300, // sector list operation
	CONVVC: 301,
	SCALARTRANSF: 302,
	MORPH: 303,
	DILATION: 400, // morph type
	EROSION: 401,
	VERTEXCIRCULATION: 500, // "convert to" output
	TRAPEZOIDALDECOMPOSITION: 501,
	OPENS: 600, // types of monotone chains
	CLOSES: 601,
	SUM_TIE_VALUES: 700,
	INSERT_THE_EQUAL: 701, // types of key ties in skiplist
	PROB: 0.5, // probability for levels in skiplist
	XY_TOLERANCE: 0.000000001,
	XY_RESOLUTION: 0.0000000001,
  NUMBER_OF_BITS: 12
}
)}

function _7(cell){return(
cell`Constants = ({
	LESS: -1, // compare results
	GREATER: 1,
	EQUAL: 0,
	EVENTINTER: 100, // event type
	EVENTINSERT: 101,
	PREPARE: 200, // types of scan procure
	FORWARD: 201,
	CONVTP: 300, // sector list operation
	CONVVC: 301,
	SCALARTRANSF: 302,
	MORPH: 303,
	DILATION: 400, // morph type
	EROSION: 401,
	VERTEXCIRCULATION: 500, // "convert to" output
	TRAPEZOIDALDECOMPOSITION: 501,
	OPENS: 600, // types of monotone chains
	CLOSES: 601,
	SUM_TIE_VALUES: 700,
	INSERT_THE_EQUAL: 701, // types of key ties in skiplist
	PROB: 0.5, // probability for levels in skiplist
	XY_TOLERANCE: 0.000000001,
	XY_RESOLUTION: 0.0000000001,
  NUMBER_OF_BITS: 12
});`
)}

function _8(md){return(
md`In its turn, some functions are defined for robustness of floating point operations with coordinates.`
)}

function _Coordinates(Constants){return(
(function() {
  const {XY_TOLERANCE,NUMBER_OF_BITS} = Constants;
  const __coarseness_int_grid = NUMBER_OF_BITS;
  let __coord_order;
	const Coordinates = {
		snapToGrid : function(c) {
      const K = 2 ** (__coord_order-__coarseness_int_grid);
      return ~~(c * K) / K;
    },
		eqCoord : (c1,c2) => Math.abs(c1 - c2) <= XY_TOLERANCE,
		eqPoint : (p1,p2) => Coordinates.eqCoord(p1.x,p2.x) && Coordinates.eqCoord(p1.y,p2.y),
		eqPointCoord : (x1,y1,x2,y2) => Coordinates.eqCoord(x1,x2) && Coordinates.eqCoord(y1,y2),
		gtCoord : (c1,c2) => c1 - c2 > XY_TOLERANCE,
		lsCoord : (c1,c2) => c2 - c1 > XY_TOLERANCE,
    setBoundingBox : function(bbox) {
      let absvalues = bbox.map((v)=>Math.abs(v));
      let maxdim = absvalues.reduce((prev,curr)=>Math.max(prev,curr),absvalues[0]);
      __coord_order = Math.ceil(Math.log2(maxdim));
      return __coord_order;
    }
	};
	
	return Coordinates;
})()
)}

function _10(cell){return(
cell`Coordinates = (function() {
  const {XY_TOLERANCE,NUMBER_OF_BITS} = Constants;
  const __coarseness_int_grid = NUMBER_OF_BITS;
  let __coord_order;
	const Coordinates = {
		snapToGrid : function(c) {
      const K = 2 ** (__coord_order-__coarseness_int_grid);
      return ~~(c * K) / K;
    },
		eqCoord : (c1,c2) => Math.abs(c1 - c2) <= XY_TOLERANCE,
		eqPoint : (p1,p2) => Coordinates.eqCoord(p1.x,p2.x) && Coordinates.eqCoord(p1.y,p2.y),
		eqPointCoord : (x1,y1,x2,y2) => Coordinates.eqCoord(x1,x2) && Coordinates.eqCoord(y1,y2),
		gtCoord : (c1,c2) => c1 - c2 > XY_TOLERANCE,
		lsCoord : (c1,c2) => c2 - c1 > XY_TOLERANCE,
    setBoundingBox : function(bbox) {
      let absvalues = bbox.map((v)=>Math.abs(v));
      let maxdim = absvalues.reduce((prev,curr)=>Math.max(prev,curr),absvalues[0]);
      __coord_order = Math.ceil(Math.log2(maxdim));
      return __coord_order;
    }
	};
	
	return Coordinates;
})(); // define and call`
)}

function _11(md){return(
md`### Ancillary Geometric Classes`
)}

function _12(md){return(
md`Basic geometry primitives in naive JS code used in some places in the code.`
)}

function _Point(){return(
(function(){
	
	class Point {
		constructor(x,y) {
			this.x = x;
			this.y = y;
		}
		clone() {
			return new Point(this.x,this.y);
		}
	}
	
	return Point;
})()
)}

function _14(cell){return(
cell `// A simple point in 2D space
Point = (function(){
	
	class Point {
		constructor(x,y) {
			this.x = x;
			this.y = y;
		}
		clone() {
			return new Point(this.x,this.y);
		}
	}
	
	return Point;
})(); // define and call`
)}

function _Angle(Coordinates,Constants){return(
(function(){
	let {lsCoord,gtCoord} = Coordinates;
	let {LESS,GREATER,EQUAL} = Constants;
	
	class Angle {
		constructor(p1,p2) {
			if (p1 !== undefined) {
				if (lsCoord(p1.y,p2.y)) {
					this.dx = p2.x-p1.x;
					this.dy = p2.y-p1.y;
				} else if (gtCoord(p1.y,p2.y)) {
					this.dx = p1.x-p2.x;
					this.dy = p1.y-p2.y;
				} else {
					this.dx = Math.abs(p1.x-p2.x);
					this.dy = 0;
				}
			} else {
				this.dx = Number.NEGATIVE_INFINITY;
				this.dy = Number.NEGATIVE_INFINITY;
			}
		}
		compare(other) {
			if (this.dx === Number.NEGATIVE_INFINITY && other.dx === Number.NEGATIVE_INFINITY) return EQUAL;
			if (this.dx === Number.NEGATIVE_INFINITY) return LESS;
			if (other.dx === Number.NEGATIVE_INFINITY) return GREATER;
			let p = this.dx*other.dy-this.dy*other.dx;
			if (p < 0) return GREATER;
			if (p > 0) return LESS;
			return EQUAL;
		}
		isHorizontal() {
			return this.dy === 0;
		}
		clone() {
			let a = new Angle();
			a.dx = this.dx;
			a.dy = this.dy;
			return a;
		}
	}
	
	return Angle;
})()
)}

function _16(cell){return(
cell`// An angle given by two points and defined as a direction (dx,dy) in scan order
Angle = (function(){
	let {lsCoord,gtCoord} = Coordinates;
	let {LESS,GREATER,EQUAL} = Constants;
	
	class Angle {
		constructor(p1,p2) {
			if (p1 !== undefined) {
				if (lsCoord(p1.y,p2.y)) {
					this.dx = p2.x-p1.x;
					this.dy = p2.y-p1.y;
				} else if (gtCoord(p1.y,p2.y)) {
					this.dx = p1.x-p2.x;
					this.dy = p1.y-p2.y;
				} else {
					this.dx = Math.abs(p1.x-p2.x);
					this.dy = 0;
				}
			} else {
				this.dx = Number.NEGATIVE_INFINITY;
				this.dy = Number.NEGATIVE_INFINITY;
			}
		}
		compare(other) {
			if (this.dx === Number.NEGATIVE_INFINITY && other.dx === Number.NEGATIVE_INFINITY) return EQUAL;
			if (this.dx === Number.NEGATIVE_INFINITY) return LESS;
			if (other.dx === Number.NEGATIVE_INFINITY) return GREATER;
			let p = this.dx*other.dy-this.dy*other.dx;
			if (p < 0) return GREATER;
			if (p > 0) return LESS;
			return EQUAL;
		}
		isHorizontal() {
			return this.dy === 0;
		}
		clone() {
			let a = new Angle();
			a.dx = this.dx;
			a.dy = this.dy;
			return a;
		}
	}
	
	return Angle;
})(); // define and call`
)}

function _Edge(){return(
(function(){
	class Edge {
		constructor(p1,p2,s) {
			this.p1 = p1;
			this.p2 = p2;
			this.s = s;
		}
	}

	return Edge;
})()
)}

function _18(cell){return(
cell`// A simple edge defined by two points and scalar field value on the left
Edge = (function(){
	class Edge {
		constructor(p1,p2,s) {
			this.p1 = p1;
			this.p2 = p2;
			this.s = s;
		}
	}

	return Edge;
})(); // define and call`
)}

function _Polygon(){return(
(function(){
	// the points of rings must be in format {x: 0, y: 0}
	class Polygon {
		constructor(id,label,outer_ring = [],inner_rings = []) {
			this.id = id;
			this.label = label;
			this.outer_ring = outer_ring;
			this.inner_rings = inner_rings;
		}
		addInnerRing(inner_ring){
			this.inner_rings.push(inner_ring);
		}
		setOuterRing(outer_ring) {
			this.outer_ring = outer_ring;
		}
	}
	
	return Polygon;
})()
)}

function _20(cell){return(
cell`Polygon = (function(){
	// the points of rings must be in format {x: 0, y: 0}
	class Polygon {
		constructor(id,label,outer_ring = [],inner_rings = []) {
			this.id = id;
			this.label = label;
			this.outer_ring = outer_ring;
			this.inner_rings = inner_rings;
		}
		addInnerRing(inner_ring){
			this.inner_rings.push(inner_ring);
		}
		setOuterRing(outer_ring) {
			this.outer_ring = outer_ring;
		}
	}
	
	return Polygon;
})(); // define and call`
)}

function _21(md){return(
md`### Ancillary Classes for the Plane Sweep Paradigm`
)}

function _22(tex,md){return(
md`Most operations on Sector Lists can be computed using an approach called *plane sweeping*. In two dimensions, the idea is known as *line sweeping* and algorithms that implement it are also called *scanline algorithms*. In a nutshell, the plane is vertically swept by a horizontal line moving from ${tex`y=-\infty`} to ${tex`y=+\infty`}. For each value of *y*, field changes along the line are recorded. The algorithm used for scanning SLs is adapted from Bentley and Ottmann (1979).`
)}

function _23(md){return(
md`Firstly, some shared variables about the status of scanline.`
)}

function _ScanlnStatus(){return(
{
	y_curr: null,
	x_curr: null,
	theta_curr: null
}
)}

function _25(cell){return(
cell`ScanlnStatus = ({
	y_curr: null,
	x_curr: null,
	theta_curr: null
});`
)}

function _26(md){return(
md`Rays are the elements scanned in this plane sweeping implementation. They are defined from an origin, an angle and a change in scalar field – all obtained from the properties of a sector.`
)}

function _Ray(Constants,Coordinates,Point,ScanlnStatus){return(
(function() {
	
	let {LESS,GREATER,EQUAL,XY_RESOLUTION} = Constants;
	let {eqCoord,lsCoord,gtCoord} = Coordinates;
	
	class Ray {
		constructor(source,theta,ds,y_low = null) {
			this.source = source;
			this.theta = theta;
			this.ds = ds;
			this.y_low = (y_low === null ? this.source.y : y_low);
			// y_low is used only for trapezoidal decomposition
		}
		static clone_static(ray) {
			return ray.clone();
		}
		clone() {
			return new Ray(this.source.clone(),this.theta.clone(),this.ds,this.y_low);
		}
		destination() {
			return new Point(this.source.x+this.theta.dx,this.source.y+this.theta.dy);
		}
		interY(y) {
			if (this.theta.isHorizontal()) return ScanlnStatus.x_curr; // horizontal ray!
			return this.source.x + this.theta.dx * (y - this.source.y) / this.theta.dy;
		}
		inter(other) {
			let det = other.theta.dx * this.theta.dy - other.theta.dy * this.theta.dx;
			if (det == 0) return null;
			let t = (this.theta.dx*(other.source.y-this.source.y)-this.theta.dy*(other.source.x-this.source.x) ) / det;
			//if (t > 2 || t < 0) return null;
			let x_inter = other.source.x+other.theta.dx*t;
			let y_inter = other.source.y+other.theta.dy*t;
			return new Point(x_inter,y_inter);
		}
		compare_ray_inters(other) {
			return Ray.compare_ray_inters_static(this,other);
		}
		compare_rays(other) {
			return Ray.compare_rays_static(this,other);
		}
		toString() {
			return 'Ray(x_curr:'+this.interY(ScanlnStatus.y_curr)+',y_curr:'+ScanlnStatus.y_curr+',x0:'+this.source.x+',y0:'+this.source.y+',ds:'+this.ds+',theta:'+this.theta+',y_low='+this.y_low+')';
		};
		isSentinel = () => this.ds === 0;
		equal_theta = (other) => (this.theta.compare(other.theta) === EQUAL);
		compare_ray_thetas = (other) => other.theta.compare(this.theta);
		static compare_ray_inters_static(r1,r2) {
			let x1_inter = r1.interY(ScanlnStatus.y_curr);
			let x2_inter = r2.interY(ScanlnStatus.y_curr);
      if (lsCoord(x1_inter,x2_inter)) return LESS;
			if (gtCoord(x1_inter,x2_inter)) return GREATER;
			return EQUAL;
		}
		static compare_rays_static(r1,r2) {
			let res = Ray.compare_ray_inters_static(r1,r2);
			if (res != EQUAL) return res;
			return Ray.compare_ray_thetas_static(r1,r2);
		}
		static compare_ray_thetas_static = (r1,r2) => r2.theta.compare(r1.theta);
		static get_ds_static = (r) => r.ds;
		static set_ds_static = (r,new_ds) => r.ds = new_ds;
	}
	
	return Ray;
})()
)}

function _28(cell){return(
cell`Ray = (function() {
	
	let {LESS,GREATER,EQUAL,XY_RESOLUTION} = Constants;
	let {eqCoord,lsCoord,gtCoord} = Coordinates;
	
	class Ray {
		constructor(source,theta,ds,y_low = null) {
			this.source = source;
			this.theta = theta;
			this.ds = ds;
			this.y_low = (y_low === null ? this.source.y : y_low);
			// y_low is used only for trapezoidal decomposition
		}
		static clone_static(ray) {
			return ray.clone();
		}
		clone() {
			return new Ray(this.source.clone(),this.theta.clone(),this.ds,this.y_low);
		}
		destination() {
			return new Point(this.source.x+this.theta.dx,this.source.y+this.theta.dy);
		}
		interY(y) {
			if (this.theta.isHorizontal()) return ScanlnStatus.x_curr; // horizontal ray!
			return this.source.x + this.theta.dx * (y - this.source.y) / this.theta.dy;
		}
		inter(other) {
			let det = other.theta.dx * this.theta.dy - other.theta.dy * this.theta.dx;
			if (det == 0) return null;
			let t = (this.theta.dx*(other.source.y-this.source.y)-this.theta.dy*(other.source.x-this.source.x) ) / det;
			//if (t > 2 || t < 0) return null;
			let x_inter = other.source.x+other.theta.dx*t;
			let y_inter = other.source.y+other.theta.dy*t;
			return new Point(x_inter,y_inter);
		}
		compare_ray_inters(other) {
			return Ray.compare_ray_inters_static(this,other);
		}
		compare_rays(other) {
			return Ray.compare_rays_static(this,other);
		}
		toString() {
			return 'Ray(x_curr:'+this.interY(ScanlnStatus.y_curr)+',y_curr:'+ScanlnStatus.y_curr+',x0:'+this.source.x+',y0:'+this.source.y+',ds:'+this.ds+',theta:'+this.theta+',y_low='+this.y_low+')';
		};
		isSentinel = () => this.ds === 0;
		equal_theta = (other) => (this.theta.compare(other.theta) === EQUAL);
		compare_ray_thetas = (other) => other.theta.compare(this.theta);
		static compare_ray_inters_static(r1,r2) {
			let x1_inter = r1.interY(ScanlnStatus.y_curr);
			let x2_inter = r2.interY(ScanlnStatus.y_curr);
      if (lsCoord(x1_inter,x2_inter)) return LESS;
			if (gtCoord(x1_inter,x2_inter)) return GREATER;
			return EQUAL;
		}
		static compare_rays_static(r1,r2) {
			let res = Ray.compare_ray_inters_static(r1,r2);
			if (res != EQUAL) return res;
			return Ray.compare_ray_thetas_static(r1,r2);
		}
		static compare_ray_thetas_static = (r1,r2) => r2.theta.compare(r1.theta);
		static get_ds_static = (r) => r.ds;
		static set_ds_static = (r,new_ds) => r.ds = new_ds;
	}
	
	return Ray;
})(); // define and call
`
)}

function _29(md){return(
md`An event (or stop-event) represents a position in the plane where one ray should be inserted or reordered in the active list.`
)}

function _Event(Constants,Coordinates){return(
(function() {
	
	let {LESS,GREATER,EQUAL,EVENTINTER,EVENTINSERT} = Constants;
	let {gtCoord,lsCoord} = Coordinates;
	
	class Event {
		constructor(type,ray) {
			this.type = type;
			this.ray = ray;
		}
		x() {
			return this.ray.source.x;
		}
		y() {
			return this.ray.source.y;
		}
		compare(other) {
			if (lsCoord(this.ray.source.y,other.ray.source.y)) return LESS;
			if (gtCoord(this.ray.source.y,other.ray.source.y)) return GREATER;
			if (lsCoord(this.ray.source.x,other.ray.source.x)) return LESS;
			if (gtCoord(this.ray.source.x,other.ray.source.x)) return GREATER;
			if (this.type > other.type) return GREATER;
			if (this.type < other.type) return LESS;
			if (this.type === EVENTINTER) return EQUAL;
			return other.ray.theta.compare(this.ray.theta);
		}
		static compare_first_is_lesser(e1,e2) {
			return e1.compare(e2) === LESS;
		}
	}
	return Event;
})()
)}

function _31(cell){return(
cell`Event = (function() {
	
	let {LESS,GREATER,EQUAL,EVENTINTER,EVENTINSERT} = Constants;
	let {gtCoord,lsCoord} = Coordinates;
	
	class Event {
		constructor(type,ray) {
			this.type = type;
			this.ray = ray;
		}
		x() {
			return this.ray.source.x;
		}
		y() {
			return this.ray.source.y;
		}
		compare(other) {
			if (lsCoord(this.ray.source.y,other.ray.source.y)) return LESS;
			if (gtCoord(this.ray.source.y,other.ray.source.y)) return GREATER;
			if (lsCoord(this.ray.source.x,other.ray.source.x)) return LESS;
			if (gtCoord(this.ray.source.x,other.ray.source.x)) return GREATER;
			if (this.type > other.type) return GREATER;
			if (this.type < other.type) return LESS;
			if (this.type === EVENTINTER) return EQUAL;
			return other.ray.theta.compare(this.ray.theta);
		}
		static compare_first_is_lesser(e1,e2) {
			return e1.compare(e2) === LESS;
		}
	}
	return Event;
})(); // define and call`
)}

function _32(md){return(
md`We apply a Priority Queue to hold stop-events as described in the plane sweep paradigm.`
)}

function _PriorityQueue(){return(
(function() {
	
	// 'private' methods
	const PQ_TOP = 0;
	const PQ_PARENT = i => ((i + 1) >>> 1) - 1;
	const PQ_LEFT = i => (i << 1) + 1;
	const PQ_RIGHT = i => (i + 1) << 1;
	var __greater = function(pqueue,i,j) {
		return pqueue._comparator(pqueue._heap[i], pqueue._heap[j]);
	}
	var __swap = function(pqueue,i,j) {
		[pqueue._heap[i], pqueue._heap[j]] = [pqueue._heap[j], pqueue._heap[i]];
	}
	var __siftUp = function(pqueue) {
		let node = pqueue.size() - 1;
		while (node > PQ_TOP && __greater(pqueue,node, PQ_PARENT(node))) {
			__swap(pqueue,node, PQ_PARENT(node));
			node = PQ_PARENT(node);
		}
	}
	var __siftDown = function(pqueue) {
		let node = PQ_TOP;
		while (
		  (PQ_LEFT(node) < pqueue.size() && __greater(pqueue,PQ_LEFT(node), node)) ||
		  (PQ_RIGHT(node) < pqueue.size() && __greater(pqueue,PQ_RIGHT(node), node))
		) {
			let maxChild = (PQ_RIGHT(node) < pqueue.size() && __greater(pqueue,PQ_RIGHT(node), PQ_LEFT(node))) ? PQ_RIGHT(node) : PQ_LEFT(node);
			__swap(pqueue,node, maxChild);
			node = maxChild;
		}
	}

	class PriorityQueue {
		constructor(comparator) {
			this._heap = [];
			this._comparator = comparator;
		}
		size() {
			return this._heap.length;
		}
		isEmpty() {
			return this.size() == 0;
		}
		peek() {
			return this._heap[PQ_TOP];
		}
		push(...values) {
			values.forEach(value => {
				this._heap.push(value);
				__siftUp(this);
			});
			return this.size();
		}
		push_sorted(...values) {
			values.forEach(value => {
				this._heap.push(value);
			});
			return this.size();
		}
		pop() {
			const poppedValue = this.peek();
			const bottom = this.size()-1;
			if (bottom > PQ_TOP) {
				__swap(this,PQ_TOP,bottom);
			}
			this._heap.pop();
			__siftDown(this);
			return poppedValue;
		}
		replace(value) {
			const replacedValue = this.peek();
			this._heap[PQ_TOP] = value;
			__siftDown(this);
			return replacedValue;
		}
	}
	
	return PriorityQueue;
})()
)}

function _34(cell){return(
cell`PriorityQueue = (function() {
	
	// 'private' methods
	const PQ_TOP = 0;
	const PQ_PARENT = i => ((i + 1) >>> 1) - 1;
	const PQ_LEFT = i => (i << 1) + 1;
	const PQ_RIGHT = i => (i + 1) << 1;
	var __greater = function(pqueue,i,j) {
		return pqueue._comparator(pqueue._heap[i], pqueue._heap[j]);
	}
	var __swap = function(pqueue,i,j) {
		[pqueue._heap[i], pqueue._heap[j]] = [pqueue._heap[j], pqueue._heap[i]];
	}
	var __siftUp = function(pqueue) {
		let node = pqueue.size() - 1;
		while (node > PQ_TOP && __greater(pqueue,node, PQ_PARENT(node))) {
			__swap(pqueue,node, PQ_PARENT(node));
			node = PQ_PARENT(node);
		}
	}
	var __siftDown = function(pqueue) {
		let node = PQ_TOP;
		while (
		  (PQ_LEFT(node) < pqueue.size() && __greater(pqueue,PQ_LEFT(node), node)) ||
		  (PQ_RIGHT(node) < pqueue.size() && __greater(pqueue,PQ_RIGHT(node), node))
		) {
			let maxChild = (PQ_RIGHT(node) < pqueue.size() && __greater(pqueue,PQ_RIGHT(node), PQ_LEFT(node))) ? PQ_RIGHT(node) : PQ_LEFT(node);
			__swap(pqueue,node, maxChild);
			node = maxChild;
		}
	}

	class PriorityQueue {
		constructor(comparator) {
			this._heap = [];
			this._comparator = comparator;
		}
		size() {
			return this._heap.length;
		}
		isEmpty() {
			return this.size() == 0;
		}
		peek() {
			return this._heap[PQ_TOP];
		}
		push(...values) {
			values.forEach(value => {
				this._heap.push(value);
				__siftUp(this);
			});
			return this.size();
		}
		push_sorted(...values) {
			values.forEach(value => {
				this._heap.push(value);
			});
			return this.size();
		}
		pop() {
			const poppedValue = this.peek();
			const bottom = this.size()-1;
			if (bottom > PQ_TOP) {
				__swap(this,PQ_TOP,bottom);
			}
			this._heap.pop();
			__siftDown(this);
			return poppedValue;
		}
		replace(value) {
			const replacedValue = this.peek();
			this._heap[PQ_TOP] = value;
			__siftDown(this);
			return replacedValue;
		}
	}
	
	return PriorityQueue;
})(); // define and call`
)}

function _35(tex,md){return(
md`An implementation of the Skiplist data structure described in Pugh (1990) in order to handle the active list and searching in ${tex`O(\log m)`}, where *m* is the size of the active list.`
)}

function _Skiplist(Constants){return(
(function() {

	let {GREATER,EQUAL,SUM_TIE_VALUES,INSERT_THE_EQUAL} = Constants;

	// 'private' methods and classes
	class SLNode {
		constructor(key,num_lvls) {
			this.key = key;
			this.next = new Array(num_lvls);
			this.dvalues = new Array(num_lvls);
			// to set default values...
			for (var i=0;i<num_lvls;i++){
				this.next[i] = null;
				this.dvalues[i] = 0;
			}
		}
		cntLevels() {
			return this.next.length;
		}
	}

	class SLFindResult {
		constructor(sum_values=null,lvlpath=null,find_equal=false) {
			this.sum_values = sum_values;
			this.find_equal = find_equal;
			this.lvlpath = lvlpath;
		}
		findedNode() {
			return this.lvlpath[0].next[0];
		}
		getNextNodeOnPath(lvl,steps=1) {
			var node = this.lvlpath[lvl];
			for(var i=0;i<steps;i++){
				if (node === null) return null;
				node = node.next[lvl];
			}
			return node;
		}
		setNextNodeOnPath(new_node,value) {
			var new_sumvalue = this.sum_values[0] + value;
			for (var lvl=0;lvl<this.lvlpath.length;lvl++) {
				let prev_node = this.lvlpath[lvl];
				if (lvl < new_node.cntLevels()) { // then, updates linked list and dvalues values
					let next_node = prev_node.next[lvl];
					// updating linked list
					new_node.next[lvl] = next_node;
					prev_node.next[lvl] = new_node;
					// updating dvalues
					let prev_sumvalue = this.sum_values[lvl];
					let new_next_sumvalue = prev_sumvalue + value + prev_node.dvalues[lvl];	
					prev_node.dvalues[lvl] = new_sumvalue-prev_sumvalue;
					new_node.dvalues[lvl] = new_next_sumvalue-new_sumvalue;
				} else { // update only dvalues of prev_node
					prev_node.dvalues[lvl] += value;
				}
			}
		}
		updateDValuesOnPath(dvalue) {
			for(var lvl=0;lvl<this.lvlpath.length;lvl++) {
				this.lvlpath[lvl].dvalues[lvl] += dvalue;
			}
		}
		removeFindedNode() {
			var finded_node = this.findedNode();
			var value = this.lvlpath[0].dvalues[0];
			for (var lvl=0;lvl<this.lvlpath.length;lvl++) {
				if (lvl < finded_node.cntLevels()) {
					var prev_node = this.lvlpath[lvl];
					var next_node = finded_node.next[lvl];
					// updating linked list
					prev_node.next[lvl] = next_node;
					// updating dvalues
					var prev_sum_value = this.sum_values[lvl];
					var new_next_sum_value = prev_sum_value + prev_node.dvalues[lvl] + finded_node.dvalues[lvl] - value;
					prev_node.dvalues[lvl] = new_next_sum_value-prev_sum_value;
				} else {
					this.lvlpath[lvl].dvalues[lvl] -= value;
				}
			}
			// returning the new neighborhood keys at first level
			return [this.lvlpath[0].key,this.lvlpath[0].next[0].key];
		}
	}
	
	var __find = function(skiplist,key) {
		var curr_node = skiplist._head;
		var curr_lvl = skiplist._levels-1;
		var curr_sum = 0;
		var sum_values = new Array(skiplist._levels);
		var lvlpath = new Array(skiplist._levels);
		var result;
		while (curr_lvl >= 0) {
			result = skiplist._cmp_func(key,curr_node.next[curr_lvl].key);
			if (result == GREATER) {
				curr_sum += curr_node.dvalues[curr_lvl];
				curr_node = curr_node.next[curr_lvl];
			} else { // else, result is equal to LESS or EQUAL
				lvlpath[curr_lvl] = curr_node;
				sum_values[curr_lvl] = curr_sum;
				curr_lvl--;
			}
		}
		return new SLFindResult(sum_values,lvlpath,result == EQUAL);
	}
	
	var __randLevels = function(prob,numlvls) {
		var cnt = 1;
		while (Math.random() > prob && cnt < numlvls) cnt++;
		return cnt;
	}
	
	var __removeNode = function(skiplist,find_result) {
		skiplist._size -= 1;
		// remove node and return the new neighborhood rays
		return [find_result.removeFindedNode()];
	}

	class Skiplist {
		constructor(n,p,cmp_func,get_func,set_func,clone_func,sent1,sent2,tie_rule = INSERT_THE_EQUAL) {
			this._levels = n;
			this._p = p;
			// head and tail are sentinel keys on leftmost (lesser) and rightmost (greatest)
			this._head = new SLNode(sent1,n);
			this._tail = new SLNode(sent2,n);
			for(let i=0;i<n;i++) {
				this._head.next[i] = this._tail; // at the beginning head points to tail in all levels
				this._tail.next[i] = null;
			}
			this._size = 0; // count of non-sentinel keys in skiplist
			this._cmp_func = cmp_func;
			this._get_keyvalue = get_func;
			this._set_keyvalue = set_func;
			this._clone_func = clone_func;
			this._tie_rule = tie_rule;
		}
		setCompareFunction(cmp_func) {
			this._cmp_func = cmp_func;
		}
		getRange(begin,end = null, more1inrange = false) {
			// if end = null, returns all values equal to begin
			// else, returns all values in range (begin,end)
			// optionally, one value lesser key is added at the begining and greatest at end if more1inrange is true
			if (end === null) end = begin;
			var find_result = __find(this,begin);
			var curr_node = find_result.lvlpath[0];
			var keys = [], sum_values = [];
			var curr_sum = find_result.sum_values[0]; // the sum of values on the left of finded value;
			if (more1inrange) {
				keys.push(curr_node.key); // one key before the range
				sum_values.push(curr_sum);
			}
			curr_sum += curr_node.dvalues[0];
			curr_node = curr_node.next[0];
			while (curr_node !== null && this._cmp_func(curr_node.key,end) != GREATER) {
				keys.push(curr_node.key);
				sum_values.push(curr_sum);
				curr_sum += curr_node.dvalues[0];
				curr_node = curr_node.next[0];
			}
			if (more1inrange && curr_node !== null) {
				keys.push(curr_node.key); // one key after the range
				sum_values.push(curr_sum);
			}
			return {keys: keys, sum_values: sum_values};
		}
		getKeys(clone = false) {
			// get all keys in skiplist
			let keys = [];
			let node = this._head;
			while (node !== null) {
				keys.push(clone === true ? this._clone_func(node.key) : node.key);
				node = node.next[0];
			}
			return keys;
		}
		insert(key) {
			var value = this._get_keyvalue(key);
			var find_result = __find(this,key);
			
			if (this._tie_rule == SUM_TIE_VALUES && find_result.find_equal) {
				let equal_node = find_result.findedNode();
				let equal_node_value = this._get_keyvalue(equal_node.key);
				if (equal_node_value + value === 0) {
					// remove (cancel) the node from skiplist!
					return __removeNode(this,find_result);
				} else { // else, update value and path
					this._set_keyvalue(equal_node.key,equal_node_value+value);
					find_result.updateDValuesOnPath(value);
					return []; // there are not new neighborhood keys...
				}
			} else {
				let random_levels = __randLevels(this._p,this._levels);
				let new_node = new SLNode(key,random_levels);
				find_result.setNextNodeOnPath(new_node,value);
				this._size += 1;
				return [[find_result.lvlpath[0].key,key],[key,find_result.getNextNodeOnPath(0,2).key]];
			}
		}
		remove(key) {
			var find_result = __find(this,key);
			/*if (!find_result.find_equal) {
				console.log("******************************");
				console.log(key.clone());
				console.log(find_result.findedNode().key.clone());
				console.log(this.getKeys(true));
				console.log("******************************");
			}*/
			return __removeNode(this,find_result);
		}
		removeAllKeysEqualTo(key) {
			var find_result = __find(this,key);
			var removed_keys = [];
			while (find_result.find_equal) { // if there aren't equal values :: nothing more to do
				removed_keys.push(find_result.findedNode().key);
				__removeNode(this,find_result);
				find_result = __find(this,key);
			}
			return removed_keys;
		}
		static computeMaxLevels(size) { // computing a max level for the Skiplist data structure
			let result = Math.floor(Math.log2(Math.sqrt(size)));
			return result < 3 ? 3 : result;
		}
		toString() {
			var str_values = '';
			var str_lines = new Array(this._levels);
			for (var i=0;i<this._levels;i++) str_lines[i] = '';
			var node = this._head;
			while (node !== null) {
				str_values += '<br>key: '+ node.key.toString() + ' | next: ';
				for (var curr_lvl=this._levels-1;curr_lvl>=0;curr_lvl--) {
					if (curr_lvl >= node.cntLevels()) {
						str_lines[curr_lvl] += '---------';
					} else {
						if (node.next[curr_lvl] === null) {
							str_values += 'null | ';
						} else {
							str_values += node.next[curr_lvl].key.toString() + ' | ';
						}
						if (node.next[0] === null) {
							str_lines[curr_lvl] += '|--null';
						} else {
							var str_ds;
							if (typeof node.dvalues[curr_lvl] === 'undefined')
								str_ds = '?   ';
							else {
								str_ds = node.dvalues[curr_lvl].toString();
								while (str_ds.length<2) str_ds += ' ';
							}
							str_lines[curr_lvl] += '|-- '+str_ds+' --';
						}
					}
				}
				node = node.next[0]; //next at first level
			}
			var str = '<pre>------<br>Skiplist Data Structure<br>';
			for (i=this._levels-1;i>=0;i--) str += str_lines[i]+'<br>';
			str += '-----<br>Values'+str_values+'</pre>';
			return str;
		}
		assertNodes(x,y) {
			var node = this._head;
			while (node.next[0] !== null) {
				let result = node.key.compare_rays(node.next[0].key);
				console.assert(result != GREATER,'Unordered scanline not expected! Problem found between '+node.key.toString()+' and '+node.next[0].key.toString()+'. result = '+result);
				node = node.next[0];
			}
		}
	}
	
	return Skiplist;
})()
)}

function _37(cell){return(
cell`Skiplist = (function() {

	let {GREATER,EQUAL,SUM_TIE_VALUES,INSERT_THE_EQUAL} = Constants;

	// 'private' methods and classes
	class SLNode {
		constructor(key,num_lvls) {
			this.key = key;
			this.next = new Array(num_lvls);
			this.dvalues = new Array(num_lvls);
			// to set default values...
			for (var i=0;i<num_lvls;i++){
				this.next[i] = null;
				this.dvalues[i] = 0;
			}
		}
		cntLevels() {
			return this.next.length;
		}
	}

	class SLFindResult {
		constructor(sum_values=null,lvlpath=null,find_equal=false) {
			this.sum_values = sum_values;
			this.find_equal = find_equal;
			this.lvlpath = lvlpath;
		}
		findedNode() {
			return this.lvlpath[0].next[0];
		}
		getNextNodeOnPath(lvl,steps=1) {
			var node = this.lvlpath[lvl];
			for(var i=0;i<steps;i++){
				if (node === null) return null;
				node = node.next[lvl];
			}
			return node;
		}
		setNextNodeOnPath(new_node,value) {
			var new_sumvalue = this.sum_values[0] + value;
			for (var lvl=0;lvl<this.lvlpath.length;lvl++) {
				let prev_node = this.lvlpath[lvl];
				if (lvl < new_node.cntLevels()) { // then, updates linked list and dvalues values
					let next_node = prev_node.next[lvl];
					// updating linked list
					new_node.next[lvl] = next_node;
					prev_node.next[lvl] = new_node;
					// updating dvalues
					let prev_sumvalue = this.sum_values[lvl];
					let new_next_sumvalue = prev_sumvalue + value + prev_node.dvalues[lvl];	
					prev_node.dvalues[lvl] = new_sumvalue-prev_sumvalue;
					new_node.dvalues[lvl] = new_next_sumvalue-new_sumvalue;
				} else { // update only dvalues of prev_node
					prev_node.dvalues[lvl] += value;
				}
			}
		}
		updateDValuesOnPath(dvalue) {
			for(var lvl=0;lvl<this.lvlpath.length;lvl++) {
				this.lvlpath[lvl].dvalues[lvl] += dvalue;
			}
		}
		removeFindedNode() {
			var finded_node = this.findedNode();
			var value = this.lvlpath[0].dvalues[0];
			for (var lvl=0;lvl<this.lvlpath.length;lvl++) {
				if (lvl < finded_node.cntLevels()) {
					var prev_node = this.lvlpath[lvl];
					var next_node = finded_node.next[lvl];
					// updating linked list
					prev_node.next[lvl] = next_node;
					// updating dvalues
					var prev_sum_value = this.sum_values[lvl];
					var new_next_sum_value = prev_sum_value + prev_node.dvalues[lvl] + finded_node.dvalues[lvl] - value;
					prev_node.dvalues[lvl] = new_next_sum_value-prev_sum_value;
				} else {
					this.lvlpath[lvl].dvalues[lvl] -= value;
				}
			}
			// returning the new neighborhood keys at first level
			return [this.lvlpath[0].key,this.lvlpath[0].next[0].key];
		}
	}
	
	var __find = function(skiplist,key) {
		var curr_node = skiplist._head;
		var curr_lvl = skiplist._levels-1;
		var curr_sum = 0;
		var sum_values = new Array(skiplist._levels);
		var lvlpath = new Array(skiplist._levels);
		var result;
		while (curr_lvl >= 0) {
			result = skiplist._cmp_func(key,curr_node.next[curr_lvl].key);
			if (result == GREATER) {
				curr_sum += curr_node.dvalues[curr_lvl];
				curr_node = curr_node.next[curr_lvl];
			} else { // else, result is equal to LESS or EQUAL
				lvlpath[curr_lvl] = curr_node;
				sum_values[curr_lvl] = curr_sum;
				curr_lvl--;
			}
		}
		return new SLFindResult(sum_values,lvlpath,result == EQUAL);
	}
	
	var __randLevels = function(prob,numlvls) {
		var cnt = 1;
		while (Math.random() > prob && cnt < numlvls) cnt++;
		return cnt;
	}
	
	var __removeNode = function(skiplist,find_result) {
		skiplist._size -= 1;
		// remove node and return the new neighborhood rays
		return [find_result.removeFindedNode()];
	}

	class Skiplist {
		constructor(n,p,cmp_func,get_func,set_func,clone_func,sent1,sent2,tie_rule = INSERT_THE_EQUAL) {
			this._levels = n;
			this._p = p;
			// head and tail are sentinel keys on leftmost (lesser) and rightmost (greatest)
			this._head = new SLNode(sent1,n);
			this._tail = new SLNode(sent2,n);
			for(let i=0;i<n;i++) {
				this._head.next[i] = this._tail; // at the beginning head points to tail in all levels
				this._tail.next[i] = null;
			}
			this._size = 0; // count of non-sentinel keys in skiplist
			this._cmp_func = cmp_func;
			this._get_keyvalue = get_func;
			this._set_keyvalue = set_func;
			this._clone_func = clone_func;
			this._tie_rule = tie_rule;
		}
		setCompareFunction(cmp_func) {
			this._cmp_func = cmp_func;
		}
		getRange(begin,end = null, more1inrange = false) {
			// if end = null, returns all values equal to begin
			// else, returns all values in range (begin,end)
			// optionally, one value lesser key is added at the begining and greatest at end if more1inrange is true
			if (end === null) end = begin;
			var find_result = __find(this,begin);
			var curr_node = find_result.lvlpath[0];
			var keys = [], sum_values = [];
			var curr_sum = find_result.sum_values[0]; // the sum of values on the left of finded value;
			if (more1inrange) {
				keys.push(curr_node.key); // one key before the range
				sum_values.push(curr_sum);
			}
			curr_sum += curr_node.dvalues[0];
			curr_node = curr_node.next[0];
			while (curr_node !== null && this._cmp_func(curr_node.key,end) != GREATER) {
				keys.push(curr_node.key);
				sum_values.push(curr_sum);
				curr_sum += curr_node.dvalues[0];
				curr_node = curr_node.next[0];
			}
			if (more1inrange && curr_node !== null) {
				keys.push(curr_node.key); // one key after the range
				sum_values.push(curr_sum);
			}
			return {keys: keys, sum_values: sum_values};
		}
		getKeys(clone = false) {
			// get all keys in skiplist
			let keys = [];
			let node = this._head;
			while (node !== null) {
				keys.push(clone === true ? this._clone_func(node.key) : node.key);
				node = node.next[0];
			}
			return keys;
		}
		insert(key) {
			var value = this._get_keyvalue(key);
			var find_result = __find(this,key);
			
			if (this._tie_rule == SUM_TIE_VALUES && find_result.find_equal) {
				let equal_node = find_result.findedNode();
				let equal_node_value = this._get_keyvalue(equal_node.key);
				if (equal_node_value + value === 0) {
					// remove (cancel) the node from skiplist!
					return __removeNode(this,find_result);
				} else { // else, update value and path
					this._set_keyvalue(equal_node.key,equal_node_value+value);
					find_result.updateDValuesOnPath(value);
					return []; // there are not new neighborhood keys...
				}
			} else {
				let random_levels = __randLevels(this._p,this._levels);
				let new_node = new SLNode(key,random_levels);
				find_result.setNextNodeOnPath(new_node,value);
				this._size += 1;
				return [[find_result.lvlpath[0].key,key],[key,find_result.getNextNodeOnPath(0,2).key]];
			}
		}
		remove(key) {
			var find_result = __find(this,key);
			/*if (!find_result.find_equal) {
				console.log("******************************");
				console.log(key.clone());
				console.log(find_result.findedNode().key.clone());
				console.log(this.getKeys(true));
				console.log("******************************");
			}*/
			return __removeNode(this,find_result);
		}
		removeAllKeysEqualTo(key) {
			var find_result = __find(this,key);
			var removed_keys = [];
			while (find_result.find_equal) { // if there aren't equal values :: nothing more to do
				removed_keys.push(find_result.findedNode().key);
				__removeNode(this,find_result);
				find_result = __find(this,key);
			}
			return removed_keys;
		}
		static computeMaxLevels(size) { // computing a max level for the Skiplist data structure
			let result = Math.floor(Math.log2(Math.sqrt(size)));
			return result < 3 ? 3 : result;
		}
		toString() {
			var str_values = '';
			var str_lines = new Array(this._levels);
			for (var i=0;i<this._levels;i++) str_lines[i] = '';
			var node = this._head;
			while (node !== null) {
				str_values += '<br>key: '+ node.key.toString() + ' | next: ';
				for (var curr_lvl=this._levels-1;curr_lvl>=0;curr_lvl--) {
					if (curr_lvl >= node.cntLevels()) {
						str_lines[curr_lvl] += '---------';
					} else {
						if (node.next[curr_lvl] === null) {
							str_values += 'null | ';
						} else {
							str_values += node.next[curr_lvl].key.toString() + ' | ';
						}
						if (node.next[0] === null) {
							str_lines[curr_lvl] += '|--null';
						} else {
							var str_ds;
							if (typeof node.dvalues[curr_lvl] === 'undefined')
								str_ds = '?   ';
							else {
								str_ds = node.dvalues[curr_lvl].toString();
								while (str_ds.length<2) str_ds += ' ';
							}
							str_lines[curr_lvl] += '|-- '+str_ds+' --';
						}
					}
				}
				node = node.next[0]; //next at first level
			}
			var str = '<pre>------<br>Skiplist Data Structure<br>';
			for (i=this._levels-1;i>=0;i--) str += str_lines[i]+'<br>';
			str += '-----<br>Values'+str_values+'</pre>';
			return str;
		}
		assertNodes(x,y) {
			var node = this._head;
			while (node.next[0] !== null) {
				let result = node.key.compare_rays(node.next[0].key);
				console.assert(result != GREATER,'Unordered scanline not expected! Problem found between '+node.key.toString()+' and '+node.next[0].key.toString()+'. result = '+result);
				node = node.next[0];
			}
		}
	}
	
	return Skiplist;
})(); // define and call`
)}

function _38(md){return(
md`At end, a class to control the plane sweeping process: priority queue, active list, ray intersect detection and other useful interfaces. `
)}

function _Scanline(Constants,Coordinates,Angle,Point,PriorityQueue,Event,Ray,Skiplist,ScanlnStatus){return(
(function() {
	
	let {LESS,GREATER,EQUAL,FORWARD,PREPARE,EVENTINTER,EVENTINSERT,SUM_TIE_VALUES,PROB} = Constants;
	let {eqCoord,lsCoord,gtCoord,compareTheta} = Coordinates;
	
	// 'private' methods
	var __initInsertEvents = function(sl) {
		let horizon_theta = new Angle(new Point(0,0),new Point(100,0));
		let events = new PriorityQueue(Event.compare_first_is_lesser);
		for (let i=0;i<sl.sectors.length;i++) {
			let sec = sl.sectors[i];
			events.push(new Event(EVENTINSERT,new Ray(sec.apex,sec.theta,sec.w)));
			events.push(new Event(EVENTINSERT,new Ray(sec.apex,horizon_theta,-sec.w)));
		}
		return events;
	}
	var __initActiveRays = function(bbox,size) {
		// creating two sentinel and vertical rays
		let theta = new Angle(new Point(0,0),new Point(0,bbox[3]-bbox[1]));
		let left_sentinel = new Ray(new Point(bbox[0]-1,bbox[1]-1),theta,0);
		let right_sentinel = new Ray(new Point(bbox[2]+1,bbox[1]-1),theta,0);
		var maxlevels = Skiplist.computeMaxLevels(size);
		return new Skiplist(maxlevels,PROB,Ray.compare_rays_static,Ray.get_ds_static,Ray.set_ds_static,Ray.clone_static,left_sentinel,right_sentinel,SUM_TIE_VALUES);
	}
	var __prepareNextScan = function(scanln){
		if (scanln.scan_prepared) return; //nothing to do
		// update the current x, y and inicial theta. Max function enforces that y_curr does not swept down due float operations errors
		ScanlnStatus.x_curr = scanln.events.peek().x();
		ScanlnStatus.y_curr = Math.max(ScanlnStatus.y_curr,scanln.events.peek().y());
		ScanlnStatus.theta_curr = new Angle();
		scanln._events_processed = 0;
		scanln.scan_prepared = true;
	}
	var __processNextPoint = function(scanln) {
		// Processing INTERSECTION EVENTS (they always come first at a same point in scan order)
		if (scanln.events.peek().type == EVENTINTER) {
			let e_inter = scanln.events.pop();
			if (scanln.reinsertInActiveRays(e_inter.ray)) scanln._events_processed++;
			// To remove any duplicate intersection events
			while (scanln.thereIsInterEvent()) scanln.events.pop();
		}
		// Processing INSERT EVENTS
		while (!scanln.endOfEvents() && eqCoord(scanln.events.peek().x(),ScanlnStatus.x_curr) && eqCoord(scanln.events.peek().y(),ScanlnStatus.y_curr)) {
			let e_ins = scanln.events.pop();
			ScanlnStatus.theta_curr = e_ins.ray.theta;
			scanln.insertInActiveRays(e_ins.ray);
			scanln._events_processed++;
		}
		// all events at point [x_curr,y_curr] were processed
		scanln.scan_prepared = false;
	}
	
	var __detectNewIntersectEvents = function(scanln,neig_rays){
		// detecting new intersect events...
		let theta = new Angle(new Point(0,0),new Point(0,100));
		for (let i=0;i<neig_rays.length;i++) {
			// neig_rays.length in {0,1,2}
			let r1 = neig_rays[i][0];
			let r2 = neig_rays[i][1];
			let p = __computeFutherIntersectionPoint(r1,r2,scanln.bbox);
			if (p === null) continue;
			scanln.events.push(new Event(EVENTINTER,new Ray(p,theta,null)));
		}
	}
	
	var __computeFutherIntersectionPoint = function(r1,r2,bbox) {
		  let p = r1.inter(r2);
		  if (p === null) return null;
		  if (p.x < bbox[0]) return null;
		  if (p.y < bbox[1]) return null;
		  if (p.x > bbox[2]) return null;
		  if (p.y > bbox[3]) return null;
		  if (lsCoord(p.y,ScanlnStatus.y_curr)) return null;
		  if (gtCoord(p.y,ScanlnStatus.y_curr)) return p;
		  if (lsCoord(p.x,ScanlnStatus.x_curr)) return null;
		  if (gtCoord(p.x,ScanlnStatus.x_curr)) return p;
		  if (ScanlnStatus.theta_curr.compare(r1.theta) != GREATER) return null;
		  if (ScanlnStatus.theta_curr.compare(r2.theta) == LESS) return null;
		  return p;
	  }
	
	class Scanline {
	  constructor(sl) {
		const DELTA = Math.max(sl.bbox[3]-sl.bbox[1],sl.bbox[2]-sl.bbox[0])*0.5;
		this.bbox = [sl.bbox[0]-DELTA,sl.bbox[1]-DELTA,sl.bbox[2]+DELTA,sl.bbox[3]+DELTA];
		this.scan_prepared = false;
		this._events_processed = 0;
		ScanlnStatus.x_curr = this.bbox[0]-1;
		ScanlnStatus.y_curr = this.bbox[1]-1;
		ScanlnStatus.theta_curr = new Angle();
		this.events = __initInsertEvents(sl);
		this.active_rays = __initActiveRays(this.bbox,this.events.size());
	  }
	  endOfEvents() {
		  return this.events.size() === 0;
	  }
	  xCurr() {
		  return ScanlnStatus.x_curr;
	  }
	  yCurr() {
		  return ScanlnStatus.y_curr;
	  }
	  scan(mode = FORWARD) {
		  if (this.endOfEvents()) return false; //nothing to do
		  if (!this.scan_prepared || mode == PREPARE) {
			__prepareNextScan(this);
			if (mode == PREPARE) return true; // else, forwards to the second step
		  }
		  __processNextPoint(this);
		  //println('scan stopped!',this.active_rays.toString());
		  //this.active_rays.assertNodes(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		  return !this.endOfEvents();
	  }
	  getRaysInCurrPoint(clone_rays,more1inrange) {
		  // Get rays at [x_curr,ycurr] and one ray after and one before
		  this.active_rays.setCompareFunction(Ray.compare_ray_inters_static);
		  let pivot = new Ray(new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr),new Angle(new Point(0,0),new Point(1,0)),null);
		  let {keys,sum_values} = this.active_rays.getRange(pivot,null,more1inrange);
		  let result = {rays: keys, svalues_at: sum_values};
		  if (!clone_rays) return result;
		  
		  // Else, we clone the rays to protect from outside editions and the result objects that are pass by reference, do not change in scan progress...
		  let cloned_rays = Array(result.rays.length);
		  for (let i=0;i<result.rays.length;i++) {
			  cloned_rays[i] = result.rays[i].clone();
		  }
		  return {rays: cloned_rays, svalues_at: sum_values};
	  }
	  getRays() {
		  // return the array of active rays in scanline
		  return this.active_rays.getKeys();
	  }
	  insertInActiveRays(ray) {
		  this.active_rays.setCompareFunction(Ray.compare_rays_static);
		  var neig_rays = this.active_rays.insert(ray);
		  __detectNewIntersectEvents(this,neig_rays);
	  }
	  reinsertInActiveRays(ray,detect_neighs = true) { // remove and insert again all rays at point top update sort order in scanline
		  this.active_rays.setCompareFunction(Ray.compare_ray_inters_static);
		  let removed_rays = this.active_rays.removeAllKeysEqualTo(ray);
		  if (removed_rays.length === 0) return false;
		  this.active_rays.setCompareFunction(Ray.compare_rays_static);
		  for(var i=0;i<removed_rays.length;i++) {
			let r = removed_rays[i];
			let neig_rays = this.active_rays.insert(r); // reinsert in the correct order...
			if (detect_neighs && (i == 0 || i == removed_rays.length-1)) __detectNewIntersectEvents(this,neig_rays);
		  }
		  
		  return removed_rays.length > 1;
	  }
	  eventsProcessed() {
		  return this._events_processed;
	  }
	  thereIsInterEvent() { // there is intersect event at x_curr,y_curr
		  return (!this.endOfEvents() && eqCoord(this.events.peek().x(),ScanlnStatus.x_curr) && eqCoord(this.events.peek().y(),ScanlnStatus.y_curr) && this.events.peek().type == EVENTINTER);
	  }
	}
	
	return Scanline;
})()
)}

function _40(cell){return(
cell`Scanline = (function() {
	
	let {LESS,GREATER,EQUAL,FORWARD,PREPARE,EVENTINTER,EVENTINSERT,SUM_TIE_VALUES,PROB} = Constants;
	let {eqCoord,lsCoord,gtCoord,compareTheta} = Coordinates;
	
	// 'private' methods
	var __initInsertEvents = function(sl) {
		let horizon_theta = new Angle(new Point(0,0),new Point(100,0));
		let events = new PriorityQueue(Event.compare_first_is_lesser);
		for (let i=0;i<sl.sectors.length;i++) {
			let sec = sl.sectors[i];
			events.push(new Event(EVENTINSERT,new Ray(sec.apex,sec.theta,sec.w)));
			events.push(new Event(EVENTINSERT,new Ray(sec.apex,horizon_theta,-sec.w)));
		}
		return events;
	}
	var __initActiveRays = function(bbox,size) {
		// creating two sentinel and vertical rays
		let theta = new Angle(new Point(0,0),new Point(0,bbox[3]-bbox[1]));
		let left_sentinel = new Ray(new Point(bbox[0]-1,bbox[1]-1),theta,0);
		let right_sentinel = new Ray(new Point(bbox[2]+1,bbox[1]-1),theta,0);
		var maxlevels = Skiplist.computeMaxLevels(size);
		return new Skiplist(maxlevels,PROB,Ray.compare_rays_static,Ray.get_ds_static,Ray.set_ds_static,Ray.clone_static,left_sentinel,right_sentinel,SUM_TIE_VALUES);
	}
	var __prepareNextScan = function(scanln){
		if (scanln.scan_prepared) return; //nothing to do
		// update the current x, y and inicial theta. Max function enforces that y_curr does not swept down due float operations errors
		ScanlnStatus.x_curr = scanln.events.peek().x();
		ScanlnStatus.y_curr = Math.max(ScanlnStatus.y_curr,scanln.events.peek().y());
		ScanlnStatus.theta_curr = new Angle();
		scanln._events_processed = 0;
		scanln.scan_prepared = true;
	}
	var __processNextPoint = function(scanln) {
		// Processing INTERSECTION EVENTS (they always come first at a same point in scan order)
		if (scanln.events.peek().type == EVENTINTER) {
			let e_inter = scanln.events.pop();
			if (scanln.reinsertInActiveRays(e_inter.ray)) scanln._events_processed++;
			// To remove any duplicate intersection events
			while (scanln.thereIsInterEvent()) scanln.events.pop();
		}
		// Processing INSERT EVENTS
		while (!scanln.endOfEvents() && eqCoord(scanln.events.peek().x(),ScanlnStatus.x_curr) && eqCoord(scanln.events.peek().y(),ScanlnStatus.y_curr)) {
			let e_ins = scanln.events.pop();
			ScanlnStatus.theta_curr = e_ins.ray.theta;
			scanln.insertInActiveRays(e_ins.ray);
			scanln._events_processed++;
		}
		// all events at point [x_curr,y_curr] were processed
		scanln.scan_prepared = false;
	}
	
	var __detectNewIntersectEvents = function(scanln,neig_rays){
		// detecting new intersect events...
		let theta = new Angle(new Point(0,0),new Point(0,100));
		for (let i=0;i<neig_rays.length;i++) {
			// neig_rays.length in {0,1,2}
			let r1 = neig_rays[i][0];
			let r2 = neig_rays[i][1];
			let p = __computeFutherIntersectionPoint(r1,r2,scanln.bbox);
			if (p === null) continue;
			scanln.events.push(new Event(EVENTINTER,new Ray(p,theta,null)));
		}
	}
	
	var __computeFutherIntersectionPoint = function(r1,r2,bbox) {
		  let p = r1.inter(r2);
		  if (p === null) return null;
		  if (p.x < bbox[0]) return null;
		  if (p.y < bbox[1]) return null;
		  if (p.x > bbox[2]) return null;
		  if (p.y > bbox[3]) return null;
		  if (lsCoord(p.y,ScanlnStatus.y_curr)) return null;
		  if (gtCoord(p.y,ScanlnStatus.y_curr)) return p;
		  if (lsCoord(p.x,ScanlnStatus.x_curr)) return null;
		  if (gtCoord(p.x,ScanlnStatus.x_curr)) return p;
		  if (ScanlnStatus.theta_curr.compare(r1.theta) != GREATER) return null;
		  if (ScanlnStatus.theta_curr.compare(r2.theta) == LESS) return null;
		  return p;
	  }
	
	class Scanline {
	  constructor(sl) {
		const DELTA = Math.max(sl.bbox[3]-sl.bbox[1],sl.bbox[2]-sl.bbox[0])*0.5;
		this.bbox = [sl.bbox[0]-DELTA,sl.bbox[1]-DELTA,sl.bbox[2]+DELTA,sl.bbox[3]+DELTA];
		this.scan_prepared = false;
		this._events_processed = 0;
		ScanlnStatus.x_curr = this.bbox[0]-1;
		ScanlnStatus.y_curr = this.bbox[1]-1;
		ScanlnStatus.theta_curr = new Angle();
		this.events = __initInsertEvents(sl);
		this.active_rays = __initActiveRays(this.bbox,this.events.size());
	  }
	  endOfEvents() {
		  return this.events.size() === 0;
	  }
	  xCurr() {
		  return ScanlnStatus.x_curr;
	  }
	  yCurr() {
		  return ScanlnStatus.y_curr;
	  }
	  scan(mode = FORWARD) {
		  if (this.endOfEvents()) return false; //nothing to do
		  if (!this.scan_prepared || mode == PREPARE) {
			__prepareNextScan(this);
			if (mode == PREPARE) return true; // else, forwards to the second step
		  }
		  __processNextPoint(this);
		  //println('scan stopped!',this.active_rays.toString());
		  //this.active_rays.assertNodes(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		  return !this.endOfEvents();
	  }
	  getRaysInCurrPoint(clone_rays,more1inrange) {
		  // Get rays at [x_curr,ycurr] and one ray after and one before
		  this.active_rays.setCompareFunction(Ray.compare_ray_inters_static);
		  let pivot = new Ray(new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr),new Angle(new Point(0,0),new Point(1,0)),null);
		  let {keys,sum_values} = this.active_rays.getRange(pivot,null,more1inrange);
		  let result = {rays: keys, svalues_at: sum_values};
		  if (!clone_rays) return result;
		  
		  // Else, we clone the rays to protect from outside editions and the result objects that are pass by reference, do not change in scan progress...
		  let cloned_rays = Array(result.rays.length);
		  for (let i=0;i<result.rays.length;i++) {
			  cloned_rays[i] = result.rays[i].clone();
		  }
		  return {rays: cloned_rays, svalues_at: sum_values};
	  }
	  getRays() {
		  // return the array of active rays in scanline
		  return this.active_rays.getKeys();
	  }
	  insertInActiveRays(ray) {
		  this.active_rays.setCompareFunction(Ray.compare_rays_static);
		  var neig_rays = this.active_rays.insert(ray);
		  __detectNewIntersectEvents(this,neig_rays);
	  }
	  reinsertInActiveRays(ray,detect_neighs = true) { // remove and insert again all rays at point top update sort order in scanline
		  this.active_rays.setCompareFunction(Ray.compare_ray_inters_static);
		  let removed_rays = this.active_rays.removeAllKeysEqualTo(ray);
		  if (removed_rays.length === 0) return false;
		  this.active_rays.setCompareFunction(Ray.compare_rays_static);
		  for(var i=0;i<removed_rays.length;i++) {
			let r = removed_rays[i];
			let neig_rays = this.active_rays.insert(r); // reinsert in the correct order...
			if (detect_neighs && (i == 0 || i == removed_rays.length-1)) __detectNewIntersectEvents(this,neig_rays);
		  }
		  
		  return removed_rays.length > 1;
	  }
	  eventsProcessed() {
		  return this._events_processed;
	  }
	  thereIsInterEvent() { // there is intersect event at x_curr,y_curr
		  return (!this.endOfEvents() && eqCoord(this.events.peek().x(),ScanlnStatus.x_curr) && eqCoord(this.events.peek().y(),ScanlnStatus.y_curr) && this.events.peek().type == EVENTINTER);
	  }
	}
	
	return Scanline;
})(); // define and call`
)}

function _41(md){return(
md`### Ancillary Classes for convertions from Sector List to some common geometrical data structures`
)}

function _42(md){return(
md`A simple trapezium to the trapezoidal decomposition from Sector Lists.`
)}

function _Trapezium(Polygon){return(
(function() {
	// map of coordinates
	//        x3     x4
	//    ymax _______
	//        /       \
	//       /         \
	// ymin /___________\
	//      x1          x2
	class Trapezium {
		constructor(x1,x2,x3,x4,ymin,ymax,w) {
			this.x1 = x1;
			this.x2 = x2;
			this.x3 = x3;
			this.x4 = x4;
			this.ymin = ymin;
			this.ymax = ymax;
			this.w = w;
		}
		area() {
			return 0.5*(this.ymax-this.ymin)*(this.x2+this.x4-this.x1-this.x3);
		}
		toPolygon(id=0) {
			let outer_ring = [
				{x: this.x1, y: this.ymin},
				{x: this.x2, y: this.ymin},
				{x: this.x4, y: this.ymax},
				{x: this.x3, y: this.ymax},
				{x: this.x1, y: this.ymin}
			];
			return new Polygon(id,this.w,outer_ring);
		}
	};
	
	return Trapezium;
})()
)}

function _44(cell){return(
cell`Trapezium = (function() {
	// map of coordinates
	//        x3     x4
	//    ymax _______
	//        /       \
	//       /         \
	// ymin /___________\
	//      x1          x2
	class Trapezium {
		constructor(x1,x2,x3,x4,ymin,ymax,w) {
			this.x1 = x1;
			this.x2 = x2;
			this.x3 = x3;
			this.x4 = x4;
			this.ymin = ymin;
			this.ymax = ymax;
			this.w = w;
		}
		area() {
			return 0.5*(this.ymax-this.ymin)*(this.x2+this.x4-this.x1-this.x3);
		}
		toPolygon(id=0) {
			let outer_ring = [
				{x: this.x1, y: this.ymin},
				{x: this.x2, y: this.ymin},
				{x: this.x4, y: this.ymax},
				{x: this.x3, y: this.ymax},
				{x: this.x1, y: this.ymin}
			];
			return new Polygon(id,this.w,outer_ring);
		}
	};
	
	return Trapezium;
})(); // define and call`
)}

function _45(md){return(
md`A straightforward data struture representing monotone chains to convert Sector Lists in vertex circulations using the plane sweep paradigm.`
)}

function _MTC_ActiveList(Constants,Coordinates,Ray,Point,ScanlnStatus,Angle,Skiplist,Polygon){return(
(function(){
	
	let {LESS,GREATER,EQUAL,OPENS,CLOSES,INSERT_THE_EQUAL} = Constants;
	let {eqPoint} = Coordinates;
	
	class MonoToneChain {
		constructor(value,opensegment,p0,type) {
			this.value = value;
			this.type = type;
			this.lastsegment = null;
			this.opensegment = opensegment;
			this.vertex = [p0]; // init with the first vertice
			this.mtc_begin = null; // pointers to others mtcs connected at the beginned and at the end
			this.mtc_end = null;
			this.outside_mtc = null;
			this.id = null; // to identify the vertex circulation to which it belongs
		}
		clone() {
			let cloned = new MonoToneChain(this.value,null,0,0,this.type);
			cloned.vertex = this.vertex.slice(0);
			cloned.opensegment = (this.opensegment === null ? null : this.opensegment.clone());
			cloned.lastsegment = (this.lastsegment === null ? null : this.lastsegment.clone());
			cloned.id = this.id;
			return cloned;
		}
		static clone(mtc) {
			return mtc.clone();
		}
		reopen(segment) {
			this.opensegment = segment;
		}
		isOpened() {
			return this.opensegment !== null;
		}
		isNew() { // the MTC was created recently
			return this.lastsegment === null;
		}
		setMTCBegin(other) {
			this.mtc_begin = other;
		}
		setMTCEnd(other) {
			this.mtc_end = other;
		}
		closeSegment(p) {
			if (this.opensegment === null) return false; // there is not open segment to close...
			if (this.lastsegment !== null && this.lastsegment.theta.compare(this.opensegment.theta) == EQUAL) {
				// then, the new point is colinear to last point,
				// so the last point is updated
				this.vertex[this.vertex.length-1] = p;
			} else {
				// otherwise, the new point is added to array
				this.vertex.push(p);
			}
			this.lastsegment = this.opensegment;
			this.opensegment = null;
			return true;
		}
		static compare_mtc_inters_static(m1,m2) {
			let r1 = (m1.opensegment === null ? m1.lastsegment : m1.opensegment);
			let r2 = (m2.opensegment === null ? m2.lastsegment : m2.opensegment);
			return Ray.compare_ray_inters_static(r1,r2);
		}
		static compare_mtcs_static(m1,m2) {
			let r1 = (m1.opensegment === null ? m1.lastsegment : m1.opensegment);
			let r2 = (m2.opensegment === null ? m2.lastsegment : m2.opensegment);
			let result = Ray.compare_rays_static(r1,r2);
			if (result != EQUAL) return result;
			if (m1.type == OPENS && m2.type == CLOSES) return GREATER;
			if (m1.type == CLOSES && m2.type == OPENS) return LESS;
			if (m1.value > m2.value) return GREATER;
			if (m1.value < m2.value) return LESS;
			return EQUAL;
		}
	}
		
	var __endsAllSegmentsAtPoint = function(actmtcs) {
		let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		let theta = new Angle(new Point(0,0),new Point(0,1));
		let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
		actmtcs.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
		let mtcs = actmtcs.getRange(pivot,null,false).keys; // get all mcts that cross (x,y)
		for (let i=0;i<mtcs.length;i++) {
			mtcs[i].closeSegment(p);
		}
	}
	
	var __linkMonochainEnds = function(mtcs) {
		// link the news and finished mtcs
		for (let i=1;i<mtcs.length-2;i++) {
			for (let j=i+1;j<mtcs.length-1;j++) {
				let mtc1 = mtcs[i];
				let mtc2 = mtcs[j];
				if (mtc1.value == mtc2.value) { // in the same circulation?
					let p1 = (mtc1.isNew() ? mtc1.vertex[0] : (!mtc1.isOpened() ? mtc2.vertex[mtc2.vertex.length-1] : null));
					let p2 = (mtc2.isNew() ? mtc2.vertex[0] : (!mtc1.isOpened() ? mtc2.vertex[mtc2.vertex.length-1] : null));
					if (p1 !== null && p2 !== null) {
						if (eqPoint(p1,p2)) {
							mtc1.isNew() ? mtc1.setMTCBegin(mtc2) : mtc1.setMTCEnd(mtc2);
							mtc2.isNew() ? mtc2.setMTCBegin(mtc1) : mtc2.setMTCEnd(mtc1);
							break;
						}
					}
				}
			}
		}
	}
	
	var __checkFinishedMonochains = function(mtcs) {
		// remove finished mtcs from active list
		let finished_mtcs = [];
		for (let i=1;i<mtcs.length-1;i++) {
			if (!mtcs[i].isOpened()) {
				finished_mtcs.push(mtcs[i]);
			}
		}
		return finished_mtcs;
	}
	
	var __linkMonochainHoles = function(finished_mtcs,outside_mtc) {
		for (let i=0;i<finished_mtcs.length-1;i++) {
			let mtc1 = finished_mtcs[i];
			if (mtc1.type == OPENS) {
				for (let j=i+1;j<finished_mtcs.length;j++) {
					let mtc2 = finished_mtcs[j];
					if (mtc1.mtc_end === mtc2 && mtc2.mtc_end === mtc1 && mtc2.type == CLOSES) {
						mtc1.outside_mtc = outside_mtc;
						break;
					}
				}
			}
		}
	}
	
	var __linkAndFinishMonochains = function(actmtcs) {
		let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		let theta = new Angle(new Point(0,0),new Point(0,1));
		actmtcs.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
		let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
		let mtcs = actmtcs.getRange(pivot,null,true).keys; // get all mtcs that cross (x,y), one before e one after
		if (mtcs.length < 3) return []; // nothing to do... 
		
		__linkMonochainEnds(mtcs);
		let finished_mtcs = __checkFinishedMonochains(mtcs);
		actmtcs.setCompareFunction(MonoToneChain.compare_mtcs_static);
		__linkMonochainHoles(finished_mtcs,mtcs[mtcs.length-1]);
		for (let i=0;i<finished_mtcs.length;i++) {
			actmtcs.remove(finished_mtcs[i]);
		}
		return finished_mtcs;
	}
	
	class MTC_ActiveList {
		constructor(bbox,size) {
			let maxlevels = Skiplist.computeMaxLevels(size);
			const DELTA = Math.max(bbox[3]-bbox[1],bbox[2]-bbox[0])*0.5;
			let xmin = bbox[0]-DELTA;
			let ymin = bbox[1]-DELTA;
			let xmax = bbox[2]+DELTA;
			let ymax = bbox[3]+DELTA;
			let pnn = new Point(xmin,ymin);
			let pnx = new Point(xmin,ymax);
			let pxn = new Point(xmax,ymin);
			let pxx = new Point(xmax,ymax);
			let theta = new Angle(pnn,pnx);
			// creating and setting sentinels elemtens and their links
			let sentinel_min = new MonoToneChain(0,new Ray(pnn,theta,0),pnn,OPENS);
			sentinel_min.vertex = [pnn,pnx,pxx];
			let sentinel_max = new MonoToneChain(0,new Ray(pxn,theta,0),pxn,CLOSES);
			sentinel_max.vertex = [pnn,pxn,pxx];
			sentinel_min.setMTCBegin(sentinel_max);
			sentinel_max.setMTCBegin(sentinel_min);
			sentinel_min.setMTCEnd(sentinel_max);
			sentinel_max.setMTCEnd(sentinel_min);
			this.actv_mtchains = new Skiplist(maxlevels,0.5,MonoToneChain.compare_mtcs_static,(x) => 1,(x,y) => 1,MonoToneChain.clone_static,sentinel_min,sentinel_max,INSERT_THE_EQUAL);
			this.finished_mtcs = [sentinel_min,sentinel_max]; // both sentinels form the most outer circulation
		}
		insert(ray,svalue,type) {
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtcs_static);
			this.actv_mtchains.insert(new MonoToneChain(svalue,ray,p,type));
		}
		open1MTC(ray,svalue,type) {
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
			let pivot = new MonoToneChain(svalue,ray,p,type);
			let mtcs = this.actv_mtchains.getRange(pivot,null,false).keys; // get all mcts that cross (x_curr,y_curr)
			for (let i=0;i<mtcs.length;i++) {
				if (mtcs[i].value == svalue && mtcs[i].type == type && !mtcs[i].isOpened()) { // then, mtc will be reopened
					mtcs[i].reopen(ray);
					return true;
				}
			}
			return false;
		}
		beginNextPointInScan(there_is_inter_evnt) {
			if (there_is_inter_evnt) {
				this.reorderAtCurrPoint();
			}
			__endsAllSegmentsAtPoint(this.actv_mtchains);
		}

		reorderAtCurrPoint() {
			// we need reorder (remove and reinsert) all mtcs that cross (x,y)
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			let theta = new Angle(new Point(0,0),new Point(0,1));
			let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
			let removed_mtcs = this.actv_mtchains.removeAllKeysEqualTo(pivot);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtcs_static);
			for (let i=0;i<removed_mtcs.length;i++) {
				this.actv_mtchains.insert(removed_mtcs[i]);
			}
		}
		lastPointInScanWasFinished() {
			let res = __linkAndFinishMonochains(this.actv_mtchains);
			if (res.length > 0) this.finished_mtcs.push(...res);
		}
		getFinishedMTCs() {
			return this.finished_mtcs;
		}
		getResults() {
			const BEGIN = 0;
			const END = 1;
			let assignId = function(id,curr,ided_mtcs,src) {
				if (curr.id !== null) return 0;
				curr.id = id;
				ided_mtcs.push(curr);
				let cnt = curr.vertex.length;
				cnt += assignId(id,curr.mtc_begin,ided_mtcs);
				cnt += assignId(id,curr.mtc_end,ided_mtcs);
				return cnt;
			}
			let mountVertexCirculation = function(curr,vtxs,src,max_vtx,reverse) {
				if (vtxs.length == max_vtx) return vtxs;
				let new_vtxs = curr.vertex.slice(0);
				let rev = reverse;
				if (curr.type == CLOSES) rev = !rev;
				if (rev) new_vtxs.reverse();
				if (vtxs.length == 0) {
					vtxs = new_vtxs;
				} else if (eqPoint(vtxs[vtxs.length-1],new_vtxs[0])) {
					vtxs.push(...new_vtxs.slice(1));
				} else if (eqPoint(vtxs[0],new_vtxs[new_vtxs.length-1])) {
					new_vtxs.push(...vtxs.slice(1));
					vtxs = new_vtxs;
				} else {
					console.error('Linked list of Monotone Chains is invalid!');
					console.log(max_vtx);
					console.log(vtxs);
					console.log(new_vtxs);
					console.log(vtxs[vtxs.length-1]);
					console.log(new_vtxs[0]);
					console.log(eqPoint(vtxs[vtxs.length-1],new_vtxs[0]));
					console.log(eqPoint(vtxs[0],new_vtxs[new_vtxs.length-1]));
					return vtxs;
				}
				let next; 
				if (src == BEGIN) {
					next = curr.mtc_end;
					src = END;
				} else {
					next = curr.mtc_begin;
					src = BEGIN;
				}
				return mountVertexCirculation(next,vtxs,src,max_vtx,reverse);
			}
			
			let checkIfIsHole = function(mtcs) {
				for (let i=0;i<mtcs.length;i++) {
					if (mtcs[i].outside_mtc !== null && mtcs[i].outside_mtc.id != mtcs[i].id) {
						return mtcs[i].outside_mtc;
					}
				}
				return null;
			}
			
			let curr_id = 0; // a simply autoincremental identificator for mtchain's ids
			let ided_mtcs = {};
			let count_vtx_per_id = {};
			for (let i=0;i<this.finished_mtcs.length;i++) { // labeling the monotone chains...
				let mtc_curr = this.finished_mtcs[i];
				if (mtc_curr.id !== null) continue;
				let mtcs = [];
				let cnt = assignId(curr_id,mtc_curr,mtcs);
				ided_mtcs[curr_id] = mtcs;
				count_vtx_per_id[curr_id] = cnt-mtcs.length+1;
				curr_id++;
			}
			let polygons = {};
			let outer_rings = {};
			for (let id of Object.keys(ided_mtcs)) {
				outer_rings[id] = checkIfIsHole(ided_mtcs[id]);
				if (outer_rings[id] === null) polygons[id] = new Polygon(id,ided_mtcs[id][0].value);
			}
			for (let id of Object.keys(ided_mtcs)) {
				let outer_ring = outer_rings[id];
				let vc = mountVertexCirculation(ided_mtcs[id][0],[],BEGIN,count_vtx_per_id[id],outer_ring !== null);
				if (outer_ring !== null) {
					let id_outply = outer_ring.id;
					let cnt = 0;
					while (!(id_outply in polygons)) {
						id_outply = outer_rings[id_outply].id;
						cnt++;
						/*if (cnt > 10) {
							console.error("cnt > 10",id_outply);
							return ;
						}*/
					}
					polygons[id_outply].addInnerRing(vc);
				} else {
					polygons[id].setOuterRing(vc);
				}
			}
			
			return {mtcs: this.finished_mtcs, polygons: polygons};
		}
	};
	
	return MTC_ActiveList;
})()
)}

function _47(cell){return(
cell`MTC_ActiveList = (function(){
	
	let {LESS,GREATER,EQUAL,OPENS,CLOSES,INSERT_THE_EQUAL} = Constants;
	let {eqPoint} = Coordinates;
	
	class MonoToneChain {
		constructor(value,opensegment,p0,type) {
			this.value = value;
			this.type = type;
			this.lastsegment = null;
			this.opensegment = opensegment;
			this.vertex = [p0]; // init with the first vertice
			this.mtc_begin = null; // pointers to others mtcs connected at the beginned and at the end
			this.mtc_end = null;
			this.outside_mtc = null;
			this.id = null; // to identify the vertex circulation to which it belongs
		}
		clone() {
			let cloned = new MonoToneChain(this.value,null,0,0,this.type);
			cloned.vertex = this.vertex.slice(0);
			cloned.opensegment = (this.opensegment === null ? null : this.opensegment.clone());
			cloned.lastsegment = (this.lastsegment === null ? null : this.lastsegment.clone());
			cloned.id = this.id;
			return cloned;
		}
		static clone(mtc) {
			return mtc.clone();
		}
		reopen(segment) {
			this.opensegment = segment;
		}
		isOpened() {
			return this.opensegment !== null;
		}
		isNew() { // the MTC was created recently
			return this.lastsegment === null;
		}
		setMTCBegin(other) {
			this.mtc_begin = other;
		}
		setMTCEnd(other) {
			this.mtc_end = other;
		}
		closeSegment(p) {
			if (this.opensegment === null) return false; // there is not open segment to close...
			if (this.lastsegment !== null && this.lastsegment.theta.compare(this.opensegment.theta) == EQUAL) {
				// then, the new point is colinear to last point,
				// so the last point is updated
				this.vertex[this.vertex.length-1] = p;
			} else {
				// otherwise, the new point is added to array
				this.vertex.push(p);
			}
			this.lastsegment = this.opensegment;
			this.opensegment = null;
			return true;
		}
		static compare_mtc_inters_static(m1,m2) {
			let r1 = (m1.opensegment === null ? m1.lastsegment : m1.opensegment);
			let r2 = (m2.opensegment === null ? m2.lastsegment : m2.opensegment);
			return Ray.compare_ray_inters_static(r1,r2);
		}
		static compare_mtcs_static(m1,m2) {
			let r1 = (m1.opensegment === null ? m1.lastsegment : m1.opensegment);
			let r2 = (m2.opensegment === null ? m2.lastsegment : m2.opensegment);
			let result = Ray.compare_rays_static(r1,r2);
			if (result != EQUAL) return result;
			if (m1.type == OPENS && m2.type == CLOSES) return GREATER;
			if (m1.type == CLOSES && m2.type == OPENS) return LESS;
			if (m1.value > m2.value) return GREATER;
			if (m1.value < m2.value) return LESS;
			return EQUAL;
		}
	}
		
	var __endsAllSegmentsAtPoint = function(actmtcs) {
		let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		let theta = new Angle(new Point(0,0),new Point(0,1));
		let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
		actmtcs.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
		let mtcs = actmtcs.getRange(pivot,null,false).keys; // get all mcts that cross (x,y)
		for (let i=0;i<mtcs.length;i++) {
			mtcs[i].closeSegment(p);
		}
	}
	
	var __linkMonochainEnds = function(mtcs) {
		// link the news and finished mtcs
		for (let i=1;i<mtcs.length-2;i++) {
			for (let j=i+1;j<mtcs.length-1;j++) {
				let mtc1 = mtcs[i];
				let mtc2 = mtcs[j];
				if (mtc1.value == mtc2.value) { // in the same circulation?
					let p1 = (mtc1.isNew() ? mtc1.vertex[0] : (!mtc1.isOpened() ? mtc2.vertex[mtc2.vertex.length-1] : null));
					let p2 = (mtc2.isNew() ? mtc2.vertex[0] : (!mtc1.isOpened() ? mtc2.vertex[mtc2.vertex.length-1] : null));
					if (p1 !== null && p2 !== null) {
						if (eqPoint(p1,p2)) {
							mtc1.isNew() ? mtc1.setMTCBegin(mtc2) : mtc1.setMTCEnd(mtc2);
							mtc2.isNew() ? mtc2.setMTCBegin(mtc1) : mtc2.setMTCEnd(mtc1);
							break;
						}
					}
				}
			}
		}
	}
	
	var __checkFinishedMonochains = function(mtcs) {
		// remove finished mtcs from active list
		let finished_mtcs = [];
		for (let i=1;i<mtcs.length-1;i++) {
			if (!mtcs[i].isOpened()) {
				finished_mtcs.push(mtcs[i]);
			}
		}
		return finished_mtcs;
	}
	
	var __linkMonochainHoles = function(finished_mtcs,outside_mtc) {
		for (let i=0;i<finished_mtcs.length-1;i++) {
			let mtc1 = finished_mtcs[i];
			if (mtc1.type == OPENS) {
				for (let j=i+1;j<finished_mtcs.length;j++) {
					let mtc2 = finished_mtcs[j];
					if (mtc1.mtc_end === mtc2 && mtc2.mtc_end === mtc1 && mtc2.type == CLOSES) {
						mtc1.outside_mtc = outside_mtc;
						break;
					}
				}
			}
		}
	}
	
	var __linkAndFinishMonochains = function(actmtcs) {
		let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
		let theta = new Angle(new Point(0,0),new Point(0,1));
		actmtcs.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
		let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
		let mtcs = actmtcs.getRange(pivot,null,true).keys; // get all mtcs that cross (x,y), one before e one after
		if (mtcs.length < 3) return []; // nothing to do... 
		
		__linkMonochainEnds(mtcs);
		let finished_mtcs = __checkFinishedMonochains(mtcs);
		actmtcs.setCompareFunction(MonoToneChain.compare_mtcs_static);
		__linkMonochainHoles(finished_mtcs,mtcs[mtcs.length-1]);
		for (let i=0;i<finished_mtcs.length;i++) {
			actmtcs.remove(finished_mtcs[i]);
		}
		return finished_mtcs;
	}
	
	class MTC_ActiveList {
		constructor(bbox,size) {
			let maxlevels = Skiplist.computeMaxLevels(size);
			const DELTA = Math.max(bbox[3]-bbox[1],bbox[2]-bbox[0])*0.5;
			let xmin = bbox[0]-DELTA;
			let ymin = bbox[1]-DELTA;
			let xmax = bbox[2]+DELTA;
			let ymax = bbox[3]+DELTA;
			let pnn = new Point(xmin,ymin);
			let pnx = new Point(xmin,ymax);
			let pxn = new Point(xmax,ymin);
			let pxx = new Point(xmax,ymax);
			let theta = new Angle(pnn,pnx);
			// creating and setting sentinels elemtens and their links
			let sentinel_min = new MonoToneChain(0,new Ray(pnn,theta,0),pnn,OPENS);
			sentinel_min.vertex = [pnn,pnx,pxx];
			let sentinel_max = new MonoToneChain(0,new Ray(pxn,theta,0),pxn,CLOSES);
			sentinel_max.vertex = [pnn,pxn,pxx];
			sentinel_min.setMTCBegin(sentinel_max);
			sentinel_max.setMTCBegin(sentinel_min);
			sentinel_min.setMTCEnd(sentinel_max);
			sentinel_max.setMTCEnd(sentinel_min);
			this.actv_mtchains = new Skiplist(maxlevels,0.5,MonoToneChain.compare_mtcs_static,(x) => 1,(x,y) => 1,MonoToneChain.clone_static,sentinel_min,sentinel_max,INSERT_THE_EQUAL);
			this.finished_mtcs = [sentinel_min,sentinel_max]; // both sentinels form the most outer circulation
		}
		insert(ray,svalue,type) {
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtcs_static);
			this.actv_mtchains.insert(new MonoToneChain(svalue,ray,p,type));
		}
		open1MTC(ray,svalue,type) {
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
			let pivot = new MonoToneChain(svalue,ray,p,type);
			let mtcs = this.actv_mtchains.getRange(pivot,null,false).keys; // get all mcts that cross (x_curr,y_curr)
			for (let i=0;i<mtcs.length;i++) {
				if (mtcs[i].value == svalue && mtcs[i].type == type && !mtcs[i].isOpened()) { // then, mtc will be reopened
					mtcs[i].reopen(ray);
					return true;
				}
			}
			return false;
		}
		beginNextPointInScan(there_is_inter_evnt) {
			if (there_is_inter_evnt) {
				this.reorderAtCurrPoint();
			}
			__endsAllSegmentsAtPoint(this.actv_mtchains);
		}

		reorderAtCurrPoint() {
			// we need reorder (remove and reinsert) all mtcs that cross (x,y)
			let p = new Point(ScanlnStatus.x_curr,ScanlnStatus.y_curr);
			let theta = new Angle(new Point(0,0),new Point(0,1));
			let pivot = new MonoToneChain(0,new Ray(p,theta,null),p,OPENS);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtc_inters_static);
			let removed_mtcs = this.actv_mtchains.removeAllKeysEqualTo(pivot);
			this.actv_mtchains.setCompareFunction(MonoToneChain.compare_mtcs_static);
			for (let i=0;i<removed_mtcs.length;i++) {
				this.actv_mtchains.insert(removed_mtcs[i]);
			}
		}
		lastPointInScanWasFinished() {
			let res = __linkAndFinishMonochains(this.actv_mtchains);
			if (res.length > 0) this.finished_mtcs.push(...res);
		}
		getFinishedMTCs() {
			return this.finished_mtcs;
		}
		getResults() {
			const BEGIN = 0;
			const END = 1;
			let assignId = function(id,curr,ided_mtcs,src) {
				if (curr.id !== null) return 0;
				curr.id = id;
				ided_mtcs.push(curr);
				let cnt = curr.vertex.length;
				cnt += assignId(id,curr.mtc_begin,ided_mtcs);
				cnt += assignId(id,curr.mtc_end,ided_mtcs);
				return cnt;
			}
			let mountVertexCirculation = function(curr,vtxs,src,max_vtx,reverse) {
				if (vtxs.length == max_vtx) return vtxs;
				let new_vtxs = curr.vertex.slice(0);
				let rev = reverse;
				if (curr.type == CLOSES) rev = !rev;
				if (rev) new_vtxs.reverse();
				if (vtxs.length == 0) {
					vtxs = new_vtxs;
				} else if (eqPoint(vtxs[vtxs.length-1],new_vtxs[0])) {
					vtxs.push(...new_vtxs.slice(1));
				} else if (eqPoint(vtxs[0],new_vtxs[new_vtxs.length-1])) {
					new_vtxs.push(...vtxs.slice(1));
					vtxs = new_vtxs;
				} else {
					console.error('Linked list of Monotone Chains is invalid!');
					console.log(max_vtx);
					console.log(vtxs);
					console.log(new_vtxs);
					console.log(vtxs[vtxs.length-1]);
					console.log(new_vtxs[0]);
					console.log(eqPoint(vtxs[vtxs.length-1],new_vtxs[0]));
					console.log(eqPoint(vtxs[0],new_vtxs[new_vtxs.length-1]));
					return vtxs;
				}
				let next; 
				if (src == BEGIN) {
					next = curr.mtc_end;
					src = END;
				} else {
					next = curr.mtc_begin;
					src = BEGIN;
				}
				return mountVertexCirculation(next,vtxs,src,max_vtx,reverse);
			}
			
			let checkIfIsHole = function(mtcs) {
				for (let i=0;i<mtcs.length;i++) {
					if (mtcs[i].outside_mtc !== null && mtcs[i].outside_mtc.id != mtcs[i].id) {
						return mtcs[i].outside_mtc;
					}
				}
				return null;
			}
			
			let curr_id = 0; // a simply autoincremental identificator for mtchain's ids
			let ided_mtcs = {};
			let count_vtx_per_id = {};
			for (let i=0;i<this.finished_mtcs.length;i++) { // labeling the monotone chains...
				let mtc_curr = this.finished_mtcs[i];
				if (mtc_curr.id !== null) continue;
				let mtcs = [];
				let cnt = assignId(curr_id,mtc_curr,mtcs);
				ided_mtcs[curr_id] = mtcs;
				count_vtx_per_id[curr_id] = cnt-mtcs.length+1;
				curr_id++;
			}
			let polygons = {};
			let outer_rings = {};
			for (let id of Object.keys(ided_mtcs)) {
				outer_rings[id] = checkIfIsHole(ided_mtcs[id]);
				if (outer_rings[id] === null) polygons[id] = new Polygon(id,ided_mtcs[id][0].value);
			}
			for (let id of Object.keys(ided_mtcs)) {
				let outer_ring = outer_rings[id];
				let vc = mountVertexCirculation(ided_mtcs[id][0],[],BEGIN,count_vtx_per_id[id],outer_ring !== null);
				if (outer_ring !== null) {
					let id_outply = outer_ring.id;
					let cnt = 0;
					while (!(id_outply in polygons)) {
						id_outply = outer_rings[id_outply].id;
						cnt++;
						/*if (cnt > 10) {
							console.error("cnt > 10",id_outply);
							return ;
						}*/
					}
					polygons[id_outply].addInnerRing(vc);
				} else {
					polygons[id].setOuterRing(vc);
				}
			}
			
			return {mtcs: this.finished_mtcs, polygons: polygons};
		}
	};
	
	return MTC_ActiveList;
})();`
)}

function _48(md){return(
md`## The Sector List Implementation`
)}

function _49(md){return(
md`### The Sector Class`
)}

function _50(tex,md){return(
md`A **sector** models a scalar field in the shape of a "wedge'' or, more properly, a sector of a circle with infinite radius. The center of the circle is called the apex of the sector. One side of the sector is always horizontal, i.e., aligned with the x-axis. The other side, called the sector's **ray**, makes an angle smaller than ${tex`\pi`} radians with the horizontal side.

Thus, a sector object can be represented with three fields: the apex (a point), the ray angle, and the field value or *weight* (a non-zero integer number).`
)}

function _Sector(Constants,Coordinates){return(
(function(){
	
	let {LESS,GREATER,EQUAL} = Constants;
	let {lsCoord,gtCoord,eqPoint} = Coordinates;
	
	class Sector {
		constructor(apex,theta,w) {
			this.apex = apex;
			this.theta = theta;
			this.w = w;
		}
		clone() {
			return new Sector(this.apex.clone(),this.theta.clone(),this.w);
		}
		compare(other) { // compare two sector by the scan order rule
			Sector.compare_static(this,other);
		}
		static compare_static(a,b) {
			if (lsCoord(a.apex.y,b.apex.y)) return LESS;
			if (gtCoord(a.apex.y,b.apex.y)) return GREATER;
			if (lsCoord(a.apex.x,b.apex.x)) return LESS;
			if (gtCoord(a.apex.x,b.apex.x)) return GREATER;
			return b.theta.compare(a.theta);
		}
		equal(other) {
			return (eqPoint(this.apex,other.apex) && this.theta.compare(other.theta) == EQUAL);
		}
		toString() {
			return "Apex = ("+this.apex.x+","+this.apex.y+") | w = "+this.w+" | theta = ["+this.theta.dx+","+this.theta.dy+"]";
		}
	}
	return Sector;
})()
)}

function _52(cell){return(
cell`Sector = (function(){
	
	let {LESS,GREATER,EQUAL} = Constants;
	let {lsCoord,gtCoord,eqPoint} = Coordinates;
	
	class Sector {
		constructor(apex,theta,w) {
			this.apex = apex;
			this.theta = theta;
			this.w = w;
		}
		clone() {
			return new Sector(this.apex.clone(),this.theta.clone(),this.w);
		}
		compare(other) { // compare two sector by the scan order rule
			Sector.compare_static(this,other);
		}
		static compare_static(a,b) {
			if (lsCoord(a.apex.y,b.apex.y)) return LESS;
			if (gtCoord(a.apex.y,b.apex.y)) return GREATER;
			if (lsCoord(a.apex.x,b.apex.x)) return LESS;
			if (gtCoord(a.apex.x,b.apex.x)) return GREATER;
			return b.theta.compare(a.theta);
		}
		equal(other) {
			return (eqPoint(this.apex,other.apex) && this.theta.compare(other.theta) == EQUAL);
		}
		toString() {
			return "Apex = ("+this.apex.x+","+this.apex.y+") | w = "+this.w+" | theta = ["+this.theta.dx+","+this.theta.dy+"]";
		}
	}
	return Sector;
})(); // define and call`
)}

function _53(md){return(
md`### The Sector List Class (and its operations)`
)}

function _54(tex,md){return(
md`By adding sectors in the same representation, sector overlaps can be added in a differential approach. In this way, any integer scalar field whose boundaries are delimited by polygonal lines can be modeled by a sum of sectors.

Rather than using sets, sectors are more conveniently organized in *ordered* lists. The *y* coordinate of the sector apex is used as primary key, the *x* as secondary key and ${tex`-\theta`} as tertiary key. Henceforth we assume that SLs are given in a *canonical form*, which simplifies the implementation of several algorithms and ensures the *uniqueness* of the representation. Without loss of the generality, in a SL in canonical form: (1) no sector weight can be zero; (2) a sector angle is in range ${tex`(0,\pi)`}; and (3) no two sectors have the same position and angle. Note that these rules can be enforced quite simply by ordering the sectors and examining the sectors sequentially in the plane sweep. In particular, two sectors with the same position and angle will be consecutive in the proposed order and thus can be replaced by a single sector with their summed weight. `
)}

function _SectorList(Constants,Coordinates,Point,Sector,Trapezium,Angle,Scanline,Edge,MTC_ActiveList,Ray){return(
(function () {
  let {
    LESS,
    GREATER,
    EQUAL,
    FORWARD,
    PREPARE,
    CONVTP,
    CONVVC,
    DETECTEDGES,
    SCALARTRANSF,
    MORPH,
    DILATION,
    EROSION,
    VERTEXCIRCULATION,
    TRAPEZOIDALDECOMPOSITION,
    OPENS,
    CLOSES
  } = Constants;
  let { eqCoord, eqPoint, snapToGrid, setBoundingBox } = Coordinates;

  // 'private' methods

  var __createSectorsToMorph = function (
    p,
    ds,
    theta_ray,
    theta_morph,
    svalue,
    w_const,
    rayisentering,
    morpho_type
  ) {
    // returns a new sector with weight w, angle theta at a position
    // shifted by dx,dy.

    if (Math.abs(svalue) != Math.abs(w_const) && svalue != 0) {
      //error!
      throw (
        "The scalar field can map only two scalar values: 0 and " +
        w_const +
        ". However the scalar value " +
        svalue +
        " fouded. Aborting..."
      );
    }
    let w = rayisentering ? ds : -ds; // if the ray was removed (!rayisentering), then we need cancel the effect of a sector +ds on past in scanline inserting a sector -ds.
    let res = theta_ray.compare(theta_morph);
    if (res == EQUAL) {
      return []; // nothing to do... degenerated sectors would be created!
    }
    // where is inside from ray direction?
    let inside_is_ontheleft = ds == w_const;
    let factor; // uses dx,dy to morph or uses -dx,-dy?
    if (res == LESS) {
      factor = inside_is_ontheleft ? 1 : -1;
    } else {
      factor = inside_is_ontheleft ? -1 : 1;
    }
    if (morpho_type == EROSION) factor = -factor; // the above computation were made for dilation, so we need invert the factor for an erosion
    let p2 = new Point(
      p.x + theta_morph.dx * factor,
      p.y + theta_morph.dy * factor
    );
    var new_sectors = [];
    new_sectors.push(new Sector(p, theta_ray, -w));
    new_sectors.push(new Sector(p, theta_morph, w));
    new_sectors.push(new Sector(p2, theta_morph, -w));
    new_sectors.push(new Sector(p2, theta_ray, w));
    return new_sectors;
  };

  var __createTrapezium = function (r1, r2, y_curr, svalue) {
    if (eqCoord(r1.y_low, y_curr)) return null; // zero area trapezium will be created... nothing to do!
    let x1 = r1.interY(r1.y_low);
    let x2 = r2.interY(r1.y_low);
    let x3 = r1.interY(y_curr);
    let x4 = r2.interY(y_curr);
    return new Trapezium(x1, x2, x3, x4, r1.y_low, y_curr, svalue);
  };

  let defaultBbox = [-1000, 1000, 2000, 2000];
  Coordinates.setBoundingBox(defaultBbox);
  let __snapOn = true;

  class SectorList {
    constructor(bbox) {
      this.sectors = new Array();
      bbox ||= defaultBbox;
      this.curr_op = null;
      if (typeof bbox === "undefined") {
        throw "!";
      }
      this.bbox = bbox || defaultBbox;
    }

    static setDefaultBbox(bbox) {
      defaultBbox = bbox;
      Coordinates.setBoundingBox(bbox);
    }

    static getDefaultBbox() {
      return defaultBbox;
    }

    static setSnap(snap) {
      __snapOn = snap;
      return __snapOn;
    }

    static getSnap() {
      return __snapOn;
    }

    canonicalForm() {
      let newSL = new SectorList(this.bbox);
      if (this.sectors.length == 0) return newSL; //nothing to do
      let sector = this.sectors[0].clone();
      for (let i = 1; i < this.sectors.length; i++) {
        if (sector.equal(this.sectors[i])) {
          sector.w += this.sectors[i].w;
        } else {
          if (sector.w != 0) newSL.sectors.push(sector);
          sector = this.sectors[i].clone();
        }
      }
      if (sector.w != 0) newSL.sectors.push(sector);
      return newSL;
    }

    static fromSectorArray(sectors, bbox) {
      let newSL = new SectorList(bbox);
      newSL.sectors = sectors;
      newSL.sortSectors();
      return newSL.canonicalForm();
    }

    sortSectors() {
      this.sectors.sort(Sector.compare_static);
    }

    clone() {
      let newSL = new SectorList(this.bbox);
      for (let s of this.sectors) newSL.sectors.push(s.clone());
      return newSL;
    }

    scalarMultiplication(c) {
      let newSL = new SectorList(this.bbox);
      for (let i = 0; i < this.sectors.length; i++) {
        let s = this.sectors[i].clone();
        s.w *= c;
        newSL.sectors.push(s);
      }
      return newSL;
    }

    add(other) {
      // merge two sorted sector lists
      let ncSL = new SectorList(this.bbox); // an SL that can be in non-canonical form.
      let index_this = 0;
      let index_other = 0;
      while (
        index_this < this.sectors.length &&
        index_other < other.sectors.length
      ) {
        if (
          this.sectors[index_this].compare(other.sectors[index_other]) == LESS
        ) {
          ncSL.sectors.push(this.sectors[index_this]);
          ++index_this;
        } else {
          ncSL.sectors.push(other.sectors[index_other]);
          ++index_other;
        }
      }
      while (index_this < this.sectors.length) {
        ncSL.sectors.push(this.sectors[index_this]);
        index_this++;
      }
      while (index_other < other.sectors.length) {
        ncSL.sectors.push(other.sectors[index_other]);
        index_other++;
      }
      let newSL = ncSL.canonicalForm(); // computing the SL in the canonical form
      return newSL;
    }

    // Convert a vertex circulation in SL given a weight w.
    // The resulting SL mapped the region inside vertex circulation to +w.
    // This algorithm assumes that the vertex circulation is
    // counter-clockwised. Otherwise, the region is mapped to -w.
    static convertFrom(vtx_circ, w, bbox) {
      let ncSL = new SectorList(bbox || defaultBbox); // an unsorted SL in non-canonical form
      if (vtx_circ.length < 2) return ncSL; // insufficient vertices, nothing to do
      if (
        vtx_circ[0] != vtx_circ[vtx_circ[0].length - 2] ||
        vtx_circ[1] != vtx_circ[vtx_circ[0].length - 1]
      ) {
        vtx_circ.push(vtx_circ[0]); // ensuring that the first vertex is equal to the last one
        vtx_circ.push(vtx_circ[1]);
      }
      if (__snapOn) {
        vtx_circ.forEach((c) => Coordinates.snapToGrid(c));
      }
      let p = new Point(vtx_circ[0], vtx_circ[1]);
      for (let i = 2; i < vtx_circ.length - 1; i += 2) {
        let q = new Point(vtx_circ[i], vtx_circ[i + 1]);
        if (eqPoint(p, q)) continue; // zero length segment...
        if (!eqCoord(p.y, q.y)) {
          // horizontal segments do not need sectors
          let theta = new Angle(p, q);
          ncSL.sectors.push(new Sector(p, theta, -w));
          ncSL.sectors.push(new Sector(q, theta, w));
        }
        p = q;
      }
      ncSL.sortSectors(); // sorting the sectors in SL using the scan order
      let newSL = ncSL.canonicalForm(); // also put it in canonical form
      return newSL;
    }

    detectEdges() {
      this.curr_op = DETECTEDGES;
      let edges = [];
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let before = scanln.getRaysInCurrPoint(true, false);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let after = scanln.getRaysInCurrPoint(true, false);
        let i = 0;
        let j = 0;
        while (i < before.rays.length || j < after.rays.length) {
          let r1 = before.rays[i];
          let r2 = after.rays[j];
          let svaluebef = before.svalues_at[i];
          let cmpres;
          // who must be incremented? i or j?
          if (i >= before.rays.length) {
            cmpres = GREATER;
          } else if (j >= after.rays.length) {
            cmpres = LESS;
          } else {
            cmpres = r1.compare_ray_thetas(r2);
          }
          if (cmpres == EQUAL) {
            if (r1.ds == r2.ds) {
              // then the i-th/j-th ray still in the scanline
              // nothing to do
              ++i;
              ++j;
              continue;
            }
            let x_curr = r1.interY(scanln.yCurr());
            let p_curr = new Point(x_curr, scanln.yCurr());
            edges.push(new Edge(r1.source, p_curr, svaluebef));
            ++i;
            ++j;
          } else if (cmpres == LESS) {
            // then the i-th ray in before was removed from the scanline
            let x_curr = r1.interY(scanln.yCurr());
            let p_curr = new Point(x_curr, scanln.yCurr());
            edges.push(new Edge(r1.source, p_curr, svaluebef));
            ++i;
          } else {
            // cmpres == GREATER
            // then the j-th ray in after was added in the scanline
            // nothing to do
            ++j;
          }
        }
      }
      return edges;
    }

    convertToVertexCirculation() {
      this.curr_op = CONVVC;
      let actv_mtchains = new MTC_ActiveList(this.bbox, this.sectors.length);
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let there_is_inter_evnt = scanln.thereIsInterEvent();
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() == 0) continue; // nothing to do...
        actv_mtchains.beginNextPointInScan(there_is_inter_evnt);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        for (let i = 1; i < rays.length - 1; i++) {
          let ray = rays[i];
          let svlue_bef = svalues_at[i - 1];
          let svlue_aft = svalues_at[i];
          let result = actv_mtchains.open1MTC(ray, svlue_bef, CLOSES);
          if (!result) actv_mtchains.insert(ray, svlue_bef, CLOSES);
          result = actv_mtchains.open1MTC(ray, svlue_aft, OPENS);
          if (!result) actv_mtchains.insert(ray, svlue_aft, OPENS);
        }
        actv_mtchains.lastPointInScanWasFinished();
        actv_mtchains.reorderAtCurrPoint();
      }
      return actv_mtchains.getResults();
    }

    convertToTrapezoidalDecomposition() {
      this.curr_op = CONVTP;
      let traps = [];
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let y_curr = scanln.yCurr();
        for (let i = 1; i < rays.length; i++) {
          let trap = __createTrapezium(
            rays[i - 1],
            rays[i],
            y_curr,
            svalues_at[i - 1]
          );
          if (trap) traps.push(trap);
          rays[i - 1].y_low = y_curr;
        }
      }
      // we need close the trapezium in remain rays in scanline after the end of scan
      let rmn_rays = scanln.getRays();
      let svalue_at = 0;
      for (let i = 1; i < rmn_rays.length; i++) {
        let trap = __createTrapezium(
          rmn_rays[i - 1],
          rmn_rays[i],
          this.bbox[3],
          svalue_at
        );
        if (trap) traps.push(trap);
        svalue_at += rmn_rays[i].ds;
      }
      return traps;
    }

    convertTo(output_type = TRAPEZOIDALDECOMPOSITION) {
      if (output_type == TRAPEZOIDALDECOMPOSITION) {
        return this.convertToTrapezoidalDecomposition();
      } else if (output_type == VERTEXCIRCULATION) {
        return this.convertToVertexCirculation();
      } else {
        console.assert(
          false,
          "The output type parameter in the convertTo method must be equal to TRAPEZOIDALDECOMPOSITION or VERTEXCIRCULATION."
        );
      }
    }

    scalarTransformation(f) {
      this.curr_op = SCALARTRANSF;
      //println('<br><b>Scalar Transformation!</b>');
      let scanln = new Scanline(this);
      let transfSL = new SectorList(this.bbox);
      let t_scanln = new Scanline(transfSL);
      let theta = new Angle(new Point(0, 0), new Point(0, 1));
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let p = new Point(scanln.xCurr(), scanln.yCurr());
        if (scanln.thereIsInterEvent()) {
          t_scanln.reinsertInActiveRays(new Ray(p, theta, null), false); // to reorder the scanline, when necessary
        }
        scanln.scan(FORWARD);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        let t_result = t_scanln.getRaysInCurrPoint(false, true);
        let t_rays = t_result.rays;
        let t_scalar_value = t_result.svalues_at[0];
        let j = 0;
        let i = 0;
        let curr_theta;
        while (i < rays.length - 2 || j < t_rays.length - 2) {
          //remember: sentinel rays on left and right
          let res = rays[i + 1].compare_rays(t_rays[j + 1]);
          if (res == LESS || res == EQUAL) {
            i++;
            curr_theta = rays[i].theta;
          }
          if (res == GREATER || res == EQUAL) {
            j++;
            t_scalar_value += t_rays[j].ds;
            curr_theta = t_rays[j].theta;
          }
          if (t_scalar_value != f(svalues_at[i])) {
            let ds = f(svalues_at[i]) - t_scalar_value;
            if (curr_theta[1] != 0) {
              transfSL.sectors.push(new Sector(p, curr_theta, ds));
            }
            t_scanln.insertInActiveRays(new Ray(p, curr_theta, ds));
            t_scalar_value += ds;
          }
        }
      }
      return transfSL;
    }

    morph(dx, dy, morpho_type = DILATION) {
      if (dy < 0) {
        // Direction must be in scan order due to angle calculations.
        // Since morph moves the sectors in [dx,dy] and [-dx,-dy], this adjustment does not change the final result.
        dx = -dx;
        dy = -dy;
      }
      this.curr_op = MORPH;
      let theta_morph = new Angle(new Point(0, 0), new Point(dx, dy));
      var morpho_sl = new SectorList(this.bbox);
      if (this.sectors.length === 0) return morpho_sl; // nothing to do...
      var scanln = new Scanline(this);
      const w_const = this.sectors[0].w;
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let before = scanln.getRaysInCurrPoint(true, false);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let after = scanln.getRaysInCurrPoint(true, false);
        let i = 0;
        let j = 0;
        let p = new Point(scanln.xCurr(), scanln.yCurr());
        // visiting rays in arrays "before" and "after" in scan order
        while (i < before.rays.length || j < after.rays.length) {
          let r1 = before.rays[i];
          let r2 = after.rays[j];
          let svaluebef = before.svalues_at[i];
          let svalueaft = after.svalues_at[j];
          let cmpres;
          // who must be incremented? i or j?
          if (i >= before.rays.length) {
            cmpres = GREATER;
          } else if (j >= after.rays.length) {
            cmpres = LESS;
          } else {
            cmpres = r1.compare_ray_thetas(r2);
          }
          var new_sectors = [];
          if (cmpres == EQUAL) {
            if (r1.ds == r2.ds) {
              // then the i-th/j-th ray still in the scanline
              // nothing to do
              ++i;
              ++j;
              continue;
            }

            new_sectors.push(
              ...__createSectorsToMorph(
                p,
                r1.ds,
                r1.theta,
                theta_morph,
                svaluebef,
                w_const,
                false,
                morpho_type
              )
            );
            new_sectors.push(
              ...__createSectorsToMorph(
                p,
                r2.ds,
                r2.theta,
                theta_morph,
                svalueaft,
                w_const,
                true,
                morpho_type
              )
            );
            ++i;
            ++j;
          } else if (cmpres == LESS) {
            // then the i-th ray in before was removed from the scanline
            new_sectors = __createSectorsToMorph(
              p,
              r1.ds,
              r1.theta,
              theta_morph,
              svaluebef,
              w_const,
              false,
              morpho_type
            );
            ++i;
          } else {
            // cmpres == GREATER
            // then the j-th ray in after was added in the scanline
            new_sectors = __createSectorsToMorph(
              p,
              r2.ds,
              r2.theta,
              theta_morph,
              svalueaft,
              w_const,
              true,
              morpho_type
            );
            ++j;
          }
          morpho_sl.sectors.push(...new_sectors);
        }
      }
      // sorting the sectors in SL using the scan order
      morpho_sl.sortSectors();
      // also put it in canonical form
      morpho_sl = morpho_sl.canonicalForm();
      morpho_sl = this.add(morpho_sl);
      // removing overlaps and other side effects using a scalar transformation
      let f;
      if (w_const > 0) {
        f = (x) => (x > 0 ? w_const : 0);
      } else {
        f = (x) => (x < 0 ? w_const : 0);
      }
      morpho_sl = morpho_sl.scalarTransformation(f);
      return morpho_sl;
    }
    assertSectors() {
      for (let i = 1; i < this.sectors.length; i++) {
        let result = this.sectors[i - 1].compare(this.sectors[i]);
        console.log(result);
        console.assert(
          result == LESS,
          "Unordered sectors not expected! Problem found between " +
            this.sectors[i - 1].toString() +
            " and " +
            this.sectors[i].toString() +
            ". result = " +
            result
        );
      }
    }
  }

  return SectorList;
})()
)}

function _56(cell){return(
cell`SectorList = (function () {
  let {
    LESS,
    GREATER,
    EQUAL,
    FORWARD,
    PREPARE,
    CONVTP,
    CONVVC,
    DETECTEDGES,
    SCALARTRANSF,
    MORPH,
    DILATION,
    EROSION,
    VERTEXCIRCULATION,
    TRAPEZOIDALDECOMPOSITION,
    OPENS,
    CLOSES
  } = Constants;
  let { eqCoord, eqPoint, snapToGrid, setBoundingBox } = Coordinates;

  // 'private' methods

  var __createSectorsToMorph = function (
    p,
    ds,
    theta_ray,
    theta_morph,
    svalue,
    w_const,
    rayisentering,
    morpho_type
  ) {
    // returns a new sector with weight w, angle theta at a position
    // shifted by dx,dy.

    if (Math.abs(svalue) != Math.abs(w_const) && svalue != 0) {
      //error!
      throw (
        "The scalar field can map only two scalar values: 0 and " +
        w_const +
        ". However the scalar value " +
        svalue +
        " fouded. Aborting..."
      );
    }
    let w = rayisentering ? ds : -ds; // if the ray was removed (!rayisentering), then we need cancel the effect of a sector +ds on past in scanline inserting a sector -ds.
    let res = theta_ray.compare(theta_morph);
    if (res == EQUAL) {
      return []; // nothing to do... degenerated sectors would be created!
    }
    // where is inside from ray direction?
    let inside_is_ontheleft = ds == w_const;
    let factor; // uses dx,dy to morph or uses -dx,-dy?
    if (res == LESS) {
      factor = inside_is_ontheleft ? 1 : -1;
    } else {
      factor = inside_is_ontheleft ? -1 : 1;
    }
    if (morpho_type == EROSION) factor = -factor; // the above computation were made for dilation, so we need invert the factor for an erosion
    let p2 = new Point(
      p.x + theta_morph.dx * factor,
      p.y + theta_morph.dy * factor
    );
    var new_sectors = [];
    new_sectors.push(new Sector(p, theta_ray, -w));
    new_sectors.push(new Sector(p, theta_morph, w));
    new_sectors.push(new Sector(p2, theta_morph, -w));
    new_sectors.push(new Sector(p2, theta_ray, w));
    return new_sectors;
  };

  var __createTrapezium = function (r1, r2, y_curr, svalue) {
    if (eqCoord(r1.y_low, y_curr)) return null; // zero area trapezium will be created... nothing to do!
    let x1 = r1.interY(r1.y_low);
    let x2 = r2.interY(r1.y_low);
    let x3 = r1.interY(y_curr);
    let x4 = r2.interY(y_curr);
    return new Trapezium(x1, x2, x3, x4, r1.y_low, y_curr, svalue);
  };

  let defaultBbox = [-1000, 1000, 2000, 2000];
  Coordinates.setBoundingBox(defaultBbox);
  let __snapOn = true;

  class SectorList {
    constructor(bbox) {
      this.sectors = new Array();
      bbox ||= defaultBbox;
      this.curr_op = null;
      if (typeof bbox === "undefined") {
        throw "!";
      }
      this.bbox = bbox || defaultBbox;
    }

    static setDefaultBbox(bbox) {
      defaultBbox = bbox;
      Coordinates.setBoundingBox(bbox);
    }

    static getDefaultBbox() {
      return defaultBbox;
    }

    static setSnap(snap) {
      __snapOn = snap;
      return __snapOn;
    }

    static getSnap() {
      return __snapOn;
    }

    canonicalForm() {
      let newSL = new SectorList(this.bbox);
      if (this.sectors.length == 0) return newSL; //nothing to do
      let sector = this.sectors[0].clone();
      for (let i = 1; i < this.sectors.length; i++) {
        if (sector.equal(this.sectors[i])) {
          sector.w += this.sectors[i].w;
        } else {
          if (sector.w != 0) newSL.sectors.push(sector);
          sector = this.sectors[i].clone();
        }
      }
      if (sector.w != 0) newSL.sectors.push(sector);
      return newSL;
    }

    static fromSectorArray(sectors, bbox) {
      let newSL = new SectorList(bbox);
      newSL.sectors = sectors;
      newSL.sortSectors();
      return newSL.canonicalForm();
    }

    sortSectors() {
      this.sectors.sort(Sector.compare_static);
    }

    clone() {
      let newSL = new SectorList(this.bbox);
      for (let s of this.sectors) newSL.sectors.push(s.clone());
      return newSL;
    }

    scalarMultiplication(c) {
      let newSL = new SectorList(this.bbox);
      for (let i = 0; i < this.sectors.length; i++) {
        let s = this.sectors[i].clone();
        s.w *= c;
        newSL.sectors.push(s);
      }
      return newSL;
    }

    add(other) {
      // merge two sorted sector lists
      let ncSL = new SectorList(this.bbox); // an SL that can be in non-canonical form.
      let index_this = 0;
      let index_other = 0;
      while (
        index_this < this.sectors.length &&
        index_other < other.sectors.length
      ) {
        if (
          this.sectors[index_this].compare(other.sectors[index_other]) == LESS
        ) {
          ncSL.sectors.push(this.sectors[index_this]);
          ++index_this;
        } else {
          ncSL.sectors.push(other.sectors[index_other]);
          ++index_other;
        }
      }
      while (index_this < this.sectors.length) {
        ncSL.sectors.push(this.sectors[index_this]);
        index_this++;
      }
      while (index_other < other.sectors.length) {
        ncSL.sectors.push(other.sectors[index_other]);
        index_other++;
      }
      let newSL = ncSL.canonicalForm(); // computing the SL in the canonical form
      return newSL;
    }

    // Convert a vertex circulation in SL given a weight w.
    // The resulting SL mapped the region inside vertex circulation to +w.
    // This algorithm assumes that the vertex circulation is
    // counter-clockwised. Otherwise, the region is mapped to -w.
    static convertFrom(vtx_circ, w, bbox) {
      let ncSL = new SectorList(bbox || defaultBbox); // an unsorted SL in non-canonical form
      if (vtx_circ.length < 2) return ncSL; // insufficient vertices, nothing to do
      if (
        vtx_circ[0] != vtx_circ[vtx_circ[0].length - 2] ||
        vtx_circ[1] != vtx_circ[vtx_circ[0].length - 1]
      ) {
        vtx_circ.push(vtx_circ[0]); // ensuring that the first vertex is equal to the last one
        vtx_circ.push(vtx_circ[1]);
      }
      if (__snapOn) {
        vtx_circ.forEach((c) => Coordinates.snapToGrid(c));
      }
      let p = new Point(vtx_circ[0], vtx_circ[1]);
      for (let i = 2; i < vtx_circ.length - 1; i += 2) {
        let q = new Point(vtx_circ[i], vtx_circ[i + 1]);
        if (eqPoint(p, q)) continue; // zero length segment...
        if (!eqCoord(p.y, q.y)) {
          // horizontal segments do not need sectors
          let theta = new Angle(p, q);
          ncSL.sectors.push(new Sector(p, theta, -w));
          ncSL.sectors.push(new Sector(q, theta, w));
        }
        p = q;
      }
      ncSL.sortSectors(); // sorting the sectors in SL using the scan order
      let newSL = ncSL.canonicalForm(); // also put it in canonical form
      return newSL;
    }

    detectEdges() {
      this.curr_op = DETECTEDGES;
      let edges = [];
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let before = scanln.getRaysInCurrPoint(true, false);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let after = scanln.getRaysInCurrPoint(true, false);
        let i = 0;
        let j = 0;
        while (i < before.rays.length || j < after.rays.length) {
          let r1 = before.rays[i];
          let r2 = after.rays[j];
          let svaluebef = before.svalues_at[i];
          let cmpres;
          // who must be incremented? i or j?
          if (i >= before.rays.length) {
            cmpres = GREATER;
          } else if (j >= after.rays.length) {
            cmpres = LESS;
          } else {
            cmpres = r1.compare_ray_thetas(r2);
          }
          if (cmpres == EQUAL) {
            if (r1.ds == r2.ds) {
              // then the i-th/j-th ray still in the scanline
              // nothing to do
              ++i;
              ++j;
              continue;
            }
            let x_curr = r1.interY(scanln.yCurr());
            let p_curr = new Point(x_curr, scanln.yCurr());
            edges.push(new Edge(r1.source, p_curr, svaluebef));
            ++i;
            ++j;
          } else if (cmpres == LESS) {
            // then the i-th ray in before was removed from the scanline
            let x_curr = r1.interY(scanln.yCurr());
            let p_curr = new Point(x_curr, scanln.yCurr());
            edges.push(new Edge(r1.source, p_curr, svaluebef));
            ++i;
          } else {
            // cmpres == GREATER
            // then the j-th ray in after was added in the scanline
            // nothing to do
            ++j;
          }
        }
      }
      return edges;
    }

    convertToVertexCirculation() {
      this.curr_op = CONVVC;
      let actv_mtchains = new MTC_ActiveList(this.bbox, this.sectors.length);
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let there_is_inter_evnt = scanln.thereIsInterEvent();
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() == 0) continue; // nothing to do...
        actv_mtchains.beginNextPointInScan(there_is_inter_evnt);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        for (let i = 1; i < rays.length - 1; i++) {
          let ray = rays[i];
          let svlue_bef = svalues_at[i - 1];
          let svlue_aft = svalues_at[i];
          let result = actv_mtchains.open1MTC(ray, svlue_bef, CLOSES);
          if (!result) actv_mtchains.insert(ray, svlue_bef, CLOSES);
          result = actv_mtchains.open1MTC(ray, svlue_aft, OPENS);
          if (!result) actv_mtchains.insert(ray, svlue_aft, OPENS);
        }
        actv_mtchains.lastPointInScanWasFinished();
        actv_mtchains.reorderAtCurrPoint();
      }
      return actv_mtchains.getResults();
    }

    convertToTrapezoidalDecomposition() {
      this.curr_op = CONVTP;
      let traps = [];
      let scanln = new Scanline(this);
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let y_curr = scanln.yCurr();
        for (let i = 1; i < rays.length; i++) {
          let trap = __createTrapezium(
            rays[i - 1],
            rays[i],
            y_curr,
            svalues_at[i - 1]
          );
          if (trap) traps.push(trap);
          rays[i - 1].y_low = y_curr;
        }
      }
      // we need close the trapezium in remain rays in scanline after the end of scan
      let rmn_rays = scanln.getRays();
      let svalue_at = 0;
      for (let i = 1; i < rmn_rays.length; i++) {
        let trap = __createTrapezium(
          rmn_rays[i - 1],
          rmn_rays[i],
          this.bbox[3],
          svalue_at
        );
        if (trap) traps.push(trap);
        svalue_at += rmn_rays[i].ds;
      }
      return traps;
    }

    convertTo(output_type = TRAPEZOIDALDECOMPOSITION) {
      if (output_type == TRAPEZOIDALDECOMPOSITION) {
        return this.convertToTrapezoidalDecomposition();
      } else if (output_type == VERTEXCIRCULATION) {
        return this.convertToVertexCirculation();
      } else {
        console.assert(
          false,
          "The output type parameter in the convertTo method must be equal to TRAPEZOIDALDECOMPOSITION or VERTEXCIRCULATION."
        );
      }
    }

    scalarTransformation(f) {
      this.curr_op = SCALARTRANSF;
      //println('<br><b>Scalar Transformation!</b>');
      let scanln = new Scanline(this);
      let transfSL = new SectorList(this.bbox);
      let t_scanln = new Scanline(transfSL);
      let theta = new Angle(new Point(0, 0), new Point(0, 1));
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let p = new Point(scanln.xCurr(), scanln.yCurr());
        if (scanln.thereIsInterEvent()) {
          t_scanln.reinsertInActiveRays(new Ray(p, theta, null), false); // to reorder the scanline, when necessary
        }
        scanln.scan(FORWARD);
        let { rays, svalues_at } = scanln.getRaysInCurrPoint(false, true);
        let t_result = t_scanln.getRaysInCurrPoint(false, true);
        let t_rays = t_result.rays;
        let t_scalar_value = t_result.svalues_at[0];
        let j = 0;
        let i = 0;
        let curr_theta;
        while (i < rays.length - 2 || j < t_rays.length - 2) {
          //remember: sentinel rays on left and right
          let res = rays[i + 1].compare_rays(t_rays[j + 1]);
          if (res == LESS || res == EQUAL) {
            i++;
            curr_theta = rays[i].theta;
          }
          if (res == GREATER || res == EQUAL) {
            j++;
            t_scalar_value += t_rays[j].ds;
            curr_theta = t_rays[j].theta;
          }
          if (t_scalar_value != f(svalues_at[i])) {
            let ds = f(svalues_at[i]) - t_scalar_value;
            if (curr_theta[1] != 0) {
              transfSL.sectors.push(new Sector(p, curr_theta, ds));
            }
            t_scanln.insertInActiveRays(new Ray(p, curr_theta, ds));
            t_scalar_value += ds;
          }
        }
      }
      return transfSL;
    }

    morph(dx, dy, morpho_type = DILATION) {
      if (dy < 0) {
        // Direction must be in scan order due to angle calculations.
        // Since morph moves the sectors in [dx,dy] and [-dx,-dy], this adjustment does not change the final result.
        dx = -dx;
        dy = -dy;
      }
      this.curr_op = MORPH;
      let theta_morph = new Angle(new Point(0, 0), new Point(dx, dy));
      var morpho_sl = new SectorList(this.bbox);
      if (this.sectors.length === 0) return morpho_sl; // nothing to do...
      var scanln = new Scanline(this);
      const w_const = this.sectors[0].w;
      while (!scanln.endOfEvents()) {
        scanln.scan(PREPARE);
        let before = scanln.getRaysInCurrPoint(true, false);
        scanln.scan(FORWARD);
        if (scanln.eventsProcessed() === 0) continue; //nothing to do
        let after = scanln.getRaysInCurrPoint(true, false);
        let i = 0;
        let j = 0;
        let p = new Point(scanln.xCurr(), scanln.yCurr());
        // visiting rays in arrays "before" and "after" in scan order
        while (i < before.rays.length || j < after.rays.length) {
          let r1 = before.rays[i];
          let r2 = after.rays[j];
          let svaluebef = before.svalues_at[i];
          let svalueaft = after.svalues_at[j];
          let cmpres;
          // who must be incremented? i or j?
          if (i >= before.rays.length) {
            cmpres = GREATER;
          } else if (j >= after.rays.length) {
            cmpres = LESS;
          } else {
            cmpres = r1.compare_ray_thetas(r2);
          }
          var new_sectors = [];
          if (cmpres == EQUAL) {
            if (r1.ds == r2.ds) {
              // then the i-th/j-th ray still in the scanline
              // nothing to do
              ++i;
              ++j;
              continue;
            }

            new_sectors.push(
              ...__createSectorsToMorph(
                p,
                r1.ds,
                r1.theta,
                theta_morph,
                svaluebef,
                w_const,
                false,
                morpho_type
              )
            );
            new_sectors.push(
              ...__createSectorsToMorph(
                p,
                r2.ds,
                r2.theta,
                theta_morph,
                svalueaft,
                w_const,
                true,
                morpho_type
              )
            );
            ++i;
            ++j;
          } else if (cmpres == LESS) {
            // then the i-th ray in before was removed from the scanline
            new_sectors = __createSectorsToMorph(
              p,
              r1.ds,
              r1.theta,
              theta_morph,
              svaluebef,
              w_const,
              false,
              morpho_type
            );
            ++i;
          } else {
            // cmpres == GREATER
            // then the j-th ray in after was added in the scanline
            new_sectors = __createSectorsToMorph(
              p,
              r2.ds,
              r2.theta,
              theta_morph,
              svalueaft,
              w_const,
              true,
              morpho_type
            );
            ++j;
          }
          morpho_sl.sectors.push(...new_sectors);
        }
      }
      // sorting the sectors in SL using the scan order
      morpho_sl.sortSectors();
      // also put it in canonical form
      morpho_sl = morpho_sl.canonicalForm();
      morpho_sl = this.add(morpho_sl);
      // removing overlaps and other side effects using a scalar transformation
      let f;
      if (w_const > 0) {
        f = (x) => (x > 0 ? w_const : 0);
      } else {
        f = (x) => (x < 0 ? w_const : 0);
      }
      morpho_sl = morpho_sl.scalarTransformation(f);
      return morpho_sl;
    }
    assertSectors() {
      for (let i = 1; i < this.sectors.length; i++) {
        let result = this.sectors[i - 1].compare(this.sectors[i]);
        console.log(result);
        console.assert(
          result == LESS,
          "Unordered sectors not expected! Problem found between " +
            this.sectors[i - 1].toString() +
            " and " +
            this.sectors[i].toString() +
            ". result = " +
            result
        );
      }
    }
  }

  return SectorList;
})() // define and call`
)}

function _57(tex,md){return(
md`Above, we implement SL operations and associated algorithms. The six main ones are:
1. **Convert from** vertex circulations to Sector Lists.
2. **Convert to** vertex circulations or to trapezoid decompositions from Sector Lists.
3. **Add** two Sector Lists in a new one, adding both scalar fields represented by Sector Lists.
4. **Scalar Transformation** computes a new Sector List that maps original scalar values in new values.
5. **Scalar Multiplication** multiplies the weights of each sector by a constant ${tex`\alpha`}. In practice, the entire scalar field is multiplied by ${tex`\alpha`}.
6. **Morph** dilates or erodes a *binary* scalar field ${tex`\Phi_S`}, i.e., a field  where all points of the plane are mapped to *+1* or *0* using a *k*-dop as structuring element.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("Constants")).define("Constants", _Constants);
  main.variable(observer()).define(["cell"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("Coordinates")).define("Coordinates", ["Constants"], _Coordinates);
  main.variable(observer()).define(["cell"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("Point")).define("Point", _Point);
  main.variable(observer()).define(["cell"], _14);
  main.variable(observer("Angle")).define("Angle", ["Coordinates","Constants"], _Angle);
  main.variable(observer()).define(["cell"], _16);
  main.variable(observer("Edge")).define("Edge", _Edge);
  main.variable(observer()).define(["cell"], _18);
  main.variable(observer("Polygon")).define("Polygon", _Polygon);
  main.variable(observer()).define(["cell"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["tex","md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("ScanlnStatus")).define("ScanlnStatus", _ScanlnStatus);
  main.variable(observer()).define(["cell"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("Ray")).define("Ray", ["Constants","Coordinates","Point","ScanlnStatus"], _Ray);
  main.variable(observer()).define(["cell"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("Event")).define("Event", ["Constants","Coordinates"], _Event);
  main.variable(observer()).define(["cell"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("PriorityQueue")).define("PriorityQueue", _PriorityQueue);
  main.variable(observer()).define(["cell"], _34);
  main.variable(observer()).define(["tex","md"], _35);
  main.variable(observer("Skiplist")).define("Skiplist", ["Constants"], _Skiplist);
  main.variable(observer()).define(["cell"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("Scanline")).define("Scanline", ["Constants","Coordinates","Angle","Point","PriorityQueue","Event","Ray","Skiplist","ScanlnStatus"], _Scanline);
  main.variable(observer()).define(["cell"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("Trapezium")).define("Trapezium", ["Polygon"], _Trapezium);
  main.variable(observer()).define(["cell"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("MTC_ActiveList")).define("MTC_ActiveList", ["Constants","Coordinates","Ray","Point","ScanlnStatus","Angle","Skiplist","Polygon"], _MTC_ActiveList);
  main.variable(observer()).define(["cell"], _47);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer()).define(["md"], _49);
  main.variable(observer()).define(["tex","md"], _50);
  main.variable(observer("Sector")).define("Sector", ["Constants","Coordinates"], _Sector);
  main.variable(observer()).define(["cell"], _52);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer()).define(["tex","md"], _54);
  main.variable(observer("SectorList")).define("SectorList", ["Constants","Coordinates","Point","Sector","Trapezium","Angle","Scanline","Edge","MTC_ActiveList","Ray"], _SectorList);
  main.variable(observer()).define(["cell"], _56);
  main.variable(observer()).define(["tex","md"], _57);
  const child1 = runtime.module(define1);
  main.import("cell", child1);
  return main;
}
