$( document ).ready(function() {
    // With JQuery
    var yearMonthChange = function() {
        var year =  yearChosen.getValue();
        var month = monthChosen.getValue();
        var dataset = dataSetChosen(String(year), String(month), "average");
        map2.updateChoropleth(dataset);
    };
    var yearChosen = $('#ex1').slider({
        formatter: function(value) {
            return 'Year chosen: ' + value;
        }
    }).on('slide', yearMonthChange).data('slider');
    var monthChosen = $('#ex2').slider({
        formatter: function(value) {
            return 'Month chosen: ' + value;
        }
    }).on('slide', yearMonthChange).data('slider');
    var yearMonthChange2 = function() {
        var year =  yearChosen2.getValue();
        var month = monthChosen2.getValue();
        dataset = dataSetChosen(String(year), String(month), "median");
        map3.updateChoropleth(dataset);
    };
    var yearChosen2 = $('#ex3').slider({
        formatter: function(value) {
            return 'Year chosen: ' + value;
        }
    }).on('slide', yearMonthChange2).data('slider');
    var monthChosen2 = $('#ex4').slider({
        formatter: function(value) {
            return 'Month chosen: ' + value;
        }
    }).on('slide', yearMonthChange2).data('slider');

    var dataSetChosen = function (year, month, type) {
        var wagesPerYearPerMonth = wages[year][month];
        var dataset = {};
        var minValue = 9999;
        var maxValue = -1;
        Object.keys(wagesPerYearPerMonth).forEach(function(key) {
            if (key != "undefined") {
                var val = wagesPerYearPerMonth[key];    
                var temp = parseFloat(val[String(type)]) ;
                if (temp < minValue) {
                    minValue = temp;
                }
                if (temp > maxValue) {
                    maxValue = temp;
                }
            }
        });

        // create color palette function
        // color can be whatever you wish
        var paletteScale = d3.scale.linear()
                .domain([minValue,maxValue])
                .range(["#ff0000","#0000FF"]); // blue color

        // fill dataset in appropriate format
        Object.keys(wagesPerYearPerMonth).forEach(function(key) {
            var val = wagesPerYearPerMonth[key];
            var temp = val[type];
            dataset[key] = { wage: Number(temp).toFixed(2), fillColor: paletteScale(temp) };
        });

        return dataset;
    }

    var map1 = new Datamap({
            element: document.getElementById('container1'),
            scope: 'usa',
            fills: {
                Democratic: 'blue',
                Republican: 'red',
                defaultFill: 'green'
            },
            data: election
        });

    // Plot the US map based on wages
    // We need to colorize every state based on average wages
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    console.log(wages)
    var dataset =  dataSetChosen("2001", "1", "average");
    var map2 = new Datamap({
        element: document.getElementById('container2'),
        scope: 'usa',
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
                geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data) { return ; }
            // tooltip content
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Count: <strong>', data.wage, '</strong>',
                '</div>'].join('');
            }
        }  
    });

    dataset =   dataSetChosen("2001", "1", "median");
    var map3 = new Datamap({
        element: document.getElementById('container3'),
        scope: 'usa',
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
                geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data) { return ; }
            // tooltip content
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Count: <strong>', data.wage, '</strong>',
                '</div>'].join('');
        }
    }
    });

});



