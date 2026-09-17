export const HEADER_HEIGHT_CUSTOM_PROPERTY = "--header-height";
export const SITE_HEADER_ATTRIBUTE = "data-site-header";

export const applyHeaderHeight = (
  root: Pick<CSSStyleDeclaration, "setProperty">,
  height: number,
): void => {
  root.setProperty(HEADER_HEIGHT_CUSTOM_PROPERTY, `${Math.round(height)}px`);
};
