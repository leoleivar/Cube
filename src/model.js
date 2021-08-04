import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'

class model {
    constructor (obj) {
        // console .log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad
        
        this.loader = new GLTFLoader()
        this.DRACOLoader = new DRACOLoader()
        this.DRACOLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.DRACOLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {

            /*------------------------------
            Original Mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]
            this.material = new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true
            })

            /*------------------------------
            Material Mesh
            ------------------------------*/
            this.mesh.material = this.material

            /*------------------------------
            Geometry Mesh
            ------------------------------*/
            this.geometry = this.mesh.geometry
            // console.log(this.geometry)

            /*------------------------------
            Particles Material
            ------------------------------*/
            this.particlesmaterial = new THREE.PointsMaterial({
                color: 'red',
                size: 0.007
            })

            /*------------------------------
            Particles Geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 90000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles 
            * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x, // 0 - 3
                    newPosition.y, // 1 - 4
                    newPosition.z  // 2 - 5
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new 
            THREE.BufferAttribute(particlesPosition, 3))

            console.log(this.particlesGeometry)

            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, 
            this.particlesmaterial)
            
            /*------------------------------
            Place on Load
            ------------------------------*/
            if (this.placeOnLoad) {
                this.add()
            }
        })
    }

    add(){
        this.scene.add(this.particles)
    }

    remove() {
        this.scene.remove(this.particles)
    }

}
export default model
