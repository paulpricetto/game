import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { SANITY_CONFIG } from '../../../../lib/config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateString = searchParams.get('date')

  if (!dateString) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || SANITY_CONFIG.projectId
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || SANITY_CONFIG.dataset
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || SANITY_CONFIG.apiVersion
  const token = process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset || !token) {
    return NextResponse.json({ error: 'Sanity credentials not configured for API route' }, { status: 500 })
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

  const puzzleFields = `
    date,
    groups[]{
      category,
      items[]{
        name,
        "image": image.asset->url,
        link
      }
    }
  `

  try {
    let puzzle = await client.fetch(`*[_type == "dailyPuzzle" && date == "${dateString}"][0]{${puzzleFields}}`)
    if (!puzzle) {
      puzzle = await client.fetch(`*[_type == "dailyPuzzle"] | order(date desc)[0]{${puzzleFields}}`)
    }
    if (puzzle) return NextResponse.json(puzzle)
    return NextResponse.json({ error: `No puzzle found for date ${dateString} or latest available` }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch puzzle from Sanity' }, { status: 500 })
  }
}


