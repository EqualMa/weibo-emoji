/// <reference types="@emotion/react/types/css-prop" />

// https://github.com/emotion-js/emotion/discussions/2291#discussioncomment-491185
import "@emotion/react";
import { Theme as MaterialUITheme } from "@mui/material";
declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MaterialUITheme {}
}
