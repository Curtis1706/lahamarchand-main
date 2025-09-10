import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-clerk"
import { prisma } from "@/lib/prisma"
import { Role, OrderStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    console.log("🔔 Starting partenaire notifications fetch...")
    const user = await requireRole([Role.PARTENAIRE])
    
    const userId = user.id

    // Récupérer les informations du partenaire
    const partner = await prisma.partner.findUnique({
      where: { userId: user.id }
    })

    if (!partner) {
      return NextResponse.json({ error: "Partenaire introuvable" }, { status: 404 })
    }

    console.log("✅ User found:", user.name, user.role)

    // Pour l'instant, on génère les notifications dynamiquement
    // TODO: Utiliser le modèle Notification quand il sera disponible
    const existingNotifications = []

    const orders = await prisma.order.findMany({
      where: { partnerId: partner.id },
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
      take: 20
    })

    const notifications = []
    let unreadCount = 0

    // Générer les notifications à partir des commandes
    orders.forEach(order => {
      // Notification de création de commande
      notifications.push({
        id: `order-created-${order.id}`,
        type: "ORDER_CREATED",
        title: "Nouvelle commande créée",
        message: `Votre commande #${order.id.slice(-8)} a été créée avec succès`,
        priority: "medium",
        read: false,
        createdAt: order.createdAt,
        data: {
          orderId: order.id,
          total: order.items.reduce((sum, item) => sum + item.amount, 0),
          itemCount: order.items.length
        }
      })

      // Notification de validation de commande
      if (order.status === OrderStatus.VALIDATED) {
        notifications.push({
          id: `order-validated-${order.id}`,
          type: "ORDER_VALIDATED",
          title: "Commande validée",
          message: `Votre commande #${order.id.slice(-8)} a été validée par le PDG`,
          priority: "high",
          read: false,
          createdAt: order.updatedAt,
          data: {
            orderId: order.id,
            total: order.items.reduce((sum, item) => sum + item.amount, 0),
            itemCount: order.items.length
          }
        })
      }

      // Notification de livraison
      if (order.status === OrderStatus.DELIVERED) {
        notifications.push({
          id: `order-delivered-${order.id}`,
          type: "ORDER_DELIVERED",
          title: "Commande livrée",
          message: `Votre commande #${order.id.slice(-8)} a été livrée`,
          priority: "high",
          read: false,
          createdAt: order.updatedAt,
          data: {
            orderId: order.id,
            total: order.items.reduce((sum, item) => sum + item.amount, 0),
            itemCount: order.items.length
          }
        })
      }
    })

    // Trier par date de création (plus récentes en premier)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Compter les notifications non lues
    unreadCount = notifications.filter(n => !n.read).length

    const summary = {
      total: notifications.length,
      unread: unreadCount,
      highPriority: notifications.filter(n => n.priority === "high").length
    }

    console.log("✅ Notifications prepared:", summary)

    return NextResponse.json({ notifications, summary })

  } catch (error) {
    console.error("❌ Error fetching partenaire notifications:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement des notifications" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    console.log("🔔 Marking partenaire notifications as read...")
    const user = await requireRole([Role.PARTENAIRE])
    
    const userId = user.id

    const body = await req.json()
    const { notificationIds } = body

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "notificationIds requis" }, { status: 400 })
    }

    // Pour l'instant, on simule la mise à jour
    // TODO: Utiliser le modèle Notification quand il sera disponible
    console.log("✅ Notifications marked as read:", notificationIds)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("❌ Error marking notifications as read:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des notifications" },
      { status: 500 }
    )
  }
}

