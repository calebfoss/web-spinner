import {
  ClassDeclaration,
  ClassField,
  FunctionDeclaration,
  FunctionLike,
  ClassMethod,
  Parameter,
} from "custom-elements-manifest/schema";
import untypedData from "./doc-data.json";
import { createRoot, Color } from "web-spinner";
import * as WebSpinner from "web-spinner";
import highlight from "highlight.js";
import imageSource from "./public/Embia_major_mf.jpg";
import {
  CustomElementDeclarationX,
  WebSpinnerDocData,
} from "./reorganizeDocData";

const data = untypedData as WebSpinnerDocData;

interface ClassFieldExtended extends ClassField {
  attribute?: string;
  readonly?: boolean;
}

function renderParameterRow(param: Parameter) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");

  nameCell.textContent = param.name;

  row.appendChild(nameCell);

  const typeCell = document.createElement("td");

  const { type } = param;

  if (type !== undefined) {
    typeCell.textContent = type.text;
  }

  row.appendChild(typeCell);

  const descriptionCell = document.createElement("td");

  if (param.optional) descriptionCell.textContent = "(optional) ";

  descriptionCell.textContent += param.description ?? "";

  row.appendChild(descriptionCell);

  return row;
}

function renderParametersTable(params: Parameter[]) {
  const table = document.createElement("table");

  const caption = document.createElement("caption");

  caption.textContent = "Parameters";

  table.appendChild(caption);

  const body = document.createElement("tbody");

  table.appendChild(body);

  const headerRow = renderTableHeaders("Name", "Type", "Description");

  body.appendChild(headerRow);

  const dataRows = params.map(renderParameterRow);

  for (const row of dataRows) {
    body.appendChild(row);
  }

  return table;
}

function renderTableHeaders(...headerText: string[]) {
  const row = document.createElement("tr");

  for (const text of headerText) {
    const header = document.createElement("th");

    header.textContent = text;

    row.appendChild(header);
  }

  return row;
}

function renderFunctionDoc(fn: FunctionLike, memberOfClass: boolean) {
  const div = document.createElement("div");

  if (!memberOfClass) {
    div.id = fn.name;
  }

  div.classList.add(memberOfClass ? "method" : "item");

  const heading = document.createElement(memberOfClass ? "h5" : "h3");

  heading.textContent = fn.name;

  div.appendChild(heading);

  if (fn.description !== undefined) {
    const descriptionPar = document.createElement("p");

    descriptionPar.textContent = fn.description;

    div.appendChild(descriptionPar);
  }

  const parameters = renderParametersTable(fn.parameters ?? []);

  div.appendChild(parameters);

  const returnHeading = document.createElement(memberOfClass ? "h6" : "h5");

  returnHeading.textContent = "Return value";

  div.appendChild(returnHeading);

  const returnTypePar = document.createElement("p");

  div.appendChild(returnTypePar);

  if (fn.return === undefined) {
    returnTypePar.textContent = "None";
  } else {
    returnTypePar.textContent = fn.return.type?.text ?? "";

    const returnDescriptionPar = document.createElement("p");

    returnDescriptionPar.textContent = fn.return.description ?? "";

    div.appendChild(returnDescriptionPar);
  }

  return div;
}

function renderClassMethodDoc(method: ClassMethod) {
  return renderFunctionDoc(method, true);
}

function renderStandaloneFunctionDoc(fn: FunctionDeclaration) {
  return renderFunctionDoc(fn, false);
}

function renderMethodsDocs(methods: ClassMethod[], isStatic: boolean) {
  const div = document.createElement("div");

  div.classList.add("methods");

  const heading = document.createElement("h4");

  heading.append(`${isStatic ? "Static" : "Instance"} Methods`);

  div.appendChild(heading);

  const publicMethods = methods.filter(
    (m) => m.privacy === undefined || m.privacy === "public"
  );

  const methodDocs = publicMethods.map(renderClassMethodDoc);

  for (const doc of methodDocs) {
    div.appendChild(doc);
  }

  return div;
}

const angleMatch = new RegExp(
  `([\\d\\.]+)\\s*(${Object.values(WebSpinner.Angle.unit).join("|")})`
);

function renderPropertyRows(
  member: ClassFieldExtended,
  demoElement?: HTMLElement
) {
  const statRow = document.createElement("tr");

  const jsNameCell = document.createElement("td");

  jsNameCell.textContent = member.name;

  statRow.appendChild(jsNameCell);

  if (demoElement !== undefined) {
    const htmlNameCell = document.createElement("td");

    htmlNameCell.textContent = member.attribute ?? "[none]";

    statRow.appendChild(htmlNameCell);
  }

  const typeCell = document.createElement("td");

  const { type } = member;

  if (type !== undefined) {
    typeCell.textContent = type.text;
  }

  statRow.appendChild(typeCell);

  if (demoElement !== undefined) {
    const demoCell = document.createElement("td");

    const attributeName = member.attribute;

    if (attributeName !== undefined) {
      const demoInput = document.createElement("input");

      const typeText = member.type?.text;

      switch (typeText) {
        case "Color":
        case "DrawStyle":
        case "DrawStyle | null":
          demoInput.type = "color";
          break;
        case "number":
        case "number | null":
          demoInput.type = "number";
          break;
        case "Vector2D":
        case "Vetor2D | null":
          {
            demoInput.type = "hidden";

            const vector = Reflect.get(
              demoElement,
              member.name
            ) as WebSpinner.Vector2D;

            demoElement.setAttribute(attributeName, vector.toString());

            const xLabel = document.createElement("label");

            xLabel.textContent = "x";

            demoCell.appendChild(xLabel);

            const xInput = document.createElement("input");

            xInput.type = "number";

            xInput.value = vector.x.toString();

            xLabel.appendChild(xInput);

            const yLabel = document.createElement("label");

            yLabel.textContent = "y";

            demoCell.appendChild(yLabel);

            const yInput = document.createElement("input");

            yInput.type = "number";

            yInput.value = vector.y.toString();

            yLabel.appendChild(yInput);

            xInput.addEventListener("input", () => {
              if (
                xInput.value.length === 0 ||
                yInput.value.length === 0 ||
                Number.isNaN(Number(xInput.value)) ||
                Number.isNaN(Number(yInput.value))
              )
                return;

              const newValue = `${xInput.value}, ${yInput.value}`;

              const currentValue = demoElement.getAttribute(attributeName);

              if (currentValue === newValue) return;

              demoInput.value = newValue;

              demoElement.setAttribute(attributeName, newValue);
            });

            yInput.addEventListener("input", () => {
              if (
                xInput.value.length === 0 ||
                yInput.value.length === 0 ||
                Number.isNaN(Number(xInput.value)) ||
                Number.isNaN(Number(yInput.value))
              )
                return;

              const newValue = `${xInput.value}, ${yInput.value}`;

              const currentValue = demoElement.getAttribute(attributeName);

              if (currentValue === newValue) return;

              demoInput.value = newValue;

              demoElement.setAttribute(attributeName, newValue);
            });
          }
          break;
      }

      demoInput.addEventListener("input", (evt) => {
        const currentValue = demoElement.getAttribute(attributeName);

        if (currentValue === demoInput.value) return;

        if (
          member.type?.text === "Angle" &&
          demoInput.value.match(angleMatch) === null
        )
          return;

        demoElement.setAttribute(attributeName, demoInput.value);
      });

      demoInput.value = Reflect.get(demoElement, member.name);

      demoCell.appendChild(demoInput);
    }

    statRow.appendChild(demoCell);
  }

  const descriptionRow = document.createElement("tr");

  const descriptionCell = document.createElement("td");

  descriptionCell.appendChild(descriptionRow);

  descriptionCell.colSpan = 4;

  if (member.readonly) {
    descriptionCell.textContent = "[read only] ";
  }

  descriptionCell.textContent += member.description ?? "";

  descriptionRow.appendChild(descriptionCell);

  return [statRow, descriptionRow];
}

function renderPropertyTable(
  fields: ClassField[],
  isStatic: boolean,
  demoElement?: HTMLElement
) {
  const table = document.createElement("table");

  const caption = document.createElement("caption");

  caption.append(`${isStatic ? "Static" : "Instance"} Properties`);

  table.appendChild(caption);

  const body = document.createElement("tbody");

  table.appendChild(body);

  const fieldHeaderRow =
    demoElement === undefined
      ? renderTableHeaders("Name", "Type")
      : renderTableHeaders("JS Name", "HTML Name", "Type", "Demo");

  body.appendChild(fieldHeaderRow);

  const publicFields = fields.filter(
    (field) => field.privacy === undefined || field.privacy === "public"
  ) as ClassFieldExtended[];

  const rows = publicFields
    .map((field) => renderPropertyRows(field, demoElement))
    .flat();

  for (const row of rows) {
    body.appendChild(row);
  }

  return table;
}

function renderDemo(
  element: CustomElementDeclarationX
): [HTMLDivElement, HTMLElement] {
  const div = document.createElement("div");

  div.classList.add("demo");

  const root = createRoot(div);

  const canvas = root.canvas2D({
    background: Color.gray(230),
    height: 200,
    width: 500,
  });

  const htmlPre = root.appendChild(document.createElement("pre"));

  const htmlCode = document.createElement("code");

  htmlCode.classList.add("language-html");

  htmlPre.appendChild(htmlCode);

  const htmlCopy = document.createElement("button");

  div.appendChild(htmlCopy);

  htmlCopy.textContent = "Copy HTML";

  htmlCopy.addEventListener("click", () => {
    navigator.clipboard.writeText(htmlCode.textContent ?? "");
  });

  if (element.tagName === "c2d-canvas") {
    const observer = new MutationObserver(() => {
      delete htmlCode.dataset.highlighted;

      htmlCode.textContent = canvas.outerHTML;

      highlight.highlightElement(htmlCode);
    });

    observer.observe(canvas, { attributes: true });

    canvas.background = Color.random;

    return [div, canvas];
  }

  const defaults = {
    anchor: canvas.center,
    fill: Color.random,
    stroke: Color.random,
    lineWidth: Math.ceil(Math.random() * 10),
    controlA: WebSpinner.Vector2D.xy(100, 0),
    controlB: WebSpinner.Vector2D.xy(0, 100),
  };

  const mainElement = document.createElement(element.tagName);

  // const jsCode = document.createElement("code");

  // jsCode.classList.add("language-js");

  // div.appendChild(jsCode);

  const observer = new MutationObserver(() => {
    delete htmlCode.dataset.highlighted;

    htmlCode.textContent = mainElement.outerHTML;

    highlight.highlightElement(htmlCode);
  });

  observer.observe(mainElement, { attributes: true });

  for (const [name, value] of Object.entries(defaults)) {
    if (name in mainElement) {
      Reflect.set(mainElement, name, value);
    }
  }

  if (element.tagName === "c2d-image") {
    const image = mainElement as WebSpinner.WebSpinnerElement["Canvas2DImage"];
    image.source = imageSource;
    image.width = canvas.width;
    image.origin = "center";
  } else if (element.tagName === "c2d-video") {
    const video = mainElement as WebSpinner.WebSpinnerElement["Canvas2DVideo"];
    video.source =
      "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4";
    video.width = canvas.width;
    video.anchor = WebSpinner.Vector2D.zero;
    canvas.listen.click(() => video.play());
  }

  if (element.tagName === "c2d-text") {
    mainElement.textContent = "Web Spinner";

    (mainElement as WebSpinner.WebSpinnerElement["Canvas2DText"]).lineWidth = 1;

    canvas.appendChild(mainElement);
  } else if (element.tagName.slice(0, 10) === "c2d-shape-") {
    const shape = document.createElement("c2d-shape");

    canvas.appendChild(shape);

    shape.appendChild(mainElement);
  } else {
    canvas.appendChild(mainElement);
  }

  canvas.queueRender();

  return [div, mainElement];
}

function renderClassDoc(
  classData: ClassDeclaration | CustomElementDeclarationX
) {
  const container = document.createElement("div");

  container.className = "item";

  const name =
    (classData as CustomElementDeclarationX).tagName ?? classData.name;

  container.id = name;

  const heading = document.createElement("h3");

  heading.textContent = name;

  container.appendChild(heading);

  const [staticFields, staticMethods, instanceFields, instanceMethods] = (
    classData.members ?? []
  ).reduce(
    (
      [
        partialStaticFields,
        partialStaticMethods,
        partialInstanceFields,
        partialInstanceMethods,
      ]: [ClassField[], ClassMethod[], ClassField[], ClassMethod[]],
      member
    ) => {
      if (member.kind === "field") {
        if (member.static)
          return [
            partialStaticFields.concat(member),
            partialStaticMethods,
            partialInstanceFields,
            partialInstanceMethods,
          ] as const;
        return [
          partialStaticFields,
          partialStaticMethods,
          partialInstanceFields.concat(member),
          partialInstanceMethods,
        ] as const;
      }
      if (member.kind === "method") {
        if (member.static)
          return [
            partialStaticFields,
            partialStaticMethods.concat(member),
            partialInstanceFields,
            partialInstanceMethods,
          ] as const;
        return [
          partialStaticFields,
          partialStaticMethods,
          partialInstanceFields,
          partialInstanceMethods.concat(member),
        ] as const;
      }
      throw new Error("Unsupported member");
    },
    [[], [], [], []]
  );

  const [demoDiv, demoElement] = (classData as CustomElementDeclarationX)
    .customElement
    ? renderDemo(classData as CustomElementDeclarationX)
    : [];

  if (demoDiv !== undefined) container.append(demoDiv);

  if (staticFields.length) {
    const staticFieldTable = renderPropertyTable(staticFields, true);

    container.append(staticFieldTable);
  }

  if (staticMethods.length) {
    const staticMethodTable = renderMethodsDocs(staticMethods, true);

    container.append(staticMethodTable);
  }

  if (instanceFields.length) {
    const instanceFieldTable = renderPropertyTable(
      instanceFields,
      false,
      demoElement
    );

    container.appendChild(instanceFieldTable);
  }

  if (instanceMethods.length) {
    const instanceMethodTable = renderMethodsDocs(instanceMethods, false);

    container.appendChild(instanceMethodTable);
  }

  return container;
}

function renderNavItem(
  dataObject: ClassDeclaration | FunctionDeclaration | CustomElementDeclarationX
) {
  const item = document.createElement("li");

  const anchor = document.createElement("a");

  const asCustomElement = dataObject as CustomElementDeclarationX;

  const name = asCustomElement.customElement
    ? asCustomElement.tagName
    : dataObject.name;

  anchor.href = "#" + name;

  anchor.textContent = name;

  item.append(anchor);

  if (asCustomElement.customElement && asCustomElement.children.length) {
    const childList = document.createElement("ul");

    item.append(childList);

    const childItems = asCustomElement.children.map(renderNavItem);

    childList.append(...childItems);
  }

  return item;
}

function renderNav() {
  const nav = document.createElement("nav");

  const topAnchor = document.createElement("a");

  topAnchor.href = "/";

  const topHeading = document.createElement("h1");

  topHeading.textContent = "Web Spinner";

  topAnchor.appendChild(topHeading);

  const topList = document.createElement("ul");

  nav.append(topAnchor, topList);

  for (const [category, dataObjects] of Object.entries(data)) {
    const categoryItem = document.createElement("li");

    topList.append(categoryItem);

    const categoryAnchor = document.createElement("a");

    categoryAnchor.href = `#${category}`;

    // categoryAnchor.ariaHasPopup = "true";

    categoryAnchor.append(category);

    const categoryList = document.createElement("ul");

    categoryItem.append(categoryAnchor, categoryList);

    const dataItems = dataObjects.map(renderNavItem);

    categoryList.append(...dataItems);
  }

  return nav;
}

function renderCanvasElementDoc(canvasElementData: CustomElementDeclarationX) {
  const elementDiv = document.createElement("div");

  elementDiv.classList.add("canvas-elements");

  const canvasDoc = renderClassDoc(canvasElementData);

  const elementDocs = canvasElementData.children.map(renderClassDoc);

  elementDiv.append(canvasDoc, ...elementDocs);

  return elementDiv;
}

function renderBaseElementDoc(element: CustomElementDeclarationX) {
  switch (element.tagName) {
    case "c2d-canvas":
      return renderCanvasElementDoc(element);
    default:
      throw new Error(
        `No render process for defined for element with tagName ${element.tagName}`
      );
  }
}

function renderDocumentation() {
  const main = document.createElement("main");

  const nav = renderNav();

  const docContainer = document.createElement("div");

  docContainer.className = "doc";

  main.append(nav, docContainer);

  const classDocs = data.classes.map(renderClassDoc);

  const elementDocs = data.elements.map(renderBaseElementDoc);

  const functionDocs = data.functions.map(renderStandaloneFunctionDoc);

  docContainer.append(...classDocs, ...elementDocs, ...functionDocs);

  return main;
}

const reference = renderDocumentation();

document.body.appendChild(reference);

highlight.highlightAll();
