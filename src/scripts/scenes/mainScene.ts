import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader, ThirdPersonControls, PointerLock, PointerDrag } from '@enable3d/phaser-extension'
import Phaser from 'phaser';




export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }
  
  character = new ExtendedObject3D;
  camerasArr = new Array;
  newTree = new ExtendedObject3D;
  treeCollide = false
  earthCollide = false

  newStump = new ExtendedObject3D;
  sun = new ExtendedObject3D;
  earth = new ExtendedObject3D;
  sven = new ExtendedObject3D;




  stumpCreate(xPos, yPos, zPos){
    this.third.load.gltf('./assets/stump/scene.gltf').then(stump => {
      
      console.log('stump', stump.scene.children[0])
      const child = stump.scene.children[0];

      this.newStump.add(child)
      // this.newStump.visible = false
      this.newStump.position.set(xPos, yPos, zPos)

      this.newStump.name = 'stumpy'
      
      this.third.physics.add.existing(this.newStump, { 
        shape: 'box', 
        offset: { y: -0.5 }, 
        width: 2,
        height: 2,
        depth: 2
      })
      this.newStump.body.setCollisionFlags(1)
      this.third.add.existing(this.newStump)
      
    })
    
    this.newStump.scale.set(0.3, 0.3, 0.3)

  }
  

  init() {
    this.accessThirdDimension({antialias: true, gravity: { x: 0, y: -20, z: 0 }});
    this.third.load.preload('grass', './assets/img/grass-texture-1.jpg');
    this.third.renderer.outputEncoding = THREE.LinearEncoding;
    let canJump = true
    
  }

  async create() {
    
    //Simple Map##############
    let total = await this.third.warpSpeed('-ground');
    let directionalLight = this.third.lights.directionalLight();
    directionalLight.intensity = 0.5;
    directionalLight.color.setRGB(0, 0, 1)

    //Add Sun + Earth 
    this.sun = this.third.physics.add.sphere({ x: 2, y: 2, z: 1, radius: 1 }, { basic: { color: 0xffff00 } })
    this.earth = this.third.physics.add.sphere({ y: 1, radius: 1 }, { basic: { color: 0x0080ff } })

    this.sun.body.setCollisionFlags(2)
    this.earth.body.setCollisionFlags(2)
  
    // Creates allMap ##################
  //   this.third.load.gltf('./assets/low_poly_lake_house/scene.gltf').then(object => {
  //     console.log('map', object)
  //     const scene = object.scenes[0]
  //     const allMap = new ExtendedObject3D()
  //     allMap.name = 'scene'
  //     allMap.add(scene)
  //     allMap.scale.set(3, 3, 3)
  //     this.third.add.existing(allMap)
  //     console.log('allMap', allMap)

  //     allMap.traverse(child => {
  //       if (child.type === "Mesh") {
  //         child.castShadow = child.receiveShadow = false
  //         // child.material.metalness = 0
  //         // child.material.roughness = 1

  //         if (/mesh/i.test(child.name)) {
  //           this.third.physics.add.existing(child, {
  //             shape: 'concave',
  //             mass: 0,
  //             collisionFlags: 1,
  //             autoCenter: false
  //           })
  //           child.body.setAngularFactor(0, 0, 0)
  //           child.body.setLinearFactor(0, 0, 0)
  //         }
  //       }
  //     })

  // })
    // creates map

    //  //Add Sven ##################
    //  await this.third.load.gltf('./assets/sven_walking/scene.gltf').then(svenObject => {


    //   console.log('stump', svenObject)
    //   const child = svenObject.scene.children[0];

    //   this.sven.add(child)
    //   this.sven.name = 'sven'
      
    //   this.third.physics.add.existing(this.sven, { 
    //     shape: 'box', 
    //     offset: { y: -0.5 }, 
    //     width: 2,
    //     height: 2,
    //     depth: 2
    //   })
    //   this.sven.body.setCollisionFlags(2)
    //   this.third.add.existing(this.sven)
    //   this.third.animationMixers.add(this.sven.anims.mixer)
    //   svenObject.animations.forEach(animation => {
    //     if (animation.name) {
    //       this.sven.anims.add(animation.name, animation)
    //     }
    //   })
    //   this.sven.anims.play('walk')
    //   console.log('this.sven', this.sven)
      
    // })
    
    // this.sven.scale.set(0.2, 0.2, 0.2)



    //Add tree ##################
    await this.third.load.fbx('./assets/img/tree.fbx').then(tree => {
      this.newTree.add(tree)
      this.newTree.position.set(5, 1, 5)
      this.newTree.name = 'treefiddy'
      
      this.third.add.existing(this.newTree)
      this.third.physics.add.existing(this.newTree, { 
        shape: 'box', 
        offset: { y: -0.5 }, 
        width: 2,
        height: 2,
        depth: 2 
      })
      this.newTree.body.setCollisionFlags(1)

    })

    this.newTree.scale.set(0.003, 0.003, 0.003)    


    // Adds some objects with physics ##################
    this.third.physics.add.box({ x: -1, y: 2 })
    this.third.physics.add.box({ x: -0.5, y: 1 })
    this.third.physics.add.sphere({ x: -1, y: 3 }, {lambert: {color:'green'}})

    // Add a texture ################
    this.third.load.texture('grass').then(grass => {
      grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
      grass.offset.set(0, 0)
      grass.repeat.set(2, 2)

      this.third.physics.add.ground({ width: 25, height: 25, y: 0 }, { phong: { map: grass, transparent: true } })
    })

    //Camera Position
    this.third.camera.position.set(-5, 10, -25)
    this.third.camera.lookAt(0, 0, 0)


    //Add a character----------------------------
    this.third.load.gltf('./assets/low_poly_character_kit_animation/scene.gltf').then(gltf => {
      
      const child = gltf.scene.children[0];
      // window.character = child;
      child.traverse((obj)=>{
        if(obj.name === "Object_4" ){
          obj.children.splice(18, 7)
        }
      }) //traverse to remove accessories

      
      // console.log('child', child);
      this.character.add(child);
      this.character.name = 'Dan'
      this.character.position.set(-1, 5, 0)
      // this.third.scene.add(this.character)
      this.third.add.existing(this.character)
      console.log('character', this.character)

      this.third.animationMixers.add(this.character.anims.mixer)
        gltf.animations.forEach(animation => {
          if (animation.name) {
            this.character.anims.add(animation.name, animation)
          }
        })
      this.character.anims.play('idle')


    // setTimeout(() => {
    //   this.scene.restart()
    // }, 60000)

    

    //Add Player to the Scene with Body
    this.third.physics.add.existing(this.character, {
      shape: 'sphere',
      radius: 0.25,
      width: 0.5,
      offset: { y: -0.25 }
    })

    //Add Physics and Detection
    this.character.body.setFriction(0.8)
    this.character.body.setAngularFactor(0, 0, 0)
    this.character.body.setAngularVelocity(0, 0, 0)


    //Quick Force Detection i.e bullets
    this.character.body.setCcdMotionThreshold(1e-7)
    this.character.body.setCcdSweptSphereRadius(0.25)

    const sensor = new ExtendedObject3D()
    sensor.position.setY(-0.625)
    this.third.physics.add.existing(sensor, { mass: 1e-10, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
    sensor.body.setCollisionFlags(4)

    // Connect Sensor to Character
    this.third.physics.add.constraints.lock(this.character.body, sensor.body)


    const controls = new ThirdPersonControls(this.third.camera, this.character, {
      offset: new THREE.Vector3(0, 1, 0),
      targetRadius: 3
      
    })

    //Pointer Lock and Drag
  
    //   const pointerLock = new PointerLock(this.game.canvas)
    //   const pointerDrag = new PointerDrag(this.game.canvas)
    //   pointerDrag.onMove(delta => {
    //     const { x, y } = delta
    //   })

    // controls.theta = 90
    
  })//robot added
  
  //Add Camera Fixed to Body------------------

  const followCam = new THREE.Object3D()
  // Copies the Position of the Default Camera
  followCam.position.copy(this.third.camera.position)
  this.character.add(followCam)
  this.camerasArr.push(followCam)

  //Add Collision Detection Events

  // this.third.physics.add.collider(this.newTree, this.character, event=>{
  //   console.log('Collided')
  // })
  this.newTree.body.on.collision((otherObject, event) => {
    if (otherObject.name === 'Dan'){
      // console.log(`tree and ${otherObject.name}: ${event}`)
      this.treeCollide = true
      
    }
  })

  this.earth.body.on.collision((otherObject, event) => {
    if (otherObject.name === 'Dan'){
      // console.log(`tree and ${otherObject.name}: ${event}`)
      this.earthCollide = true
      
    }
  })

  }//create()


  update(time, delta) {
    

    if (this.earth && this.earth.body){

    
    //Sun and Earth Interplay
    const orbitRadius = 5
    const rotationAngle = time * 0.0015
    const { x, y, z } = this.earth.position.clone()

    // Make Object Orbit
    this.earth.position.set(
      Math.cos(rotationAngle) * orbitRadius + this.sun.position.x,
      y,
      Math.sin(rotationAngle) * orbitRadius + this.sun.position.z
    )
    
    const angle = Math.atan2(this.sun.position.x - x, this.sun.position.z - z)
    this.earth.rotation.set(0, angle, 0)

    // console.log('this.earth', this.earth)

    this.earth.body.needUpdate = true
  
  }//end earth rotation

    const keys = {
      w: this.input.keyboard.addKey('w'),
      a: this.input.keyboard.addKey('a'),
      s: this.input.keyboard.addKey('s'),
      d: this.input.keyboard.addKey('d'),
      space: this.input.keyboard.addKey(32, false, false),
      c: this.input.keyboard.addKey('c'),
      
    }

    const v3 = new THREE.Vector3()

    //Camera Lerp + Follow
    const cameraArray = this.third.camera.getWorldPosition(v3)
    this.third.camera.position.lerp(
      cameraArray,
      0.05
      )
    const pos = this.character.position.clone()
    this.third.camera.lookAt(pos.x, pos.y + 3, pos.z)

    if (this.character && this.character.body){
    // Turn Animations
    
      const speed = 6
      
      const rotation = this.third.camera.getWorldDirection(v3)
      let theta = Math.atan2(rotation.x, rotation.z)
      const rotationCharacter = this.character.getWorldDirection(v3)
      let thetaCharacter = Math.atan2(rotationCharacter.x, rotationCharacter.z)
      
      const l = Math.abs(theta - thetaCharacter)
      // console.log('theta', theta)
      const d = Math.PI / 256
      let rotationSpeed = 4
      
      
      if (l > d) {
        if (l > Math.PI - d || theta < thetaCharacter) {
          rotationSpeed *= -1
          this.character.body.setAngularVelocityY(rotationSpeed)
          // console.log('this.characheterbody', this.character)
        } else {
          this.character.body.setAngularVelocityY(rotationSpeed)
        } 
      }
    
    // Character Movements



      if (keys.w.isDown) {
        // this.character.body.setAngularVelocityY(0)

        if (this.character.anims.current === 'idle'){
          this.character.anims.play('run', 10000, true)

          let x = Math.sin(theta) * speed
          let y = this.character.body.velocity.y
          let z = Math.cos(theta) * speed
          this.character.body.setVelocity(x, y, z)
        } 

        } else {
          if (this.character.anims.current === 'run'){
            this.character.anims.play('idle')
          } 
        }

      if (keys.s.isDown) {

        if (this.character.anims.current === 'idle'){
          this.character.anims.play('run', 1000, true)
          theta *= -1
          
          let x = Math.sin(theta) * speed
          let y = this.character.body.velocity.y
          let z = Math.cos(theta) * speed * -1
          this.character.body.setVelocity(x, y, z)
        } 
  
        } else {
          if (this.character.anims.current === 'run'){
            this.character.anims.play('idle')
          } 
        }

      if (keys.a.isDown) {

        if (this.character.anims.current === 'idle'){
          this.character.anims.play('run')
          theta *= -1
          
          let x = Math.cos(theta) * speed
          let y = this.character.body.velocity.y
          let z = Math.sin(theta) * speed
          this.character.body.setVelocity(x, y, z)
        } 
  
        } else {
          if (this.character.anims.current === 'run'){
            this.character.anims.play('idle')
          } 
        }

      if (keys.d.isDown) {

        if (this.character.anims.current === 'idle'){
          this.character.anims.play('run')

          // theta *= -1
          
          let x = Math.cos(theta) * speed * -1
          let y = this.character.body.velocity.y
          let z = Math.sin(theta) * speed
          this.character.body.setVelocity(x, y, z)
        } 
  
        } else {
          if (this.character.anims.current === 'run'){
            this.character.anims.play('idle')
          } 
        }

          
      let canJump =  true
    
      if(Phaser.Input.Keyboard.JustDown(keys.space)){
        
        canJump = false
        this.character.anims.play('jump_start', 200, true)
        this.character.anims.play('fall', 200, false)

        this.time.addEvent({
          delay: 600,
          callback: ()=>{
            canJump = true
            this.character.anims.play('idle')
          }
        })
        
        this.character.body.applyForceY(9)
      }

      if(Phaser.Input.Keyboard.JustDown(keys.c) && this.treeCollide){
        this.character.anims.play('interact', 300, false)
        console.log('chopped')
        const treePos = this.newTree.getWorldPosition(v3)
        this.third.destroy(this.newTree)
        // this.third.scene.add(this.newStump)
        // this.newStump.body.setPosition(treePos.x, treePos.y + 1, treePos.z)
        this.treeCollide = false
        this.stumpCreate(treePos.x, treePos.y, treePos.z)
        this.time.addEvent({
          delay: 600,
          callback: ()=>{
            this.character.anims.play('idle')
            
          }

        })

      }

      if(keys.c.isDown && this.earthCollide){
        this.character.anims.play('push', 100, false)
        console.log('pushed')
        // this.third.scene.add(this.newStump)
        // this.newStump.body.setPosition(treePos.x, treePos.y + 1, treePos.z)
        const pushEarth = this.character.getWorldDirection(v3)
        // console.log(pushEarth)
        this.character.body.applyForce(pushEarth.x * -10, pushEarth.y * -10, pushEarth.z * -10)
        this.earthCollide = false
        this.time.addEvent({
          delay: 300,
          callback: ()=>{
            this.character.anims.play('idle')
            
          }

        })

      }

      

    } //end controls loop
    
  }//update()

} //end MainScene
