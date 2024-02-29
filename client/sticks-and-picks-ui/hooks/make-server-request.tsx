/* eslint-disable no-console */
import "server-only";
import {
  BasicRequest,
  BasicRequestBodyFunction,
  BodyRequest,
  handleResponse,
  processRequest,
  RequestBodyFunction,
} from "@/utils/requests";

export type UseServerRequest = () => {
  get: BasicRequestBodyFunction;
  post: RequestBodyFunction;
  put: RequestBodyFunction;
  patch: RequestBodyFunction;
  del: BasicRequestBodyFunction;
  options: BasicRequestBodyFunction;
};

function processUrl(url: string) {
  if (url.startsWith("/api/")) {
    url = process.env.NEXT_PUBLIC_SERVICE_URL + url.replace(/.*\/api\//, "");
  }
  return url;
}

// async function attachAccessToken(url: string, requestOptions: RequestInit) {
//   const headers = new Headers(requestOptions.headers);
//   if (url.includes(process.env.NEXT_PUBLIC_SERVICE_URL as string)) {
//     const at_obj = await getAccessToken({
//       authorizationParams: {
//         audience: process.env.AUTH0_AUDIENCE,
//         scope: "openid profile email offline_access",
//         prompt: "none",
//       },
//     });
//     const at = at_obj.accessToken;
//     headers.set("Authorization", `Bearer ${at}`);
//   }
//   return headers;
// }

async function handleRequest(
  method: string,
  request: BasicRequest | BodyRequest
) {
  const processedRequest = processRequest(request);
  processedRequest.method = method;
  const url = processUrl(request.url);
  // processedRequest.headers = await attachAccessToken(url, processedRequest);
  return fetch(url, processedRequest)
    .then(handleResponse)
    .catch((error) => {
      if (!error.handled) {
        console.error(
          `Exception occurred in handleRequest for ${url}: `,
          error
        );
      }
      return Promise.reject(error);
    });
}

const makeServerRequest: UseServerRequest = () => ({
  get: async (request) => {
    return handleRequest("GET", request);
  },

  post: async (request) => {
    return handleRequest("POST", request);
  },

  put: async (request) => {
    return handleRequest("PUT", request);
  },

  patch: async (request) => {
    return handleRequest("PATCH", request);
  },

  del: async (request) => {
    return handleRequest("DELETE", request);
  },

  options: async (request) => {
    return handleRequest("OPTIONS", request);
  },
});

export default makeServerRequest;
