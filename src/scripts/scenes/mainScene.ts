import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader, ThirdPersonControls, PointerLock, PointerDrag } from '@enable3d/phaser-extension'
import Phaser from 'phaser'

export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.accessThirdDimension({antialias: true})
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
    const total = await this.third.warpSpeed()
    console.log('warpSpeed', total)
    // this.third.warpSpeed()
    // this.lights
    // const { lights } = this.third.warpSpeed('-ground', '-orbitControls')
    ;(await this.third.warpSpeed()).camera

  
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
    this.third.load.gltf('./assets/low_poly_character_kit_animation/robot.gltf').then(gltf => {
      const child = gltf.scene.children[0]

      const character = new ExtendedObject3D()
      character.add(child)
      this.third.scene.add(character)

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

      this.third.animationMixers.add(character.anims.mixer)
            gltf.animations.forEach(animation => {
              if (animation.name) {
                character.anims.add(animation.name, animation)
              }
            })
            character.anims.play('walk')

    // setTimeout(() => {
    //   this.scene.restart()
    // }, 60000)


  
    })//robot added

  }//create()

  update() {}
}
