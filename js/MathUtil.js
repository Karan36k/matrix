function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function lerp(a, b, alpha) { 
	return a + (b-a) * alpha; 
};

function saturate(val)
{
	return Math.min( Math.max( val, 0.0 ), 1.0 );
}

function smoothstep( edge0,  edge1,  x)
{
    // Scale, bias and saturate x to 0..1 range
    x = saturate((x - edge0)/(edge1 - edge0)); 
    // Evaluate polynomial
    return x*x*(3 - 2*x);
}

function randColor()
{
	return parseInt('0x'+Math.floor(Math.random()*16777215).toString(16));
}