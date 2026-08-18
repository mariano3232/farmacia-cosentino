import { toast } from "@/components/ui/toast";

export const CART_STORAGE_KEY = "farmacia-reserved-products";

export function getCartItems(){
  const localJson = localStorage.getItem(CART_STORAGE_KEY) || ""
  
  if (localJson){
    const items = JSON.parse(localJson)
    // console.log("localJson :",localJson)
    console.log("items :",items)
    if (!Array.isArray(items)){
      console.log("CLEAR")
      localStorage.clear()
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      return []
    }
    return items
  }
  
}

export function addProductToCart(product:any) {
    const storagedItems = getCartItems()
    const sameProduct = storagedItems?.find(e => e.id == product.id)
    // console.log("storagedItems :", storagedItems)

    let newProducts = storagedItems

    if (newProducts && sameProduct){
      const sameProductIndex = newProducts?.findIndex(e => e.id == product.id);
      newProducts[sameProductIndex].quantity += 1
    } else {
      newProducts = storagedItems? [{...product, quantity:1}, ...storagedItems] : [{...product, quantity:1}]
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newProducts));
    window.dispatchEvent(new Event('storage'))

    toast.add({
      title: "Producto añadido",
      description: "Entra al carrito para reservar",
      type:"success",
      actionProps: {
        children: "Ver carrito",
        onClick() {
          window.dispatchEvent(new Event("open-cart"));
        },
      },
    })
    // console.log("newProducts :",newProducts)
}

