import { Group } from "zrender";
import Displayable from "zrender/lib/graphic/Displayable";
import { Chart } from "./Chart";
import { LayoutPosition } from "./Layout";

export abstract class Element {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  shape: Group | Displayable = new Group();
  chart: Chart | undefined;
  position: LayoutPosition | undefined;
  onAdd(chart: Chart, position: LayoutPosition): void {
    this.chart = chart;
    this.position = position;
  }
  onRemove(): void {
    this.chart = undefined;
  }
  abstract update(): void;
}
