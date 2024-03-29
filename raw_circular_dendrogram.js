const DIAMETER = 847;

function generateFillColor(d, total) {
    const proportion = d.data.sentenceCount / total;
    const baseValue = 95;   // the lightest strength we will accept
    const incrementCeiling = 50;    // set the limit on the darkest colour we will accept
    const lightness = baseValue - (proportion * incrementCeiling);

    if (isNaN(lightness)) throw new Error("broken");
    if (!isFinite(lightness)) throw new Error("broken");

    const val = `hsl(240, 100%, ${lightness}%)`;
    console.log("returning val: %o", val);


    return val;
}

function generatePercentage(d, total) {
    const percentage = Number((d.data.sentenceCount / total) * 100).toFixed(2);
    return `${percentage}%`;
}

function linkDiagonal(d) {
    return "M" + project(d.x, d.y) +
        "C" + project(d.x, (d.y + d.parent.y) / 2) +
        " " + project(d.parent.x, (d.y + d.parent.y) / 2) +
        " " + project(d.parent.x, d.parent.y);
}

function project(x, y) {
    var angle = (x - 90) / 180 * Math.PI,
        radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function drawChart(selection, data) {
    console.log("selected %o", selection);

    const total = data.sentenceCount;
    console.log("total is %o", total);

    var g = selection
        .attr("width", DIAMETER)
        .attr("height", DIAMETER)
        .append("g")
        .attr("transform", `translate(${DIAMETER/2}, ${DIAMETER/2})`);

    var cluster = d3.cluster()
        .size([360, DIAMETER / 2 - 120]);

    root = d3.hierarchy(data);

    cluster(root);

    var link = g.selectAll("path.link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("fill", "none")
        .style("stroke", "#cccccc")
        .style("stroke-width", "1px")
        .attr("d", linkDiagonal);

    var node = g.selectAll("g.node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => {
            return `rotate(${d.x - 90})translate(${d.y})`;
        });

    node.append("circle")
        .attr("r", 4.5)
        .style("fill", d => generateFillColor(d, total))
        .style("stroke", "#999999")
        .style("stroke-width", "1px");

    node.append("text")
        .attr("text-anchor", d => {
            return d.x < 180 ? "start" : "end";
        })
        .attr("transform", d => {
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        })
        .style("font-size", "11px")
        .style("font-family", "Arial, Helvetica")
        .attr("dy", "1.5em")
        .attr("dx", ".31em")
        .text(d => d.data.name);
        

    node.append("text")
        .attr("text-anchor", d => {
            return d.x < 180 ? "start" : "end";
        })
        .attr("transform", d => {
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        })
        .style("font-size", "11px")
        .style("font-family", "Arial, Helvetica")
        .attr("dy", ".31em")
        .text(d => generatePercentage(d, total));
}

datasets = {
    'confidence': TRIALS_WITH_CONFIDENCE,
    'all': ALL_TRIALS
};


function onReady() {
    console.log("on ready");

    const selection = d3.select('svg');
    console.log("selected %o", selection);

    document.querySelectorAll("button").forEach(b => {
        b.addEventListener('click', e => {
            datasetName = e.target.getAttribute('name');
            selection.selectAll('*').remove();
            drawChart(selection, datasets[datasetName]);
        });
    });

    drawChart(selection, ALL_TRIALS);
}

document.addEventListener('DOMContentLoaded', onReady);
