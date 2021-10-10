let Authtokens = sequelizeConnection.define('authtokens', {
    token: { type: DataTypes.STRING },
    tokenExpiryTime: { type: DataTypes.DATE }
}, {
    freezeTableName: true
});

Authtokens.associate = (models) => {
    models.Authtokens.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'cascade'
    });
};

module.exports = {
    Authtokens,
}