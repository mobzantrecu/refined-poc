import nock from 'nock';

// TODO: test [clickup #865bh7vb0]
afterAll(() => {
    nock.cleanAll();
    nock.restore();
});
