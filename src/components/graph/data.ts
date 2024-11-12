import { isArray, isObject } from "lodash";

export const HEAD_HEIGHT = 12;
export const NODE_HEIGHT = 24;
export const NODE_WIDTH = 150;

export class DataModel {
  private originalData: Object = {};

  public updateOriginalData(json: Object) {
    this.originalData = json;
  }

  public getLayoutData() {
    if (!Object.keys(this.originalData).length) return { nodes: [], edges: [] };

    let globalId = 1000;
    const loopArray: {
      id: number;
      parents: (string | number)[];
      data: object;
    }[] = [{ id: globalId++, parents: [], data: this.originalData }];
    const nodes: any[] = [],
      edges: any[] = [];
    while (loopArray.length) {
      const cur = loopArray.shift()!;
      const idString = cur.id.toString(),
        parents = cur.parents,
        data = cur.data as any;

      const node = {
        id: idString,
        shape: "rect-node",
        data: { parents, originalData: data },
        ports: [] as any[],
      } as any;
      Object.keys(data).forEach((key, index) => {
        const d = data[key];
        const portId = `${idString}-${index}`;
        node.ports.push({
          id: portId,
          group: "list",
          attrs: {
            portKey: { text: key },
            portValue: { text: isArray(d) || isObject(d) ? "" : d.toString() },
          },
        });
        if (isArray(d) || isObject(d)) {
          const childId = globalId++;
          loopArray.push({
            id: childId,
            parents: parents.concat([key]),
            data: d,
          });
          edges.push({
            id: `${idString}&${childId}`,
            shape: "normal-edge",
            source: { cell: idString, port: portId },
            target: { cell: childId.toString() },
          });
        }
      });
      Object.assign(node, {
        width: NODE_WIDTH,
        height: node.ports.length * NODE_HEIGHT + HEAD_HEIGHT,
      });
      nodes.push(node);
    }

    return { nodes, edges };
  }

  public destroy() {
    this.originalData = {};
  }
}
