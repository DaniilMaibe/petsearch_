anychart.onDocumentLoad(function() {
  // create chart and set data
  var chart = anychart.column([
    ["Winter", 2],
    ["Spring", 7],
    ["Summer", 6],
    ["Fall", 10]
  ]);
  // set chart title
  chart.title("AnyChart Basic Sample");
  // set chart container and draw
  chart.container("container").draw();
});

function degsToRadians(degs) {
  return (degs / 360) * (2 * Math.PI)
}

class PieChart extends React.Component {
  
  static propTypes = {
    colors: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
    size: React.PropTypes.number,
    lineWidth: React.PropTypes.number
  };
  
  static defaultProps = {
    colors: ['#042a2b', '#5eb1bf', '#ef7b45', '#d84727'],
    size: 250,
    lineWidth: 25
  };
  
  componentDidMount() {
    this.draw();
  }
  
  draw() {
    const canvas = ReactDOM.findDOMNode(this);
    const c = canvas.getContext('2d');
    const center = this.props.size / 2;
    const lineWidth = this.props.lineWidth;
    const radius = center - (lineWidth / 2);
    c.lineWidth = lineWidth;
    
    const dataTotal = this.props.data.reduce((r, dataPoint) => r + dataPoint, 0);
    let startAngle = degsToRadians(-90);
    let colorIndex = 0;
    this.props.data.forEach((dataPoint, i) => {
      const section = dataPoint / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);
      const color = this.props.colors[colorIndex];
      colorIndex++;
      if (colorIndex >= this.props.colors.length) {
        colorIndex = 0;
      }
      console.log(i, 'foo', this.props.colors.length, 'bar', colorIndex);
      c.strokeStyle = color;
      c.beginPath();
      c.arc(center, center, radius, startAngle, endAngle);
      c.stroke();
      startAngle = endAngle;
    });
  }

  render() {
    return (
      <canvas
        height={this.props.size}
        width={this.props.size}
      />
    );
  }
}

ReactDOM.render(
  <PieChart
    data={[14, 24, 9, 30, 19, 12, 11, 16]}
  />,
  document.getElementById('app')
);

var duration   = 500,
    transition = 200;

drawDonutChart(
  '#donut',
  $('#donut').data('donut'),
  290,
  290,
  ".35em"
);

function drawDonutChart(element, percent, width, height, text_y) {
  width = typeof width !== 'undefined' ? width : 290;
  height = typeof height !== 'undefined' ? height : 290;
  text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

  var dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
      },
      radius = Math.min(width, height) / 2,
      pie = d3.layout.pie().sort(null),
      format = d3.format(".0%");

  var arc = d3.svg.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius);

  var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) { return "color" + i })
        .attr("d", arc)
        .each(function(d) { this._current = d; }); // store the initial values

  var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", text_y);

  if (typeof(percent) === "string") {
    text.text(percent);
  }
  else {
    var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper)); // update the data
      path.transition().duration(duration).attrTween("d", function (a) {
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function(t) {
          text.text( format(i2(t) / 100) );
          return arc(i(t));
        };
      }); // redraw the arcs
    }, 200);
  }
};

function calcPercent(percent) {
  return [percent, 100-percent];
};