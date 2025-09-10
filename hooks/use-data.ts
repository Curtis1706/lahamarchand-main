"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

// Hook pour récupérer les statistiques générales
export function useStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorks: 0,
    totalOrders: 0,
    totalSales: 0,
    totalRoyalties: 0,
    disciplines: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        
        // Récupérer toutes les données en parallèle
        const [usersRes, worksRes, ordersRes, disciplinesRes] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getWorks(),
          apiClient.getOrders(),
          apiClient.getDisciplines(),
        ])

        if (usersRes.error || worksRes.error || ordersRes.error || disciplinesRes.error) {
          setError("Erreur lors du chargement des données")
          return
        }

        // Calculer les statistiques
        const totalUsers = usersRes.data?.length || 0
        const totalWorks = worksRes.data?.length || 0
        const totalOrders = ordersRes.data?.length || 0
        const disciplines = disciplinesRes.data?.length || 0

        // Calculer le total des ventes
        const totalSales = worksRes.data?.reduce((sum: number, work: any) => {
          return sum + (work.sales?.reduce((saleSum: number, sale: any) => saleSum + sale.amount, 0) || 0)
        }, 0) || 0

        // Calculer le total des royalties
        const totalRoyalties = worksRes.data?.reduce((sum: number, work: any) => {
          return sum + (work.royalties?.reduce((royaltySum: number, royalty: any) => royaltySum + royalty.amount, 0) || 0)
        }, 0) || 0

        setStats({
          totalUsers,
          totalWorks,
          totalOrders,
          totalSales,
          totalRoyalties,
          disciplines,
        })
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// Hook pour récupérer les utilisateurs
export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const result = await apiClient.getUsers()
      
      if (result.error) {
        setError(result.error)
        return
      }

      setUsers(result.data || [])
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}

// Hook pour récupérer les œuvres
export function useWorks() {
  const [works, setWorks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorks = async () => {
    try {
      setLoading(true)
      const result = await apiClient.getWorks()
      
      if (result.error) {
        setError(result.error)
        return
      }

      setWorks(result.data || [])
    } catch (err) {
      setError("Erreur lors du chargement des œuvres")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  return { works, loading, error, refetch: fetchWorks }
}

// Hook pour récupérer les commandes
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const result = await apiClient.getOrders()
      
      if (result.error) {
        setError(result.error)
        return
      }

      setOrders(result.data || [])
    } catch (err) {
      setError("Erreur lors du chargement des commandes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { orders, loading, error, refetch: fetchOrders }
}

// Hook pour récupérer les commandes PDG
export function usePDGOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log("👑 Fetching PDG orders...")
      
      const response = await fetch("/api/pdg/orders", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ PDG orders loaded:", data)
        setOrders(data.orders || [])
        setError(null)
      } else {
        const errorData = await response.json()
        console.error("❌ PDG orders error:", errorData)
        setError(`Erreur API: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      console.error("❌ PDG orders fetch error:", err)
      setError(`Erreur de connexion: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { orders, loading, error, refetch: fetchOrders }
}




