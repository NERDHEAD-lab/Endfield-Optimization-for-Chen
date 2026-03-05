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

    const targetItem = equipmentData.find((i) => i.id === targetItemId);

    return equipmentData.filter((item) => {
      if (item.id === targetItemId) return false;
      if (targetItem && item.type !== targetItem.type) return false; // 같은 부위만 필터링

      if (isEffect) {
        // effects 배열에서 해당 타입 검색
        const effect = item.effects.find((e) => e.type === targetStatKey);
        return effect !== undefined && effect.value >= targetStatValue;
      } else {
        // stats 배열에서 해당 타입 검색
        const stat = item.stats.find((s) => s.type === targetStatKey);
        return stat !== undefined && stat.value >= targetStatValue;
      }
    });
  }, [isOpen, targetStatKey, targetStatValue, isEffect, targetItemId]);

  // 모달에 표시될 아이템 목록을 '양호(>)'와 '표준(==)'으로 렌더링 직전에 분리하기 위해
  // 값 접근을 미리 해두는 매핑 함수
  const processedItems = useMemo(() => {
    return recommendedItems.map((item) => {
      let currentVal = 0;
      let showPercent = false;

      if (isEffect) {
        const e = item.effects.find((ef) => ef.type === targetStatKey);
        currentVal = e?.value ?? 0;
        showPercent = e?.isPercentage ?? false;
      } else {
        const s = item.stats.find((st) => st.type === targetStatKey);
        currentVal = s?.value ?? 0;
      }

      return {
        ...item,
        currentVal,
        showPercent,
        isGood: currentVal > targetStatValue,
      };
    });
  }, [recommendedItems, isEffect, targetStatKey, targetStatValue]);

  const goodItems = useMemo(
    () => processedItems.filter((i) => i.isGood),
    [processedItems],
  );
  const standardItems = useMemo(
    () => processedItems.filter((i) => !i.isGood),
    [processedItems],
  );

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.modalHeader}>
          <h3>
            [추천 재료 목록]{" "}
            {t(isEffect ? `effect.${targetStatKey}` : `stat.${targetStatKey}`)}
          </h3>
          <p>
            현재 수치(
            <strong>
              {targetStatValue}
              {isEffect ? "%" : ""}
            </strong>
            ) 이상의 효율을 지닌 상위/동급 재료입니다.
          </p>
        </div>

        <div className={styles.modalBody}>
          {processedItems.length > 0 ? (
            <div className={styles.recommendList}>
              {/* 양호 조합 (초과 수치) */}
              {goodItems.length > 0 && (
                <>
                  <div className={styles.recommendGroupHeader}>
                    <span className={styles.badgeGood}>양호 조합</span>
                    <span className={styles.groupDesc}>
                      상위 호환 재료 (현재 수치 초과)
                    </span>
                  </div>
                  {goodItems.map((item) => (
                    <div key={item.id} className={styles.recommendItem}>
                      <div className={styles.recItemMain}>
                        {item.imgUrl ? (
                          <img
                            src={item.imgUrl}
                            alt={t(`equip.${item.id}`)}
                            className={styles.recItemImage}
                          />
                        ) : (
                          <div className={styles.recItemNoImage}>No Img</div>
                        )}
                        <div className={styles.recItemInfo}>
                          <span className={styles.recItemName}>
                            {t(`equip.${item.id}`)}
                          </span>
                          <span className={styles.recItemLevel}>
                            Lv. {item.level} / {t(`part.${item.type}`)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.recItemValue}>
                        +{item.currentVal}
                        {item.showPercent ? "%" : ""}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* 표준 조합 (동일 수치) */}
              {standardItems.length > 0 && (
                <>
                  <div
                    className={styles.recommendGroupHeader}
                    style={goodItems.length > 0 ? { marginTop: "16px" } : {}}
                  >
                    <span className={styles.badgeStandard}>표준 조합</span>
                    <span className={styles.groupDesc}>
                      동급 호환 재료 (현재 수치 동일)
                    </span>
                  </div>
                  {standardItems.map((item) => (
                    <div key={item.id} className={styles.recommendItem}>
                      <div className={styles.recItemMain}>
                        {item.imgUrl ? (
                          <img
                            src={item.imgUrl}
                            alt={t(`equip.${item.id}`)}
                            className={styles.recItemImage}
                          />
                        ) : (
                          <div className={styles.recItemNoImage}>No Img</div>
                        )}
                        <div className={styles.recItemInfo}>
                          <span className={styles.recItemName}>
                            {t(`equip.${item.id}`)}
                          </span>
                          <span className={styles.recItemLevel}>
                            Lv. {item.level} / {t(`part.${item.type}`)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={styles.recItemValue}
                        style={{ color: "#868e96" }}
                      >
                        +{item.currentVal}
                        {item.showPercent ? "%" : ""}
                      </div>
                    </div>
                  ))}
                </>
              )}
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
