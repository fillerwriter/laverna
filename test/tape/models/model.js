/**
 * Test models/Config.js
 * @file
 */
import test from 'tape';

import Model from '../../../app/scripts/models/Model';

test('Model: sync()', t => {
    const model = new Model();
    t.equal(typeof model.sync, 'function', 'has sync method');
    t.end();
});

test('Model: profileId() - get', t => {
    const model = new Model();

    t.equal(model.profileId, 'notes-db', 'returns "notes-db" for default');
    model._profileId = 'test';
    t.equal(model.profileId, 'test', 'returns the value of "_profileId" property');

    t.end();
});

test('Model: profileId() - set', t => {
    const model = new Model();

    model.profileId = 'test2';
    t.equal(model.profileId, 'test2', 'can change profileId property');
    t.equal(model._profileId, 'test2', 'can change profileId property');

    t.end();
});

test('Model: validateAttributes()', t => {
    const model = new Model();
    t.equal(Array.isArray(model.validateAttributes), true, 'is an array');
    t.end();
});

test('Model: escapeAttributes()', t => {
    const model = new Model();
    t.equal(Array.isArray(model.escapeAttributes), true, 'is an array');
    t.end();
});

test('Model: validate()', t => {
    const model = new Model();
    Object.defineProperty(model, 'validateAttributes', {
        get: () => {
            return ['title'];
        },
    });

    t.equal(model.validate({trash: 2}), undefined,
        'returns undefined if trash is equal to 2');

    t.equal(Array.isArray(model.validate({title: ''})), true,
        'returns an array if validation failed');

    t.equal(model.validate({title: 'Test'}), undefined,
        'returns undefined if there are no errors');

    t.equal(model.validate({title: {}}), undefined,
        'returns undefined if attribute is not string');

    t.end();
});

test('Model: setEscape()', t => {
    const model = new Model();
    Object.defineProperty(model, 'escapeAttributes', {
        get: () => {
            return ['title'];
        },
    });
    Object.defineProperty(model, 'defaults', {
        get: () => {
            return {title: ''};
        },
    });

    model.setEscape({title: 'Test<script></script>', name: 'Test'});
    t.notEqual(model.get('title'), 'Test<script></script>', 'filters XSS');

    model.setEscape({title: '', name: 'Test'});
    t.equal(model.get('title'), '', 'does nothing if an attribute is empty');

    t.end();
});

test('Model: getData()', t => {
    const model    = new Model({title: 'Test', test: '1'});
    model.defaults = {title: ''};

    const res = model.getData();
    t.equal(typeof res, 'object');
    t.equal(res.title, 'Test', 'contains the attribute which is in default property');
    t.equal(res.test, undefined,
        'does not contain attribute which is not in default property');
    t.equal(Object.keys(res).length, 1);

    t.end();
});

test('Model: setDate()', t => {
    const model = new Model();
    Object.defineProperty(model, 'defaults', {
        get: () => {
            return {created: 0, updated: 0};
        },
    });

    model.setDate();
    t.equal(typeof model.get('updated'), 'number',
        'changes "updated" attribute');
    t.equal(typeof model.get('created'), 'number',
        'changes "created" attribute');

    t.end();
});
