import React, { useState } from "react";
import styled from "styled-components";
import { Template as TemplateInterface } from "api/TemplatesApi";
import history from "utils/history";
import Button, { Size } from "components/ads/Button";
import Tooltip from "components/ads/Tooltip";
import { TEMPLATE_ID_URL } from "constants/routes";
import ForkTemplateDialog from "../ForkTemplate";
import DatasourceChip from "../DatasourceChip";
import LargeTemplate from "./LargeTemplate";
import { getTypographyByKey } from "constants/DefaultTheme";
import { Colors } from "constants/Colors";
import { createMessage, FORK_THIS_TEMPLATE } from "ce/constants/messages";

const TemplateWrapper = styled.div`
  border: 1px solid ${Colors.GEYSER_LIGHT};
  margin-bottom: ${(props) => props.theme.spaces[12]}px;
  transition: all 1s ease-out;
  cursor: pointer;
  background-color: ${Colors.WHITE};

  &:hover {
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1),
      0px 8px 8px -4px rgba(16, 24, 40, 0.04);
  }
`;

const ImageWrapper = styled.div`
  padding: ${(props) =>
    `${props.theme.spaces[9]}px ${props.theme.spaces[11]}px`};
  overflow: hidden;
`;

const StyledImage = styled.img`
  box-shadow: 0px 17.52px 24.82px rgba(0, 0, 0, 0.09);
  object-fit: cover;
`;

const TemplateContent = styled.div`
  border-top: 0.73px solid ${Colors.GEYSER_LIGHT};
  padding: 16px 25px;
  display: flex;
  flex-direction: column;
  flex: 1;

  .title {
    ${(props) => getTypographyByKey(props, "h4")}
    color: ${Colors.EBONY_CLAY};
  }
  .categories {
    ${(props) => getTypographyByKey(props, "p1")}
    color: var(--appsmith-color-black-800);
    margin-top: ${(props) => props.theme.spaces[1]}px;
  }
  .description {
    margin-top: ${(props) => props.theme.spaces[2]}px;
    color: var(--appsmith-color-black-700);
    ${(props) => getTypographyByKey(props, "p2")}
  }
`;

const TemplateContentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spaces[7]}px;
`;

const TemplateDatasources = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spaces[1]}px;
`;

const StyledButton = styled(Button)`
  border-radius: 18px;
  && {
    & > span {
      margin-right: ${(props) => props.theme.spaces[0]}px;
    }
  }
  height: 31px;
  width: 31px;

  svg {
    height: 15px;
    width: 15px;
  }
`;

export interface TemplateProps {
  template: TemplateInterface;
  size?: string;
}

const Template = (props: TemplateProps) => {
  if (props.size) {
    return <LargeTemplate {...props} />;
  } else {
    return <TemplateLayout {...props} />;
  }
};

export interface TemplateLayoutProps {
  template: TemplateInterface;
  className?: string;
}

export function TemplateLayout(props: TemplateLayoutProps) {
  const {
    datasources,
    description,
    functions,
    id,
    screenshotUrls,
    title,
  } = props.template;
  const [showForkModal, setShowForkModal] = useState(false);
  const onClick = () => {
    history.push(TEMPLATE_ID_URL(id));
  };

  const onForkButtonTrigger = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowForkModal(true);
  };

  const onForkModalClose = (e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    setShowForkModal(false);
  };

  return (
    <TemplateWrapper className={props.className} onClick={onClick}>
      <ImageWrapper className="image-wrapper">
        <StyledImage src={screenshotUrls[0]} />
      </ImageWrapper>
      <TemplateContent>
        <div className="title">{title}</div>
        <div className="categories">{functions.join(" • ")}</div>
        <div className="description">{description}</div>
        <TemplateContentFooter>
          <TemplateDatasources>
            {datasources.map((pluginPackageName) => {
              return (
                <DatasourceChip
                  key={pluginPackageName}
                  pluginPackageName={pluginPackageName}
                />
              );
            })}
          </TemplateDatasources>
          <div onClick={onForkButtonTrigger}>
            <ForkTemplateDialog
              onClose={onForkModalClose}
              showForkModal={showForkModal}
              templateId={id}
            >
              <Tooltip content={createMessage(FORK_THIS_TEMPLATE)}>
                <StyledButton
                  className="t--fork-template fork-button"
                  icon="compasses-line"
                  size={Size.medium}
                  tag="button"
                />
              </Tooltip>
            </ForkTemplateDialog>
          </div>
        </TemplateContentFooter>
      </TemplateContent>
    </TemplateWrapper>
  );
}

export default Template;
