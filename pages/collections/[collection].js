import { useState, useEffect } from 'react' 
import Card from '../../components/ProductCard'
import { useRouter } from 'next/router'






export default function App() {

    const router = useRouter()
    const { collection } = router.query
     console.log("Collection: ", collection)
    
const [ products , setProducts ] = useState([])
const [description , setDescription] = useState('')


useEffect(()=>{
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN;
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

    const Products = async () => {
        const query = `
            {
                collectionByHandle(handle: "${collection}") {
                    id
                    handle
                    title
                    description
                    products(first: 100) {
                        edges {
                            node {
                                id
                                title
                                handle
                                description
                                images(first: 5) {
                                    edges {
                                        node {
                                            url
                                            altText
                                        }
                                    }
                                }
                                priceRange {
                                    minVariantPrice {
                                        amount
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `

        
        
        const data = await ShopifyData(query)
        setDescription(data.data?.collectionByHandle?.description)
        console.log("Products: ", data)
        setProducts(data.data?.collectionByHandle?.products.edges)
        return data
    }
    Products()
},[])




 



return (
   
    <div className="bg-white">
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 uppercase	">
        {collection}
      </h2>
        <p className=" font-extrabold mb-6">
      {description}
          
        </p>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {
          products.map(product => (
            <Card key={product.node.id} product={product} />
          ))
        }
      </div>
    </div>
  </div>
)
}
