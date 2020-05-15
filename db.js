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
                        distance: Joi.string().required(),
                        fuelPrice: Joi.string().required(),
                        fee: Joi.string().required(),
                        fromLocationName: Joi.string().required(),
                        fromLocationAddress: Joi.string().required(),
                        fromLocationCity: Joi.string().required(),
                        fromLocationState: Joi.string().required(),
                        fromLocationZip:Joi.string().required(),
                        toLocationName: Joi.string().required(),
                        toLocationAddress: Joi.string().required(),
                        toLocationCity: Joi.string().required(),
                        toLocationState: Joi.string().required(),
                        toLocationZip: Joi.string().required(),
                        desiredVehicleLicense: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingFromLocation = await Location.query()
                    .where("address", request.payload.fromLocationAddress)
                    .first();
                if(!existingFromLocation){
                    await Location.query()
                        .insert({
                            name: request.payload.fromLocationName,
                            address: request.payload.fromLocationAddress,
                            city: request.payload.fromLocationCity,
                            state: request.payload.fromLocationState,
                            zipCode: request.payload.fromLocationZip,
                        });
                    const existingState = State.query()
                        .where("abbreviation", request.payload.fromLocationState)
                        .first();
                    if(!existingState){
                        await State.query()
                            .insert({
                                abbreviation: request.payload.fromLocationState,
                                name: "N/A",
                            });
                    }
                }
                const existingToLocation = await Location.query()
                    .where("address", request.payload.toLocationAddress)
                    .first();
                if(!existingToLocation){
                    await Location.query()
                        .insert({
                            name: request.payload.toLocationName,
                            address: request.payload.toLocationAddress,
                            city: request.payload.toLocationCity,
                            state: request.payload.toLocationState,
                            zipCode: request.payload.toLocationZip,
                        });
                    const existingState = State.query()
                        .where("abbreviation", request.payload.toLocationState)
                        .first();
                    if(!existingState){
                        await State.query()
                            .insert({
                                abbreviation: request.payload.toLocationState,
                                name: "N/A",
                            });
                    }
                }
                //known bug: does not check if license number is valid or not.
                const vehicleId = Vehicle.query()
                    .select("id")
                    .where("licenseNumber", request.payload.desiredVehicleLicense)
                    .first();

                const fromLocationId = Location.query()
                    .select("id")
                    .where("address", request.payload.fromLocationAddress);
                const toLocationId = Location.query()
                    .select("id")
                    .where("address", request.payload.toLocationAddress);

                const newRide = await Ride.query()
                    .insert({
                        date: request.payload.date,
                        time: request.payload.time,
                        distance: request.payload.distance,
                        fuelPrice: request.payload.fuelprice,
                        fee: request.payload.fee,
                        fromLocationId: fromLocationId,
                        toLocationId: toLocationId,
                        vehicleId: vehicleId,
                    });
                if (newRide) {
                    return {
                        ok: true,
                        msge: `Created Ride from '${request.payload.fromLocationName}' to '${request.payload.toLocationName}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't Create Ride from '${request.payload.fromLocationName}' to '${request.payload.toLocationName}'`,
                    };
                }
            },
        },
        {
            method: "PATCH",
            path: "/rides",
            config: {
                description: "Modify a ride",
                validate: {
                    payload: Joi.object({
                        date: Joi.string().required(),
                        time: Joi.string().required(),
                        distance: Joi.string().required(),
                        fuelPrice: Joi.string().required(),
                        fee: Joi.string().required(),
                        fromLocationName: Joi.string().required(),
                        fromLocationAddress: Joi.string().required(),
                        fromLocationCity: Joi.string().required(),
                        fromLocationState: Joi.string().required(),
                        fromLocationZip:Joi.string().required(),
                        toLocationName: Joi.string().required(),
                        toLocationAddress: Joi.string().required(),
                        toLocationCity: Joi.string().required(),
                        toLocationState: Joi.string().required(),
                        toLocationZip: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingFromLocation = await Location.query()
                    .where("address", request.payload.fromLocationAddress)
                    .first();
                if(!existingFromLocation){
                    await Location.query()
                        .insert({
                            name: request.payload.fromLocationName,
                            address: request.payload.fromLocationAddress,
                            city: request.payload.fromLocationCity,
                            state: request.payload.fromLocationState,
                            zipCode: request.payload.fromLocationZip,
                        });
                    const existingState = State.query()
                        .where("abbreviation", request.payload.fromLocationState)
                        .first();
                    if(!existingState){
                        await State.query()
                            .insert({
                                abbreviation: request.payload.fromLocationState,
                                name: "N/A",
                            });
                    }
                }
                const existingToLocation = await Location.query()
                    .where("address", request.payload.toLocationAddress)
                    .first();
                if(!existingToLocation){
                    await Location.query()
                        .insert({
                            name: request.payload.toLocationName,
                            address: request.payload.toLocationAddress,
                            city: request.payload.toLocationCity,
                            state: request.payload.toLocationState,
                            zipCode: request.payload.toLocationZip,
                        });
                    const existingState = State.query()
                        .where("abbreviation", request.payload.toLocationState)
                        .first();
                    if(!existingState){
                        await State.query()
                            .insert({
                                abbreviation: request.payload.toLocationState,
                                name: "N/A",
                            });
                    }
                }
                //known bug: does not check if license number is valid or not.
                const vehicleId = Vehicle.query()
                    .select("id")
                    .where("licenseNumber", request.payload.desiredVehicleLicense)
                    .first();
                const fromLocationId = Location.query()
                    .select("id")
                    .where("address", request.payload.fromLocationAddress);
                const toLocationId = Location.query()
                    .select("id")
                    .where("address", request.payload.toLocationAddress);

                const newRide = await Ride.query()
                    .insert({
                        date: request.payload.date,
                        time: request.payload.time,
                        distance: request.payload.distance,
                        fuelPrice: request.payload.fuelprice,
                        fee: request.payload.fee,
                        fromLocationId: fromLocationId,
                        toLocationId: toLocationId,
                        vehicleId: vehicleId,
                    });
                if (newRide) {
                    return {
                        ok: true,
                        msge: `Created Ride from '${request.payload.fromLocationName}' to '${request.payload.toLocationName}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't Create Ride from '${request.payload.fromLocationName}' to '${request.payload.toLocationName}'`,
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
          method:"POST",
          path: "/passengers",
            config: {
                description: "Create a new Passenger",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        phone: Joi.number().integer().min(1).required(),
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
                return Ride.query();
                    //.$relatedQuery('vehicles')
                    //.select('licenseNumber')
                    //.where('id', 'vehicleId');
            },
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