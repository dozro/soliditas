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

/**
 * The Matrix Server Version
 * @link https://spec.matrix.org/v1.18/server-server-api/#server-implementation
 */
export type MatrixFederationServerVersion = {
    server: {
        /**
         * The name of the matrix server software
         */
        name: string,
        /**
         * The version of the matrix server software
         */
        version: string
    };
}

/**
 * A matrix error
 * @link https://spec.matrix.org/v1.18/client-server-api/#standard-error-response
 */
export type MatrixError = {
    errcode: string,
    error: string,
}

/**
 * The return type for `.well-known/matrix/server`
 */
export type MatrixWellKnownServer = {
    /**
     * The server-address
     */
    'm.server': string
}

/**
 * Response for the address convert endpoint
 */
export type SoliditasAddressConvertResponse = {
    /**
     * The mxc url where to get the media
     */
    mxcUrl: string,
    /**
     * The mxc id where to get the media, this is also indirectly saved in `mxcUrl`
     */
    mxcId: string,
    /**
     * How it is saved in the remote
     */
    remoteId: string,
    /**
     * What kind of remote we're talking about
     */
    remoteType: string,
}