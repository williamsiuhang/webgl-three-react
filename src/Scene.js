import React from 'react';

import * as THREE from 'three';
import Stats from './three/stats.min.js';

var container, stats;

var camera, scene, renderer;

var cube, plane;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

class Scene extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.init();
    this.animate();
  }

  init = () => {

    container = document.querySelector( '.scene' );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'Drag to spin the cube';
    container.appendChild( info );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );


    // Cube

    var geometry = new THREE.BoxGeometry( 200, 200, 200 );

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

      var hex = Math.random() * 0xffffff;
      geometry.faces[ i ].color.setHex( hex );
      geometry.faces[ i + 1 ].color.setHex( hex );

    }

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );

    cube = new THREE.Mesh( geometry, material );
    cube.position.y = 150;
    scene.add( cube );

    // Plane

    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    geometry.rotateX( - Math.PI / 2 );

    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );

    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', this.onWindowResize, false );

  }

  onWindowResize = () => {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  onDocumentMouseDown = ( event ) => {

    event.preventDefault();

    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', this.onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

  }

  onDocumentMouseMove = ( event ) => {

    mouseX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

  }

  onDocumentMouseUp = ( event ) => {

    document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );

  }

  onDocumentMouseOut = ( event ) => {

    document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );

  }

  onDocumentTouchStart = ( event ) => {

    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;

    }

  }

  onDocumentTouchMove = ( event ) => {

    if ( event.touches.length === 1 ) {

      event.preventDefault();

      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

    }

  }

  //

  animate = () => {

    requestAnimationFrame( this.animate );

    stats.begin();
    this.loop();
    stats.end();

  }

  loop = () => {

    plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
    renderer.render( scene, camera );

  }

  render() {
    return (
      <div className="scene"></div>
    )
  }
}

export default Scene;
