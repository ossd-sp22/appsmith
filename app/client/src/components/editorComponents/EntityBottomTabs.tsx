import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "actions/debuggerActions";
import {
  CollapsibleTabProps,
  collapsibleTabRequiredPropKeys,
  TabComponent,
  TabProp,
} from "components/ads/Tabs";
import { getCurrentDebuggerTab } from "selectors/debuggerSelectors";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { DEBUGGER_TAB_KEYS } from "./Debugger/helpers";

type EntityBottomTabsProps = {
  defaultIndex: number;
  tabs: TabProp[];
};

type CollapsibleEntityBottomTabsProps = EntityBottomTabsProps &
  CollapsibleTabProps;

// Tab is considered collapsible only when all required collapsible props are present
export const isCollapsibleEntityBottomTab = (
  props: EntityBottomTabsProps | CollapsibleEntityBottomTabsProps,
): props is CollapsibleEntityBottomTabsProps =>
  collapsibleTabRequiredPropKeys.every((key) => key in props);

// Using this if there are debugger related tabs
function EntityBottomTabs(
  props: EntityBottomTabsProps | CollapsibleEntityBottomTabsProps,
) {
  const [selectedIndex, setSelectedIndex] = useState(props.defaultIndex);
  const currentTab = useSelector(getCurrentDebuggerTab);
  const dispatch = useDispatch();
  const onTabSelect = (index: number) => {
    dispatch(setCurrentTab(props.tabs[index].key));
    setIndex(index);
  };

  const setIndex = (index: number) => {
    const tabKey = props.tabs[index].key;
    setSelectedIndex(index);
    if (Object.values<string>(DEBUGGER_TAB_KEYS).includes(tabKey)) {
      AnalyticsUtil.logEvent("DEBUGGER_TAB_SWITCH", {
        tabName: tabKey,
      });
    }
  };

  useEffect(() => {
    const index = props.tabs.findIndex((tab) => tab.key === currentTab);
    if (index >= 0) {
      setIndex(index);
    } else {
      setIndex(props.defaultIndex);
    }
  }, [currentTab]);

  return (
    <TabComponent
      onSelect={onTabSelect}
      selectedIndex={selectedIndex}
      tabs={props.tabs}
      {...(isCollapsibleEntityBottomTab(props)
        ? {
            containerRef: props.containerRef,
            expandedHeight: props.expandedHeight,
          }
        : {})}
    />
  );
}

export default EntityBottomTabs;
