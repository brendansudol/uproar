import { NextResponse } from "next/server"

export function errorResponse(error: string, status = 500) {
  return NextResponse.json(
    {
      ok: false,
      error,
    },
    { status }
  )
}

export function successResponse<TPayload extends Record<string, unknown> = Record<string, never>>(
  payload?: TPayload,
  status = 200
) {
  return NextResponse.json(
    {
      ok: true,
      ...(payload ?? {}),
    },
    { status }
  )
}
