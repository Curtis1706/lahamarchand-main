import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-clerk"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting current user...")
    const user = await requireRole([Role.REPRESENTANT])
    const userId = userId

    // Vérifier que l'utilisateur est un représentant
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      include: { partner: true }
    })

    if (!userDetails || userDetails.role !== "REPRESENTANT") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    console.log("✅ User found:", userDetails.name, userDetails.role)

    // Statistiques générales
    const totalOrders = await prisma.order.count({
      where: { userId: userId }
    })

    const pendingOrders = await prisma.order.count({
      where: { 
        userId: userId,
        status: "PENDING"
      }
    })

    const validatedOrders = await prisma.order.count({
      where: { 
        userId: userId,
        status: "VALIDATED"
      }
    })

    const deliveredOrders = await prisma.order.count({
      where: { 
        userId: userId,
        status: "DELIVERED"
      }
    })

    // Calculer le montant total des commandes
    const ordersWithItems = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            work: true
          }
        }
      }
    })

    const totalSales = ordersWithItems.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity)
      }, 0)
      return sum + orderTotal
    }, 0)

    // Commandes récentes
    const recentOrders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            work: {
              include: {
                discipline: true,
                author: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    })

    // Statistiques par mois (6 derniers mois)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyStats = await prisma.order.findMany({
      where: {
        userId: userId,
        createdAt: { gte: sixMonthsAgo }
      },
      include: {
        items: true
      }
    })

    // Grouper par mois
    const monthlyData = monthlyStats.reduce((acc, order) => {
      const month = order.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { orders: 0, sales: 0 }
      }
      acc[month].orders += 1
      acc[month].sales += order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return acc
    }, {} as Record<string, { orders: number; sales: number }>)

    // Convertir en format pour le graphique
    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" }),
      commandes: data.orders,
      ventes: Math.round(data.sales),
      commissions: Math.round(data.sales * 0.1) // 10% de commission pour le représentant
    }))

    // Top œuvres vendues
    const topWorks = await prisma.orderItem.groupBy({
      by: ["workId"],
      where: {
        order: {
          userId: userId,
          status: "VALIDATED"
        }
      },
      _sum: {
        quantity: true
      },
      _count: {
        orderId: true
      },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      },
      take: 5
    })

    const topWorksWithDetails = await Promise.all(
      topWorks.map(async (item) => {
        const work = await prisma.work.findUnique({
          where: { id: item.workId },
          include: {
            discipline: true,
            author: true
          }
        })
        return {
          ...item,
          work
        }
      })
    )

    const response = {
      summary: {
        totalOrders,
        pendingOrders,
        validatedOrders,
        deliveredOrders,
        totalSales: Math.round(totalSales),
        totalCommissions: Math.round(totalSales * 0.1), // 10% de commission
        averageOrderValue: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        status: order.status,
        total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: order.items.length,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          work: {
            id: item.work.id,
            title: item.work.title,
            discipline: item.work.discipline.name,
            author: item.work.author?.name || "Auteur inconnu"
          },
          quantity: item.quantity,
          price: item.price
        }))
      })),
      chartData,
      topWorks: topWorksWithDetails.map(item => ({
        work: item.work,
        totalSold: item._sum.quantity || 0,
        orderCount: item._count.orderId || 0,
        revenue: (item._sum.quantity || 0) * (item.work?.price || 0)
      }))
    }

    console.log("✅ Dashboard data prepared:", {
      totalOrders,
      totalSales: Math.round(totalSales),
      recentOrdersCount: recentOrders.length
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error("❌ Error fetching representant dashboard:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement du tableau de bord" },
      { status: 500 }
    )
  }
}

