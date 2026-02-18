// powerOptimization.test.ts
import { describe, it, expect } from "vitest";
import { calculatePowerOptimization, BatteryType } from "./utils";

describe("Endfield Power Optimization Calculator", () => {
  // 1. 에러 케이스: 전력량이 마진값(195)보다 작거나 같을 때
  describe("Error Cases (Low Power)", () => {
    it("should return ERROR status if power is below safety margin (195)", () => {
      const result = calculatePowerOptimization(100, BatteryType.MULUNG_1600);
      expect(result.status).toBe("ERROR");
      expect(result.remainder).toBe(0);
    });

    it("should return ERROR status if power is exactly safety margin (195)", () => {
      const result = calculatePowerOptimization(195, BatteryType.MULUNG_1600);
      expect(result.status).toBe("ERROR");
    });
  });

  // 2. 정상 최적화 케이스 (사용자 예시 데이터)
  describe("Optimization Scenarios", () => {
    it("should calculate correct values for Mulung(1600) with 2775 power", () => {
      // 2775 - 195 = 2580
      // 2580 % 1600 = 980 (나머지)
      // 상수(32000) / 980 = 32.65...
      // 최적값: 32 (2^5 * 3^0)
      const result = calculatePowerOptimization(2775, BatteryType.MULUNG_1600);

      expect(result.status).toBe("OPTIMIZED");
      expect(result.remainder).toBe(980);
      expect(result.blueprint?.settingValue).toBe(32);
      expect(result.blueprint?.splitters).toBe(5); // 2^5
      expect(result.blueprint?.mergers).toBe(0); // 3^0
    });

    it("should calculate correct values for Valley(1100) with 2005 power", () => {
      // 2005 - 195 = 1810
      // 1810 % 1100 = 710 (나머지)
      // 상수(22000) / 710 = 30.98...
      // 최적값: 27 (2^0 * 3^3) -> 32는 30.98보다 크므로 탈락, 27이 선정됨
      const result = calculatePowerOptimization(2005, BatteryType.VALLEY_1100);

      expect(result.status).toBe("OPTIMIZED");
      expect(result.remainder).toBe(710);
      expect(result.blueprint?.settingValue).toBe(27);
      expect(result.blueprint?.splitters).toBe(0); // 2^0
      expect(result.blueprint?.mergers).toBe(3); // 3^3
    });
  });

  // 3. 직결 권장 케이스 (계산값 24 미만)
  describe("Direct Connection Cases", () => {
    it("should recommend DIRECT_CONNECTION when remainder is too high", () => {
      // 무릉(1600) 기준
      // 나머지가 1400일 때 -> 32000 / 1400 = 22.85 (24 미만)
      // 입력 전력: 195 + 1400 = 1595
      const result = calculatePowerOptimization(1595, BatteryType.MULUNG_1600);

      expect(result.status).toBe("DIRECT_CONNECTION");
      expect(result.blueprint?.settingValue).toBe(0);
      expect(result.message).toContain("직접 연결");
    });
  });

  // 4. 나머지 0 케이스
  describe("No Remainder Cases", () => {
    it("should return NO_REMAINDER when power fits exactly", () => {
      // 195 + 1600 = 1795
      const result = calculatePowerOptimization(1795, BatteryType.MULUNG_1600);

      expect(result.status).toBe("NO_REMAINDER");
      expect(result.remainder).toBe(0);
    });
  });

  // 5. 특수 배터리 (원석: 8초 지속) 테스트
  describe("Special Battery Specs (Raw Ore)", () => {
    it("should handle short duration batteries correctly", () => {
      // 원석: Power 50, Duration 8s
      // 상수 = 50 * (8/2) = 200

      // 테스트: 나머지가 5인 상황 만들기
      // 목표 사이클 = 200 / 5 = 40
      // 40보다 작은 최적값 -> 36 (2^2 * 3^2)
      // 입력 전력: 195 + 50(몫1) + 5(나머지) = 250

      const result = calculatePowerOptimization(250, BatteryType.RAW_ORE_50);

      expect(result.status).toBe("OPTIMIZED");
      expect(result.remainder).toBe(5);
      expect(result.blueprint?.cycleValue).toBe(40);
      expect(result.blueprint?.settingValue).toBe(36);
      expect(result.blueprint?.splitters).toBe(2);
      expect(result.blueprint?.mergers).toBe(2);
    });
  });
});
