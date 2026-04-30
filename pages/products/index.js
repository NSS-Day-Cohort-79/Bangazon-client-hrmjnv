import { useEffect, useState } from 'react'
import Filter from '../../components/filter'
import Layout from '../../components/layout'
import Navbar from '../../components/navbar'
import { ProductCard } from '../../components/product/card'
import { getCategories, getProducts } from '../../data/products'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("Loading products...")
  const [locations, setLocations] = useState([])
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([productData, categoryData]) => {
      if (productData) {

        const locationData = [...new Set(productData.map(product => product.location))]
        const locationObjects = locationData.map(location => ({
          id: location,
          name: location
        }))

        setProducts(productData)
        setIsLoading(false)
        setLocations(locationObjects)
      }

      if (categoryData) {
        setCategories(categoryData)
      }
    })
      .catch(err => {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`)
      })
  }, [])

  const searchProducts = (event) => {
    setHasActiveFilters(!!event)

    getProducts(event).then(productsData => {
      if (productsData) {
        setProducts(productsData)
      }
    })
  }

  const getMostRecentProductsByCategory = (categoryId) => {
    return products
      .filter(product => product.category?.id === categoryId)
      .sort((currentProduct, nextProduct) => {
        const currentDate = new Date(currentProduct.created_date)
        const nextDate = new Date(nextProduct.created_date)

        if (nextDate - currentDate !== 0) {
          return nextDate - currentDate
        }

        return nextProduct.id - currentProduct.id
      })
  }

  if (isLoading) return <p>{loadingMessage}</p>

  return (
    <>
      <Filter productCount={products.length} onSearch={searchProducts} locations={locations} />

      {
        hasActiveFilters ?
          <>
            <h1 className="title">Products matching filters</h1>
            <div className="columns is-multiline">
              {products.map(product => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </>
          :
          <>
            {
              categories.map(category => (
                <section key={category.id} className="mb-6">
                  <h1 className="title">{category.name}</h1>
                  <div className="columns is-multiline">
                    {
                      getMostRecentProductsByCategory(category.id).map(product => (
                        <ProductCard product={product} key={product.id} />
                      ))
                    }
                  </div>
                </section>
              ))
            }
          </>
      }
    </>
  )
}

Products.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}