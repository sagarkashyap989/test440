import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const explanation_id = req.nextUrl.searchParams.get('explanation_id');
    const user_id = req.nextUrl.searchParams.get('user_id');

    if (!explanation_id) {
      return NextResponse.json({ error: 'explanation_id is required' }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    console.log({ explanation_id, user_id });

    const backendRes = await fetch(
      `${process.env.API_URL}annotations/${explanation_id}?user_id=${user_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch annotations from backend' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    console.log('Fetched annotations:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
    const { userId,
        explanationId,
        text,
        note,
        highlightType,
        paragraphIndex,
        startIndex,
        endIndex, } = await req.json(); 
    if (!userId && !explanationId) {
        return NextResponse.json({ error: 'Missing userId of explanation id' }, { status: 400 });
    }
    try {
        console.log('Fetching →', `${process.env.API_URL}annotations`);

        const response = await fetch(`${process.env.API_URL}annotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                explanationId,
                text,
                note,
                highlightType,
                paragraphIndex,
                startIndex,
                endIndex,
            })
        });


        if (!response.ok) throw new Error('Failed to fetch from backend');


        const data = await response.json();
        console.log(data)
        return NextResponse.json(data);
    } catch (err) {
        console.log('Backend fetch error:', err);

        return NextResponse.json(err);
    }
}

