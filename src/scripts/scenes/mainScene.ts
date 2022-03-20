import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader, ThirdPersonControls, PointerLock, PointerDrag } from '@enable3d/phaser-extension'
import Phaser from 'phaser';



export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }
  
  character = new ExtendedObject3D();
  camerasArr = new Array;
  
  // delta = {};
  

  init() {
    this.accessThirdDimension({antialias: true, gravity: { x: 0, y: -20, z: 0 }});
    this.third.load.preload('grass', './assets/img/grass-texture-1.jpg');
    // this.third.load.preload('backgroundMountain', './assets/background_screen/background_mountain.png');


    this.third.renderer.outputEncoding = THREE.LinearEncoding;
    let canJump = true
    
  }

  // async preLoad(){
  //   const swamp = this.third.load.preload('swamp', './assets/swamp_location/scene.gltf')

  //   const robot = this.third.load.preload('robot', './assets/low_poly_character_kit_animation/robot.gltf')

  //   await Promise.all([swamp, robot])
  // }

  async create() {
    
    //Simple Map##############
    // const {lights} = await this.third.warpSpeed();
    let total = await this.third.warpSpeed('-ground');
    // console.log('warpSpeed', total);
    let directionalLight = this.third.lights.directionalLight();
    directionalLight.intensity = 0.5;
    directionalLight.color.setRGB(0, 0, 1)
    // console.log('scene:', this.third.scene)

    // console.log('lightcolor', lightColor)

    // console.log('directionalLight', directionalLightIntensity)


  
    // Creates allMap ##################
  //   this.third.load.gltf('./assets/swamp_location/scene.gltf').then(object => {
  //     const scene = object.scenes[0]
  //     const allMap = new ExtendedObject3D()
  //     allMap.name = 'scene'
  //     allMap.add(scene)
  //     this.third.add.existing(allMap)
  // })
    // })
    // creates map
    

    // adds a box with physics ##################
    this.third.physics.add.box({ x: -1, y: 2 })
    this.third.physics.add.box({ x: -0.5, y: 1 })
    this.third.physics.add.sphere({ x: -1, y: 3 }, {lambert: {color:'green'}})

    // add a texture ################
    this.third.load.texture('grass').then(grass => {
      grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
      grass.offset.set(0, 0)
      grass.repeat.set(2, 2)

      // BUG: To add shadows to your ground, set transparent = true
      this.third.physics.add.ground({ width: 20, height: 20, y: 0 }, { phong: { map: grass, transparent: true } })
    })

    //add background image
    // this.third.load.texture('backgroundMountain').then(backgroundMountain => {
    //   // change encoding to LinearEncoding
    //   backgroundMountain.encoding = THREE.LinearEncoding
    //   backgroundMountain.needsUpdate = true
    //   this.third.scene.background = backgroundMountain
    // })
    
    this.third.camera.position.set(0, 10, -20)
    this.third.camera.lookAt(0, 0, 0)
    //add a robot
    this.third.load.gltf('./assets/low_poly_character_kit_animation/scene.gltf').then(gltf => {
      
      const child = gltf.scene.children[0];
      // window.character = child;
      child.traverse((obj)=>{
        if(obj.name === "Object_4" ){
          obj.children.splice(18, 7)
        }
      }) //traverse to remove accessories

      
      // const character = new ExtendedObject3D();
      console.log('child', child);
      // this.character.rotateY(Math.PI + 0.1)
      this.character.add(child);
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


    this.character.body.setCcdMotionThreshold(1e-7)
    this.character.body.setCcdSweptSphereRadius(0.25)
    // this.character.body.setVelocity(0,0,0)

    const sensor = new ExtendedObject3D()
    sensor.position.setY(-0.625)
    this.third.physics.add.existing(sensor, { mass: 1e-10, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
    sensor.body.setCollisionFlags(4)

    // connect sensor to robot
    this.third.physics.add.constraints.lock(this.character.body, sensor.body)


    const controls = new ThirdPersonControls(this.third.camera, this.character, {
      offset: new THREE.Vector3(0, 1, 0),
      targetRadius: 3
      
    })

    // const isTouchDevice =  true
    // if (isTouchDevice) {
    //   const pointerLock = new PointerLock(this.game.canvas)
    //   const pointerDrag = new PointerDrag(this.game.canvas)
    //   pointerDrag.onMove(delta => {
    //     if (!pointerLock.isLocked()) return
    //     const { x, y } = delta
    //   })
    // }

    // controls.theta = 90
    
  })//robot added
  
  //Add Camera Fixed to Body

  const followCam = new THREE.Object3D()
  // copies the position of the default camera
  followCam.position.copy(this.third.camera.position)
  this.character.add(followCam)
  this.camerasArr.push(followCam)

  
  }//create()


  update(time, delta) {
    
    //Keys Events
    // controls.update()

    const keys = {
      a: this.input.keyboard.addKey('a'),
      w: this.input.keyboard.addKey('w'),
      d: this.input.keyboard.addKey('d'),
      s: this.input.keyboard.addKey('s'),
      space: this.input.keyboard.addKey(32, false, false)
    }

    // Turn Animations
    const speed = 3
    const v3 = new THREE.Vector3()

    const rotation = this.third.camera.getWorldDirection(v3)
    let theta = Math.atan2(rotation.x, rotation.z)
    const rotationCharacter = this.character.getWorldDirection(v3)
    const thetaCharacter = Math.atan2(rotationCharacter.x, rotationCharacter.z)
    // console.log('this.charccher', this.character.body.angularVelocity())
    // this.character.body.setAngularVelocityY(0)


    
    const l = Math.abs(theta - thetaCharacter)
    // console.log('theta', theta)
    const d = Math.PI / 24
    let rotationSpeed = 4
    
    
    // this.character.body.setAngularVelocityY(0)

    // const walkAnimation = () => {
    //   if (this.character.anims.current !== 'Walking') this.character.anims.play('Walking')
    // }

    // const idleAnimation = () => {
    //   if (this.character.anims.current !== 'Idle') this.character.anims.play('Idle')
    // }
    

    
    //------------other version----------------------------------
    // this.character.body.setVelocityX(speed)
    // console.log('xspeed', this.character.body.velocity.x)

    // if (this.character){
    // const walkDirection = { x:0, z:0 }

    //           // A key
    //           if (
    //             keys.a.isDown) {
    //             walkDirection.x = -speed
    //             this.character.body.setVelocityX(walkDirection.x)
    //             // 
    //             walkAnimation()
    //           }
    //           // D key
    //           else if (
    //             keys.d.isDown) {
    //             walkDirection.x = speed
    //             this.character.body.setVelocityX(walkDirection.x)

    //             // 
    //             walkAnimation()
    //           } else {
    //             walkDirection.x = 0
    //             // 
    //             idleAnimation()
    //           }
    //           // W Key
    //           if (
    //             keys.s.isDown) {
    //             walkDirection.z = speed
    //             this.character.body.setVelocityZ(walkDirection.z)

    //             // 
    //             walkAnimation()
    //           }
    //           // S key
    //           else if (
    //             keys.w.isDown) {
    //             walkDirection.z = -speed
    //             this.character.body.setVelocityZ(walkDirection.z)

    //             // 
    //             walkAnimation()
    //           } else {
    //             walkDirection.z = 0
    //             // this.idleAnimation()
    //           }

    //           // walk
    //           // this.character.body.setVelocity(walkDirection.x, 0, walkDirection.z)
    //           // this.character.body.setVelocityZ(walkDirection.z)

    //           // is idle?
    //           // console.log('walkDirection', walkDirection.x)
    //           const isIdle = walkDirection.x === 0 && walkDirection.z === 0

    //           if (isIdle) idleAnimation()
    //           else walkAnimation()

    //           // turn player
    //           if (!isIdle) {
    //             let directionTheta = Math.atan2(walkDirection.x, walkDirection.z) + Math.PI
    //             let playerTheta = this.character.world.theta + Math.PI
    //             let diff = directionTheta - playerTheta
    //             console.log(directionTheta, playerTheta, diff)
    //             if (diff > 0.25) 
    //             // while(diff !== 0)
    //             this.character.body.setAngularVelocityY(10)
    //             if (diff < -0.25) 
    //             // while(diff !== 0)
    //             this.character.body.setAngularVelocityY(-10)
    //           }
            

    //         // jump
    //         if (keys.space.isDown && this.character.userData.onGround && Math.abs(this.character.body.velocity.y) < 1e-1) {
    //           this.character.anims.play('Walk')
    //           this.character.body.applyForceY(16)
    //         }
    //       }

          //---------------------------------------One version

    // if (l > d) {
    //   if (l > Math.PI - d || theta < thetaCharacter) {
    //     rotationSpeed *= -1
    //     this.character.body.setAngularVelocityY(rotationSpeed)
    //   } else {
    //     this.character.body.setAngularVelocityY(rotationSpeed)
    //   } 
    // }

    //Camera Lerp
    const cameraArray = this.third.camera.getWorldPosition(v3)
    this.third.camera.position.lerp(
      cameraArray,
      0.05
      )
    const pos = this.character.position.clone()
    this.third.camera.lookAt(pos.x, pos.y + 3, pos.z)

    // Character Movements

    

    if (this.character){

    if (keys.w.isDown) {
      // this.character.body.setAngularVelocityY(0)

      if (this.character.anims.current === 'idle'){
        this.character.anims.play('run', 15, true)

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
        this.character.anims.play('jump_start', 500, false)
        this.time.addEvent({
          delay: 300,
          callback: ()=>{
            canJump = true
            this.character.anims.play('idle')
          }
        })
        
        this.character.body.applyForceY(9)
      }

    } //end controls loop
    
  }//update()

} //end MainScene
