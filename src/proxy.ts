/*
   Apache License 2.0

   Copyright 2026 Rye

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { MatrixError } from './types';
import { matrixInvalidParam } from './matrixError';
import { fromMatrixID } from './mxcId';

const GIPHYIDREGEX = /^[a-zA-Z0-9._/-]+$/;

/**
 * helper function to decode matrix id, and either return the decoded id or a error response
 *
 * @param {string} rawId the id to decoded
 * @return {*}  {(string | MatrixErrorResponse)} decoded id or a error response
 */
function decodeMatrixId(rawId: string): string | MatrixError {
	let id: string;

	try {
		id = fromMatrixID(rawId);
	} catch {
		// parsing the id somehow failed
		return {
			errcode: 'M_INVALID_PARAM',
			error: 'The ID given is not a valid MXC id',
		};
	}

	return id;
}
async function buildMultipartRedirect(targetLocation: string): Promise<Response> {
	const boundary = `soliditas${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
	const body = Buffer.from(
		`--${boundary}\r\n` +
			`Content-Type: application/json\r\n` +
			`\r\n` +
			`{}\r\n` +
			`--${boundary}\r\n` +
			`Content-Type: application/octet-stream\r\n` +
			`Location: ${targetLocation}\r\n` +
			`\r\n` +
			`\r\n` +
			`--${boundary}--\r\n`,
		'utf8'
	);

	return new Response(body, {
		headers: {
			'Content-Type': `multipart/mixed; boundary=${boundary}`,
			'Content-Length': `${body.length}`,
		},
		status: 200,
	});
}

/**
 * proxy a giphy call
 * example id: yXPquATCb8kGk
 *
 * @param {string} id the id of the giphy media
 * @return {*}  {Response} the proxied request
 * @async
 */
async function proxyGiphy(id: string): Promise<Response> {
	return buildMultipartRedirect(`https://i.giphy.com/${id}.webp`);
}

export async function proxyMediaCall(rawId: string): Promise<Response> {
	const decodedId = decodeMatrixId(rawId);
	if (typeof decodedId !== 'string') {
		return new Response(JSON.stringify(decodedId), { status: 400, statusText: 'error decoding media id' });
	}
	const isGiphy = rawId.startsWith('giphy_') || decodedId.startsWith('giphy_');
	if (!isGiphy) {
		return new Response(JSON.stringify(matrixInvalidParam("the identifier of the remote didn't match any supported remote identifier")), {
			status: 400,
			statusText: "the identifier of the remote didn't match any supported remote identifier",
		});
	}
	if (!GIPHYIDREGEX.test(decodedId)) {
		return new Response(JSON.stringify(matrixInvalidParam(`invalid giphy id (${decodedId})`)), {
			status: 400,
			statusText: 'error decoding media id',
		});
	}
	return await proxyGiphy(decodedId);
}
