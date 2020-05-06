const {Model} = require('objection');

class Location extends Model {
    static get tableName() {
        return 'Location';
    }

    static get relationMappings() {
        return {
            rides: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Location.id',
                    to: 'Ride.fromLocationId'
                },

            },
            rides1: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Location.id',
                    to: 'Ride.toLocationId'
                },
            },
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/State",
                join: {
                    from: 'Location.state',
                    to: 'State.abbreviation'
                }

            }
        }
    }
}
module.exports = {Location};