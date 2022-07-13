// Copyright 2022 ilotterytea
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import axios from "axios";

namespace ApiTwitch {
    /** Twitch user. */
    export interface ApiUser {
        /** Twitch user's ID. */
        id: string | undefined;

        /** Twitch user's name. */
        name: string | undefined;
    }

    /**
     * Get {@link ApiUser} by Twitch user's name.
     * @param username Twitch user's name
     * @param client_id Client ID of your dev.twitch.tv application.
     * @param access_token Access token.
     * @returns ApiUser or null (if something went wrong).
     */
    export async function getUserByName(username: string, client_id: string, access_token: string): Promise<ApiUser | null> {
        var user: ApiUser = {
            id: undefined,
            name: undefined
        }

        var isntResolved: boolean = true;

        await axios.get(
            "https://api.twitch.tv/helix/users?login=" + username,
            {
                responseType: "json",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Client-Id": client_id
                }
            }
        )
        .catch((reason: any) => {
            throw new Error(reason);
        })
        .then(async (response) => {
            // User doesn't exist:
            if (response.data.data.length == 0) return;

            isntResolved = false;

            return user = {
                id: response.data.data[0].id,
                name: response.data.data[0].login
            }
        }).finally(() => {});

        if (isntResolved) return Promise.resolve(null);
        return Promise.resolve(user);
    }

    /**
     * Get {@link ApiUser} by Twitch user's ID.
     * @param username Twitch user's ID
     * @param client_id Client ID of your dev.twitch.tv application.
     * @param access_token Access token.
     * @returns ApiUser or null (if something went wrong).
     */
     export async function getUserById(user_id: string, client_id: string, access_token: string): Promise<ApiUser | null> {
        var user: ApiUser = {
            id: undefined,
            name: undefined
        }

        var isntResolved: boolean = true;

        await axios.get(
            "https://api.twitch.tv/helix/users?id=" + user_id,
            {
                responseType: "json",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Client-Id": client_id
                }
            }
        )
        .catch((reason: any) => {
            throw new Error(reason);
        })
        .then(async (response) => {
            // User doesn't exist:
            if (response.data.data.length == 0) return;

            isntResolved = false;

            return user = {
                id: response.data.data[0].id,
                name: response.data.data[0].login
            }
        }).finally(() => {});

        if (isntResolved) return Promise.resolve(null);
        return Promise.resolve(user);
    }
}

export default ApiTwitch;
