import { useEffect, useRef } from "react";
import { ScrollTrigger, REDUCED_MOTION_QUERY } from "../utils/gsap";

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

/**
 * Procedural FBM noise scroll-dissolve shader adapted from IronHill / Codegrid,
 * calibrated to pure #000000 with an ultra-subtle graphite veil & champagne frontier.
 */
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform vec3 uEdgeColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

    float dissolveEdge = uv.y - uProgress * 1.18;
    float noiseValue = fbm(centeredUv * 12.0);
    float d = dissolveEdge + noiseValue * uSpread;

    float pixelSize = 1.5 / max(1.0, uResolution.y);
    float mask = 1.0 - smoothstep(-pixelSize, pixelSize, d);

    // Whisper-thin muted champagne frontier along the active FBM dissolve ridge
    float edgeBand = (1.0 - smoothstep(0.0, 0.018, abs(d))) * smoothstep(0.02, 0.12, uProgress);
    vec3 finalColor = mix(uColor, uEdgeColor, edgeBand * 0.55);
    float finalAlpha = clamp(mask * 0.42 + edgeBand * 0.26, 0.0, 0.58);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

interface HeroShaderCanvasProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const HeroShaderCanvas = ({
  sectionRef,
  className,
}: HeroShaderCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const canvas = canvasRef.current;
    const host = sectionRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uColor = gl.getUniformLocation(program, "uColor");
    const uEdgeColor = gl.getUniformLocation(program, "uEdgeColor");
    const uSpread = gl.getUniformLocation(program, "uSpread");

    // Dark obsidian graphite fill (#121212) + muted champagne edge (#B89A6A)
    gl.uniform3f(uColor, 0.07, 0.07, 0.07);
    gl.uniform3f(uEdgeColor, 0.722, 0.604, 0.416);
    gl.uniform1f(uSpread, 0.42);

    let progress = 0;

    const renderFrame = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uProgress, progress);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(host.offsetWidth * dpr));
      const height = Math.max(1, Math.floor(host.offsetHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      renderFrame();
    };

    resize();

    const st = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        progress = self.progress * 1.05;
        renderFrame();
      },
    });

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      st.kill();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [sectionRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default HeroShaderCanvas;
