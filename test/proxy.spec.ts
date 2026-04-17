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

import { describe, expect, it } from 'vitest';
import { toMatrixID } from '../src/mxcId';
import { proxyMediaCall } from '../src/proxy';

describe('proxyMediaCall', () => {
	it('redirects to giphy when the decoded id has giphy prefix', () => {
		const encoded = toMatrixID('giphy_catdance', 'giphy_');
		const response = proxyMediaCall(encoded);

		expect(response.status).toBe(307);
		expect(response.headers.get('Location')).toBe('https://media.giphy.com/catdance');
	});

	it('redirects to giphy when raw id indicates giphy and payload is plain media key', () => {
		const encoded = toMatrixID('catdance', 'giphy_');
		const response = proxyMediaCall(encoded);

		expect(response.status).toBe(307);
		expect(response.headers.get('Location')).toBe('https://media.giphy.com/catdance');
	});

	it('returns M_INVALID_PARAM when the media id is malformed', async () => {
		const response = proxyMediaCall('not-a-valid-id');

		expect(response.status).toBe(400);
		expect(await response.text()).toContain('M_INVALID_PARAM');
	});
});
