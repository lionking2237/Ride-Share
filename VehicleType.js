const {Model} = require('objection');

class VehicleType extends Model {
    static get tableName(){
        return 'Vehicle Type'
    }
    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'Vehicle Type.id',
                    to: 'Vehicle.vehicleTypeId'
                }
            }
        }
    }
}
module.exports = {VehicleType};