
var g_heroPos = new THREE.Vector3(0.0,0.0,0.0);
var mousePos = {x:0,y:0};

function Core()
{
	this.init = function()
	{
		var clearColor = 0x111111;

 		// renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor( clearColor, 1 );
		document.body.appendChild(this.renderer.domElement);

		// scene
		g_scene = new THREE.Scene();
		//g_scene.fog = new THREE.FogExp2( clearColor, 0.07 );

		var light1 = new THREE.PointLight( 0xffffff, 2, 5 );
		light1.position.z = 3.0;
		g_scene.add( light1 );

		g_scene.add( new THREE.AmbientLight(  0x202020 ) );

		// camera
 		g_camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100);
 		g_camera.lookAt( new THREE.Vector3(0.0,0.0,0.0) );

 		this.initItems();	
	}

	this.initItems = function()
	{
		this.objects = new Array();

 		this.objects.push( new DebugGrid() );
 		this.objects.push( new Satellite() );
 		this.objects.push( new Face() );
 		//this.objects.push( new Floor() );


 		for( var i=0; i < this.objects.length; i++ )
 		{
 			this.objects[i].init();
 		}
	}

	this.draw = function()
	{
		requestAnimationFrame(doTick);

		for( var i=0; i < this.objects.length; i++ )
 		{
 			var obj = this.objects[i];

 			if ( obj.hasOwnProperty('update') )
	 			obj.draw();
 		}

	    g_core.renderer.render(g_scene, g_camera);
	}

	this.spinCamera = function()
	{
		var time = Math.PI * 0.9;//Date.now() * 0.0003;
		//var time = Date.now() * 0.0005;
		var radius = 15.0;
		/*g_camera.position.x = radius * Math.cos(time);
		g_camera.position.z = radius * Math.sin(mousePos.x*0.001);
		g_camera.position.y = radius * 0.2;*/

		var windowHeight = 	window.innerHeight;

		g_camera.position.x = radius * Math.cos(time);
		g_camera.position.z = radius * Math.sin(0.7+-mousePos.x*0.0007);
		g_camera.position.y = radius*0.2 + (mousePos.y-windowHeight*0.5)*0.01;

		g_camera.lookAt( new THREE.Vector3(-5.0,1.5,0.0) );
	}

	this.update = function()
	{
		this.spinCamera();

		for( var i=0; i < this.objects.length; i++ )
 		{
 			var obj = this.objects[i];

 			if ( obj.hasOwnProperty('update') )
	 			obj.update();
 		}
	}
}

function getObj( a_id )
{
	for( var i=0; i < g_core.objects.length; i++ )
	{
		var obj = g_core.objects[i];
		if ( obj.hasOwnProperty('id') && obj.id == a_id )
		{
			return obj;
		}

		return null;
	}
}

var g_scene;
var g_camera;
var g_core = new Core();
g_core.init();


// handle resizing windows
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    g_camera.aspect = window.innerWidth / window.innerHeight;
    g_camera.updateProjectionMatrix();

    g_core.renderer.setSize( window.innerWidth, window.innerHeight );
}

var doTick = function() 
{
	g_core.update();
	g_core.draw();
};

doTick();

(function() {
    window.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;

        // event.clientX and event.clientY contain the mouse position
    }
})();