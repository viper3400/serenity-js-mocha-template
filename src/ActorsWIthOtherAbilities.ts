import { Actor, Cast, Notepad, TakeNotes } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';
import { ensure, isNotBlank } from 'tiny-types';

export interface OtherCalculationResult {
    otherAdditionResult: number;
}
export class ActorsWithOtherAbilities implements Cast {
    constructor(private readonly baseApiUrl: string) {
        ensure('apiUrl', baseApiUrl, isNotBlank());
    }

    prepare(actor: Actor): Actor {
        return actor.whoCan(
            CallAnApi.at(this.baseApiUrl),
            TakeNotes.using(Notepad.with<OtherCalculationResult>({otherAdditionResult: 0}))
        );
    }
}
