const config = require('../../../configs/configs');
const _ = require('lodash');

let Users = sequelizeConnection.define('Users', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    emailId: { type: DataTypes.STRING, unique: true },
    googleId: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
}, {
    freezeTableName: true,
    paranoid: true

});



module.exports = {
    Users,
}