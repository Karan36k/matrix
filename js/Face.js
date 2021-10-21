var g_cubes = new Array();
var g_faceGeometry = null;

var g_splineMeshes = new Array();
var g_splinePts = new Array();
var g_splineNumSegments = 16;
var g_numSplines = 20;


var g_splineInitPts = new Array();

for ( var i = 0; i < 3; i++ )
{
	g_splineInitPts.push( new THREE.Vector3(0,0,0) );
}


function Face()
{
	this.id = 'face';

	this.initSplines = function()
	{
		for ( var i_spline = 0; i_spline < g_numSplines; i_spline++ )
		{
			var colorRibbon = 0x0;

			var geo = new THREE.Geometry();
			var center = new THREE.Vector3( 0,0,0 );

			for ( var i = 0; i < g_splineNumSegments; i ++ ) 
			{
				geo.vertices.push( center );
				geo.vertices.push( center );
			}

			// init faces
			for ( var i = 0; i < g_splineNumSegments-1; i ++ ) 
			{
				var i_next = (i+1)%g_splineNumSegments;

				// side
				var face_0 = new THREE.Face3( i*2, i_next*2, i*2+1 );
				var face_1 = new THREE.Face3( i*2+1, i_next*2, i_next*2+1 );
				face_0.color.setHex( colorRibbon );
				face_1.color.setHex( colorRibbon );
				geo.faces.push( face_0 );
				geo.faces.push( face_1 );
			}

			var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
			var colorMaterial = new THREE.MeshBasicMaterial({

		            color:              colorRibbon,
		            wireframe:          randInt(0,5) % 2 == 0,
		            wireframeLinewidth: 3
		        });

		    var mesh = new THREE.Mesh(
		        geo,
		        colorMaterial
		    );
		    mesh.doubleSided = true;
		    mesh.overdraw = false;

		    g_scene.add(mesh);
		    g_splineMeshes.push(mesh);
		}

	}

	this.init = function()
	{
		this.initSplines();

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) 
		{
			console.log( item, loaded, total );
		};

		var loader = new THREE.OBJLoader( manager );
		loader.load( 'obj/fembotface.obj', function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) 
				{
					g_faceGeometry = child.geometry;
					//child.material =  new THREE.MeshBasicMaterial( {color: 0xffffff} );;
					//child.material.map = texture;

					// lines
					var geometry = new THREE.Geometry();
					var material = new THREE.LineBasicMaterial({ color: 0x252525, transparent:true, opacity:0.5 });

					var numVerticesFace = child.geometry.vertices.length;

					var ptDelta = new THREE.Vector3(0.0,2.0,-5.0);

					// num lines
					var numLines = 64;
					for ( var i = 0; i < numLines; i ++ ) 
					{
						var step =  Math.floor(numVerticesFace/ numLines);
						var index = i *step;
						var ptBase = child.geometry.vertices[index].clone();
						var ptExt = ptBase.clone();
						var lenMul = 1.0;

						if ( randFloat(0.0,1.0) < 0.05 ) lenMul = randFloat(1.0,2.0);
						ptExt.add(ptDelta.clone().multiplyScalar(lenMul) );

						geometry.vertices.push( ptBase );
						geometry.vertices.push( ptExt );

						var width = 0.25;
						var cube_color = new THREE.Color();
						var cube_color_val = randFloat(0,1) ;
						cube_color.setRGB( cube_color_val,cube_color_val,cube_color_val );

						var cube_geometry = new THREE.CubeGeometry( width, width, width );
						var cube_material = new THREE.MeshBasicMaterial( {color: cube_color } );
						var cube = new THREE.Mesh( cube_geometry, cube_material );
						cube.position = ptExt;
						g_scene.add( cube );

						var endpt_geometry = new THREE.SphereGeometry( width*0.25, 12, 12 );
						var endpt_material = new THREE.MeshBasicMaterial( {color: 0xffffff } );
						var endpt_mesh = new THREE.Mesh( endpt_geometry, endpt_material );
						endpt_mesh.position = ptExt;
						g_scene.add( endpt_mesh );

						g_cubes.push( {cube:cube, endptMesh: endpt_mesh, ptBase:ptBase, ptExt:ptExt, offset:randFloat(0.0,1.0), speed:randFloat(0.5,1.0) } );
					}

					// splin pts
					var step =  Math.floor(numVerticesFace/ g_splineMeshes.length);
					for ( var i = 0; i < g_splineMeshes.length; i++ )
					{
						var index = i * step;
						var ptBase = child.geometry.vertices[index].clone();

						var ptExt = ptBase.clone();
						ptExt.add(ptDelta.clone().multiplyScalar( randFloat(1.8, 2.8 )) );

						g_splinePts.push( {ptBase:ptBase, ptExt:ptExt, timeOffset:randFloat(0.0,2.0*Math.PI), speed:randFloat(0.5,1.0)} );
					}

					this.meshRippleMove = new THREE.Line( geometry, material, THREE.LinePieces);

					g_scene.add( this.meshRippleMove );
				}

			} );

			g_scene.add( object );

		} );
	}

	this.draw = function()
	{
	}

	this.update = function()
	{
		this.updateBoxes();
		this.updateSplines();
	}

	this.updateSplines = function()
	{
		var time = Date.now() * 0.004;

		for( var i = 0; i < g_splinePts.length; i++ )
		{
			var mesh = g_splineMeshes[i];
			var splineData = g_splinePts[i];
			var ptBase = splineData.ptBase;
			var ptExt = splineData.ptExt;

			var numSegments = g_splineNumSegments;

			var dir = ptExt.clone();
			dir.sub(ptBase);

			var length = dir.length();
			var dir_normalized = dir.normalize();

			var deltaDist = length / g_splineInitPts.length;

			for( var j = 0; j < g_splineInitPts.length; j++ )
			{
				var posMiddle = ptBase.clone();
				posMiddle.add(  dir_normalized.clone().multiplyScalar( deltaDist * j ) ); 

				if ( j > 0)
				{
					var smoothFactor = smoothstep(0, g_splineInitPts.length, j);

					var deltaY = Math.sin( time * splineData.speed + splineData.timeOffset + i + j ) * 2.0;
					deltaY *= smoothFactor;
					//var deltaY = noise.simplex2(i+time, j+1.0);

					posMiddle.add( new THREE.Vector3( 0.0, deltaY, 0.0 ) );
				}

				g_splineInitPts[j] = posMiddle;
			}

			spline = new THREE.Spline( g_splineInitPts );
			var ribbonHeightMax = 0.15;

			for ( var i_seg = 0; i_seg < numSegments; i_seg++ )
			{
				var smoothFactor = 1.0-smoothstep(0, numSegments, i_seg);
				var deltaPos = new THREE.Vector3(0.0, ribbonHeightMax*smoothFactor, 0.0);

				var posMiddleObj = spline.getPoint(i_seg / numSegments);
				var posMiddle = new THREE.Vector3( posMiddleObj.x, posMiddleObj.y, posMiddleObj.z );
				posMiddle.add( dir_normalized.clone().multiplyScalar(0.2) );

				mesh.geometry.vertices[i_seg*2] = posMiddle.clone().add(deltaPos);
				mesh.geometry.vertices[i_seg*2+1] = posMiddle.clone().sub(deltaPos);
			}

			mesh.geometry.verticesNeedUpdate = true;
		}
	}

	this.updateBoxes = function()
	{
		var time = Date.now() * 0.001;

		for( var i = 0; i < g_cubes.length; i++ )
		{
			var data = g_cubes[i];
			var ptBase = data.ptBase;
			var ptExt = data.ptExt;

			var ptFinal = ptBase.clone();
			var lerpFactor = (time* data.speed +data.offset) % 1.0;
			ptFinal.lerp( ptExt, lerpFactor );

			//data.endptMesh.material.color.setRGB( lerpFactor,lerpFactor,lerpFactor );
			data.endptMesh.scale.x = lerpFactor;
			data.endptMesh.scale.y = lerpFactor;
			data.endptMesh.scale.z = lerpFactor;
			data.endptMesh.material.opacity = 1.0-lerpFactor*lerpFactor;
			data.endptMesh.material.transparent = true;

			data.cube.material.opacity = 1.0-lerpFactor*lerpFactor;
			data.cube.material.transparent = true;
			data.cube.position = ptFinal;
			
			data.cube.scale.x = lerpFactor;
			data.cube.scale.y = lerpFactor;
			data.cube.scale.z = lerpFactor;
		}
	}
}