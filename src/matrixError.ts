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

import { MatrixError } from "./types";

export function matrixEndpointNotImplemented(msg: string): MatrixError{
    return {
        errcode: 'M_UNRECOGNIZED',
        error: `Endpoint not implemented: "${msg}"`
    } satisfies MatrixError;
}

export function matrixRessourceNotFound(msg: string): MatrixError{
    return {
        errcode: 'M_NOT_FOUND',
        error: `The requested resource couldn't be found: "${msg}"`
    } satisfies MatrixError;
}

export function matrixInvalidParam(msg: string): MatrixError{
    return {
        errcode: 'M_INVALID_PARAM',
        error: `You submitted an invalid parameter: "${msg}"`
    } satisfies MatrixError;
}