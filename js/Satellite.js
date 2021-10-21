function Satellite()
{
	this.id = 'satellite';

	this.init = function()
	{
		return;
		this.cubes = new Array();

		var numCubes = 8;

		for( var i = 0; i < numCubes; i++ )
		{
			var width = 0.5;
			var geometry = new THREE.CubeGeometry( width, width, width );
			var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
			var cube = new THREE.Mesh( geometry, material );

			var x = randInt( -2, 2);
			var y = randInt( -1, 2 );
			var z = randInt( -3, -1 );
			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;

			g_scene.add( cube )
		}

	}

	this.draw = function()
	{
	}

	this.update = function()
	{

	}
}