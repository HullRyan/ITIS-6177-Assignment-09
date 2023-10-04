/**
 * Loads environment variables from a .env file
 * @requires dotenv
 */
require("dotenv").config();

/**
 * Express web framework for Node.js
 * @requires express
 */
const express = require("express");

/**
 * Swagger documentation generator for Node.js
 * @requires swagger-jsdoc
 */
const swaggerJsDoc = require("swagger-jsdoc");

/**
 * Swagger UI for Express
 * @requires swagger-ui-express
 */
const swaggerUi = require("swagger-ui-express");

/**
 * CORS middleware for Express
 * @requires cors
 */
const cors = require("cors");

/**
 * Body parsing middleware for Express
 * @requires body-parser
 */
const bodyParser = require("body-parser");

/**
 * AWS SDK for JavaScript
 * @requires aws-sdk
 */
const aws = require("aws-sdk");

/**
 * AWS Lambda client
 */
const lambda = new aws.Lambda({
	region: "us-east-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Swagger options
 */
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "ITIS 6177 Week 06",
			version: "1.0.0",
			description:
				"A simple Express Library API, for ITIS 6177 Week 06 Assignment/Quiz",
		},
		servers: [
			{
				url: "http://localhost:3004",
				description: "Local server",
			},
		],
	},
	apis: ["./app.js"],
};

/**
 * Express app
 */
const app = express();

/**
 * Port number
 */
const port = 3004;

/**
 * JSON body parsing middleware
 */
const jsonParser = bodyParser.json();

/**
 * Swagger documentation
 */
const specs = swaggerJsDoc(options);

/**
 * Enable CORS for all routes
 */
app.use(cors());

/**
 * Serve Swagger UI at /api-docs
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * GET /say endpoint
 * @swagger
 * /say:
 *   get:
 *     summary: Get a keyword
 *     description: Use to request a keyword
 *     parameters:
 *       - name: keyword
 *         in: query
 *         description: Keyword to say
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
app.get("/say", (req, res) => {
	const keyword = req.query.keyword;
	if (!keyword) {
		res.status(400).send({ error: "Bad request" });
		return;
	}
	params = {
		FunctionName: "say",
		InvocationType: "RequestResponse",
		Payload: JSON.stringify({ keyword: keyword }),
	};
	lambda.invoke(params, (err, data) => {
		if (err) {
			res.status(500).send({ error: "Internal server error" });
		} else {
			res.send(data.Payload);
		}
	});
});

/**
 * Start the server
 */
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
