
module.exports = (sequelize, DataTypes) => {
let Chatmessages = sequelize.define("chatmessages", {
	id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
	message: {
		type: DataTypes.STRING
	},
	user: {
		type: DataTypes.SRING
	}
})



return Pingpongstats
}