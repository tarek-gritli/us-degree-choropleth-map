import * as d3 from "d3";
import * as topojson from "topojson-client";


const w=1100;
const h=650;
const eduUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const colors=[
  {color: "#aedff7",label: "2% - 19%"},
  { color: "#76c7e3", label: "20% - 35%" },
  { color: "#3a8bc2", label: "36% - 50%" },
  { color: "#1C5F89", label: "51% - 66%" },
  { color: "#004466", label: "> 66%" }
]


d3.select("main")
  .append("h1")
  .attr("id","title")
  .text("United States Educational Attainment")
d3.select("main")
  .append("div")
  .attr("id","description")
  .text("Percentage of people over 25 with a bachelor's degree or higher(2010-2014)")

const svg=d3.select("main")
            .append("svg")
            .attr("height",h)
            .attr("width",w)
const tooltip=d3.select("main")
                .append("div")
                .attr("id","tooltip")
                .style("opacity",0)

fetch(countyUrl)
.then((response)=> response.json())
.then((data)=>{
  let countyData=topojson.feature(data,data.objects.counties).features
  fetch(eduUrl)
  .then(response=>response.json())
  .then(educationData=>{
    const handleMouseOut=()=>{
      return tooltip.style("opacity",0)
                    .html("")
    }
    const handleMouseOver=(d)=>{
      let id=d.id;
      let county=educationData.find(item=>{
        return item.fips==id;
      })
      return tooltip.style("opacity",0.75)
                    .attr("data-education",county.bachelorsOrHigher)
                    .style("left",(d3.event.pageX+6)+"px")
                    .style("top",(d3.event.pageY+5)+"px")
                    .html(county.area_name+", "+county.state+", "+county.fips+"<br>"+county.bachelorsOrHigher+"%")
    }
    svg.selectAll("path")
      .data(countyData)
      .enter()
      .append("path")
      .attr("d",d3.geoPath())
      .attr("class","county")
      .attr("fill",d=>{
        let id=d.id;
        let county=educationData.find(item=>{
          return item.fips==id;
        })
        const bachelor=county.bachelorsOrHigher
        if(bachelor>=2 && bachelor<=19) return "#aedff7"
        else if(bachelor>19 && bachelor<=35) return "#76c7e3"
        else if(bachelor>35 && bachelor<=50) return "#3a8bc2"
        else if (bachelor > 50 && bachelor <= 66) return "#1C5F89";
        else if (bachelor > 66) return "#004466";
      })
      .attr("data-fips",d=>{
      let id=d.id;
      let county=educationData.find(item=>{
        return item.fips==id;
      })
      return county.fips
      })
      .attr("data-education",d=>{
      let id=d.id;
      let county=educationData.find(item=>{
        return item.fips==id;
      })
      return county.bachelorsOrHigher
      })
      .on("mouseover",handleMouseOver)
      .on("mouseout",handleMouseOut)
      const legend=svg.append("g")
                      .attr("id","legend")
                      .attr("transform","translate("+(w-100)+","+h/2+")")
      legend.selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")
            .attr("width",20)
            .attr("height",20)
            .attr("y",(d,i)=>i*25)
            .attr("fill",d=>d.color)
      legend.selectAll("text")
            .data(colors)
            .enter()
            .append("text")
            .text(d=>d.label)
            .attr("y",(d,i)=>i*25+15)
            .attr("x",30)
  })
})