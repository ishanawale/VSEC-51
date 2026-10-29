import InventoryValueCalculator from '../components/InventoryValueCalculator.jsx';
import StockCalculator from '../components/StockCalculator.jsx';
import WarehouseCanvas from '../components/WarehouseCanvas.jsx';
import LoadingZoneAnimation from '../components/LoadingZoneAnimation.jsx';

export default function Tools() {
  return (
    <>
      <p className="muted" style={{ marginTop: 0 }}>Small educational utilities. They are separate from your stored inventory data.</p>
      <div className="two-col">
        <InventoryValueCalculator />
        <StockCalculator />
      </div>
      <div className="stack">
        <WarehouseCanvas />
        <LoadingZoneAnimation />
      </div>
    </>
  );
}
