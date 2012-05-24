// ============================================================================
// NURBS CURVES
// ============================================================================
THREE.NURBSCurve = THREE.Curve.create(

  /**
   * constructor
   * @param points array of Vector3 control points
   * @param knots  array of knots
   * @param order degree of curve + 1
   */
  function ( points, knots, order ) {

    this.points = points || new Array();
    this.order = order || 3;
    this.knots = knots || new Array();
  },

  /**
   * getPoint( t )
   * @param t from 0 to 1
   */
  function ( t ) {

    // TODO: remove below, fix error when t = 1
    if (t >= 1) t = 0.999999;

    // Lineraly scale t
    var u = (1 - t) * this.knots[this.order - 1] +
                 t  * this.knots[this.points.length];

    // 1) Find knot indices
    var i_plus_1 = 0;
    for (; this.knots[i_plus_1] <= u; i_plus_1++) { }
    var i_plus_1_minus_k = i_plus_1 - this.order;

    // 2) check upper and lower bounds
    // TODO: no need to check for this anymore, create error log instead
    if (i_plus_1 > this.points.length) i_plus_1 = this.points.length;
    if (i_plus_1_minus_k < 0)          i_plus_1_minus_k = 0;

    // 3) Calculate point
    var v = new THREE.Vector3();
    for (var i = i_plus_1_minus_k; i < i_plus_1; i++)
    {
      var n = N( i, this.order, u, this.knots );
      v.x += this.points[i].x * n;
      v.y += this.points[i].y * n;
      v.z += this.points[i].z * n;
    }
    return v;
  }
);

/**
 * Defines 3D B-Spline geometry object
 * @param curve NURBSCurve object
 * @param numPoints number of interpolated points
 */
THREE.NURBSCurveGeometry = function ( curve, numPoints ) {

  THREE.Geometry.call( this );

  var scope = this;

  // TODO: check for type
  this.curve = curve || new THREE.NURBSCurve();

  this.numPoints = numPoints || 100;

  // TODO: look for a way to get this and re generate
  //       I will need to first change this.curve
  this.vertices = new Array();

  for (var i = 0; i < this.numPoints; i++)
	  this.vertices.push( new THREE.Vertex(
                        this.curve.getPoint(i / (this.numPoints-1))) );

};
THREE.NURBSCurveGeometry.prototype = new THREE.Geometry();
THREE.NURBSCurveGeometry.prototype.constructor =
  THREE.NURBSCurveGeometry;
