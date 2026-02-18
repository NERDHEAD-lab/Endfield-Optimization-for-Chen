import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./BatteryCalculator.css";

import { BATTERY_DATA, BatteryType, calculatePowerOptimization } from "./utils";

export default function BatteryCalculator() {
  const { t } = useTranslation();
  const [target, setTarget] = useState<number>(2775); // Unit test example default
  const [batteryType, setBatteryType] = useState<BatteryType>(
    BatteryType.LC_WULING,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const result = useMemo(() => {
    return calculatePowerOptimization(target, batteryType);
  }, [target, batteryType]);

  const selectedBattery = BATTERY_DATA[batteryType];

  return (
    <div className="battery-calculator-container">
      <div className="card input-section">
        <div className="form-group">
          <label>{t("battery.target")}</label>
          <input
            type="number"
            value={target}
            onChange={(e) =>
              setTarget(Number.parseInt(e.target.value, 10) || 0)
            }
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>{t("battery.type_select")}</label>
          <div className="custom-dropdown-container">
            <div
              className={`custom-dropdown-selected ${isDropdownOpen ? "active" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={selectedBattery.icon}
                alt=""
                className="dropdown-icon"
              />
              <span className="dropdown-label">
                {t(selectedBattery.name)} ({selectedBattery.power}W)
              </span>
              <span className="material-symbols-outlined expand-icon">
                {isDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </div>

            {isDropdownOpen && (
              <>
                <div
                  className="dropdown-overlay"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="custom-dropdown-list">
                  {Object.values(BatteryType).map((type) => (
                    <div
                      key={type}
                      className={`custom-dropdown-item ${batteryType === type ? "selected" : ""}`}
                      onClick={() => {
                        setBatteryType(type);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img
                        src={BATTERY_DATA[type].icon}
                        alt=""
                        className="dropdown-icon"
                      />
                      <span>
                        {t(BATTERY_DATA[type].name)} ({BATTERY_DATA[type].power}
                        W)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
