const { VehicleType } = require("./models/VehicleType");
const { Location } = require("./models/Location");
const { Passenger } = require("./models/Passenger");
const { State } = require("./models/State");
const { Ride } = require("./models/Ride");
const { Vehicle } = require("./models/Vehicle");
const { Driver } = require("./models/Driver");

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
            path: "/vehicle-types",
            handler: function (request, h) {
                return VehicleType.query();
            },
        },
        {
            method: "POST",
            path: "/vehicle-types",
            config: {
                description: "Create a new vehicle type",
                validate: {
                    payload: Joi.object({
                        type: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingType = await VehicleType.query()
                    .where("type", request.payload.type)
                    .first();
                if (existingType) {
                    return {
                        ok: false,
                        msge: `Type '${request.payload.type}' has already been created`,
                    };
                }

                const newType = await VehicleType.query().insert({
                    type: request.payload.type,
                });

                if (newType) {
                    return {
                        ok: true,
                        msge: `Created type '${request.payload.type}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create type '${request.payload.type}'`,
                    };
                }
            },
        },
        {
            method: "POST",
            path: "/vehicles",
            config: {
                description: "Create a new Vehicle",
                validate: {
                    payload: Joi.object({
                        make: Joi.string().required(),
                        model: Joi.string().required(),
                        color: Joi.string().required(),
                        capacity: Joi.string().required(),
                        mpg: Joi.string().required(),
                        licenseState: Joi.string().required(),
                        licenseNumber: Joi.string().required(),
                        vehicleType: Joi.number().integer().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingVehicle = await Vehicle.query()
                        .where("licenseNumber", request.payload.licenseNumber)
                        .first();
                if (existingVehicle) {
                    return {
                        ok: false,
                        msge: `Vehicle with license number '${request.payload.licenseNumber}' is already in use`,
                    };
                }
                const newVehicle = await Vehicle.query().insert({
                    make: request.payload.make,
                    model: request.payload.model,
                    color: request.payload.color,
                    capacity: parseInt(request.payload.capacity),
                    mpg: parseInt(request.payload.mpg),
                    licenseState: request.payload.licenseState,
                    licenseNumber:request.payload.licenseNumber,
                    vehicleTypeId: request.payload.vehicleType,
                });

                if (newVehicle) {
                    return {
                        ok: true,
                        msge: `Created vehicle with license plate '${request.payload.licenseNumber}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create vehicle with license plate '${request.payload.licenseNumber}'`,
                    };
                }
            },
        },
        {
            method: "PATCH",
            path: "/vehicles/{id}",
            config: {
                description: "Modify an existing vehicle",
                validate: {
                    payload: Joi.object({
                        make: Joi.string().required(),
                        model: Joi.string().required(),
                        color: Joi.string().required(),
                        capacity: Joi.number().integer().min(1).required(),
                        mpg: Joi.number().integer().min(1).required(),
                        licenseState: Joi.string().required(),
                        licenseNumber: Joi.string().required(),
                        vehicleType: Joi.number().integer().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const updatedVehicle = await Vehicle.query()
                    .where("licenseNumber", request.payload.licenseNumber)
                    .patch({
                        make: request.payload.make,
                        model: request.payload.model,
                        color: request.payload.color,
                        capacity: request.payload.capacity,
                        mpg: request.payload.mpg,
                        licenseState: request.payload.licenseState,
                        licenseNumber:request.payload.licenseNumber,
                        vehicleTypeId: request.payload.vehicleType,
                    });
                console.log("Updated?");
                if (updatedVehicle) {
                    return {
                        ok: true,
                        msge: `Created vehicle with license plate '${request.payload.licenseNumber}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create vehicle with license plate '${request.payload.licenseNumber}'`,
                    };
                }
            },
        },
        {
            method: "POST",
            path: "/rides",
            config: {
                description: "Create a ride",
                validate: {
                    payload: Joi.object({
                        date: Joi.string().required(),
                        time: Joi.string().required(),
                        distance: Joi.number().min(1).required(),
                        fuelPrice: Joi.number().min(1).required(),
                        fee: Joi.number().min(1).required(),
                        fromLocationId: Joi.number().min(1).required(),
                        toLocationId: Joi.number().min(1).required(),
                        vehicleId: Joi.number().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const newRide = await Ride.query()
                    .insert({
                        date: request.payload.date,
                        time: request.payload.time,
                        distance: request.payload.distance,
                        fuelPrice: request.payload.fuelPrice,
                        fee: request.payload.fee,
                        fromLocationId: request.payload.fromLocationId,
                        toLocationId: request.payload.toLocationId,
                        vehicleId: request.payload.vehicleId,
                    });
                if (newRide) {
                    return {
                        ok: true,
                        msge: `Created Ride on '${request.payload.date}' at '${request.payload.time}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't Create Ride`,
                    };
                }
            },
        },
        {
            method: "PATCH",
            path: "/rides/{id}",
            config: {
                description: "Modify a ride",
                validate: {
                    payload: Joi.object({
                        id: Joi.number().required(),
                        date: Joi.string().required(),
                        time: Joi.string().required(),
                        distance: Joi.number().min(1).required(),
                        fuelPrice: Joi.number().min(1).required(),
                        fee: Joi.number().min(1).required(),
                        fromLocationId: Joi.number().min(1).required(),
                        toLocationId: Joi.number().min(1).required(),
                        vehicleId: Joi.number().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {

                const newRide = await Ride.query()
                    .where("id", request.payload.id)
                    .patch({
                        date: request.payload.date,
                        time: request.payload.time,
                        distance: request.payload.distance,
                        fuelPrice: request.payload.fuelPrice,
                        fee: request.payload.fee,
                        fromLocationId: request.payload.fromLocationId,
                        toLocationId: request.payload.toLocationId,
                        vehicleId: request.payload.vehicleId,
                    });
                if (newRide) {
                    return {
                        ok: true,
                        msge: `Updated Ride on '${request.payload.date}' at '${request.payload.time}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't update Ride`,
                    };
                }
            },
        },

        {
            method: "POST",
            path: "/authorize",
            config: {
                description: "Authorize a New Driver to a Vehicle",
                validate: {
                    payload: Joi.object({
                        driverId: Joi.number().integer().min(1).required(),
                        vehicleId: Joi.number().integer().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const driver = await Driver.query().findById(request.payload.driverId);
                const vehicle = await Vehicle.query().findById(request.payload.vehicleId);

                const existAuth = await driver
                .$relatedQuery("vehicles")
                .where("id", vehicle.id)
                .first();
                if (existAuth) {
                    return {
                        ok: false,
                        msge: `This Authorization is already in place`,
                    };
                }

                const affected = await driver.$relatedQuery("vehicles").relate(vehicle);
                if (affected === 1) {
                    return {
                        ok: true,
                        msge: `Authorization Created`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create Authorization`,
                    };
                }
            },
        },


        //Locations Section
        {
            method: "GET",
            path: "/locations",
            handler: function (request, h) {
                return Location.query();
            },
        },


        //Passengers Section
        {
            method: "GET",
            path: "/passengers",
            handler: function (request, h) {
                return Passenger.query();
            },
        },

        {
            method: "POST",
            path: "/passengerSignUp",
            config: {
                description: "Add a Passenger to a Ride",
                validate: {
                    payload: Joi.object({
                        passengerId: Joi.number().integer().min(1).required(),
                        rideId: Joi.number().integer().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const passenger = await Passenger.query().findById(request.payload.passengerId);
                const ride = await Ride.query().findById(request.payload.rideId);

                const existAuth = await passenger
                    .$relatedQuery("rides")
                    .where("id", ride.id)
                    .first();
                if (existAuth) {
                    return {
                        ok: false,
                        msge: `This Authorization is already in place`,
                    };
                }

                const affected = await passenger.$relatedQuery("rides").relate(ride);
                if (affected === 1) {
                    return {
                        ok: true,
                        msge: `Authorization Created`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create Authorization`,
                    };
                }
            },
        },
        {
            method: "POST",
            path: "/driverSignUp",
            config: {
                description: "Add a Driver to a Ride",
                validate: {
                    payload: Joi.object({
                        driverId: Joi.number().integer().min(1).required(),
                        rideId: Joi.number().integer().min(1).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const driver = await Driver.query().findById(request.payload.driverId);
                const ride = await Ride.query().findById(request.payload.rideId);

                const existAuth = await driver
                    .$relatedQuery("rides")
                    .where("id", ride.id)
                    .first();
                if (existAuth) {
                    return {
                        ok: false,
                        msge: `This Authorization is already in place`,
                    };
                }

                const affected = await driver.$relatedQuery("rides").relate(ride);
                if (affected === 1) {
                    return {
                        ok: true,
                        msge: `Authorization Created`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create Authorization`,
                    };
                }
            },
        },
        {
            method: "POST",
            path: "/login",
            config: {
                description: "Log in",
                validate: {
                    payload: Joi.object({
                        id: Joi.number().required()
                    }),
                },
            },
            handler: async (request, h) => {
                const passenger = await Passenger.query()
                    .where("id", request.payload.id)
                    .first();
                if (passenger) {
                    return {
                        ok: true,
                        msge: `Logged in successfully`,
                        details: {
                            id: passenger.id,
                        },
                    };
                } else {
                    return {
                        ok: false,
                        msge: "Invalid email or password",
                    };
                }
            },
        },


        {
          method:"POST",
          path: "/passengers",
            config: {
                description: "Create a new Passenger",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        phone: Joi.string().required(),
                    }),
                },
            },
            handler: async function(request, h){
              const existingPassenger = await Passenger.query()
                  .where("phone", request.payload.phone)
                  .first();
              if(existingPassenger){
                  return {
                      ok: false,
                      msge: `'${request.payload.firstName}' '${request.payload.lastName}' has already been created`,
                  };
              }
                const newPassenger = await Passenger.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    phone: request.payload.phone,
                });

                if (newPassenger) {
                    return {
                        ok: true,
                        msge: `Created Passenger '${request.payload.firstName}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create Passenger '${request.payload.lastName}'`,
                    };
                }
            }
        },
        {
            method: "POST",
            path: "/drivers",
            config: {
                description: "Create a new Driver",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        phone: Joi.string().required(),
                        licenseNumber: Joi.string().required(),
                    }),
                },
            },
            handler: async function(request, h){
                const existingDriver = await Driver.query()
                    .where("licenseNumber", request.payload.licenseNumber)
                    .first();
                if(existingDriver){
                    return {
                        ok: false,
                        msge: `'${request.payload.firstName}' '${request.payload.lastName}' has already been created`,
                    };
                }
                const newDriver = await Driver.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    phone: request.payload.phone,
                    licenseNumber: request.payload.licenseNumber,
                });

                if (newDriver) {
                    return {
                        ok: true,
                        msge: `Created Driver '${request.payload.firstName}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create Driver '${request.payload.lastName}'`,
                    };
                }
            }
        },


        //States Section
        {
            method: "GET",
            path: "/states",
            handler: function (request, h) {
                return State.query();
            },
        },


        //Rides Section
        {
            method: "GET",
            path: "/rides",
            handler: function (request, h) {
                return Ride.query().withGraphFetched("[passengers, drivers, fromLocations, toLocations, vehicles]")
            },
        },
        {
            method: "GET",
            path: "/driverRides/{driverId}",
            handler: function (request, h) {
                return Driver.query()
                    .findById(request.params.driverId)
                    .withGraphFetched("vehicles.rides.[fromLocations, toLocations]")
            },
        },
        {
            method: "GET",
            path: "/passenger/{passengerId}",
            handler: function(request, h){
                return Passenger.query()
                    .findById(request.params.passengerId)
                    .withGraphFetched("rides.[fromLocations,toLocations,vehicles,drivers,passengers]");
            }
        },
        {
            method: "GET",
            path: "/driver/{driverId}",
            handler: function(request, h){
                return Driver.query()
                    .findById(request.params.driverId)
                    .withGraphFetched("rides.[fromLocations,toLocations,vehicles,drivers,passengers]");
            }
        },
        //Vehicles Section
        {
            method: "GET", // Reading Vehicles
            path: "/vehicleslist",
            handler: function (request, h) {
                return Vehicle.query().withGraphFetched("vehicleTypes")
            },
        },


        //Drivers Section
        {
            method: "GET",
            path: "/drivers",
            handler: function (request, h) {
                return Driver.query();
            },
        }
    ]);

    console.log("Server listening on", server.info.uri);
    await server.start();
};

init();