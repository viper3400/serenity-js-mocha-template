import { Actor, Cast, Notepad, TakeNotes } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';
import { ensure, isNotBlank } from 'tiny-types';

export class NotepadOne {
    constructor(private readonly locale: string) {}
    otherAdditionResult: number = 0;
    translations = new Translations(this.locale);
}
export class NotepadTwo {
    constructor(private readonly locale: string) {}
    translations = new Translations(this.locale);
    additionResult: number = 0;
}
export class Translations {
    constructor(private readonly locale: string){}
    Switzerlerland = ({
        'de': 'Schweiz',
        'en': 'Switzerland',
        'fr': 'Suisse'
    })[this.locale]
}

export const actorNames = {
    Apisitt: 'Apisitt',
    Jan: 'Jan'
}
export class Actors implements Cast {
    constructor(private readonly baseApiUrl: string) {
        ensure('apiUrl', baseApiUrl, isNotBlank());
    }

    prepare(actor: Actor): Actor {
        switch(actor.name) {
            case actorNames.Apisitt:
                return actor.whoCan(
                    CallAnApi.at(this.baseApiUrl),
                    TakeNotes.using(Notepad.with(new NotepadTwo('de')))
                );
            case actorNames.Jan:
                return actor.whoCan(
                    CallAnApi.at(this.baseApiUrl),
                    TakeNotes.using(Notepad.with(new NotepadOne('fr')))
                );
        }
    }
}

