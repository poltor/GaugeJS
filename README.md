Gauge
=====

Gauge widget using SVG and JS.
Demo - https://jsfiddle.net/poltor/7k1a2e96/

```javascript
var gauge = new Gauge([options]);
gauge.setValue(5.6);
```

Options
-------

| Option Code                | Description                           | Default                                      |
| ---------------------------|:-------------------------------------:|---------------------------------------------:|
| **width**                  | Width of SVG element (px)             | 500                                          |
| **height**                 | Height of SVG element  (px)           | 500                                          |
| **maxRangeAngle**          | Maximum Range of active area (deg)    | 270                                          |
| **rangeRadius**            | Scale radius (px)                     | 180                                          |
| **indicatorSpindleRadius** | Indicator spindle radius (px)         | 10                                           |
| **indicatorArrowLength**   | indicator Arrow width (px)            | 8                                            |
| **indicatorArrowWidth**    | Indicator Arrow height (px)           | 200                                          |
| **scaleMin**               | Minimal visibility value              | 0                                            |
| **scaleMax**               | Maximum visibility value              | 10                                           |
| **scalePosition**          | Scale numbers inside/outside circle   | 'outside'                                    |
| **scaleMajorTickInterval** | Step of rullers with numbers          | 1                                            |
| **scaleMinorTickInterval** | Step of rullers without numbers       | 0.1                                          |
| **scaleText**              | Scale text                            | {}                                           |
| **scaleColors**            | Scale sections                        | []                                           |

### Option **scaleColors**

```javascript
options.scaleColors = [{from: 5, till: 7, color: '#FC0'}, ... ]
```

### Option **scaleText**

```javascript
options.scaleText = { 2: 'Min', 8: 'Max', ... }
```

Methods
-------

* **render()** - render HTML
* **empty()** - clear SVG-element from DOM & remove this.svg
* **setValue(value)** - set arrow position by value
* **getPointOnCircle(cx, cy, radius, angle)**
* **drawIndicator(cx, cy, domElement)**
* **drawPartOfCircle(cx, cy, radius, startAngle, endAngle, color, domElement)**
* **drawArc(startPointOnCircle, endPointOnCircle, radius, color, domElement)**
* **drawCircle(cx, cy, r, domElement)**
* **drawLine(x1, y1, x2, y2, transform, domElement)**
* **drawText(cx, cy, text, domElement)**
