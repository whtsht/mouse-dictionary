/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import dom from "../lib/dom";
import template from "../lib/template";

const STYLES_SCROLL = "border-radius: 5px 0px 0px 5px;";
const STYLES_NORMAL = "border-radius: 5px 5px 5px 5px;";

const createDialogElement = (settings) => {
  const systemStyles = settings.scroll === "scroll" ? STYLES_SCROLL : STYLES_NORMAL;

  const html = template.render(settings.dialogTemplate, {
    systemStyles,
    backgroundColor: settings.backgroundColor,
    width: settings.width,
    height: settings.height,
    scroll: settings.scroll,
  });
  const dialog = dom.create(html);
  dom.applyStyles(dialog, settings.normalDialogStyles);

  return dialog;
};

const create = (settings) => {
  const dialog = createDialogElement(settings);
  const content = dom.create(settings.contentWrapperTemplate);
  dialog.appendChild(content);
  document.addEventListener("mousemove", (ev) => {
    const x = ev.clientX;
    const y = ev.clientY;

    dialog.style.left = `${x + 10}px`;
    dialog.style.top = `${y + 10}px`;
  });
  return { dialog, content };
};

export default { create };
