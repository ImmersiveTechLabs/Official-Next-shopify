import Link from 'next/dist/client/link'
import { useState, useEffect } from 'react' 
import Card from '../../components/ProductCard'
import { useRouter } from 'next/router'
import { useShopify } from '../../context/shopContext'





export default function App() {



    const router = useRouter()
    const { collection } = router.query
    const [ collectionName , setCollectionName ] = useState(collection)
    console.log("Collections: saad ", collection)
    const [ collections , setCollections ] = useState([])
    const [ collectionData , setCollectionData ] = useState([])
    const [ collectionId , setCollectionId ] = useState([])
    const [ collectionTitle , setCollectionTitle ] = useState([])
    const [ Products , setProducts ] = useState([])

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

        const Collection = async () => {
            const query = `
                {
                    collections(first: 100) {
                        edges {
                            node {
                                id
                                title
                                handle
                                description
                                image {
                                    originalSrc
                                    altText
                                }
                            }
                        }
                    }
                }
            `
            const data = await ShopifyData(query)
            console.log("Collection: ", data)
            setCollections(data.data.collections.edges)
            return data
        }

        const CollectionData = async () => {
            const query = `
                {
                    collectionByHandle(handle: "${collection}") {
                        id
                        title
                        handle
                        description
                        image {
                            originalSrc
                            altText
                        }
                    }
                }
            `
            const data = await ShopifyData(query)
            console.log("Collection Data: ", data)
            setCollectionData(data.data.collectionByHandle)
            setCollectionId(data.data.collectionByHandle.id)
            setCollectionTitle(data.data.collectionByHandle.title)  
            return data
        }

        const CollectionProducts = async () => {
            const query = `
                {
                    collectionByHandle(handle: "${collection}") {
                        products(first: 100) {
                            edges {
                                node {
                                    id
                                    title
                                    handle
                                    description
                                    images(first: 100) {
                                        edges {
                                            node {
                                                originalSrc
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
            console.log("Collection Products: ", data)
            setProducts(data.data.collectionByHandle.products.edges)
            return data
        }

        Collection()
        CollectionData()
        CollectionProducts()

    }
    , [collection])

    return (
       <>
             {
                Products.map((product)=>{
                    return(
                        <Card key={product.node.id} product={product.node} />
                    )
                })
             }
       </>
    )
}
