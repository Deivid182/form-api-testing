import wretch from "wretch";
import type { Product } from "../types";
import { useState, useMemo } from "react";

export type ResponseApi = {
  data: {
    message: string
  };
  status: number;
};

export const useProducts = () => {
  const [response, setResponse] = useState<ResponseApi>({
    data: {
      message: "",
    },
    status: 0,
  });
  async function saveProduct (product: Product) {
    await wretch("/products")
      .post(product)
      .badRequest((err) => setResponse({ status: err.status, data: { message: "Bad Request" } }))
      .unauthorized((err) => setResponse({ status: err.status, data: { message: "Unauthorized" } }))
      .forbidden((err) => setResponse({ status: err.status, data: { message: "Forbidden"}}))
      .notFound((err) => setResponse({ status: err.status, data: { message: "Not found"}}))
      .timeout((err) => setResponse({ status: err.status, data: { message: "Timeout error"}}))
      .internalError((err) => setResponse({ status: err.status, data: { message: "Internar Server Error"}}))
      .fetchError((err) => setResponse({ status: err.status, data: { message: "FetchError"}}))
      .res((res) => setResponse({ status: res.status, data: { message: "Product stored successfully" } }));
  }

  const productResponse = useMemo(() => {
    return response.status !== 0
  }, [response.status])

  return {
    response,
    saveProduct,
    productResponse
  };
}

// export const saveProduct = async (product: Product) => {
// }