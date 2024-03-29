import express from "express";
import { validationResult } from "express-validator";

const spawn = require("child_process").spawn;

export const executePythonNifiModule = (args: string[], response: express.Response) => {
	let dataToSend: string = "";
	let errorToSend: string = "";
	const python = spawn("python3", args);

	python.stdout.on('data', (data: any) => {
		dataToSend += data.toString();
	});

	python.on('error', (err: any) => {
		errorToSend += err.toString();
	});

	python.on('close', (code: number) => {
		const errorTag = "[PY_NIFI_MODULE_ERROR] ";
		console.log(`Child python process close all stdio with code ${code}`);

		if (errorToSend !== "") {
			response.status(500).json({ 
				errorOccurred: true,
				msg: errorToSend
			});
		}
		else if (dataToSend.substring(0, 30).toUpperCase().includes(errorTag)) {
			response.status(500).json({ 
				errorOccurred: true,
				msg: dataToSend
			});
		} else {
			response.send(JSON.parse(dataToSend))
		}
	});
}

export const validationResultCheck = (request: express.Request, response: express.Response, callback: any) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(400).json({ errors: errors.array() });
	} else {
		callback();
	}
}
