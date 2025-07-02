import { writeFileSync } from "fs";
import {
  ClassDeclaration,
  Declaration,
  CustomElement,
  Package,
  FunctionDeclaration,
} from "custom-elements-manifest/schema";
import schema from "./custom-elements.json";

const { modules } = schema as Package;

export interface CustomElementDeclarationX extends CustomElement {
  children: CustomElementDeclarationX[];
  tagName: string;
}

export type WebSpinnerDocData = {
  classes: ClassDeclaration[];
  elements: CustomElementDeclarationX[];
  functions: FunctionDeclaration[];
};

function extendData<C extends keyof WebSpinnerDocData>(
  partialData: WebSpinnerDocData,
  category: C,
  declaration: C extends "functions"
    ? FunctionDeclaration
    : C extends "classes"
    ? ClassDeclaration
    : CustomElementDeclarationX
) {
  return {
    ...partialData,
    [category]: partialData[category].concat(declaration),
  };
}

type ElementHierarchy = {
  parentTag: string;
  prefix: string;
  children: ElementHierarchy[];
};

const elementHierarchies: ElementHierarchy[] = [
  {
    parentTag: "c2d-canvas",
    prefix: "c2d",
    children: [{ parentTag: "c2d-shape", prefix: "shape", children: [] }],
  },
];

function getChildren(
  customElement: CustomElement,
  hierarchy: ElementHierarchy
): CustomElementDeclarationX {
  const children = modules.reduce(
    (childrenBeforeModule: CustomElementDeclarationX[], module) =>
      (module.declarations ?? []).reduce(
        (
          childrenBeforeDeclaration: CustomElementDeclarationX[],
          declaration
        ) => {
          if (!isCustomElement(declaration)) return childrenBeforeDeclaration;

          if (declaration === customElement) return childrenBeforeDeclaration;

          const asCustomElement = declaration as unknown as CustomElement;

          if (asCustomElement.tagName === undefined)
            return childrenBeforeDeclaration;

          const childHierarchy = hierarchy.children.find(
            (h) => h.parentTag === asCustomElement.tagName
          );

          if (childHierarchy !== undefined)
            return childrenBeforeDeclaration.concat(
              getChildren(asCustomElement, childHierarchy)
            );

          const tagParts = asCustomElement.tagName.split("-");

          const prefix = tagParts[tagParts.length - 2];

          if (prefix === hierarchy.prefix)
            return childrenBeforeDeclaration.concat({
              ...asCustomElement,
              children: [],
              tagName: asCustomElement.tagName,
            });

          return childrenBeforeDeclaration;
        },
        childrenBeforeModule
      ),
    []
  );

  return { ...customElement, children, tagName: customElement.tagName ?? "" };
}

const isCustomElement = (declaration: Declaration) =>
  (declaration as unknown as CustomElement).customElement;

function organizeData() {
  const indexModule = modules[0];

  if (indexModule.path !== "src/index.ts")
    throw new Error(
      `index module path ${indexModule.path} is not what was expected: src/index.ts`
    );

  const publicExports = indexModule.exports ?? [];

  const isPublic = (declaration: Declaration) =>
    publicExports.some((exp) => exp.name === declaration.name);

  return modules.reduce(
    (dataBeforeModule: WebSpinnerDocData, module) =>
      (module.declarations ?? []).reduce(
        (dataBeforeDeclaration: WebSpinnerDocData, declaration) => {
          if (declaration.kind === "function") {
            if (isPublic(declaration))
              return extendData(
                dataBeforeDeclaration,
                "functions",
                declaration
              );
            else return dataBeforeDeclaration;
          }

          if (declaration.kind === "class") {
            if (isCustomElement(declaration)) {
              const hierarchy = elementHierarchies.find(
                (h) => h.parentTag === (declaration as any).tagName
              );

              if (hierarchy === undefined) return dataBeforeDeclaration;

              return extendData(
                dataBeforeDeclaration,
                "elements",
                getChildren(declaration as unknown as CustomElement, hierarchy)
              );
            }
            if (isPublic(declaration))
              return extendData(dataBeforeDeclaration, "classes", declaration);
          }

          return dataBeforeDeclaration;
        },
        dataBeforeModule
      ),
    {
      classes: [],
      elements: [],
      functions: [],
    }
  );
}

writeFileSync("./docs/doc-data.json", JSON.stringify(organizeData()), {
  encoding: "utf-8",
});
