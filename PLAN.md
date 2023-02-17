## Components

### Selection Area

Area that selects the part of the image

Contains information about the locations of selection area

``` js
selectionArea = {
  x,
  y,
  width,
  height,
  controlPoint
}
```

#### Behaviours

1. resize : changes the dimensions of the selection. Takes the horizontal and vertical deltas.

### Control Point

Control point that can change the dimensions of the selection area.

``` js
controlPoint = {
  x,
  y,
  dx,
  dy
};
```

#### Behaviours

1. move : moves the point to new point and stores the deltas.

### Renderer

1. draws the selector
2. updates the position of the selector