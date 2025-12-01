const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BusRouteAssignment = sequelize.define(
  "BusRouteAssignment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    busId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "bus_route_assignments",
  }
);

module.exports = BusRouteAssignment;
