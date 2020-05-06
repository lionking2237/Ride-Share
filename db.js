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
        {
            method: "GET",
            path: "/VehicleType/",
            handler: function (request, h) {
                return VehicleType.query();
            },
        },
        {
            method: "GET",
            path: "/Location",
            handler: function (request, h) {
                return Location.query();
            },
        },
        {
            method: "GET",
            path: "/Passenger",
            handler: function (request, h) {
                return Passenger.query();
            },
        },
        {
            method: "GET",
            path: "/State",
            handler: function (request, h) {
                return State.query();
            },
        },
        {
            method: "GET",
            path: "/Ride",
            handler: function (request, h) {
                return Ride.query();
            },
        },
        {
            method: "GET",
            path: "/Vehicle",
            handler: function (request, h) {
                return Vehicle.query();
            },
        },
        {
            method: "GET",
            path: "/Driver",
            handler: function (request, h) {
                return Driver.query();
            },
        }
    ]);

    console.log("Server listening on", server.info.uri);
    await server.start();
};

init();