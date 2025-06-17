import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './test/__mocks__/handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());