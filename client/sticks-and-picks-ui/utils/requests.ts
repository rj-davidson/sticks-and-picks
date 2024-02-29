/* eslint-disable no-console */
import { AxiosResponse } from "axios";

export type BasicRequest = {
  url: string;
  opt?: SticksAndPicks.JSON;
  headers?: SticksAndPicks.JSON;
};

export type JSONRequest = BasicRequest & {
  body: SticksAndPicks.JSON;
};

export type FormDataRequest = BasicRequest & {
  body: FormData;
  headers: Pick<BasicRequest, "headers">["headers"] & {
    "Content-Type": "multipart/form-data";
  };
};

export type StreamRequest = JSONRequest & {
  method: "GET" | "POST";
};

export type CustomError = Error & {
  handled?: boolean;
};

export type BodyRequest = JSONRequest | FormDataRequest;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BasicRequestBodyFunction = (req: BasicRequest) => Promise<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestBodyFunction = (req: BodyRequest) => Promise<any>;

export const prependLocalRequestHostname = (url: string) => {
  if (url.charAt(0) === "/") {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  }
  return url;
};

export async function handleResponse(response: Response | AxiosResponse) {
  try {
    let text = "";
    const isAxiosResponse = (
      response: Response | AxiosResponse
    ): response is AxiosResponse =>
      Object.hasOwn(response, "data") && Object.hasOwn(response, "status");

    // Check if the response is OK
    const responseOk = isAxiosResponse(response)
      ? response.status >= 200 && response.status < 300
      : response.ok;
    if (responseOk) {
      let contentType = "";
      if (isAxiosResponse(response)) {
        // Casting response as AxiosResponse for TypeScript
        const axiosResponse = response;
        contentType =
          axiosResponse.headers["content-type"] ||
          axiosResponse.headers["Content-Type"];
      } else {
        // Casting response as Response for TypeScript
        const fetchResponse = response;
        contentType = fetchResponse.headers.get("content-type") || "";
      }

      // Handle PDF content
      if (
        contentType &&
        contentType.toLowerCase().includes("application/pdf")
      ) {
        return isAxiosResponse(response)
          ? response.data
          : await response.blob();
      }

      let data;
      if (isAxiosResponse(response)) {
        text = JSON.stringify(response.data);
      } else {
        text = await response.text();
      }

      try {
        data = text && JSON.parse(text);
      } catch {
        data = text;
      }
      return data;
    } else {
      if (isAxiosResponse(response)) {
        text = JSON.stringify(response.data);
      } else if (!response.bodyUsed) {
        text = await response.text();
      }
      console.error("Response was not ok in handleResponse, response: ", text);
      const error = new Error(text);
      (error as CustomError).handled = true;
      throw error;
    }
  } catch (error) {
    if (!(error as CustomError).handled) {
      console.error("Exception in handleResponse: ", error);
    }
    throw error;
  }
}

export function processRequest(req: BodyRequest | BasicRequest) {
  const headers = {
    Accept: "application/json",
    ...req.headers,
  };
  const newHeaders = new Headers(headers);
  const request: RequestInit = {
    headers: newHeaders,
    credentials: "include",
    ...req.opt,
  };

  if ("body" in req) {
    const body = req.body;
    if (req.headers && req.headers["Content-Type"] === "multipart/form-data") {
      newHeaders.delete("Content-Type");
      request.headers = newHeaders;
      request.body = body as FormData;
    } else {
      newHeaders.append("Content-Type", "application/json");
      request.headers = newHeaders;
      request.body = JSON.stringify(body);
    }
  }

  return request;
}
