import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./equipment.module.css";

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

interface EquipmentCardProps {
  item: EquipmentItem;
  onStatClick: (statKey: string, value: number, isEffect: boolean) => void;
}

export function EquipmentCard({ item, onStatClick }: EquipmentCardProps) {
  const { t } = useTranslation();

  const finalImgUrl = item.imgUrl || "";
  const tierClass = styles[`tier${item.tier}`] || styles.tier1;

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
            {item.stats.map((stat, idx) => (
              <tr
                key={`${stat.type}-${idx}`}
                className={styles.statRow}
                onClick={() => onStatClick(stat.type, stat.value, false)}
                title="클릭하여 상위 호환 재료 검색"
              >
                <td className={styles.statLabel}>{t(`stat.${stat.type}`)}</td>
                <td className={styles.statValue}>+{stat.value}</td>
              </tr>
            ))}

            {item.effects.map((effect, idx) => (
              <tr
                key={`${effect.type}-${idx}`}
                className={styles.effectRow}
                onClick={() => onStatClick(effect.type, effect.value, true)}
                title="클릭하여 상위 호환 재료 검색"
              >
                <td className={styles.statLabel}>
                  {t(`effect.${effect.type}`)}
                </td>
                <td className={styles.statValue}>
                  +{effect.value}
                  {effect.isPercentage ? "%" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
