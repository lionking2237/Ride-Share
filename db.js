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
                        capacity: Joi.string().required(),
                        mpg: Joi.string().required(),
                        licenceState: Joi.string().required(),
                        licenseNumber: Joi.string().required(),
                        vehicleType: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {

                    const existingAccount = await Vehicle.query()
                        .where("licenseNumber", request.payload.licenseNumber)
                        .first();
                    if (existingAccount) {
                        const vehicleTypeId = VehicleType.query()
                            .select("id")
                            .where("type", request.payload.vehicleType)
                            .first();
                        await Vehicle.query()
                            .where("licenseNumber", request.payload.licenseNumber)
                            .patch({
                                make: request.payload.make,
                                model: request.payload.model,
                                color: request.payload.color,
                                capacity: request.payload.capacity,
                                mpg: request.payload.mpg,
                                licenseState: request.payload.licenseState,
                                licenseNumber:request.payload.licenseNumber,
                                vehicleTypeId: vehicleTypeId,
                            });
                        console.log("Updated?");
                        return {
                            ok: true,
                            msge: `Vehicle with license number '${request.payload.licenseNumber}' has been updated`,
                        };
                    }else{
                        return {
                            ok: false,
                            msge: `Vehicle with license number '${request.payload.licenseNumber}' has not been updated`,
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
                return Vehicle.query();
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