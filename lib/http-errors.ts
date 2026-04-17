export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class BackendFeatureUnavailableError extends Error {
  constructor(feature: string) {
    super(`O backend atual nao disponibiliza endpoint para: ${feature}.`);
    this.name = "BackendFeatureUnavailableError";
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof BackendFeatureUnavailableError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado.";
}
