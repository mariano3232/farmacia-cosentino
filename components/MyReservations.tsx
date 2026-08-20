"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function MyReservations() {
  const [reservations, setReservations] = useState<any>([])

  useEffect(() => {
    async function getReservations() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase.from("reservations").select(`
          id,
          total,
          status,
          reservation_items (
            unit_price,
            quantity,
            product:products ( name, image_url )
          )
        `)
        .eq("user_uid", user.id).neq("status","retirado")
      setReservations(data)
    }
    getReservations()
  }, [])
  
  return (
    <div>
      <h1>Mis reservas</h1>
      {reservations?.map((reservation:any, i:any) => {
        return(
          <div key={i}>
            <h1>Id : {reservation?.id}</h1>
            <p>Estado : {reservation?.status}</p>
            <p>$ {reservation?.total}</p>
            <div>
              {
                reservation.reservation_items?.map((item:any,i:any) => (
                  <div key={5000-i} className="bg-green-400 pl-5 border border-black flex gap-5 my-4">
                    <img src={item?.product?.image_url} alt="product_img" className="h-[100px]"/>
                    <div className="flex flex-col">
                      <p>{item?.product.name}</p>
                      <p>${item?.unit_price} X {item?.quantity}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}