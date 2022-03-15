import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D, PhysicsLoader } from '@enable3d/phaser-extension'
import Phaser from 'phaser'

export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    this.accessThirdDimension({antialias: true})
    this.third.load.preload('grass', './assets/img/grass-texture-1.jpg')
  }

  create() {
    // creates a nice scene
    this.third.warpSpeed()

    // adds a box
    this.third.add.box({ x: 1, y: 2 })

    // adds a box with physics
    this.third.physics.add.box({ x: -1, y: 2 })
    this.third.physics.add.box({ x: -0.5, y: 1 })
    this.third.physics.add.sphere({ x: -1, y: 5 }, {lambert: {color:'green'}})

    //add a texture
    this.third.load.texture('grass').then(grass => {
      grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
      grass.offset.set(0, 0)
      grass.repeat.set(2, 2)

      // BUG: To add shadows to your ground, set transparent = true
      this.third.physics.add.ground({ width: 20, height: 20, y: 0 }, { phong: { map: grass, transparent: true } })
    })

    //add a robot
    this.third.load.gltf('./assets/low_poly_character_kit_animation/scene.gltf').then(gltf => {
      const child = gltf.scene.children[0]

      const character = new ExtendedObject3D()
      character.add(child)
      this.third.scene.add(character)

      let i = 0
      let anims = ['run', 'sprint', 'jump_running', 'idle', 'driving', 'falling']

      // ad the box man's animation mixer to the animationMixers array (for auto updates)
      this.third.animationMixers.add(character.anims.mixer)

      gltf.animations.forEach(animation => {
        if (animation.name) {
          // add a new animation to the box man
          character.anims.add(animation.name, animation)
        }
      })

    // setTimeout(() => {
    //   this.scene.restart()
    // }, 60000)


  //   // throws some random object on the scene
  })
  }
  update() {}
}
