const {Model} = require('objection');

class Vehicle extends Model {
    static get tableName() {
        return 'Vehicle';
    }
    static get relationMappings() {
        return {
            rides: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Vehicle.id',
                    to: 'Ride.vehicleId'
                }
            },
            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Driver",
                join: {
                    from: 'Vehicle.id',
                    through: {
                        from: 'Authorization.vehicleId',
                        to: 'Authorization.driverId'
                    },
                    to: 'Driver.id'
                }
            },
            vehicleTypes: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/VehicleType",
                join: {
                    from: 'Vehicle.vehicleTypeId',
                    to: 'Vehicle Type.id'
                }
            }
        }
    }
}
module.exports = {Vehicle};