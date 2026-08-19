// קוד גרפי D3: טוען נתוני Aggregation ומצייר גרף עמודות וגרף עוגה.

/** מביאה מערך נתונים מכתובת API ומחזירה את ה-JSON לציור הגרף. */
async function loadChartData(url) {
    const response = await fetch(url);
    return response.json();
}

/** מציירת ב-D3 גרף עמודות של מספר התכנים בכל קטגוריה. */
async function drawCategoryChart() {
    const data = await loadChartData('/api/contents/stats/by-category');
    const width = 700;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 70, left: 50 };

    const svg = d3.select('#category-chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3.scaleBand()
        .domain(data.map(item => item._id))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, item => item.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-30)')
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5));

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', item => x(item._id))
        .attr('y', item => y(item.count))
        .attr('width', x.bandwidth())
        .attr('height', item => y(0) - y(item.count))
        .attr('fill', '#e50914');
}

/** מציירת ב-D3 גרף עוגה שמשווה בין מספר הסרטים למספר הסדרות. */
async function drawTypeChart() {
    const data = await loadChartData('/api/contents/stats/by-type');
    const width = 420;
    const height = 320;
    const radius = 120;
    const colors = d3.scaleOrdinal(['#e50914', '#777777']);
    const pie = d3.pie().value(item => item.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const svg = d3.select('#type-chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const slices = svg.selectAll('g')
        .data(pie(data))
        .enter()
        .append('g');

    slices.append('path')
        .attr('d', arc)
        .attr('fill', item => colors(item.data._id));

    slices.append('text')
        .attr('transform', item => `translate(${arc.centroid(item)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .text(item => `${item.data._id}: ${item.data.count}`);
}

// שתי הפונקציות מופעלות עם טעינת הדף ומציירות את הגרפים בתוך ה-div המתאים.
drawCategoryChart();
drawTypeChart();
