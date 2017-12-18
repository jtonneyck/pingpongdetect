'use strict';
const moment = require("moment")

module.exports = (sequelize, DataTypes) => {
	console.log("required")
  let Pingpongstats = sequelize.define('pingpongstats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      state: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updatedAt: {
          type: DataTypes.DATE,
      }
    });

  Pingpongstats.associate = function(models) {
        // associations can be defined here
  }
  
  Pingpongstats.getThisWeeksStats = () => {
    let begin = moment().startOf("isoweek").format()
    let end = moment().endOf("isoweek").format()
	return getWeeklyStats(begin, end)
  }
  
  Pingpongstats.getLastWeeksStats = () => {
    let begin = moment().day(-7).startOf("isoweek").format()
    let end = moment().day(-7).endOf("isoweek").format()
    return getWeeklyStats(begin, end)
  }

function getWeeklyStats(startDate, endDate) {
	return Pingpongstats.findAll({
		where: {
			createdAt: {
				$between: [startDate, endDate]
			}
		},
		order: [
			["createdAt", "ASC"]
		]
	})
	.then(res => {
	  // 0 is Sunday
		let days = {1: {}, 2 : {}, 3: {}, 4 : {}, 5: {}, 6 : {}, 0: {}}
		for(let i = 0; i < (res.length - 1); i++) {
			if(res[i].state == true && res[i + 1].state == false) {
			  // Check if end falls into next hour. If so, split
			  if(moment(res[i+1].createdAt).isAfter(moment(res[i].createdAt).endOf("hour"))) {
			    res.splice(i + 1, 0, {state: false, createdAt: moment(res[i].createdAt).endOf("hour")})
			    res.splice(i + 2, 0, {state: true, createdAt: moment(res[i + 1].createdAt).add(1, "hours").startOf("hour")})
			  }   
			  let timeFree = moment(res[i + 1].createdAt) - moment(res[i].createdAt)
			  //console.log(`TIME FREE BETWEEN ${moment(res[i].createdAt).format()} and ${moment(res[i + 1].createdAt).format()}:  ${timeFree}`)
			  days[moment(res[i].createdAt).day()][moment(res[i].createdAt).hour()] === undefined? /* Already entry for this hour? If so, add, if not, create hour*/
			    days[moment(res[i].createdAt).day()][moment(res[i].createdAt).hour()] = timeFree:
			    days[moment(res[i].createdAt).day()][moment(res[i].createdAt).hour()] = days[moment(res[i].createdAt).day()][moment(res[i].createdAt).hour()] + timeFree
			}
			else if(res[i].state == true && res[i + 1].state == true || res[i].state == false && res[i + 1].state == false) {
			  throw new Error("Corrupt data, state switched to same state. Check row: ", i)
			}
		} 
		return days
	})
	.catch(e => console.log(e))
  }
return Pingpongstats
}

//////////////////////////////////////////////////////////////////
//    Status true means table is free. Status false occupied    //
//////////////////////////////////////////////////////////////////
