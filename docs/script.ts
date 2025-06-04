import * as Schema from "custom-elements-manifest/schema";
import data from "./custom-elements.json";
import { createRoot, Color } from "web-spinner";
import * as WebSpinner from "web-spinner";
import highlight from "highlight.js";

interface ClassFieldExtended extends Schema.ClassField {
  attribute?: string;
  readonly?: boolean;
}

function getCustomElementDefinitions(module: Schema.Module) {
  const { exports } = module;

  if (exports === undefined) return [];

  return exports.filter((exp) => exp.kind === "custom-element-definition");
}

function getClassDeclarations(module: Schema.Module) {
  const { declarations } = module;

  if (declarations === undefined) return [];

  return declarations.filter((declaration) => declaration.kind === "class");
}

type ElementData = {
  tag: string;
  constructorName: string;
  fields: Schema.ClassField[];
  methods: Schema.ClassMethod[];
};

type DocData = {
  elements: ElementData[];
  classes: Schema.ClassDeclaration[];
};

function getDocData() {
  const { modules } = data as Schema.Schema;

  const customElementDefinitions = modules
    .map(getCustomElementDefinitions)
    .flat();

  const allClasses = modules.map(getClassDeclarations).flat();

  const elements = customElementDefinitions
    .map<ElementData>((definition) => {
      const declaration = allClasses.find(
        (declaration) => declaration.name === definition.declaration.name
      );

      if (declaration === undefined)
        throw new Error(
          `Could not locate declaration for ${definition.name}: ${definition.declaration.name}`
        );

      const { members } = declaration;

      const [methods, fields] =
        members === undefined
          ? [[], []]
          : members.reduce<[Schema.ClassMethod[], Schema.ClassField[]]>(
              ([partialMethods, partialFields], member) => {
                if (member.kind === "field")
                  return [partialMethods, partialFields.concat(member)];
                if (member.kind === "method")
                  return [partialMethods.concat(member), partialFields];
                throw new Error(
                  `Unsupported member kind: ${(member as any).kind}`
                );
              },
              [[], []]
            );

      return {
        tag: definition.name,
        constructorName: declaration.name,
        methods,
        fields,
      };
    })
    .toSorted((a, b) => a.tag.localeCompare(b.tag));

  const classes = allClasses.filter(
    (c) => !elements.some((el) => el.constructorName === c.name)
  );

  return { elements, classes };
}

function renderParameterRow(param: Schema.Parameter) {
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

function renderParametersTable(params: Schema.Parameter[]) {
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

function renderMethodDoc(method: Schema.ClassMethod) {
  const div = document.createElement("div");

  div.classList.add("method");

  const heading = document.createElement("h5");

  heading.textContent = method.name;

  div.appendChild(heading);

  if (method.description !== undefined) {
    const descriptionPar = document.createElement("p");

    descriptionPar.textContent = method.description;

    div.appendChild(descriptionPar);
  }

  const parameters = renderParametersTable(method.parameters ?? []);

  div.appendChild(parameters);

  const returnHeading = document.createElement("h6");

  returnHeading.textContent = "Return value";

  div.appendChild(returnHeading);

  const returnTypePar = document.createElement("p");

  div.appendChild(returnTypePar);

  if (method.return === undefined) {
    returnTypePar.textContent = "None";
  } else {
    returnTypePar.textContent = method.return.type?.text ?? "";

    const returnDescriptionPar = document.createElement("p");

    returnDescriptionPar.textContent = method.return.description ?? "";

    div.appendChild(returnDescriptionPar);
  }

  return div;
}

function renderMethodsDocs(methods: Schema.ClassMethod[]) {
  const div = document.createElement("div");

  div.classList.add("methods");

  const heading = document.createElement("h4");

  heading.textContent = "Methods";

  div.appendChild(heading);

  const publicMethods = methods.filter(
    (m) => m.privacy === undefined || m.privacy === "public"
  );

  const methodDocs = publicMethods.map(renderMethodDoc);

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
  demoElement: HTMLElement
) {
  const statRow = document.createElement("tr");

  const jsNameCell = document.createElement("td");

  jsNameCell.textContent = member.name;

  statRow.appendChild(jsNameCell);

  const htmlNameCell = document.createElement("td");

  htmlNameCell.textContent = member.attribute ?? "[none]";

  statRow.appendChild(htmlNameCell);

  const typeCell = document.createElement("td");

  const { type } = member;

  if (type !== undefined) {
    typeCell.textContent = type.text;
  }

  statRow.appendChild(typeCell);

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
  fields: Schema.ClassField[],
  demoElement: HTMLElement
) {
  const table = document.createElement("table");

  const caption = document.createElement("caption");

  caption.textContent = "Properties";

  table.appendChild(caption);

  const body = document.createElement("tbody");

  table.appendChild(body);

  const fieldHeaderRow = renderTableHeaders(
    "JS Name",
    "HTML Name",
    "Type",
    "Demo"
  );

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

function renderDemo(element: ElementData): [HTMLDivElement, HTMLElement] {
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

  if (element.tag === "c2d-canvas") {
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

  const mainElement = document.createElement(element.tag);

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

  if (element.tag === "c2d-image") {
    const image = mainElement as WebSpinner.WebSpinnerElement["Canvas2DImage"];
    image.source = "./Embia_major_mf.jpg";
    image.width = canvas.width;
    image.origin = "center";
  } else if (element.tag === "c2d-video") {
    const video = mainElement as WebSpinner.WebSpinnerElement["Canvas2DVideo"];
    video.source =
      "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4";
    video.width = canvas.width;
    video.anchor = WebSpinner.Vector2D.zero;
    canvas.listen.click(() => video.play());
  }

  if (element.tag === "c2d-text") {
    mainElement.textContent = "Web Spinner";

    (mainElement as WebSpinner.WebSpinnerElement["Canvas2DText"]).lineWidth = 1;

    canvas.appendChild(mainElement);
  } else if (element.tag.slice(0, 10) === "c2d-shape-") {
    const shape = document.createElement("c2d-shape");

    canvas.appendChild(shape);

    shape.appendChild(mainElement);
  } else {
    canvas.appendChild(mainElement);
  }

  canvas.queueRender();

  return [div, mainElement];
}

function renderElementDoc(element: ElementData) {
  const div = document.createElement("div");

  div.classList.add("element");

  div.id = element.tag;

  const heading = document.createElement("h3");

  heading.textContent = element.tag;

  div.appendChild(heading);

  const [demoDiv, demoElement] = renderDemo(element);

  div.appendChild(demoDiv);

  const fieldTable = renderPropertyTable(element.fields, demoElement);

  div.appendChild(fieldTable);

  const methodTable = renderMethodsDocs(element.methods);

  div.appendChild(methodTable);

  return div;
}

function renderNav(elements: ElementData[]) {
  const nav = document.createElement("nav");

  const topAnchor = document.createElement("a");

  topAnchor.href = "/";

  const topHeading = document.createElement("h1");

  topHeading.textContent = "Web Spinner";

  topAnchor.appendChild(topHeading);

  nav.appendChild(topAnchor);

  for (const element of elements) {
    const anchor = document.createElement("a");

    anchor.href = "#" + element.tag;

    anchor.textContent = element.tag;

    nav.appendChild(anchor);
  }

  return nav;
}

function renderDocumentation() {
  const { elements } = getDocData();

  const docDiv = document.createElement("div");

  docDiv.classList.add("doc");

  const heading = document.createElement("h2");

  heading.textContent = "Documentation";

  docDiv.appendChild(heading);

  const nav = renderNav(elements);

  docDiv.appendChild(nav);

  const elementDiv = document.createElement("div");

  elementDiv.classList.add("elements");

  docDiv.appendChild(elementDiv);

  const elementDocs = elements.map(renderElementDoc);

  for (const doc of elementDocs) {
    elementDiv.appendChild(doc);
  }

  return docDiv;
}

const reference = renderDocumentation();

document.body.appendChild(reference);

highlight.highlightAll();
