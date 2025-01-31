import { rendersVisualMedia } from "../../mixins/visualMedia";
import { Canvas2DStandaloneRenderable, changedEvent } from "./renderable";

export class Canvas2DVideo extends rendersVisualMedia(
  Canvas2DStandaloneRenderable,
  "video"
) {
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
