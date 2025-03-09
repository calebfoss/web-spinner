import * as Schema from "custom-elements-manifest/schema";
import data from "./custom-elements.json";
import { createCanvas, Color } from "web-spinner";

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

const methodHeaders = ["Name", "Parameters", "Returns", "Description"] as const;

function renderMethodTableCell(
  header: (typeof methodHeaders)[number],
  method: Schema.ClassMethod
) {
  const cell = document.createElement("td");

  switch (header) {
    case "Description":
      cell.textContent = method.description ?? "";
      break;
    case "Name":
      cell.textContent = method.name;
      break;
    case "Parameters": {
      const params = method.parameters;

      if (params === undefined) break;

      const paramsTable = renderParametersTable(params);

      cell.appendChild(paramsTable);

      break;
    }

    case "Returns": {
      const returnData = method.return;

      if (returnData === undefined) break;

      const { type, description } = returnData;

      if (type !== undefined) {
        cell.textContent = type.text;

        if (description !== undefined) cell.textContent += ": ";
      }

      cell.textContent += description ?? "";

      break;
    }
  }

  return cell;
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

function renderPropertyRows(member: ClassFieldExtended) {
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

  const descriptionRow = document.createElement("tr");

  const descriptionCell = document.createElement("td");

  descriptionCell.appendChild(descriptionRow);

  descriptionCell.colSpan = 3;

  if (member.readonly) {
    descriptionCell.textContent = "[read only] ";
  }

  descriptionCell.textContent += member.description ?? "";

  descriptionRow.appendChild(descriptionCell);

  return [statRow, descriptionRow];
}

function renderPropertyTable(fields: Schema.ClassField[]) {
  const table = document.createElement("table");

  const caption = document.createElement("caption");

  caption.textContent = "Properties";

  table.appendChild(caption);

  const body = document.createElement("tbody");

  table.appendChild(body);

  const fieldHeaderRow = renderTableHeaders("JS Name", "HTML Name", "Type");

  body.appendChild(fieldHeaderRow);

  const publicFields = fields.filter(
    (field) => field.privacy === undefined || field.privacy === "public"
  ) as ClassFieldExtended[];

  const rows = publicFields.map(renderPropertyRows).flat();

  for (const row of rows) {
    body.appendChild(row);
  }

  return table;
}

function renderDemo(element: ElementData) {
  const div = document.createElement("div");

  div.classList.add("demo");

  const heading = document.createElement("h4");

  heading.textContent = "Demo";

  div.appendChild(heading);

  const canvas = createCanvas({ background: Color.gray(210) });

  div.appendChild(canvas);

  if (element.tag === "c2d-canvas") return div;

  const mainElement = document.createElement(element.tag);

  if (element.tag.slice(0, 10) === "c2d-shape-") {
    const shape = document.createElement("c2d-shape");

    canvas.appendChild(shape);

    shape.appendChild(mainElement);

    return div;
  }

  canvas.appendChild(mainElement);

  return div;
}

function renderElementDoc(element: ElementData) {
  const div = document.createElement("div");

  div.classList.add("element");

  const heading = document.createElement("h3");

  heading.textContent = element.tag;

  div.appendChild(heading);

  const demo = renderDemo(element);

  div.appendChild(demo);

  const fieldTable = renderPropertyTable(element.fields);

  div.appendChild(fieldTable);

  const methodTable = renderMethodsDocs(element.methods);

  div.appendChild(methodTable);

  return div;
}

function renderDocumentation() {
  const { elements } = getDocData();

  const div = document.createElement("div");

  div.classList.add("doc");

  const heading = document.createElement("h2");

  heading.textContent = "Documentation";

  div.appendChild(heading);

  const elementDocs = elements.map(renderElementDoc);

  for (const doc of elementDocs) {
    div.appendChild(doc);
  }

  return div;
}

const reference = renderDocumentation();

document.body.appendChild(reference);
