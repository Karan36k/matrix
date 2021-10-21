function Floor()
{
	this.id = 'terrain';

	this.initWater = function()
	{
		var maxSize = 100.0;
		var y = -0.02;

	    var geo = new THREE.Geometry();

	    geo.vertices.push(new THREE.Vector3(-maxSize, y,-maxSize ));
	    geo.vertices.push(new THREE.Vector3( maxSize, y,-maxSize ));
	    geo.vertices.push(new THREE.Vector3( maxSize, y, maxSize ));
	    geo.vertices.push(new THREE.Vector3(-maxSize, y, maxSize ));

	    geo.faces.push( new THREE.Face3(0, 2, 1));
	    geo.faces.push( new THREE.Face3(0, 3, 2));

	    var mesh = new THREE.Mesh(
	        geo,
	        new THREE.MeshBasicMaterial({
	            color:              0x6DC3AE,
	            wireframe:          false,
	            wireframeLinewidth: 3
	        })
	    );
	    mesh.doubleSided = true;
	    mesh.overdraw = true;
	    g_scene.add(mesh);
	}

	this.initPts= function()
	{
		var segments = 32;

		// generate points
		this.pts = new Array();

		for ( var i = 0; i < segments; i ++ ) 
		{
			this.pts.push( new THREE.Vector3( 0,0,0 ) );
		}

		this.updatePts();
	}

	this.initTerrain = function()
	{
		var colorFloor = 0x79A836;
		var colorFloorSide = 0x4D7C39;

		/// generate geometry
		var geo = new THREE.Geometry();
		var center = new THREE.Vector3( 0,0,0 );

		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			geo.vertices.push( new THREE.Vector3(0,0,0) );
			geo.vertices.push( new THREE.Vector3(0,0,0) );
		}

		geo.vertices.push(center);

		// init faces
		var indexCenter = geo.vertices.length-1;
		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			var i_next = (i+1)%this.pts.length;

			// face top
			var face = new THREE.Face3( i*2, indexCenter, i_next*2 );
			face.color.setHex( colorFloor );
			geo.faces.push( face );

			// side
			var face_0 = new THREE.Face3( i*2, i_next*2, i*2+1 );
			var face_1 = new THREE.Face3( i*2+1, i_next*2, i_next*2+1 );
			face_0.color.setHex( colorFloorSide );
			face_1.color.setHex( colorFloorSide );
			geo.faces.push( face_0 );
			geo.faces.push( face_1 );
		}

		var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
		var colorMaterial = new THREE.MeshBasicMaterial({

	            color:              0X6FA139,
	            wireframe:          true,
	            wireframeLinewidth: 3
	        });

	    this.meshTerrain = new THREE.Mesh(
	        geo,
	        vertexColorMaterial
	    );
	    this.meshTerrain.doubleSided = false;
	    this.meshTerrain.overdraw = false;
	    g_scene.add(this.meshTerrain);
	}

	this.initRipple = function()
	{
		this.rippleDistMin = 0.15;
		this.rippleDistMax = 0.4;

		/// generate geometry
		var geo = new THREE.Geometry();

		for ( var i = 0; i < this.pts.length; i++ ) 
		{
			geo.vertices.push( new THREE.Vector3(0,0,0) );
			geo.vertices.push( new THREE.Vector3(0,0,0) );
		}

		// faces
		var colorRipple = 0x86DEC8;
		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			var face_0 = new THREE.Face3(i*2, ((i+1)%this.pts.length)*2, i*2+1);
			var face_1 = new THREE.Face3(i*2+1, ((i+1)%this.pts.length)*2, ((i+1)%this.pts.length)*2+1);
			face_0.color.setHex( colorRipple );
			face_1.color.setHex( colorRipple );
			geo.faces.push( face_0 );
			geo.faces.push( face_1 );
		}

		var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		var colorMaterial = new THREE.MeshBasicMaterial(
		{
            color:              colorRipple,
            wireframe:          false,
            wireframeLinewidth: 3
        });

	    this.meshRipple = new THREE.Mesh(geo, colorMaterial );
	    this.meshRipple.doubleSided = true;
	    this.meshRipple.overdraw = true;

	    g_scene.add(this.meshRipple);

	    // ripples
	    var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({ color: colorRipple });

		for ( var i = 0; i <= this.pts.length; i ++ ) 
		{
			var pt_0 = this.pts[(i%this.pts.length)].clone();
			pt_0.y = 0.0;

			var pt_0_ext = pt_0.clone();
			pt_0_ext.normalize().multiplyScalar( this.rippleDistMax );
			pt_0_ext.add( pt_0 );
			pt_0_ext.y = 0.02;

			geometry.vertices.push( pt_0_ext );
		}

		this.meshRippleMove = new THREE.Line( geometry, material);
		g_scene.add( this.meshRippleMove );
	}

	this.init = function()
	{
		this.time = 0.0;
		this.speedMove = 0.0;

		this.initWater();
		this.initPts();
		this.initTerrain();
		this.initRipple();
	}

	this.draw = function()
	{
	}

	this.updateRipple = function()
	{
		var time = Date.now() * 0.0008;
		var timeWrapped = time % 1.0;

		// update moving mesh ripple
		var dist = this.rippleDistMin + (this.rippleDistMax-this.rippleDistMin) * timeWrapped;
		for ( var i = 0; i <= this.pts.length; i ++ ) 
		{
			var pt_0 = this.pts[(i%this.pts.length)].clone();
			pt_0.y = 0.0;

			var pt_0_ext = pt_0.clone();
			pt_0_ext.normalize().multiplyScalar( dist );
			pt_0_ext.add( pt_0 );
			pt_0_ext.y = 0.02;

			this.meshRippleMove.geometry.vertices[i] = pt_0_ext;
		}

		this.meshRippleMove.material.transparent = true;
		this.meshRippleMove.material.opacity = 1.0-timeWrapped;
		this.meshRippleMove.geometry.verticesNeedUpdate = true;

		// update mesh ripple
		for ( var i = 0; i < this.pts.length; i++ ) 
		{
			var pt_0 = this.pts[i%this.pts.length].clone();
			pt_0.y = 0.02;

			var pt_0_ext = pt_0.clone();
			pt_0_ext.normalize().multiplyScalar( this.rippleDistMin );
			pt_0_ext.add( pt_0 );

			this.meshRipple.geometry.vertices[i*2] = pt_0;
			this.meshRipple.geometry.vertices[i*2+1] = pt_0_ext;
		}

		this.meshRipple.geometry.verticesNeedUpdate = true;
	}

	this.updatePts = function()
	{	
		var maxHeight = 0.3;
		var maxRadius = 3.8;

		var deltaAngle = 2.0 * Math.PI / this.pts.length;
		var time = this.time;//0.0;//Date.now() * 0.0002;

		// generate points
		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			var radius = maxRadius + noise.simplex2(1.0+time, i+1.0) * maxRadius * 0.3;
			var angle = i * deltaAngle;

			var x = radius * Math.cos(angle);
			var y = (noise.simplex2(1.0, i+100.0) * 0.5 + 0.5  ) * maxHeight; 
			var z = radius * Math.sin(angle);

			this.pts[i] = new THREE.Vector3( x,y,z );
		}
	}

	this.updateTerrain = function()
	{
		for ( var i = 0; i < this.pts.length; i++ ) 
		{
			var pt_0 = this.pts[i];
			var pt_0_ground = pt_0.clone();
			pt_0_ground.y = 0.0;

			this.meshTerrain.geometry.vertices[i*2] = pt_0; 
			this.meshTerrain.geometry.vertices[i*2+1] = pt_0_ground; 
		}

		this.meshTerrain.geometry.verticesNeedUpdate = true;
	}

	this.update = function()
	{
		this.time += this.speedMove;
		this.speedMove = lerp( this.speedMove, 0.0, 0.1 );

		this.updatePts();
		this.updateTerrain();
		this.updateRipple();
	}
}