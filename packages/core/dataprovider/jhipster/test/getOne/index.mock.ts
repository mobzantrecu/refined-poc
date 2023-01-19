import nock from 'nock';

nock('https://api.jhipster.dev:443', { encodedQueryParams: true })
    .get('/posts/1')
    .reply(
        200,
        {
            id: 1,
            title: 'Singapore Extremadura',
            status: 'Metal action-items',
            createdAt: '2022-11-20T01:02:12Z',
        },
        [
            'Cache-Control',
            'no-cache, no-store, max-age=0, must-revalidate',
            'Connection',
            'keep-alive',
            'Content-Type',
            'application/json',
            'Date',
            'Sun, 08 Jan 2023 04:15:22 GMT',
            'Expires',
            '0',
            'Pragma',
            'no-cache',
            'Transfer-Encoding',
            'chunked',
            'Vary',
            'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
            'X-Content-Type-Options',
            'nosniff',
        ]
    );
