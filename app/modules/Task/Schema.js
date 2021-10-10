let Task = sequelizeConnection.define('Task', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    taskName: { type: DataTypes.STRING, allowNull: false, unique: true },
    taskDescription: { type: DataTypes.STRING, allowNull: true, unique: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    freezeTableName: true,
    paranoid: true
});

Task.associate = (models) => {
    models.Task.belongsTo(models.Users, {
        through: 'userId',
        onDelete: 'cascade',
    });
    models.Task.belongsTo(models.Category, {
        through: 'categoryId',
        onDelete: 'cascade',
    });
};

module.exports = {
    Task
}