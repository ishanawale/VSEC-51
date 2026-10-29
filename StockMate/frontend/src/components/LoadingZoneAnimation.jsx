// Pure HTML + CSS animation (see "Loading-zone animation" in styles/index.css).
// Everything shares one 12 s cycle: red 0-40% (truck waits), green 40-80% (truck drives), yellow 80-100%.
export default function LoadingZoneAnimation() {
  return (
    <div className="card">
      <div className="card-head"><h2>Loading-Zone Animation</h2></div>
      <div className="zone" role="img" aria-label="Truck waits at a red light and drives on green">
        <span className="zone-label">LOADING ZONE</span>
        <div className="signal">
          <span className="lamp red" /><span className="lamp yellow" /><span className="lamp green" />
        </div>
        <div className="zone-road">
          <div className="truck">
            <div className="truck-cargo" /><div className="truck-cab" />
            <span className="wheel w1" /><span className="wheel w2" />
          </div>
        </div>
      </div>
      <p className="hint">Decorative demo only. Red: truck waits. Green: truck moves. It does not affect stock data.</p>
    </div>
  );
}
