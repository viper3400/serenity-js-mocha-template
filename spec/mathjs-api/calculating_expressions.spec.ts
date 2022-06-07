/* eslint-disable unicorn/filename-case, unicorn/consistent-function-scoping */
import 'mocha';

import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled, engage, notes } from '@serenity-js/core';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { escape } from 'querystring';
import { Actors, CalculationResult } from '../../src/index';

describe('Math.js API', () => {

    before( () => {
        const actors = new Actors(process.env.BASE_API_URL || 'http://api.mathjs.org/v4/')
        engage(actors);
    })

    describe('GET /v4/?expr', () => {

        // you can give domain meaning to your API requests by introducing
        const RequestToCalculateExpression = (expression: string) =>
            GetRequest.to(`/v4?expr=${ escape(expression) }`)
                .describedAs(`a request to calculate ${ expression }`)

        it('supports calculating a single expression', () =>
            actorCalled('Apisitt').attemptsTo(
                Send.a(RequestToCalculateExpression('2 + 2')),
                Ensure.that(notes().get('additionResult'), equals(0)),
                notes<CalculationResult>().set('additionResult', LastResponse.body<number>()),
                notes().set('addition result', LastResponse.body<number>()),
                Ensure.that(LastResponse.body<number>(), equals(4)),
                Ensure.that(notes().get('addition result'), equals(4)),
                Ensure.that(notes<CalculationResult>().get('additionResult'), equals(4))
            ));

        it('remembers Apisitt`s untyped notes', () =>
            actorCalled('Apisitt').attemptsTo(
            Ensure.that(notes().get('addition result'), equals(4))
            ));

        it('remembers Apisitt`s typed notes', () =>
            actorCalled('Apisitt').attemptsTo(
                Ensure.that(notes<CalculationResult>().get('additionResult'), equals(4))
          ));
    });

});
