/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 helmet.gltf 
Author: LAFF3D (https://sketchfab.com/laff3d)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/capacete-ciclista-436b9cf5a4f1428aa776aa4daa6a1f9a
Title: Capacete Ciclista
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/helmet.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials['Scene_-_Root']} position={[0, 0, 0]} rotation={[0, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/helmet.gltf')