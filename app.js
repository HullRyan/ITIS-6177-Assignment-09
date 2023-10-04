require("dotenv").config();
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const aws = require("aws-sdk");

const lambda = new aws.Lambda({
	region: "us-east-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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
const app = express();
const port = 3004;
const jsonParser = bodyParser.json();

const specs = swaggerJsDoc(options);

app.use(cors());

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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
