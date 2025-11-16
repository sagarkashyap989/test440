export const dynamic = 'force-dynamic';




export async function POST(req) {

  const { searchParams } = new URL(req.url);
  const syllabus_id = searchParams.get('syllabus_id');

  const body = await req.json();
  const { auth0_id } = body;
  console.log(auth0_id, syllabus_id, 'u::ss:url')
  try { 
    // const response = await fetch('${process.env.API_URL}topics/:id', {
    const response = await fetch(`${process.env.API_URL}courses/getAllDet/${syllabus_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth0_id: auth0_id }),
    });

    if (!response.ok) {
      throw new Error(`External API returned status ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
