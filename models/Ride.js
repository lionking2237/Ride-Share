const {Model} = require('objection');

class Ride extends Model {
    static get tableName() {
        return 'Ride';
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Driver",
                join: {
                    from: 'Ride.id',
                    through: {
                        from: 'Drivers.rideId',
                        to: 'Drivers.driverId'
                    },
                    to: 'Driver.id'
                }
            },
            vehicles: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'Ride.vehicleid',
                    to: 'Vehicle.id'
                }
            },
            locations:{
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'Ride.fromLocationId',
                    to: 'Location.id'
                },
            },
            locations1:{
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'Ride.toLocationId',
                    to: 'Location.id'
                },
            },
            passengers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Passenger",
                join: {
                    from: 'Ride.id',
                    through: {
                        from: 'Passengers.rideId',
                        to: 'Passengers.passengerId'
                    },
                    to: 'Passenger.id'
                }
            }
        }
    }
}
module.exports = {Ride};