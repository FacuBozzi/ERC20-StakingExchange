import React from "react"
import Particles from 'react-particles-js';
import particleConfig from './config/particle-config';

export default function ParticleBackground() {
  return (
    <>
        <div id="particles-js">
            <Particles params={particleConfig}></Particles> 
        </div>
    </>
  );
}