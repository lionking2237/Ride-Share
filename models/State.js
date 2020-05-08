const {Model} = require('objection');

class State extends Model {
    static get tableName() {
        return 'State';
    }
    static get relationMappings(){
        return {
            location: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'State.abbreviation',
                    to: 'Location.state'
                }
            }
        }
    }
}
module.exports = {State};