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

import IEmote from "../interfaces/IEmote";
import IEmoteProvider from "../interfaces/IEmoteProvider";
import axios from "axios";
import ApiTwitch from "../utils/Helix";

class FFZProvider implements IEmoteProvider {
    private client_id: string;
    private access_token: string;

    constructor (client_id: string, access_token: string) {
        this.client_id = client_id;
        this.access_token = access_token;
    }

    async getChannelEmotes(target: string): Promise<IEmote.FFZ[] | null> {
        try {
            var emotes: IEmote.FFZ[] = [];

            var user: ApiTwitch.ApiUser | null = {
                id: undefined,
                name: undefined
            }

            if (!isNaN(parseInt(target))) {
                user = await ApiTwitch.getUserById(parseInt(target).toString(), this.client_id, this.access_token);
            } else {
                user = await ApiTwitch.getUserByName(target, this.client_id, this.access_token);
            }

            if (user == null) return Promise.resolve(null);

            await axios.get(
                "https://api.frankerfacez.com/v1/room/" + user?.name,
                {
                    responseType: "json"
                }
            )
                .catch((reason: any) => {
                    throw new Error(reason);
                })
                .then(async (response) => {
                    var sets: any = response.data.sets;

                    Object.keys(sets).forEach(async (set) => {
                        sets[set].emoticons.forEach(async (apie: IEmote.FFZ) => {
                            emotes.push(apie);
                        });
                    });
                })
                .finally(() => {

                });
            
            return Promise.resolve(emotes);
        } catch (err: any) {
            throw new Error(err);
        }
    }
    async getGlobalEmotes(): Promise<IEmote.FFZ[] | null> {
        try {
            var emotes: IEmote.FFZ[] = [];

            await axios.get(
                "https://api.frankerfacez.com/v1/set/global",
                {
                    responseType: "json"
                }
            )
                .catch((reason: any) => {
                    throw new Error(reason);
                })
                .then(async (response) => {
                    var api_emotes: {[id: string]: any} = response.data.sets;

                    Object.keys(api_emotes).forEach(async (value) => {
                        api_emotes[value].emoticons.forEach(async (apie: IEmote.FFZ) => {
                            emotes.push(apie);
                        });
                    });
                })
                .finally(() => {

                });
            
            return Promise.resolve(emotes);
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

export default FFZProvider;