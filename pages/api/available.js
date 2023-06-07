export default async function send(req, res) {
  const {
    query: { id },
  } = req

  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN


 

 console.log("Domain ERT: ", domain)
 console.log("Token: ", storefrontAccessToken)










  async function ShopifyData(query) {
    const URL = `https://${domain}/api/2022-10/graphql.json`

    const options = {
      endpoint: URL,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query })
    }

    try {
      const data = await fetch(URL, options).then(response => {
        console.log("Response: ", response)
        return response.json()
      })

      return data
    } catch (error) {
      console.log("Error: ", error)
      throw new Error("Products not fetched")
    }
  }

  async function getProduct(handle) {
    const query = `
    {
      product(handle: "${handle}") {
        id
        variants(first: 25) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }`

    const response = await ShopifyData(query)

    const product = response.data?.product ? response.data.product : []
    console.log("Product: ", product)
    return product
  }

  const product = await getProduct(id)
  res.json(product)
}
