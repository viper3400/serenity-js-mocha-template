/* eslint-disable unicorn/filename-case, unicorn/consistent-function-scoping */
import 'mocha';

import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled, engage, Log, notes } from '@serenity-js/core';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { escape } from 'querystring';
import { NotepadTwo, NotepadOne, actorNames } from '../../src/index';

describe('Math.js API', () => {

    before( () => {
        actorCalled(actorNames.Apisitt).attemptsTo(Log.the(notes().toJSON())),
        actorCalled(actorNames.Jan).attemptsTo(Log.the(notes().toJSON()))
    })

    describe('GET /v4/?expr', () => {

        // you can give domain meaning to your API requests by introducing
        const RequestToCalculateExpression = (expression: string) =>
            GetRequest.to(`/v4?expr=${ escape(expression) }`)
                .describedAs(`a request to calculate ${ expression }`)

        it('supports Apisitt with calculating a single expression', () =>
            actorCalled(actorNames.Apisitt).attemptsTo(
                Send.a(RequestToCalculateExpression('2 + 2')),
                Ensure.that(notes().get('additionResult'), equals(0)),
                notes<NotepadTwo>().set('additionResult', LastResponse.body<number>()),
                notes().set('addition result', LastResponse.body<number>()),
                Ensure.that(LastResponse.body<number>(), equals(4)),
                Ensure.that(notes().get('addition result'), equals(4)),
                Ensure.that(notes<NotepadTwo>().get('additionResult'), equals(4))
            ));

         it('supports Jan with calculating a single expression', () =>
            actorCalled(actorNames.Jan).attemptsTo(
                Send.a(RequestToCalculateExpression('2 + 3')),
                Ensure.that(notes().get('otherAdditionResult'), equals(0)),
                notes<NotepadOne>().set('otherAdditionResult', LastResponse.body<number>()),
                notes().set('addition result', LastResponse.body<number>()),
                Ensure.that(LastResponse.body<number>(), equals(5)),
                Ensure.that(notes().get('addition result'), equals(5)),
                Ensure.that(notes<NotepadOne>().get('otherAdditionResult'), equals(5))
            ));

        it('remembers Apisitt`s untyped notes', () =>
            actorCalled(actorNames.Apisitt).attemptsTo(
            Ensure.that(notes().get('addition result'), equals(4))
            ));

        it('remembers Apisitt`s typed notes', () =>
            actorCalled(actorNames.Apisitt).attemptsTo(
                Ensure.that(notes<NotepadTwo>().get('additionResult'), equals(4)),
                Ensure.that(notes<NotepadTwo>().get('translations').Switzerlerland, equals('Schweiz'))
          ));

        it('remembers Jan`s untyped notes', () =>
          actorCalled(actorNames.Jan).attemptsTo(
          Ensure.that(notes().get('addition result'), equals(5))
          ));

        it('remembers Jans`s typed notes', () =>
          actorCalled(actorNames.Jan).attemptsTo(
              Ensure.that(notes<NotepadOne>().get('otherAdditionResult'), equals(5)),
              Ensure.that(notes<NotepadOne>().get('translations').Switzerlerland, equals('Suisse'))
        ));
    });

    after( () => {
        actorCalled(actorNames.Apisitt).attemptsTo(Log.the(notes().toJSON())),
        actorCalled(actorNames.Jan).attemptsTo(Log.the(notes().toJSON()))
    })

});
