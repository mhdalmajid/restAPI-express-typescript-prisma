export interface ErrorHandler extends Error {
  status?: number;
  body?: string;
}