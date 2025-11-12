import { jest } from "@jest/globals";
import { waitFor } from "@testing-library/dom";
import { ElementTestSetup } from "./types";

export function testRemoval(setup: ElementTestSetup<{}>) {
  test("Queues canvas render when removed", async () => {
    const { canvas, element, teardown } = setup();

    const queueRemoval = jest.spyOn(canvas, "queueRemoval");

    const queueRender = jest.spyOn(canvas, "queueRender");

    expect(queueRemoval).not.toHaveBeenCalled();

    expect(queueRender).not.toHaveBeenCalled();

    expect(canvas.contains(element)).toBe(true);

    element.remove();

    expect(queueRemoval).toHaveBeenCalled();

    expect(queueRender).toHaveBeenCalled();

    await waitFor(() => !canvas.contains(element));

    teardown();
  });
}
