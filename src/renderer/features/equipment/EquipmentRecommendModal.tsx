import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./equipment.module.css";
import equipmentDataRaw from "../../../shared/data/equipment.json";

interface EquipmentItem {
  id: string;
  tier: number;
  level: number;
  type: string;
  set: string;
  stats: Array<{ type: string; value: number }>;
  effects: Array<{ type: string; value: number; isPercentage: boolean }>;
  imgUrl?: string;
}

const equipmentData = Object.values(
  equipmentDataRaw as Record<string, EquipmentItem>,
);

interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStatKey: string;
  targetStatValue: number;
  isEffect: boolean;
  targetItemId: string;
}

export function EquipmentRecommendModal({
  isOpen,
  onClose,
  targetStatKey,
  targetStatValue,
  isEffect,
  targetItemId,
}: RecommendModalProps) {
  const { t } = useTranslation();

  const recommendedItems = useMemo(() => {
    if (!isOpen || !targetStatKey) return [];

    return equipmentData.filter((item) => {
      if (item.id === targetItemId) return false;

      if (isEffect) {
        // effects 배열에서 해당 타입 검색
        const effect = item.effects.find((e) => e.type === targetStatKey);
        return effect !== undefined && effect.value > targetStatValue;
      } else {
        // stats 배열에서 해당 타입 검색
        const stat = item.stats.find((s) => s.type === targetStatKey);
        return stat !== undefined && stat.value > targetStatValue;
      }
    });
  }, [isOpen, targetStatKey, targetStatValue, isEffect, targetItemId]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalHeader}>
          <h3>
            [양호 조합]{" "}
            {t(isEffect ? `effect.${targetStatKey}` : `stat.${targetStatKey}`)}{" "}
            추천 강화 재료
          </h3>
          <p>
            현재 수치(
            <strong>
              {targetStatValue}
              {isEffect ? "%" : ""}
            </strong>
            )보다 높은 재료 목록입니다.
          </p>
        </div>

        <div className={styles.modalBody}>
          {recommendedItems.length > 0 ? (
            <div className={styles.recommendList}>
              {recommendedItems.map((item) => {
                let currentVal = 0;
                let showPercent = false;

                if (isEffect) {
                  const e = item.effects.find(
                    (ef) => ef.type === targetStatKey,
                  );
                  currentVal = e?.value ?? 0;
                  showPercent = e?.isPercentage ?? false;
                } else {
                  const s = item.stats.find((st) => st.type === targetStatKey);
                  currentVal = s?.value ?? 0;
                }

                return (
                  <div key={item.id} className={styles.recommendItem}>
                    <div className={styles.recItemInfo}>
                      <span className={styles.recItemName}>
                        {t(`equip.${item.id}`)}
                      </span>
                      <span className={styles.recItemLevel}>
                        Lv. {item.level} / {t(`part.${item.type}`)}
                      </span>
                    </div>
                    <div className={styles.recItemValue}>
                      {currentVal}
                      {showPercent ? "%" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.noRecommend}>
              조건을 만족하는 상위 호환 장비가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
