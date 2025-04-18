import { camelToKebabCase } from "../../utlities/camelToKebab";

export function createSVGController<T extends keyof SVGElementTagNameMap>(
  svgTag: T,
  controllerTag: string
) {
  return class SVGElementController extends HTMLElement {
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

    appendChild<T extends Node>(node: T): T {
      if (node instanceof SVGElementController === false)
        return super.appendChild(node);

      const group = this.#group ?? this.#createGroup();

      return group.appendChild(node);
    }

    #attachMain() {
      const { svgContainer } = this;

      if (svgContainer === null) return;

      const { group } = this;

      if (group === null) svgContainer.appendChild(this.mainElement);
      else svgContainer.appendChild(group);
    }

    connectedCallback() {
      this.#attachMain();
    }

    #createGroup() {
      this.#group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const { parentElement } = this.mainElement;

      if (parentElement !== null) parentElement.appendChild(this.#group);

      this.#group.appendChild(this.mainElement);

      return this.#group;
    }

    get group(): SVGGElement | null {
      if (this.#group !== null) return this.#group;

      const { parentElement } = this;

      if (parentElement === null) return parentElement;

      const { group } = parentElement as typeof parentElement & {
        group: unknown;
      };

      if (group instanceof SVGGElement) return group;

      return null;
    }

    get mainElement() {
      return this.#main;
    }

    /**
     * @private
     */
    registerChange<P extends keyof this, V extends this[P]>(
      propertyName: P,
      newValue: V
    ) {
      const attributeName = camelToKebabCase(propertyName as string);

      const currentAttributeValue = this.getAttribute(attributeName);

      const stringValue = String(newValue);

      if (currentAttributeValue === stringValue) return;

      this.setAttribute(attributeName, stringValue);
    }

    get svgContainer() {
      const { group, parentElement } = this;

      if (group !== null) {
        const groupParent = group.parentElement;

        if (groupParent === null) return null;

        if (groupParent instanceof SVGSVGElement) return groupParent;
      }

      if (parentElement === null) return null;

      const { group: parentGroup, mainElement: parentMain } =
        parentElement as typeof parentElement & {
          group: unknown;
          mainElement: unknown;
        };

      if (parentGroup instanceof SVGSVGElement) return parentGroup;

      if (parentMain instanceof SVGSVGElement) return parentMain;

      return null;
    }
  };
}

export type SVGElementController = ReturnType<typeof createSVGController>;
