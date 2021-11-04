import React from "react"
import Particles from 'react-particles-js';
import particleConfig from './config/particle-config';

export default function ParticleBackground() {
  return (
    <>
        <div id="particles-js">
            <Particles width="100vw" height="100vh" params={particleConfig}></Particles> 
        </div>
    </>
  );
}