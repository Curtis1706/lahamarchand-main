import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting current user...")
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un PDG
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.role !== "PDG") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    console.log("✅ User found:", user.name, user.role)

    // Récupérer toutes les œuvres avec leurs détails
    const works = await prisma.work.findMany({
      include: {
        discipline: true,
        author: true,
        concepteur: true,
        stockMovements: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    // Calculer les statistiques
    const totalWorks = works.length
    const totalStock = works.reduce((sum, work) => sum + work.stock, 0)
    const totalValue = works.reduce((sum, work) => sum + (work.price * work.stock), 0)
    const lowStockWorks = works.filter(work => work.stock <= work.minStock)
    const outOfStockWorks = works.filter(work => work.stock === 0)

    // Statistiques par discipline
    const disciplineStats = works.reduce((acc, work) => {
      const discipline = work.discipline.name
      if (!acc[discipline]) {
        acc[discipline] = { count: 0, totalStock: 0, totalValue: 0, lowStock: 0 }
      }
      acc[discipline].count += 1
      acc[discipline].totalStock += work.stock
      acc[discipline].totalValue += work.price * work.stock
      if (work.stock <= work.minStock) {
        acc[discipline].lowStock += 1
      }
      return acc
    }, {} as Record<string, { count: number; totalStock: number; totalValue: number; lowStock: number }>)

    // Top œuvres par stock
    const topWorksByStock = works
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)

    // Mouvements récents
    const recentMovements = await prisma.stockMovement.findMany({
      include: {
        work: {
          include: {
            discipline: true,
            author: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    const response = {
      works: works.map(work => ({
        id: work.id,
        title: work.title,
        isbn: work.isbn,
        price: work.price,
        tva: work.tva,
        stock: work.stock,
        minStock: work.minStock,
        maxStock: work.maxStock,
        status: work.status,
        publishedAt: work.publishedAt,
        createdAt: work.createdAt,
        updatedAt: work.updatedAt,
        discipline: {
          id: work.discipline.id,
          name: work.discipline.name
        },
        author: work.author ? {
          id: work.author.id,
          name: work.author.name,
          email: work.author.email
        } : null,
        concepteur: work.concepteur ? {
          id: work.concepteur.id,
          name: work.concepteur.name,
          email: work.concepteur.email
        } : null,
        totalValue: work.price * work.stock,
        stockStatus: work.stock === 0 ? "out" : work.stock <= work.minStock ? "low" : "available",
        recentMovements: work.stockMovements.map(movement => ({
          id: movement.id,
          type: movement.type,
          quantity: movement.quantity,
          reason: movement.reason,
          createdAt: movement.createdAt
        }))
      })),
      summary: {
        totalWorks,
        totalStock,
        totalValue: Math.round(totalValue),
        lowStockCount: lowStockWorks.length,
        outOfStockCount: outOfStockWorks.length,
        averageStock: totalWorks > 0 ? Math.round(totalStock / totalWorks) : 0,
        averagePrice: totalWorks > 0 ? Math.round(works.reduce((sum, w) => sum + w.price, 0) / totalWorks) : 0
      },
      disciplineStats: Object.entries(disciplineStats).map(([discipline, stats]) => ({
        discipline,
        count: stats.count,
        totalStock: stats.totalStock,
        totalValue: Math.round(stats.totalValue),
        lowStock: stats.lowStock,
        percentage: totalWorks > 0 ? Math.round((stats.count / totalWorks) * 100) : 0
      })),
      topWorksByStock: topWorksByStock.map(work => ({
        id: work.id,
        title: work.title,
        stock: work.stock,
        minStock: work.minStock,
        price: work.price,
        discipline: work.discipline.name,
        author: work.author?.name || "Auteur inconnu",
        totalValue: work.price * work.stock,
        stockStatus: work.stock === 0 ? "out" : work.stock <= work.minStock ? "low" : "available"
      })),
      recentMovements: recentMovements.map(movement => ({
        id: movement.id,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason,
        reference: movement.reference,
        createdAt: movement.createdAt,
        work: {
          id: movement.work.id,
          title: movement.work.title,
          isbn: movement.work.isbn,
          discipline: movement.work.discipline.name,
          author: movement.work.author?.name || "Auteur inconnu"
        }
      }))
    }

    console.log("✅ Stock data prepared:", {
      totalWorks,
      totalStock,
      totalValue: Math.round(totalValue),
      lowStockCount: lowStockWorks.length
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error("❌ Error fetching stock data:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement des données de stock" },
      { status: 500 }
    )
  }
}
