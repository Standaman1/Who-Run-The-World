import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader, ThirdPersonControls, PointerLock, PointerDrag } from '@enable3d/phaser-extension'
import Phaser from 'phaser'
import { AmbientLight } from 'three'

export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.accessThirdDimension({antialias: true, gravity: { x: 0, y: -20, z: 0 }})
    this.third.load.preload('grass', './assets/img/grass-texture-1.jpg')
    this.third.renderer.outputEncoding = THREE.LinearEncoding
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
    console.log('warpSpeed', total);
    this.third.camera.position.set(0, 10, 20);
    let directionalLight = this.third.lights.directionalLight();
    directionalLight.intensity = 0.5;
    directionalLight.color.setRGB(0, 0, 1)
    console.log('scene:', this.third.scene)

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
    this.third.physics.add.sphere({ x: -1, y: 5 }, {lambert: {color:'green'}})

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
      console.log('gltf.scene', gltf);
      // const robot = new ExtendedObject3D();
      const character = new ExtendedObject3D();
      console.log('character', character)
      // character.rotateY(Math.PI + 0.1)
      character.add(child);
      character.position.set(2, 2, 2)
      this.third.scene.add(character)

      this.third.animationMixers.add(character.anims.mixer)
            gltf.animations.forEach(animation => {
              if (animation.name) {
                character.anims.add(animation.name, animation)
              }
            })
            character.anims.play('idle')
      // let i = 0
      // let anims = ['idle', 'walk', 'run', 'jump_start', 'fall', 'reception']

      // ad the box man's animation mixer to the animationMixers array (for auto updates)
      // this.third.animationMixers.add(character.anims.mixer)


      //Animation of character- ------

      // gltf.animations.forEach(animation => {
      //   if (animation.name) {
      //     // add a new animation to the box man
      //     character.anims.add(animation.name, animation)
      //   }
      // })

      // gltf.animations.forEach(clip => {
      //   character.anims.mixer.clipAction(clip).reset().play()
      // })


    // setTimeout(() => {
    //   this.scene.restart()
    // }, 60000)


  
    })//robot added

  }//create()

  update() {}
}
