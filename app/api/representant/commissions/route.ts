import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-clerk"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting current user...")
    const user = await requireRole([Role.REPRESENTANT])
    const userId = user.id

    if (!user || user.role !== "REPRESENTANT") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    console.log("✅ User found:", user.name, user.role)

    // Récupérer les commandes validées du représentant
    const validatedOrders = await prisma.order.findMany({
      where: { 
        userId: user.id,
        status: { in: ["VALIDATED", "PROCESSING", "SHIPPED", "DELIVERED"] }
      },
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
      orderBy: { createdAt: "desc" }
    })

    // Calculer les commissions (10% du montant des ventes)
    const commissionRate = 0.10
    const commissions = validatedOrders.map(order => {
      const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const commission = orderTotal * commissionRate
      
      return {
        id: order.id,
        orderDate: order.createdAt,
        orderTotal: Math.round(orderTotal),
        commission: Math.round(commission),
        status: order.status,
        itemCount: order.items.length,
        items: order.items.map(item => ({
          work: {
            title: item.work.title,
            author: item.work.author?.name || "Auteur inconnu",
            discipline: item.work.discipline.name
          },
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        }))
      }
    })

    // Statistiques des commissions
    const totalCommissions = commissions.reduce((sum, comm) => sum + comm.commission, 0)
    const paidCommissions = commissions.filter(c => c.status === "DELIVERED").reduce((sum, comm) => sum + comm.commission, 0)
    const pendingCommissions = totalCommissions - paidCommissions

    // Commissions par mois (6 derniers mois)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyCommissions = commissions
      .filter(c => c.orderDate >= sixMonthsAgo)
      .reduce((acc, comm) => {
        const month = comm.orderDate.toISOString().slice(0, 7) // YYYY-MM
        if (!acc[month]) {
          acc[month] = { commissions: 0, orders: 0 }
        }
        acc[month].commissions += comm.commission
        acc[month].orders += 1
        return acc
      }, {} as Record<string, { commissions: number; orders: number }>)

    const chartData = Object.entries(monthlyCommissions).map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" }),
      commissions: data.commissions,
      orders: data.orders
    }))

    const response = {
      summary: {
        totalCommissions: Math.round(totalCommissions),
        paidCommissions: Math.round(paidCommissions),
        pendingCommissions: Math.round(pendingCommissions),
        commissionRate: commissionRate * 100, // 10%
        totalOrders: commissions.length,
        averageCommission: commissions.length > 0 ? Math.round(totalCommissions / commissions.length) : 0
      },
      commissions: commissions.slice(0, 20), // Dernières 20 commissions
      chartData,
      recentCommissions: commissions.slice(0, 5) // 5 plus récentes
    }

    console.log("✅ Commissions data prepared:", {
      totalCommissions: Math.round(totalCommissions),
      paidCommissions: Math.round(paidCommissions),
      pendingCommissions: Math.round(pendingCommissions)
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error("❌ Error fetching commissions:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement des commissions" },
      { status: 500 }
    )
  }
}


