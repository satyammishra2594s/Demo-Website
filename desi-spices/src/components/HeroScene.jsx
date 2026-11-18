import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Bowl() {
  const ref = useRef();
  const profile = useMemo(() => [new THREE.Vector2(0,0),new THREE.Vector2(.7,.05),new THREE.Vector2(1.08,.25),new THREE.Vector2(1.35,.65),new THREE.Vector2(1.42,.78)], []);
  useFrame((state, delta) => { if (ref.current) { ref.current.rotation.y += delta * .12; ref.current.rotation.x = state.pointer.y * .045; } });
  return <group ref={ref} position={[0,-.45,0]}>
    <mesh><latheGeometry args={[profile,64]}/><meshStandardMaterial color="#843b25" metalness={.58} roughness={.26}/></mesh>
    <mesh position={[0,.78,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.42,.055,12,80]}/><meshStandardMaterial color="#e8b75d" metalness={.85}/></mesh>
    <mesh position={[0,.08,0]}><cylinderGeometry args={[1.05,1.05,.1,48]}/><meshStandardMaterial color="#e4a143"/></mesh>
    {Array.from({length:9},(_,i)=><mesh key={i} position={[Math.cos(i*2.4)*.7,.17,Math.sin(i*2.4)*.7]}><sphereGeometry args={[.12,12,10]}/><meshStandardMaterial color={i%2?'#c74b24':'#e4bc59'}/></mesh>)}
  </group>;
}
function Spice({position,color,kind}) {
  return <Float speed={1.4} rotationIntensity={.5} floatIntensity={.7}><mesh position={position} rotation={[.4,.3,.2]}>
    {kind==='star'?<dodecahedronGeometry args={[.3,0]}/>:kind==='stick'?<cylinderGeometry args={[.07,.05,.9,12]}/>:<capsuleGeometry args={[.1,.25,4,8]}/>}
    <meshStandardMaterial color={color} roughness={.65}/>
  </mesh></Float>;
}
function Steam() {
  const ref = useRef();
  useFrame(state => {
    if (!ref.current) return;
    ref.current.children.forEach((particle, index) => {
      const phase = (state.clock.elapsedTime * .22 + index * .071) % 1;
      particle.position.y = .42 + phase * 1.7;
      particle.position.x = Math.sin(phase * 5 + index) * .13;
      particle.material.opacity = .24 * (1 - phase);
      particle.scale.setScalar(.55 + phase * 1.2);
    });
  });
  return <group ref={ref}>{Array.from({ length: 15 }, (_, i) => <mesh key={i} position={[0, .4 + (i % 5) * .12, 0]}>
    <sphereGeometry args={[.065, 8, 8]} /><meshBasicMaterial color="#f7dfbd" transparent opacity={.2} depthWrite={false} />
  </mesh>)}</group>;
}
function Scene() {
  const group=useRef();
  useFrame(state=>{if(group.current){group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,state.pointer.x*.13,.025);group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,-state.pointer.y*.07,.025);}});
  return <group ref={group}><ambientLight intensity={1.3}/><pointLight position={[2,4,4]} intensity={30} color="#ffc66d"/><pointLight position={[-4,1,-3]} intensity={16} color="#bc4c2d"/><Bowl/><Steam/><Spice position={[-2,.4,.3]} color="#9a3824" kind="star"/><Spice position={[2,.8,-.3]} color="#b77939" kind="stick"/><Spice position={[1.8,-.8,.7]} color="#4d7b3e" kind="seed"/><Spice position={[-1.25,1.0,.6]} color="#bd3023" kind="chilli"/><Spice position={[-1.8,-.9,-.7]} color="#ad6335" kind="stick"/><Sparkles count={65} scale={5.5} size={2.3} speed={.22} opacity={.5} color="#f2a31b"/></group>;
}
export default function HeroScene() {
  return <div className="hero-canvas" aria-hidden="true"><Canvas dpr={[1,1.35]} camera={{position:[0,1.1,5.8],fov:40}} gl={{antialias:false,alpha:true,powerPreference:'low-power'}}><Suspense fallback={null}><Scene/></Suspense></Canvas></div>;
}
