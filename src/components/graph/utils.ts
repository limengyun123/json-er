import { Graph } from "@antv/x6";
import { HEAD_HEIGHT, NODE_HEIGHT, NODE_WIDTH } from "./data";

export default function registerShape() {
  registerPortLayout();
  registerNode();
  registerEdge();
}

function registerPortLayout() {
  Graph.registerPortLayout(
    "erPortPosition",
    (portsPositionArgs) => {
      const portLength = portsPositionArgs.length;
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: 0,
            y: (index - portLength / 2) * NODE_HEIGHT + HEAD_HEIGHT / 2,
          },
          angle: 0,
        };
      });
    },
    true
  );
}

function registerNode() {
  Graph.registerNode(
    "rect-node",
    {
      inherit: "rect",
      markup: [{ tagName: "rect", selector: "head" }],
      attrs: {
        head: {
          width: NODE_WIDTH,
          height: HEAD_HEIGHT,
          strokeWidth: 1,
          stroke: "#ddd",
          fill: "#ddd",
          refY: "-50%",
        },
      },
      ports: {
        groups: {
          list: {
            markup: [
              { tagName: "rect", selector: "portBody" },
              { tagName: "text", selector: "portKey" },
              { tagName: "text", selector: "portValue" },
            ],
            attrs: {
              portBody: {
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                strokeWidth: 1,
                stroke: "#ddd",
                fill: "#fff",
              },
              portKey: {
                ref: "portBody",
                refX: 6,
                refY: 6,
                fontSize: 12,
                ellipsis: true,
                breakWord: true,
                textWrap: {
                  width: 54,
                  ellipsis: true,
                  breakWord: true,
                },
              },
              portValue: {
                ref: "portBody",
                refX: 60,
                refY: 6,
                fontSize: 12,
                textWrap: {
                  width: NODE_WIDTH - 60,
                  ellipsis: true,
                  breakWord: true,
                },
              },
            },
            position: "erPortPosition",
          },
        },
      },
    },
    true
  );
}

function registerEdge() {
  Graph.registerEdge(
    "normal-edge",
    {
      inherit: "edge",
      attrs: {
        line: { stroke: "#bbb", strokeWidth: 1, targetMarker: null },
      },
    },
    true
  );
}
