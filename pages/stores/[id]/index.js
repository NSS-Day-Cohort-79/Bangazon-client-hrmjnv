import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/layout'
import Navbar from '../../../components/navbar'
import { ProductCard } from '../../../components/product/card'
import Detail from '../../../components/store/detail'
import { useAppContext } from '../../../context/state'
import { getUserProfile } from '../../../data/auth'
import { deleteProduct } from '../../../data/products'
import { deleteStore, favoriteStore, getStoreById, unfavoriteStore } from '../../../data/stores'

export default function StoreDetail() {
  const { profile, setProfile } = useAppContext()
  const router = useRouter()
  const { id } = router.query
  const [store, setStore] = useState({})
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (id) {
      refresh()
    }
    if (parseInt(id) === profile.store?.id) {
      setIsOwner(true)
    }
  }, [id, profile])

  const refresh = () => getStoreById(id).then(storeData => {
    if (storeData) {
      setStore(storeData)
    }
  }).catch(() => {
    router.push('/stores')
  })

  const removeProduct = (productId) => {
    deleteProduct(productId).then(refresh)
  }

  const favorite = () => {
    favoriteStore(id).then(refresh)
  }

  const unfavorite = () => {
    unfavoriteStore(id).then(refresh)
  }

  const removeStore = () => {
    deleteStore(id).then(() => getUserProfile().then(profileData => {
      if (profileData) setProfile(profileData)
    })).then(() => router.push('/stores'))
  }

  return (
    <>
      <Detail store={store} isOwner={isOwner} favorite={favorite} unfavorite={unfavorite} deleteStore={removeStore} />
      <div className="columns is-multiline">
        {
          store.products?.map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          store.products?.length === 0 ?
            <p>There's no products yet</p>
            :
            <></>
        }
      </div>
    </>
  )
}

StoreDetail.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}
