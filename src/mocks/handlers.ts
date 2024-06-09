import { http, HttpResponse } from "msw"

export const handlers = [
  
  http.post('/products', async () => {
    

    return HttpResponse.json({
      message: "Product stored successfully"
    }, {
      status: 201
    })
  })
]