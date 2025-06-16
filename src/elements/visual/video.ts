import { C2DStandaloneTransformed } from "../../mixins/transform";
import { rendersVisualMedia } from "../../mixins/visualMedia";
import {
  createHTMLElementWrapperConstructor,
  HTMLElementController,
} from "../document/domBase";
import { changedEvent } from "./renderable";

export class Canvas2DVideo extends rendersVisualMedia(
  C2DStandaloneTransformed,
  "video"
) {
  static get tag() {
    return "c2d-video";
  }

  #frameCallbackId = -1;

  connectedCallback(): void {
    super.connectedCallback();
  }

  #handleFrame() {
    this.#frameCallbackId = this.mediaElement.requestVideoFrameCallback(() => {
      this.dispatchEvent(changedEvent);

      if (!this.mediaElement.paused) this.#handleFrame();
    });
  }

  play() {
    const promise = this.mediaElement.play();

    this.#handleFrame();

    return promise;
  }

  pause() {
    this.mediaElement.cancelVideoFrameCallback(this.#frameCallbackId);

    return this.mediaElement.pause();
  }

  get paused() {
    return this.mediaElement.paused;
  }

  togglePlay() {
    if (this.paused) this.play();
    else this.pause();
  }
}

customElements.define("c2d-video", Canvas2DVideo);

export class HTMLVideoWrapper extends createHTMLElementWrapperConstructor(
  "video"
) {}

export type HTMLVideoController = HTMLElementController<
  "video",
  HTMLVideoWrapper
>;
