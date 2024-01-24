/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import dom from "../lib/dom";
import template from "../lib/template";

const createDialogElement = (settings) => {
  const html = template.render(settings.dialogTemplate, {
    systemStyles: "border-radius: 5px 0px 0px 5px;", // For backward compatibility
    backgroundColor: settings.backgroundColor,
    width: settings.width,
    height: settings.height,
    scroll: "scroll", // For backward compatibility
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
