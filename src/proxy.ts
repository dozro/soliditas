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

const MXCIDREGEX = /^[a-zA-Z0-9._-]+$/;

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

	if (!MXCIDREGEX.test(id)) {
		// the id isn't in a matrix legal format
		return matrixInvalidParam(`invalid mxc id (${id})`);
	}

	return id;
}

function proxyGiphy(id: string): Response {
	const strippedId = id.startsWith('giphy_') ? id.slice('giphy_'.length) : id;
	return Response.redirect(`https://media.giphy.com/${strippedId}`, 307);
}

export function proxyMediaCall(rawId: string): Response {
	const decodedId = decodeMatrixId(rawId);
	if (typeof decodedId !== 'string') {
		return new Response(JSON.stringify(decodedId), { status: 400, statusText: 'error decoding media id' });
	}
	if (rawId.startsWith('giphy_') || decodedId.startsWith('giphy_')) {
		return proxyGiphy(decodedId);
	}
	return new Response(JSON.stringify(matrixInvalidParam("the identifier of the remote didn't match any supported remote identifier")), {
		status: 400,
		statusText: "the identifier of the remote didn't match any supported remote identifier",
	});
}
