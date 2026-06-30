import { css, type SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';

export const resetButton = css`
  background: unset;
  border: unset;
  padding: unset;
  line-height: unset;
  outline-offset: 1px;
`;

export const UnstyledButton = styled.button<{ stylingOverrides?: SerializedStyles }>(
  ({ stylingOverrides }) => css`
    ${resetButton}
    ${stylingOverrides ? stylingOverrides : ''}
  `
);
