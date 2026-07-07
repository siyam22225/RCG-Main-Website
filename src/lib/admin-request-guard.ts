import { NextResponse } from "next/server";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function splitHeaderValues(value: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getRequestProto(req: Request) {
  try {
    return new URL(req.url).protocol.replace(":", "");
  } catch {
    return null;
  }
}

function getAllowedOrigins(req: Request) {
  const headers = req.headers;
  const hosts = [
    ...splitHeaderValues(headers.get("x-forwarded-host")),
    ...splitHeaderValues(headers.get("host")),
  ];

  try {
    hosts.push(new URL(req.url).host);
  } catch {
    // Ignore malformed internal URLs; the Host headers above are the primary source.
  }

  const protos = [
    ...splitHeaderValues(headers.get("x-forwarded-proto")),
    getRequestProto(req),
    process.env.NODE_ENV === "production" ? "https" : "http",
  ].filter((value): value is string => Boolean(value));

  const origins = new Set<string>();

  for (const host of hosts) {
    for (const proto of protos) {
      origins.add(`${proto.toLowerCase()}://${host.toLowerCase()}`);
    }
  }

  return origins;
}

export function requireSameOriginAdminRequest(req: Request) {
  if (!MUTATION_METHODS.has(req.method.toUpperCase())) {
    return null;
  }

  const originHeader = req.headers.get("origin");

  if (!originHeader) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    return null;
  }

  let origin: URL;

  try {
    origin = new URL(originHeader);
  } catch {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  const allowedOrigins = getAllowedOrigins(req);

  if (allowedOrigins.has(origin.origin.toLowerCase())) {
    return null;
  }

  return NextResponse.json(
    { error: "Invalid request origin." },
    { status: 403 }
  );
}
