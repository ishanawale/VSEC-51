import { useEffect, useRef, useState } from 'react';
import { Eraser, Trash2 } from 'lucide-react';

const HEIGHT = 320;

// Simple drawing pad (HTML5 Canvas + Pointer Events: works with mouse, touch and pen).
// Drawings are not saved anywhere - this tool is separate from inventory data.
export default function WarehouseCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);   // last pointer position (curve control point)
  const mid = useRef(null);    // last midpoint (curve start)
  const [color, setColor] = useState('#1f6f4a');
  const [size, setSize] = useState(4);
  const [erasing, setErasing] = useState(false);

  // Resize the canvas to its container while keeping what was already drawn.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const resize = () => {
      const width = Math.floor(wrap.clientWidth);
      if (!width) return;
      const dpr = window.devicePixelRatio || 1;
      const snapshot = document.createElement('canvas');
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext('2d').drawImage(canvas, 0, 0);

      canvas.width = width * dpr;
      canvas.height = HEIGHT * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${HEIGHT}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (snapshot.width && snapshot.height) ctx.drawImage(snapshot, 0, 0, snapshot.width / dpr, snapshot.height / dpr);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const applyStyle = (ctx) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
  };

  const handleDown = (e) => {
    canvasRef.current.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = getPoint(e);
    last.current = p;
    mid.current = p;
    const ctx = canvasRef.current.getContext('2d');
    applyStyle(ctx);
    ctx.beginPath();
    ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2); // a single click leaves a dot
    ctx.fill();
  };

  const handleMove = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = getPoint(e);
    const newMid = { x: (last.current.x + p.x) / 2, y: (last.current.y + p.y) / 2 };
    applyStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(mid.current.x, mid.current.y);
    ctx.quadraticCurveTo(last.current.x, last.current.y, newMid.x, newMid.y); // smooth curve
    ctx.stroke();
    mid.current = newMid;
    last.current = p;
  };

  const handleUp = () => { drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  return (
    <div className="card">
      <div className="card-head"><h2>Warehouse Layout Drawing Pad</h2></div>
      <div className="canvas-tools">
        <label>Colour <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setErasing(false); }} /></label>
        <label>Brush <input type="range" min="1" max="30" value={size} onChange={(e) => setSize(Number(e.target.value))} /> {size}px</label>
        <button className={`btn sm ${erasing ? 'primary' : ''}`} onClick={() => setErasing((x) => !x)} aria-pressed={erasing}><Eraser size={15} /> Eraser</button>
        <button className="btn sm" onClick={clear}><Trash2 size={15} /> Clear</button>
      </div>
      <div className="canvas-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp} onPointerCancel={handleUp} aria-label="Drawing canvas" />
      </div>
      <p className="hint">A sketch pad for rough ideas. Drawings are not saved.</p>
    </div>
  );
}
