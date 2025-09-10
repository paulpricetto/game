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
  const token = process.env.SANITY_API_READ_TOKEN || undefined

  if (!projectId || !dataset) {
    return NextResponse.json({ error: 'Sanity project/dataset not configured' }, { status: 500 })
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: !token, token })

  const puzzleFields = `
    date,
    "groups": groups[]->{
      "category": title,
      "items": products[]->{
        name,
        "image": image.asset->url,
        link
      }
    }
  `

  try {
    const queryByDate = `*[_type == "dailyPuzzle" && date == $date][0]{${puzzleFields}}`
    const latestQuery = `*[_type == "dailyPuzzle"] | order(date desc)[0]{${puzzleFields}}`
    let puzzle = await client.fetch(queryByDate, { date: dateString })
    if (!puzzle) {
      puzzle = await client.fetch(latestQuery)
    }
    if (puzzle) return NextResponse.json(puzzle)
    return NextResponse.json({ error: `No puzzle found for date ${dateString} or latest available` }, { status: 404 })
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to fetch puzzle from Sanity', details: message }, { status: 500 })
  }
}


