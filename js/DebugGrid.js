function DebugGrid()
{
	this.initGrid = function()
	{
		var segments = 40;
		var width = segments;
		var posStep = width / segments;
		var posStart = width * -0.5;
		var posEnd = width * 0.5 - posStep;
		
		var geometry = new THREE.BufferGeometry();
		var material = new THREE.LineBasicMaterial({ vertexColors: true });

		geometry.addAttribute( 'position', Float32Array, segments*4, 3 );
		geometry.addAttribute( 'color', Float32Array, segments*4, 3 );

		var positions = geometry.attributes.position.array;
		var colors = geometry.attributes.color.array;

		var y = -3.0;

		for ( var i = 0; i < segments; i ++ ) {

			var x_0 = posStart;
			var x_1 = posEnd;
			var z = posStart + i * posStep;

			var stride = 12;

			// positions
			positions[ i * stride + 0 ] = x_0;
			positions[ i * stride + 1 ] = y;
			positions[ i * stride + 2 ] = z;
			positions[ i * stride + 3 ] = x_1;
			positions[ i * stride + 4 ] = y;
			positions[ i * stride + 5 ] = z;

			positions[ i * stride + 6 ] = z;
			positions[ i * stride + 7 ] = y;
			positions[ i * stride + 8 ] = x_0;
			positions[ i * stride + 9 ] = z;
			positions[ i * stride + 10] = y;
			positions[ i * stride + 11] = x_1;

			// colors
			var value = 0.04;
			colors[ i * stride + 0 ] = value;
			colors[ i * stride + 1 ] = value;
			colors[ i * stride + 2 ] = value;
			colors[ i * stride + 3 ] = value;
			colors[ i * stride + 4 ] = value;
			colors[ i * stride + 5 ] = value;
			colors[ i * stride + 6 ] = value;
			colors[ i * stride + 7 ] = value;
			colors[ i * stride + 8 ] = value;
			colors[ i * stride + 9 ] = value;
			colors[ i * stride + 10] = value;
			colors[ i * stride + 11] = value;
		}

		this.mesh = new THREE.Line( geometry, material, THREE.LinePieces );
		g_scene.add( this.mesh );
	}

	this.initBasisVectors = function()
	{
		var geometry = new THREE.CylinderGeometry( 0, 0.1, 1, 32 );
		
		var materialX = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var materialY = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var materialZ = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		
		var cylinderX = new THREE.Mesh( geometry, materialX );
		cylinderX.position.x = 0.5;
		cylinderX.rotation.z = -0.5*Math.PI;

		var cylinderY = new THREE.Mesh( geometry, materialY );
		cylinderY.position.y = 0.5;

		var cylinderZ = new THREE.Mesh( geometry, materialZ );
		cylinderZ.position.z = 0.5;
		cylinderZ.rotation.x = 0.5*Math.PI;

		g_scene.add( cylinderX );
		g_scene.add( cylinderY );
		g_scene.add( cylinderZ );
	}

	this.init = function()
	{
		this.initGrid();
		//this.initBasisVectors();
	}

	this.draw = function()
	{

	}

	this.update = function()
	{
		var time = Date.now() * 0.001;
	}
}