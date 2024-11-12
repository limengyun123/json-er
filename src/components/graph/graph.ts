import { Graph } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { DagreLayout } from "@antv/layout";
import { DataModel } from "./data";
import registerShape from "./utils";

export class GraphView {
  private graph: Graph;
  private layout: any;
  private dataModel: DataModel;
  private options: any;

  public constructor(
    container: HTMLElement,
    options?: { editValue: Function }
  ) {
    this.graph = this.initGraph(container);
    this.layout = this.initLayout();
    this.dataModel = new DataModel();
    this.options = options;
    this.registerEvents();
    registerShape();
  }

  private initGraph(container: HTMLElement) {
    const graph = new Graph({
      container: container,
      grid: true,
      autoResize: true,
      connecting: {
        targetAnchor: "left",
        connector: { name: "rounded", args: { radius: 50 } },
        router: { name: "er", args: { direction: "H", offset: 20 } },
      },
    });

    graph.use(new Scroller({ enabled: true }));
    // 设置画布初始偏移量
    graph.setScrollbarPosition(
      undefined,
      graph.getScrollbarPosition().top - 20
    );
    return graph;
  }

  private initLayout() {
    return new DagreLayout({
      type: "dagre",
      rankdir: "LR",
      ranksep: 80,
      nodesepFunc: (node) => {
        return node.height / 2 - 20;
      },
    });
  }

  private registerEvents() {
    this.graph.on("node:dblclick", (e) => {
      const { parents, originalData } = e.node.data;
      if (this.options && this.options.editValue) {
        this.options.editValue({
          parents,
          data: originalData,
        });
      }
    });
  }

  public update(data: object) {
    this.dataModel.updateOriginalData(data);
    this.render();
  }

  public async render() {
    const data = this.dataModel.getLayoutData();
    const layoutData = this.layout.layout(data);
    this.graph.fromJSON(layoutData);
  }

  public destroy() {
    this.dataModel.destroy();
    this.graph.dispose();
  }
}
