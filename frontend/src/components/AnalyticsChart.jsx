import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const AnalyticsChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.historical_sales) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = Number(window.innerWidth > 768 ? 400 : 300) - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Prepare data - mock projecting the next few weeks
        const salesData = data.historical_sales.map((val, i) => ({ week: i + 1, sales: val }));

        // Simple linear scale
        const x = d3.scaleLinear()
            .domain([1, salesData.length])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(salesData, d => d.sales) * 1.5]) // scale up a bit to show projection
            .range([height, 0]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(salesData.length).tickFormat(d => `Wk ${d}`))
            .attr("color", "var(--text-muted)");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .attr("color", "var(--text-muted)");

        // Add Line
        const line = d3.line()
            .x(d => x(d.week))
            .y(d => y(d.sales))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(salesData)
            .attr("fill", "none")
            .attr("stroke", "var(--accent-cyan)")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Add Points
        svg.selectAll("dot")
            .data(salesData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.week))
            .attr("cy", d => y(d.sales))
            .attr("r", 5)
            .attr("fill", "var(--accent-blue)");

        // Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "14px")
            .text(`Sales Trend: ${data.name}`);

    }, [data]);

    return (
        <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default AnalyticsChart;
