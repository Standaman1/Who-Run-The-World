import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader, ThirdPersonControls, PointerLock, PointerDrag } from '@enable3d/phaser-extension'
import Phaser from 'phaser'

export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }

  character = new ExtendedObject3D();
  

  init() {
    this.accessThirdDimension({antialias: true, gravity: { x: 0, y: -20, z: 0 }});
    this.third.load.preload('grass', './assets/img/grass-texture-1.jpg');
    this.third.renderer.outputEncoding = THREE.LinearEncoding;
    
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
    this.third.camera.position.set(0, 10, 20);
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
      // let i = 0
      // let anims = ['idle', 'walk', 'run', 'jump_start', 'fall', 'reception']

      // ad the box man's animation mixer to the animationMixers array (for auto updates)
      // this.third.animationMixers.add(this.character.anims.mixer)


      //Animation of this.character- ------

      // gltf.animations.forEach(animation => {
      //   if (animation.name) {
      //     // add a new animation to the box man
      //     this.character.anims.add(animation.name, animation)
      //   }
      // })

      // gltf.animations.forEach(clip => {
      //   this.character.anims.mixer.clipAction(clip).reset().play()
      // })


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
    this.character.body.setAngularVelocityY(0)


    this.character.body.setCcdMotionThreshold(1e-7)
    this.character.body.setCcdSweptSphereRadius(0.25)

    const sensor = new ExtendedObject3D()
    sensor.position.setY(-0.625)
    this.third.physics.add.existing(sensor, { mass: 1e-8, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
    sensor.body.setCollisionFlags(4)

    // connect sensor to robot
    this.third.physics.add.constraints.lock(this.character.body, sensor.body)


    const controls = new ThirdPersonControls(this.third.camera, this.character, {
      offset: new THREE.Vector3(0, 1, 0),
      targetRadius: 3
      
    })

    controls.theta = 90
    
  })//robot added
  
  

  
  }//create()


  update(time, delta) {
    
    //Keys Events

    const keys = {
      a: this.input.keyboard.addKey('a'),
      w: this.input.keyboard.addKey('w'),
      d: this.input.keyboard.addKey('d'),
      s: this.input.keyboard.addKey('s'),
      space: this.input.keyboard.addKey(32)
    }

    // Turn Animations
    const speed = 3
    const v3 = new THREE.Vector3()

    const rotation = this.third.camera.getWorldDirection(v3)
    const theta = Math.atan2(rotation.x, rotation.z)
    const rotationCharacter = this.character.getWorldDirection(v3)
    const thetaCharacter = Math.atan2(rotationCharacter.x, rotationCharacter.z)

    
    const l = Math.abs(theta - thetaCharacter)
    let d = Math.PI / 24
    let rotationSpeed = 4

    // this.character.body.setAngularVelocityY(0)


    // if (l > d) {
    //   if (l > Math.PI - d || theta < thetaCharacter) {
    //     rotationSpeed *= -1
    //     this.character.body.setAngularVelocityY(rotationSpeed)
    //   } else {
    //     this.character.body.setAngularVelocityY(rotationSpeed)
    //   } 
    // }

    //Character Movements
    if (keys.w.isDown) {

      if (this.character.anims.current === 'idle'){
        this.character.anims.play('run')

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
          this.character.anims.play('run')
          
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

          

    // let spacePress = this.input.keyboard.addKey('SPACE')
    // let spacePressDown = spacePress.isDown;
      if(keys.space.isDown){
        // this.character.anims.play('jump_start')
        this.character.body.applyForceY(1)
      }
    
  }//update()

} //end MainScene
