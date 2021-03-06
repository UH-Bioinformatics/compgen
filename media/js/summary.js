$.fn.dataTable.ext.search.push( function( settings, data, dataIndex ) {
    if($(document).data('mysite.show').length == 0)
	return true;
    return $(document).data('mysite.show')[parseInt(data[0])];
});


function populate(summaryurl, cloudurl ) {
    $(document).data('mysite.show' , []);
    $(document).data('mysite.table',
		     $('#example').dataTable({
			 "ajax": summaryurl,
			 "deferRender": true,
			 "iDisplayLength": 50,
		     }));
    
    $(document).data('d3chart.fill', d3.scale.category20());
    
    $.get(cloudurl,
	  "",
	  function(data){
	      $(document).data('d3chart.gos', data.goid);
	      d3.layout.cloud().size([500, 620]).words( data.cloud.map(function(d){return {text: d[0], size: 10 + ((d[1]/data.total) * 50)};})).padding(5)
		  .rotate(function() { return ~~(Math.random() * 2) * 90; })
		  .font("Impact")
		  .fontSize(function(d) { return d.size; })
		  .on("end", draw)
		  .start();
	      $("#cloud").html(data);
	  },"json");
}

function draw(words) {
    d3.select("#vis").append("svg")
	.attr("width", 500)
	.attr("height", 620)
	.append("g")
	.attr("transform", "translate(250,310)")
	.selectAll("text")
	.data(words)
	.enter().append("text")
	.style("font-size", function(d) { return d.size + "px"; })
	.style("font-family", "Impact")
	.style("fill", function(d, i) { return $(document).data('d3chart.fill')(i); })
	.attr("text-anchor", "middle")
	.on("click", function(d,i) {filterGo($(document).data('d3chart.gos')[d.text], d.text);})
	.attr("transform", function(d) {
	    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	})
	.text(function(d) { return d.text; });
}


function filterGoReset(){
    $(document).data('mysite.show' , []);
    $(document).data('mysite.table').fnDraw();
    $("#filteredOn").html("None");
}


function filterGo(url, txt){
    $.get(url,
	  "",
	  function( data ) {
	      $(document).data('mysite.show', data);
	      $(document).data('mysite.table').fnDraw();
	      $("#filteredOn").html(txt);
	  },
	  "json");
}


