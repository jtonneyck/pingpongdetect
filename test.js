 const moment = require("moment")

 


 			  console.log("CHECK SPLIT", moment("2017-12-10 18:55:50+01").isAfter(moment("2017-12-10 18:30:50+01").endOf("hour")))


console.log(moment("2017-12-10 18:30:50+01").add(1, "hours").endOf("hour").format())