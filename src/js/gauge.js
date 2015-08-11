;(function (window, document) {

	var settings = {
		width: 600,
		height: 500,
		maxRangeAngle: 285,
		rangeRadius: 180,
		indicatorSpindleRadius: 10,
		indicatorArrowLength: 8,
		indicatorArrowWidth: 200,
		scaleMin: 2,
		scaleMax: 8,
		scalePosition: 'outside',
		scaleMajorTickInterval: 1,
		scaleMajorTickOffset: -10,
		scaleMajorTickLength: -6,
		scaleMinorTickLength: -2,
		scaleMinorTickInterval: 0.1,
		scaleTextTickOffsetTop: -7,
		scaleTextTickOffsetLeft: -1,
		scaleDefaultColor: '#666',
		scaleText: {},
		scaleColors: [],
	};


	function Gauge(options) {
		this.options = settings;
		if (options) {
			for (var optionName in options) {
				this.options[optionName] = options[optionName];
			}
		}
		this._init();
	}


	Gauge.prototype._init = function() {
		this.element = document.getElementById('container');
		this.empty();
		this.render();
	}


	// Get point position
	Gauge.prototype.getPointOnCircle = function(cx, cy, radius, angle) {
        return {
			x: cx + radius * Math.sin(Math.PI * (angle) / 180),
            y: cy + radius * Math.cos(Math.PI * (angle) / 180)
        };
    }



    Gauge.prototype.render = function() {
    	var center = { x: this.options.width.toFixed(6) / 2, y: this.options.height.toFixed(6) / 2 };
		var startAngle =  this.options.maxRangeAngle / 2 - 180 - this.options.maxRangeAngle;
		var endAngle = startAngle + this.options.maxRangeAngle;

		// Create SVG
		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.setAttributeNS(null, 'width', this.options.width);
		this.svg.setAttributeNS(null, 'height', this.options.height);
		this.svg.setAttributeNS(null, 'class', 'gauge');

		var intervalK = this.options.maxRangeAngle / (this.options.scaleMax - this.options.scaleMin).toFixed(6);
		var majorTickIntervalAngle = this.options.scaleMajorTickInterval * intervalK;
		var minorTickIntervalAngle = this.options.scaleMinorTickInterval * intervalK;

		
		var scaleMajorTickOffset = this.options.scaleMajorTickOffset;
		var scaleMajorTickLength = this.options.scaleMajorTickLength
		var offset = 40;
    	if (this.options.scalePosition != 'outside') {
    		var scaleMajorTickOffset = -this.options.scaleMajorTickOffset;
			var scaleMajorTickLength = -this.options.scaleMajorTickLength
			var offset = -40;
    	}

    	var counter = 0;
    	var counterMinor = 0;
    	var minotAngle =  startAngle;
    	for (var value  = this.options.scaleMin; value.toFixed(6) <= this.options.scaleMax.toFixed(6); value += this.options.scaleMinorTickInterval) {
    		value = +value.toFixed(6);
    		var angle =  startAngle + counter * majorTickIntervalAngle;

    		if ((value.toFixed(6) - this.options.scaleMin).toFixed(6) % this.options.scaleMajorTickInterval.toFixed(6) == 0) {
    			var angleRad = -angle * Math.PI / 180;
    			text = Math.round(value * 100) / 100;
    			var key = parseInt(value.toFixed(6));
				if (this.options.scaleText[key]) {
					text = this.options.scaleText[key];
				}
				this.drawLine(
					center.x, center.y - this.options.rangeRadius + scaleMajorTickOffset, 
					center.x, center.y - this.options.rangeRadius + scaleMajorTickOffset + scaleMajorTickLength,
					'rotate(' + (angle - 180) + ',' + center.x + ',' + center.y + ')',
					this.svg
				).setAttribute('class', 'major-thick');
    			this.drawText(
					center.x + (this.options.rangeRadius + offset) * Math.sin(angleRad) - this.options.scaleTextTickOffsetLeft,
					center.y + (this.options.rangeRadius + offset) * Math.cos(angleRad) - this.options.scaleTextTickOffsetTop, 
					text, 
					this.svg
				).setAttribute('class', 'text');
    			var scaleSection = this.options.scaleColors.filter(function(section){ 
					return (value.toFixed(6) >= section['from'] && value.toFixed(6) < section['till']); 
				});
				var color = this.options.scaleDefaultColor;
				if (scaleSection.length > 0) {
					var color = scaleSection[0]['color'];	
				}
				if (value != this.options.scaleMax) {
					this.drawPartOfCircle(center.x, center.y, this.options.rangeRadius,  -angle,  -angle - majorTickIntervalAngle, color, this.svg);	
				}	
				counter++; 
    		} else {
    			var position = this.getPointOnCircle(center.x, center.y, this.options.rangeRadius - scaleMajorTickOffset, -minotAngle);
    			this.drawLine(
					position.x, position.y, 
					position.x, position.y + this.options.scaleMinorTickLength,
					'',
					this.svg
				).setAttribute('class', 'minor-thick');
    		}
    		minotAngle += minorTickIntervalAngle;
    	}
		this.drawIndicator(center.x, center.y, this.svg);
	
		this.element.appendChild(this.svg);
    }


    // Render indicator group
    Gauge.prototype.drawIndicator = function(cx, cy, domElement) {
        var indicatorGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		indicatorGroup.setAttribute('class', 'indicator-group');
		indicatorGroup.setAttributeNS(
			null,
			'transform', 
			'translate(0, 0) rotate(' + (-this.options.maxRangeAngle / 2).toFixed(6) + ',' + cx + ',' + cy + ')'
		);
		this.drawCircle(cx, cy, this.options.indicatorSpindleRadius, indicatorGroup).setAttribute('class', 'spindle');
		this.drawArrow(cx, cy, indicatorGroup);
		domElement.appendChild(indicatorGroup);
    }


	Gauge.prototype.drawPartOfCircle = function(cx, cy, radius, startAngle, endAngle, color, domElement){
        var startPointOnCircle = this.getPointOnCircle(cx, cy, radius, startAngle);
        var endPointOnCircle = this.getPointOnCircle(cx, cy, radius, endAngle);
        this.drawArc(startPointOnCircle, endPointOnCircle, radius, color, domElement).setAttributeNS(null, "classname", "stroke-section");
    }


    Gauge.prototype.drawArc = function(startPointOnCircle, endPointOnCircle, radius, color, domElement){
        var newpath;
        newpath = document.createElementNS('http://www.w3.org/2000/svg',"path");
        newpath.setAttributeNS(null, "d", "M" + startPointOnCircle.x + "," + startPointOnCircle.y + " A" + radius + "," + radius + " 1 0,1 " + endPointOnCircle.x + "," + endPointOnCircle.y);
        newpath.setAttributeNS(null, "stroke-width", 3);
        newpath.setAttributeNS(null, "opacity", 1);
        newpath.setAttributeNS(null, "fill", "none");
        newpath.setAttributeNS(null, "stroke", color);
        domElement.appendChild(newpath);
        return newpath;
	}


	Gauge.prototype.drawCircle =  function(cx, cy, r, domElement) {
		var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		newpath.setAttributeNS(null, "cx", cx);
		newpath.setAttributeNS(null, "cy", cy);
		newpath.setAttributeNS(null, "r", r);
        domElement.appendChild(newpath);
        return newpath;
    }


    Gauge.prototype.drawArrow = function(cx, cy, domElement) {
		var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		var d = 'M' + (cx - this.options.indicatorArrowLength / 2).toFixed(6) + ' ' + cy + ' ';
		d += 'L' + cx + ' ' + (cy -  this.options.indicatorArrowWidth).toFixed(6) + ' ';
		d += 'L' + (cx + this.options.indicatorArrowLength / 2).toFixed(6) + ' ' + cy + ' ';
		d += 'z';
		newpath.setAttributeNS(null, 'd', d);
		newpath.setAttribute('class', 'arrow');
		domElement.appendChild(newpath);
    }


    Gauge.prototype.drawLine = function(x1, y1, x2, y2, transform, domElement) {
    	var newpath = document.createElementNS("http://www.w3.org/2000/svg", "line");
		newpath.setAttributeNS(null, 'x1', x1);
		newpath.setAttributeNS(null, 'y1', y1);
		newpath.setAttributeNS(null, 'x2', x2);
		newpath.setAttributeNS(null, 'y2', y2);
		newpath.setAttributeNS(null, 'transform', transform);
		domElement.appendChild(newpath);
		return newpath;
	}


	Gauge.prototype.drawText = function(cx, cy, text, domElement) {
        var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        newpath.setAttributeNS(null, "x", cx);
        newpath.setAttributeNS(null, "y", cy);
        domElement.appendChild(newpath).textContent = text;
        return newpath;
	}

	// 
	Gauge.prototype.setValue = function(value) {
		var center = { x: this.options.width.toFixed(6) / 2, y: this.options.height.toFixed(6) / 2 }
		if (value > this.options.scaleMax) value = this.options.scaleMax;
		if (value < this.options.scaleMin) value = this.options.scaleMin;
		var scaleDelta = this.options.scaleMax - this.options.scaleMin;
		var angleDelta = this.options.maxRangeAngle * (value - this.options.scaleMin) / scaleDelta;

		var indicatorGroup = this.svg.getElementsByClassName('indicator-group')[0];
		indicatorGroup.setAttributeNS(
			null,
			'transform', 
			'translate(0, 0) rotate(' + (-this.options.maxRangeAngle / 2 + angleDelta) + ',' + center.x + ',' + center.y + ')'
		);
	}

	// Clear SVG
	Gauge.prototype.empty = function() {
		if (this.element.childNodes.length > 0) {
			this.element.removeChild(this.svg);
		}
		this.svg = null;
		return this;
	}


	window.Gauge = Gauge;

}) (window, document);