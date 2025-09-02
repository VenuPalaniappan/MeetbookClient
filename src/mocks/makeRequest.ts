
import { vi } from "vitest";
export const makeRequest = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
export default makeRequest;