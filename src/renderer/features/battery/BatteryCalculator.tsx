import React, { useState, useMemo } from "react";
import "./BatteryCalculator.css";
import { IFeatureModule } from "../feature.types";
import {
  BATTERY_DATA,
  BatteryType,
  calculatePowerOptimization,
  OptimizationResult,
} from "./utils";

export const BatteryFeature: IFeatureModule = {
  menu: {
    id: "battery",
    label: "nav.battery",
    section: "body",
    priority: 10,
    component: BatteryCalculator,
  },
};

export default function BatteryCalculator() {
  const [target, setTarget] = useState<number>(2775); // Unit test example default
  const [batteryType, setBatteryType] = useState<BatteryType>(
    BatteryType.MULUNG_1600,
  );

  const result = useMemo(() => {
    return calculatePowerOptimization(target, batteryType);
  }, [target, batteryType]);

  return (
    <div className="p-8 battery-calculator-container">
      <h1>Battery Optimization (Mulung)</h1>

      <div className="card input-section">
        <div className="form-group">
          <label>Target Power (시설 총 전력):</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Battery Type (배터리 종류):</label>
          <select
            value={batteryType}
            onChange={(e) => setBatteryType(e.target.value as BatteryType)}
            className="input-field select-field"
          >
            {Object.values(BatteryType).map((type) => (
              <option key={type} value={type}>
                {BATTERY_DATA[type].name} ({BATTERY_DATA[type].power}W)
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className={`result-card status-${result.status.toLowerCase()}`}>
          <h2>Optimization Result</h2>
          <div className="stats">
            <p className="status-badge">
              Status: <strong>{result.status}</strong>
            </p>
            <p className="message-box">{result.message}</p>

            <div className="details-grid">
              <div className="detail-item">
                <span>Target Power</span>
                <strong>{result.totalPower}</strong>
              </div>
              <div className="detail-item">
                <span>Remainder</span>
                <strong>{result.remainder}</strong>
              </div>
              {result.blueprint && (
                <>
                  <div className="detail-item">
                    <span>Target Cycle</span>
                    <strong>{result.blueprint.cycleValue.toFixed(2)}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Setting Value</span>
                    <strong>{result.blueprint.settingValue}</strong>
                  </div>
                </>
              )}
            </div>

            {result.blueprint && (
              <div className="blueprint-box">
                <h3>Circuit Blueprint</h3>
                <div className="blueprint-row">
                  <div className="blueprint-item">
                    <span className="label">2-Splitters (분류기)</span>
                    <span className="value">{result.blueprint.splitters}</span>
                  </div>
                  <div className="blueprint-item">
                    <span className="label">3-Mergers (합류기)</span>
                    <span className="value">{result.blueprint.mergers}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
