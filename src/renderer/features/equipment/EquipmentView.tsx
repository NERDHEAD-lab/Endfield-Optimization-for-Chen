import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./equipment.module.css";
import { EquipmentCard } from "./EquipmentCard";
import { EquipmentRecommendModal } from "./EquipmentRecommendModal";
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

export function EquipmentView() {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState<"set" | "single">("set");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    targetStatKey: "",
    targetStatValue: 0,
    isEffect: false,
    targetItemId: "",
  });

  // 세트별 그룹화 및 정렬 로직 (고티어 세트 우선)
  const groupedData = useMemo(() => {
    const groups: Record<string, EquipmentItem[]> = {};
    equipmentData.forEach((item) => {
      if (!groups[item.set]) groups[item.set] = [];
      groups[item.set].push(item);
    });

    return Object.entries(groups).sort((a, b) => {
      const maxTierA = Math.max(...a[1].map((i) => i.tier));
      const maxTierB = Math.max(...b[1].map((i) => i.tier));
      // 1. 티어 내림차순 (5 -> 1)
      if (maxTierB !== maxTierA) return maxTierB - maxTierA;
      // 2. 세트 이름 오름차순
      return a[0].localeCompare(b[0]);
    });
  }, []);

  const handleStatClick = (
    itemId: string,
    statKey: string,
    value: number,
    isEffect: boolean,
  ) => {
    setModalProps({
      targetStatKey: statKey,
      targetStatValue: value,
      isEffect,
      targetItemId: itemId,
    });
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t("nav.equipment")}</h1>
        <p>{t("equipment.description")}</p>
      </header>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${currentTab === "set" ? styles.activeTab : ""}`}
          onClick={() => setCurrentTab("set")}
        >
          {t("equipment.tab.set", "세트별 보기")}
        </button>
        <button
          className={`${styles.tabButton} ${currentTab === "single" ? styles.activeTab : ""}`}
          onClick={() => setCurrentTab("single")}
        >
          {t("equipment.tab.single", "단일 보기")}
        </button>
      </div>

      <div className={styles.content}>
        {currentTab === "set" ? (
          <div className={styles.setList}>
            {groupedData.map(([setName, items]) => (
              <section key={setName} className={styles.setSection}>
                <div className={styles.setSectionHeader}>
                  <h2 className={styles.setSectionTitle}>{setName}</h2>
                  <span className={styles.setTierBadge}>
                    MAX Tier {Math.max(...items.map((i) => i.tier))}
                  </span>
                </div>
                <div className={styles.list}>
                  {items.map((item) => (
                    <EquipmentCard
                      key={item.id}
                      item={item}
                      onStatClick={(key, val, isEffect) =>
                        handleStatClick(item.id, key, val, isEffect)
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.list}>
            {equipmentData
              .sort((a, b) => b.tier - a.tier || a.id.localeCompare(b.id))
              .map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  onStatClick={(key, val, isEffect) =>
                    handleStatClick(item.id, key, val, isEffect)
                  }
                />
              ))}
          </div>
        )}
      </div>

      <EquipmentRecommendModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetStatKey={modalProps.targetStatKey}
        targetStatValue={modalProps.targetStatValue}
        isEffect={modalProps.isEffect}
        targetItemId={modalProps.targetItemId}
      />
    </div>
  );
}
