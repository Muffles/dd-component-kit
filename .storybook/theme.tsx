import { Global, css } from '@emotion/react';
import React from 'react';

export const GlobalStyles = () => (<Global styles={css`
    .docs-story {
      background-color: var(--ha-background);
      font-family: var(--ha-font-family);
      font-size: var(--ha-font-size);
      color: var(--ha-color);
    }
    mark {
      background-color: #dedede;
      color: #414141;
      border-radius: 4px;
      padding: 2px 6px;
    }
    #storybook-root {
      padding: 0 !important;
      &:not([hidden="true"]) {
        width: 100%;
        height: 100%;
        #storybook-inner-preview {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          flex-direction: column;
        }
      }
    }
  `}/>);