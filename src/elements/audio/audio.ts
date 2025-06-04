import {
  createHTMLElementWrapperConstructor,
  HTMLElementController,
} from "../document/domBase";

export class HTMLAudioWrapper extends createHTMLElementWrapperConstructor(
  "audio"
) {}

export type HTMLAudioController = HTMLElementController<
  "audio",
  HTMLAudioWrapper
>;
