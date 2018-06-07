var calendar = (function() {

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const SYMPTOM_COLORS = ['#f2f2f2', '#37c871', '#ffe680', '#de8787'];

  const CALENDAR_DIMENSIONS = {
    x: 0,
    y: 0,
    width: 100,
    height: 114.5
  };

  const CALENDAR_HEADER_DIMENSIONS = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    offset: {
      month: -1,
      year: 6
    }
  };

  const CALENDAR_HOLE_DIMENSIONS = {
    cx: 12,
    cy: 10,
    r: 4
  };

  const CALENDAR_CELL_DIMENSIONS = {
    width: 10,
    height: 10,
    spacing: 4.5,
    innerPadding: 3,
    outerPadding: 6
  };

  const CALENDAR_FLAGS = {
    showYear: true,
    showDate: true,
    showHoles: true,
    showStroke: true,
    showSymptoms: true
  };

  var genCalendarData = (year, month) => {
    var date = new Date(year, month);
    var symptoms = [];

    while (date.getMonth() === month) {
      symptoms.push({
        date: date.getDate(),
        day: date.getDay(),
        symptom: Math.floor(Math.random() * SYMPTOM_COLORS.length)
      });
      date.setDate(date.getDate() + 1);
    }

    return symptoms;
  };

  var renderCalendarCells = () => {
    var cellGroup = svg.append('g')
      .attr('transform', `translate(${CALENDAR_DIMENSIONS.x + CALENDAR_CELL_DIMENSIONS.outerPadding},${CALENDAR_HEADER_DIMENSIONS.height + CALENDAR_CELL_DIMENSIONS.outerPadding})`);

    var week = 0;
    for (var i = 0 ; i < dataset.length ; i++) {
      if (dataset[i].date !== 1 && dataset[i].day === 0) {
        week += 1;
      }

      var cell = cellGroup.append('g')
        .data([dataset[i]])
        .attr('transform', `translate(${dataset[i].day * (CALENDAR_CELL_DIMENSIONS.width + CALENDAR_CELL_DIMENSIONS.innerPadding)}, ${week * (CALENDAR_CELL_DIMENSIONS.height + CALENDAR_CELL_DIMENSIONS.spacing)})`);

      var cellBox = cell.append('rect')
        .attr('class', CALENDAR_FLAGS.showStroke ? 'calendar-cell calendar-stroke' : 'calendar-cell')
        .attr('width', CALENDAR_CELL_DIMENSIONS.width)
        .attr('height', CALENDAR_CELL_DIMENSIONS.height);

      if (CALENDAR_FLAGS.showSymptoms) {
        cellBox.style('fill', d => SYMPTOM_COLORS[d.symptom]);
      }

      if (CALENDAR_FLAGS.showDate) {
        cell.append('text')
          .attr('class', 'calendar-date')
          .attr('x', CALENDAR_CELL_DIMENSIONS.width / 2)
          .attr('y', CALENDAR_CELL_DIMENSIONS.height / 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text(d => d.date);
      }
    }

    return cellGroup;
  };

  var updateCalendarMonth = () => {
    dataset = genCalendarData(date.getFullYear(), date.getMonth());
    calendarCells.remove();
    calendarCells = renderCalendarCells();
    monthText.data([MONTH_NAMES[date.getMonth()]]).text(d => d);
    if (CALENDAR_FLAGS.showYear) {
      yearText.data([date.getFullYear()]).text(d => d);
    }
  };

  var shiftMonth = n => {
    date.setMonth(date.getMonth() + n);
    updateCalendarMonth();
  };

  var date = new Date();
  var dataset = genCalendarData(date.getFullYear(), date.getMonth());

  var svg = d3.select('.calendar-wrapper')
    .append('svg')
    .attr('class', 'calendar')
    .attr('viewBox', `${CALENDAR_DIMENSIONS.x} ${CALENDAR_DIMENSIONS.y} ${CALENDAR_DIMENSIONS.width} ${CALENDAR_DIMENSIONS.height}`)
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  var header = svg.append('g');

  header.append('rect')
    .attr('class', 'calendar-header')
    .attr('width', CALENDAR_HEADER_DIMENSIONS.width)
    .attr('height', CALENDAR_HEADER_DIMENSIONS.height)
    .attr('x', CALENDAR_HEADER_DIMENSIONS.x)
    .attr('y', CALENDAR_HEADER_DIMENSIONS.y);

  if (CALENDAR_FLAGS.showHoles) {
    var classes = CALENDAR_FLAGS.showStroke ? 'calendar-hole calendar-stroke' : 'calendar-hole';
    header.append('circle')
      .attr('class', classes)
      .attr('cx', CALENDAR_HOLE_DIMENSIONS.cx)
      .attr('cy', CALENDAR_HOLE_DIMENSIONS.cy)
      .attr('r', CALENDAR_HOLE_DIMENSIONS.r);

    header.append('circle')
      .attr('class', classes)
      .attr('cx', CALENDAR_DIMENSIONS.width - CALENDAR_HOLE_DIMENSIONS.cx)
      .attr('cy', CALENDAR_HOLE_DIMENSIONS.cy)
      .attr('r', CALENDAR_HOLE_DIMENSIONS.r);
  }

  var monthOffset = 0;
  var yearText = null;
  if (CALENDAR_FLAGS.showYear) {
    monthOffset = CALENDAR_HEADER_DIMENSIONS.offset.month;
    yearText = header.append('text')
      .data([date.getFullYear()])
      .attr('class', 'calendar-year')
      .attr('x', CALENDAR_HEADER_DIMENSIONS.width / 2)
      .attr('y', CALENDAR_HEADER_DIMENSIONS.height / 2 + CALENDAR_HEADER_DIMENSIONS.offset.year)
      .attr('text-anchor', 'middle')
      .text(d => d);
  }

  var monthText = header.append('text')
    .data([MONTH_NAMES[date.getMonth()]])
    .attr('class', 'calendar-text')
    .attr('x', CALENDAR_HEADER_DIMENSIONS.width / 2)
    .attr('y', CALENDAR_HEADER_DIMENSIONS.height / 2 + monthOffset)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .text(d => d);

  var calendar = svg.append('rect')
    .attr('class', 'calendar-bg')
    .attr('width', CALENDAR_DIMENSIONS.width)
    .attr('height', CALENDAR_DIMENSIONS.height - CALENDAR_HEADER_DIMENSIONS.height)
    .attr('x', CALENDAR_DIMENSIONS.x)
    .attr('y', CALENDAR_HEADER_DIMENSIONS.height);

  var calendarCells = renderCalendarCells();

  return {
    shiftMonth: shiftMonth
  };
})();
