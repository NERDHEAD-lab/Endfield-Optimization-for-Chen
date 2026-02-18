/**
 * 배터리 종류 열거형 (Enum)
 */
export enum BatteryType {
  MULUNG_1600 = "MULUNG_1600",
  VALLEY_1100 = "VALLEY_1100",
  STANDARD_420 = "STANDARD_420",
  LIGHT_220 = "LIGHT_220",
  RAW_ORE_50 = "RAW_ORE_50",
}

export const SAFETY_MARGIN_OFFSET = 195;

export const BATTERY_DATA: Record<
  BatteryType,
  { name: string; power: number; duration: number }
> = {
  [BatteryType.MULUNG_1600]: {
    name: "무릉 (대용량)",
    power: 1600,
    duration: 40,
  },
  [BatteryType.VALLEY_1100]: {
    name: "협곡 (대용량)",
    power: 1100,
    duration: 40,
  },
  [BatteryType.STANDARD_420]: { name: "표준 키네틱", power: 420, duration: 40 },
  [BatteryType.LIGHT_220]: { name: "경량 키네틱", power: 220, duration: 40 },
  [BatteryType.RAW_ORE_50]: { name: "블라이트 원석", power: 50, duration: 8 },
};

export interface OptimizationResult {
  status: "OPTIMIZED" | "DIRECT_CONNECTION" | "NO_REMAINDER" | "ERROR";
  batteryName: string;
  totalPower: number;

  // [추가] 상시 가동해야 하는 배터리 개수 (몫)
  directRunCount: number;

  remainder: number;
  blueprint?: {
    cycleValue: number;
    settingValue: number;
    splitters: number;
    mergers: number;
    analysis: {
      cyclePeriod: number;
      bufferDuration: number;
      recoveryTime: number;
      isSafe: boolean;
    };
  };
  message: string;
}

export function calculatePowerOptimization(
  targetPower: number,
  type: BatteryType,
): OptimizationResult {
  const battery = BATTERY_DATA[type];

  // 1. 유효성 검사
  if (targetPower <= SAFETY_MARGIN_OFFSET) {
    return {
      status: "ERROR",
      batteryName: battery.name,
      totalPower: targetPower,
      directRunCount: 0,
      remainder: 0,
      message: `전력 소모량이 너무 적습니다. (최소 ${SAFETY_MARGIN_OFFSET + 1} 이상 필요)`,
    };
  }

  // 2. 몫(상시 가동)과 나머지 계산
  const netPower = targetPower - SAFETY_MARGIN_OFFSET;
  const directRunCount = Math.floor(netPower / battery.power); // 몫
  const remainder = netPower % battery.power; // 나머지

  // Case: 나머지가 0인 경우
  if (remainder === 0) {
    return {
      status: "NO_REMAINDER",
      batteryName: battery.name,
      totalPower: targetPower,
      directRunCount,
      remainder: 0,
      message:
        `[${battery.name}] 분석 결과\n` +
        `--------------------------------\n` +
        `🔋 상시 가동(직결): **${directRunCount}개**\n` +
        `✨ 나머지가 0입니다. 추가 회로 없이 깔끔하게 떨어집니다.`,
    };
  }

  // 3. 목표값 계산
  const constant = battery.power * (battery.duration / 2);
  const targetCycleValue = constant / remainder;

  // Case: 값이 24 미만 (직결 권장)
  if (targetCycleValue < 24) {
    return {
      status: "DIRECT_CONNECTION",
      batteryName: battery.name,
      totalPower: targetPower,
      directRunCount,
      remainder: remainder,
      blueprint: {
        cycleValue: targetCycleValue,
        settingValue: 0,
        splitters: 0,
        mergers: 0,
        analysis: {
          cyclePeriod: 0,
          bufferDuration: 0,
          recoveryTime: 0,
          isSafe: true,
        },
      },
      message:
        `[${battery.name}] 분석 결과\n` +
        `--------------------------------\n` +
        `🔋 1. 상시 가동(직결): **${directRunCount}개**\n` +
        `⚡ 2. 추가 가동: **1개** (나머지 ${remainder} 담당)\n` +
        `   └ ⚠️ 나머지 전력이 너무 커서(효율 낮음) 회로 없이 직접 연결하세요.`,
    };
  }

  // Case: 최적화 수행
  let bestVal = 0,
    bestA = 0,
    bestB = 0;

  for (let a = 0; a <= 12; a++) {
    for (let b = 0; b <= 8; b++) {
      const val = Math.pow(2, a) * Math.pow(3, b);
      if (val < targetCycleValue) {
        if (val > bestVal) {
          bestVal = val;
          bestA = a;
          bestB = b;
        }
      } else {
        break;
      }
    }
  }

  // 분석 데이터 계산
  const cyclePeriod = bestVal * 2;
  const bufferDuration = cyclePeriod - battery.duration;
  const netFillRate = battery.power - remainder;
  const recoveryTime = (remainder * bufferDuration) / netFillRate;
  const isSafe = recoveryTime < battery.duration;
  const safeIcon = isSafe ? "✅" : "⚠️";

  return {
    status: "OPTIMIZED",
    batteryName: battery.name,
    totalPower: targetPower,
    directRunCount,
    remainder: remainder,
    blueprint: {
      cycleValue: targetCycleValue,
      settingValue: bestVal,
      splitters: bestA,
      mergers: bestB,
      analysis: { cyclePeriod, bufferDuration, recoveryTime, isSafe },
    },
    message:
      `[${battery.name}] 최적화 성공\n` +
      `--------------------------------\n` +
      `🔋 **1. 상시 가동(직결): ${directRunCount}개**\n` +
      `⚙️ **2. 회로 최적화: 1개** (나머지 ${remainder} 담당)\n` +
      `   └ 목표: ${targetCycleValue.toFixed(2)} / 설정: **${bestVal}**\n` +
      `   └ 배치: 분류기(2) x ${bestA}개, 합류기(3) x ${bestB}개\n` +
      `--------------------------------\n` +
      `📊 상태 분석\n` +
      `   └ 투입 주기: ${cyclePeriod}초 (버퍼: ${bufferDuration.toFixed(1)}초)\n` +
      `   └ ${safeIcon} 충전 완료: ${recoveryTime.toFixed(1)}초 (기준 ${battery.duration}초)`,
  };
}
