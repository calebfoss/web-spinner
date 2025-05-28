import { CustomHTMLElement } from "./mixable";
import { SVGSVGController } from "./svgSVG";

export function createSVGController<T extends keyof SVGElementTagNameMap>(
  svgTag: T,
  controllerTag: string
) {
  return class SVGElementController extends CustomHTMLElement {
    static observedAttributes: string[] = [];
    static tag = controllerTag;

    #main: SVGElementTagNameMap[T];
    #group: SVGGElement | null = null;

    constructor(...args: any[]) {
      super();

      this.#main = document.createElementNS(
        "http://www.w3.org/2000/svg",
        svgTag
      );
    }

    addEventListener(
      type: keyof SVGElementEventMap,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void {
      return this.mainElement.addEventListener(type, listener, options);
    }

    removeEventListener(
      type: keyof HTMLElementEventMap,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void {
      return this.mainElement.removeEventListener(type, listener, options);
    }

    appendChild<T extends Node>(node: T): T {
      if (node instanceof SVGElement) {
        const group = this.#group ?? this.#createGroup();

        return group.appendChild(node);
      }

      if (node instanceof SVGElementController) {
        const child = node.group ?? node.mainElement;

        const group = this.#group ?? this.#createGroup();

        group.appendChild(child);
      }
      return super.appendChild(node);
    }

    attributeChangedCallback() {}

    #attachMain() {
      const { parentElement } = this;

      if (parentElement === null) return;

      const parentController = parentElement as SVGElementController;

      const target = parentController.group ?? parentController.mainElement;

      const { group } = this;

      if (group === null) target.appendChild(this.mainElement);
      else target.appendChild(group);
    }

    connectedCallback() {
      this.#attachMain();
    }

    #createGroup() {
      if (this.#group !== null) return this.#group;

      this.#group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const { parentElement } = this.mainElement;

      if (parentElement !== null) parentElement.appendChild(this.#group);

      this.#group.appendChild(this.mainElement);

      for (const [propertyName, attributeName] of Object.entries(
        this._styleAttributes
      )) {
        const value = Reflect.get(this, propertyName);

        if (value === null) continue;

        this.#group.setAttribute(attributeName, String(value));

        this.mainElement.removeAttribute(attributeName);
      }

      return this.#group;
    }

    get group(): SVGGElement | null {
      return this.#group;
    }

    get mainElement() {
      return this.#main;
    }

    /**
     * @private
     */
    _setStyleAttribute(attributeName: string, value: string) {
      const { group } = this;

      if (group === null) {
        this.mainElement.setAttribute(attributeName, value);
        return;
      }

      group.setAttribute(attributeName, value);
    }

    get _styleAttributes(): {
      [Key in keyof this]?: string;
    } {
      return {};
    }

    get svgContainer(): SVGSVGElement | null {
      const { group, parentElement } = this;

      if (group !== null) {
        const groupParent = group.parentElement;

        if (groupParent === null) return null;

        if (groupParent instanceof SVGSVGElement) return groupParent;
      }

      if (parentElement === null) return null;

      const { group: parentGroup, mainElement: parentMain } =
        parentElement as SVGElementController;

      if (parentGroup instanceof SVGSVGElement) return parentGroup;

      if (parentMain instanceof SVGSVGElement) return parentMain;

      return (parentElement as SVGElementController).svgContainer;
    }

    get svgContainerController(): SVGSVGController | null {
      if (this instanceof SVGSVGController) return this;

      const { parentElement } = this;

      if (parentElement === null) return parentElement;

      const parentController = (parentElement as SVGElementController)
        .svgContainerController;

      if (parentController !== undefined) return parentController;

      return null;
    }
  };
}

export type SVGElementController = ReturnType<typeof createSVGController>;
