export class Polyline {
  public type: string = 'LineString';

  constructor(public coordinates: Array<Array<number>>) {
  }
}

export class Polygon {
  public type: string = 'Polygon';

  constructor(public coordinates: Array<Array<Array<number>>>) {
  }
}