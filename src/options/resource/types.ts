/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

export type TextResource = {
  dictDataEncoding: string;
  dictDataFormat: string;
  readDictData: string;
  selectDictFile: string;
  progressRegister: string;
  finishRegister: string;
  clearAllDictData: string;
  finishedClear: string;
  dictDataUsage: string;
  confirmLoadInitialDict: string;
  confirmReloadInitialDict: string;
  fileMayNotBeShiftJis: string;
  formatEijiroText: string;
  formatTsv: string;
  formatPdicOneLine: string;
  formatJson: string;
  positionLeft: string;
  positionRight: string;
  positionKeep: string;
  saveSettings: string;
  defaultSettings: string;
  finishSaving: string;
  openBasicSettings: string;
  closeBasicSettings: string;
  openAdvancedSettings: string;
  closeAdvancedSettings: string;
  basicSettings: string;
  previewText: string;
  abbreviateShortWordDesc: string;
  abbreviateShortWordDesc0: string;
  abbreviateShortWordDesc1: string;
  abbreviateShortWordDesc2: string;
  initialSize: string;
  width: string;
  height: string;
  initialPosition: string;
  dictionaryData: string;
  colorAndFont: string;
  headFont: string;
  descFont: string;
  background: string;
  replaceRules: string;
  replaceRule1: string;
  replaceRule2: string;
  advancedSettings: string;
  htmlTemplate: string;
  htmlTemplateWindow: string;
  htmlTemplateDesc: string;
  htmlTemplateDescText: string;
  styles: string;
  stylesActive: string;
  stylesMoving: string;
  stylesInactive: string;
  lookupWithCapitalized: string;
  parseWordsLimit: string;
  add: string;
  loadSelectedFile: string;
  clearLoadedData: string;
  loadInitialDict: string;
  downloadDictData: string;
  setKeyboardShortcuts: string;
  windowManipulation: string;
  openPdfViewer: string;
  openJsonEditor: string;
  closeJsonEditor: string;
  importJson: string;
  JsonImportError: string;
  aboutJsonEditor: string;
  skipPdfConfirmation: string;
  pdfUrlPattern: string;
};

export type TextResourceKeys = keyof TextResource;
