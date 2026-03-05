import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./equipment.module.css";
import equipmentDataRaw from "../../../shared/data/equipment.json";

interface StatEntry {
  type: string;
  value: number;
}

interface EffectEntry {
  type: string;
  value: number;
  isPercentage: boolean;
}

interface EquipmentItem {
  id: string;
  tier: number;
  level: number;
  type: string;
  set: string;
  stats: StatEntry[];
  effects: EffectEntry[];
  imgUrl?: string;
}

const equipmentData = Object.values(
  equipmentDataRaw as Record<string, EquipmentItem>,
);

interface EquipmentCardProps {
  item: EquipmentItem;
  onStatClick: (statKey: string, value: number, isEffect: boolean) => void;
}

export function EquipmentCard({ item, onStatClick }: EquipmentCardProps) {
  const { t } = useTranslation();

  const finalImgUrl = item.imgUrl || "";
  const tierClass = styles[`tier${item.tier}`] || styles.tier1;

  // 같은 파트(종류)의 장비 중 비교 (3단계 상태 반환)
  // "양호" : 더 높은 수치의 장비가 있음 (노란 테두리, 활성화)
  // "표준" : 더 높은 수치는 없으나, 같은 수치의 다른 장비가 있음 (은색 테두리, 활성화)
  // "최고" : 더 높거나 같은 수치의 타 장비가 없음 (비활성화)
  const getStatQuality = (
    statKey: string,
    value: number,
    isEffect: boolean,
  ) => {
    let hasHigher = false;
    let hasSame = false;

    for (const eq of equipmentData) {
      if (eq.id === item.id) continue;
      if (eq.type !== item.type) continue; // 같은 부위만 비교

      let compareValue: number | undefined;
      if (isEffect) {
        const effect = eq.effects.find((e) => e.type === statKey);
        compareValue = effect?.value;
      } else {
        const stat = eq.stats.find((s) => s.type === statKey);
        compareValue = stat?.value;
      }

      if (compareValue !== undefined) {
        if (compareValue > value) hasHigher = true;
        else if (compareValue === value) hasSame = true;
      }

      // 더 높은게 발견되면 즉시 "양호" 확정 가능하므로 루프 종료 최적화
      if (hasHigher) break;
    }

    if (hasHigher) return "양호";
    if (hasSame) return "표준";
    return "최고";
  };

  return (
    <div className={styles.cardContainer}>
      {/* 헤더: 나무위키 컬러 테마 적용 */}
      <div className={`${styles.cardHeader} ${tierClass}`}>
        <span className={styles.cardTitle}>{t(`equip.${item.id}`)}</span>
        <div className={styles.headerIcon}>
          {/* 아이콘 공간 (이미지의 우상단 단조 아이콘 대용) */}
          <span style={{ opacity: 0.8, fontSize: "14px" }}>⚒️</span>
        </div>
      </div>

      {/* 정보 영역: 레벨, 파트, 별점, 이미지 */}
      <div className={styles.cardInfoArea}>
        <div className={styles.cardLevelArea}>
          Lv. {item.level} / {t(`part.${item.type}`)}
        </div>
        <div className={styles.cardStars}>{"★".repeat(item.tier)}</div>

        {finalImgUrl ? (
          <img
            src={finalImgUrl}
            alt={t(`equip.${item.id}`)}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>

      {/* 스탯 테이블 영역 */}
      <div className={styles.cardStatsArea}>
        <div className={styles.setName}>{item.set}</div>
        <table className={styles.statsTable}>
          <tbody>
            {item.stats.map((stat, idx) => {
              const quality = getStatQuality(stat.type, stat.value, false);

              const btnClass =
                quality === "양호" ? styles.btnGood : styles.btnStandard;

              return (
                <tr key={`${stat.type}-${idx}`} className={styles.statRow}>
                  <td className={styles.statLabel}>{t(`stat.${stat.type}`)}</td>
                  <td className={styles.statValue}>+{stat.value}</td>
                  <td className={styles.statAction}>
                    <button
                      className={`${styles.recommendBtn} ${btnClass}`}
                      onClick={() => onStatClick(stat.type, stat.value, false)}
                      title="클릭하여 재료 검색"
                    >
                      재료 추천
                    </button>
                  </td>
                </tr>
              );
            })}

            {item.effects.map((effect, idx) => {
              const quality = getStatQuality(effect.type, effect.value, true);

              const btnClass =
                quality === "양호" ? styles.btnGood : styles.btnStandard;

              return (
                <tr key={`${effect.type}-${idx}`} className={styles.effectRow}>
                  <td className={styles.statLabel}>
                    {t(`effect.${effect.type}`)}
                  </td>
                  <td className={styles.statValue}>
                    +{effect.value}
                    {effect.isPercentage ? "%" : ""}
                  </td>
                  <td className={styles.statAction}>
                    <button
                      className={`${styles.recommendBtn} ${btnClass}`}
                      onClick={() =>
                        onStatClick(effect.type, effect.value, true)
                      }
                      title="클릭하여 재료 검색"
                    >
                      재료 추천
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
