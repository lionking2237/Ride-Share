const { VehicleType } = require("./VehicleType");
const { Location } = require("./Location");
const { Passenger } = require("./Passenger");
const { State } = require("./State");
const { Ride } = require("./Ride");
const { Vehicle } = require("./Vehicle");
const { Driver } = require("./Driver");

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'faraday.cse.taylor.edu',
        user: 'levi_white',
        password: 'gepuleka',
        database: 'levi_white'
    }
});

const { Model } = require("objection");
Model.knex(knex);

const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const init = async () => {
    const server = Hapi.server({
        host: "localhost",
        port: 4200,
        routes: {
            cors: true,
          },
    });

    // Output endpoints at startup.
    await server.register({
        plugin: require("blipp"),
        options: { showAuth: true },
    });

    // Log stuff.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true,
        },
    });

    server.route([
        //Vehicle Types Section
        {
            method: "GET", //Reading Vehicle Type
            path: "/VehicleTypes",
            handler: function (request, h) {
                return VehicleType.query();
            },
        },
        {
            method: "POST", //Adding Vehicle Types
            path: "/VehicleTypeAdding",
            config: {
                description: "Sign up for an account",
                validate: {
                  payload: Joi.object({
                    type: Joi.string().required(),
                  }),
                },
              },
            handler: function (request, h) {
                const existingVehicle = await VehicleType.query()
                .where("type", request.payload.type)
                .first();
                if(existingVehicle) {
                    return {
                        ok: false,
                        msge: `car type of '${request.payload.type}' is already inserted.`,
                    };
                }

                const newVehicleType = await VehicleType.query().insert({
                    type: request.payload.type
                });
                if (newVehicleType) {
                    return {
                      ok: true,
                      msge: `Created car type '${request.payload.type}'`,
                    };
                  } else {
                    return {
                      ok: false,
                      msge: `Couldn't create account with email '${request.payload.type}'`,
                    };
                  }
            },
        },


        //Locations Section
        {
            method: "GET",
            path: "/Locations",
            handler: function (request, h) {
                return Location.query();
            },
        },
        {
            method: "POST",
            path: "/LocationsAdding",
            handler: function (request, h) {
                return Location.query();
            },
        },
        {
            method: "PATCH",
            path: "/LocationsEditing",
            handler: function (request, h) {
                return Location.query();
            },
        },


        //Passengers Section
        {
            method: "GET",
            path: "/Passengers",
            handler: function (request, h) {
                return Passenger.query();
            },
        },


        //States Section
        {
            method: "GET",
            path: "/States",
            handler: function (request, h) {
                return State.query();
            },
        },
        {
            method: "POST",
            path: "/StatesAdding",
            handler: function (request, h) {
                return State.query();
            },
        },
        {
            method: "PATCH",
            path: "/StatesEditing",
            handler: function (request, h) {
                return State.query();
            },
        },


        //Rides Section
        {
            method: "GET",
            path: "/Rides",
            handler: function (request, h) {
                return Ride.query();
            },
        },
        {
            method: "POST",
            path: "/RidesAdding",
            handler: function (request, h) {
                return Ride.query();
            },
        },
        {
            method: "PATCH",
            path: "/RidesEditing",
            config: {
                description: "Change password for your account",
                validate: {
                  payload: Joi.object({
                    date: Joi.string().required(),
                    time: Joi.string().required(),
                    distance: Joi.string().required(),
                    fuelprice: Joi.string().required(),
                    fee: Joi.string().required(),
                  }),
                },
              },
            handler: function (request, h) {
                const exisitingRide = await Ride.query()
                .where("date", request.payload.date)
                .update({
                    date: request.payload.date,
                    time: request.payload.time,
                    distance: request.payload.distance,
                    fuelprice: request.payload.fuelprice,
                    fee: request.payload.fee,
                });
                if (exisitingRide) {
                    return {
                      ok: true,
                      msge: 'Ride is Updated',
                    };
                  }
                  else{
                    return {
                      ok: false,
                      msge: 'Ride was not Updated'
                    }
                  }
            },
        },


        //Vehicles Section
        {
            method: "GET", // Reading Vehicles
            path: "/Vehicles",
            handler: function (request, h) {
                return Vehicle.query();
            },
        },
        {
            method: "PUT", // Adding Vehicles
            path: "/VehiclesAdding",
            handler: function (request, h) {
                return Vehicle.query();
            },
        },
        {
            method: "PATCH", // Editing Vehicles
            path: "/VehiclesEditing",
            handler: function (request, h) {
                return Vehicle.query();
            },
        },


        //Drivers Section
        {
            method: "GET",
            path: "/Drivers",
            handler: function (request, h) {
                return Driver.query();
            },
        }
    ]);

    console.log("Server listening on", server.info.uri);
    await server.start();
};

process.on("unhandledRejection", (err) => {
    server.logger().error(err);
    process.exit(1);
  });

init();