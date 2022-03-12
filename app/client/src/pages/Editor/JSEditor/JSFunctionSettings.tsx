import { updateFunctionProperty } from "actions/jsPaneActions";
import {
  ASYNC_FUNCTION_SETTINGS_HEADING,
  createMessage,
  NO_ASYNC_FUNCTIONS,
} from "ce/constants/messages";
import { AppIcon, Radio, RadioComponent } from "components/ads";
import TooltipComponent from "components/ads/Tooltip";
import { JSAction } from "entities/JSCollection";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { RADIO_OPTIONS, SETTINGS_HEADINGS } from "./constants";

type SettingsHeadingProps = {
  text: string;
  hasInfo?: boolean;
  info?: string;
  grow: boolean;
};

type SettingsItemProps = {
  action: JSAction;
};

type JSFunctionSettingsProps = {
  actions: JSAction[];
};

const SettingRow = styled.div<{ isHeading?: boolean; noBorder?: boolean }>`
  display: flex;
  padding: 8px;
  ${(props) =>
    !props.noBorder &&
    `
  border-bottom: solid 1px ${props.theme.colors.table.border}};
  `}

  ${(props) =>
    props.isHeading &&
    `   
  background: #f8f8f8; 
  `};
`;

const StyledIcon = styled(AppIcon)`
  width: max-content;
  height: max-content;
  & > svg {
    width: 13px;
    height: auto;
  }
`;

const SettingColumn = styled.div<{ grow?: boolean; isHeading?: boolean }>`
  display: flex;
  align-items: center;
  flex-grow: ${(props) => (props.grow ? 1 : 0)};
  padding: 5px 12px;
  min-width: 250px;

  ${(props) =>
    props.isHeading &&
    `
  text-transform: uppercase;
  `}

  ${StyledIcon} {
    margin-left: 8px;
  }

  ${Radio} {
    margin-right: 20px;
  }
`;

const JSFunctionSettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px ${(props) => props.theme.spaces[13] - 2}px;
  width: max-content;
  min-width: 700px;

  & > h3 {
    margin: 20px 0;
    font-size: 17px;
    text-transform: capitalize;
  }
`;

function SettingsHeading({ grow, hasInfo, info, text }: SettingsHeadingProps) {
  return (
    <SettingColumn grow={grow} isHeading>
      <span>{text}</span>
      {hasInfo && info && (
        <TooltipComponent content={createMessage(() => info)}>
          <StyledIcon name="help" />
        </TooltipComponent>
      )}
    </SettingColumn>
  );
}

function SettingsItem({ action }: SettingsItemProps) {
  const dispatch = useDispatch();
  const [executeOnPageLoad, setExecuteOnPageLoad] = useState(
    String(!!action.executeOnLoad),
  );
  const [confirmBeforeExecute, setConfirmBeforeExecute] = useState(
    String(!!action.confirmBeforeExecute),
  );

  const updateProperty = (value: boolean | number, propertyName: string) => {
    dispatch(
      updateFunctionProperty({
        action: action,
        propertyName: propertyName,
        value: value,
      }),
    );
  };
  const onChangeExecuteOnPageLoad = (value: string) => {
    setExecuteOnPageLoad(value);
    updateProperty(value === "true", "executeOnLoad");
  };
  const onChangeConfirmBeforeExecute = (value: string) => {
    setConfirmBeforeExecute(value);
    updateProperty(value === "true", "confirmBeforeExecute");
  };

  return (
    <SettingRow>
      <SettingColumn grow>
        <span>{action.name}</span>
      </SettingColumn>
      <SettingColumn>
        <RadioComponent
          defaultValue={executeOnPageLoad}
          name={`execute-on-page-load-${action.id}`}
          onSelect={onChangeExecuteOnPageLoad}
          options={RADIO_OPTIONS}
        />
      </SettingColumn>
      <SettingColumn>
        <RadioComponent
          defaultValue={confirmBeforeExecute}
          name={`confirm-before-execute-${action.id}`}
          onSelect={onChangeConfirmBeforeExecute}
          options={RADIO_OPTIONS}
        />
      </SettingColumn>
    </SettingRow>
  );
}

function JSFunctionSettingsView({ actions }: JSFunctionSettingsProps) {
  const asyncActions = actions.filter(
    (action) => action.actionConfiguration.isAsync,
  );
  return (
    <JSFunctionSettingsWrapper>
      <h3>{createMessage(ASYNC_FUNCTION_SETTINGS_HEADING)}</h3>
      <SettingRow isHeading>
        {SETTINGS_HEADINGS.map((setting, index) => (
          <SettingsHeading
            grow={index === 0}
            hasInfo={setting.hasInfo}
            info={setting.info}
            key={setting.key}
            text={setting.text}
          />
        ))}
      </SettingRow>
      {asyncActions && asyncActions.length ? (
        asyncActions.map((action) => (
          <SettingsItem action={action} key={action.id} />
        ))
      ) : (
        <SettingRow noBorder>
          <SettingColumn>{createMessage(NO_ASYNC_FUNCTIONS)}</SettingColumn>
        </SettingRow>
      )}
    </JSFunctionSettingsWrapper>
  );
}

export default JSFunctionSettingsView;
