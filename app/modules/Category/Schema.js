let Category = sequelizeConnection.define('Category', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    freezeTableName: true,
    paranoid: true
});

module.exports = {
    Category
}